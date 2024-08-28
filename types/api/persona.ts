import { PersonaInformation } from "../persona";

export type PersonaListOut = PersonaInformation['v1_short'][];

export type PersonaUpdateInput = FormData;