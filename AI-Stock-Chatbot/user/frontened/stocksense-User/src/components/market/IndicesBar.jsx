import { useState, useEffect, useRef, useCallback } from "react";

const CARDS_PER_PAGE = 6;
const SWIPE_INTERVAL = 10000;
const REFRESH_INTERVAL = 5 * 60 * 1000;

export default function IndicesBar({ onSelectIndex }) {
  const [indices, setIndices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState("left");
  const [isPaused, setIsPaused] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const swipeTimer = useRef(null);
  const refreshTimer = useRef(null);
  const touchStartX = useRef(null);

  const totalPages = Math.ceil(indices.length / CARDS_PER_PAGE);

  const fetchIndices = useCallback(async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/market/indices");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setIndices(json.data);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error("Failed to fetch indices:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const goToPage = useCallback((nextPage, dir = "left") => {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setCurrentPage(nextPage);
      setAnimating(false);
    }, 320);
  }, [animating]);

  const nextPage = useCallback(() => {
    if (totalPages <= 1) return;
    goToPage((currentPage + 1) % totalPages, "left");
  }, [currentPage, totalPages, goToPage]);

  const prevPage = useCallback(() => {
    if (totalPages <= 1) return;
    goToPage((currentPage - 1 + totalPages) % totalPages, "right");
  }, [currentPage, totalPages, goToPage]);

  useEffect(() => {
    if (isPaused || totalPages <= 1) return;
    swipeTimer.current = setInterval(nextPage, SWIPE_INTERVAL);
    return () => clearInterval(swipeTimer.current);
  }, [isPaused, nextPage, totalPages]);

  useEffect(() => {
    fetchIndices();
    refreshTimer.current = setInterval(fetchIndices, REFRESH_INTERVAL);
    return () => clearInterval(refreshTimer.current);
  }, [fetchIndices]);

  const visibleCards = indices.slice(
    currentPage * CARDS_PER_PAGE,
    currentPage * CARDS_PER_PAGE + CARDS_PER_PAGE
  );

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? nextPage() : prevPage();
    touchStartX.current = null;
  };

  const formatTime = (date) =>
    date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 80, color: "#556", fontFamily: "monospace", fontSize: 12, letterSpacing: 1 }}>
      <span style={{ marginRight: 8, animation: "pulse 1s infinite", display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#f59e0b", boxShadow: "0 0 8px #f59e0b" }} />
      LOADING INDICES...
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.2}}`}</style>
    </div>
  );

  return (
    <div
      style={{ marginBottom: 28, userSelect: "none" }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "#00c896", boxShadow: "0 0 8px #00c896",
          }} />
          <span style={{ fontSize: 10, color: "#445", fontFamily: "monospace", letterSpacing: 1 }}>
            LIVE · {formatTime(lastUpdated)}
          </span>
          {/* <span style={{ fontSize: 10, color: "#334", fontFamily: "monospace", letterSpacing: 0.5 }}>
            {currentPage + 1} / {totalPages}
          </span> */}
        </div>

        {/* Prev / Next arrows */}
        <div style={{ display: "flex", gap: 6 }}>
          {["‹", "›"].map((arrow, i) => (
            <button key={i} onClick={i === 0 ? prevPage : nextPage} style={{
              width: 26, height: 26, borderRadius: 6,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.03)",
              color: "#aaa", fontSize: 16, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s", lineHeight: 1,
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,200,150,0.1)"; e.currentTarget.style.color = "#00c896"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.color = "#aaa"; }}
            >{arrow}</button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div style={{ overflow: "hidden", position: "relative" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: 12,
          transform: animating
            ? `translateX(${direction === "left" ? "-3%" : "3%"})`
            : "translateX(0)",
          opacity: animating ? 0 : 1,
          transition: "transform 0.32s cubic-bezier(0.4,0,0.2,1), opacity 0.32s ease",
        }}>
          {visibleCards.map((idx, i) => {
            const isUp = idx.Change >= 0;
            return (
              <div
                key={idx.IndexCode?.trim() || i}
                onClick={() => onSelectIndex?.(idx)}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 12, padding: "14px 16px",
                  cursor: "pointer", transition: "border-color 0.2s, transform 0.2s",
                  position: "relative", overflow: "hidden",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = isUp ? "rgba(0,200,150,0.4)" : "rgba(255,77,109,0.4)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ fontSize: 10, color: "#556", fontFamily: "monospace", marginBottom: 5, letterSpacing: 0.8, textTransform: "uppercase", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {idx.aliasname}
                </div>
                <div style={{ fontSize: 17, fontWeight: 700, color: "#e8e8e8", fontFamily: "'Orbitron', monospace", letterSpacing: -0.5 }}>
                  {idx.Last?.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: isUp ? "#00c896" : "#ff4d6d", marginTop: 5, fontFamily: "monospace" }}>
                  {isUp ? "▲" : "▼"} {Math.abs(idx.PriceDiff).toFixed(2)}
                  <span style={{ opacity: 0.8, marginLeft: 4 }}>({Math.abs(idx.Change).toFixed(2)}%)</span>
                </div>
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
                  background: isUp
                    ? "linear-gradient(90deg, #00c896, transparent)"
                    : "linear-gradient(90deg, #ff4d6d, transparent)",
                }} />
                <div style={{
                  position: "absolute", top: 8, right: 8,
                  fontSize: 8, color: isUp ? "#00c896" : "#ff4d6d",
                  opacity: 0.5, fontFamily: "monospace", letterSpacing: 0.5,
                }}>
                  {idx.Exchange}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginTop: 10, height: 2, background: "rgba(255,255,255,0.05)", borderRadius: 1, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 1,
          background: "linear-gradient(90deg, #00c896, #00e0aa)",
          width: `${((currentPage + 1) / totalPages) * 100}%`,
          transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: "0 0 6px rgba(0,200,150,0.5)",
        }} />
      </div>
    </div>
  );
}