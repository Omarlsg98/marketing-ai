"use server";

import { createServerSupabaseClient, getSession } from "@/lib/server/supabase";
import {
  ChatEditColumnAboutMe,
  ChatEditColumnComponent,
  ChatEditColumnCustomerJourney,
  ChatEditColumnImage,
  ChatEditColumnPersona,
  ChatEditColumnPersonaSelector,
} from "@/types/components/chatTab";
import { Chat, Message, Role, Table } from "@/types/database";
import { Database } from "@/types/supabase";
import { AuthError, PostgrestError } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

const handleError: (error: PostgrestError | AuthError | null) => boolean = (
  error
) => {
  if (!error) {
    return true;
  }

  console.error("API Error:", error);

  // check error status code
  if (error.code === "401") {
    throw new Error("Unauthorized");
  } else {
    throw error;
  }
};

export const getUserId = async () => {
  let session = await getSession();
  if (!session) {
    throw new Error("No session found for " + cookies().getAll);
  }

  return session.id;
};

export const getLastMessages: (chat: Chat) => Promise<Message[]> = async (
  chat
) => {
  const supabase = createServerSupabaseClient();
  let dateThreshold = chat.created_at;

  if (chat.last_message_id_in_context) {
    //get last message in context date
    const { data: lastInContext, error: errorLIC } = await supabase
      .from("llm_messages")
      .select("created_at")
      .eq("chat_id", chat.id)
      .eq("id", chat.last_message_id_in_context)
      .single();

    handleError(errorLIC);
    dateThreshold = lastInContext.created_at;
  }

  const { data, error } = await supabase
    .from("llm_messages")
    .select("*")
    .eq("chat_id", chat.id)
    .gt("created_at", dateThreshold)
    .order("created_at", { ascending: true });

  handleError(error);

  return data;
};

export const getChat: (
  chatId: string
) => Promise<Database["public"]["Tables"]["llm_chats"]["Row"]> = async (
  chatId
) => {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("llm_chats")
    .select("*")
    .eq("id", chatId)
    .single();

  handleError(error);

  if (!data) {
    throw new Error("Chat not found");
  }

  return data;
};

export const getChats: () => any = async () => {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("llm_chats")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<Database["public"]["Tables"]["llm_chats"]["Row"]>();

  if (!handleError(error)) {
    return null;
  }

  return data;
};

export const updateChat: (chat: Chat) => Promise<any> = async (chat) => {
  const result = await updateRecord("llm_chats", chat);
  return result;
};

export const getMessages: (
  chatId: string,
  excludeSystem: boolean
) => Promise<Message[]> = async (chatId, excludeSystem) => {
  const supabase = createServerSupabaseClient();
  let query = supabase.from("llm_messages").select("*").eq("chat_id", chatId);
  if (excludeSystem) {
    query = query.not("role", "eq", "system");
  }
  const { data, error } = await query.order("created_at", { ascending: true });

  if (!handleError(error)) {
    return null;
  }

  return data;
};

export const registerMessages: (messages: Message[]) => any = async (
  messages
) => {
  const result = await bulkInsertRecords("llm_messages", messages);
  return result;
};

export const saveEditColumn: (chat: Chat) => Promise<any> = async (chat) => {
  if (chat.display_info == null) {
    return null;
  }

  const info = JSON.parse(
    chat.display_info as string
  ) as ChatEditColumnComponent;
  const type = info.type;
  const current = info.current;
  const author = info.author;

  if (current == null) {
    return null;
  }
  let result: any = null;

  switch (type) {
    case "multiplePersona": {
      const personas = current as ChatEditColumnPersonaSelector;

      const supabase = createServerSupabaseClient();
      // delete previous personas for this user made by the assistant in version 1
      // if they exist
      const { data, error } = await supabase
        .from("persona")
        .delete()
        .eq("user_id", chat.user_id)
        .eq("is_suggestion", true)
        .eq("author", "assistant");

      handleError(error);

      const fullPersonas: Database["public"]["Tables"]["persona"]["Insert"][] =
        personas.personas.map((persona) => {
          return {
            short_information: persona,
            author: author,
            id: uuidv4(),
            user_id: chat.user_id,
            is_suggestion: true,
          };
        });

      result = await bulkInsertRecords("persona", fullPersonas);
      return result;
    }
    case "persona": {
      const persona = current as ChatEditColumnPersona;
      const personaRecord: Database["public"]["Tables"]["persona"]["Insert"] = {
        information: persona,
        id: chat.object_context_id,
        author: author,
        user_id: chat.user_id,
        is_suggestion: false,
      };

      result = await updateRecord("persona", personaRecord);
      return result;
    }
    case "customerJourney": {
      const journey = current as ChatEditColumnCustomerJourney;
      const journeyRecord: Database["public"]["Tables"]["customer_journey"]["Insert"] =
        {
          information: journey,
          author: author,
          id: chat.object_context_id,
          user_id: chat.user_id,
          persona_id: chat.object_context_id,
        };

      result = await upsertRecord("customer_journey", journeyRecord);
      return result;
    }
    case "image": {
      const imageinfo = current as ChatEditColumnImage;

      const imageRecord: Database["public"]["Tables"]["persona"]["Update"] = {
        id: chat.object_context_id,
        image_path: imageinfo.imageUrl,
        user_id: chat.user_id,
        author: author,
      };

      result = await updateRecord("persona", imageRecord);
      return result;
    }
    case "aboutMe": {
      const aboutMe = current as ChatEditColumnAboutMe;
      const aboutMeRecord: Database["public"]["Tables"]["persona"]["Update"] = {
        id: chat.object_context_id,
        about_me: aboutMe.aboutMe,
        user_id: chat.user_id,
        author: author,
      };

      result = await updateRecord("persona", aboutMeRecord);
      return result;
    }
    default: {
      throw new Error("Invalid type");
    }
  }
};

export const getPersonas: (
  numRecords: number | null
) => Promise<Database["public"]["Tables"]["persona"]["Update"][]> = async (
  numRecords
) => {
  const supabase = createServerSupabaseClient();

  if (!numRecords) {
    numRecords = 100;
  }

  const { data, error } = await supabase
    .from("persona")
    .select(
      `
    id,
    short_information
    `
    )
    .order("finished", { ascending: false })
    .order("updated_at", { ascending: false })
    .limit(numRecords);

  handleError(error);

  return data;
};

export const getPersonaFormatted: (
  personaId: string
) => Promise<Database["public"]["Tables"]["persona"]["Update"]> = async (
  personaId
) => {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("persona")
    .select(
      `
    id,
    information,
    short_information
    `
    )
    .eq("id", personaId)
    .single();

  handleError(error);

  return data;
};

export const getPersonaRecord: (
  personaId: string
) => Promise<Database["public"]["Tables"]["persona"]["Row"]> = async (
  personaId
) => {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("persona")
    .select(`*`)
    .eq("id", personaId)
    .single();

  handleError(error);

  return data;
};

// Insert functions
const addUUID = (table: string, record: any) => {
  if (!record.id) record.id = uuidv4();

  return record;
};

export const insertRecord: (table: Table, record: any) => any = async (
  table,
  record
) => {
  const supabase = createServerSupabaseClient();

  const final_record = addUUID(table, record);

  console.log("Inserting record into " + table + ":", final_record);

  const { data, error } = await supabase
    .from(table)
    .insert(final_record)
    .select()
    .single();

  handleError(error);
  return data;
};

export const bulkInsertRecords: (table: Table, records: any[]) => any = async (
  table,
  records
) => {
  const supabase = createServerSupabaseClient();

  console.log("Inserting records into " + table + ":", records);

  // add UUIDs to records
  records = records.map((record) => addUUID(table, record));

  const { data, error } = await supabase.from(table).insert(records);

  handleError(error);
  return data;
};

export const updateRecord: (table: Table, record: any) => any = async (
  table,
  record
) => {
  const supabase = createServerSupabaseClient();

  console.log("Updating record in " + table + ":", record);

  const { data, error } = await supabase
    .from(table)
    .update(record)
    .eq("id", record.id)
    .select()
    .single();

  handleError(error);
  return data;
};

export const upsertRecord: (table: Table, record: any) => any = async (
  table,
  record
) => {
  const supabase = createServerSupabaseClient();

  console.log("Upserting record in " + table + ":", record);

  const { data, error } = await supabase
    .from(table)
    .upsert(record)
    .select()
    .single();

  handleError(error);
  return data;
};

export const getRecords: (table: Table, id: string) => any = async (
  table,
  id
) => {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase.from(table).select().eq("id", id);

  handleError(error);
  return data;
};

export const getNewMessage = async function (
  role: Role,
  content: string,
  chat: Chat
): Promise<Message> {
  return {
    chat_id: chat.id,
    content: content,
    id: uuidv4(),
    role: role,
    user_id: chat.user_id,
  };
};
