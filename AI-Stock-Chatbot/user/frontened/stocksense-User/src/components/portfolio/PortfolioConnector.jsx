import { useState } from "react";
import { brokers } from "../../data/mockData";

const mockPortfolio = {
  zerodha: {
    totalValue: 284500,
    invested: 240000,
    pnl: 44500,
    pnlPct: 18.54,
    holdings: [
      { symbol: "RELIANCE", qty: 10, avgPrice: 2650, ltp: 2941.55, pnl: 2915.50, logo: "🛢️" },
      { symbol: "TCS",      qty: 5,  avgPrice: 3450, ltp: 3789.20, pnl: 1696.00, logo: "💻" },
      { symbol: "INFY",     qty: 15, avgPrice: 1620, ltp: 1789.65, pnl: 2544.75, logo: "💡" },
      { symbol: "HDFCBANK", qty: 20, avgPrice: 1580, ltp: 1612.40, pnl:  648.00, logo: "🏦" },
    ],
  },
};

export default function PortfolioConnector() {
  const [connected, setConnected] = useState(null);
  const [connecting, setConnecting] = useState(null);
  const [showPortfolio, setShowPortfolio] = useState(false);

  const handleConnect = (broker) => {
    setConnecting(broker.id);
    setTimeout(() => {
      setConnecting(null);
      setConnected(broker);
      setShowPortfolio(true);
    }, 1800);
  };

  const portfolio = mockPortfolio.zerodha;

  return (
    <div>
      {!showPortfolio ? (
        <>
          <p style={{ color: "#778", fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
            Connect your trading account to view your holdings, P&L, and get personalized AI insights on your portfolio.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {brokers.map(broker => (
              <div key={broker.id} style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid rgba(255,255,255,0.08)`,
                borderRadius: 14, padding: 20, textAlign: "center",
                cursor: "pointer", transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = broker.color; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
              >
                <div style={{ fontSize: 36, marginBottom: 8 }}>{broker.logo}</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: "#dde", fontSize: 14, marginBottom: 4 }}>{broker.name}</div>
                <div style={{ fontSize: 11, color: "#556", marginBottom: 14 }}>{broker.tagline}</div>
                <button onClick={() => handleConnect(broker)} disabled={connecting === broker.id} style={{
                  background: connecting === broker.id ? "rgba(255,255,255,0.05)" : `${broker.color}22`,
                  border: `1px solid ${broker.color}55`,
                  color: connecting === broker.id ? "#556" : broker.color,
                  padding: "7px 16px", borderRadius: 8, cursor: connecting === broker.id ? "default" : "pointer",
                  fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, fontWeight: 600, width: "100%",
                  transition: "all 0.2s",
                }}>
                  {connecting === broker.id ? "Connecting..." : "Connect"}
                </button>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, padding: 14, background: "rgba(0,200,150,0.05)", border: "1px solid rgba(0,200,150,0.15)", borderRadius: 10 }}>
            <p style={{ color: "#667", fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, margin: 0, lineHeight: 1.6 }}>
              🔒 <strong style={{ color: "#00c896" }}>Secure & Read-Only:</strong> We only access your holdings data. We never place trades or access your funds. All data is encrypted end-to-end.
            </p>
          </div>
        </>
      ) : (
        <div>
          {/* Portfolio Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ fontSize: 28 }}>{connected?.logo}</span>
              <div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: "#dde", fontSize: 15 }}>
                  {connected?.name} Portfolio
                </div>
                <div style={{ fontSize: 12, color: "#00c896", fontFamily: "'Space Grotesk', sans-serif" }}>✓ Connected</div>
              </div>
            </div>
            <button onClick={() => { setConnected(null); setShowPortfolio(false); }} style={{
              background: "rgba(255,77,109,0.1)", border: "1px solid rgba(255,77,109,0.3)",
              color: "#ff4d6d", padding: "6px 14px", borderRadius: 8,
              cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", fontSize: 12,
            }}>Disconnect</button>
          </div>

          {/* Summary Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
            {[
              { label: "Portfolio Value", value: `₹${portfolio.totalValue.toLocaleString('en-IN')}`, color: "#fff" },
              { label: "Invested", value: `₹${portfolio.invested.toLocaleString('en-IN')}`, color: "#aab" },
              { label: "Total P&L", value: `+₹${portfolio.pnl.toLocaleString('en-IN')} (+${portfolio.pnlPct}%)`, color: "#00c896" },
            ].map(card => (
              <div key={card.label} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "14px 16px" }}>
                <div style={{ fontSize: 11, color: "#556", fontFamily: "'Space Grotesk', sans-serif", marginBottom: 6, letterSpacing: 0.5 }}>{card.label}</div>
                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 16, fontWeight: 700, color: card.color }}>{card.value}</div>
              </div>
            ))}
          </div>

          {/* Holdings */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 13, color: "#aab" }}>
              Holdings
            </div>
            {portfolio.holdings.map((h, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "12px 16px", borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 22 }}>{h.logo}</span>
                  <div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 13, color: "#eee" }}>{h.symbol}</div>
                    <div style={{ fontSize: 11, color: "#556" }}>{h.qty} shares · Avg ₹{h.avgPrice}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 13, color: "#ddd" }}>₹{h.ltp.toLocaleString('en-IN')}</div>
                  <div style={{ fontSize: 12, color: "#00c896", fontFamily: "'Space Grotesk', sans-serif" }}>+₹{h.pnl.toLocaleString('en-IN')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
