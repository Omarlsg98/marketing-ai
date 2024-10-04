"use server";

import { sendMessage } from "@/app/api/chat/[chatId]/send/route";
import { getChat, getUserId, insertRecord } from "@/lib/server/database";
import { Chat } from "@/types/database";
import { Database } from "@/types/supabase";
import { redirect, RedirectType } from "next/navigation";

export default async function Component() {
  const execute = async () => {
    const prevChat = await getChat(null);

    if (prevChat) {
      redirect(`/my/chats/${prevChat.id}`, RedirectType.replace);
    }

    let newChat: Database["public"]["Tables"]["llm_chats"]["Insert"] = {
      user_id: await getUserId(),
      title: "New Chat",
      description: "New Chat",
      id: "", // This will be added by the database
      is_first_interaction: prevChat === null,
    };

    newChat = await insertRecord("llm_chats", newChat);

    await sendMessage(
      newChat as Chat,
      "The conversation has started",
      "system",
      {}
    );

    //redirect to chat page
    redirect(`/my/chats/${newChat.id}`, RedirectType.replace);
  };

  await execute();
}
