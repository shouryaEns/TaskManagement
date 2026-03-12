import { useState } from "react";
import { news } from "../data/mockData";

const categories = ["All", "Macro", "Earnings", "Corporate", "FII/DII", "Regulation"];
const sentimentColor = { positive: "#00c896", negative: "#ff4d6d", neutral: "#f0a500" };

export default function News() {
  const [cat, setCat] = useState("All");

  const filtered = cat === "All" ? news : news.filter(n => n.category === cat);

  return (
    <div style={{ padding: "28px 0" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Orbitron', monospace", fontSize: 24, fontWeight: 900, color: "#fff", marginBottom: 4 }}>Market News</h1>
        <p style={{ color: "#556", fontFamily: "'Space Grotesk', sans-serif", fontSize: 13 }}>Latest business & financial news</p>
      </div>

      {/* Category filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {categories.map(c => (
          <button key={c} onClick={() => setCat(c)} style={{
            background: cat === c ? "rgba(0,200,150,0.15)" : "rgba(255,255,255,0.03)",
            border: cat === c ? "1px solid rgba(0,200,150,0.4)" : "1px solid rgba(255,255,255,0.08)",
            color: cat === c ? "#00c896" : "#778",
            padding: "7px 16px", borderRadius: 20, cursor: "pointer",
            fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, fontWeight: 600, transition: "all 0.2s",
          }}>{c}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {filtered.map(item => (
          <div key={item.id} style={{
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 14, padding: 20, cursor: "pointer", transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,200,150,0.3)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <span style={{
                background: `${sentimentColor[item.sentiment]}18`,
                color: sentimentColor[item.sentiment],
                fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 4,
                fontFamily: "'Space Grotesk', sans-serif", letterSpacing: 0.5,
              }}>{item.category}</span>
              <span style={{ fontSize: 11, color: "#445", fontFamily: "'Space Grotesk', sans-serif" }}>{item.time}</span>
            </div>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 14, color: "#dde", lineHeight: 1.45, marginBottom: 8 }}>
              {item.headline}
            </h3>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: "#556", lineHeight: 1.55, marginBottom: 12 }}>
              {item.excerpt}
            </p>
            <div style={{ fontSize: 11, color: "#445", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>
              📰 {item.source}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
