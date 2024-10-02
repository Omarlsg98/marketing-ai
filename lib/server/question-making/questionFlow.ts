import { sendChatGPTJSONWithMessages } from "@/lib/server/llms";
import prompts from "@/lib/server/question-making/prompts";
import { Message } from "@/types/database";
import {
  FlowInput,
  FlowOutput,
  QuestionAgentOutput,
  QuestionAgentOutputSchema,
} from "@/types/interseed/chat";
import { getNewMessage } from "../database";

const makeQuestion = async function (
  context: string,
  instructions: string,
  lastMessages: Message[],
  questionNumber: number
): Promise<QuestionAgentOutput> {
  const systemPrompt = prompts.formulateNextQuestionPromptBuilder(
    context,
    instructions,
    questionNumber
  );
  const agentOutput: QuestionAgentOutput = await sendChatGPTJSONWithMessages(
    systemPrompt,
    lastMessages,
    QuestionAgentOutputSchema,
    1000
  );
  return agentOutput;
};

// Decide which action to take based on outstainding questions and user answers
export async function questionFlow(input: FlowInput): Promise<FlowOutput> {
  let chat = input.chat;

  chat.substep_id = chat.substep_id === null ? 1 : chat.substep_id + 1;

  const agentOutput = await makeQuestion(
    chat.context,
    input.chatState.instructions,
    input.lastMessages,
    chat.substep_id
  );

  let stateDone = false;

  let nextState = input.chat.state;
  let actionMessage = await getNewMessage(
    "assistant",
    agentOutput.message.replace("Ethan:", ""),
    chat
  );
  input.lastMessages.push(actionMessage);

  if (agentOutput.goToNextSection) {
    // If the agent should continue to the next section, set the next state to the next state
    stateDone = true;
    nextState = input.chatState.next;
    input.chat.substep_id = null;
    input.lastMessages.push(
      await getNewMessage(
        "system",
        "You decided to continue to the next section.",
        chat
      )
    );
  }

  return {
    nextState: nextState,
    messages: input.lastMessages,
    chat,
    stateDone: stateDone,
  };
}
