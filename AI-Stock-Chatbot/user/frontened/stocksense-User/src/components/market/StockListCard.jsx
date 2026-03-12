const ROW_HEIGHT = 45;
const VISIBLE_ROWS = 5;

export default function StockListCard({ title, icon, accentColor, stocks, loading, onSelect }) {
  const listHeight = ROW_HEIGHT * VISIBLE_ROWS;

  return (
    <div style={{
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 16, padding: "20px 24px",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>{icon}</span>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
            fontSize: 14, color: "#aab", letterSpacing: 0.5,
          }}>
            {title}
          </span>
          {!loading && stocks.length > 0 && (
            <span style={{
              fontSize: 10, color: accentColor, fontFamily: "monospace",
              background: `${accentColor}15`,
              border: `1px solid ${accentColor}30`,
              borderRadius: 4, padding: "1px 6px",
            }}>
              {stocks.length}
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{
            width: 6, height: 6, borderRadius: "50%",
            background: accentColor,
            boxShadow: `0 0 8px ${accentColor}`,
          }} />
          <span style={{ fontSize: 10, color: "#445", fontFamily: "monospace", letterSpacing: 1 }}>LIVE</span>
        </div>
      </div>

      {/* Column headers */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 80px 70px 60px",
        padding: "0 4px 8px",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        marginBottom: 4,
      }}>
        {["Stock", "Price", "Chg%", "Vol"].map((h, i) => (
          <span key={h} style={{
            fontSize: 10, color: "#445", fontFamily: "monospace",
            letterSpacing: 0.8, textAlign: i > 0 ? "right" : "left",
          }}>{h}</span>
        ))}
      </div>

      {/* Scrollable rows */}
      <div style={{
        height: listHeight,
        overflowY: stocks.length > VISIBLE_ROWS ? "auto" : "hidden",
        overflowX: "hidden",
        scrollbarWidth: "thin",
        scrollbarColor: `${accentColor}40 transparent`,
      }}>
        {loading
          ? Array.from({ length: VISIBLE_ROWS }).map((_, i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "1fr 80px 70px 60px",
                height: ROW_HEIGHT, alignItems: "center",
                padding: "0 4px", borderBottom: "1px solid rgba(255,255,255,0.03)",
              }}>
                {[130, 58, 48, 40].map((w, j) => (
                  <div key={j} style={{
                    height: 9, borderRadius: 4,
                    background: "rgba(255,255,255,0.05)",
                    width: w, marginLeft: j === 0 ? 0 : "auto",
                    animation: `shimmer 1.5s ${i * 0.1}s infinite`,
                  }} />
                ))}
              </div>
            ))
          : stocks.map((stock, i) => {
              const isUp = stock.perchg >= 0;
              const changeColor = isUp ? "#00c896" : "#ff4d6d";

              // Normalise field names — BSE response uses Close_price / low_Price
              // NSE uses close_price / low_price  — handle both
              const closePrice = stock.Close_price ?? stock.close_price;
              const volTraded  = stock.vol_traded;

              return (
                <div
                  key={stock.sc_code || i}
                  onClick={() => onSelect?.(stock)}
                  style={{
                    display: "grid", gridTemplateColumns: "1fr 80px 70px 60px",
                    height: ROW_HEIGHT, alignItems: "center",
                    padding: "0 4px",
                    borderBottom: "1px solid rgba(255,255,255,0.03)",
                    cursor: "pointer", transition: "background 0.15s",
                    borderRadius: 6,
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = `${accentColor}0d`}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  {/* Symbol + name */}
                  <div>
                    <div style={{
                      fontSize: 13, fontWeight: 700, color: "#dde",
                      fontFamily: "monospace", letterSpacing: 0.4,
                    }}>
                      {stock.symbol}
                    </div>
                    <div style={{
                      fontSize: 10, color: "#556",
                      fontFamily: "'Space Grotesk', sans-serif",
                      whiteSpace: "nowrap", overflow: "hidden",
                      textOverflow: "ellipsis", maxWidth: 120,
                    }}>
                      {stock.co_name}
                    </div>
                  </div>

                  {/* Close price */}
                  <div style={{
                    textAlign: "right", fontSize: 13, fontWeight: 600,
                    color: "#ccd", fontFamily: "monospace",
                  }}>
                    ₹{Number(closePrice).toLocaleString("en-IN", {
                      minimumFractionDigits: 2, maximumFractionDigits: 2,
                    })}
                  </div>

                  {/* % change */}
                  <div style={{
                    textAlign: "right", fontSize: 12, fontWeight: 600,
                    color: changeColor, fontFamily: "monospace",
                  }}>
                    {isUp ? "▲" : "▼"} {Math.abs(stock.perchg).toFixed(2)}%
                  </div>

                  {/* Volume — show in K/L/Cr shorthand */}
                  <div style={{
                    textAlign: "right", fontSize: 11,
                    color: "#667", fontFamily: "monospace",
                  }}>
                    {volTraded >= 1e7
                      ? `${(volTraded / 1e7).toFixed(1)}Cr`
                      : volTraded >= 1e5
                      ? `${(volTraded / 1e5).toFixed(1)}L`
                      : `${(volTraded / 1e3).toFixed(1)}K`}
                  </div>
                </div>
              );
            })}
      </div>

      {/* Overflow hint */}
      {!loading && stocks.length > VISIBLE_ROWS && (
        <div style={{
          marginTop: 8, textAlign: "center",
          fontSize: 10, color: "#334", fontFamily: "monospace", letterSpacing: 0.5,
        }}>
          scroll for {stocks.length - VISIBLE_ROWS} more ↕
        </div>
      )}

      <style>{`
        @keyframes shimmer { 0%,100%{opacity:0.4} 50%{opacity:0.8} }
        div::-webkit-scrollbar { width: 4px; }
        div::-webkit-scrollbar-track { background: transparent; }
        div::-webkit-scrollbar-thumb { background: ${accentColor}50; border-radius: 2px; }
        div::-webkit-scrollbar-thumb:hover { background: ${accentColor}80; }
      `}</style>
    </div>
  );
}