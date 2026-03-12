import { useState, useEffect, useCallback } from "react";

const REFRESH_INTERVAL = 5 * 60 * 1000;

export default function MostActiveStocks({ onSelect }) {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStocks = useCallback(async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/market/most_active_stocks");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setStocks(json.data);
      }
    } catch (err) {
      console.error("MostActiveStocks fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStocks();
    const interval = setInterval(fetchStocks, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchStocks]);

  // Row height ~45px * 5 visible rows
  const ROW_HEIGHT = 45;
  const VISIBLE_ROWS = 5;
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
          <span style={{ fontSize: 16 }}>⚡</span>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
            fontSize: 14, color: "#aab", letterSpacing: 0.5,
          }}>
            Most Active
          </span>
          {!loading && stocks.length > 0 && (
            <span style={{
              fontSize: 10, color: "#445", fontFamily: "monospace",
              background: "rgba(0,163,255,0.1)", border: "1px solid rgba(0,163,255,0.2)",
              borderRadius: 4, padding: "1px 6px",
            }}>
              {stocks.length}
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "#00a3ff", boxShadow: "0 0 8px #00a3ff",
          }} />
          <span style={{ fontSize: 10, color: "#445", fontFamily: "monospace", letterSpacing: 1 }}>LIVE</span>
        </div>
      </div>

      {/* Column headers */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 80px 70px 70px",
        padding: "0 4px 8px", borderBottom: "1px solid rgba(255,255,255,0.05)",
        marginBottom: 4,
      }}>
        {["Stock", "Price", "Chg%", "Val(Cr)"].map((h, i) => (
          <span key={h} style={{
            fontSize: 10, color: "#445", fontFamily: "monospace",
            letterSpacing: 0.8, textAlign: i > 0 ? "right" : "left",
          }}>{h}</span>
        ))}
      </div>

      {/* Scrollable list — shows 5 rows, scrolls if more */}
      <div style={{
        height: listHeight,
        overflowY: stocks.length > VISIBLE_ROWS ? "auto" : "hidden",
        overflowX: "hidden",
        // Custom thin scrollbar
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(0,163,255,0.3) transparent",
      }}>
        {loading ? (
          Array.from({ length: VISIBLE_ROWS }).map((_, i) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "1fr 80px 70px 70px",
              height: ROW_HEIGHT, alignItems: "center",
              padding: "0 4px", borderBottom: "1px solid rgba(255,255,255,0.03)",
            }}>
              {[130, 58, 48, 52].map((w, j) => (
                <div key={j} style={{
                  height: 9, borderRadius: 4,
                  background: "rgba(255,255,255,0.05)",
                  width: w, marginLeft: j === 0 ? 0 : "auto",
                  animation: `shimmer 1.5s ${i * 0.1}s infinite`,
                }} />
              ))}
            </div>
          ))
        ) : stocks.map((stock, i) => {
          const isUp = stock.perchg >= 0;
          return (
            <div
              key={stock.sc_code || i}
              onClick={() => onSelect?.(stock)}
              style={{
                display: "grid", gridTemplateColumns: "1fr 80px 70px 70px",
                height: ROW_HEIGHT, alignItems: "center",
                padding: "0 4px",
                borderBottom: "1px solid rgba(255,255,255,0.03)",
                cursor: "pointer", transition: "background 0.15s",
                borderRadius: 6,
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(0,163,255,0.06)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              {/* Symbol + exchange */}
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
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  maxWidth: 120,
                }}>
                  {stock.co_name}
                </div>
              </div>

              {/* Close price */}
              <div style={{
                textAlign: "right", fontSize: 13, fontWeight: 600,
                color: "#ccd", fontFamily: "monospace",
              }}>
                {stock.close_price?.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>

              {/* % change */}
              <div style={{
                textAlign: "right", fontSize: 12, fontWeight: 600,
                color: isUp ? "#00c896" : "#ff4d6d", fontFamily: "monospace",
              }}>
                {isUp ? "▲" : "▼"} {Math.abs(stock.perchg).toFixed(2)}%
              </div>

              {/* Value traded */}
              <div style={{
                textAlign: "right", fontSize: 11,
                color: "#667", fontFamily: "monospace",
              }}>
                ₹{stock.val_traded?.toFixed(2)}Cr
              </div>
            </div>
          );
        })}
      </div>

      {/* Scroll hint — only shown when list overflows */}
      {!loading && stocks.length > VISIBLE_ROWS && (
        <div style={{
          marginTop: 8, textAlign: "center",
          fontSize: 10, color: "#334", fontFamily: "monospace", letterSpacing: 0.5,
        }}>
          {/* scroll for {stocks.length - VISIBLE_ROWS} more ↕ */}
        </div>
      )}

      <style>{`
        @keyframes shimmer { 0%,100%{opacity:0.4} 50%{opacity:0.8} }
        div::-webkit-scrollbar { width: 4px; }
        div::-webkit-scrollbar-track { background: transparent; }
        div::-webkit-scrollbar-thumb { background: rgba(0,163,255,0.3); border-radius: 2px; }
        div::-webkit-scrollbar-thumb:hover { background: rgba(0,163,255,0.5); }
      `}</style>
    </div>
  );
}