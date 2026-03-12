// ─── INDICES ───────────────────────────────────────────────────────────────
export const indices = [
  { id: 'nifty50',    name: 'NIFTY 50',      value: 22541.10, change: 143.55,  pct: 0.64,  color: '#00c896' },
  { id: 'sensex',     name: 'BSE SENSEX',    value: 74119.39, change: 486.50,  pct: 0.66,  color: '#00c896' },
  { id: 'niftybank',  name: 'NIFTY BANK',    value: 48312.65, change: -201.30, pct: -0.41, color: '#ff4d6d' },
  { id: 'niftymid',   name: 'NIFTY MIDCAP',  value: 47823.90, change: 312.40,  pct: 0.66,  color: '#00c896' },
  { id: 'niftyit',    name: 'NIFTY IT',      value: 35621.45, change: 498.20,  pct: 1.42,  color: '#00c896' },
  { id: 'niftyfmcg',  name: 'NIFTY FMCG',   value: 54230.80, change: -123.60, pct: -0.23, color: '#ff4d6d' },
];

// ─── STOCKS ────────────────────────────────────────────────────────────────
export const stocks = [
  { id: 'reliance',  symbol: 'RELIANCE',  name: 'Reliance Industries',    price: 2941.55, change: 42.30,   pct: 1.46,   open: 2905.00, high: 2955.00, low: 2898.00, prev: 2899.25, volume: '12.4M', mktCap: '19.9T', pe: 28.4,  week52High: 3024.90, week52Low: 2180.10, sector: 'Energy',         logo: '🛢️' },
  { id: 'tcs',       symbol: 'TCS',       name: 'Tata Consultancy Svcs',  price: 3789.20, change: 67.50,   pct: 1.82,   open: 3730.00, high: 3812.00, low: 3720.50, prev: 3721.70, volume: '3.1M',  mktCap: '13.8T', pe: 32.1,  week52High: 4045.00, week52Low: 3056.45, sector: 'IT',             logo: '💻' },
  { id: 'hdfc',      symbol: 'HDFCBANK',  name: 'HDFC Bank',              price: 1612.40, change: -18.75,  pct: -1.15,  open: 1635.00, high: 1640.20, low: 1605.30, prev: 1631.15, volume: '9.8M',  mktCap: '12.2T', pe: 19.8,  week52High: 1757.80, week52Low: 1363.55, sector: 'Banking',        logo: '🏦' },
  { id: 'infy',      symbol: 'INFY',      name: 'Infosys',                price: 1789.65, change: 34.20,   pct: 1.95,   open: 1762.00, high: 1798.00, low: 1755.00, prev: 1755.45, volume: '5.2M',  mktCap: '7.4T',  pe: 27.3,  week52High: 1934.00, week52Low: 1351.55, sector: 'IT',             logo: '💡' },
  { id: 'icici',     symbol: 'ICICIBANK', name: 'ICICI Bank',             price: 1098.35, change: 23.10,   pct: 2.15,   open: 1080.00, high: 1105.50, low: 1075.00, prev: 1075.25, volume: '11.3M', mktCap: '7.7T',  pe: 18.2,  week52High: 1196.65, week52Low: 897.50,  sector: 'Banking',        logo: '🏧' },
  { id: 'wipro',     symbol: 'WIPRO',     name: 'Wipro',                  price: 498.75,  change: 9.80,    pct: 2.00,   open: 491.00,  high: 502.30,  low: 488.50,  prev: 488.95,  volume: '4.7M',  mktCap: '2.7T',  pe: 22.5,  week52High: 572.80,  week52Low: 384.50,  sector: 'IT',             logo: '🔧' },
  { id: 'bajfin',    symbol: 'BAJFINANCE',name: 'Bajaj Finance',          price: 7123.90, change: -89.40,  pct: -1.24,  open: 7230.00, high: 7245.00, low: 7100.00, prev: 7213.30, volume: '1.4M',  mktCap: '4.3T',  pe: 35.8,  week52High: 8192.15, week52Low: 6187.80, sector: 'Finance',        logo: '💳' },
  { id: 'hul',       symbol: 'HINDUNILVR',name: 'Hindustan Unilever',     price: 2245.60, change: -32.80,  pct: -1.44,  open: 2285.00, high: 2290.00, low: 2238.00, prev: 2278.40, volume: '2.1M',  mktCap: '5.3T',  pe: 55.2,  week52High: 2767.40, week52Low: 2172.20, sector: 'FMCG',           logo: '🧴' },
  { id: 'sbi',       symbol: 'SBIN',      name: 'State Bank of India',    price: 761.40,  change: 14.60,   pct: 1.96,   open: 748.00,  high: 768.00,  low: 745.00,  prev: 746.80,  volume: '22.1M', mktCap: '6.8T',  pe: 11.5,  week52High: 912.00,  week52Low: 601.50,  sector: 'Banking',        logo: '🏛️' },
  { id: 'lt',        symbol: 'LT',        name: 'Larsen & Toubro',        price: 3489.50, change: 78.20,   pct: 2.29,   open: 3415.00, high: 3498.00, low: 3408.00, prev: 3411.30, volume: '1.8M',  mktCap: '4.9T',  pe: 30.1,  week52High: 3976.00, week52Low: 2754.00, sector: 'Infrastructure', logo: '🏗️' },
  { id: 'sunpharma', symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical',     price: 1534.70, change: -21.30,  pct: -1.37,  open: 1562.00, high: 1568.00, low: 1528.00, prev: 1556.00, volume: '2.6M',  mktCap: '3.7T',  pe: 38.4,  week52High: 1609.00, week52Low: 1098.90, sector: 'Pharma',         logo: '💊' },
  { id: 'adaniport', symbol: 'ADANIPORTS',name: 'Adani Ports & SEZ',      price: 1389.60, change: 45.70,   pct: 3.40,   open: 1345.00, high: 1398.00, low: 1341.00, prev: 1343.90, volume: '5.4M',  mktCap: '3.0T',  pe: 24.8,  week52High: 1620.00, week52Low: 895.00,  sector: 'Infrastructure', logo: '⚓' },
  { id: 'maruti',    symbol: 'MARUTI',    name: 'Maruti Suzuki',          price: 12340.00,change: 234.50,  pct: 1.94,   open: 12115.00,high: 12390.00,low:12090.00, prev:12105.50, volume: '0.8M',  mktCap: '3.7T',  pe: 32.7,  week52High: 13335.00,week52Low: 9651.00, sector: 'Auto',           logo: '🚗' },
  { id: 'tatamotors',symbol: 'TATAMOTORS',name: 'Tata Motors',            price: 965.30,  change: -14.20,  pct: -1.45,  open: 982.00,  high: 985.00,  low: 958.00,  prev: 979.50,  volume: '8.9M',  mktCap: '3.5T',  pe: 15.3,  week52High: 1179.00, week52Low: 601.10,  sector: 'Auto',           logo: '🚙' },
  { id: 'coalindia', symbol: 'COALINDIA', name: 'Coal India',             price: 453.20,  change: 8.90,    pct: 2.00,   open: 445.00,  high: 458.00,  low: 442.00,  prev: 444.30,  volume: '6.3M',  mktCap: '2.8T',  pe: 9.4,   week52High: 501.00,  week52Low: 311.50,  sector: 'Mining',         logo: '⛏️' },
];

// ─── TOP GAINERS ───────────────────────────────────────────────────────────
export const topGainers = stocks
  .filter(s => s.pct > 0)
  .sort((a, b) => b.pct - a.pct)
  .slice(0, 5);

// ─── TOP LOSERS ────────────────────────────────────────────────────────────
export const topLosers = stocks
  .filter(s => s.pct < 0)
  .sort((a, b) => a.pct - b.pct)
  .slice(0, 5);

// ─── MOST ACTIVE ───────────────────────────────────────────────────────────
export const mostActive = [...stocks]
  .sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume))
  .slice(0, 5);

// ─── 52 WEEK HIGH ──────────────────────────────────────────────────────────
export const week52Highs = stocks
  .filter(s => s.price >= s.week52High * 0.97)
  .slice(0, 5);

// ─── 52 WEEK LOW ───────────────────────────────────────────────────────────
export const week52Lows = stocks
  .filter(s => s.price <= s.week52Low * 1.05)
  .slice(0, 5);

// ─── NEWS ──────────────────────────────────────────────────────────────────
export const news = [
  { id: 1, headline: 'RBI Holds Rates Steady at 6.5%, Markets Rally on Positive Cues', source: 'Economic Times', time: '2h ago', category: 'Macro', sentiment: 'positive', excerpt: 'The Reserve Bank of India maintained its benchmark repo rate at 6.5% for the seventh consecutive time, signaling confidence in inflation management while supporting growth.' },
  { id: 2, headline: 'TCS Reports Q3 Revenue Growth of 4.5%, Beats Street Estimates', source: 'Mint', time: '4h ago', category: 'Earnings', sentiment: 'positive', excerpt: 'India\'s largest IT exporter TCS reported revenue of ₹63,973 crore for Q3FY25, a growth of 4.5% year-on-year, beating analyst estimates of ₹62,800 crore.' },
  { id: 3, headline: 'Adani Ports Acquires Colombo Terminal Stake for $553 Million', source: 'Business Standard', time: '5h ago', category: 'Corporate', sentiment: 'positive', excerpt: 'Adani Ports and Special Economic Zone said it will acquire a 51% stake in the Colombo West International Terminal for $553 million, expanding its global footprint.' },
  { id: 4, headline: 'FIIs Turn Net Buyers, Pump ₹8,200 Crore Into Indian Equities', source: 'NDTV Profit', time: '6h ago', category: 'FII/DII', sentiment: 'positive', excerpt: 'Foreign Institutional Investors turned net buyers for the third consecutive session, purchasing ₹8,246 crore worth of Indian equities on Thursday.' },
  { id: 5, headline: 'Bajaj Finance Slips on Concerns Over Rising Credit Costs', source: 'Reuters', time: '7h ago', category: 'Earnings', sentiment: 'negative', excerpt: 'Shares of Bajaj Finance fell over 1% after the NBFC reported a marginal rise in credit costs for Q3, raising concerns about asset quality in consumer loans.' },
  { id: 6, headline: 'SEBI Tightens F&O Rules: New Lot Sizes, Weekly Expiry Limits', source: 'Financial Express', time: '9h ago', category: 'Regulation', sentiment: 'neutral', excerpt: 'The Securities and Exchange Board of India announced sweeping changes to the futures and options framework, increasing minimum lot sizes and capping weekly expiries.' },
  { id: 7, headline: 'Maruti Suzuki Sales Jump 12% YoY in February; SUVs Lead Growth', source: 'Auto Car India', time: '10h ago', category: 'Corporate', sentiment: 'positive', excerpt: 'Maruti Suzuki India reported total wholesale dispatches of 1,89,245 units in February 2025, a 12% increase from the year-ago period, led by strong demand for SUVs.' },
  { id: 8, headline: 'India\'s GDP Growth Seen at 6.8% for FY25: IMF Upgrades Forecast', source: 'Bloomberg Quint', time: '12h ago', category: 'Macro', sentiment: 'positive', excerpt: 'The International Monetary Fund raised India\'s growth forecast for FY25 to 6.8% from 6.5%, citing robust domestic consumption and strong infrastructure spending.' },
];

// ─── CHART DATA ────────────────────────────────────────────────────────────
export const generateChartData = (basePrice, days = 30) => {
  const data = [];
  let price = basePrice * 0.92;
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    price = price * (1 + (Math.random() - 0.48) * 0.025);
    data.push({
      date: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      price: parseFloat(price.toFixed(2)),
    });
  }
  data[data.length - 1].price = basePrice;
  return data;
};

// ─── BROKERS ───────────────────────────────────────────────────────────────
export const brokers = [
  { id: 'zerodha',   name: 'Zerodha',    color: '#387ed1', logo: '🟦', tagline: 'India\'s Largest Broker' },
  { id: 'groww',     name: 'Groww',      color: '#00d09c', logo: '🟩', tagline: 'Investing Made Simple' },
  { id: 'angelone',  name: 'Angel One',  color: '#f04f23', logo: '🟧', tagline: 'Smart Trading Platform' },
  { id: 'upstox',    name: 'Upstox',     color: '#7c3fe4', logo: '🟪', tagline: 'Low Cost Trading' },
  { id: 'dhan',      name: 'Dhan',       color: '#ff6b35', logo: '🔶', tagline: 'Super Fast Trading' },
  { id: 'fivepaisa', name: '5paisa',     color: '#1e90ff', logo: '🔷', tagline: 'Lowest Brokerage' },
];
