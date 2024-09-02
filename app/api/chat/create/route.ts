import { Database } from "@/types/supabase";
import { NextRequest, NextResponse } from "next/server";
import { getUserId, insertRecord } from "../../../../lib/server/database";

export const maxDuration = 300;

export async function POST(req: NextRequest) {
    const requestBody = await req.json();
    
    console.log(await getUserId());

    const NewChat: Database['public']['Tables']['llm_chats']['Insert'] = {
        user_id: await getUserId(),
        title: requestBody.title,
        description: requestBody.description,
        category: requestBody.category,
        id: '' // This will be added by the database
    };
       
    const chat = await insertRecord("llm_chats", NewChat);

    const NewPersona: Database['public']['Tables']['persona']['Insert'] = {
        user_id: await getUserId(),
        name: 'Unknown Customer',
        about_me: 'In progress!',
        id: chat.id,
        coverage: 0,
        information_version: 'v1',
        chat_id: chat.id,
        short_description: "A wonderful customer, we need more details!"
    };

    const persona = await insertRecord("persona", NewPersona);

    // Register the intro message
    return NextResponse.json({
        chat: chat,
        persona: persona
    });
}
