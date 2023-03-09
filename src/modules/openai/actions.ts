import axios, { AxiosResponse } from "axios";
import {
  ChatCompletionRequestMessage,
  CreateChatCompletionResponse,
} from "openai";

export async function post(
  message: string,
  prevMessages: ChatCompletionRequestMessage[],
  userToken: string
) {
  const response = await axios.post<
    unknown,
    AxiosResponse<CreateChatCompletionResponse["choices"]>,
    { messages: ChatCompletionRequestMessage[] }
  >(
    "/api/chat",
    {
      messages: [
        ...prevMessages,
        {
          role: "user",
          content: `Speak like a giga chad. Keep the replies conversational.\n${message}`,
        },
      ],
    },
    { headers: { Authorization: userToken } }
  );

  return response.data[0].message?.content || null;
}
