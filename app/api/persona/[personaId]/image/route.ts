import {
  getChat,
  getPersonaRecord,
  getUserId,
  updateRecord,
} from "@/lib/server/database";
import prompts from "@/lib/server/generation/prompts";
import { sendChatGPT, sendDalle } from "@/lib/server/llms";
import { uploadFile } from "@/lib/server/supabase";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 300;

function b64ToFile(b64_json: string, filename: string, mimeType: string): File {
    // Decode the base64 string
    const byteCharacters = atob(b64_json);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
  
    // Create a Blob from the byte array
    const blob = new Blob([byteArray], { type: mimeType });
  
    // Create a File object from the Blob
    const file = new File([blob], filename, { type: mimeType });
  
    return file;
  }

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const userId = await getUserId();
  const personaId = formData.get("id") as string;
  const chat_id = formData.get("chat_id") as string;
  const update_mode = formData.get("update_mode") as string;

  let image;
  if (update_mode === "image_upload") {
    // upload image to persona record
    image = formData.get("file") as File;
    if (!image) {
      return NextResponse.json({
        output: "Please upload an image",
      });
    }
  } else {
    //temporal
    const { chat } = await getChat(chat_id);
    const ethnicity = formData.get("ethnicity") as string;
    const context = chat.context + " The user says the customer has the following ethnicity: " + ethnicity;

    const promptMainDescription = prompts.image.getMainDescriptionPrompt(context);
    const promptApparel = prompts.image.getApparelPrompt(context);
    const description = await sendChatGPT(promptMainDescription, 200);
    const apparel = await sendChatGPT(promptApparel, 200);
    const fullPrompt = prompts.image.getGenerateImagePrompt(description, apparel);
    const b64JsonData = await sendDalle(fullPrompt);
    image = b64ToFile(b64JsonData, "persona.png", "image/png");
  }
  const imageName = `${userId}/${personaId}.png`;

  const { signedUrl } = await uploadFile(
    `persona_images`,
    imageName,
    image
  );

  let personaRecord = await getPersonaRecord(personaId);
  personaRecord.image_path = imageName;
  // update persona record with image
  await updateRecord("persona", personaRecord);

  return NextResponse.json({
    output: signedUrl,
  });
}
