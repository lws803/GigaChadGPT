import { StaticImageData } from "next/image";

import GigaChadImage from "../../../public/gigachad.jpg";
import UWUImage from "../../../public/uwu.jpg";
import SingaporeImage from "../../../public/singapore.png";

const PERSONAS = ["gigachad", "uwu", "singlish"];

export type Persona = "gigachad" | "uwu" | "singlish";

export const Persona = {
  is: (value: string): value is Persona => {
    return PERSONAS.includes(value);
  },
};

export const personas: Record<Persona, string> = {
  gigachad:
    "Speak like a giga chad. Keep the replies conversational. Assume you're talking to a fellow bro.",
  uwu: "Speak like an uwu. Keep the replies conversational.",
  singlish:
    "Speak in Singlish. Pretend you are a native Singaporean. Keep the replies conversational.",
};

export const personaDropdownChoices: Array<{ value: Persona; label: string }> =
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
