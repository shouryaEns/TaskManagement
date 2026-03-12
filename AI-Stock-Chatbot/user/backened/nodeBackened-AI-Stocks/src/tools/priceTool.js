import { DynamicTool } from "@langchain/core/tools";
import { getQuote } from "../services/fmpService.js";

export const priceTool = new DynamicTool({
  name: "get_stock_price",
  description: "Get current stock price",
  func: async (symbol) => {
    const data = await getQuote(symbol);
    return `Current price of ${symbol}: ₹${data.price}`;
  }
});
