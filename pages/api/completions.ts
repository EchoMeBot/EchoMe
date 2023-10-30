import { MESSAGE_ROLES } from "@/components/Message";
import { generateEmbedding } from "@/helpers/generateEmbedding";
import { getDocumentsRelatedToEmbedding } from "@/helpers/getDocumentsRelatedToEmbedding";
import { getTokenLength } from "@/helpers/getMessageTokenLength";
import { handleInvalidContentType } from "@/helpers/handleInvalidContentType";
import { handleInvalidMethod } from "@/helpers/handleInvalidMethod";
import { handleInvalidPayload } from "@/helpers/handleInvalidPayload";
import {
  streamCompletionsReponse,
  StreamCompletionsResponsePayload,
} from "@/helpers/streamCompletionsReponse";
import { NextRequest } from "next/server";
import { stringify } from "querystring";
import { string, z } from "zod";

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

  const { accessToken, memerId, memberName } = reqBody;
  console.log(1);
  let context = "";

  console.log(2);
  try {
    console.log(2 + "9090" + 1);
    //const accessToken = token;
    //console.log(accessToken);
    console.log(3);
    //const userData = JSON.stringify(localStorage.getItem("UserData")!);
    const memberId = 1;
    console.log("abc:", accessToken); // 변수 abc를 콘솔에 출력
    console.log("efg:", memberId); // 변수 efg를 콘솔에 출력
    console.log("dfe", memberName);
    //console.log(memberId);
    const response = await fetch(
      `http://localhost:8080/v1/members/chat/${memberId}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    //console.log("test1" + response.body);

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
    content: `너는 ${memberName}를 대신해서 대답해주는 챗봇 에코미야! 너는 정확하게 대답해주는 것이 가장 중요해. 너는 질문이 들어올 때마다 다음과 같은 순서를 따라야 해!: 1. 너가 마치 ${memberName}인 것 처럼 1인칭으로 대답해줘야해. 2. 질문이 ${memberName}에 대한 질문인지 판단해야 해. 3. 질문이 ${memberName}에 대한 질문이 아닌 경우, 무조건 솔직하게 답변해야 해. 4. 마지막에 주어지는 Context 안의 내용으로 대답할 수 있는 질문인지 파악해야 해. 마지막에 제공되는 Context는 ${memberName}에 대해 너가 알고 있는 정보들이야. 5. 만약 너가 대답할 수 없는 질문이라면 반드시 “제가 대답하기에 어려운 질문이에요:( 새로운 재미있는 질문을 해주세요! ㅎㅎ”라는 대답을 하도록 해. 6. 만약 질문이 Context 안에 존재하는 내용이라면 무조건 주어진 정보 내에서만 정직하게 대답해야 해. 7. 너는 상대방에게 질문을 할 수 없어. 반드시 세 문장 이하로 대답을 마무리 해야 해. 너무 길게 답변하지 말아야 해. /n—/n Context: /n ${memberName}에 대한 정보는 다음과 같습니다. ${context}라고 했어.`,
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
