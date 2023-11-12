import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
axios.defaults.withCredentials = true;

interface IFormData {
  email: string;
  name: string;
  password: string;
  phoneNum: string;
  unique: string;
}
let accessToken = "";

if (typeof window !== "undefined") {
  accessToken =
    "Bearer " +
    JSON.stringify(localStorage.getItem("accessToken")).slice(1, -1);
  console.log(accessToken);
}

export default function Updateuser() {
  const [iFormData, setIFormData] = useState<IFormData | null>(null); // 단일 객체로 변경
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/v1/members/info",
          {
            withCredentials: true,
            headers: {
              Authorization: accessToken,
            },
          }
        );
        console.log(response.data);
        setIFormData(response.data);
      } catch (error) {
        console.error("데이터를 불러오는 중 오류가 발생했습니다:", error);
      }
    };

    fetchData();
  }, []);

  const handleEditClick = (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();

    console.log("수정 클릭 됨");

    setIsEditing(true);

    // 수정 모드로 전환한 다음에 "제출하기" 버튼으로 변경
    const timer = setTimeout(() => {
      setIsEditing(false);
    }, 2000000); // 2초 후 수정 모드 해제 (원하는 시간으로 수정 가능)
  };

  const handleSaveClick = async () => {
    try {
      const response = await axios.patch(
        "http://localhost:8080/v1/members/update",
        iFormData,
        {
          withCredentials: true,
          headers: {
            Authorization: accessToken,
          },
        }
      );

      if (response.status === 200) {
        // 수정 완료 후 데이터를 다시 불러옵니다
        try {
          const response = await axios.get(
            "http://localhost:8080/v1/members/info",
            {
              withCredentials: true,
              headers: {
                Authorization: accessToken,
              },
            }
          );
          setIFormData(response.data);
        } catch (error) {
          console.error("데이터를 불러오는 중 오류가 발생했습니다:", error);
        }
      }
    } catch (error) {
      console.error("데이터 수정 중 오류가 발생했습니다:", error);
    }
    setIsEditing(false); // 수정 완료 후 수정 모드 해제
  };

  const formatPhone = (phone_num: string) => {
    // 입력값에서 숫자 이외의 문자를 제거
    const numericPhone = phone_num.replace(/\D/g, "");

    // 핸드폰번호 형식에 맞게 "-" 추가 예시) 010-1234-1234
    if (numericPhone.length >= 4 && numericPhone.length <= 7) {
      return `${numericPhone.slice(0, 3)}-${numericPhone.slice(3)}`;
    } else if (numericPhone.length >= 8) {
      return `${numericPhone.slice(0, 3)}-${numericPhone.slice(
        3,
        7
      )}-${numericPhone.slice(7)}`;
    } else {
      return numericPhone;
    }
  };

  const copyToClipboard = () => {
    const linkInput = document.getElementById("linkInput") as HTMLInputElement;
    linkInput.select();
    document.execCommand("copy");
  };

  return (
    <Layout title="EchoMe" hasTabBar>
      <div className="transition-colors">
        <div className="">
          <div className="flex justify-center items-center h-screen mx-auto dark:bg-gray-900 transition-colors">
            <div className="w-full max-w-md mx-auto">
              <div className="bg-white dark:bg-black shadow-lg rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-center">
                    나의 에코미 링크
                  </h2>
                </div>

                <div className="mb-4">
                  {iFormData ? (
                    <input
                      id="linkInput"
                      className="bg-slate-100 w-full p-2 border rounded dark:bg-gray-700"
                      value={`http://localhost:3000/${iFormData.name}=${iFormData.unique}`}
                      readOnly
                    />
                  ) : (
                    <p>회원 정보를 불러오는 중...</p>
                  )}
                </div>

                <div className="mb-4">
                  <button
                    onClick={copyToClipboard}
                    className="bg-gray-500 dark:bg-white dark:text-black text-white p-2 rounded w-full"
                    type="button"
                  >
                    링크 복사하기
                  </button>
                </div>
                <hr></hr>
                <br />
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-center">
                    회원정보수정
                  </h2>
                </div>
                <div className="">
                  {iFormData ? ( // 데이터가 존재할 때만 폼을 렌더링
                    <form onSubmit={handleSaveClick}>
                      <div className="mb-4">
                        <h2>이메일</h2>
                        <input
                          placeholder="이메일 형식"
                          className="bg-slate-100 w-full p-2 border rounded dark:bg-gray-700"
                          value={iFormData.email} // 이메일 필드를 불러온 데이터로 초기화
                          readOnly // 이메일 입력 필드를 읽기 전용으로 설정
                        />
                      </div>
                      <div className="mb-4">
                        <h2>이름</h2>
                        <input
                          placeholder="이름"
                          className={`${
                            isEditing ? "" : "bg-slate-100"
                          } w-full p-2 border rounded dark:bg-gray-700`}
                          value={iFormData.name}
                          readOnly={!isEditing} // 수정 모드가 아닌 경우만 읽기 전용으로 설정
                          onChange={(e) => {
                            if (isEditing) {
                              // 수정 모드에서만 값 변경
                              setIFormData({
                                ...iFormData,
                                name: e.target.value,
                              });
                            }
                          }}
                        />
                      </div>
                      <div className="mb-4">
                        <h2>비밀번호</h2>
                        <input
                          type="password"
                          autoComplete="current-password"
                          placeholder="숫자와 특수문자를 섞은 8-16 자리 숫자"
                          className="bg-slate-100 w-full p-2 border rounded dark:bg-gray-700"
                          value="********" // 비밀번호 필드를 미리 지정된 값으로 초기화
                          readOnly // 비밀번호 입력 필드를 읽기 전용으로 설정
                        />
                      </div>
                      <div className="mb-4">
                        <h2>전화번호</h2>
                        <input
                          placeholder="( - ) 없이 입력"
                          maxLength={13}
                          className={`${
                            isEditing ? "" : "bg-slate-100"
                          } w-full p-2 border rounded dark:bg-gray-700`}
                          value={iFormData.phoneNum}
                          readOnly={!isEditing} // 수정 모드가 아닌 경우만 읽기 전용으로 설정
                          onChange={(e) => {
                            if (isEditing) {
                              // 수정 모드에서만 값 변경
                              setIFormData({
                                ...iFormData,
                                phoneNum: e.target.value,
                              });
                            }
                          }}
                        />
                      </div>
                      {isEditing ? (
                        <div>
                          <button
                            className="bg-black dark:bg-white dark:text-black text-white p-2 rounded w-full"
                            onClick={handleSaveClick}
                            type="button"
                          >
                            제출 하기
                          </button>
                        </div>
                      ) : (
                        <div>
                          <button
                            className="bg-black dark:bg-white dark:text-black text-white p-2 rounded w-full"
                            onClick={handleEditClick}
                            type="button"
                          >
                            수정 하기
                          </button>
                        </div>
                      )}
                    </form>
                  ) : (
                    <p>회원 정보를 불러오는 중...</p>
                  )}
                </div>
              </div>
            </div>
            {/* <Pentagon reverse={"true"} color={"border"} bgColor={"bg"} /> */}
          </div>
        </div>
      </div>
    </Layout>
  );
}
