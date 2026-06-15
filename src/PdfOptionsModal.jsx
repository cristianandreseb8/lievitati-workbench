import { useState } from "react";

const A = "#D4732A", BD = "#EDE6DC", BG = "#F7F3EE", DK = "#2C2420", MU = "#9E8E80";

const SECTION_KEYS = [
  { key: "header",      locked: true },
  { key: "score" },
  { key: "indicators" },
  { key: "scaleBanner" },
  { key: "ingredients" },
  { key: "method" },
  { key: "process" },
  { key: "notes" },
];

export default function PdfOptionsModal({ mode, recipeName, t, onConfirm, onCancel }) {
  const [sections, setSections] = useState(() =>
    Object.fromEntries(SECTION_KEYS.map(s => [s.key, true]))
  );

  const sec = t?.pdfSec || {};

  const SECTIONS = SECTION_KEYS.map(s => ({
    ...s,
    label: sec[s.key] || s.key,
  }));

  function toggle(key) {
    if (SECTION_KEYS.find(s => s.key === key)?.locked) return;
    setSections(s => ({ ...s, [key]: !s[key] }));
  }

  const modeLabel =
    mode === "recipe" ? `${t?.pdfThis || "Esta receta"} · ${recipeName}` :
    mode === "all"    ? (t?.pdfAll || "Todas las recetas") :
                        (t?.pdfComp || "Comparativa");

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(44,36,32,0.55)", zIndex: 600, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
      onClick={onCancel}>
      <div onClick={e => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: "14px", width: "100%", maxWidth: "380px", boxShadow: "0 8px 40px rgba(0,0,0,0.18)", overflow: "hidden" }}>

        <div style={{ padding: "18px 20px 14px", borderBottom: "1px solid " + BD }}>
          <div style={{ fontSize: "15px", fontWeight: "700", color: DK }}>{t?.pdfOptsTitle || "Opciones de PDF"}</div>
          <div style={{ fontSize: "11px", color: MU, marginTop: "2px" }}>{modeLabel}</div>
        </div>

        <div style={{ padding: "14px 20px" }}>
          <div style={{ fontSize: "11px", fontWeight: "700", color: MU, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>
            {t?.pdfSectionsLabel || "Secciones a incluir"}
          </div>
          {SECTIONS.map(s => (
            <label key={s.key}
              style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 0", borderBottom: "1px solid " + BD + "88", cursor: s.locked ? "default" : "pointer" }}>
              <div onClick={() => toggle(s.key)}
                style={{ width: "18px", height: "18px", borderRadius: "4px", border: "2px solid " + (sections[s.key] ? A : BD), background: sections[s.key] ? A : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
                {sections[s.key] && <span style={{ color: "#fff", fontSize: "11px", fontWeight: "700", lineHeight: 1 }}>✓</span>}
              </div>
              <span style={{ fontSize: "13px", color: s.locked ? MU : DK, flex: 1 }}>{s.label}</span>
              {s.locked && <span style={{ fontSize: "9px", color: MU, background: BG, border: "1px solid " + BD, borderRadius: "4px", padding: "1px 5px" }}>{t?.always || "siempre"}</span>}
            </label>
          ))}
        </div>

        <div style={{ padding: "12px 20px 18px", display: "flex", gap: "8px", justifyContent: "flex-end" }}>
          <button onClick={onCancel}
            style={{ padding: "8px 18px", background: "none", border: "1px solid " + BD, borderRadius: "7px", fontSize: "13px", cursor: "pointer", color: MU, fontFamily: "inherit" }}>
            {t?.cancel || "Cancelar"}
          </button>
          <button onClick={() => onConfirm(sections)}
            style={{ padding: "8px 20px", background: A, color: "#fff", border: "none", borderRadius: "7px", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" }}>
            {t?.generatePdf || "Generar PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}
