import { useState } from "react";
import IndicesBar from "../components/market/IndicesBar";
import TopGainers from "../components/market/TopGainers";
import TopLosers from "../components/market/TopLosers";
import MostActiveStocks from "../components/market/MostActiveStocks";
import StockDetailModal from "../components/market/StockDetailModal";
import NewsSection from "../components/news/NewsSection";
import Chatbot from "../components/chatbot/Chatbot";

export default function Dashboard({ onSelectStock }) {
  const [selectedStock, setSelectedStock] = useState(null);

  return (
    <div style={{ padding: "28px 0" }}>
      {/* Welcome Banner */}
      {/* <div style={{
        background: "linear-gradient(135deg, rgba(0,200,150,0.08), rgba(0,163,255,0.08))",
        border: "1px solid rgba(0,200,150,0.15)",
        borderRadius: 16, padding: "20px 28px", marginBottom: 28,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 4 }}>
            Market Overview
          </div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: "#667" }}>
            Friday, 6 March 2026 · NSE · 10:45 AM IST · <span style={{ color: "#00c896" }}>🟢 Markets Open</span>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: "#556", marginBottom: 4 }}>SENSEX</div>
          <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 24, fontWeight: 900, color: "#00c896" }}>74,119</div>
          <div style={{ fontSize: 12, color: "#00c896", fontFamily: "'Space Grotesk', sans-serif" }}>▲ 0.66%</div>
        </div>
      </div> */}

      {/* Indices */}
      <IndicesBar />

      {/* 3-column grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 28 }}>
        <TopGainers    onSelect={setSelectedStock} />
        <TopLosers     onSelect={setSelectedStock} />
        <MostActiveStocks onSelect={setSelectedStock} />
      </div>

      {/* News + Chatbot */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 20 }}>
        <div style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 16, padding: "20px 24px",
        }}>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
            fontSize: 14, color: "#aab", marginBottom: 4,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            📰 Top Business News
          </div>
          <NewsSection limit={5} />
        </div>
        <div>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
            fontSize: 14, color: "#aab", marginBottom: 12,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            🤖 AI Market Assistant
          </div>
          <Chatbot />
        </div>
      </div>

      {/* Stock Detail Modal */}
      <StockDetailModal
        stock={selectedStock}
        onClose={() => setSelectedStock(null)}
      />
    </div>
  );
}