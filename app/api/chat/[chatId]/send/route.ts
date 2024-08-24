import { Database } from '@/types/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { getAgentAnswer } from '../../agent';
import {
  getAllQuestion,
  getChat,
  getQuestionOptions,
  getUserId,
  insertRecord
} from '../../database';
export const maxDuration = 300;

//Register messages from the AI, the user and the system
const registerMessage = async (
  chatId: string,
  message: string,
  role: Database['public']['Tables']['llm_messages']['Insert']['role']
) => {
  const NewMessage: Database['public']['Tables']['llm_messages']['Insert'] = {
    chat_id: chatId,
    user_id: await getUserId(),
    content: message,
    role: role
  };

  const messageRecord = await insertRecord('llm_messages', NewMessage);
  return messageRecord;
};

export async function POST(
  req: NextRequest,
  {
    params
  }: {
    params: { chatId: string };
  }
) {
  const requestBody = await req.json();

  const userMessage = requestBody.message;
  const chatId = params.chatId;
  // Register the message from the user
  await registerMessage(chatId, userMessage, 'user');

  const { chat, prevQuestion } = await getChat(chatId);

  if (chat.status === 'closed') {
    return NextResponse.json({
      output: 'This chat is closed'
    });
  }

  if (userMessage === '') {
    return NextResponse.json({
      output: 'Please enter a message'
    });
  }

  // Validate the user message
  if (
    prevQuestion?.q_type === 'select' ||
    prevQuestion?.q_type === 'multi-select'
  ) {
    const validOptions = await getQuestionOptions(prevQuestion.id);
    if (!validOptions) {
      throw new Error('No options found for the question');
    }

    const userMessages = userMessage.split('&&');
    for (const message of userMessages) {
      if (!validOptions.includes(message)) {
       throw new Error(`Invalid option: ${message}. Choose from ${validOptions}`);
      }
    }
  } else if (prevQuestion?.q_type === 'number') {
    if (isNaN(userMessage)) {
      return NextResponse.json({
        output: 'Please enter a valid number'
      });
    }
  } else if (prevQuestion?.q_type === 'date') {
    if (!Date.parse(userMessage)) {
      return NextResponse.json({
        output: 'Please enter a valid date'
      });
    }
  }

  // Use the AI to get the next question
  const { 
    messageAgent, 
    role, 
    question, 
    actionTakenMessage, 
    outstandingQuestions } =
    await getAgentAnswer(chat, userMessage, prevQuestion);

  let q_options = null;
  if (
    question &&
    (question.q_type === 'select' || question.q_type === 'multi-select')
  ) {
    q_options = await getQuestionOptions(question.id);
  }

  await registerMessage(chatId, actionTakenMessage, 'system');
  // Register the message from the AI
  const newMessage = await registerMessage(chatId, messageAgent, role);

  const questions = await getAllQuestion(chat.category);

  return NextResponse.json({
    output: newMessage,
    question: question,
    options: q_options,
    progress: (1 - outstandingQuestions.length / questions.length) * 100
  });
}
