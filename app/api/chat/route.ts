import { getChat, getUserId, insertRecord } from "@/lib/server/database";
import { ChatGetOut } from "@/types/api/chat";
import { Database } from "@/types/supabase";
import { NextRequest, NextResponse } from "next/server";
import { sendMessage } from "./[chatId]/send/route";

export const maxDuration = 300;

export async function GET(req: NextRequest) {
  const chat = await getChat(null);

  return NextResponse.json({
    chat: chat,
  } as ChatGetOut);
}

export async function POST(req: NextRequest) {
  const requestBody = await req.json();

  console.log(await getUserId());

  const prevChat = await getChat(null);

  const NewChat: Database["public"]["Tables"]["llm_chats"]["Insert"] = {
    user_id: await getUserId(),
    title: requestBody.title,
    description: requestBody.description,
    id: "", // This will be added by the database
    is_first_interaction: prevChat === null,
  };

  const chat = await insertRecord("llm_chats", NewChat);

  await sendMessage(chat, "The conversation has started", "system", {});

  // Register the intro message
  return NextResponse.json({
    chat: chat,
  } as ChatGetOut);
}
