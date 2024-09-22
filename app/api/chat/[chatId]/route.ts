import {
  getChat,
  getMessages,
} from "@/lib/server/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: { chatId: string };
  }
) {
  const chatId = params.chatId;

  const { chat } = await getChat(chatId);
  const allMessages = await getMessages(chatId, true);

  return NextResponse.json({
    output: allMessages,
    progress: chat.progress,
  });
}
