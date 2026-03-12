import { news } from "../../data/mockData";

const sentimentColor = { positive: "#00c896", negative: "#ff4d6d", neutral: "#f0a500" };
const sentimentBg = { positive: "rgba(0,200,150,0.1)", negative: "rgba(255,77,109,0.1)", neutral: "rgba(240,165,0,0.1)" };

export default function NewsSection({ limit }) {
  const displayed = limit ? news.slice(0, limit) : news;
  return (
    <div>
      {displayed.map((item, i) => (
        <div key={item.id} style={{
          padding: "16px 0",
          borderBottom: i < displayed.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
          cursor: "pointer",
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          <div style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "center" }}>
            <span style={{
              background: sentimentBg[item.sentiment],
              color: sentimentColor[item.sentiment],
              fontSize: 10, fontWeight: 700, padding: "2px 8px",
              borderRadius: 4, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: 0.5,
            }}>{item.category}</span>
            <span style={{ fontSize: 11, color: "#445", fontFamily: "'Space Grotesk', sans-serif" }}>{item.source} · {item.time}</span>
          </div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 14, color: "#dde", lineHeight: 1.4, marginBottom: 6 }}>
            {item.headline}
          </div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: "#556", lineHeight: 1.5 }}>
            {item.excerpt}
          </div>
        </div>
      ))}
    </div>
  );
}
