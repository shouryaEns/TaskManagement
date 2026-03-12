import { DynamicTool } from "@langchain/core/tools";
import { getNews } from "../services/fmpService.js";

export const newsTool = new DynamicTool({
  name: "get_stock_news",
  description: "Get latest stock news",
  func: async (symbol) => {
    const news = await getNews(symbol);
    return news.map(n => `• ${n.title}`).join("\n");
  }
});
