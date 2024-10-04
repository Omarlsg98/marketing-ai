"use client";

import { ChatSendIn, ChatSendOut } from "@/types/api/chat";
import { ExtraInfo } from "@/types/interseed/chat";

export const handleMessages = async (
  chatId: string,
  message: string,
  extraInfo: ExtraInfo
) => {
  const input: ChatSendIn = {
    message: message,
    extraInfo: extraInfo,
  };

  const response = await fetch(`/api/chat/${chatId}/send`, {
    method: "POST",
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    //comunicate error to user with a toast
    const errorMessage = await response.text();
    console.error(errorMessage);

    throw new Error(errorMessage);
  }

  const data: ChatSendOut = await response.json();

  return {
    chat: data.chat,
    messages: data.messages,
  };
};
