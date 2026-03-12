import { useState, useRef, useEffect } from "react";

const suggestions = [
  "What is NIFTY 50?",
  "How to analyze a stock?",
  "What is P/E ratio?",
  "Explain SIP vs Lump Sum",
  "Best sectors to invest now",
  "What is circuit breaker?",
];

// ── Markdown renderer ──────────────────────────────────────────────
function renderMarkdown(text) {
  const lines = text.split("\n");
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines
    if (!line.trim()) { i++; continue; }

    // Horizontal rule ---
    if (/^---+$/.test(line.trim())) {
      elements.push(
        <hr key={i} style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.08)", margin: "10px 0" }} />
      );
      i++; continue;
    }

    // Heading ## or ###
    if (/^#{1,3}\s/.test(line)) {
      const level = line.match(/^(#+)/)[1].length;
      const content = line.replace(/^#+\s/, "");
      elements.push(
        <div key={i} style={{
          fontWeight: 700, color: "#00c896",
          fontSize: level === 1 ? 15 : level === 2 ? 14 : 13,
          marginTop: 10, marginBottom: 4,
          fontFamily: "'Space Grotesk', sans-serif",
        }}>
          {inlineFormat(content)}
        </div>
      );
      i++; continue;
    }

    // Bullet list: lines starting with * or -
    if (/^\s*[\*\-]\s+/.test(line) && !/^\*\*/.test(line.trim())) {
      const listItems = [];
      while (i < lines.length && /^\s*[\*\-]\s+/.test(lines[i])) {
        listItems.push(lines[i].replace(/^\s*[\*\-]\s+/, ""));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} style={{ margin: "6px 0", paddingLeft: 0, listStyle: "none" }}>
          {listItems.map((item, j) => (
            <li key={j} style={{
              display: "flex", gap: 8, alignItems: "flex-start",
              marginBottom: 5, fontSize: 13, color: "#bbc",
              fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.6,
            }}>
              <span style={{ color: "#00c896", marginTop: 2, flexShrink: 0 }}>▸</span>
              <span>{inlineFormat(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Numbered list
    if (/^\d+\.\s/.test(line)) {
      const listItems = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        listItems.push(lines[i].replace(/^\d+\.\s/, ""));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} style={{ margin: "6px 0", paddingLeft: 0, listStyle: "none", counterReset: "item" }}>
          {listItems.map((item, j) => (
            <li key={j} style={{
              display: "flex", gap: 8, alignItems: "flex-start",
              marginBottom: 5, fontSize: 13, color: "#bbc",
              fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.6,
            }}>
              <span style={{
                color: "#00a3ff", flexShrink: 0, fontWeight: 700,
                fontFamily: "monospace", minWidth: 18,
              }}>{j + 1}.</span>
              <span>{inlineFormat(item)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Normal paragraph
    elements.push(
      <p key={i} style={{
        margin: "4px 0", fontSize: 13, color: "#bbc",
        fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.7,
      }}>
        {inlineFormat(line)}
      </p>
    );
    i++;
  }

  return elements;
}

// Inline formatting: **bold**, *italic*, `code`
function inlineFormat(text) {
  const parts = [];
  // Split on **bold**, *italic*, `code`
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let last = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const raw = match[0];
    if (raw.startsWith("**")) {
      parts.push(<strong key={match.index} style={{ color: "#eef", fontWeight: 700 }}>{raw.slice(2, -2)}</strong>);
    } else if (raw.startsWith("*")) {
      parts.push(<em key={match.index} style={{ color: "#aac", fontStyle: "italic" }}>{raw.slice(1, -1)}</em>);
    } else if (raw.startsWith("`")) {
      parts.push(
        <code key={match.index} style={{
          background: "rgba(0,200,150,0.1)", border: "1px solid rgba(0,200,150,0.2)",
          borderRadius: 4, padding: "1px 6px", fontSize: 12,
          fontFamily: "monospace", color: "#00c896",
        }}>{raw.slice(1, -1)}</code>
      );
    }
    last = match.index + raw.length;
  }

  if (last < text.length) parts.push(text.slice(last));
  return parts.length > 0 ? parts : text;
}
// ──────────────────────────────────────────────────────────────────

export default function Chatbot({ fullPage = false }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm **StockSense AI** 🤖\n\nI can help you with:\n* Stock analysis & market trends\n* Investment strategies\n* NSE/BSE concepts\n* Portfolio advice\n\nWhat would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userText }]);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const reply = data.reply || data.message || data.response || data.content
        || "Sorry, I couldn't process that. Please try again.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error("Chat API error:", err);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "⚠️ Connection error. Make sure the chat server is running on `localhost:5000`.",
      }]);
    }
    setLoading(false);
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      height: fullPage ? "calc(100vh - 180px)" : 500,
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 16, overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        padding: "16px 20px", background: "rgba(0,200,150,0.08)",
        borderBottom: "1px solid rgba(0,200,150,0.15)",
        display: "flex", alignItems: "center", gap: 10, flexShrink: 0,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: "linear-gradient(135deg,#00c896,#00a3ff)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
        }}>🤖</div>
        <div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: "#00c896", fontSize: 14 }}>
            StockSense AI
          </div>
          <div style={{ fontSize: 11, color: "#445" }}>Powered by Claude · Always Online</div>
        </div>
        <div style={{
          marginLeft: "auto", width: 8, height: 8, borderRadius: "50%",
          background: "#00c896", boxShadow: "0 0 6px #00c896",
        }} />
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: "auto", padding: "16px",
        display: "flex", flexDirection: "column", gap: 14,
        scrollbarWidth: "thin", scrollbarColor: "rgba(0,200,150,0.2) transparent",
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: "flex",
            justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            alignItems: "flex-end", gap: 8,
          }}>
            {msg.role === "assistant" && (
              <div style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                background: "linear-gradient(135deg,#00c896,#00a3ff)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13,
              }}>🤖</div>
            )}

            <div style={{
              maxWidth: "82%",
              padding: msg.role === "user" ? "10px 14px" : "12px 16px",
              borderRadius: 14,
              borderBottomLeftRadius:  msg.role === "assistant" ? 4 : 14,
              borderBottomRightRadius: msg.role === "user"      ? 4 : 14,
              background: msg.role === "user"
                ? "linear-gradient(135deg, #00c896, #00a3ff)"
                : "rgba(255,255,255,0.04)",
              border: msg.role === "assistant"
                ? "1px solid rgba(255,255,255,0.07)" : "none",
              color: msg.role === "user" ? "#000" : "#ccd",
              fontWeight: msg.role === "user" ? 600 : 400,
            }}>
              {msg.role === "user"
                ? <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13 }}>{msg.content}</span>
                : <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {renderMarkdown(msg.content)}
                  </div>
              }
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: "linear-gradient(135deg,#00c896,#00a3ff)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13,
            }}>🤖</div>
            <div style={{
              display: "flex", gap: 5, padding: "12px 16px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "14px 14px 14px 4px",
            }}>
              {[0, 1, 2].map(j => (
                <div key={j} style={{
                  width: 6, height: 6, borderRadius: "50%", background: "#00c896",
                  animation: `bounce 1.2s ${j * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div style={{ padding: "0 16px 10px", display: "flex", flexWrap: "wrap", gap: 6, flexShrink: 0 }}>
          {suggestions.map(s => (
            <button key={s} onClick={() => sendMessage(s)} style={{
              background: "rgba(0,200,150,0.08)", border: "1px solid rgba(0,200,150,0.2)",
              color: "#00c896", padding: "4px 10px", borderRadius: 20, cursor: "pointer",
              fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 500,
              transition: "background 0.15s",
            }}>{s}</button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{
        padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.07)",
        display: "flex", gap: 8, flexShrink: 0,
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !loading && sendMessage()}
          placeholder="Ask about stocks, markets, strategies..."
          disabled={loading}
          style={{
            flex: 1, background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10,
            padding: "10px 14px", color: "#fff",
            fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, outline: "none",
            opacity: loading ? 0.6 : 1,
          }}
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          style={{
            background: input.trim() && !loading
              ? "linear-gradient(135deg,#00c896,#00a3ff)"
              : "rgba(255,255,255,0.05)",
            border: "none", borderRadius: 10, width: 42,
            cursor: input.trim() && !loading ? "pointer" : "default",
            color: input.trim() && !loading ? "#000" : "#445",
            fontSize: 18, transition: "all 0.2s",
          }}
        >↑</button>
      </div>

      <style>{`
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }
        div::-webkit-scrollbar { width: 4px; }
        div::-webkit-scrollbar-track { background: transparent; }
        div::-webkit-scrollbar-thumb { background: rgba(0,200,150,0.2); border-radius: 2px; }
      `}</style>
    </div>
  );
}