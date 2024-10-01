"use client";

import ChatUI from "@/components/chat-components/Chat";
import { ChatGetOut } from "@/types/api/chat";
import { Chat } from "@/types/database";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Component() {
  const router = useRouter();

  useEffect(() => {
    const execute = async () => {
      const getResponse = await fetch("/api/chat", {
        method: "GET",
      });

      let { chat } = (await getResponse.json()) as ChatGetOut;
      //redirect to chat page
      if (chat) {
        router.push(`/my/chats/${chat.id}`);
        return;
      }

      const postRepsonse = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          title: "New Persona",
          description: "New persona chat",
          category: "Persona B2B",
        }),
      });

      const postJson = (await postRepsonse.json()) as ChatGetOut;
      chat = postJson.chat;

      //redirect to chat page
      router.push(`/my/chats/${chat.id}`);
    };

    execute();
  }, []);

  const emptyChat: Chat = {
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
    substep_id: 0,
  };

  return (
    <ChatUI
      chat={emptyChat}
      messages={[
      ]}
      handleSendMessage={null}
      initLoading={true}
    />
  );
}
