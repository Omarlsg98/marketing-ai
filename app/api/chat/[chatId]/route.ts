import { NextRequest, NextResponse } from "next/server";
import { getMessages } from "../database";

export async function GET(req: NextRequest, {
    params,
  }: {
    params: { chatId: string };
  }) {
    const chatId = params.chatId;

    const allMessages = await getMessages(chatId, true);

    return NextResponse.json({
        output: allMessages,
    });
}
