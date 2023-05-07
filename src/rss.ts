import * as dotenv from 'dotenv';
dotenv.config();

import RSSParser, { Item } from 'rss-parser';
import { ReadFileTool, SerpAPI, Tool, WriteFileTool } from "langchain/tools";
import { HNSWLib } from "langchain/vectorstores";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { AutoGPT } from "langchain/experimental/autogpt";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { BaseFileStore } from "langchain/schema";

import * as fs from "fs";

const localStorage = [];

class RSSTool extends Tool {
  protected async _call(input: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      console.log("*** RSSParser ***");
      console.log('input', input);

      const parser = new RSSParser({ });
      const feed = await parser.parseURL(input);
      localStorage.push(feed)
      resolve(localStorage.length.toString());
    });
  }
  description: string = "Parse RSS feed, returns list of rss items from the feed";
  name: string = "RSSParser";
}

class MyFileStore extends BaseFileStore {
  readFile(path: string): Promise<string> {
    console.log("*** MyFileStore ***");
    console.log('reading file', path);
    return new Promise((resolve, reject) => {
      try {
        const content = fs.readFileSync(path, 'utf8');
        resolve(content);
      } catch (e) {
        console.log(e);
        resolve("")
      }
    });
  }

  writeFile(path: string, contents: string): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log("*** MyFileStore ***");
      console.log('writing file', path);
      try {
        fs.writeFileSync(path, contents);
        resolve();
      } catch (e) {
        console.log(e);
        resolve();
    }
    });
  }

}


const reportRSS = async () => {
  const store = new MyFileStore();
  const tools = [
    new ReadFileTool({ store }),
    new WriteFileTool({ store }),
    //new SerpAPI(process.env.SERP_API_KEY!, { location: "United States", hl: "en", gl: "us", }),
    new RSSTool(),
  ];

  const vectorStore = new HNSWLib(new OpenAIEmbeddings(), {
    space: "cosine",
    numDimensions: 1536
  });

  const autogpt = AutoGPT.fromLLMAndTools(
    new ChatOpenAI({ temperature: 0, verbose: false }),
    tools,
    {
      memory: vectorStore.asRetriever(),
      aiName: "Jimmy",
      aiRole: "Assistant",
    }
  );

  await autogpt.run(["Go to https://hnrss.org/frontpage rss feed, get the items titles and write them to a file"]);

}


(async () => {
  await reportRSS();

  process.exit(0);
})();