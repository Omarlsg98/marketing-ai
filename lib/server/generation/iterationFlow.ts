import prompts from "@/lib/server/generation/prompts";
import { sendChatGPTJSON } from "@/lib/server/llms";
import { ChatEditColumnComponent } from "@/types/components/chatTab";
import {
  ExtractFunction,
  FlowInput,
  FlowOutput,
  IterationAgentOutput,
  IterationAgentOutputSchema,
  IterationPromptBuilder,
} from "@/types/interseed/chat";
import { getNewMessage } from "../database";
import generators from "./generation";

async function invokeAgent(prompt: string): Promise<IterationAgentOutput> {
  return await sendChatGPTJSON(prompt, IterationAgentOutputSchema, 2500);
}

async function baseIterationFlow(
  input: FlowInput,
  type: "multiplePersona" | "persona" | "customerJourney" | "image" | "aboutMe",
  answerPromptBuilder: IterationPromptBuilder,
  extractFunction: ExtractFunction
): Promise<FlowOutput> {
  const chat = input.chat;
  let newDisplayInfo = JSON.parse(chat.display_info as string) as ChatEditColumnComponent;
  const messages = input.lastMessages;

  let messagePrompt = "";

  //first time in this flow
  if (chat.substep_id === null) {
    chat.substep_id = 1;
    messagePrompt = answerPromptBuilder(input, null, null);
    newDisplayInfo = {
      type: type,
      author: "system",
      old: null,
      current: null,
    };
    // User saved the output and wants to continue
  } else if (input.extraInfo && input.extraInfo.saved) {
    chat.substep_id = null;
    chat.display_info = null;

    if (newDisplayInfo.type === "multiplePersona") {
      messages.push(
        await getNewMessage(
          "system",
          "The user chose one of the personas you provided and wants to continue",
          input.chat
        )
      );
      chat.object_context_id = input.extraInfo.idChoice;
    } else {
      messages.push(
        await getNewMessage(
          "system",
          "The user saved the output and wants to continue",
          input.chat
        )
      );
    }

    return {
      nextState: input.chatState.next,
      messages: messages,
      chat: chat,
      stateDone: true,
    };
    // User edited the output, format the editions
  } else if (input.extraInfo && input.extraInfo.edited) {
    const editInfo = input.extraInfo.modifications;
    const previousInfo = newDisplayInfo.current;
    newDisplayInfo.old = editInfo;
    messagePrompt = answerPromptBuilder(input, previousInfo, editInfo);

    messages.push(
      await getNewMessage(
        "system",
        "The user edited the ouput you provided.",
        input.chat
      )
    );

    // User send any message
  } else {
    newDisplayInfo.old = newDisplayInfo.current;
    messagePrompt = answerPromptBuilder(input, newDisplayInfo.current, null);
  }

  // Generate the message from the agent
  const agentResponse = await invokeAgent(messagePrompt);
  messages.push(await getNewMessage("assistant", agentResponse.message, input.chat));

  if (agentResponse.shouldFormat || newDisplayInfo.current === null) {
    // Generate the output from the message of the agent
    newDisplayInfo.current = await extractFunction(input, agentResponse, newDisplayInfo.old);
    newDisplayInfo.author = "assistant";
  }

  chat.display_info = JSON.stringify(newDisplayInfo);

  return {
    nextState: chat.state, // stay in the same state
    messages: messages,
    chat: chat,
    stateDone: false,
  };
}

export const personaBrainstormFlow = async function (
  input: FlowInput
): Promise<FlowOutput> {
  let output = baseIterationFlow(
    input,
    "multiplePersona",
    prompts.personaSuggestionsPromptBuilder,
    generators.extractPersonaSuggestions
  );
  return output;
};

export const personaFlow = async function (
  input: FlowInput
): Promise<FlowOutput> {
  let output = baseIterationFlow(
    input,
    "persona",
    prompts.personaPromptBuilder,
    generators.extractPersona
  );
  return output;
};

export const customerJourneyFlow = async function (
  input: FlowInput
): Promise<FlowOutput> {
  let output = baseIterationFlow(
    input,
    "customerJourney",
    prompts.customerJourneyPromptBuilder,
    generators.extractCustomerJourney
  );
  return output;
};

export const imageGenerationFlow = async function (
  input: FlowInput
): Promise<FlowOutput> {
  let output = baseIterationFlow(
    input,
    "image",
    prompts.generateImagePromptBuilder,
    generators.generateImage
  );
  return output;
};

export const aboutMeFlow = async function (
  input: FlowInput
): Promise<FlowOutput> {
  let output = baseIterationFlow(
    input,
    "aboutMe",
    prompts.aboutMePromptBuilder,
    generators.extractAboutMe
  );
  return output;
};
