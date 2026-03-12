import { useState, useEffect, useCallback } from "react";
import StockListCard from "./StockListCard";

const REFRESH_INTERVAL = 5 * 60 * 1000;
const ROW_HEIGHT = 45;
const VISIBLE_ROWS = 5;

export default function TopGainers({ onSelect }) {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStocks = useCallback(async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/market/top_gainers");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setStocks(json.data);
      }
    } catch (err) {
      console.error("TopGainers fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStocks();
    const interval = setInterval(fetchStocks, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchStocks]);

  return (
    <StockListCard
      title="Top Gainers"
      icon="🚀"
      accentColor="#00c896"
      stocks={stocks}
      loading={loading}
      onSelect={onSelect}
    />
  );
}