// // import { ChatOpenAI } from "@langchain/openai";
// import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

// // import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
// import { createToolCallingAgent, AgentExecutor } from "langchain/agents";

// import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";

// import { priceTool } from "./tools/priceTool.js";
// import { historyTool } from "./tools/historyTool.js";
// import { rsiTool } from "./tools/indicatorTool.js";
// import { newsTool } from "./tools/newsTool.js";

// export async function createAgent() {
// //Open AI using
// //   const model = new ChatOpenAI({
// //     modelName: "gpt-4o-mini",
// //     temperature: 0
// //   });

// //Gen AI using
// const model = new ChatGoogleGenerativeAI({
//   apiKey: process.env.GEMINI_API_KEY,
//   model: "gemini-2.0-flash",
//   temperature: 0
// });


//   const tools = [priceTool, historyTool, rsiTool, newsTool];

//   const prompt = ChatPromptTemplate.fromMessages([
//     ["system", "You are a helpful stock market assistant."],
//     ["human", "{input}"],
//     new MessagesPlaceholder("agent_scratchpad")
//   ]);

// //   const agent = await createOpenAIFunctionsAgent({
// //     llm: model,
// //     tools,
// //     prompt
// //   });
// const agent = await createToolCallingAgent({
//   llm: model,
//   tools,
//   prompt
// });

//   return new AgentExecutor({
//     agent,
//     tools,
//     verbose: true
//   });
// }


// src/agent.js

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export const createAgent = () => {
  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: process.env.GEMINI_API_KEY,
    temperature: 0.7,
  });

  return {
    async invoke(input) {
      const messages = [
        new SystemMessage(
          "You are a helpful stock market assistant. Answer in simple language."
        ),
        new HumanMessage(input),
      ];

      const response = await model.invoke(messages);
      return response.content;
    },
  };
};

export const AnswerAgent = () => {
  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: process.env.GEMINI_API_KEY,
    temperature: 0.7,
  });

  return {
    async invoke(input) {
      const messages = [
        new SystemMessage(
          "You are a helpful stock market assistant. Answer in simple language."
        ),
        new HumanMessage(input),
      ];

      const response = await model.invoke(messages);
      return response.content;
    },
  };
};