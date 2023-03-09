import { ChatCompletionRequestMessage } from "openai";

export type Message = {
  id: string;
} & ChatCompletionRequestMessage;
