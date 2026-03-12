// import { useState, useEffect } from "react";

// export default function StockDetailModal({ stock, onClose }) {
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     if (stock) {
//       setTimeout(() => setVisible(true), 10);
//       document.body.style.overflow = "hidden";
//     }
//     return () => { document.body.style.overflow = ""; };
//   }, [stock]);

//   if (!stock) return null;

//   const handleClose = () => {
//     setVisible(false);
//     setTimeout(onClose, 250);
//   };

//   const isUp = stock.perchg >= 0 || stock.netchg >= 0;
//   const accentColor = isUp ? "#00c896" : "#ff4d6d";
//   const accentBg = isUp ? "rgba(0,200,150,0.08)" : "rgba(255,77,109,0.08)";

//   const fmt = (v, dec = 2) =>
//     v != null ? Number(v).toLocaleString("en-IN", { minimumFractionDigits: dec, maximumFractionDigits: dec }) : "—";

//   const rows = [
//     { label: "Open",          value: `₹${fmt(stock.Open_Price)}` },
//     { label: "High",          value: `₹${fmt(stock.high_price)}`,  color: "#00c896" },
//     { label: "Low",           value: `₹${fmt(stock.low_price)}`,   color: "#ff4d6d" },
//     { label: "Prev Close",    value: `₹${fmt(stock.PrevClose)}` },
//     { label: "52W High",      value: `₹${fmt(stock["52WeekHigh"])}`, color: "#00c896" },
//     { label: "52W Low",       value: `₹${fmt(stock["52WeekLow"])}`,  color: "#ff4d6d" },
//     { label: "Volume",        value: Number(stock.vol_traded).toLocaleString("en-IN") },
//     { label: "Value Traded",  value: `₹${fmt(stock.val_traded)} Cr` },
//     { label: "Buy Qty",       value: Number(stock.BBuy_Qty || 0).toLocaleString("en-IN") },
//     { label: "Buy Price",     value: stock.BBuy_Price ? `₹${fmt(stock.BBuy_Price)}` : "—" },
//     { label: "Sell Qty",      value: Number(stock.BSell_Qty || 0).toLocaleString("en-IN") },
//     { label: "Sell Price",    value: stock.BSell_Price ? `₹${fmt(stock.BSell_Price)}` : "—" },
//     { label: "Exchange",      value: stock.stk_exchng },
//     { label: "Group",         value: stock.sc_group || "—" },
//   ];

//   // Price range bar percent
//   const rangeMin = stock["52WeekLow"] || stock.low_price;
//   const rangeMax = stock["52WeekHigh"] || stock.high_price;
//   const rangePct = rangeMax > rangeMin
//     ? Math.round(((stock.close_price - rangeMin) / (rangeMax - rangeMin)) * 100)
//     : 50;

//   return (
//     <div
//       onClick={handleClose}
//       style={{
//         position: "fixed", inset: 0, zIndex: 1000,
//         background: "rgba(0,0,0,0.75)",
//         backdropFilter: "blur(6px)",
//         display: "flex", alignItems: "center", justifyContent: "center",
//         padding: 24,
//         opacity: visible ? 1 : 0,
//         transition: "opacity 0.25s ease",
//       }}
//     >
//       <div
//         onClick={e => e.stopPropagation()}
//         style={{
//           width: "100%", maxWidth: 580,
//           background: "#0d0f14",
//           border: `1px solid ${accentColor}30`,
//           borderRadius: 20,
//           boxShadow: `0 24px 80px rgba(0,0,0,0.6), 0 0 40px ${accentColor}15`,
//           overflow: "hidden",
//           transform: visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
//           transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
//         }}
//       >
//         {/* Top accent bar */}
//         <div style={{ height: 3, background: `linear-gradient(90deg, ${accentColor}, transparent)` }} />

//         {/* Header */}
//         <div style={{
//           padding: "24px 28px 20px",
//           background: accentBg,
//           borderBottom: "1px solid rgba(255,255,255,0.05)",
//           display: "flex", justifyContent: "space-between", alignItems: "flex-start",
//         }}>
//           <div>
//             <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
//               <span style={{
//                 fontFamily: "monospace", fontSize: 22, fontWeight: 900,
//                 color: "#fff", letterSpacing: 1,
//               }}>
//                 {stock.symbol}
//               </span>
//               <span style={{
//                 fontSize: 10, fontFamily: "monospace", letterSpacing: 1,
//                 color: accentColor, background: `${accentColor}18`,
//                 border: `1px solid ${accentColor}40`,
//                 padding: "2px 8px", borderRadius: 4,
//               }}>
//                 {stock.stk_exchng}
//               </span>
//               {stock.sc_group && (
//                 <span style={{
//                   fontSize: 10, fontFamily: "monospace",
//                   color: "#556", background: "rgba(255,255,255,0.05)",
//                   border: "1px solid rgba(255,255,255,0.08)",
//                   padding: "2px 8px", borderRadius: 4,
//                 }}>
//                   GRP {stock.sc_group}
//                 </span>
//               )}
//             </div>
//             <div style={{ fontSize: 13, color: "#778", fontFamily: "'Space Grotesk', sans-serif" }}>
//               {stock.lname || stock.co_name}
//             </div>
//           </div>

//           {/* Close button */}
//           <button
//             onClick={handleClose}
//             style={{
//               width: 32, height: 32, borderRadius: 8,
//               border: "1px solid rgba(255,255,255,0.1)",
//               background: "rgba(255,255,255,0.05)",
//               color: "#778", fontSize: 16, cursor: "pointer",
//               display: "flex", alignItems: "center", justifyContent: "center",
//               transition: "all 0.15s", flexShrink: 0,
//             }}
//             onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,77,109,0.15)"; e.currentTarget.style.color = "#ff4d6d"; }}
//             onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#778"; }}
//           >
//             ✕
//           </button>
//         </div>

//         {/* Price hero */}
//         <div style={{
//           padding: "20px 28px",
//           borderBottom: "1px solid rgba(255,255,255,0.05)",
//           display: "flex", alignItems: "flex-end", justifyContent: "space-between",
//         }}>
//           <div>
//             <div style={{
//               fontFamily: "'Orbitron', monospace", fontSize: 36, fontWeight: 900,
//               color: "#fff", letterSpacing: -1, lineHeight: 1,
//             }}>
//               ₹{fmt(stock.close_price)}
//             </div>
//             <div style={{
//               marginTop: 8, fontSize: 14, fontWeight: 700,
//               color: accentColor, fontFamily: "monospace",
//             }}>
//               {isUp ? "▲" : "▼"} ₹{fmt(Math.abs(stock.netchg))}
//               <span style={{ marginLeft: 8, opacity: 0.8 }}>
//                 ({fmt(Math.abs(stock.perchg))}%)
//               </span>
//             </div>
//           </div>

//           {/* Mini stat pills */}
//           <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
//             <div style={{ display: "flex", gap: 8 }}>
//               {[
//                 { l: "H", v: fmt(stock.high_price), c: "#00c896" },
//                 { l: "L", v: fmt(stock.low_price),  c: "#ff4d6d" },
//               ].map(({ l, v, c }) => (
//                 <div key={l} style={{
//                   fontSize: 12, fontFamily: "monospace",
//                   background: `${c}12`, border: `1px solid ${c}30`,
//                   borderRadius: 6, padding: "4px 10px", color: c,
//                 }}>
//                   {l}: ₹{v}
//                 </div>
//               ))}
//             </div>
//             <div style={{ fontSize: 11, color: "#445", fontFamily: "monospace" }}>
//               Vol: {Number(stock.vol_traded).toLocaleString("en-IN")}
//             </div>
//           </div>
//         </div>

//         {/* 52W range bar */}
//         <div style={{ padding: "16px 28px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
//           <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
//             <span style={{ fontSize: 10, color: "#ff4d6d", fontFamily: "monospace" }}>
//               52W Low: ₹{fmt(stock["52WeekLow"])}
//             </span>
//             <span style={{ fontSize: 10, color: "#445", fontFamily: "monospace" }}>
//               52-Week Range
//             </span>
//             <span style={{ fontSize: 10, color: "#00c896", fontFamily: "monospace" }}>
//               52W High: ₹{fmt(stock["52WeekHigh"])}
//             </span>
//           </div>
//           <div style={{
//             height: 6, background: "rgba(255,255,255,0.06)",
//             borderRadius: 3, position: "relative", overflow: "visible",
//           }}>
//             <div style={{
//               position: "absolute", left: 0, top: 0, bottom: 0,
//               width: `${rangePct}%`,
//               background: `linear-gradient(90deg, #ff4d6d, ${accentColor})`,
//               borderRadius: 3, transition: "width 0.6s ease",
//             }} />
//             <div style={{
//               position: "absolute", top: "50%",
//               left: `${rangePct}%`,
//               transform: "translate(-50%, -50%)",
//               width: 12, height: 12, borderRadius: "50%",
//               background: accentColor,
//               boxShadow: `0 0 8px ${accentColor}`,
//               border: "2px solid #0d0f14",
//             }} />
//           </div>
//           <div style={{ textAlign: "center", marginTop: 6, fontSize: 10, color: "#556", fontFamily: "monospace" }}>
//             Current at {rangePct}% of 52W range
//           </div>
//         </div>

//         {/* Data grid */}
//         <div style={{
//           padding: "20px 28px 24px",
//           display: "grid", gridTemplateColumns: "1fr 1fr",
//           gap: "2px 12px",
//         }}>
//           {rows.map(({ label, value, color }) => (
//             <div key={label} style={{
//               display: "flex", justifyContent: "space-between", alignItems: "center",
//               padding: "9px 0",
//               borderBottom: "1px solid rgba(255,255,255,0.04)",
//             }}>
//               <span style={{ fontSize: 11, color: "#556", fontFamily: "monospace", letterSpacing: 0.5 }}>
//                 {label}
//               </span>
//               <span style={{
//                 fontSize: 12, fontWeight: 600,
//                 color: color || "#ccd", fontFamily: "monospace",
//               }}>
//                 {value}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from "react";

export default function StockDetailModal({ stock, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (stock) {
      setTimeout(() => setVisible(true), 10);
      document.body.style.overflow = "hidden";
    }
    return () => { document.body.style.overflow = ""; };
  }, [stock]);

  if (!stock) return null;

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  // ── Normalise field names across NSE / BSE / MostActive responses ──
  const closePrice  = stock.close_price  ?? stock.Close_price;
  const lowPrice    = stock.low_price    ?? stock.low_Price;
  const highPrice   = stock.high_price;
  const openPrice   = stock.Open_Price;
  const prevClose   = stock.PrevClose;
  const netChg      = stock.netchg;
  const perChg      = stock.perchg;
  const volTraded   = stock.vol_traded;
  const valTraded   = stock.val_traded;
  const week52High  = stock["52WeekHigh"];
  const week52Low   = stock["52WeekLow"];
  const exchange    = stock.stk_exchng   ?? stock.Stk_Exchange;
  const buyQty      = stock.BBuy_Qty     ?? stock.bbuy_qty   ?? 0;
  const buyPrice    = stock.BBuy_Price   ?? stock.bbuy_price ?? 0;
  const sellQty     = stock.BSell_Qty    ?? stock.bsell_qty  ?? 0;
  const sellPrice   = stock.BSell_Price  ?? stock.bsell_price ?? 0;

  const isUp = perChg >= 0 || netChg >= 0;
  const accentColor = isUp ? "#00c896" : "#ff4d6d";
  const accentBg    = isUp ? "rgba(0,200,150,0.08)" : "rgba(255,77,109,0.08)";

  const fmt = (v, dec = 2) =>
    v != null && v !== "" && !isNaN(v)
      ? Number(v).toLocaleString("en-IN", { minimumFractionDigits: dec, maximumFractionDigits: dec })
      : "—";

  const fmtVol = (v) => {
    if (!v) return "—";
    if (v >= 1e7) return `${(v / 1e7).toFixed(2)}Cr`;
    if (v >= 1e5) return `${(v / 1e5).toFixed(2)}L`;
    return `${(v / 1e3).toFixed(2)}K`;
  };

  const rows = [
    { label: "Open",         value: `₹${fmt(openPrice)}` },
    { label: "High",         value: `₹${fmt(highPrice)}`,   color: "#00c896" },
    { label: "Low",          value: `₹${fmt(lowPrice)}`,    color: "#ff4d6d" },
    { label: "Prev Close",   value: `₹${fmt(prevClose)}` },
    { label: "52W High",     value: `₹${fmt(week52High)}`,  color: "#00c896" },
    { label: "52W Low",      value: `₹${fmt(week52Low)}`,   color: "#ff4d6d" },
    { label: "Volume",       value: fmtVol(volTraded) },
    { label: "Value Traded", value: `₹${fmt(valTraded)} Cr` },
    { label: "Buy Qty",      value: buyQty  ? Number(buyQty).toLocaleString("en-IN")  : "—" },
    { label: "Buy Price",    value: buyPrice  && buyPrice  > 0 ? `₹${fmt(buyPrice)}`  : "—" },
    { label: "Sell Qty",     value: sellQty ? Number(sellQty).toLocaleString("en-IN") : "—" },
    { label: "Sell Price",   value: sellPrice && sellPrice > 0 ? `₹${fmt(sellPrice)}` : "—" },
    { label: "Exchange",     value: exchange ?? "—" },
    { label: "Group",        value: stock.sc_group ?? "—" },
  ];

  // 52W range bar position
  const rangeMin = week52Low  || lowPrice  || 0;
  const rangeMax = week52High || highPrice || 1;
  const rangePct = rangeMax > rangeMin
    ? Math.min(100, Math.max(0, Math.round(((closePrice - rangeMin) / (rangeMax - rangeMin)) * 100)))
    : 50;

  return (
    <div
      onClick={handleClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.25s ease",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 580,
          background: "#0d0f14",
          border: `1px solid ${accentColor}30`,
          borderRadius: 20,
          boxShadow: `0 24px 80px rgba(0,0,0,0.6), 0 0 40px ${accentColor}15`,
          overflow: "hidden",
          transform: visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
          transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
          maxHeight: "90vh", overflowY: "auto",
          scrollbarWidth: "thin", scrollbarColor: `${accentColor}30 transparent`,
        }}
      >
        {/* Top accent bar */}
        <div style={{ height: 3, background: `linear-gradient(90deg, ${accentColor}, transparent)` }} />

        {/* Header */}
        <div style={{
          padding: "24px 28px 20px",
          background: accentBg,
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
          position: "sticky", top: 0, zIndex: 1,
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
              <span style={{ fontFamily: "monospace", fontSize: 22, fontWeight: 900, color: "#fff", letterSpacing: 1 }}>
                {stock.symbol}
              </span>
              {exchange && (
                <span style={{
                  fontSize: 10, fontFamily: "monospace", letterSpacing: 1,
                  color: accentColor, background: `${accentColor}18`,
                  border: `1px solid ${accentColor}40`,
                  padding: "2px 8px", borderRadius: 4,
                }}>
                  {exchange}
                </span>
              )}
              {stock.sc_group && (
                <span style={{
                  fontSize: 10, fontFamily: "monospace",
                  color: "#556", background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  padding: "2px 8px", borderRadius: 4,
                }}>
                  GRP {stock.sc_group}
                </span>
              )}
            </div>
            <div style={{ fontSize: 13, color: "#778", fontFamily: "'Space Grotesk', sans-serif" }}>
              {stock.lname || stock.co_name}
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            style={{
              width: 32, height: 32, borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.05)",
              color: "#778", fontSize: 16, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.15s", flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,77,109,0.15)"; e.currentTarget.style.color = "#ff4d6d"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#778"; }}
          >
            ✕
          </button>
        </div>

        {/* Price hero */}
        <div style={{
          padding: "20px 28px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          display: "flex", alignItems: "flex-end", justifyContent: "space-between",
          flexWrap: "wrap", gap: 12,
        }}>
          <div>
            <div style={{
              fontFamily: "'Orbitron', monospace", fontSize: 36, fontWeight: 900,
              color: "#fff", letterSpacing: -1, lineHeight: 1,
            }}>
              ₹{fmt(closePrice)}
            </div>
            <div style={{ marginTop: 8, fontSize: 14, fontWeight: 700, color: accentColor, fontFamily: "monospace" }}>
              {isUp ? "▲" : "▼"} ₹{fmt(Math.abs(netChg))}
              <span style={{ marginLeft: 8, opacity: 0.8 }}>({fmt(Math.abs(perChg))}%)</span>
            </div>
          </div>

          {/* H/L pills + volume */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { l: "H", v: fmt(highPrice), c: "#00c896" },
                { l: "L", v: fmt(lowPrice),  c: "#ff4d6d" },
              ].map(({ l, v, c }) => (
                <div key={l} style={{
                  fontSize: 12, fontFamily: "monospace",
                  background: `${c}12`, border: `1px solid ${c}30`,
                  borderRadius: 6, padding: "4px 10px", color: c,
                }}>
                  {l}: ₹{v}
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: "#445", fontFamily: "monospace" }}>
              Vol: {fmtVol(volTraded)}
            </div>
          </div>
        </div>

        {/* 52W range bar */}
        <div style={{ padding: "16px 28px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 10, color: "#ff4d6d", fontFamily: "monospace" }}>52W Low: ₹{fmt(week52Low)}</span>
            <span style={{ fontSize: 10, color: "#445",   fontFamily: "monospace" }}>52-Week Range</span>
            <span style={{ fontSize: 10, color: "#00c896", fontFamily: "monospace" }}>52W High: ₹{fmt(week52High)}</span>
          </div>
          <div style={{
            height: 6, background: "rgba(255,255,255,0.06)",
            borderRadius: 3, position: "relative", overflow: "visible",
          }}>
            <div style={{
              position: "absolute", left: 0, top: 0, bottom: 0,
              width: `${rangePct}%`,
              background: `linear-gradient(90deg, #ff4d6d, ${accentColor})`,
              borderRadius: 3, transition: "width 0.6s ease",
            }} />
            <div style={{
              position: "absolute", top: "50%", left: `${rangePct}%`,
              transform: "translate(-50%, -50%)",
              width: 12, height: 12, borderRadius: "50%",
              background: accentColor, boxShadow: `0 0 8px ${accentColor}`,
              border: "2px solid #0d0f14",
            }} />
          </div>
          <div style={{ textAlign: "center", marginTop: 6, fontSize: 10, color: "#556", fontFamily: "monospace" }}>
            Current at {rangePct}% of 52W range
          </div>
        </div>

        {/* Data grid */}
        <div style={{
          padding: "20px 28px 28px",
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: "2px 12px",
        }}>
          {rows.map(({ label, value, color }) => (
            <div key={label} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,0.04)",
            }}>
              <span style={{ fontSize: 11, color: "#556", fontFamily: "monospace", letterSpacing: 0.5 }}>
                {label}
              </span>
              <span style={{ fontSize: 12, fontWeight: 600, color: color || "#ccd", fontFamily: "monospace" }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}