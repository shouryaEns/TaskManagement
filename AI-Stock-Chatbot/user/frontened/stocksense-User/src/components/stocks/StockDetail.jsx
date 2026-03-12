import { useState, useEffect } from "react";
import { generateChartData } from "../../data/mockData";

function MiniChart({ data, positive }) {
  const prices = data.map(d => d.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const w = 600, h = 160;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((d.price - min) / (max - min + 0.01)) * h;
    return `${x},${y}`;
  }).join(" ");
  const color = positive ? "#00c896" : "#ff4d6d";
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: 160 }}>
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" />
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill="url(#chartGrad)" />
    </svg>
  );
}

export default function StockDetail({ stock, onClose }) {
  const [chartData, setChartData] = useState([]);
  const [range, setRange] = useState("1M");

  const ranges = { "1W": 7, "1M": 30, "3M": 90, "6M": 180, "1Y": 365 };

  useEffect(() => {
    setChartData(generateChartData(stock.price, ranges[range]));
  }, [stock, range]);

  const positive = stock.pct >= 0;

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
      backdropFilter: "blur(8px)", zIndex: 200, display: "flex",
      alignItems: "center", justifyContent: "center", padding: 24,
    }} onClick={onClose}>
      <div style={{
        background: "#0d1117", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 20, padding: 32, maxWidth: 700, width: "100%",
        maxHeight: "90vh", overflow: "auto",
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ fontSize: 48 }}>{stock.logo}</div>
            <div>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 22, fontWeight: 900, color: "#fff" }}>{stock.symbol}</div>
              <div style={{ color: "#778", fontSize: 13, fontFamily: "'Space Grotesk', sans-serif" }}>{stock.name} • {stock.sector}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", color: "#fff", width: 36, height: 36, borderRadius: 8, cursor: "pointer", fontSize: 18 }}>×</button>
        </div>

        {/* Price */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 36, fontWeight: 900, color: "#fff" }}>
            ₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ color: positive ? "#00c896" : "#ff4d6d", fontSize: 16, fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif" }}>
            {positive ? "▲" : "▼"} ₹{Math.abs(stock.change)} ({Math.abs(stock.pct)}%)
          </div>
        </div>

        {/* Chart */}
        <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 16, marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            {Object.keys(ranges).map(r => (
              <button key={r} onClick={() => setRange(r)} style={{
                background: range === r ? (positive ? "rgba(0,200,150,0.2)" : "rgba(255,77,109,0.2)") : "transparent",
                border: range === r ? `1px solid ${positive ? "#00c896" : "#ff4d6d"}` : "1px solid rgba(255,255,255,0.1)",
                color: range === r ? (positive ? "#00c896" : "#ff4d6d") : "#667",
                padding: "4px 10px", borderRadius: 6, cursor: "pointer",
                fontFamily: "'Space Grotesk', sans-serif", fontSize: 12,
              }}>{r}</button>
            ))}
          </div>
          <MiniChart data={chartData} positive={positive} />
        </div>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {[
            { label: "Open",        value: `₹${stock.open.toLocaleString('en-IN')}` },
            { label: "High",        value: `₹${stock.high.toLocaleString('en-IN')}` },
            { label: "Low",         value: `₹${stock.low.toLocaleString('en-IN')}` },
            { label: "Prev Close",  value: `₹${stock.prev.toLocaleString('en-IN')}` },
            { label: "Volume",      value: stock.volume },
            { label: "Mkt Cap",     value: `₹${stock.mktCap}` },
            { label: "P/E Ratio",   value: stock.pe },
            { label: "52W High",    value: `₹${stock.week52High.toLocaleString('en-IN')}` },
            { label: "52W Low",     value: `₹${stock.week52Low.toLocaleString('en-IN')}` },
          ].map(stat => (
            <div key={stat.label} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 11, color: "#556", fontFamily: "'Space Grotesk', sans-serif", marginBottom: 4, letterSpacing: 0.5 }}>{stat.label}</div>
              <div style={{ fontSize: 14, color: "#ddd", fontFamily: "'Orbitron', monospace", fontWeight: 600 }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* 52 Week Range */}
        <div style={{ marginTop: 16, background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 11, color: "#556", fontFamily: "'Space Grotesk', sans-serif", marginBottom: 8, letterSpacing: 0.5 }}>52 WEEK RANGE</div>
          <div style={{ position: "relative", height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3 }}>
            {(() => {
              const pct = ((stock.price - stock.week52Low) / (stock.week52High - stock.week52Low)) * 100;
              return (
                <>
                  <div style={{ position: "absolute", left: 0, width: `${pct}%`, height: "100%", background: "linear-gradient(90deg,#00c896,#00a3ff)", borderRadius: 3 }} />
                  <div style={{ position: "absolute", left: `${pct}%`, top: -4, width: 14, height: 14, borderRadius: "50%", background: "#fff", transform: "translateX(-50%)", border: "2px solid #00c896" }} />
                </>
              );
            })()}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ fontSize: 11, color: "#ff4d6d", fontFamily: "'Space Grotesk', sans-serif" }}>₹{stock.week52Low.toLocaleString('en-IN')}</span>
            <span style={{ fontSize: 11, color: "#00c896", fontFamily: "'Space Grotesk', sans-serif" }}>₹{stock.week52High.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
