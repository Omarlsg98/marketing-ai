import { NextRequest, NextResponse } from "next/server";

import { getPersonaFormatted } from "@/lib/server/database";
import { getFileUrl } from "@/lib/server/supabase";

export const maxDuration = 300;

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: { personaId: string };
  }
) {
  const data = await getPersonaFormatted(params.personaId);
  let imageUrl = "/placeholder.svg?height=400&width=400";
  //check data.image_path is not null
  if (data.image_path) {
    imageUrl = await getFileUrl("persona_images", data.image_path);
  }
  // Register the intro message
  return NextResponse.json({
    output: data,
    imageUrl: imageUrl,
  });
}

export async function POST(req: NextRequest) {
  const requestBody = await req.json();
  // use persona creator agent to get all information for persona
  // transform answers in sections
  // generate image and about me

  // update persona record with image and about me information and mark it as finished

  // Register the intro message
  return NextResponse.json({
    output: null,
  });
}
