import { ChatEditColumn, ChatTabTypes } from "../components/chatTab";
import { Chat, Message } from "../database";

import { z } from "zod";

export const IterationAgentOutputSchema = z.object({
  message: z
    .string()
    .describe(
      "The message to be sent to the user, it could contain key information."
    ),
  shouldFormat: z
    .boolean()
    .describe(
      "True if the agent is sending in the message new or modified key information that needs to be formatted"
    ),
  imagePrompt: z
    .string()
    .optional()
    .describe("If the agent is generating an image"),
});

export type IterationAgentOutput = z.infer<typeof IterationAgentOutputSchema>;

export const QuestionAgentOutputSchema = z.object({
  message: z
    .string()
    .describe(
      "The message to be sent to the user."
    ),
  goToNextSection: z
    .boolean()
    .describe(
      "True if the agent should stop gathering information and should continue to the next section."
    ),
});

export type QuestionAgentOutput = z.infer<typeof QuestionAgentOutputSchema>;

export type ChatState = {
  type: string;
  description: string | null;
  function?: (input: FlowInput) => Promise<FlowOutput>;
  options?: {
    [key: string]: string;
  };
  instructions?: string;
  checkUpdateWorkspace?: boolean;
  executeNextInmediately?: boolean;
  next?: string;
};

export const extraInfoSchema = z.object({
  saved: z.boolean().optional(),
  edited: z.boolean().optional(),
  modifications: z.custom<ChatEditColumn>().optional(),
  idChoice: z.string().optional(),
  type: z.enum(ChatTabTypes).optional(),
});

export type ExtraInfo = z.infer<typeof extraInfoSchema>;

export type FlowInput = {
  chatState: ChatState;
  chat: Chat;
  lastMessages: Message[];
  extraInfo: ExtraInfo | null;
};

export type FlowOutput = {
  nextState: string;
  messages: Message[];
  chat: Chat;
  stateDone: boolean;
  other?: any;
};

// A function that generates a follow-up prompt based on the current information
export type IterationPromptBuilder = (
  input: FlowInput,
  currentInfo: ChatEditColumn,
  editInfo: ChatEditColumn
) => string;

// A function that generates the actual message to be sent to the user
export type InvokeIterationAgent = (
  prompt: string
) => Promise<IterationAgentOutput>;

// A function that formats that takes the message
// and formats the object to be saved in the database
export type ExtractFunction = (
  input: FlowInput,
  agentResponse: IterationAgentOutput,
  currenInfo: ChatEditColumn
) => Promise<ChatEditColumn>;
