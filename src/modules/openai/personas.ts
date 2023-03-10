import { StaticImageData } from "next/image";

import GigaChadImage from "../../../public/gigachad.jpg";
import UWUImage from "../../../public/uwu.jpg";
import SingaporeImage from "../../../public/singapore.png";

export function getGigaChadPrompts(message: string) {
  return (
    "Speak like a giga chad. Keep the replies conversational. " +
    `Assume you're talking to a fellow bro.\n\n${message}`
  );
}

export function getUWUPrompts(message: string) {
  return (
    "Speak like an uwu. Keep the replies conversational." + `\n\n${message}`
  );
}

export function getSinglishPrompts(message: string) {
  return (
    "Speak in Singlish. Pretend you are a native Singaporean. Keep the replies conversational." +
    `\n\n${message}`
  );
}

const PERSONAS = ["gigachad", "uwu", "singlish"];

export type Persona = "gigachad" | "uwu" | "singlish";

export const Persona = {
  is: (value: string): value is Persona => {
    return PERSONAS.includes(value);
  },
};

export const personas: Record<Persona, (message: string) => string> = {
  gigachad: getGigaChadPrompts,
  uwu: getUWUPrompts,
  singlish: getSinglishPrompts,
};

export const PersonaDropdownChoices: Array<{ value: Persona; label: string }> =
  [
    { value: "gigachad", label: "giga chad" },
    { value: "uwu", label: "uwu" },
    { value: "singlish", label: "singlish" },
  ];

export const personaProfileImages: Record<Persona, StaticImageData> = {
  gigachad: GigaChadImage,
  uwu: UWUImage,
  singlish: SingaporeImage,
};
