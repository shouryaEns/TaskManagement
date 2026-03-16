import { useState, useEffect, useRef, useCallback } from "react";

export default function Navbar({ activePage, setActivePage, onSearch, user, onLoginClick, onLogout }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const debounceTimer = useRef(null);
  const wrapperRef = useRef(null);
  const userMenuRef = useRef(null);

  const navItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "markets",   label: "Markets"   },
    { id: "news",      label: "News"      },
    { id: "portfolio", label: "Portfolio" },
    { id: "chatbot",   label: "AI Assistant" },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setShowDropdown(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setShowUserMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchStocks = useCallback(async (q) => {
    if (!q.trim()) { setResults([]); setShowDropdown(false); return; }
    try {
      setLoading(true);
      const res = await fetch(`http://127.0.0.1:8000/market/search_stock?search=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.status && json.data?.dataList) {
        setResults(json.data.dataList);
        setShowDropdown(true);
      } else {
        setResults([]); setShowDropdown(false);
      }
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceTimer.current);
    if (!val.trim()) { setResults([]); setShowDropdown(false); return; }
    debounceTimer.current = setTimeout(() => searchStocks(val), 500);
  };

  const handleSelect = (stock) => {
    onSearch?.(stock);
    setQuery(stock.coName);
    setShowDropdown(false);
    setResults([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (results.length > 0) handleSelect(results[0]);
  };

  const isUp = (stock) => parseFloat(stock.chng) >= 0;

  const getInitials = () => {
    if (!user) return "";
    const name = user.username || user.email || "";
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <nav style={{
      background: "rgba(10,12,20,0.95)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(0,200,150,0.15)",
      position: "sticky", top: 0, zIndex: 100,
      padding: "0 24px",
    }}>
      <div style={{
        maxWidth: 1400, margin: "0 auto",
        display: "flex", alignItems: "center",
        justifyContent: "space-between", height: 64,
      }}>

        {/* ── Logo ── */}
        <div onClick={() => setActivePage("dashboard")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #00c896, #00a3ff)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 900, color: "#000",
          }}>EW</div>
          <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 18, fontWeight: 700, color: "#fff", letterSpacing: 1 }}>
            Ens<span style={{ color: "#00c896" }}>Wealth</span>
          </span>
        </div>

        {/* ── Nav Links ── */}
        <div style={{ display: "flex", gap: 4 }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActivePage(item.id)} style={{
              background: activePage === item.id ? "rgba(0,200,150,0.15)" : "transparent",
              border: activePage === item.id ? "1px solid rgba(0,200,150,0.4)" : "1px solid transparent",
              color: activePage === item.id ? "#00c896" : "#8899aa",
              padding: "8px 16px", borderRadius: 8, cursor: "pointer",
              fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 500,
              transition: "all 0.2s",
            }}>{item.label}</button>
          ))}
        </div>

        {/* ── Right side: Search + Go + Divider + Auth ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>

          {/* Search form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div ref={wrapperRef} style={{ position: "relative" }}>
              <span style={{
                position: "absolute", left: 10, top: "50%",
                transform: "translateY(-50%)", color: "#556", zIndex: 1,
              }}>
                {loading ? "⏳" : "🔍"}
              </span>
              <input
                value={query}
                onChange={handleChange}
                onFocus={() => results.length > 0 && setShowDropdown(true)}
                placeholder="Search stocks..."
                autoComplete="off"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${showDropdown && results.length > 0 ? "rgba(0,200,150,0.4)" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: showDropdown && results.length > 0 ? "8px 8px 0 0" : 8,
                  padding: "8px 28px 8px 32px", color: "#fff",
                  fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, width: 200,
                  outline: "none", transition: "border-color 0.2s",
                }}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => { setQuery(""); setResults([]); setShowDropdown(false); }}
                  style={{
                    position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", color: "#556",
                    cursor: "pointer", fontSize: 14, padding: 0,
                  }}
                >✕</button>
              )}

              {/* Search dropdown */}
              {showDropdown && (
                <div style={{
                  position: "absolute", top: "100%", left: 0, right: 0,
                  background: "#0d0f14",
                  border: "1px solid rgba(0,200,150,0.3)", borderTop: "none",
                  borderRadius: "0 0 12px 12px",
                  boxShadow: "0 16px 40px rgba(0,0,0,0.6)",
                  zIndex: 200, maxHeight: 360, overflowY: "auto",
                  scrollbarWidth: "thin", scrollbarColor: "rgba(0,200,150,0.3) transparent",
                }}>
                  <div style={{
                    padding: "6px 14px", fontSize: 10, color: "#445",
                    fontFamily: "monospace", letterSpacing: 0.8,
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                  }}>
                    {results.length} RESULT{results.length !== 1 ? "S" : ""} FOUND
                  </div>

                  {results.length === 0 ? (
                    <div style={{ padding: "16px 14px", textAlign: "center", fontSize: 12, color: "#445", fontFamily: "monospace" }}>
                      No stocks found
                    </div>
                  ) : results.map((stock, i) => {
                    const up = isUp(stock);
                    const chngColor = up ? "#00c896" : "#ff4d6d";
                    return (
                      <div
                        key={stock.coCode || i}
                        onClick={() => handleSelect(stock)}
                        style={{
                          padding: "10px 14px", cursor: "pointer",
                          borderBottom: i < results.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                          transition: "background 0.15s",
                          display: "flex", justifyContent: "space-between",
                          alignItems: "center", gap: 12,
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(0,200,150,0.06)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        {/* Left — symbol + name */}
                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                            <span style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: "#dde", letterSpacing: 0.5 }}>
                              {stock.symbol}
                            </span>
                            <span style={{
                              fontSize: 9, fontFamily: "monospace", color: "#00c896",
                              background: "rgba(0,200,150,0.1)", border: "1px solid rgba(0,200,150,0.25)",
                              padding: "1px 5px", borderRadius: 3, textTransform: "uppercase", letterSpacing: 0.5,
                            }}>
                              {stock.exchange}
                            </span>
                            {stock.mCapType && (
                              <span style={{
                                fontSize: 9, fontFamily: "monospace", color: "#445",
                                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                                padding: "1px 5px", borderRadius: 3,
                              }}>
                                {stock.mCapType}
                              </span>
                            )}
                          </div>
                          <div style={{
                            fontSize: 11, color: "#667", fontFamily: "'Space Grotesk', sans-serif",
                            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 160,
                          }}>
                            {stock.coName}
                          </div>
                          {stock.sectorName && (
                            <div style={{ fontSize: 10, color: "#445", fontFamily: "monospace", marginTop: 1 }}>
                              {stock.sectorName}
                            </div>
                          )}
                        </div>

                        {/* Right — price + change */}
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "#eee", fontFamily: "monospace" }}>
                            ₹{parseFloat(stock.price).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                          <div style={{ fontSize: 11, fontWeight: 600, color: chngColor, fontFamily: "monospace" }}>
                            {up ? "▲" : "▼"} {Math.abs(parseFloat(stock.diff)).toFixed(2)}
                            <span style={{ opacity: 0.8, marginLeft: 3 }}>
                              ({Math.abs(parseFloat(stock.chng)).toFixed(2)}%)
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Go button */}
            <button
              type="submit"
              style={{
                background: "linear-gradient(135deg, #00c896, #00a3ff)",
                border: "none", borderRadius: 8, padding: "8px 14px",
                color: "#000", fontWeight: 700, cursor: "pointer", fontSize: 13,
                fontFamily: "'Space Grotesk', sans-serif", transition: "opacity 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >Go</button>
          </form>

          {/* Divider */}
          <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.08)", flexShrink: 0 }} />

          {/* ── Auth block ── */}
          {!user ? (
            <button
              onClick={onLoginClick}
              style={{
                background: "transparent",
                border: "1px solid rgba(0,200,150,0.4)",
                borderRadius: 8, padding: "8px 18px",
                color: "#00c896", fontWeight: 700,
                cursor: "pointer", fontSize: 13,
                fontFamily: "'Space Grotesk', sans-serif",
                letterSpacing: 0.3, whiteSpace: "nowrap",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(0,200,150,0.1)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              Sign In
            </button>
          ) : (
            <div ref={userMenuRef} style={{ position: "relative" }}>
              {/* Avatar pill */}
              <button
                onClick={() => setShowUserMenu(p => !p)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: showUserMenu ? "rgba(0,200,150,0.12)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${showUserMenu ? "rgba(0,200,150,0.4)" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: 10, padding: "6px 12px 6px 6px",
                  cursor: "pointer", transition: "all 0.2s",
                }}
              >
                <div style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: "linear-gradient(135deg, #00c896, #00a3ff)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 900, color: "#000", fontFamily: "monospace",
                }}>
                  {getInitials()}
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#dde", fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.2 }}>
                    {user.username || "User"}
                  </div>
                  <div style={{ fontSize: 10, color: "#445", fontFamily: "monospace" }}>
                    {user.email?.split("@")[0]}
                  </div>
                </div>
                <span style={{ color: "#445", fontSize: 10, marginLeft: 2 }}>
                  {showUserMenu ? "▲" : "▼"}
                </span>
              </button>

              {/* User dropdown */}
              {showUserMenu && (
                <div style={{
                  position: "absolute", top: "calc(100% + 8px)", right: 0,
                  background: "#0d0f14",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 12, overflow: "hidden",
                  boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
                  minWidth: 190, zIndex: 300,
                }}>
                  {/* User info */}
                  <div style={{
                    padding: "14px 16px",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(0,200,150,0.05)",
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#eee", fontFamily: "'Space Grotesk', sans-serif" }}>
                      {user.username || "User"}
                    </div>
                    <div style={{ fontSize: 11, color: "#445", fontFamily: "monospace", marginTop: 2 }}>
                      {user.email}
                    </div>
                  </div>

                  {/* Menu items */}
                  {[
                    { icon: "📊", label: "Portfolio",    page: "portfolio" },
                    { icon: "🤖", label: "AI Assistant", page: "chatbot"   },
                  ].map(item => (
                    <button
                      key={item.label}
                      onClick={() => { setActivePage(item.page); setShowUserMenu(false); }}
                      style={{
                        width: "100%", padding: "11px 16px",
                        background: "transparent", border: "none",
                        display: "flex", alignItems: "center", gap: 10,
                        color: "#aab", cursor: "pointer",
                        fontFamily: "'Space Grotesk', sans-serif", fontSize: 13,
                        transition: "background 0.15s", textAlign: "left",
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <span style={{ fontSize: 14 }}>{item.icon}</span>
                      {item.label}
                    </button>
                  ))}

                  {/* Sign out */}
                  <button
                    onClick={() => { onLogout?.(); setShowUserMenu(false); }}
                    style={{
                      width: "100%", padding: "11px 16px",
                      background: "transparent", border: "none",
                      display: "flex", alignItems: "center", gap: 10,
                      color: "#ff4d6d", cursor: "pointer",
                      fontFamily: "'Space Grotesk', sans-serif", fontSize: 13,
                      transition: "background 0.15s", textAlign: "left",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,77,109,0.06)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <span style={{ fontSize: 14 }}>🚪</span>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}