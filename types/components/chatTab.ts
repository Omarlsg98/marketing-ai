export type ChatEditColumnPersonaSelector = {
  personas: {
    id: number;
    title: string;
    whoTheyAre: string;
    needs: string;
    challenges: string;
  }[];
};

export type ChatEditColumnPersona = {
  name: string;
  shortDescription: string;
  demographics: string[];
  psychographics: string[];
  behavior: string[];
  needs: string[];
};

export type ChatEditColumnCustomerJourney = {
  awareness: {
    trigger: string;
    touchpoints: string;
    action: string;
  };
  consideration: {
    research: string;
    touchpoints: string;
    action: string;
  };
  purchase: {
    decision: string;
    touchpoints: string;
    action: string;
  };
  retention: {
    engagement: string;
    touchpoints: string;
    action: string;
  };
  advocacy: {
    satisfaction: string;
    touchpoints: string;
    action: string;
  };
};

export type ChatEditColumnImage = {
  name: string;
  imagePrompt: string;
  imageUrl: string;
};

export type ChatEditColumnAboutMe = {
  aboutMe: string;
};

export type ChatEditColumn =
  | ChatEditColumnPersonaSelector
  | ChatEditColumnPersona
  | ChatEditColumnCustomerJourney
  | ChatEditColumnImage
  | ChatEditColumnAboutMe;

export type ChatEditColumnComponent = {
  type: string;
  old: ChatEditColumn | null;
  current: ChatEditColumn | null;
} ;
