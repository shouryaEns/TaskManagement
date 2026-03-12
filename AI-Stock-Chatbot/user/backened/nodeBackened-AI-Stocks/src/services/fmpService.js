import axios from "axios";

const BASE = "https://financialmodelingprep.com/api/v3";

export async function getQuote(symbol) {
  const res = await axios.get(
    `${BASE}/quote/${symbol}?apikey=${process.env.FMP_API_KEY}`
  );
  return res.data[0];
}

export async function getHistorical(symbol) {
  const res = await axios.get(
    `${BASE}/historical-price-full/${symbol}?apikey=${process.env.FMP_API_KEY}`
  );
  return res.data.historical.slice(0, 200);
}

export async function getNews(symbol) {
  const res = await axios.get(
    `${BASE}/stock_news?tickers=${symbol}&limit=5&apikey=${process.env.FMP_API_KEY}`
  );
  return res.data;
}
