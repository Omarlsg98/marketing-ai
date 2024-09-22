import { getChat, getLastMessages, getNewMessage, registerMessages, saveEditColumn, updateChat } from "@/lib/server/database";
import { NextRequest, NextResponse } from "next/server";
export const maxDuration = 300;

import chatFlow from "@/lib/server/chat/chatFlow";
import { schemas } from "@/types/api/chat";

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
  const ChatSendInSchema = schemas.ChatSendInSchema;
  const ChatSendIn = ChatSendInSchema.parse(requestBody);

  const userMessage = ChatSendIn.message;
  const inputExtraInfo = ChatSendIn.extraInfo;
  const chatId = params.chatId;

  if (userMessage === "") {
    throw new Error("Please enter a valid message");
  }

  const chat = await getChat(chatId);

  // Register the message from the user
  const newMessage = getNewMessage("user", userMessage, chat);
  const lastMessages = await getLastMessages(chat);
  lastMessages.push(newMessage);

  // Use the AI to get the next question
  const { chat: newChat, messages } = await chatFlow(
    chat,
    lastMessages,
    inputExtraInfo
  );
  
  const maxMessageId = Math.max(...messages.map((message) => message.id));
  const newMessages = messages.filter(
    (message) => message.id > maxMessageId
  );

  // Persist To dabatase newChat, newMessages and NewObjects
  const promises = [
    registerMessages(newMessages),
    updateChat(newChat),
    saveEditColumn(newChat),
  ];

  await Promise.all(promises);

  return NextResponse.json({
    chat: newChat,
    messages: newMessages,
  });
}
