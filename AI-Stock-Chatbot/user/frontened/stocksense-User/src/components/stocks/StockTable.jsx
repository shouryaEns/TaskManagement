export default function StockTable({ title, stocks, onSelect, accentColor = "#00c896", icon = "📊" }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 16, overflow: "hidden",
    }}>
      <div style={{
        padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <span>{icon}</span>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 14, color: "#dde", letterSpacing: 0.5 }}>{title}</span>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "rgba(255,255,255,0.03)" }}>
            {["Symbol", "Price", "Change", "Volume"].map(h => (
              <th key={h} style={{ padding: "8px 16px", textAlign: h === "Symbol" ? "left" : "right", fontSize: 11, color: "#556", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, letterSpacing: 0.8 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stocks.map((s, i) => (
            <tr key={s.id} onClick={() => onSelect && onSelect(s)}
              style={{ cursor: "pointer", borderTop: "1px solid rgba(255,255,255,0.04)", transition: "background 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(0,200,150,0.05)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <td style={{ padding: "10px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 20 }}>{s.logo}</span>
                  <div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 13, color: "#eee" }}>{s.symbol}</div>
                    <div style={{ fontSize: 11, color: "#556" }}>{s.sector}</div>
                  </div>
                </div>
              </td>
              <td style={{ padding: "10px 16px", textAlign: "right", fontFamily: "'Orbitron', monospace", fontSize: 13, fontWeight: 600, color: "#ddd" }}>
                ₹{s.price.toLocaleString('en-IN')}
              </td>
              <td style={{ padding: "10px 16px", textAlign: "right" }}>
                <span style={{
                  background: s.pct >= 0 ? "rgba(0,200,150,0.12)" : "rgba(255,77,109,0.12)",
                  color: s.pct >= 0 ? "#00c896" : "#ff4d6d",
                  padding: "3px 8px", borderRadius: 6,
                  fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, fontWeight: 700,
                }}>
                  {s.pct >= 0 ? "+" : ""}{s.pct}%
                </span>
              </td>
              <td style={{ padding: "10px 16px", textAlign: "right", fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: "#667" }}>{s.volume}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
