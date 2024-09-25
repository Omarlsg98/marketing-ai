export type PersonaList = {
  id: string;
  name?: string;
  image_url?: string;
  shortDescription?: string;
  title: string;
  whoTheyAre: string;
  needs: string;
  challenges: string;
  isSuggestion: boolean;
}[];

export type FullPersona = {
  id: string;
  name?: string;
  title: string;
  isFinished: boolean;
  image_url?: string;
  shortDescription?: string;
  aboutMe?: string;
  shortInformation: {
    whoTheyAre: string;
    needs: string;
    challenges: string;
  };
  details?: {
    demographics: string[];
    psychographics: string[];
    behavior: string[];
    needs: string[];
  };
  customerJourney?: {
    awareness: {
      main: string;
      touchpoints: string;
      action: string;
    };
    consideration: {
      main: string;
      touchpoints: string;
      action: string;
    };
    purchase: {
      main: string;
      touchpoints: string;
      action: string;
    };
    retention: {
      main: string;
      touchpoints: string;
      action: string;
    };
    advocacy: {
      main: string;
      touchpoints: string;
      action: string;
    };
    summary: string;
  };
};
