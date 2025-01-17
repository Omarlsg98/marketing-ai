import { z } from "zod";

const ChatEditColumnPersonaSelectorSchema = z.object({
  personas: z.array(
    z.object({
      id: z.string().optional().describe("To be assigned by the backend"),
      title: z
        .string()
        .describe(
          "The title of the persona. E.g. 'The Startup Owner' or 'The Marketing Manager'"
        ),
      whoTheyAre: z
        .string()
        .describe(
          "A brief description of the persona. Less than 2 or 3 sentences"
        ),
      needs: z
        .string()
        .describe("The needs of the persona. Less than 2 or 3 sentences"),
      challenges: z
        .string()
        .describe("The challenges of the persona. Less than 2 or 3 sentences"),
    })
  ),
});

const ChatEditColumnPersonaSchema = z.object({
  name: z.string().describe("The name of the persona. E.g. 'John Doe'"),
  title: z
    .string()
    .describe(
      "The title of the persona. E.g. 'The Startup Owner' or 'The Marketing Manager'"
    ),
  b2bOrb2c: z
    .enum(["b2b", "b2c"])
    .describe("Whether the persona is B2B or B2C"),
  shortDescription: z
    .string()
    .describe("A short description of the persona. Less than 2 or 3 sentences"),
  demographics: z
    .array(z.string())
    .describe(
      "Array of strings that describes the demographics of the persona. Max 4."
    ),
  psychographics: z
    .array(z.string())
    .describe(
      "Array of strings that describes the psychographics of the persona. Max 4."
    ),
  behavior: z
    .array(z.string())
    .describe(
      "Array of strings that describes the behavior of the persona. Max 4."
    ),
  needs: z
    .array(z.string())
    .describe(
      "Array of strings that describes the needs of the persona. Max 4."
    ),
});

const ChatEditColumnCustomerJourneySchema = z.object({
  awareness: z.object({
    trigger: z.string(),
    touchpoints: z.string(),
    action: z.string(),
  }),
  consideration: z.object({
    research: z.string(),
    touchpoints: z.string(),
    action: z.string(),
  }),
  purchase: z.object({
    decision: z.string(),
    touchpoints: z.string(),
    action: z.string(),
  }),
  retention: z.object({
    engagement: z.string(),
    touchpoints: z.string(),
    action: z.string(),
  }),
  advocacy: z.object({
    satisfaction: z.string(),
    touchpoints: z.string(),
    action: z.string(),
  }),
  summary: z
    .string()
    .describe("A summary of the customer journey as a short story"),
});

const ChatEditColumnImageSchema = z.object({
  imagePrompt: z.string(),
  imageUrl: z.string(),
  imagePath: z.string(),
});

const ChatEditColumnAboutMeSchema = z.object({
  aboutMe: z
    .string()
    .describe(
      "A Lengthy description of the persona, summarizing who they are, what they do, and what they care about."
    ),
});

export const schemas = {
  ChatEditColumnPersonaSelectorSchema,
  ChatEditColumnPersonaSchema,
  ChatEditColumnCustomerJourneySchema,
  ChatEditColumnImageSchema,
  ChatEditColumnAboutMeSchema,
};

export type ChatEditColumnPersonaSelector = z.infer<
  typeof ChatEditColumnPersonaSelectorSchema
>;

export type ChatEditColumnPersona = z.infer<typeof ChatEditColumnPersonaSchema>;

export type ChatEditColumnCustomerJourney = z.infer<
  typeof ChatEditColumnCustomerJourneySchema
>;

export type ChatEditColumnImage = z.infer<typeof ChatEditColumnImageSchema>;

export type ChatEditColumnAboutMe = z.infer<typeof ChatEditColumnAboutMeSchema>;

export type ChatEditColumn =
  | ChatEditColumnPersonaSelector
  | ChatEditColumnPersona
  | ChatEditColumnCustomerJourney
  | ChatEditColumnImage
  | ChatEditColumnAboutMe
  | null;

export const ChatTabTypes = ["multiplePersona", "persona", "customerJourney", "image", "aboutMe"] as const;

export type ChatEditColumnComponent = {
  type: typeof ChatTabTypes[number];
  old: ChatEditColumn;
  current: ChatEditColumn;
  author: "assistant" | "user" | "system";
};

export type PersonaAllTabs = {
  multiplePersona: ChatEditColumnPersonaSelector | null;
  persona: ChatEditColumnPersona | null;
  customerJourney: ChatEditColumnCustomerJourney | null;
  image: ChatEditColumnImage | null;
  aboutMe: ChatEditColumnAboutMe | null;
};

export type ObjectFetchMapping = {
  persona: (id: string | null) => Promise<PersonaAllTabs>;
};
