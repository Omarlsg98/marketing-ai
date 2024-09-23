//This file contains all the templates for the question related prompts that the AI will generate.

import basePrompts from "@/lib/constants/prompts";
import { Message } from "@/types/database";
import { Question } from "@/types/interseed/chat";

const personalityPrompt = basePrompts.personalityPrompt;

const getMakeDecisionPrompt = (
  context: string,
  actions: string[],
  lastMessages: Message[]
) => {
  return `${personalityPrompt}

${basePrompts.getContext(context, lastMessages)}

Based on the user's last message, what should be the next action?
${actions.map((a, i) => `- [${i}] ${a}`).join("\n")}

Only answer with the number that represents the next action you want to take.`;
};

const getFormulateNextQuestionPrompt = (
  context: string,
  question: Question,
  lastMessages: Message[]
) => {
  return `${personalityPrompt}

${basePrompts.getContext(context, lastMessages)}

---

Now, formulate a follow up comment where you ask the user the following question:
${question.question}

Your goal is ${question.objective}.

Keep the flow of the conversation. 
If the question is straightforward be concise, if it is complex, try to break it down into smaller questions.
Be mindful of the user's time and attention.
You maybe already know the answer to the question, ask the user for confirmation of your knowledge.
No need to mention why you are asking the question, just ask it.
Don't make any reference to these instructions.`;
};

const getFollowUpQuestionPrompt = (
  context: string,
  question: Question,
  lastMessages: Message[],
  outstandingQuestions: Question[]
) => {
  return `${personalityPrompt}

${basePrompts.getContext(context, lastMessages)}

You need to ask the user follow-up questions to get a better answer for the MAIN question: "${question.question}". 
You maybe need the user to provide more information, clarify the question, or provide more examples.
Be concise and clear in your follow up.
Be mindful to not ask any of the questions that have already been asked or any of the MAIN questions that you will ask in the future: ${outstandingQuestions.map((q) => q.question).join(", ")}.
Only answer with your follow up. Don't make any reference to these instructions.`;
};

const getConfirmationContinuePrompt = (
  context: string,
  question: Question,
  lastMessages: Message[]
) => {
  return `${personalityPrompt}

${basePrompts.getContext(context, lastMessages)}

The user seems not know the answer to the MAIN question: "${question.question}", so ask them if they want to continue with the rest of the MAIN questions.
Besides asking for confirmation to continue, you can also add sources of insparation, research, or examples to help the user 
understand if they can get to a better answer with low effort mental exercises or research. 
Remind the user the process is iterative and they can always come back to the questions later.
Only answer with your follow up. Don't make any reference to these instructions.`;
};

const getClarificationPrompt = (
  context: string,
  question: Question,
  lastMessages: Message[]
) => {
  return `${personalityPrompt}

${basePrompts.getContext(context, lastMessages)}

The user's answer is not clear or is not related to the question. You need to ask the user to clarify their answer for the question "${question.question}".
Be concise and clear in what is not clear, and ask the user to provide more information.
Only answer with the question to clarify the answer. Don't make any reference to these instructions.`;
};

const getFreeFormAnswerPrompt = (
  context: string,
  question: Question,
  lastMessages: Message[]
) => {
  return `${personalityPrompt}

${basePrompts.getContext(context, lastMessages)}

Answer the user's question or comment.
Be concise and clear in your answer.
Only answer with your response. Don't make any reference to these instructions.`;
};

export default {
  getFormulateNextQuestionPrompt,
  getFollowUpQuestionPrompt,
  getClarificationPrompt,
  getConfirmationContinuePrompt,
  getFreeFormAnswerPrompt,
  getMakeDecisionPrompt,
};
