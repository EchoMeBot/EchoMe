import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
axios.defaults.withCredentials = true;

interface QAItem {
  quesId: number;
  question: string;
  answer: string;
}

export default function Quesans() {
  const [qaList, setQAList] = useState<QAItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentQuesNum, setCurrentQuesNum] = useState<number | null>(null);
  const [newAnswer, setNewAnswer] = useState("");

  // const storedAccessToken = localStorage.getItem("accessToken");
  // const accessToken = storedAccessToken ? `Bearer ${storedAccessToken}` : "";
  let accessToken =
    "Bearer " +
    JSON.stringify(localStorage.getItem("accessToken")).slice(1, -1);
  console.log(accessToken);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/v1/members/answers",
          {
            withCredentials: true, // Credentials 모드 변경
            headers: {
              Authorization: accessToken, // 여기에 액세스 토큰을 넣으세요
            },
          }
        );
        console.log(response.data);
        setQAList(response.data);
      } catch (error) {
        console.error("데이터를 불러오는 중 오류가 발생했습니다:", error);
      }
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //   const testResponse = [
  //     {
  //       quesNum: 1,
  //       question: "좋아하는 음식이 뭐야?",
  //       answer: "닭발",
  //     },
  //     {
  //       quesNum: 2,
  //       question: "좋아하는 음악이 뭐야?",
  //       answer: "락",
  //     },
  //     {
  //       quesNum: 3,
  //       question: "취미가 뭐야?",
  //       answer: "뜨개질",
  //     },
  //     {
  //       quesNum: 4,
  //       question: "키가 몇이야?",
  //       answer: "160",
  //     },
  //     {
  //       quesNum: 5,
  //       question: "몇 살이야?",
  //       answer: "24",
  //     },
  //   ];

  //   setQAList(testResponse);
  // }, []);

  const openModal = (quesId: number, currentAnswer: string) => {
    setCurrentQuesNum(quesId);
    setNewAnswer(currentAnswer);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const saveAnswer = async () => {
    if (currentQuesNum !== null) {
      // 수정한 답변과 관련된 데이터를 생성
      const updatedAnswer = {
        quesId: currentQuesNum, // 수정할 질문의 ID
        memberId: 1, // 멤버 ID (원하는 멤버 ID로 변경)
        answer: newAnswer, // 수정된 답변
      };

      try {
        // 백엔드로 수정 요청 보내기
        console.log(updatedAnswer);
        const response = await axios.patch(
          "http://localhost:8080/v1/answers/update",
          updatedAnswer,
          {
            withCredentials: true, // Credentials 모드를 활성화
            headers: {
              Authorization: accessToken, // 액세스 토큰을 설정
            },
          }
        );

        // 서버로 PATCH 요청을 보내고 나면 모달을 닫을 수 있습니다.
        try {
          const response = await axios.get(
            "http://localhost:8080/v1/members/answers",
            {
              withCredentials: true, // Credentials 모드 변경
              headers: {
                Authorization: accessToken, // 여기에 액세스 토큰을 넣으세요
              },
            }
          );
          console.log(response.data);
          setQAList(response.data);
        } catch (error) {
          console.error("데이터를 불러오는 중 오류가 발생했습니다:", error);
        }
        closeModal();
        console.log(response);
      } catch (error) {
        console.error("답변 업데이트 중 오류가 발생했습니다:", error);
        closeModal();
      }
    }
  };

  return (
    <Layout title="EchoMe" hasTabBar>
      <div className="transition-colors">
        <div className="">
          <div className="flex justify-center items-center h-screen mx-auto dark:bg-gray-900 transition-colors">
            <div className="w-full max-w-md mx-auto">
              <div className="bg-white dark:bg-black shadow-lg rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-center">Q & A</h2>
                </div>
                {qaList.map((qa, index) => (
                  <div key={index} className="mb-4">
                    <h2 className="mb-1">
                      {qa.quesId}. {qa.question}
                    </h2>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={qa.answer}
                        className="dark:bg-slate-700 bg-white shadow-lg rounded border border-gray-300 p-2 flex-1"
                        readOnly
                      />
                      <button
                        onClick={() => openModal(qa.quesId, qa.answer)}
                        className="bg-black text-white p-2 rounded dark:bg-white dark:text-black"
                      >
                        수정하기
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="absolute dark:bg-black dark:border-white border bg-gray-100 shadow-lg rounded p-6 w-96 h-60">
            <h3 className="text-xl font-semibold text-center mt-4">
              답변 수정
            </h3>
            <input
              type="text"
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              className="w-full border border-gray-300 p-2 my-2 mt-4 dark:bg-slate-700"
            />
            <div className="flex justify-center mt-4">
              <button
                onClick={closeModal}
                className="w-full bg-gray-400 text-white p-2 rounded mr-2 dark:bg-white dark:text-black"
              >
                취소
              </button>
              <button
                onClick={saveAnswer}
                className="w-full bg-black text-white p-2 rounded mr-2 dark:bg-slate-700"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
