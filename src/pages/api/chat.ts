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

    const res = await fetch(
      "https://quizzes.cnstrc.com/v1/quizzes/find-your-perfect-mattress/next/?key=key_1tigFZoUEs7Ygkww&a=seen"
    );
    const data = await res.json();

    const lastMessage = parsedReqBody.messages.slice(-1)[0];

    const chatGPTResponseQuizOption = await fetch(
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
                `You are a text classifier, pick the closest option based on the user response, ` +
                "else try to guide the user to the available options. Output the closest match as a single response in JSON format.\n" +
                '"seen" is synonymous with starting the quiz, a greeting or continuing on the quiz.\n' +
                `available options: ["seen", "skip"]`,
            },
            lastMessage,
          ],
        }),
      }
    );

    console.log(
      JSON.parse(
        (await chatGPTResponseQuizOption.json()).choices[0].message.content
      )
    );

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
                "facilitate a conversation between the user and a guided quiz API. " +
                "Try best match user responses to the provided options, user response need not be exact to the available options.",
            },
            ...parsedReqBody.messages.slice(
              0,
              parsedReqBody.messages.length - 1
            ),
            {
              ...lastMessage,
              content:
                `question title: ${data.next_question.title}, ` +
                `description: ${data.next_question.description}\n\n` +
                `User response:\n` +
                `\`\`\`${lastMessage.content}\`\`\``,
            },
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
