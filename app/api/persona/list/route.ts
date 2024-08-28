import { getPersonas } from "@/lib/server/database";
import { PersonaListOut } from "@/types/api/persona";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 300;

export async function GET(req: NextRequest) {
  // return a list of all personas for a given user containing the chat_id and chat.status
  const output: PersonaListOut = await getPersonas(30);

  return NextResponse.json(output);
}
