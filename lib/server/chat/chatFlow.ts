// This file provides a series of functions to validate the state of the conversation
// It also has the different states of the conversation
import { Chat, Message } from "@/types/database";
import {
  ChatState,
  ExtraInfo,
  FlowInput,
  FlowOutput,
} from "@/types/interseed/chat";
import {
  aboutMeFlow,
  customerJourneyFlow,
  imageGenerationFlow,
  personaBrainstormFlow,
  personaFlow,
} from "../generation/iterationFlow";

import prompts from "@/lib/server/chat/prompts";
import { sendChatGPT, sendChatGPTUntilInteger } from "@/lib/server/llms";
import { getNewMessage } from "../database";
import { questionFlow } from "../question-making/questionFlow";

const MAX_MESSAGES_OUT_OF_CONTEXT = 10;

async function isFirstInteraction(input: FlowInput): Promise<FlowOutput> {
  let nextState = input.chatState.options.false;
  if (input.chat.is_first_interaction && input.lastMessages.length <= 1) {
    nextState = input.chatState.options.true;
    input.chat.is_first_interaction = false;
  }
  return {
    nextState: nextState,
    chat: input.chat,
    messages: input.lastMessages,
    stateDone: true,
  };
}

async function userWantsToCreateNewPersona(
  input: FlowInput
): Promise<FlowOutput> {
  let nextState = input.chatState.options.false;
  const prompt = prompts.getNewPersonaPrompt(
    input.chat.context,
    input.lastMessages
  );
  const result = await sendChatGPTUntilInteger(prompt, 3);

  if (result === 1) {
    nextState = input.chatState.options.true;
  }
  return {
    nextState: nextState,
    chat: input.chat,
    messages: input.lastMessages,
    stateDone: true,
  };
}

const CHAT_STATES: {
  [key: string]: ChatState;
} = {
  initial: {
    type: "decision",
    description: null,
    function: isFirstInteraction,
    executeNextInmediately: true,
    options: {
      true: "introduction",
      false: "welcomeBack",
    },
  },
  introduction: {
    type: "message",
    description: null,
    instructions:
      "Introduce yourself to the user, tell them what you do and how you can help them. Keep it short. Don't make questions yet.",
    next: "knowYourUser",
    executeNextInmediately: true,
  },
  welcomeBack: {
    type: "message",
    description: null,
    instructions:
      "Welcome back to the chat, remind the user who you are and what you do. Keep it short. In 2 or 3 sentences recap what you know about the user and the business. Don't make questions yet.",
    next: "askNewPersona",
    executeNextInmediately: true,
  },
  askNewPersona: {
    type: "message",
    description: null,
    instructions:
      "Ask the user if they want to create a new persona or continue with the previous one. Don't make any other question yet.",
    next: "whatToDo",
    executeNextInmediately: false,
  },
  whatToDo: {
    type: "decision",
    description: null,
    function: userWantsToCreateNewPersona,
    options: {
      true: "knowYourUser",
      false: "goodbye",
    },
    executeNextInmediately: true,
  },
  knowYourUser: {
    type: "question",
    description: null,
    instructions: `Gather all relevant business information from the user.
    Understand their product, their competitive advantage. How it works. Strenghts and weaknesses.
    You should gather some information for LATER create a persona, but don't ask for persona information yet. 
    The information does not need to be complete, but it should be enough to understand the business and the user.
    Basic information to gather:
    - Business name, product or idea, and what makes it unique.`,
    checkUpdateWorkspace: true,
    next: "brainstormPersonas",
    executeNextInmediately: true,
  },
  brainstormPersonas: {
    type: "iteration",
    description: null,
    function: personaBrainstormFlow,
    checkUpdateWorkspace: true,
    executeNextInmediately: true,
    next: "generateDetailedPersona",
  },
  generateDetailedPersona: {
    type: "iteration",
    description: null,
    function: personaFlow,
    checkUpdateWorkspace: true,
    executeNextInmediately: true,
    next: "generateCustomerJourney",
  },
  generateCustomerJourney: {
    type: "iteration",
    description: null,
    function: customerJourneyFlow,
    checkUpdateWorkspace: true,
    executeNextInmediately: true,
    next: "generateImage",
  },
  generateImage: {
    type: "iteration",
    description: null,
    function: imageGenerationFlow,
    executeNextInmediately: true,
    next: "generateAboutMeFlow",
  },
  generateAboutMeFlow: {
    type: "iteration",
    description: null,
    function: aboutMeFlow,
    executeNextInmediately: true,
    next: "goodbye",
  },
  goodbye: {
    type: "message",
    description: "Change to this state if the user is saying goodbye.",
    instructions: "Say goodbye to the user.",
    next: "end",
  },
  end: {
    type: "end",
    description: null,
    executeNextInmediately: true,
    next: "initial",
  },
};

// In chat:
// prev_state
// state
// last_message_id_in_context
// is_flowing
// substep_id
// display_info
// is_first_interaction

// function to update the chat context and variables given the last messages
async function updateContext(
  chat: Chat,
  lastMessages: Message[]
): Promise<{
  context: string;
  lastMessageIdInContext: string;
  newLastMessages: Message[];
}> {
  if (lastMessages.length <= MAX_MESSAGES_OUT_OF_CONTEXT) {
    console.log("Not enough messages to update context");

    return {
      context: chat.context,
      lastMessageIdInContext: chat.last_message_id_in_context,
      newLastMessages: lastMessages,
    };
  }

  const messagesToContext = lastMessages.slice(0, -MAX_MESSAGES_OUT_OF_CONTEXT);
  const lastMessageIdInContext =
    messagesToContext[messagesToContext.length - 1].id;

  let prompt = prompts.getContextMakerPrompt(chat.context, messagesToContext);

  const context = await sendChatGPT(prompt, 3000);
  const newLastMessages = lastMessages.slice(-MAX_MESSAGES_OUT_OF_CONTEXT);

  return {
    context,
    lastMessageIdInContext,
    newLastMessages,
  };
}

// function to update the workspace context given the last messages
async function updateWorkspaceContext(chat: Chat, lastMessages: Message[]) {}

async function executeMessageState(input: FlowInput): Promise<FlowOutput> {
  let messages: Message[] = input.lastMessages;
  let chat = input.chat;
  let prompt = prompts.getMessagePrompt(
    chat.context,
    input.chatState.instructions,
    messages
  );
  let newMessage = await sendChatGPT(prompt, 3000);

  let systemMessage: Message = await getNewMessage(
    "assistant",
    newMessage,
    chat
  );

  messages.push(systemMessage);

  return {
    nextState: input.chatState.next,
    messages: messages,
    chat: chat,
    stateDone: true,
  };
}

async function executeQuestionState(input: FlowInput): Promise<FlowOutput> {
  let results = await questionFlow(input);
  return results;
}

async function executeDecisionState(input: FlowInput): Promise<FlowOutput> {
  const functionToExecute = input.chatState.function;
  return functionToExecute(input);
}

async function executeIterationState(input: FlowInput): Promise<FlowOutput> {
  let results = await input.chatState.function(input);
  return results;
}

async function executeEndState(input: FlowInput): Promise<FlowOutput> {
  return {
    nextState: input.chatState.next,
    messages: input.lastMessages,
    chat: input.chat,
    stateDone: true,
  };
}

async function executeState(input: FlowInput): Promise<FlowOutput> {
  let currentState: ChatState = input.chatState;
  console.log("===== Executing state: ", currentState);

  let results: FlowOutput = {
    chat: input.chat,
    stateDone: false,
    nextState: "error",
    messages: null,
  };

  if (currentState.type === "message") {
    results = await executeMessageState(input);
  } else if (currentState.type === "question") {
    results = await executeQuestionState(input);
  } else if (currentState.type === "decision") {
    results = await executeDecisionState(input);
  } else if (currentState.type === "iteration") {
    results = await executeIterationState(input);
  } else if (currentState.type === "end") {
    results = await executeEndState(input);
  } else {
    throw new Error(`State ${input.chat.state} not found in chat flow`);
  }

  results.chat.state = results.nextState;

  console.log("===== State executed: ", results);

  if (currentState.executeNextInmediately && results.stateDone) {
    results = await executeState({
      chatState: CHAT_STATES[results.nextState],
      chat: results.chat,
      lastMessages: results.messages,
      extraInfo: null,
    });
  }

  return results;
}

export default async function chatFlow(
  chat: Chat,
  //   workspace: Workspace,
  lastMessages: Message[],
  inputExtraInfo: ExtraInfo
): Promise<{ chat: Chat; messages: Message[]; regenerated: boolean }> {
  let currentState: ChatState = CHAT_STATES[chat.state];

  if (!currentState) {
    currentState = CHAT_STATES.initial;
  }

  const contextUpdate = await updateContext(chat, lastMessages);
  chat.context = contextUpdate.context;
  chat.last_message_id_in_context = contextUpdate.lastMessageIdInContext;
  lastMessages = contextUpdate.newLastMessages;

  //   if (currentState.checkUpdateWorkspace) {
  //     const workspaceUpdate = await updateWorkspaceContext(chat, lastMessages);
  //     workspace.context = workspaceUpdate.context;
  //   }

  const results = await executeState({
    chatState: currentState,
    chat,
    lastMessages,
    extraInfo: inputExtraInfo,
  });

  chat = results.chat;
  return {
    chat,
    messages: results.messages,
    regenerated: results.other?.regenerated || false,
  };
}
