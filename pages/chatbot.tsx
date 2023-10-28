// pages/chatbot.tsx

"use client";
import { useEffect, useRef, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { Loading } from "../components/Loading";
import { Message, MessageType, MESSAGE_ROLES } from "../components/Message";
import { Conversation } from "../components/Conversation";
import { ErrorMessage } from "../components/ErrorMessage";
import { QuestionForm, QuestionFormSchema } from "../components/QuestionForm";
import { getCurrentTime } from "@/helpers/getCurrentTime";
import styles from "@/styles/Chatbot.module.css";
import Layout from "@/components/Layout";

const iniitalMessagesState = [
  {
    role: MESSAGE_ROLES.ASSISTANT,
    ariaLabel: `KezBot said:`,
    content:
      "안녕하세요! 저는 이채영의 에콤이입니다! 저에 대해 궁금한 것을 물어봐주세요:)",
  },
];
export default function Chatbot() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const [messages, setMessages] = useState<MessageType[]>(iniitalMessagesState);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    scrollToBottom();
  }, [messages]);

  const handleFormSubmission: SubmitHandler<QuestionFormSchema> = async (
    values
  ) => {
    setIsError(false);

    const latestMessages = [
      ...messages,
      {
        role: "user",
        ariaLabel: `At ${getCurrentTime()} you said:`,
        content: values.question,
      },
    ];
    setMessages(latestMessages);

    try {
      setIsLoading(true);

      const response = await fetch("/api/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: values.question.replace(/\n/g, " "), // OpenAI recommends replacing newlines with spaces for best results,
          messages: latestMessages,
        }),
      });

      if (!response.ok) {
        throw new Error(`${response.status}:${response.statusText}`);
      }

      const data = response.body;
      if (!data) return;

      const reader = data.getReader();
      const decoder = new TextDecoder();

      let done = false;
      let isFirstChunk = true;
      let answer = "";

      setIsLoading(false);

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (done) return;

        const chunk = decoder.decode(value);
        answer += chunk;

        const assistantMessage = {
          role: MESSAGE_ROLES.ASSISTANT,
          ariaLabel: `At ${getCurrentTime()} KezBot said:`,
          content: answer,
        };

        if (isFirstChunk) {
          setMessages((prevMessages) => [...prevMessages, assistantMessage]);
        } else {
          setMessages((prevMessages) => [
            ...prevMessages.slice(0, -1),
            assistantMessage,
          ]);
        }

        isFirstChunk = false;
      }
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
    }
  };

  return (
    <Layout title="EchoMe">
      {isError ? <ErrorMessage /> : null}
      <div className="">
        <div className="pb-32">
          <Conversation>
            {messages.map((message, i) => (
              <Message
                key={i}
                className={
                  i % 2 === 0
                    ? "rounded-bl-none bg-gray-300"
                    : "rounded-br-none bg-blue-200"
                }
                ariaLabel={message.ariaLabel}
              >
                {message.content}
              </Message>
            ))}
            <div ref={messagesEndRef}>{isLoading ? <Loading /> : null}</div>
          </Conversation>

          <QuestionForm onSubmit={handleFormSubmission} isLoading={isLoading} />
        </div>
      </div>
    </Layout>
  );
}