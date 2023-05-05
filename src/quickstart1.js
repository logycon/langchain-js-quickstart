"use strict";
// https://js.langchain.com/docs/getting-started/guide-llm
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const openai_1 = require("langchain/llms/openai");
const chains_1 = require("langchain/chains");
const prompts_1 = require("langchain/prompts");
const tools_1 = require("langchain/tools");
const calculator_1 = require("langchain/tools/calculator");
const agents_1 = require("langchain/agents");
const memory_1 = require("langchain/memory");
const promptTemplate = async () => {
    const model = new openai_1.OpenAI({ temperature: 0.9 });
    const template = "What's a good book to read about {subject}?";
    const prompt = new prompts_1.PromptTemplate({
        template: template,
        inputVariables: ["subject"],
    });
    const chain = new chains_1.LLMChain({ llm: model, prompt: prompt });
    const res = await chain.call({ subject: "AI software development" });
    console.log(res);
};
const agents = async () => {
    const model = new openai_1.OpenAI({ temperature: 0, verbose: true });
    const tools = [
        new tools_1.SerpAPI(process.env.SERP_API_KEY, {
            location: "Rockville,Maryland,United States",
            hl: "en",
            gl: "us",
        }),
        new calculator_1.Calculator(),
    ];
    const executor = await (0, agents_1.initializeAgentExecutorWithOptions)(tools, model, {
        agentType: "zero-shot-react-description"
    });
    console.log("Loaded Agent.");
    const input = "What's Jupiter's closes moon? " +
        "How long would it take to get there by Starship Enterprise?";
    console.log(`Asking ${input}`);
    const result = await executor.call({ input });
    console.log(result);
};
const memory = async () => {
    const model = new openai_1.OpenAI({ temperature: 0, verbose: true });
    const memory = new memory_1.BufferMemory();
    const chain = new chains_1.ConversationChain({ llm: model, memory: memory });
    const res1 = await chain.call({ input: "Today is may 5 1975" });
    console.log(res1);
    const res2 = await chain.call({ input: "What day is it?" });
    console.log(res2);
    const res3 = await chain.call({ input: "What interesting events happened today?" });
    console.log(res3);
};
const stream = async () => {
    const chat = new openai_1.OpenAI({
        temperature: 0, verbose: false,
        streaming: true,
        callbacks: [
            {
                handleLLMNewToken(token) {
                    process.stdout.write(token);
                },
            }
        ]
    });
    await chat.call("Hello, how are you?");
};
(async () => {
    // await promptTemplate()
    // await agents();
    // await memory();
    await stream();
    process.exit(0);
})();
