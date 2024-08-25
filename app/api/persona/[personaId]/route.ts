import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 300;

export async function GET(req: NextRequest,{
    params,
  }: {
    params: { chatId: string };
  }) {
    const requestBody = await req.json();

    console.log(requestBody);

    
    // Register the intro message
    return NextResponse.json({
        output: null,
    });
}
