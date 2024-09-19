import { createServerSupabaseClient, getSession } from "@/lib/server/supabase";
import { Chat, Message, PersonaInformation, Role } from "@/types/database";
import { Database } from "@/types/supabase";
import { AuthError, PostgrestError } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

type chatType = Database["public"]["Tables"]["llm_chats"]["Row"];
type messageType = Database["public"]["Tables"]["llm_messages"]["Row"];
type roles = Database["public"]["Tables"]["llm_messages"]["Row"]["role"];
type tableType = keyof Database["public"]["Tables"];

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

export const getLastMessages: (chatId: string) => any = async (chatId) => {
  const supabase = createServerSupabaseClient();
  const userId = await getUserId();

  const { data, error } = await supabase
    .from("llm_messages")
    .select("*, user_answers_sources!left(user_answer_id)")
    .eq("chat_id", chatId)
    .eq("user_id", userId)
    .is("user_answers_sources", null);

  handleError(error);

  return data;
};

// LLM Specific functions

export const getChat: (chatId: string) => Promise<{
  chat: Database["public"]["Tables"]["llm_chats"]["Row"];
}> = async (chatId) => {
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

  return {
    chat: data,
  };
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

export const getMessages: (
  chatId: string,
  excludeSystem: boolean
) => any = async (chatId, excludeSystem) => {
  const supabase = createServerSupabaseClient();
  let query = supabase.from("llm_messages").select("*").eq("chat_id", chatId);
  if (excludeSystem) {
    query = query.not("role", "eq", "system");
  }
  const { data, error } = await query
    .order("created_at", { ascending: true })
    .returns<Database["public"]["Tables"]["llm_messages"]["Row"]>();

  if (!handleError(error)) {
    return null;
  }

  return data;
};

export const getPersonas: (
  numRecords: number | null
) => Promise<PersonaInformation["v1_short"][]> = async (numRecords) => {
  const supabase = createServerSupabaseClient();

  if (!numRecords) {
    numRecords = 100;
  }

  const { data, error } = await supabase
    .from("persona")
    .select(
      `
    id,
    name,
    short_description,
    finished,
    primary_goal,
    key_challenge,
    main_buying_motivation,
    image_path
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
) => Promise<PersonaInformation["v1"]> = async (personaId) => {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("persona")
    .select(
      `
    id,
    name,
    short_description,
    finished,
    llm_chats(progress),
    primary_goal,
    key_challenge,
    main_buying_motivation,
    image_path,
    about_me,
    gender,
    ethnicity,
    location,
    occupation,
    profile: information->profile,
    discovery: information->discovery,
    evaluation: information->evaluation,
    purchase: information->purchase,
    implementation: information->implementation,
    renewal: information->renewal
    `
    )
    .eq("id", personaId)
    .single();

  handleError(error);

  return {
    ...data,
    chat_progress: data.llm_chats.progress,
    profile: data.profile as any,
    discovery: data.discovery as any,
    evaluation: data.evaluation as any,
    purchase: data.purchase as any,
    implementation: data.implementation as any,
    renewal: data.renewal as any,
  };
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
  //This tables do not require an id (they are serial integers, database generated)
  if (
    table === "llm_messages" ||
    table === "user_answers" ||
    table === "user_answers_sources" ||
    table == "persona" // Persona is a special case, it has same UUID as chat
  ) {
    return record;
  }

  record.id = uuidv4();
  return record;
};

export const insertRecord: (table: tableType, record: any) => any = async (
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

export const updateRecord: (table: tableType, record: any) => any = async (
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

export const getRecords: (table: tableType, id: string) => any = async (
  table,
  id
) => {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase.from(table).select().eq("id", id);

  handleError(error);
  return data;
};

export const getNewMessage = function (
  role: Role,
  content: string,
  chat: Chat
): Message {
  return {
    chat_id: chat.id,
    content: content,
    id: 0,
    role: role,
    user_id: chat.user_id,
  };
};
