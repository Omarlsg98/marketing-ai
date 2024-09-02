import { getPersonas } from "@/lib/server/database";
import { getFileUrl } from "@/lib/server/supabase";
import { PersonaListOut } from "@/types/api/persona";
import { PersonaInformation } from "@/types/persona";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 300;

export async function GET(req: NextRequest) {
  // return a list of all personas for a given user containing the chat_id and chat.status
  const data: PersonaInformation["v1_short"][] = await getPersonas(30);

  // get image_urls for each persona
  let output: PersonaListOut = []

  for (const persona of data) {
    const image_url = persona.image_path?(await getFileUrl("persona_images", persona.image_path)):null;
    output.push({
      ...persona,
      image_url:  image_url,
    });
  }

  return NextResponse.json(output);
}
