import dotenv from "dotenv";
dotenv.config();

import { LocationTool } from "./tools";
import { OpenAI } from "langchain/llms/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";

const location = async () => {
  const tools = [
    new LocationTool(),
  ];

  const llm = new OpenAI({ temperature: 0.5, verbose: true })
  const agent = await initializeAgentExecutorWithOptions(tools, llm, {
    agentType: "zero-shot-react-description",
  });

  const res = await agent.call({ input: "Where am i?"});
  console.log(res.output);
}


(async () => {
  await location();

  process.exit(0);
})();