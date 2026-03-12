import PortfolioConnector from "../components/portfolio/PortfolioConnector";

export default function Portfolio() {
  return (
    <div style={{ padding: "28px 0" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Orbitron', monospace", fontSize: 24, fontWeight: 900, color: "#fff", marginBottom: 4 }}>My Portfolio</h1>
        <p style={{ color: "#556", fontFamily: "'Space Grotesk', sans-serif", fontSize: 13 }}>Connect your broker to track holdings & performance</p>
      </div>

      <div style={{ maxWidth: 900 }}>
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: 28 }}>
          <PortfolioConnector />
        </div>
      </div>
    </div>
  );
}
