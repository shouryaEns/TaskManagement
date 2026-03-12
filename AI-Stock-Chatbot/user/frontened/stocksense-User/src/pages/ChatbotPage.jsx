import Chatbot from "../components/chatbot/Chatbot";

export default function ChatbotPage() {
  return (
    <div style={{ padding: "28px 0" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Orbitron', monospace", fontSize: 24, fontWeight: 900, color: "#fff", marginBottom: 4 }}>AI Market Assistant</h1>
        <p style={{ color: "#556", fontFamily: "'Space Grotesk', sans-serif", fontSize: 13 }}>Ask anything about stocks, markets, and investing</p>
      </div>
      <Chatbot fullPage={true} />
    </div>
  );
}
