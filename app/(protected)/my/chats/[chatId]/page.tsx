"use server";

import ChatUI from "@/components/chat-components/Chat";
import {
  getChat,
  getMessages,
  getPersona,
  getPersonas,
} from "@/lib/server/database";
import { getFileUrl } from "@/lib/server/supabase";
import {
  ChatEditColumnCustomerJourney,
  ChatEditColumnImage,
  ChatEditColumnPersona,
  ChatEditColumnPersonaSelector,
  PersonaAllTabs,
} from "@/types/components/chatTab";

export default async function Component({
  params,
}: {
  params: { chatId: string };
}) {
  const fetchChatData = async () => {
    const chatId = params.chatId;

    const chat = await getChat(chatId);
    const allMessages = await getMessages(chatId, true);

    return {
      chat: chat,
      messages: allMessages,
    };
  };

  const { chat, messages } = await fetchChatData();

  const fetchPersonaTabInfo = async function (
    id: string | null
  ): Promise<PersonaAllTabs> {
    "use server";
    const allPersonas = await getPersonas(30);
    const multiplePersonas = {
      personas: allPersonas.map(
        (persona) =>
          persona.short_information as ChatEditColumnPersonaSelector["personas"][0]
      ),
    };

    if (!id) {
      return {
        multiplePersona: multiplePersonas,
        persona: null,
        customerJourney: null,
        image: null,
        aboutMe: null,
      };
    }
    const persona = await getPersona(id);

    const information = persona.information as ChatEditColumnPersona;
    const customerJourney = persona.customer_journey[0]
      ?.information as ChatEditColumnCustomerJourney;

    const image =
      persona.image_path !== null
        ? ({
            imageUrl: await getFileUrl("persona_images", persona.image_path),
            imagePrompt: null,
          } as ChatEditColumnImage)
        : null;

    const aboutMe = persona.about_me
      ? {
          aboutMe: persona.about_me,
        }
      : null;
    return {
      multiplePersona: multiplePersonas,
      persona: information,
      customerJourney: customerJourney,
      image: image,
      aboutMe: aboutMe,
    };
  };

  const fetchObjects = {
    persona: fetchPersonaTabInfo,
  };

  return (
    <ChatUI
      chatInitial={chat}
      messagesInitial={messages}
      fetchObjects={fetchObjects}
    />
  );
}
