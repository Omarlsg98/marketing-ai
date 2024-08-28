import { getAllQuestionsInfo, saveUserAnswer, updateRecord } from '@/lib/server/database';
import { Database } from '@/types/supabase';
import { sendChatGPT } from '../llms';
import prompts from './prompts';

type questionType = Database['public']['Tables']['questions']['Row'];
type userAnswerType = Database['public']['Tables']['user_answers']['Row'];
type chatType = Database['public']['Tables']['llm_chats']['Row'];
type messageType = Database['public']['Tables']['llm_messages']['Row'];
type roles = Database['public']['Tables']['llm_messages']['Row']['role'];

type agentActionFunctionType = (
  context: string,
  outstandingQuestions: questionType[],
  currentQuestion: questionType | null
) => Promise<{ nextQuestion: questionType | null; newMessage: string }>;

type agentActionType = {
  name: string;
  description: string;
  func: agentActionFunctionType;
  role: roles;
};

const sendUntilInteger = async (prompt: string, maxRetries: number) => {
  let retries = maxRetries;
  while (retries > 0) {
    try {
      let response = await sendChatGPT(prompt, 5);
      // remove everythibg that is not a number
      response = response.replace(/\D/g, '');
      const responseInt = parseInt(response);
      retries--;
      if (!isNaN(responseInt)) {
        return responseInt;
      }
    } catch (error) {
      console.error(error);
    }
  }
  throw new Error('Could not get a valid integer');
};

// Decide which action to take based on outstainding questions and user answers
export const getNextAction = async (
  context: string,
  currentQuestion: questionType
) => {
  // If the question is a text or multiline question, ask the AI to make a decision on the next action
  // Otherwise, continue with the next question
  if (
    currentQuestion.q_type !== 'multiline' &&
    currentQuestion.q_type !== 'text'
  ) {
    return agentActions[0];
  }

  const prompt = prompts.getMakeDecisionPrompt(
    context,
    agentActions.map((a) => a.description)
  );
  const nextActionIndex = await sendUntilInteger(prompt, 3);
  return agentActions[nextActionIndex];
};

const makeQuestion = async (context: string, question: questionType) => {
  const prompt = prompts.getFormulateNextQuestionPrompt(context, question);
  const formulatedQuestion = await sendChatGPT(prompt, 200);
  return formulatedQuestion;
};

// Choose the next question to ask based on the user's answers and the outstanding questions
const getNextQuestion: agentActionFunctionType = async (
  context,
  outstandingQuestions,
  currentQuestion
) => {
  if (outstandingQuestions.length === 0) {
    return {
      nextQuestion: null,
      newMessage:
        'This is the end of the conversation. I have all the information I need. If you have any more questions, feel free to ask!'
    };
  }

  const prompt = prompts.getChooseNextQuestionPrompt(
    context,
    outstandingQuestions.slice(0, 10)
  );
  const nextQuestionIndex = await sendUntilInteger(prompt, 3);
  const nextQuestion = outstandingQuestions[nextQuestionIndex];

  const newMessage = await makeQuestion(context, nextQuestion);
  return { nextQuestion, newMessage };
};

const getClarification: agentActionFunctionType = async (
  context,
  outstandingQuestions,
  currentQuestion
) => {
  if (!currentQuestion) {
    throw new Error(
      'currentQuestion is null while trying to get clarification'
    );
  }

  const prompt = prompts.getClarificationPrompt(context, currentQuestion);
  const newMessage = await sendChatGPT(prompt, 200);
  return { nextQuestion: currentQuestion, newMessage };
};

const getFollowUpQuestion: agentActionFunctionType = async (
  context,
  outstandingQuestions,
  currentQuestion
) => {
  if (!currentQuestion) {
    throw new Error(
      'currentQuestion is null while trying to get clarification'
    );
  }

  const prompt = prompts.getFollowUpQuestionPrompt(
    context,
    currentQuestion,
    outstandingQuestions
  );
  const newMessage = await sendChatGPT(prompt, 200);
  return { nextQuestion: currentQuestion, newMessage };
};

const getConfirmationContinue: agentActionFunctionType = async (
  context,
  outstandingQuestions,
  currentQuestion
) => {
  if (!currentQuestion) {
    throw new Error(
      'currentQuestion is null while trying to get clarification'
    );
  }

  const prompt = prompts.getConfirmationContinuePrompt(
    context,
    currentQuestion,
    outstandingQuestions
  );
  const newMessage = await sendChatGPT(prompt, 200);
  return { nextQuestion: currentQuestion, newMessage };
};

const getChatContext = async (
  prev_context: string,
  newMessages: messageType[]
) => {
  const prompt = prompts.getContextMakerPrompt(prev_context, newMessages);
  let context = await sendChatGPT(prompt, 500);

  context =
    context +
    `

  This is the last interaction you had with the user:
  ${newMessages
    .map((m) => `${m.role == 'assistant' ? 'you' : m.role}: ${m.content}`)
    .join('\n')}`;

  return context;
};

const getAnswerSummary = async (
  context: string,
  userMessage: string,
  question: questionType
) => {
  if (question.q_type !== 'text' && question.q_type !== 'multiline') {
    return userMessage;
  }

  const prompt = prompts.getSummaryAnswerPrompt(context, userMessage);
  const answer = await sendChatGPT(prompt, 400);
  return answer;
};

const agentActions: agentActionType[] = [
  {
    name: 'Ask next MAIN question',
    description:
      `Ask next MAIN question. Choose this if the user answer is good enough ` +
      `or if you've been in the same question for too long ` +
      `or if the user does not seems to know a better answer and wants to continue`,
    func: getNextQuestion,
    role: 'assistant'
  },
  {
    name: 'Stay in the same MAIN question, Ask follow-up question',
    description:
      `Stay in the same MAIN question, Help the user dig deeper into the question asking suporting questions. ` +
      `Choose this if the user's answer is good but you need more information or examples.`,
    func: getFollowUpQuestion,
    role: 'assistant'
  },
  {
    name: 'Stay in the same MAIN question, Ask for clarification',
    description:
      `Stay in the same MAIN question, Ask the user to clarify the answer. ` +
      `Choose this if the user's answer is not clear or ` +
      `is not related at all to the question `,
    func: getClarification,
    role: 'assistant'
  },
  {
    name: 'Ask if the user wants to keep going',
    description:
      `Ask if the user wants to keep going. ` +
      `Choose this if the user seems to not know more or not willing to provide a better answer.`,
    func: getConfirmationContinue,
    role: 'assistant'
  }
];

// Decide which action to take based on outstainding questions and user answers
export const getAgentAnswer: (
  chat: chatType,
  userMessage: string,
  prevQuestion: questionType | null
) => Promise<{
  messageAgent: string;
  role: roles;
  question: questionType | null;
  actionTakenMessage: string;
}> = async (chat, userMessage, prevQuestion) => {
  const { outstandingQuestions, userAnswers, lastMessages } =
    await getAllQuestionsInfo(chat, true);

  let agentAction: agentActionType = agentActions[0];
  let chatIsNew = false;

  if (chat.context === null) {
    chat.context = `You are just starting the interview. Introduce yourself and `;
  }

  // If the chat is new, ask the first question
  if (chat.status === 'new') {
    agentAction = agentActions[0];
    chat.status = 'in_progress';
    chatIsNew = true;
  } else {
    if (prevQuestion === null) {
      throw new Error('prevQuestion is null while trying to get next action');
    }

    chat.context = await getChatContext(chat.context, lastMessages);
    agentAction = await getNextAction(chat.context, prevQuestion);
  }

  if (
    !chatIsNew &&
    prevQuestion !== null &&
    agentAction['func'] === getNextQuestion
  ) {
    if (chat.last_question_id === null) {
      throw new Error(
        'chat.last_question_id is null while trying to save user answer'
      );
    }

    const answer = await getAnswerSummary(
      chat.context,
      userMessage,
      prevQuestion
    );
    await saveUserAnswer(chat.id, chat.last_question_id, answer, lastMessages);
  }

  const { nextQuestion, newMessage } = await agentAction['func'](
    chat.context,
    outstandingQuestions,
    prevQuestion
  );

  if (!nextQuestion) {
    chat.status = 'closed';
    chat.context = chat.context + '\n\nThe conversation had ended.';
  }

  if (chatIsNew) {
    chat.context = 'This is the beginning of the conversation. ';
  }

  const userAnswersLength = userAnswers?.length || 0;
  chat.progress = userAnswersLength / (userAnswersLength + outstandingQuestions.length) * 100;
  chat.last_question_id = nextQuestion?.id || null;

  await updateRecord('llm_chats', chat);
  return {
    messageAgent: newMessage.replace("Ethan:", ""), //failsafe to remove the name
    role: agentAction['role'],
    question: nextQuestion,
    actionTakenMessage: `You decided to ${agentAction.name}`
  };
};
