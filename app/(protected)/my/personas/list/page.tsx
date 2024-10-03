"use server";

import PersonasList from "@/components/customer/persona/PersonasList";

import { getPersonas } from "@/lib/server/database";
import { getFileUrl } from "@/lib/server/supabase";
import {
  ChatEditColumnPersona,
  ChatEditColumnPersonaSelector,
} from "@/types/components/chatTab";
import { PersonaList } from "@/types/components/persona";

export default async function Component() {
  const fetchData = async () => {
    const data = await getPersonas(30);

    // format data to PersonaList
    let output: PersonaList = [];

    for (const persona of data) {
      const shortInformation =
        persona.short_information as ChatEditColumnPersonaSelector["personas"][0];

      const information = persona.information as ChatEditColumnPersona;

      const image_url = persona.image_path
        ? await getFileUrl("persona_images", persona.image_path)
        : null;

      output.push({
        id: persona.id,
        name: information?.name,
        image_url: image_url,
        shortDescription: information?.shortDescription,
        title: shortInformation?.title,
        whoTheyAre: shortInformation.whoTheyAre,
        needs: shortInformation.needs,
        challenges: shortInformation.challenges,
        isSuggestion: persona.is_suggestion,
      });
    }
    return output;
  };

  const personas = await fetchData();

  return (
    <div className="container mx-auto py-2">
      <PersonasList personas={personas} />
    </div>
  );
}
