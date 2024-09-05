import { ChatEditColumn } from "../components/chatTab";
import { Chat, Message, Role } from "../database";

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

export type FlowInput = {
  chatState: ChatState;
  chat: Chat;
  lastMessages: Message[];
  extraInfo: any;
};

export type FlowOutput = {
  nextState: string;
  messages: Message[];
  chat: Chat;
  stateDone: boolean;
  other?: any;
};

export type followUpPromptGenerator = (
  input: FlowInput,
  currentInfo: ChatEditColumn,
  editInfo?: ChatEditColumn
) => string;

export type generationFunction = (input: FlowInput, prompt: string) => string;

export type formattingPromptGenerator = (
  input: FlowInput,
  currentInfo: ChatEditColumn,
  sectionsToRegenerate: string[]
) => string;

export type formattingFunction = (
  message: string,
  formattingPrompt: string
) => ChatEditColumn;
