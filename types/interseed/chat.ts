import { ChatEditColumn } from "../components/chatTab";
import { Chat, Message, Role } from "../database";

import { z } from "zod";

export const IterationAgentOutputSchema = z.object({
  message: z.string().describe("The message to be sent to the user"),
  shouldRegenerate: z
    .boolean()
    .describe("True if the agent should regenerate the UI components"),
  imagePrompt: z
    .string()
    .optional()
    .describe("If the agent is generating an image"),
});

export type IterationAgentOutput = z.infer<typeof IterationAgentOutputSchema>;

export type Question = {
  id: number;
  question: string;
  q_type: string;
  objective: string;
};

export type AgentActionFunction = (
  context: string,
  outstandingQuestions: Question[],
  currentQuestion: Question | null,
  lastMessages: Message[]
) => Promise<{ nextQuestion: Question | null; newMessage: string }>;

export type AgentAction = {
  name: string;
  description: string;
  func: AgentActionFunction;
  role: Role;
};

export type ChatState = {
  type: string;
  description: string | null;
  function?: (input: FlowInput) => Promise<FlowOutput>;
  options?: {
    [key: string]: string;
  };
  instructions?: string;
  questions?: Question[];
  checkUpdateWorkspace?: boolean;
  executeNextInmediately?: boolean;
  next?: string;
};

export const extraInfoSchema = z.object({
  saved: z.boolean().optional(),
  edited: z.boolean().optional(),
  modifications: z.custom<ChatEditColumn>().optional(),
  idChoice: z.string().optional(),
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
export type InvokeIterationAgent = (prompt: string) => Promise<IterationAgentOutput>;

// A function that formats that takes the message
// and formats the object to be saved in the database
export type ExtractFunction = (
    input: FlowInput,
    agentResponse: IterationAgentOutput,
    currenInfo: ChatEditColumn
) => Promise<ChatEditColumn>;
