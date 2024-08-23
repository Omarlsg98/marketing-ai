import { Database } from '@/types/supabase';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { AuthError, createClient, PostgrestError } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

import { v4 as uuidv4 } from 'uuid';

type questionType = Database['public']['Tables']['questions']['Row'];
type userAnswerType = Database['public']['Tables']['user_answers']['Row'];
type chatType = Database['public']['Tables']['llm_chats']['Row'];
type messageType = Database['public']['Tables']['llm_messages']['Row'];
type roles = Database['public']['Tables']['llm_messages']['Row']['role'];
type tableType = keyof Database['public']['Tables'];

const handleError: (error: PostgrestError | AuthError | null) => boolean = (
  error
) => {
  if (!error) {
    return true;
  }

  console.error('API Error:', error);

  // check error status code
  if (error.code === '401') {
    throw new Error('Unauthorized');
  } else {
    throw error;
  }
};

const getSupabaseClient = () => {
  const cookieStore = cookies();
  return createRouteHandlerClient<Database>({ cookies: () => cookieStore });
};

const getSupabaseAdminClient = () => {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );
};

export const getSession: () => any = async () => {
  const supabase = getSupabaseClient();

  const {
    data: { session },
    error
  } = await supabase.auth.getSession();

  handleError(error);

  if (session) {
    return session;
  }
  return null;
};

export const getUserId = async () => {
  const session = await getSession();
  return session?.user.id;
};

export const getLastMessages: (chatId: string) => any = async (chatId) => {
  const supabase = getSupabaseClient();
  const userId = await getUserId();

  const { data, error } = await supabase
    .from('llm_messages')
    .select('*, user_answers_sources!left(user_answer_id)')
    .eq('chat_id', chatId)
    .eq('user_id', userId)
    .is('user_answers_sources', null);

  handleError(error);

  return data;
};

// LLM Specific
export const getAllQuestionsInfo: (chat: chatType, returnLastMessages: boolean) => any = async (
  chat, returnLastMessages=true) => {
  const supabase = getSupabaseClient();
  const userId = await getUserId();

  // Get user_answers for the user
  const { data: userAnswers, error: userAnswersError } = await supabase
    .from('user_answers')
    .select('*, questions(category)')
    .eq('chat_id', chat.id)
    .eq('user_id', userId)
    .eq('questions.category', chat.category);

  handleError(userAnswersError);

  let query = supabase
    .from('questions')
    .select('*')
    .eq('category', chat.category);

  if (userAnswers && userAnswers.length > 0) {
    const answeredQuestions = userAnswers.map((ua) => ua.question_id);
    let answeredQuestionsStr = String(answeredQuestions);
    answeredQuestionsStr =
      '(' + answeredQuestionsStr.replace('[', '').replace(']', '') + ')'; // Convert to string for the query
    query = query.not('id', 'in', answeredQuestionsStr);
  }

  const { data: outstandingQuestions, error } = await query.order('q_order', {
    ascending: true
  });

  handleError(error);

  return {
    outstandingQuestions: outstandingQuestions,
    userAnswers: userAnswers,
    lastMessages: returnLastMessages? await getLastMessages(chat.id): null
  };
};

export const getAllQuestion: (category: string) => Promise<Database["public"]["Tables"]["questions"]["Row"][]> = async (category) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('category', category);

  handleError(error);

  return data;
}

export const saveUserAnswer: (
  chat_id: string,
  question_id: number,
  answer: string,
  unusedMessages: any[]
) => any = async (chat_id, question_id, answer, unusedMessages) => {
  const userId = await getUserId();

  const NewUserAnswer: Database['public']['Tables']['user_answers']['Insert'] =
    {
      user_id: userId,
      question_id: question_id,
      chat_id: chat_id,
      answer: answer
    };

  const userAnswer = await insertRecord('user_answers', NewUserAnswer);

  let userAnswerSources = [];
  // Create records in user_answer_sources for each unused message linking to the userAnswer
  for (const message of unusedMessages) {
    const NewUserAnswerSource: Database['public']['Tables']['user_answers_sources']['Insert'] =
      {
        user_answer_id: userAnswer.id,
        message_id: message.id,
        user_id: userId
      };

    const ansSource = await insertRecord(
      'user_answers_sources',
      NewUserAnswerSource
    );
    userAnswerSources.push(ansSource);
  }

  return {
    userAnswer,
    userAnswerSources
  };
};

// General get functions

export const getChat: (chatId: string) => Promise<{
  chat: Database['public']['Tables']['llm_chats']['Row'];
  prevQuestion: Database['public']['Tables']['questions']['Row'] | null;
}> = async (chatId) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('llm_chats')
    .select('*, questions(*)')
    .eq('id', chatId)
    .single();

  handleError(error);

  if (!data) {
    throw new Error('Chat not found');
  }

  const prevQuestion = data.questions;
  //remove questions from chat object
  let chat = (({ questions, ...rest }) => rest)(data);

  return {
    chat: chat,
    prevQuestion: prevQuestion
  };
};

export const getQuestionOptions: (questionId: number) => Promise<
  string[] | null
> = async (questionId) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('question_options')
    .select('q_option')
    .eq('question_id', questionId);

  handleError(error);
  return data.map((option) => option.q_option);
};

export const getChats: () => any = async () => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('llm_chats')
    .select('*')
    .order('created_at', { ascending: false })
    .returns<Database['public']['Tables']['llm_chats']['Row']>();

  if (!handleError(error)) {
    return null;
  }

  return data;
};

export const getMessages: (
  chatId: string,
  excludeSystem: boolean
) => any = async (chatId, excludeSystem) => {
  const supabase = getSupabaseClient();
  let query = supabase.from('llm_messages').select('*').eq('chat_id', chatId);
  if (excludeSystem) {
    query = query.not('role', 'eq', 'system');
  }
  const { data, error } = await query
    .order('created_at', { ascending: true })
    .returns<Database['public']['Tables']['llm_messages']['Row']>();

  if (!handleError(error)) {
    return null;
  }

  return data;
};

// Insert functions
const addUUID = (table: string, record: any) => {
  //This tables do not require an id (they are serial integers, database generated)
  if (
    table === 'llm_messages' ||
    table === 'user_answers' ||
    table === 'user_answers_sources'
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
  const supabase = getSupabaseClient();

  const final_record = addUUID(table, record);

  console.log('Inserting record into ' + table + ':', final_record);

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
  const supabase = getSupabaseClient();

  console.log('Updating record in ' + table + ':', record);

  const { data, error } = await supabase
    .from(table)
    .update(record)
    .eq('id', record.id)
    .select()
    .single();

  handleError(error);
  return data;
};

export const getRecords: (table: tableType, id: string) => any = async (
  table,
  id
) => {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.from(table).select().eq('id', id);

  handleError(error);
  return data;
};
