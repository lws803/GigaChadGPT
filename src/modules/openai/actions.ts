import axios, { AxiosResponse } from "axios";
import {
  ChatCompletionRequestMessage,
  CreateChatCompletionResponse,
} from "openai";

import { Persona } from "./personas";

export async function post(
  message: string,
  prevMessages: ChatCompletionRequestMessage[],
  userToken: string,
  persona: Persona
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
    { headers: { Authorization: userToken }, timeout: 30000 }
  );

  // TODO: Do a bit of string processing here to remove white spaces or commas which can sometimes
  // appear at the start of a sentence.
  return {
    content: response.data.choices[0].message?.content.trimStart() || null,
    id: response.data.id,
  };
}
