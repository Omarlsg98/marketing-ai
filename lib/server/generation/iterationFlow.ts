import {
    ChatEditColumn,
    ChatEditColumnComponent,
} from "@/types/components/chatTab";
import {
    FlowInput,
    FlowOutput,
    followUpPromptGenerator,
    formattingFunction,
    formattingPromptGenerator,
    generationFunction,
} from "@/types/interseed/chat";
import { getNewMessage } from "../database";

async function shouldRegenerate(
  message: string,
  sections: string[],
  isNew: boolean
): Promise<string[]> {
  if (isNew) {
    return sections;
  }
  return [1,2] // TODO: Implement this
}
async function baseIterationFlow(
  input: FlowInput,
  type: string,
  sections: string[],
  firstGenerationPrompt: string,
  formattingPromptGenerator: formattingPromptGenerator,
  followUpPromptGenerator: followUpPromptGenerator,
  generationFunction: generationFunction,
  formattingFunction: formattingFunction
): Promise<FlowOutput> {
  const chat = input.chat;
  let newDisplayInfo = chat.display_info as ChatEditColumnComponent | null;
  const messages = input.lastMessages;

  let messagePrompt = firstGenerationPrompt;
  let isNew = false;

  //first time in this flow
  if (chat.substep_id === null) {
    isNew = true;
    chat.substep_id = 1;
    messagePrompt = firstGenerationPrompt;
    newDisplayInfo = {
      type: type,
      old: null,
      current: null,
    };
    // User saved the output and wants to continue
  } else if (input.extraInfo && input.extraInfo.saved) {
    chat.substep_id = null;
    chat.display_info = null;
    return {
      nextState: input.chatState.next,
      messages: messages,
      chat: chat,
      stateDone: false,
    };
    // User edited the output, format the editions
  } else if (input.extraInfo && input.extraInfo.edited) {
    const editInfo = input.extraInfo.modifications as ChatEditColumn;
    const previousInfo = newDisplayInfo.current;
    newDisplayInfo.old = editInfo;
    messagePrompt = followUpPromptGenerator(
      input,
      previousInfo,
      editInfo
    );
    // User send any message
  } else {
    newDisplayInfo.old = newDisplayInfo.current;
    messagePrompt = followUpPromptGenerator(input, newDisplayInfo.current);
  }

  // Generate the message from the agent
  const message = generationFunction(input, messagePrompt);
  messages.push(getNewMessage("assistant", message, input.chat));

  // Generate the output from the message of the agent
  const sectionsToRegenerate = await shouldRegenerate(message, sections, isNew);
  let output = newDisplayInfo.current;
  if (sectionsToRegenerate.length > 0) {
    const formattingPrompt = formattingPromptGenerator(
      input,
      newDisplayInfo.old,
      sectionsToRegenerate
    );
    output = formattingFunction(message, formattingPrompt);
  }

  newDisplayInfo.current = output;
  chat.display_info = newDisplayInfo;

  return {
    nextState: chat.state, // stay in the same state
    messages: messages,
    chat: chat,
    stateDone: true,
  };
}

export const personaBrainstormFlow = async function (
  input: FlowInput
): Promise<FlowOutput> {
  return { stateDone: true };
};

export const personaFlow = async function (
  input: FlowInput
): Promise<FlowOutput> {
  return { stateDone: true };
};

export const customerJourneyFlow = async function (
  input: FlowInput
): Promise<FlowOutput> {
  return { stateDone: true };
};

export const imageGenerationFlow = async function (
  input: FlowInput
): Promise<FlowOutput> {
  return { stateDone: true };
};

export const aboutMeFlow = async function (
  input: FlowInput
): Promise<FlowOutput> {
  return { stateDone: true };
};
