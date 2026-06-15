import { useState, useRef, useEffect } from "react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const A = "#D4732A", BD = "#EDE6DC", BG = "#F7F3EE", DK = "#2C2420";
const MU = "#9E8E80", GR = "#4A8C60";

const SUGGESTIONS = [
  "¿Cómo ajustar la hidratación?",
  "¿Por qué mi miga está muy densa?",
  "¿Cómo mejorar el alveolado?",
  "Tiempo de fermentación óptimo",
  "¿Puedo sustituir el levain?",
];

export default function AiAssistant({ recipe, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: recipe
        ? `Hola! Estoy aquí para ayudarte con "${recipe.title}". Puedo responder preguntas sobre técnica, ingredientes, fermentación o cualquier aspecto de la receta.`
        : "Hola! Soy tu asistente de panadería y pastelería. Puedo ayudarte con técnicas, fermentación, ingredientes, y más.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text) {
    if (!text.trim() || loading) return;
    const userMsg = { role: "user", content: text.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/ai-assistant/chat`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ANON_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: next.map(m => ({ role: m.role, content: m.content })),
          recipeContext: recipe
            ? {
                title: recipe.title,
                subtitle: recipe.subtitle,
                categoria: recipe.categoria,
                baking: recipe.baking,
                ingredients: recipe.ingredients?.map(i => ({ name: i.name, base: i.base })),
              }
            : null,
        }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages(m => [...m, { role: "assistant", content: data.reply }]);
      } else {
        setMessages(m => [...m, { role: "assistant", content: "Lo siento, no pude procesar tu pregunta. " + (data.error || "") }]);
      }
    } catch {
      setMessages(m => [...m, { role: "assistant", content: "Error de conexión. Verifica tu conexión a internet." }]);
    }
    setLoading(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(44,36,32,0.5)", zIndex: 500, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={onClose}>
      <div onClick={e => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: "16px 16px 0 0", width: "100%", maxWidth: "640px", height: "80vh", display: "flex", flexDirection: "column", boxShadow: "0 -4px 32px rgba(0,0,0,0.18)" }}>

        {/* Header */}
        <div style={{ padding: "14px 20px 12px", borderBottom: "1px solid " + BD, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "linear-gradient(135deg,#D4732A,#B05818)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>🍞</div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: "700", color: DK }}>Asistente de Panadería</div>
              <div style={{ fontSize: "10px", color: MU }}>{recipe ? `Receta: ${recipe.title}` : "Asistente global"}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ width: "30px", height: "30px", borderRadius: "50%", background: BG, border: "1px solid " + BD, cursor: "pointer", fontSize: "14px", color: MU, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
          {messages.map((m, i) => (
            <div key={i} style={{ marginBottom: "12px", display: "flex", flexDirection: m.role === "user" ? "row-reverse" : "row", gap: "8px", alignItems: "flex-end" }}>
              {m.role === "assistant" && (
                <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "linear-gradient(135deg,#D4732A,#B05818)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", flexShrink: 0 }}>🍞</div>
              )}
              <div style={{
                maxWidth: "82%",
                padding: "10px 14px",
                borderRadius: m.role === "user" ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                background: m.role === "user" ? A : BG,
                color: m.role === "user" ? "#fff" : DK,
                fontSize: "13px",
                lineHeight: "1.55",
                whiteSpace: "pre-wrap",
                border: m.role === "assistant" ? "1px solid " + BD : "none",
              }}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", gap: "8px", alignItems: "flex-end", marginBottom: "12px" }}>
              <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "linear-gradient(135deg,#D4732A,#B05818)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>🍞</div>
              <div style={{ padding: "10px 16px", background: BG, border: "1px solid " + BD, borderRadius: "14px 14px 14px 2px", display: "flex", gap: "4px", alignItems: "center" }}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", background: MU, display: "inline-block", animation: `bounce 1.2s ${i * 0.2}s ease-in-out infinite` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div style={{ padding: "0 16px 10px", display: "flex", gap: "6px", flexWrap: "wrap", flexShrink: 0 }}>
            {SUGGESTIONS.map(s => (
              <button key={s} onClick={() => sendMessage(s)}
                style={{ padding: "5px 11px", background: BG, border: "1px solid " + BD, borderRadius: "20px", fontSize: "11px", color: MU, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} style={{ padding: "10px 16px 16px", borderTop: "1px solid " + BD, display: "flex", gap: "8px", flexShrink: 0 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Pregunta sobre técnica, ingredientes..."
            style={{ flex: 1, border: "1px solid " + BD, borderRadius: "10px", padding: "10px 14px", fontSize: "13px", color: DK, fontFamily: "inherit", outline: "none", background: BG }}
          />
          <button type="submit" disabled={!input.trim() || loading}
            style={{ padding: "10px 16px", borderRadius: "10px", background: input.trim() && !loading ? A : "#E0D8D0", color: input.trim() && !loading ? "#fff" : MU, border: "none", fontSize: "16px", cursor: input.trim() && !loading ? "pointer" : "not-allowed", transition: "background 0.15s", flexShrink: 0 }}>
            ↑
          </button>
        </form>

        <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}`}</style>
      </div>
    </div>
  );
}
