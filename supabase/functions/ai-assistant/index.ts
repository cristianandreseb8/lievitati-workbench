import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const LANG_NAMES: Record<string, string> = {
  es: "Spanish",
  en: "English",
  fr: "French",
  it: "Italian",
  de: "German",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    // Strip the function name prefix to get the sub-path
    const urlPath = url.pathname.replace(/^\/ai-assistant/, "") || "/";

    // Read body once — transcribe uses formData, everything else uses JSON
    const contentType = req.headers.get("content-type") || "";
    let body: Record<string, unknown> = {};
    let formData: FormData | null = null;

    if (contentType.includes("multipart/form-data")) {
      formData = await req.formData();
    } else if (req.method === "POST") {
      body = await req.json();
    }

    // Allow routing via body._path (for supabase.functions.invoke which can't set URL path)
    const path = (body._path as string) || urlPath;

    // ── CHAT ────────────────────────────────────────────────────────────────
    if (path === "/chat" && req.method === "POST") {
      const ANTHROPIC_KEY = Deno.env.get("ANTHROPIC_API_KEY");
      if (!ANTHROPIC_KEY) {
        return new Response(JSON.stringify({ error: "AI not configured" }), {
          status: 503,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { messages, recipeContext } = body as {
        messages: { role: string; content: string }[];
        recipeContext?: { title: string; subtitle: string; categoria: string; baking: string; ingredients: { name: string; base: number }[] };
      };

      const systemPrompt = recipeContext
        ? `Eres un asistente experto en panadería y pastelería artesanal, especializado en masas fermentadas, viennoiserie y técnicas avanzadas de bollería.
Estás ayudando con la receta: "${recipeContext.title}" - ${recipeContext.subtitle}.
Categoría: ${recipeContext.categoria}. Cocción: ${recipeContext.baking}.
Ingredientes principales: ${recipeContext.ingredients?.map(i => `${i.name} (${i.base}g)`).join(", ")}.
Responde de forma concisa, técnica y práctica. Si el usuario pregunta sobre ajustes, da valores concretos. Usa español por defecto.`
        : `Eres un asistente experto en panadería y pastelería artesanal, especializado en masas fermentadas, viennoiserie, brioche, panettone y técnicas avanzadas de bollería.
Responde de forma concisa, técnica y práctica. Usa español por defecto.`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": ANTHROPIC_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5",
          max_tokens: 1024,
          system: systemPrompt,
          messages: messages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        return new Response(JSON.stringify({ error: "AI error: " + err }), {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const data = await response.json();
      return new Response(JSON.stringify({ reply: data.content?.[0]?.text || "" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── TRANSLATE ────────────────────────────────────────────────────────────
    if (path === "/translate" && req.method === "POST") {
      const ANTHROPIC_KEY = Deno.env.get("ANTHROPIC_API_KEY");
      if (!ANTHROPIC_KEY) {
        return new Response(JSON.stringify({ error: "AI not configured" }), {
          status: 503,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { targetLang, fields } = body as {
        targetLang: string;
        fields: {
          steps: { id: string | number; label: string; time: string; detail: string }[];
          process: { id: string | number; label: string; time: string }[];
          baking: string;
          intTemp: string;
          conservation: string;
        };
      };

      const langName = LANG_NAMES[targetLang] || targetLang;

      const prompt = `You are a professional bakery recipe translator. Translate the following recipe content to ${langName}.

Rules:
- Translate ONLY the text label/detail/baking/intTemp/conservation values.
- Keep technical baking terms in their professional form used in ${langName}-speaking bakeries (e.g. "Autolyse", "Levain", "Pointage" may stay as-is if commonly used professionally).
- Keep time values (like "45 min", "12H", "2H · 4°C", "22-24 min") exactly as-is — do NOT change them.
- Keep numbers, temperatures, and measurements exactly as-is.
- Preserve the "id" and "time" fields unchanged on every step and process object.
- Return ONLY valid JSON matching the exact same structure. No explanation, no markdown.

Input:
${JSON.stringify(fields, null, 2)}`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": ANTHROPIC_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5",
          max_tokens: 2048,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        return new Response(JSON.stringify({ error: "AI error: " + err }), {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const data = await response.json();
      const text = (data.content?.[0]?.text || "{}") as string;
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return new Response(JSON.stringify({ error: "Invalid AI response: " + text.slice(0, 200) }), {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const translated = JSON.parse(jsonMatch[0]);
      return new Response(JSON.stringify({ translated }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── TRANSCRIBE ───────────────────────────────────────────────────────────
    if (path === "/transcribe" && req.method === "POST") {
      const OPENAI_KEY = Deno.env.get("OPENAI_API_KEY");
      if (!OPENAI_KEY) {
        return new Response(
          JSON.stringify({ error: "Speech-to-text not configured. Add OPENAI_API_KEY to secrets." }),
          { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const audioFile = formData?.get("audio") as File | null;
      if (!audioFile) {
        return new Response(JSON.stringify({ error: "No audio file" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const fd = new FormData();
      fd.append("file", audioFile, "audio.webm");
      fd.append("model", "whisper-1");
      fd.append("language", "es");

      const resp = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: { Authorization: `Bearer ${OPENAI_KEY}` },
        body: fd,
      });

      if (!resp.ok) {
        const err = await resp.text();
        return new Response(JSON.stringify({ error: "Transcription error: " + err }), {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const result = await resp.json();
      return new Response(JSON.stringify({ text: result.text }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Not found", path }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
