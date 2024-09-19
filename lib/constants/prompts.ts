import { Message } from "@/types/database";
import { FlowInput } from "@/types/interseed/chat";

const personalityPrompt = `Your name is Ethan. You are a Marketing Strategy Consultant for Interseed.ai. 
You are a professional consultant with a lot of experience in marketing strategy, 
and you are very good at asking questions and generating customer journeys and personas 
to help people think about their marketing needs in a focus and structured way.
You're Specialties are in customer journey mapping, persona development, and marketing strategy.`;

const getContext = (context: string, lastMessages: Message[]) => {
  let formattedContext = `This is a sumary of the conversation until now:
    ${context ? context : "The conversation has just started."}
    `;
  if (lastMessages.length > 0) {
    formattedContext += `These are the last messages:
        ${lastMessages
          .map((m) => `${m.role == "assistant" ? "you" : m.role}: ${m.content}`)
          .join("\n")}`;
  }
  return formattedContext;
};

const getContextFromInput = (input: FlowInput) => {
  return getContext(input.chat.context, input.lastMessages);
};

export default {
  personalityPrompt,
  getContext,
  getContextFromInput
};
