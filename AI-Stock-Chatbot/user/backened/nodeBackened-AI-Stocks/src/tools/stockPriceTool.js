// import axios from "axios";

// export async function getStockPrice(symbol) {
//   try {
//     const url = `https://financialmodelingprep.com/api/v4/quote-short/${symbol}?apikey=${process.env.FMP_API_KEY}`;
//     // https://financialmodelingprep.com/stable/profile?symbol=AAPL&apikey=YOUR_API_KEY
//     const res = await axios.get(url);

//     if (!res.data || res.data.length === 0) {
//       return "Stock symbol not found.";
//     }

//     const stock = res.data[0];

//     return `
// Symbol: ${stock.symbol}
// Price: $${stock.price}
// Volume: ${stock.volume}
//     `;
//   } catch (err) {
//     console.error("FMP error:", err.response?.data || err.message);
//     return "Unable to fetch stock price right now.";
//   }
// }


import axios from "axios";
import { analyzeStockData } from "../utils/analyzeStockData.js";

// export async function getStockPrice(symbol) {
//     console.log("-------- 1 symbol ----------:", symbol);
//   try {
//     const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${process.env.ALPHAVANTAGE_API_KEY}`;
//     console.log("-------- 2 url ----------:", url);

//     const response = await axios.get(url);

//     if (!response.data || response.data.status === "error") {
//       return "Stock symbol not found.";
//     }

// //     return `Symbol: ${symbol}
// // Price: $${response.data.price}`;

// const stockResponseData = response.data;
//     console.log("-------- 6 stockResponseData ----------:", stockResponseData);

// return stockResponseData;
//   } catch (error) {
//     console.error("TwelveData error:", error.message);
//     return "Unable to fetch stock price.";
//   }
// }


export async function getStockAnalysis(symbol) {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${process.env.ALPHAVANTAGE_API_KEY}`;

  const response = await axios.get(url);
  const data = response.data;

//   const series = data["Time Series (Daily)"];
  const series = data;

  if (!series) {
    return null;
  }

  return analyzeStockData(series);
}