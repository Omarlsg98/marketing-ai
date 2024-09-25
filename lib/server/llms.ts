import axios, { AxiosError } from "axios";
import axiosRetry from "axios-retry";

const DEBUG_LLM = process.env.DEBUG_LLM === "true";

export type llm_message = {
  role: string;
  content: string;
};

import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

export const sendChatGPTJSON = async function (
  prompt: string,
  schema: z.AnyZodObject,
  maxTokens: number = 100,
  temperature: number = 1
): Promise<any> {
  if (DEBUG_LLM) {
    console.log("------ DEBUG_LLM PROMPT:\n" + prompt);
  }

  const openai = new OpenAI();

  const completion = await openai.beta.chat.completions.parse({
    model: process.env.LLM_MODEL,
    max_tokens: maxTokens,
    temperature: temperature,
    messages: [{ role: "system", content: prompt }],
    response_format: zodResponseFormat(schema, "object"),
  });

  if (DEBUG_LLM) {
    console.log("------ DEBUG_LLM RESPONSE:\n" +  completion.choices[0].message.content);
  }

  const event = completion.choices[0].message.parsed;
  return event;
};

export const sendChatGPTUntilInteger = async (
  prompt: string,
  maxRetries: number
) => {
  let retries = maxRetries;
  while (retries > 0) {
    try {
      let response = await sendChatGPT(prompt, 5);
      // remove everythibg that is not a number
      response = response.replace(/\D/g, "");
      const responseInt = parseInt(response);
      retries--;
      if (!isNaN(responseInt)) {
        return responseInt;
      }
    } catch (error) {
      console.error(error);
    }
  }
  throw new Error("Could not get a valid integer");
};

export const sendChatGPT: (
  prompt: string,
  maxTokens?: number,
  temperature?: number
) => Promise<string> = async (
  prompt: string,
  maxTokens = 100,
  temperature = 1
) => {
  if (DEBUG_LLM) {
    console.log("------ DEBUG_LLM PROMPT:\n" + prompt);
  }

  const response = await sendChatGPTCompletion(
    [{ role: "system", content: prompt }],
    maxTokens,
    temperature
  );

  if (DEBUG_LLM) {
    console.log("------ DEBUG_LLM RESPONSE:\n" + response);
  }

  return response;
};

// Use this if you want to make a call to OpenAI GPT-4 for instance.
export const sendChatGPTCompletion = async (
  messages: llm_message[],
  maxTokens = 100,
  temperature = 1
) => {
  const url = "https://api.openai.com/v1/chat/completions";

  const body = JSON.stringify({
    model: process.env.LLM_MODEL, // gpt-4, gpt-3.5-turbo, etc
    messages,
    max_tokens: maxTokens,
    temperature: temperature,
  });

  const options = {
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
  };

  // Custom retry delay
  axiosRetry(axios, {
    retryDelay: (retryCount) => {
      return retryCount * 1;
    },
    retries: 5,
  });

  const res = await axios.post(url, body, options);

  const choice = res.data.choices[0];
  if (choice.finish_reason !== "stop") {
    throw new Error("GPT did not finish generating a response");
  }
  const answer = choice.message.content;
  const usage = res?.data?.usage;
  console.log(
    "------" +
      "TOKENS USED: " +
      usage?.total_tokens +
      " (prompt: " +
      usage?.prompt_tokens +
      " / response: " +
      usage?.completion_tokens +
      ")\n"
  );

  return answer;
};

export const sendChatGPTFunctions = async (
  messages: { role: string; content: string }[],
  tools: any[], // pass in the tools you want to use
  max = 100,
  temp = 1
) => {
  const url = "https://api.openai.com/v1/chat/completions";

  messages.map((m) =>
    console.log(" - " + m.role.toUpperCase() + ": " + m.content)
  );

  const body = JSON.stringify({
    model: "gpt-3.5-turbo", // gpt-4, gpt-3.5-turbo, etc
    messages,
    max_tokens: max,
    temperature: temp,
    tools: tools,
    tool_choice: "auto",
  });

  const options = {
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // place in your API key here or use environment variables
      "Content-Type": "application/json",
    },
  };

  try {
    // Custom retry delay
    axiosRetry(axios, {
      retryDelay: (retryCount) => {
        return retryCount * 1;
      },
      retries: 15,
    });

    const res = await axios.post(url, body, options);

    const toolCalls = res.data.choices[0].message.tool_calls;
    const usage = res?.data?.usage;

    console.log(
      "TOKENS USED: " +
        usage?.total_tokens +
        " (prompt: " +
        usage?.prompt_tokens +
        " / response: " +
        usage?.completion_tokens +
        ")"
    );
    console.log("\n");

    return toolCalls;
  } catch (e) {
    if (typeof e === "object" && e instanceof AxiosError) {
      console.error("GPT Error: " + e?.response?.status, e?.response?.data);
      return null;
    } else {
      console.error("GPT Error: " + e);
      return null;
    }
  }
};

export const sendDalle: (prompt: string) => Promise<string> = async (
  prompt: string
) => {
  const url = "https://api.openai.com/v1/images/generations";

  if (DEBUG_LLM) {
    console.log("------ DEBUG_LLM GENERATING IMAGE WITH PROMPT:\n" + prompt);
  }

  const body = JSON.stringify({
    model: process.env.DALLE_MODEL,
    prompt: prompt,
    quality: "hd",
    response_format: "b64_json",
    size: "1024x1024",
    style: "natural",
  });

  const options = {
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axios.post(url, body, options);
    const b64_json = res.data.data[0].b64_json;
    return b64_json;
  } catch (e) {
    if (typeof e === "object" && e instanceof AxiosError) {
      console.error("DALL-E Error: " + e?.response?.status, e?.response?.data);
      return null;
    } else {
      console.error("DALL-E Error: " + e);
      return null;
    }
  }
};
