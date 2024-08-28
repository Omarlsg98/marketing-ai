import { PersonaInformation } from "../persona";

export type PersonaListOutRecord = PersonaInformation['v1_short'] & {image_url: string};
export type PersonaListOut = (PersonaListOutRecord)[] ;

export type PersonaUpdateInput = FormData;