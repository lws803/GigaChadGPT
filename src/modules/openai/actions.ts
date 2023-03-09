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
    AxiosResponse<CreateChatCompletionResponse>,
    { messages: ChatCompletionRequestMessage[] }
  >(
    "/api/chat",
    {
      messages: [
        ...prevMessages,
        {
          role: "user",
          content:
            "Speak like a giga chad. Keep the replies conversational. " +
            `Assume you're talking to a fellow bro.\n\n${message}`,
        },
      ],
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
