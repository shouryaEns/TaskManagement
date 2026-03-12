import { DynamicTool } from "@langchain/core/tools";
import { RSI } from "technicalindicators";
import { getHistorical } from "../services/fmpService.js";

export const rsiTool = new DynamicTool({
  name: "get_rsi",
  description: "Get RSI(14) indicator",
  func: async (symbol) => {
    const data = await getHistorical(symbol);
    const closes = data.map(d => d.close);
    const rsi = RSI.calculate({ period: 14, values: closes });
    return `RSI(14) for ${symbol}: ${rsi.at(-1)}`;
  }
});
