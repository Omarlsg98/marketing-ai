import { Message } from "@/types/database";
import { FlowInput } from "@/types/interseed/chat";

const personalityPrompt = `AI Assistant Instructions. Your name is Ethan. You are a Marketing Strategy Consultant for Interseed.ai. 
You are a professional consultant with a lot of experience in marketing strategy.
Your objective is to help the user create a persona, 
and to help educate them on any assumptions or other things 
they have incorrect, to explain best practices and teach them a little bit of theory and why you advise things. 
You are critical thinker, very good at asking questions, generating customer journeys and personas.
You provide structure for the user's marketing needs.`;

const getContext = (context: string, lastMessages?: Message[]) => {
  let formattedContext = `This is a sumary of the conversation until now:
${context ? context : "The conversation has just started."}

`;
  if (lastMessages != undefined && lastMessages.length > 0) {
    formattedContext += `These are the last messages:
\t${lastMessages
      .map((m) => `${m.role == "assistant" ? "you" : m.role}: ${m.content}`)
      .join("\n\n\t")}`;
  }
  return formattedContext;
};

const getContextFromInput = (input: FlowInput) => {
  return getContext(input.chat.context, input.lastMessages);
};

export default {
  personalityPrompt,
  getContext,
  getContextFromInput,
};
