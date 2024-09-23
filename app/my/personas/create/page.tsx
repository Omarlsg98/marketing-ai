"use client";

import ChatUI from "@/components/chat-components/Chat";
import { Chat } from "@/types/database";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Component() {
  const router = useRouter();

  useEffect(() => {
    const startChat = async () => {
      const newChat = await fetch("/api/chat/create", {
        method: "POST",
        body: JSON.stringify({
          title: "New Persona",
          description: "New persona chat",
          category: "Persona B2B",
        }),
      });

      const { chat } = await newChat.json();
      console.log(chat);

      const chatId = chat.id;

      await fetch(`/api/chat/${chatId}/send`, {
        method: "POST",
        body: JSON.stringify({ message: "Hi Ethan!" }),
      });

      //redirect to chat page
      router.push(`/my/personas/chat/${chatId}`);
    };
    startChat();
  }, []);

  const emptyChat:Chat = {
    context: "test",
    created_at: "2021-10-01T00:00:00.000Z",
    description: "test",
    display_info: null as any,
    id: "1",
    is_first_interaction: true,
    progress: 0,
    state: "test",
    status: "new",
    title: "test",
    updated_at: "2021-10-01T00:00:00.000Z",
    user_id: "1",
    deleted_at: "",
    last_message_id_in_context: "sdfsdf",
    object_context_id: "",
    substep_id: 0
  };

  return (
    <ChatUI
      chat={emptyChat}
      messages={[
        {
          id: "sdfsdf",
          content: "Hi Ethan!",
          role: "user",
          user_id: "1",
          chat_id: "1",
        },
      ]}
      handleSendMessage={null}
    />
  );
}
