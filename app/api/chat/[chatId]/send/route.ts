import {
  getChat,
  getLastMessages,
  getNewMessage,
  registerMessages,
  saveEditColumn,
  updateChat,
} from "@/lib/server/database";
import { NextRequest, NextResponse } from "next/server";
export const maxDuration = 300;

import chatFlow from "@/lib/server/chat/chatFlow";
import { schemas } from "@/types/api/chat";

const ChatSendInSchema = schemas.ChatSendInSchema;

export async function POST(
  req: NextRequest,
  {
    params,
  }: {
    params: { chatId: string };
  }
) {
  const requestBody = await req.json();

  // validate the request body with zod
  const ChatSendIn = ChatSendInSchema.parse(requestBody);

  const userMessage = ChatSendIn.message;
  const inputExtraInfo = ChatSendIn.extraInfo;
  const chatId = params.chatId;

  console.log("inputExtraInfo", inputExtraInfo);

  if (userMessage === "") {
    throw new Error("Please enter a valid message");
  }

  const chat = await getChat(chatId);
  console.log("1");

  // Register the message from the user
  const newMessage = await getNewMessage("user", userMessage, chat);
  const lastMessages = await getLastMessages(chat);
  lastMessages.push(newMessage);

  // Use the AI to get the next question
  const { chat: newChat, messages } = await chatFlow(
    chat,
    lastMessages,
    inputExtraInfo
  );

  let newMessages = messages.filter(
    (message) => message.created_at === null || message.created_at === undefined
  );

  // Persist To dabatase newChat, newMessages and NewObjects
  const promises = [
    registerMessages(newMessages),
    updateChat(newChat),
    saveEditColumn(newChat),
  ];
 
  await Promise.all(promises);

  //remove system messages from the chat
  newMessages = newMessages.filter((message) => message.role !== "system");
  return NextResponse.json({
    chat: newChat,
    messages: newMessages,
  });
}
