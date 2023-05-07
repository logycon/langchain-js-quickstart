// https://js.langchain.com/docs/getting-started/guide-chat

import * as dotenv from "dotenv";
dotenv.config();

import { ChatOpenAI} from "langchain/chat_models/openai";
import { HumanChatMessage, SystemChatMessage } from "langchain/schema";

const chat = new ChatOpenAI({ temperature: 0, verbose: true });

const main = async () => {
  const res = await chat.call([
    new SystemChatMessage("You are an experienced kubernetes administrator."),
    new HumanChatMessage("How does Nginx ingress controller work?"),
  ]);
  console.log(res);
}


(async () => {
  await main();

  process.exit(0);
})()