import { useState, useEffect, useRef } from "react";
import supabase from "./supabase.js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const A = "#D4732A", BD = "#EDE6DC", BG = "#F7F3EE", DK = "#2C2420";
const MU = "#9E8E80", GR = "#4A8C60";

function getSessionKey() {
  let k = localStorage.getItem("lievitati_session");
  if (!k) { k = "s_" + Math.random().toString(36).slice(2); localStorage.setItem("lievitati_session", k); }
  return k;
}

export default function NotesPanel({ recipeIdx, recipeTitle, onClose }) {
  const [notes, setNotes] = useState([]);
  const [newText, setNewText] = useState("");
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);
  const sessionKey = getSessionKey();
  const isGlobal = recipeIdx == null;

  useEffect(() => { loadNotes(); }, [recipeIdx]); // eslint-disable-line

  async function loadNotes() {
    setLoading(true);
    let q = supabase.from("recipe_notes").select("*").eq("session_key", sessionKey).order("created_at", { ascending: false });
    if (isGlobal) q = q.is("recipe_idx", null);
    else q = q.eq("recipe_idx", recipeIdx);
    const { data } = await q;
    setNotes(data || []);
    setLoading(false);
  }

  async function saveNote(text, transcription) {
    setSaving(true);
    await supabase.from("recipe_notes").insert({
      session_key: sessionKey,
      recipe_idx: isGlobal ? null : recipeIdx,
      recipe_title: isGlobal ? null : recipeTitle,
      content: text,
      transcription: transcription || null,
    });
    setSaving(false);
    loadNotes();
  }

  async function deleteNote(id) {
    await supabase.from("recipe_notes").delete().eq("id", id);
    setNotes(n => n.filter(x => x.id !== id));
  }

  async function updateNote(id, content) {
    await supabase.from("recipe_notes").update({ content, updated_at: new Date().toISOString() }).eq("id", id);
    setNotes(n => n.map(x => x.id === id ? { ...x, content } : x));
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });
      chunksRef.current = [];
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => { stream.getTracks().forEach(t => t.stop()); handleAudioStop(); };
      mr.start();
      mediaRef.current = mr;
      setRecording(true);
    } catch {
      alert("No se pudo acceder al micrófono.");
    }
  }

  function stopRecording() {
    if (mediaRef.current) { mediaRef.current.stop(); mediaRef.current = null; }
    setRecording(false);
  }

  async function handleAudioStop() {
    setTranscribing(true);
    const blob = new Blob(chunksRef.current, { type: "audio/webm" });
    try {
      const fd = new FormData();
      fd.append("audio", blob, "audio.webm");
      const res = await fetch(`${SUPABASE_URL}/functions/v1/ai-assistant/transcribe`, {
        method: "POST",
        headers: { Authorization: `Bearer ${ANON_KEY}` },
        body: fd,
      });
      const data = await res.json();
      if (data.text) {
        setNewText(t => t ? t + " " + data.text : data.text);
      } else {
        alert("No se pudo transcribir: " + (data.error || "Error desconocido"));
      }
    } catch {
      alert("Error al transcribir el audio.");
    }
    setTranscribing(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!newText.trim()) return;
    await saveNote(newText.trim(), null);
    setNewText("");
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(44,36,32,0.5)", zIndex: 500, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={onClose}>
      <div onClick={e => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: "16px 16px 0 0", width: "100%", maxWidth: "640px", maxHeight: "85vh", display: "flex", flexDirection: "column", boxShadow: "0 -4px 32px rgba(0,0,0,0.18)" }}>

        {/* Header */}
        <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid " + BD, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: "15px", fontWeight: "700", color: DK }}>
              {isGlobal ? "Notas globales" : `Notas · ${recipeTitle}`}
            </div>
            <div style={{ fontSize: "11px", color: MU, marginTop: "1px" }}>
              {isGlobal ? "Notas generales del taller" : "Notas específicas de esta receta"}
            </div>
          </div>
          <button onClick={onClose} style={{ width: "30px", height: "30px", borderRadius: "50%", background: BG, border: "1px solid " + BD, cursor: "pointer", fontSize: "14px", color: MU, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>

        {/* Note input */}
        <form onSubmit={handleSubmit} style={{ padding: "12px 16px", borderBottom: "1px solid " + BD, flexShrink: 0 }}>
          <textarea
            value={newText}
            onChange={e => setNewText(e.target.value)}
            placeholder="Escribe una nota..."
            rows={3}
            style={{ width: "100%", border: "1px solid " + BD, borderRadius: "8px", padding: "10px 12px", fontSize: "13px", color: DK, fontFamily: "inherit", resize: "none", outline: "none", background: BG, boxSizing: "border-box" }}
          />
          <div style={{ display: "flex", gap: "8px", marginTop: "8px", alignItems: "center" }}>
            <button type="button"
              onClick={recording ? stopRecording : startRecording}
              disabled={transcribing}
              style={{ padding: "7px 14px", borderRadius: "7px", border: "1px solid " + (recording ? "#CC4A2A" : BD), background: recording ? "#FFF0EB" : BG, color: recording ? "#CC4A2A" : MU, fontSize: "12px", fontWeight: "600", cursor: transcribing ? "not-allowed" : "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "5px", flexShrink: 0 }}>
              {transcribing ? <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "50%", border: "2px solid " + MU, borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} /> : recording ? <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#CC4A2A", animation: "pulse 1s infinite" }} /> : "🎙"}
              {transcribing ? "Transcribiendo..." : recording ? "Detener" : "Grabar"}
            </button>
            <div style={{ flex: 1 }} />
            <button type="submit" disabled={!newText.trim() || saving}
              style={{ padding: "7px 18px", borderRadius: "7px", background: newText.trim() ? A : "#E0D8D0", color: newText.trim() ? "#fff" : MU, border: "none", fontSize: "12px", fontWeight: "700", cursor: newText.trim() ? "pointer" : "not-allowed", fontFamily: "inherit" }}>
              {saving ? "Guardando..." : "Guardar nota"}
            </button>
          </div>
        </form>

        {/* Notes list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>
          {loading ? (
            <div style={{ textAlign: "center", color: MU, fontSize: "12px", padding: "24px" }}>Cargando notas...</div>
          ) : notes.length === 0 ? (
            <div style={{ textAlign: "center", color: MU, fontSize: "12px", padding: "24px", fontStyle: "italic" }}>Sin notas todavía. Agrega una arriba o graba un audio.</div>
          ) : notes.map(note => (
            <NoteCard key={note.id} note={note} onDelete={deleteNote} onUpdate={updateNote} />
          ))}
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </div>
  );
}

function NoteCard({ note, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(note.content);

  function save() {
    onUpdate(note.id, text);
    setEditing(false);
  }

  const date = new Date(note.created_at).toLocaleDateString("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

  return (
    <div style={{ background: BG, border: "1px solid " + BD, borderRadius: "10px", padding: "12px 14px", marginBottom: "8px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
        <span style={{ fontSize: "10px", color: MU }}>{date}</span>
        <div style={{ display: "flex", gap: "4px" }}>
          {!editing && <button onClick={() => setEditing(true)} style={{ background: "none", border: "none", color: MU, fontSize: "11px", cursor: "pointer", padding: "0 4px" }}>✎</button>}
          <button onClick={() => onDelete(note.id)} style={{ background: "none", border: "none", color: "#CC4A2A", fontSize: "11px", cursor: "pointer", padding: "0 4px" }}>✕</button>
        </div>
      </div>
      {editing ? (
        <div>
          <textarea value={text} onChange={e => setText(e.target.value)} rows={3}
            style={{ width: "100%", border: "1px solid " + A, borderRadius: "6px", padding: "7px 9px", fontSize: "13px", fontFamily: "inherit", resize: "none", outline: "none", color: DK, background: "#fff", boxSizing: "border-box" }} />
          <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
            <button onClick={save} style={{ padding: "4px 12px", background: GR, color: "#fff", border: "none", borderRadius: "5px", fontSize: "11px", fontWeight: "700", cursor: "pointer" }}>Guardar</button>
            <button onClick={() => { setText(note.content); setEditing(false); }} style={{ padding: "4px 10px", background: "none", border: "1px solid " + BD, borderRadius: "5px", fontSize: "11px", cursor: "pointer", color: MU }}>Cancelar</button>
          </div>
        </div>
      ) : (
        <p style={{ fontSize: "13px", color: DK, margin: 0, lineHeight: "1.55", whiteSpace: "pre-wrap" }}>{note.content}</p>
      )}
      {note.transcription && (
        <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px dashed " + BD, fontSize: "10px", color: MU, fontStyle: "italic" }}>
          Transcripción original: {note.transcription}
        </div>
      )}
    </div>
  );
}
