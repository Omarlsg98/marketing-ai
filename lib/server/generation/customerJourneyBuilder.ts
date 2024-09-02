import { CustomerJourneyInfo } from "@/lib/constants/personaConstants";
import prompts from "@/lib/server/generation/prompts";
import { sendChatGPT } from "@/lib/server/llms";
import { PersonaInformation } from "@/types/interseed/persona";
import { Database } from "@/types/supabase";


type PersonaType = Database["public"]["Tables"]["persona"]["Insert"];
type ChatType = Database["public"]["Tables"]["llm_chats"]["Row"];
type QuestionType = Database["public"]["Tables"]["questions"]["Row"];
type UserAnswers = Database["public"]["Tables"]["user_answers"]["Row"] & {questions: QuestionType};

interface partsToGetInterface {
  key: string;
  question: string;
  promptBase: (context: string, question: string) => string;
  maxTokens: number;
}

const partsToGet: partsToGetInterface[] = [
  {
    key: "name",
    question: "name",
    promptBase: prompts.customerJourney.getNamePrompt,
    maxTokens: 50,
  },
  {
    key: "short_description",
    question: "short_description",
    promptBase: prompts.customerJourney.getShortDescriptionPrompt,
    maxTokens: 50,
  },
  {
    key: "about_me",
    question: "about_me",
    promptBase: prompts.customerJourney.getAboutMePrompt,
    maxTokens: 1000,
  },
  {
    key: "primary_goal",
    question: "What is the primary goal of this persona?",
    promptBase: prompts.customerJourney.getShortAnswerPrompt,
    maxTokens: 100,
  },
  {
    key: "key_challenge",
    question: "What is the key challenge of this persona?",
    promptBase: prompts.customerJourney.getShortAnswerPrompt,
    maxTokens: 100,
  },
  {
    key: "main_buying_motivation",
    question: "What is the main buying motivation of this persona?",
    promptBase: prompts.customerJourney.getShortAnswerPrompt,
    maxTokens: 100,
  },
  {
    key: "gender",
    question: "What is the gender of this persona?",
    promptBase: prompts.customerJourney.getOneWordAnswerPrompt,
    maxTokens: 50,
  },
  {
    key: "ethnicity",
    question: "What is the ethnicity of this persona?",
    promptBase: prompts.customerJourney.getOneWordAnswerPrompt,
    maxTokens: 50,
  },
  {
    key: "location",
    question: "What is the location of this persona?",
    promptBase: prompts.customerJourney.getShortAnswerPrompt,
    maxTokens: 50,
  },
  {
    key: "occupation",
    question: "What is the occupation of this persona?",
    promptBase: prompts.customerJourney.getShortAnswerPrompt,
    maxTokens: 100,
  },
];

const getInformationSection = async (
  promptBase: (context: string, question: string) => string,
  context: string,
  question: string,
  maxTokens: number
) => {
    const prompt = promptBase(context, question);
    const formulatedQuestion = await sendChatGPT(prompt, maxTokens);
    return formulatedQuestion;
};

const buildContext = (chat: ChatType, userAnswers: UserAnswers[]) => {
    const userAnswersArray = userAnswers.map((answer) => {
        return `Question: ${answer.questions.question}
        Answer: ${answer.answer}`;
    });
    const userAnswersString = userAnswersArray.join("\n");
    const context = `
    ${chat.context}
    
    ${userAnswersString}`;

    return context;
    }

export const getPersonaInformation = async (
  chat: ChatType,
  userAnswers: UserAnswers[],
  prevPersonaInformation: PersonaInformation["v1"]
): Promise<PersonaType> => {
  const concurrentPromises = 10;

  const context = buildContext(chat, userAnswers);

  let newPersonaInformation: any = {
    'information': {},
  }

  let partNumber = 0;
  let promises = [] as Promise<string>[];
  let parts = [] as partsToGetInterface[];
  
  while (partNumber < partsToGet.length) {
    const part = partsToGet[partNumber];
    promises.push(
      getInformationSection(
        part.promptBase,
        context,
        part.question,
        part.maxTokens
      )
    );
    parts.push(part);
    partNumber++;

    if (
      promises.length === concurrentPromises ||
      partNumber === partsToGet.length
    ) {
      const results = await Promise.all(promises);
      for (let i = 0; i < results.length; i++) {
        const part = parts[i];
        newPersonaInformation[part.key] = results[i];
      }
      promises = [];
      parts = [];
    }
  }

  partNumber = 0;
  let tabIndex = 0;
  let sectionIndex = 0;
  let bulletedParts = [] as {tabIndex: number, sectionIndex:number}[];
  const totalLenght = CustomerJourneyInfo.map((part) => part.sections.length).reduce((a, b) => a + b, 0);
  while (partNumber < totalLenght) {
    const currentTab = CustomerJourneyInfo[tabIndex];
    const section = currentTab.sections[sectionIndex];
    promises.push(
      getInformationSection(
        prompts.customerJourney.getBulletPointsAnswerPrompt,
        context,
        section.description,
        700
      )
    );
    bulletedParts.push({tabIndex, sectionIndex});
    partNumber++;
    sectionIndex++;
    if (sectionIndex === currentTab.sections.length) {
      tabIndex++;
      sectionIndex = 0;
    }

    if (
      promises.length === concurrentPromises ||
      partNumber === totalLenght
    ) {
        const results = await Promise.all(promises);
        for (let i = 0; i < results.length; i++) {
            const part = bulletedParts[i];

            const tabField = CustomerJourneyInfo[part.tabIndex].dataFieldName;
            const sectionField = CustomerJourneyInfo[part.tabIndex].sections[part.sectionIndex].dataFieldName;
            let resultsArray = results[i].split('\n');
            resultsArray = resultsArray.filter((result) => result.length > 0);
            // remove bullet points
            resultsArray = resultsArray.map((result) => result.replace(/^\s*[•*-]\s*/, ''));
            resultsArray = resultsArray.map((result) => result.trim());
            if (!newPersonaInformation['information'][tabField]) {
                newPersonaInformation['information'][tabField] = {};
            }

            newPersonaInformation['information'][tabField][sectionField] = resultsArray;
        }
        promises = [];
        bulletedParts = [];
    }
  }

  const recordToInsert: PersonaType = {
    id: prevPersonaInformation.id,
    chat_id: chat.id,
    user_id: chat.user_id,
    name: newPersonaInformation.name,
    short_description: newPersonaInformation.short_description,
    about_me: newPersonaInformation.about_me,
    primary_goal: newPersonaInformation.primary_goal,
    key_challenge: newPersonaInformation.key_challenge,
    main_buying_motivation: newPersonaInformation.main_buying_motivation,
    image_path: newPersonaInformation.image_path,
    gender: newPersonaInformation.gender,
    location: newPersonaInformation.location,
    occupation: newPersonaInformation.occupation,
    ethnicity: newPersonaInformation.ethnicity,
    information: newPersonaInformation.information,
    finished: prevPersonaInformation.chat_progress > 99,
  };

  return recordToInsert;
};
