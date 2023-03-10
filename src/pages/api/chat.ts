import { postMessageSchema } from "@/api/chat/schema";
import { Configuration, CreateChatCompletionResponse, OpenAIApi } from "openai";
import type { NextApiRequest, NextApiResponse } from "next";
import status from "http-status";

import { getFirebaseApp } from "@/api/shared/firebaseApp";
import { verifyIdToken } from "@/api/shared/auth";
import { errorHandler } from "@/api/shared/handler";
import { personas, Persona } from "@/modules/openai/personas";

export const config = { runtime: "edge" };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateChatCompletionResponse>
) {
  try {
    if (req.method === "POST") {
      const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const openai = new OpenAIApi(configuration);
      const firebaseApp = getFirebaseApp();

      const parsedReqBody = postMessageSchema.parse(req.body);
      const idToken = req.headers.authorization || "";
      await verifyIdToken(firebaseApp, idToken);

      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              personas[
                Persona.is(parsedReqBody.persona)
                  ? parsedReqBody.persona
                  : "gigachad"
              ],
          },
          ...parsedReqBody.messages,
        ],
      });
      console.log("🚀 ~ file: chat.ts:42 ~ response:", response);

      return res.status(status.OK).json(response.data);
    }
  } catch (e) {
    errorHandler(e, res);
  }
  return res.status(status.NOT_FOUND).end();
}
