import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createAgent } from "./agent.js";
import { getStockAnalysis } from "./tools/stockPriceTool.js";
import { analyzeStockData,detectIntent,generateAIInsight } from "./utils/analyzeStockData.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.json());

const agent = createAgent();

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  // Detect stock question
  if (message.toLowerCase().includes("price")) {
    const symbol = message.split(" ").pop().toUpperCase();

    const analysis = await getStockAnalysis(symbol);

    if (!analysis) {
      return res.json({ reply: "Stock data not found." });
    }

    const prompt = `
    Stock: ${symbol}
    Current Price: ${analysis.closePrice}
    Previous Close: ${analysis.previousClose}
    Change: ${analysis.change}
    Change Percent: ${analysis.changePercent}%
    Volume: ${analysis.volume}
    Trend: ${analysis.trend}

    Explain this in simple language and give suggestion.`;

    const reply = await agent.invoke(prompt);
    return res.json({ reply });
  }

  // Normal chat
  const reply = await agent.invoke(message);
  res.json({ reply });
});

app.post("/api/chat/2", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const symbol = 'RELIANCE.BSE'
    if (!symbol) {
      return res.json({ message: "Please provide a valid stock symbol." });
    }

    const intent = detectIntent(userMessage);
    const apiResponse = await getStockAnalysis(symbol);

    const structuredResponse = {
      stock: {
        name: symbol,
        currentPrice: apiResponse.closePrice,
        dayChange: apiResponse.change,
        changePercent: apiResponse.changePercent,
        volume: apiResponse.volume,
        trend: apiResponse.trend,
        lastUpdated: apiResponse.lastRefreshed
      },

      technical: {
        trend: apiResponse.trend,
        rsi: 62,
        support: apiResponse.closePrice - 70,
        resistance: apiResponse.closePrice + 50
      },

      fundamental: {
        peRatio: 24.3,
        debtToEquity: 0.42,
        roe: 19,
        revenueGrowth: "8.2%"
      },

      aiInsight: generateAIInsight(apiResponse, intent),
      riskNote: "⚠️ This is AI-generated analysis. Not financial advice."
    };
    const prompt = `
    You are a professional stock market research analyst.

    Analyze the following stock data and respond in this format:

    1. Short Summary
    2. Technical Trend Insight
    3. Risk Level (Low/Medium/High)
    4. Short Term Outlook (1-2 weeks)
    5. Long Term Outlook (3-6 months)
    6. Suggested Strategy (Investor / Trader)

    Stock Data:${JSON.stringify(apiResponse, null, 2)}`;

    const reply = await agent.invoke(prompt);

    res.json({ structuredResponse, BdzAI: reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});


app.get("/", (req, res) => {
  res.send("Welcome to the Stock Chatbot API");
});

app.get("/get-stock-news", async (req, res) => {
  const news = await getStockNews();
  res.json({ news });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
