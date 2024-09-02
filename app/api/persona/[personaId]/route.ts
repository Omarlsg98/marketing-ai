import { getChat, getPersonaFormatted, getUserAnswers, updateRecord } from "@/lib/server/database";
import { getPersonaInformation } from "@/lib/server/generation/customerJourneyBuilder";
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

export async function PUT(req: NextRequest,
  {
    params,
  }: {
    params: { personaId: string };
  }
) {
  const requestBody = await req.json();


  const personaId = params.personaId;

  const {chat} = await getChat(personaId);
  const userAnswers = await getUserAnswers(chat.id);
  const persona = await getPersonaFormatted(personaId);
  
  if (persona.finished && requestBody.force !== true) {
    return NextResponse.json({
      output: "Persona already generated",
    });
  }

  // use persona creator agent to get all information for persona
  // transform answers in sections
  const personaInformation = await getPersonaInformation(chat, userAnswers, persona);
  
  // update persona record with image and about me information and mark it as finished
  await updateRecord('persona', personaInformation);

  // Register the intro message
  return NextResponse.json({
    output: personaInformation,
  });
}
