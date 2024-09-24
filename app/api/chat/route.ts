import { getChat, getUserId, insertRecord } from "@/lib/server/database";
import { ChatGetOut } from "@/types/api/chat";
import { Database } from "@/types/supabase";
import { NextRequest, NextResponse } from "next/server";

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

  const NewChat: Database["public"]["Tables"]["llm_chats"]["Insert"] = {
    user_id: await getUserId(),
    title: requestBody.title,
    description: requestBody.description,
    id: "", // This will be added by the database
  };

  const chat = await insertRecord("llm_chats", NewChat);

  // Register the intro message
  return NextResponse.json({
    chat: chat,
  } as ChatGetOut);
}
