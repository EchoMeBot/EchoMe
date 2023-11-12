import { Inter } from "next/font/google";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import Image from "next/image";
import chatbot1 from "@/public/chat-bot1.gif";
import chatbot2 from "@/public/chat-bot2.gif";
import chatbot3 from "@/public/chat-bot3.gif";
import { createRef, useEffect, useRef, useState } from "react";
import React from "react";

import AOS from "aos";
import "aos/dist/aos.css";

const inter = Inter({ subsets: ["latin"] });

const word = {
  line01: "안녕하세요".split(""),
  line02: "저는 챗봇 Echo-Me 입니다!".split(""),
  line03: "Echo-Me에게".split(""),
  line04: "당신에 대해 알려주세요!".split(""),
  line05: "Echo-Me가".split(""),
  line06: "당신을 궁금해 하는 사람들에게".split(""),
  line07: "당신에 대해 대답해줄 거에요!".split(""),
};

////////////////////////////////////////////////////////////
// 🧑‍💻 변경사항 🧑‍💻
//
// NOTE_ dark-mode 시 상단에 공간 남는거 처리함
//
// npm install --save aos@next
// npm i --save-dev @types/aos
//
// 1. word 에 줄마다 글을 넣는다
// 2. 사용하기 전 useEffect() 에 AOS.init() 을 적재
//    => init() 은 해당 애니메이션 global-setting
//
// 3. data-delay 가 3000 (3초) 넘어가면 깨짐
// 4. 한글자 씩이므로 멘트가 바뀌면 delay 를 다르게 주어야 함
//
//
////////////////////////////////////////////////////////////

const Home = () => {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <Layout title="EchoMe" hasTabBar>
      {/* 첫 번째 섹션 */}
      <section className="bg-gray-100 py-12 h-screen">
        <div className="flex flex-col justify-center gap-4 items-center h-screen mx-auto dark:bg-gray-900 transition-colors bg-contain">
          <div>
            {word.line01.map((letter, index) => (
              <span
                data-aos="fade-up"
                data-aos-delay={`${(index + 1) * 100}`}
                key={index}
                className={`text-3xl font-bold mb-4 text-center text-gray-800 dark:text-white`}
              >
                {letter}
              </span>
            ))}
          </div>
          <div>
            {word.line02.map((letter, index) => (
              <span
                data-aos="fade-up"
                data-aos-delay={`${(index + 1) * 100 + 500}`}
                key={index}
                className={`text-3xl font-bold mb-4 text-center text-gray-800 dark:text-white`}
              >
                {letter}
              </span>
            ))}
          </div>
          <br />
          <br />
          <Image
            src={chatbot1}
            alt="Chatbot Animation"
            width={300}
            height={300}
            className="mx-auto mb-8"
          />
        </div>
      </section>

      {/* 두 번째 섹션 */}
      <section className="bg-white py-12 h-screen justify-end">
        <div className="flex flex-col md:flex-row justify-center items-center h-screen mx-auto dark:bg-white transition-colors bg-contain">
          <div className="md:w-1/2">
            <Image
              src={chatbot2}
              alt="Chatbot Animation"
              width={300}
              height={300}
              className="mx-auto mb-8 flex-col"
            />
          </div>
          <div className="md:w-1/2 flex flex-col justify-around gap-8">
            <div>
              {word.line03.map((letter, index) => (
                <span
                  data-aos="fade-up"
                  data-aos-delay={`${(index + 1) * 100}`}
                  key={index}
                  className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-700"
                >
                  {letter}
                </span>
              ))}
            </div>
            <div>
              {word.line04.map((letter, index) => (
                <span
                  data-aos="fade-up"
                  data-aos-delay={`${(index + 1) * 100 + 1000}`}
                  key={index}
                  className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-700"
                >
                  {letter}
                </span>
              ))}
            </div>

            {/* 내용 추가 */}
          </div>
        </div>
      </section>

      {/* 세 번째 섹션 */}
      <section className="bg-gray-100 py-16 h-screen">
        <div className="flex flex-col justify-center gap-2 items-center h-screen mx-auto dark:bg-gray-900 transition-colors bg-contain">
          <div>
            {word.line05.map((letter, index) => (
              <span
                data-aos="fade-up"
                data-aos-delay={`${(index + 1) * 100 + 100}`}
                key={index}
                className="text-3xl font-bold mb-4 text-center text-gray-800 dark:text-white"
              >
                {letter}
              </span>
            ))}
          </div>
          <div>
            {word.line06.map((letter, index) => (
              <span
                data-aos="fade-up"
                data-aos-delay={`${(index + 1) * 50 + 1000}`}
                key={index}
                className="text-3xl font-bold mb-4 text-center text-gray-800 dark:text-white"
              >
                {letter}
              </span>
            ))}
          </div>
          <div>
            {word.line07.map((letter, index) => (
              <span
                data-aos="fade-up"
                data-aos-delay={`${(index + 1) * 50 + 2200}`}
                key={index}
                className="text-3xl font-bold mb-4 text-center text-gray-800 dark:text-white"
              >
                {letter}
              </span>
            ))}
          </div>
          <br />
          <br />
          <Image
            src={chatbot3}
            alt="Chatbot Animation"
            width={300}
            height={300}
            className="mx-auto mb-8"
          />
          {/* 내용 추가 */}
        </div>
      </section>
    </Layout>
  );
};

export default Home;
