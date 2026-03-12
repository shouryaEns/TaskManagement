import { useState } from "react";
import IndicesBar from "../components/market/IndicesBar";
import StockTable from "../components/stocks/StockTable";
import { stocks, topGainers, topLosers, mostActive, week52Highs, week52Lows } from "../data/mockData";

const tabs = [
  { id: "all",       label: "All Stocks",   icon: "📋" },
  { id: "gainers",   label: "Top Gainers",  icon: "🚀" },
  { id: "losers",    label: "Top Losers",   icon: "📉" },
  { id: "active",    label: "Most Active",  icon: "⚡" },
  { id: "52high",    label: "52W High",     icon: "🏆" },
  { id: "52low",     label: "52W Low",      icon: "⬇️" },
];

const tabData = { all: stocks, gainers: topGainers, losers: topLosers, active: mostActive, "52high": week52Highs, "52low": week52Lows };

export default function Markets({ onSelectStock }) {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div style={{ padding: "28px 0" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Orbitron', monospace", fontSize: 24, fontWeight: 900, color: "#fff", marginBottom: 4 }}>Markets</h1>
        <p style={{ color: "#556", fontFamily: "'Space Grotesk', sans-serif", fontSize: 13 }}>Live market data, indices & stock screener</p>
      </div>

      <IndicesBar />

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            background: activeTab === tab.id ? "rgba(0,200,150,0.15)" : "rgba(255,255,255,0.03)",
            border: activeTab === tab.id ? "1px solid rgba(0,200,150,0.4)" : "1px solid rgba(255,255,255,0.08)",
            color: activeTab === tab.id ? "#00c896" : "#778",
            padding: "8px 16px", borderRadius: 10, cursor: "pointer",
            fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 600,
            display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s",
          }}>
            <span>{tab.icon}</span>{tab.label}
          </button>
        ))}
      </div>

      {/* Full stock table */}
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.04)" }}>
              {["#", "Stock", "Price", "Change", "Volume", "Mkt Cap", "52W High", "52W Low", "P/E"].map(h => (
                <th key={h} style={{
                  padding: "12px 16px", textAlign: h === "Stock" || h === "#" ? "left" : "right",
                  fontSize: 11, color: "#556", fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 600, letterSpacing: 0.8, borderBottom: "1px solid rgba(255,255,255,0.07)",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tabData[activeTab].map((s, i) => (
              <tr key={s.id} onClick={() => onSelectStock(s)} style={{
                cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(0,200,150,0.04)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <td style={{ padding: "12px 16px", color: "#445", fontFamily: "'Space Grotesk', sans-serif", fontSize: 12 }}>{i + 1}</td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 22 }}>{s.logo}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: "#eee", fontFamily: "'Space Grotesk', sans-serif" }}>{s.symbol}</div>
                      <div style={{ fontSize: 11, color: "#445" }}>{s.name}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "12px 16px", textAlign: "right", fontFamily: "'Orbitron', monospace", fontSize: 13, color: "#ddd", fontWeight: 600 }}>
                  ₹{s.price.toLocaleString('en-IN')}
                </td>
                <td style={{ padding: "12px 16px", textAlign: "right" }}>
                  <span style={{
                    background: s.pct >= 0 ? "rgba(0,200,150,0.12)" : "rgba(255,77,109,0.12)",
                    color: s.pct >= 0 ? "#00c896" : "#ff4d6d",
                    padding: "3px 8px", borderRadius: 6, fontSize: 12, fontWeight: 700,
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}>{s.pct >= 0 ? "+" : ""}{s.pct}%</span>
                </td>
                <td style={{ padding: "12px 16px", textAlign: "right", color: "#667", fontSize: 12, fontFamily: "'Space Grotesk', sans-serif" }}>{s.volume}</td>
                <td style={{ padding: "12px 16px", textAlign: "right", color: "#667", fontSize: 12, fontFamily: "'Space Grotesk', sans-serif" }}>₹{s.mktCap}</td>
                <td style={{ padding: "12px 16px", textAlign: "right", color: "#00c896", fontSize: 12, fontFamily: "'Orbitron', monospace" }}>₹{s.week52High.toLocaleString('en-IN')}</td>
                <td style={{ padding: "12px 16px", textAlign: "right", color: "#ff4d6d", fontSize: 12, fontFamily: "'Orbitron', monospace" }}>₹{s.week52Low.toLocaleString('en-IN')}</td>
                <td style={{ padding: "12px 16px", textAlign: "right", color: "#aab", fontSize: 12, fontFamily: "'Space Grotesk', sans-serif" }}>{s.pe}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
