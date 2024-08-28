import { PersonaInformation } from "../persona";

export type PersonaListOut = (PersonaInformation['v1_short'] & {image_url: string})[] ;

export type PersonaUpdateInput = FormData;