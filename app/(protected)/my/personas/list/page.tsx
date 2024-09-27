import PersonasGrid from "@/components/customer/persona/PersonasList";
import { getPersonas } from "@/lib/server/database";
import { getFileUrl } from "@/lib/server/supabase";
import {
  ChatEditColumnPersona,
  ChatEditColumnPersonaSelector,
} from "@/types/components/chatTab";
import { PersonaList } from "@/types/components/persona";

async function fetchPersonas(): Promise<PersonaList> {
  const data = await getPersonas(30);

  const personasPromises = data.map(async (persona) => {
    const shortInformation = persona.short_information as ChatEditColumnPersonaSelector["personas"][0];
    const information = persona.information as ChatEditColumnPersona;

    const image_url = persona.image_path
      ? await getFileUrl("persona_images", persona.image_path)
      : null;

    return {
      id: persona.id,
      name: information?.name ?? "",
      image_url: image_url,
      shortDescription: information?.shortDescription ?? "",
      title: shortInformation?.title ?? "",
      whoTheyAre: shortInformation.whoTheyAre ?? "",
      needs: shortInformation.needs ?? "",
      challenges: shortInformation.challenges ?? "",
      isSuggestion: persona.is_suggestion ?? false,
    };
  });

  return Promise.all(personasPromises);
}

export default async function PersonasListPage() {
  const personas = await fetchPersonas();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">All Personas</h1>
      <PersonasGrid personas={personas} />
    </div>
  );
}