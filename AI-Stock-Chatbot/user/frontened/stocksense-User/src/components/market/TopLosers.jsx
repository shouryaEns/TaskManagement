import { useState, useEffect, useCallback } from "react";
import StockListCard from "./StockListCard";

const REFRESH_INTERVAL = 5 * 60 * 1000;

export default function TopLosers({ onSelect }) {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStocks = useCallback(async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/market/top_losers");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setStocks(json.data);
      }
    } catch (err) {
      console.error("TopLosers fetch error:", err);
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
      title="Top Losers"
      icon="📉"
      accentColor="#ff4d6d"
      stocks={stocks}
      loading={loading}
      onSelect={onSelect}
    />
  );
}