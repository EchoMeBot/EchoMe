import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

interface QAItem {
  quesNum: number;
  question: string;
  answer: string;
}

export default function Quesans() {
  const [qaList, setQAList] = useState<QAItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentQuesNum, setCurrentQuesNum] = useState<number | null>(null);
  const [newAnswer, setNewAnswer] = useState("");

    useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/v1/members/default2/answers/1");
        setQAList(response.data);
      } catch (error) {
        console.error("데이터를 불러오는 중 오류가 발생했습니다:", error);
      }
    };

    fetchData(); // 데이터 가져오기 함수 호출
  }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:8080/v1/members/default2/answers/1",
//           {
//             // 여기에 필요한 설정을 추가하십시오 (헤더 또는 쿠키 설정)
//           }
//         );

//         const data = response.data;
//         setQAList(data);
//       } catch (error) {
//         console.error("데이터를 불러오는 중 오류가 발생했습니다:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     const testResponse = [
//       {
//         quesNum: 1,
//         question: "좋아하는 음식이 뭐야?",
//         answer: "닭발",
//       },
//       {
//         quesNum: 2,
//         question: "좋아하는 음악이 뭐야?",
//         answer: "락",
//       },
//       {
//         quesNum: 3,
//         question: "취미가 뭐야?",
//         answer: "뜨개질",
//       },
//       {
//         quesNum: 4,
//         question: "키가 몇이야?",
//         answer: "160",
//       },
//       {
//         quesNum: 5,
//         question: "몇 살이야?",
//         answer: "24",
//       },
//     ];

//     setQAList(testResponse);
//   }, []);

  const handleAnswerChange = (index: number) => {
    const updatedQAList = [...qaList];
    const newAnswer = prompt(qaList[index].question, qaList[index].answer);
    if (newAnswer !== null) {
      updatedQAList[index].answer = newAnswer;
      setQAList(updatedQAList);
    }
  };

  const openModal = (quesNum: number, currentAnswer: string) => {
    setCurrentQuesNum(quesNum);
    setNewAnswer(currentAnswer);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const saveAnswer = async () => {
    if (currentQuesNum !== null) {
      try {
        await axios.patch(
          `http://localhost:8080/v1/members/answers/1?quesnum=${currentQuesNum}`,
          { answer: newAnswer }
        );
        // 서버로 PATCH 요청을 보내고 나면 모달을 닫을 수 있습니다.
        closeModal();
      } catch (error) {
        console.error("답변 업데이트 중 오류가 발생했습니다:", error);
        closeModal();
      }
    }
  };

  return (
    <Layout title="EchoMe" hasTabBar>
      <div className="h-screen">
        <div className="w-full max-w-md mx-auto mt-20">
          <div className="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-2xl font-bold mb-4 text-center">Q & A About ME</h2>
            {qaList.map((qa, index) => (
              <div key={index} className="mb-4">
                <p className="font-bold">{qa.quesNum}. {qa.question}</p>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={qa.answer}
                    className="bg-white shadow-lg rounded border border-gray-300 p-2 flex-1"
                    readOnly
                  />
                  <button
                    onClick={() => openModal(qa.quesNum, qa.answer)}
                    className="bg-black text-white p-2 rounded"
                  >
                    수정하기
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="absolute bg-gray-100 shadow-lg rounded p-6 w-96 h-60">
            <h3 className="text-xl font-semibold text-center mt-4">답변 수정</h3>
            <input
              type="text"
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              className="w-full border border-gray-300 p-2 my-2 mt-4"
            />
            <div className="flex justify-center mt-4">
                <button onClick={closeModal} className="w-full bg-gray-400 text-white p-2 rounded mr-2">
                    취소
                </button>
                <button
                    onClick={saveAnswer}
                    className="w-full bg-black text-white p-2 rounded mr-2"
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
