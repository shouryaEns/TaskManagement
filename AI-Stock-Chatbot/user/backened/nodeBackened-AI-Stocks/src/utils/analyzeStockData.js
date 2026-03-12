export function analyzeStockData(apiResponse) {
  // console.log("----- 6 apiResponse inside function -----------", apiResponse);

  // if (apiResponse && apiResponse.symbol && apiResponse.closePrice) {
  //   console.log('condition 1 hitted!')
  //   return apiResponse;
  // }

  if (apiResponse && apiResponse["Time Series (Daily)"] && apiResponse["Meta Data"]) {
    console.log('condition 2 hitted!')
    const timeSeries = apiResponse["Time Series (Daily)"];
    const lastRefreshed = apiResponse["Meta Data"]["3. Last Refreshed"];

    // Sort dates descending (latest first)
    const sortedDates = Object.keys(timeSeries).sort(
      (a, b) => new Date(b) - new Date(a),
    );

    const latestDate = timeSeries[lastRefreshed]
      ? lastRefreshed
      : sortedDates[0];

    const previousDate = sortedDates.find((date) => date !== latestDate);

    const latest = timeSeries[latestDate];
    const previous = timeSeries[previousDate];

    const close = Number(latest["4. close"]);
    const prevClose = Number(previous["4. close"]);

    const change = close - prevClose;
    const changePercent = ((change / prevClose) * 100).toFixed(2);

    return {
      symbol: apiResponse["Meta Data"]["2. Symbol"],
      lastRefreshed: latestDate,

      closePrice: close,
      previousClose: prevClose,

      change: Number(change.toFixed(2)),
      changePercent: Number(changePercent),

      trend: change >= 0 ? "Bullish" : "Bearish",
      volume: Number(latest["5. volume"]),
      Last3Monthdata: apiResponse,
    };
  }

    throw new Error("Invalid stock data format");
}

export function detectIntent(message) {
  const msg = message.toLowerCase();

  return {
    wantsPrice: msg.includes("price") || /\d+/.test(msg),
    wantsBuyAdvice: msg.includes("buy") || msg.includes("should i"),
    wantsTechnical: msg.includes("technical") || msg.includes("rsi") || msg.includes("trend"),
    wantsFundamental: msg.includes("fundamental") || msg.includes("pe") || msg.includes("valuation"),
    mentionedPrice: msg.match(/\d+/)?.[0] || null
  };
}

export function generateAIInsight(analysis, intent) {
  const { closePrice, trend, changePercent } = analysis;

  let insight = `At ₹${closePrice}, the stock shows ${trend} momentum with a ${changePercent}% daily change. `;

  if (intent.wantsBuyAdvice) {
    if (trend === "Bullish") {
      insight += "Short-term momentum is positive. Accumulation on dips near support levels may be considered.";
    } else {
      insight += "Caution advised. Wait for confirmation above resistance before fresh entry.";
    }
  }

  return insight;
}
