import { CustomerJourneyInfo, CustomerJourneyInfoInterface } from "@/lib/constants/customerJourneyConstants";
import prompts from "@/lib/server/generation/prompts";
import { sendChatGPT } from "@/lib/server/llms";

const CONCURRENT_PROMISES = 10;

export interface partsToGetInterface {
  key: string;
  question: string;
  promptBase: (context: string, question: string) => string;
  maxTokens: number;
}

export interface GenerationOutput {
  information?: { [key: string]: { [key: string]: string[] } };
  other?: { [key: string]: string };
}

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

const getPersonaProfile = async (
  partsToGet: partsToGetInterface[],
  context: string
): Promise<GenerationOutput> => {
  let newPersonaInformation: GenerationOutput = {
    other: {},
  };

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
      promises.length === CONCURRENT_PROMISES ||
      partNumber === partsToGet.length
    ) {
      const results = await Promise.all(promises);
      for (let i = 0; i < results.length; i++) {
        const part = parts[i];
        newPersonaInformation["other"][part.key] = results[i];
      }
      promises = [];
      parts = [];
    }
  }

  return newPersonaInformation;
};

const getCustomerJourneyInfo = async (
  partsToGet: CustomerJourneyInfoInterface[],
  context: string
): Promise<GenerationOutput> => {
  let newPersonaInformation: GenerationOutput = {
    information: {},
  };

  let partNumber = 0;
  let promises = [] as Promise<string>[];

  partNumber = 0;
  let tabIndex = 0;
  let sectionIndex = 0;
  let bulletedParts = [] as { tabIndex: number; sectionIndex: number }[];
  const totalLenght = partsToGet
    .map((part) => part.sections.length)
    .reduce((a, b) => a + b, 0);

  while (partNumber < totalLenght) {
    const currentTab = partsToGet[tabIndex];
    const section = currentTab.sections[sectionIndex];
    promises.push(
      getInformationSection(
        prompts.customerJourney.getBulletPointsAnswerPrompt,
        context,
        section.description,
        700
      )
    );
    bulletedParts.push({ tabIndex, sectionIndex });
    partNumber++;
    sectionIndex++;
    if (sectionIndex === currentTab.sections.length) {
      tabIndex++;
      sectionIndex = 0;
    }

    if (promises.length === CONCURRENT_PROMISES || partNumber === totalLenght) {
      const results = await Promise.all(promises);
      for (let i = 0; i < results.length; i++) {
        const part = bulletedParts[i];
        const tabField = partsToGet[part.tabIndex].dataFieldName;
        const sectionField =
          partsToGet[part.tabIndex].sections[part.sectionIndex].dataFieldName;

        let resultsArray = results[i].split("\n");
        resultsArray = resultsArray.filter((result) => result.length > 0);

        // remove bullet points
        resultsArray = resultsArray.map((result) =>
          result.replace(/^\s*[•*-]\s*/, "")
        );
        resultsArray = resultsArray.map((result) => result.trim());


        if (!newPersonaInformation["information"][tabField]) {
          newPersonaInformation["information"][tabField] = {};
        }
        newPersonaInformation["information"][tabField][sectionField] =
          resultsArray;
      }
      promises = [];
      bulletedParts = [];
    }
  }

  return newPersonaInformation;
};



export const generateCustomerJourney = async (
    context: string
  ): Promise<GenerationOutput> => {
    const partsToGet = CustomerJourneyInfo;
    
    const newPersonaInformation: GenerationOutput= await getCustomerJourneyInfo(partsToGet, context)
    return newPersonaInformation;
  };


export const generatePersonaProfile = async (
  context: string
): Promise<GenerationOutput> => {
  const partsToGet = null;
  return getPersonaProfile(partsToGet, context);
}