import { stocks } from "../data/mockData";

export default function SearchResults({ query, onSelectStock }) {
  const results = stocks.filter(s =>
    s.symbol.toLowerCase().includes(query.toLowerCase()) ||
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.sector.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ padding: "28px 0" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Orbitron', monospace", fontSize: 24, fontWeight: 900, color: "#fff", marginBottom: 4 }}>
          Search: "{query}"
        </h1>
        <p style={{ color: "#556", fontFamily: "'Space Grotesk', sans-serif", fontSize: 13 }}>
          {results.length} result{results.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {results.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, color: "#667" }}>No stocks found for "{query}"</div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: "#445", marginTop: 8 }}>Try searching by symbol (e.g. RELIANCE) or sector</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {results.map(s => (
            <div key={s.id} onClick={() => onSelectStock(s)} style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 14, padding: 20, cursor: "pointer", transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,200,150,0.4)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
            >
              <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: 36 }}>{s.logo}</span>
                <div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 15, color: "#eee" }}>{s.symbol}</div>
                  <div style={{ fontSize: 12, color: "#556" }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: "#445", marginTop: 2 }}>{s.sector}</div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 18, fontWeight: 700, color: "#fff" }}>
                  ₹{s.price.toLocaleString('en-IN')}
                </div>
                <span style={{
                  background: s.pct >= 0 ? "rgba(0,200,150,0.12)" : "rgba(255,77,109,0.12)",
                  color: s.pct >= 0 ? "#00c896" : "#ff4d6d",
                  padding: "4px 10px", borderRadius: 8, fontSize: 13, fontWeight: 700,
                  fontFamily: "'Space Grotesk', sans-serif",
                }}>{s.pct >= 0 ? "+" : ""}{s.pct}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
