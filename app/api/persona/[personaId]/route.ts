import { getPersonaFormatted } from "@/lib/server/database";

import { getFileUrl } from "@/lib/server/supabase";
import { NextRequest, NextResponse } from "next/server";

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
