import { Database } from "@/types/supabase";
import { NextRequest, NextResponse } from "next/server";
import { getUserId, insertRecord } from "../database";

export const maxDuration = 300;

export async function POST(req: NextRequest) {
    const requestBody = await req.json();
    
    const NewChat: Database['public']['Tables']['llm_chats']['Insert'] = {
        user_id: await getUserId(),
        title: requestBody.title,
        description: requestBody.description,
        category: requestBody.category,
        id: '' // This will be added by the database
    };
    
    const chat = await insertRecord("llm_chats", NewChat);

    // Register the intro message

    return NextResponse.json({
        output: chat,
    });
}
