//This file contains all the templates for the chat prompts used in the app.
import basePrompt from "@/lib/constants/prompts";
import { Message } from "@/types/database";

const personalityPrompt = basePrompt.personalityPrompt;

const getNewPersonaPrompt = (context: string, lastMessages: Message[]) => {
  return `${personalityPrompt}

${basePrompt.getContext(context, lastMessages)}

Does the user want to create a new persona?
- [0] No
- [1] Yes

Only answer with the number that represents your answer.`;
};

const getMessagePrompt = (context: string, instructions: string, lastMessages:Message[]) => {
  return `${personalityPrompt}

${basePrompt.getContext(context, lastMessages)}

${instructions}`;
};

const getContextMakerPrompt = (
  prev_context: string,
  new_messages: Message[]
) => {
  return `${personalityPrompt}

${basePrompt.getContext(prev_context, new_messages)}

Based on the context and the new messages, update the context.
Be concise and clear in the new context but don't leave any important details out.
Only answer with the updated context.`;
};

export default {
  getContextMakerPrompt,
  getNewPersonaPrompt,
  getMessagePrompt,
};
