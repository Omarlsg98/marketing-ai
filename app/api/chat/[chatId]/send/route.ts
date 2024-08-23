import { Database } from '@/types/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { getAgentAnswer } from '../../agent';
import {
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
    const prev_q_options = await getQuestionOptions(prevQuestion.id);
    if (!prev_q_options) {
      throw new Error('No options found for the question');
    }

    const validOptions = prev_q_options.map((option) => option.q_option);
    const userMessages = userMessage.split('&&');
    for (const message of userMessages) {
      if (!validOptions.includes(message)) {
        return NextResponse.json({
          output: 'Please select a valid option'
        });
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
  const { messageAgent, role, question, actionTakenMessage } =
    await getAgentAnswer(chat, userMessage, prevQuestion);

  let q_options = null;
  if (
    question &&
    (question.q_type === 'select' || question.q_type === 'multi-select')
  ) {
    q_options = await getQuestionOptions(question.id);
    console.log(q_options);
  }

  await registerMessage(chatId, actionTakenMessage, 'system');
  // Register the message from the AI
  const newMessage = await registerMessage(chatId, messageAgent, role);

  return NextResponse.json({
    output: newMessage,
    question: question,
    options: q_options
  });
}
