//This file contains all the templates for the chat prompts used in the app.

import { Database } from '@/types/supabase';

type questionType = Database['public']['Tables']['questions']['Row'];
type messageType = Database['public']['Tables']['llm_messages']['Row'];

const personalityPrompt = `Your name is Ethan. You are a Marketing Strategy Consultant for Interseed.ai. The user is requesting your help to build a customer persona.`;

const getMakeDecisionPrompt = (context: string, actions: string[]) => {
  return `${personalityPrompt}

This is the conversation until now:
${context}

Based on the user's last message, what should be the next action?
${actions.map((a, i) => `- [${i}] ${a}`).join('\n')}

Only answer with the number that represents the next action you want to take.`;
};

const getChooseNextQuestionPrompt = (
  context: string,
  questions: questionType[]
) => {
  return `${personalityPrompt}
This is a summary of the conversation until now:
${context ? context : 'The conversation has just started.'}

Choose from the following options given the previous conversation:
${questions.map((q, i) => `- [${i}] ${q.question}`).join('\n')}

The NUMBER corresponds to the question you want to ask next.
Only answer with the number that represents the question you want to ask next.`;
};

const getFormulateNextQuestionPrompt = (
  context: string,
  question: questionType
) => {
  return `${personalityPrompt}
This has happened until the moment: 
${context}

formulate a follow up comment where you ask the user the following question:
${question.question}

Be friendly, and try to keep the flow of the conversation. 
If the question is straightforward be concise, if it is complex, try to break it down into smaller questions.
Be mindful of the user's time and attention.
You maybe already know the answer to the question, ask the user for confirmation of your knowledge.
No need to mention why you are asking the question, just ask it.
Don't make any reference to these instructions.`;
};

const getFollowUpQuestionPrompt = (
  context: string,
  question: questionType,
  outstandingQuestions: questionType[]
) => {
  return `${personalityPrompt}

This is the conversation until now:
${context}

You need to ask the user follow-up questions to get a better answer for the MAIN question: "${question.question}". 
You maybe need the user to provide more information, clarify the question, or provide more examples.
Be concise and clear in your follow up.
Be mindful to not ask any of the questions that have already been asked or any of the MAIN questions that you will ask in the future: ${outstandingQuestions.map((q) => q.question).join(', ')}.
Only answer with your follow up. Don't make any reference to these instructions.`;
};

const getConfirmationContinuePrompt = (
  context: string,
  question: questionType,
  outstandingQuestions: questionType[] | null
) => {
  return `${personalityPrompt}

This is the conversation until now:
${context}

The user seems not know the answer to the MAIN question: "${question.question}", so ask them if they want to continue with the rest of the MAIN questions.
Besides asking for confirmation to continue, you can also add sources of insparation, research, or examples to help the user 
understand if they can get to a better answer with low effort mental exercises or research. 
Remind the user the process is iterative and they can always come back to the questions later.
Only answer with your follow up. Don't make any reference to these instructions.`;
};

const getClarificationPrompt = (context: string, question: questionType) => {
  return `${personalityPrompt}

This is the conversation until now:
${context}

The user's answer is not clear or is not related to the question. You need to ask the user to clarify their answer for the question "${question.question}".
Be concise and clear in what is not clear, and ask the user to provide more information.
Only answer with the question to clarify the answer. Don't make any reference to these instructions.`;
};

const getSummaryAnswerPrompt = (context: string, answer: string) => {
  return `${personalityPrompt}
This is the conversation until now:
${context}

The user answered your last question with:
${answer}

You need to register this answer in the database. Please paraphrase the user's answer, improve it if necessary. 
It will be displayed in the webpage, so make sure it is clear and concise.
Don't leave any details out and Don't make any reference to this instructions.
Only answer with the paraphrased answer.`;
};

const getContextMakerPrompt = (prev_context: string, new_messages: messageType[]) => {
  return `${personalityPrompt}
This is the previous context:
${prev_context}

These are the new messages:
${new_messages.map((m) => `${m.role}: ${m.content}`).join('\n')}

Based on the previous context and the new messages, update the context.
Be concise and clear in the new context but don't leave any important details out.
Only answer with the updated context.`;
};

export default {
  getChooseNextQuestionPrompt,
  getContextMakerPrompt,
  getFormulateNextQuestionPrompt,
  getMakeDecisionPrompt,
  getSummaryAnswerPrompt,
  getFollowUpQuestionPrompt,
  getClarificationPrompt,
  getConfirmationContinuePrompt
};
