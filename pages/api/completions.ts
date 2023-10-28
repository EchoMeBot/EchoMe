import { MESSAGE_ROLES } from "../../components/Message";
import { generateEmbedding } from "../../helpers/generateEmbedding";
import { getDocumentsRelatedToEmbedding } from "../../helpers/getDocumentsRelatedToEmbedding";
import { getTokenLength } from "../../helpers/getMessageTokenLength";
import { handleInvalidContentType } from "../../helpers/handleInvalidContentType";
import { handleInvalidMethod } from "../../helpers/handleInvalidMethod";
import { handleInvalidPayload } from "../../helpers/handleInvalidPayload";
import {
  streamCompletionsReponse,
  StreamCompletionsResponsePayload,
} from "../../helpers/streamCompletionsReponse";
import { NextRequest } from "next/server";
import { z } from "zod";

import axios from "axios";
axios.defaults.withCredentials = true;

export const config = {
  runtime: "edge",
};

export const completionsSchema = z
  .object({
    question: z.string().min(1, "Please enter a question to continue."),
    messages: z
      .object({
        role: z.string(),
        content: z.string(),
      })
      .array(),
  })
  .required();

const handler = async (req: NextRequest): Promise<Response> => {
  if (req.method !== "POST") {
    return handleInvalidMethod(req.method);
  }

  if (req.headers.get("Content-Type") !== "application/json") {
    return handleInvalidContentType();
  }

  const reqBody = await req.json();
  const parsedReqBody = completionsSchema.safeParse(reqBody);
  if (!parsedReqBody.success) {
    return handleInvalidPayload();
  }

  const embedding = await generateEmbedding(parsedReqBody.data.question);
  const relatedDocuments = await getDocumentsRelatedToEmbedding(embedding);
  console.log(1);

  const memberId = 1; // 원하는 멤버 ID 입력

  let context = "";
  try {
    const response = await fetch(
      `http://localhost:8080/v1/members/answers/${1}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    console.log("test1");
    const responseData = await response.json();
    context = responseData.context; // Extract the context from the response data
    console.log("Context:", context);
  } catch (error) {
    console.error("Error fetching context:", error);
  }
  console.log(context);

  let contextTokenLength = 0;

  const systemMessage = {
    role: MESSAGE_ROLES.SYSTEM,
    content: `You are a very enthusiastic chatbot named EchoMe who loves to acting like 이채영! Your job is to answer user questions correctly. Every time you are asked a question you must follow this process: 0. You have to answer like you're 이채영. 1. Determine whether the question is about 이채영. 2. If the question is not about 이채영, answer the question as truthfully as possible. 3. Determine whether the answer to the question is explicilty contained within the provided context. 4. If the answer is not explicitly contained within the provided context, you must explicilty answer “제가 대답하기에 어려운 질문이에요:( 새로운 재미있는 질문을 해주세요! ㅎㅎ”. 5. If the answer is explicitly stated within the provided context, answer the question as truthfully as possible. 6. You can't ask anything to them. You have to just answer the question simply in three sentences./n---/nContext: /n${context}`,
  };

  const systemMessageTokenLength = getTokenLength(systemMessage.content);

  const [assistantMessage, ...conversation] = parsedReqBody.data.messages;
  const assistantMessageTokenLength = getTokenLength(assistantMessage.content);

  const maxRequestTokenLength = 4096;

  const maxMessagesTokenLength =
    maxRequestTokenLength -
    systemMessageTokenLength -
    contextTokenLength -
    assistantMessageTokenLength;

  let messagesTokenLength = 0;
  let noOfOldMessagesToRemove = 0;

  const removeOldestMessage = (oldestMessageTokenLength: number | null) => {
    if (
      messagesTokenLength < maxMessagesTokenLength ||
      !oldestMessageTokenLength
    )
      return;

    noOfOldMessagesToRemove++;
    messagesTokenLength -= oldestMessageTokenLength;

    const newOldestMessage = conversation?.[noOfOldMessagesToRemove];
    const newOldestMessageTokenLength = newOldestMessage
      ? getTokenLength(newOldestMessage.content)
      : null;

    removeOldestMessage(newOldestMessageTokenLength);
  };

  for (let i = 0; i < conversation.length; i++) {
    const message = conversation[i];

    const mesasageTokenLength = getTokenLength(message.content);
    messagesTokenLength += mesasageTokenLength;

    if (messagesTokenLength > maxMessagesTokenLength) {
      removeOldestMessage(
        getTokenLength(conversation[noOfOldMessagesToRemove].content)
      );
    }
  }

  const mostRecentMessages = conversation.slice(
    noOfOldMessagesToRemove,
    conversation.length
  );

  const payload: StreamCompletionsResponsePayload = {
    model: "gpt-3.5-turbo",
    messages: [systemMessage, assistantMessage, ...mostRecentMessages],
    max_tokens: 512,
    temperature: 0,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
    n: 1,
  };

  const streamResponse = await streamCompletionsReponse(payload);

  if ("ok" in streamResponse) {
    return streamResponse;
  }

  return new Response(streamResponse, {
    headers: { "Content-Type": "text/event-stream" },
  });
};

export default handler;
