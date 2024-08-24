import { NextRequest, NextResponse } from "next/server";
import {
  getAllQuestion,
  getAllQuestionsInfo,
  getChat,
  getMessages,
  getQuestionOptions,
} from "../database";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: { chatId: string };
  }
) {
  const chatId = params.chatId;

  const { chat } = await getChat(chatId);
  const allMessages = await getMessages(chatId, true);
  const { outstandingQuestions } = await getAllQuestionsInfo(chat, false);
  const questions = await getAllQuestion(chat.category);

  const lastQuestion = questions.find((q) => q.id === chat.last_question_id);

  let q_options = null;
  if (
    lastQuestion &&
    (lastQuestion.q_type === "select" || lastQuestion.q_type === "multi-select")
  ) {
    q_options = await getQuestionOptions(lastQuestion.id);
  }

  return NextResponse.json({
    output: allMessages,
    progress: (1 - outstandingQuestions.length / questions.length) * 100,
    lastQuestion: lastQuestion,
    options: q_options,
  });
}
