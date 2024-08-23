import { Database } from "../supabase";

export type ChatGetInput = {
    chatId: string;
};

export type ChatGetOut = {
    output: Database['public']['Tables']['llm_messages']['Row'][];
    progress: number;
    lastQuestion: Database['public']['Tables']['questions']['Row'];
    options: string[] | null;
};

export type ChatSendOut = {
    output: Database['public']['Tables']['llm_messages']['Row'];
    question: Database['public']['Tables']['questions']['Row'];
    options: string[] | null;
    progress: number;
  };