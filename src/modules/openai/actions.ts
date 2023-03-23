import axios, { AxiosResponse, GenericAbortSignal } from "axios";
import {
  ChatCompletionRequestMessage,
  CreateChatCompletionResponse,
} from "openai";

import { Persona } from "./personas";

export async function post(
  message: string,
  prevMessages: ChatCompletionRequestMessage[],
  userToken: string,
  persona: Persona,
  signal: GenericAbortSignal
) {
  const response = await axios.post<
    unknown,
    AxiosResponse<CreateChatCompletionResponse>,
    { messages: ChatCompletionRequestMessage[]; persona: Persona }
  >(
    "/api/chat",
    {
      messages: [
        ...prevMessages,
        {
          role: "user",
          content: message,
        },
      ],
      persona,
    },
    { headers: { Authorization: userToken }, signal }
  );

  return {
    content: response.data.choices[0].message?.content.trimStart() || null,
    id: response.data.id,
  };
}
