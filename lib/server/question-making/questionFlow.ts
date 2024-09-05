import { sendChatGPT, sendChatGPTUntilInteger } from "@/lib/server/llms";
import prompts from "@/lib/server/question-making/prompts";
import { Message } from "@/types/database";
import {
    AgentAction,
    AgentActionFunction,
    FlowInput,
    FlowOutput,
    Question,
} from "@/types/interseed/chat";
import { getNewMessage } from "../database";

// Decide which action to take based on outstainding questions and user answers
export const getNextAction = async (
  context: string,
  currentQuestion: Question | null,
  lastMessages: Message[]
) => {
  if (currentQuestion === null) {
    return agentActions[0];
  }

  const prompt = prompts.getMakeDecisionPrompt(
    context,
    agentActions.map((a) => a.description),
    lastMessages
  );
  const nextActionIndex = await sendChatGPTUntilInteger(prompt, 3);
  return agentActions[nextActionIndex];
};

const makeQuestion = async (
  context: string,
  question: Question,
  lastMessages: Message[]
) => {
  const prompt = prompts.getFormulateNextQuestionPrompt(
    context,
    question,
    lastMessages
  );
  const formulatedQuestion = await sendChatGPT(prompt, 200);
  return formulatedQuestion;
};

const getClarification: AgentActionFunction = async (
  context,
  outstandingQuestions,
  currentQuestion,
  lastMessages
) => {
  if (!currentQuestion) {
    throw new Error(
      "currentQuestion is null while trying to get clarification"
    );
  }

  const prompt = prompts.getClarificationPrompt(
    context,
    currentQuestion,
    lastMessages
  );
  const newMessage = await sendChatGPT(prompt, 200);
  return { nextQuestion: currentQuestion, newMessage };
};

const getFollowUpQuestion: AgentActionFunction = async (
  context,
  outstandingQuestions,
  currentQuestion,
  lastMessages
) => {
  if (!currentQuestion) {
    throw new Error(
      "currentQuestion is null while trying to get clarification"
    );
  }

  const prompt = prompts.getFollowUpQuestionPrompt(
    context,
    currentQuestion,
    lastMessages,
    outstandingQuestions
  );
  const newMessage = await sendChatGPT(prompt, 200);
  return { nextQuestion: currentQuestion, newMessage };
};

const getConfirmationContinue: AgentActionFunction = async (
  context,
  outstandingQuestions,
  currentQuestion,
  lastMessages
) => {
  if (!currentQuestion) {
    throw new Error(
      "currentQuestion is null while trying to get clarification"
    );
  }

  const prompt = prompts.getConfirmationContinuePrompt(
    context,
    currentQuestion,
    lastMessages
  );
  const newMessage = await sendChatGPT(prompt, 200);
  return { nextQuestion: currentQuestion, newMessage };
};

const getNextQuestion: AgentActionFunction = async (
  context,
  outstandingQuestions,
  currentQuestion,
  lastMessages
) => {
  const nextQuestion = outstandingQuestions.shift();
  if (!nextQuestion) {
    return { nextQuestion: null, newMessage: "" };
  }

  const newMessage = await makeQuestion(context, nextQuestion, lastMessages);
  return { nextQuestion, newMessage };
};

const getFreeFormAnswer: AgentActionFunction = async (
  context,
  outstandingQuestions,
  currentQuestion,
  lastMessages
) => {
  const prompt = prompts.getFreeFormAnswerPrompt(
    context,
    currentQuestion,
    lastMessages
  );
  const newMessage = await sendChatGPT(prompt, 500);
  return { nextQuestion: currentQuestion, newMessage };
};

const agentActions: AgentAction[] = [
  {
    name: "Ask next MAIN question",
    description:
      `Ask next MAIN question. Choose this if the user answer is good enough ` +
      `or if you've been in the same question for too long ` +
      `or if the user does not seems to know a better answer and wants to continue`,
    func: getNextQuestion,
    role: "assistant",
  },
  {
    name: "Stay in the same MAIN question, Ask follow-up question",
    description:
      `Stay in the same MAIN question, Help the user dig deeper into the question asking suporting questions. ` +
      `Choose this if the user's answer is good but you need more information or examples.`,
    func: getFollowUpQuestion,
    role: "assistant",
  },
  {
    name: "Stay in the same MAIN question, Ask for clarification",
    description:
      `Stay in the same MAIN question, Ask the user to clarify the answer. ` +
      `Choose this if the user's answer is not clear or ` +
      `is not related at all to the question `,
    func: getClarification,
    role: "assistant",
  },
  {
    name: "Ask if the user wants to keep going",
    description:
      `Ask if the user wants to keep going. ` +
      `Choose this if the user seems to not know more or not willing to provide a better answer.`,
    func: getConfirmationContinue,
    role: "assistant",
  },
  {
    name: "Other",
    description:
      `Answer anything else to the user. ` +
      `Choose this if the user make you a question, a random comment, or anything else that does not fit the other actions in the flow of the conversation.`,
    func: getFreeFormAnswer,
    role: "assistant",
  },
];

// Decide which action to take based on outstainding questions and user answers
export async function questionFlow(input: FlowInput): Promise<FlowOutput> {
  let chat = input.chat;
  let currentQuestion: Question | null = null;
  if (chat.substep_id !== null) {
    currentQuestion = input.chatState.questions[chat.substep_id];
  }
  let remainingQuestions = input.chatState.questions.slice(chat.substep_id + 1);

  let agentAction = await getNextAction(
    chat.context,
    currentQuestion,
    input.lastMessages
  );

  const systemMessage: Message = getNewMessage(
    "system",
    `You decided to ${agentAction.name}`,
    chat
  );

  input.lastMessages.push(systemMessage);

  const { nextQuestion, newMessage } = await agentAction["func"](
    chat.context,
    remainingQuestions,
    currentQuestion,
    input.lastMessages
  );

  let actionMessage: Message = getNewMessage(
    "system",
    "You realized there are no more questions to ask, you continue to the next section",
    chat
  );

  let nextState = input.chatState.next;
  let stateDone = false;
  chat.substep_id = null;

  if (nextQuestion) {
    // If there is a next question, set the next state to the current state
    chat.substep_id = nextQuestion.id;
    nextState = input.chat.state;
    stateDone = true;
    actionMessage = getNewMessage(
      agentAction["role"],
      newMessage.replace("Ethan:", ""),
      chat
    );
  }

  input.lastMessages.push(actionMessage);

  return {
    nextState: nextState,
    messages: input.lastMessages,
    chat,
    stateDone: stateDone,
  };
}
