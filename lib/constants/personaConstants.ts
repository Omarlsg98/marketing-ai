import { cardIcons } from "@/types/components/card";


export interface PersonaInfoPartInterface {
  title: string;
  dataFieldName:
    | "profile"
    | "discovery"
    | "evaluation"
    | "purchase"
    | "implementation"
    | "renewal";
  sections: {
    title: string;
    description: string;
    icon: cardIcons;
    dataFieldName: string;
  }[];
}
