import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 300;

export async function POST(req: NextRequest) {
    const requestBody = await req.json();
    // get chat_id

    // verify persona is not already created and chat is closed
    
    // use persona creator agent to get all information for persona 
        // transform answers in sections 
        // generate image and about me 
    
    // update persona record with image and about me information and mark it as finished
    
    // Register the intro message
    return NextResponse.json({
        output: null,
    });
}
