import { useState, useEffect, useCallback } from "react";

const REFRESH_INTERVAL = 5 * 60 * 1000;

export default function TickerTape() {
  const [indices, setIndices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIndices = useCallback(async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/market/indices");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setIndices(json.data);
      }
    } catch (err) {
      console.error("TickerTape fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIndices();
    const interval = setInterval(fetchIndices, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchIndices]);

  if (loading || indices.length === 0) {
    return (
      <div style={{
        background: "rgba(0,0,0,0.6)",
        borderBottom: "1px solid rgba(0,200,150,0.1)",
        height: 36, display: "flex", alignItems: "center",
        paddingLeft: 16,
      }}>
        <span style={{ fontSize: 11, color: "#445", fontFamily: "monospace", letterSpacing: 1, animation: "pulse 1s infinite" }}>
          LOADING TICKER...
        </span>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
      </div>
    );
  }

  // Duplicate for seamless loop
  const items = [...indices, ...indices];

  // Dynamic speed: more items = slower scroll so each stays readable
  const duration = Math.max(30, indices.length * 10);

  return (
    <div style={{
      background: "rgba(0,0,0,0.6)",
      borderBottom: "1px solid rgba(0,200,150,0.1)",
      overflow: "hidden",
      height: 36,
      display: "flex",
      alignItems: "center",
    }}>
      <div style={{
        display: "flex",
        gap: 48,
        animation: `ticker ${duration}s linear infinite`,
        whiteSpace: "nowrap",
        willChange: "transform",
      }}>
        {items.map((idx, i) => {
          const isUp = idx.Change >= 0;
          return (
            <span
              key={`${idx.IndexCode?.trim()}-${i}`}
              style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "monospace", fontSize: 12 }}
            >
              {/* Exchange badge */}
              <span style={{
                fontSize: 9, color: "#445", letterSpacing: 0.5,
                background: "rgba(255,255,255,0.05)",
                padding: "1px 4px", borderRadius: 3,
              }}>
                {idx.Exchange}
              </span>

              {/* Index name */}
              <span style={{ color: "#889", letterSpacing: 0.3 }}>
                {idx.aliasname}
              </span>

              {/* Last price */}
              <span style={{ color: "#dde", fontWeight: 600 }}>
                {idx.Last?.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>

              {/* Change */}
              <span style={{ color: isUp ? "#00c896" : "#ff4d6d", fontWeight: 600 }}>
                {isUp ? "▲" : "▼"} {Math.abs(idx.PriceDiff).toFixed(2)}
                <span style={{ opacity: 0.75, marginLeft: 3 }}>
                  ({Math.abs(idx.Change).toFixed(2)}%)
                </span>
              </span>

              {/* Separator */}
              <span style={{ color: "rgba(255,255,255,0.08)", fontSize: 16, fontWeight: 100 }}>|</span>
            </span>
          );
        })}
      </div>

      <style>{`
        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}