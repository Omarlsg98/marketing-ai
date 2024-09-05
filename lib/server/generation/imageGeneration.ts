import { Chat } from "@/types/database";

import prompts from "@/lib/server/generation/prompts";
import { sendChatGPT, sendDalle } from "@/lib/server/llms";
import { v4 as uuidv4 } from "uuid";

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

export const generatePromptImage = async function (
  chat: Chat
): Promise<string> {
  const context = chat.context;

  const promptMainDescription = prompts.image.getMainDescriptionPrompt(context);
  const promptApparel = prompts.image.getApparelPrompt(context);
  const description = await sendChatGPT(promptMainDescription, 200);
  const apparel = await sendChatGPT(promptApparel, 200);
  const fullPrompt = prompts.image.getGenerateImagePrompt(description, apparel);

  return fullPrompt;
}


export const generateImage = async function (
  chat: Chat,
  fullPrompt: string,
): Promise<File> {

  const b64JsonData = await sendDalle(fullPrompt);
  const image = b64ToFile(b64JsonData, `${chat.user_id}/${chat.id}/${uuidv4()}.png`, "image/png");

  return image;
};

