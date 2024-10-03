"use server";

import PersonaProfileUI from "@/components/customer/persona/Persona";
import { getPersona } from "@/lib/server/database";

import { getFileUrl } from "@/lib/server/supabase";
import {
  ChatEditColumnCustomerJourney,
  ChatEditColumnPersona,
  ChatEditColumnPersonaSelector,
} from "@/types/components/chatTab";
import { FullPersona } from "@/types/components/persona";

export default async function Component({
  params,
}: {
  params: { personaId: string };
}) {
  const fetchData = async () => {
    // format data to FullPersona

    const persona = await getPersona(params.personaId);

    const shortInformation =
      persona.short_information as ChatEditColumnPersonaSelector["personas"][0];

    const information = persona.information as ChatEditColumnPersona;
    const customerJourney =
      persona.customer_journey[0]?.information as ChatEditColumnCustomerJourney;

    console.log(customerJourney);

    const image_url = persona.image_path
      ? await getFileUrl("persona_images", persona.image_path)
      : null;

    let output: FullPersona = {
      id: persona.id,
      name: information?.name,
      image_url: image_url,
      shortDescription: information?.shortDescription,
      title: shortInformation?.title,
      aboutMe: persona.about_me,
      isFinished: persona.finished,
      shortInformation: {
        whoTheyAre: shortInformation.whoTheyAre,
        needs: shortInformation.needs,
        challenges: shortInformation.challenges,
      },
      details: {
        demographics: information.demographics,
        psychographics: information.psychographics,
        behavior: information.behavior,
        needs: information.needs,
      },
      customerJourney: {
        awareness: {
          main: customerJourney.awareness?.trigger,
          touchpoints: customerJourney.awareness?.touchpoints,
          action: customerJourney.awareness?.action,
        },
        consideration: {
          main: customerJourney.consideration?.research,
          touchpoints: customerJourney.consideration?.touchpoints,
          action: customerJourney.consideration?.action,
        },
        purchase: {
          main: customerJourney.purchase?.decision,
          touchpoints: customerJourney.purchase?.touchpoints,
          action: customerJourney.purchase?.action,
        },
        retention: {
          main: customerJourney.retention?.engagement,
          touchpoints: customerJourney.retention?.touchpoints,
          action: customerJourney.retention?.action,
        },
        advocacy: {
          main: customerJourney.advocacy?.satisfaction,
          touchpoints: customerJourney.advocacy?.touchpoints,
          action: customerJourney.advocacy?.action,
        },
        summary: customerJourney.summary,
      },
    };

    return output;
  };

  const persona = await fetchData();

  return (
    <div className="container mx-auto py-2">
      <PersonaProfileUI persona={persona} />
    </div>
  );
}