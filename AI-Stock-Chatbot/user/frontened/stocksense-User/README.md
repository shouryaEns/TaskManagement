# 📈 StockSense — Indian Stock Market Dashboard

A full-featured React stock market dashboard with AI-powered chat assistant.

## ✨ Features

- **Dashboard** — Market overview, indices, top gainers/losers, news
- **Markets** — Full stock screener with tabs: All, Gainers, Losers, Active, 52W High/Low
- **Stock Detail** — Price chart, key stats, 52-week range with interactive modal
- **News** — Business news with category filters & sentiment tags
- **Portfolio** — Connect Zerodha, Groww, Angel One, Upstox, Dhan, 5paisa
- **AI Chatbot** — Powered by Claude API for real stock market Q&A
- **Search** — Real-time stock search by name/symbol/sector
- **Ticker Tape** — Live scrolling indices at the top

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open http://localhost:5173
```

## 📁 Folder Structure

```
stocksense/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── data/
    │   └── mockData.js          # All static data (stocks, indices, news, brokers)
    ├── pages/
    │   ├── Dashboard.jsx        # Home page with market overview
    │   ├── Markets.jsx          # Full market screener
    │   ├── News.jsx             # Business news page
    │   ├── Portfolio.jsx        # Broker connection & portfolio view
    │   ├── ChatbotPage.jsx      # Full-page AI assistant
    │   └── SearchResults.jsx    # Stock search results
    └── components/
        ├── layout/
        │   ├── Navbar.jsx       # Top navigation + search bar
        │   └── TickerTape.jsx   # Scrolling indices ticker
        ├── market/
        │   └── IndicesBar.jsx   # NIFTY/SENSEX index cards
        ├── stocks/
        │   ├── StockTable.jsx   # Reusable stock list table
        │   └── StockDetail.jsx  # Stock detail modal with chart
        ├── news/
        │   └── NewsSection.jsx  # News list component
        ├── portfolio/
        │   └── PortfolioConnector.jsx  # Broker OAuth flow + holdings
        └── chatbot/
            └── Chatbot.jsx      # AI chatbot using Claude API
```

## 🤖 AI Chatbot

The chatbot calls the Anthropic Claude API directly. The API key is handled by the environment.
For local dev, the request will proxy correctly if you're running through the Claude artifact environment.

## 📊 Data

All data in `src/data/mockData.js` is static/mock. To connect real data:
- NSE/BSE data: Use NSE India API or a market data provider
- News: Integrate Google News API or Economic Times RSS
- Portfolio: Implement OAuth with each broker's API

## 🎨 Design

- Dark theme with green/teal accent (`#00c896`)
- Fonts: Orbitron (headers) + Space Grotesk (body)
- Fully responsive grid layouts
