import { sendChatGPTJSON, sendDalle } from "@/lib/server/llms";
import {
  ChatEditColumn,
  ChatEditColumnAboutMe,
  ChatEditColumnCustomerJourney,
  ChatEditColumnPersona,
  ChatEditColumnPersonaSelector,
  schemas,
} from "@/types/components/chatTab";
import {
  ExtractFunction,
  FlowInput,
  IterationAgentOutput,
} from "@/types/interseed/chat";
import { v4 as uuidv4 } from "uuid";

import prompts from "./prompts";

function b64ToFile(b64_json: string, filename: string, mimeType: string): File {
  // Decode the base64 string
  const byteCharacters = atob(b64_json);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  // Create a Blob from the byte array
  const blob = new Blob([byteArray], { type: mimeType });

  // Create a File object from the Blob
  const file = new File([blob], filename, { type: mimeType });

  return file;
}

const extractPersonaSuggestions = async function (
  input: FlowInput,
  agentResponse: IterationAgentOutput,
  currentInfo: ChatEditColumn
): Promise<ChatEditColumnPersonaSelector> {
  const personaSuggestions: ChatEditColumnPersonaSelector = await sendChatGPTJSON(
    prompts.formattingPromptBuilder(currentInfo, agentResponse),
    schemas.ChatEditColumnPersonaSelectorSchema,
    1000
  );

  personaSuggestions.personas = personaSuggestions.personas.map((persona) => {
    return {
      id: uuidv4(),
      ...persona,
    };
  });

  return personaSuggestions;
};

const extractPersona = async function (
  input: FlowInput,
  agentResponse: IterationAgentOutput,
  currentInfo: ChatEditColumn
): Promise<ChatEditColumnPersona> {
  const persona: ChatEditColumnPersona = await sendChatGPTJSON(
    prompts.formattingPromptBuilder(currentInfo, agentResponse),
    schemas.ChatEditColumnPersonaSchema,
    1000
  );

  persona.id = input.chat.object_context_id;

  return persona;
};

const extractCustomerJourney = async function (
  input: FlowInput,
  agentResponse: IterationAgentOutput,
  currentInfo: ChatEditColumn
): Promise<ChatEditColumnCustomerJourney> {

  const customerJourney: ChatEditColumnCustomerJourney = await sendChatGPTJSON(
    prompts.formattingPromptBuilder(currentInfo, agentResponse),
    schemas.ChatEditColumnCustomerJourneySchema,
    1500
  );

  customerJourney.id = input.chat.object_context_id;

  return customerJourney;
};

const generateImage: ExtractFunction = async (
  input,
  agentResponse,
  currenInfo
) => {
  const chat = input.chat;
  const prompt = agentResponse.imagePrompt;

  const b64JsonData = await sendDalle(prompt);
  const image = b64ToFile(
    b64JsonData,
    `${chat.user_id}/${chat.id}/${uuidv4()}.png`,
    "image/png"
  );

  return {
    imagePrompt: prompt,
    imageFile: image,
  };
};

const extractAboutMe = async function (
  input: FlowInput,
  agentResponse: IterationAgentOutput,
  currentInfo: ChatEditColumn
): Promise<ChatEditColumnAboutMe> {
  const aboutMe: ChatEditColumnAboutMe = await sendChatGPTJSON(
    prompts.formattingPromptBuilder(currentInfo, agentResponse),
    schemas.ChatEditColumnAboutMeSchema,
    1500
  );

  aboutMe.id = input.chat.object_context_id;

  return aboutMe;
};

export default {
  extractAboutMe,
  extractCustomerJourney,
  extractPersona,
  extractPersonaSuggestions,
  generateImage,
};
