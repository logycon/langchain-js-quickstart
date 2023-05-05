// https://js.langchain.com/docs/getting-started/guide-llm

import * as dotenv from "dotenv";
dotenv.config()

import { OpenAI} from "langchain/llms/openai";
import { ConversationChain, LLMChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import { SerpAPI } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { BufferMemory } from "langchain/memory";

const promptTemplate = async () => {
    const model = new OpenAI({ temperature: 0.9});

    const template = "What's a good book to read about {subject}?";
    const prompt = new PromptTemplate({
        template: template,
        inputVariables: ["subject"],
    })

    const chain = new LLMChain({ llm: model, prompt: prompt });
    const res = await chain.call({ subject: "AI software development" });

    console.log(res);
}

const agents = async () => {
    const model = new OpenAI({ temperature: 0, verbose: true });
    const tools = [
        new SerpAPI(process.env.SERP_API_KEY, {
            location: "Rockville,Maryland,United States",
            hl: "en",
            gl: "us",
        }),
        new Calculator(),
    ];

    const executor = await initializeAgentExecutorWithOptions(tools, model, {
       agentType: "zero-shot-react-description"
    });
    console.log("Loaded Agent.");

    const input = "What's Jupiter's closes moon? " +
        "How long would it take to get there by Starship Enterprise?";
    console.log(`Asking ${input}`);
    const result = await executor.call({ input });

    console.log(result);
}

const memory = async () => {
    const model = new OpenAI({ temperature: 0, verbose: true });
    const memory = new BufferMemory()
    const chain = new ConversationChain({ llm: model, memory: memory });

    const res1 = await chain.call({ input: "Today is may 5 1975" });
    console.log(res1);

    const res2 = await chain.call({ input: "What day is it?" });
    console.log(res2);

    const res3 = await chain.call({ input: "What interesting events happened today?" });
    console.log(res3);
}

const stream = async () => {
    const chat = new OpenAI({
        temperature: 0, verbose: false,
        streaming: true,
        callbacks: [
          {
              handleLLMNewToken(token: string) {
                  process.stdout.write(token);
              },
          }
        ]
    });

    await chat.call("Hello, how are you?");
}


(async () => {
    // await promptTemplate()
    // await agents();
    // await memory();
    await stream();

    process.exit(0);
})()


