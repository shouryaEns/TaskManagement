import { DynamicTool } from "@langchain/core/tools";
import { getHistorical } from "../services/fmpService.js";

export const historyTool = new DynamicTool({
  name: "get_stock_history",
  description: "Get historical prices",
  func: async (symbol) => {
    const data = await getHistorical(symbol);
    return JSON.stringify(data.slice(0, 30));
  }
});