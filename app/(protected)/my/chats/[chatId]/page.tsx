"use client";

import ChatUI from "@/components/chat-components/Chat";
import { getNewMessage } from "@/lib/server/database";
import { ChatGetOut, ChatSendIn, ChatSendOut } from "@/types/api/chat";
import { Chat, Message } from "@/types/database";
import { ExtraInfo } from "@/types/interseed/chat";
import { useEffect, useState } from "react";

export default function Component({ params }: { params: { chatId: string } }) {
  const [chat, setChat] = useState<Chat>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (messages.length === 0) {
      fetchChatData();
    }
  }, []);

  const fetchChatData = async () => {
    const response = await fetch(`/api/chat/${params.chatId}`);
    const data: ChatGetOut = await response.json();

    setChat(data.chat);
    setMessages(data.messages);
  };

  const handleMessages = async (message: string, extraInfo: ExtraInfo) => {
    const userMessage: Message = await getNewMessage("user", message, chat);
    setMessages((prev) => [...prev, userMessage]);

    const input: ChatSendIn = {
      message: message,
      extraInfo: extraInfo,
    };

    const response = await fetch(`/api/chat/${params.chatId}/send`, {
      method: "POST",
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      setMessages((prev) => [...prev.slice(0, -1), userMessage]);

      //comunicate error to user with a toast
      const errorMessage = await response.text();
      console.error(errorMessage);
      return;
    }

    const data: ChatSendOut = await response.json();

    setMessages((prev) => [...prev.slice(0, -1), ...data.messages]);
    setChat(data.chat);
  };

  return (
    <ChatUI
      chat={chat}
      messages={messages}
      handleSendMessage={handleMessages}
    />
  );
}
