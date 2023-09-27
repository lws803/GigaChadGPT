import status from "http-status";
import { NextRequest } from "next/server";

import { postMessageSchema } from "@/api/chat/schema";

export const config = { runtime: "edge" };

export default async function handler(req: NextRequest) {
  if (req.method === "POST") {
    const parsedReqBody = postMessageSchema.parse(await req.json());
    const idToken = req.headers.get("Authorization") || "";

    const authHeaders = new Headers();
    authHeaders.append("Authorization", idToken);

    const { status: authStatus } = await fetch(
      `${process.env.BASE_URL}/api/auth`,
      {
        method: "POST",
        headers: authHeaders,
      }
    );

    if (authStatus !== status.OK)
      return new Response("", {
        status: authStatus,
        headers: req.headers,
      });

    const chatGPTHeaders = new Headers();
    chatGPTHeaders.append(
      "Authorization",
      `Bearer ${process.env.OPENAI_API_KEY}`
    );
    chatGPTHeaders.append("Content-Type", "application/json");

    const chatGPTResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        headers: chatGPTHeaders,
        method: "POST",
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful quiz shopping assistant, you will help " +
                "facilitate a conversation between the user and a quiz.",
            },
            ...parsedReqBody.messages,
          ],
        }),
      }
    );

    const response = await chatGPTResponse.json();
    return new Response(JSON.stringify(response), {
      status: status.OK,
      headers: req.headers,
    });
  }
  return new Response("", { status: status.NOT_FOUND, headers: req.headers });
}
