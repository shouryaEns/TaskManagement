import { useState } from "react";
import Navbar from "./components/layout/Navbar";
import TickerTape from "./components/layout/TickerTape";
import Dashboard from "./pages/Dashboard";
import Markets from "./pages/Markets";
import News from "./pages/News";
import Portfolio from "./pages/Portfolio";
import ChatbotPage from "./pages/ChatbotPage";
import SearchResults from "./pages/SearchResults";
import StockDetail from "./components/stocks/StockDetail";
import AuthPage from "./components/auth/AuthPage";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [selectedStock, setSelectedStock] = useState(null);
  const [searchQuery, setSearchQuery] = useState(null);
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);

  const handleSearch = (query) => { setSearchQuery(query); setActivePage("search"); };
  const handleSelectPage = (page) => { setActivePage(page); setSearchQuery(null); };
  const handleLogin = (data) => { setUser(data); setShowAuth(false); };
  const handleLogout = () => { setUser(null); setActivePage("dashboard"); };

  const renderPage = () => {
    if (activePage === "search") return <SearchResults query={searchQuery} onSelectStock={setSelectedStock} />;
    switch (activePage) {
      case "dashboard": return <Dashboard onSelectStock={setSelectedStock} />;
      case "markets":   return <Markets onSelectStock={setSelectedStock} />;
      case "news":      return <News />;
      case "portfolio": return <Portfolio />;
      case "chatbot":   return <ChatbotPage />;
      default:          return <Dashboard onSelectStock={setSelectedStock} />;
    }
  };

  if (showAuth) return <AuthPage onLogin={handleLogin} onBack={() => setShowAuth(false)} />;

  return (
    <div style={{ minHeight: "100vh", background: "#080b12", color: "#fff" }}>
      <Navbar
        activePage={activePage}
        setActivePage={handleSelectPage}
        onSearch={handleSearch}
        user={user}
        onLoginClick={() => setShowAuth(true)}
        onLogout={handleLogout}
      />
      <TickerTape />
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 24px" }}>
        {renderPage()}
      </div>
      {selectedStock && (
        <StockDetail stock={selectedStock} onClose={() => setSelectedStock(null)} />
      )}
    </div>
  );
}