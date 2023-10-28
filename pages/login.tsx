import Layout from "@/components/Layout";
import { classbinder } from "@/libs/utils";
import { loginState, memberIdState } from "@/utils/atoms";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";

interface IFormData {
  email: string;
  password: string;
}

export default function Login() {
  const [isLogin, setIsLogin] = useRecoilState(loginState);
  const [isLoading, setIsLoading] = useState(false);
  const [memberId, setMemberId] = useRecoilState(memberIdState);
  const [accessToken, setAccessToken] = useState("");

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormData>();

  const nav = useRouter();

  const onValid = async (data: IFormData) => {
    try {
      // 서버로 요청을 보내는 부분
      const response = await axios.post(
        `http://localhost:8080/v1/members/login`,
        data
      );

      if (response.status === 200) {
        console.log(response);
        const accessToken = response.headers["accesstoken"];
        setAccessToken(accessToken);
        console.log("로그인 성공");
        setIsLogin(true);
        console.log("AccessToken:", accessToken);
        localStorage.setItem("accessToken", accessToken);
        //console.log(response.data);
        setMemberId(response.data.id);
        localStorage.setItem("UserData", JSON.stringify(response.data));

        //회원가입 성공 시 isSignUpSuccess 를 true로 설정

        /* ===== 로그인 성공 후 홈 페이지로 이동 ===== */
        nav.push("/");
      } else {
        console.error("로그인 실패:", response.statusText);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }

    //console.log(data);
    console.log(JSON.stringify(errors));
  };

  return (
    <Layout title="EchoMe" hasTabBar>
      <div className="flex justify-center items-center h-screen mx-auto dark:bg-gray-900 transition-colors">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white dark:bg-black shadow-lg rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <h2 className="text-2xl font-bold">로그인</h2>
            </div>
            <form onSubmit={handleSubmit(onValid)}>
              <div className="mb-4">
                <input
                  {...register("email", {
                    required: "이메일을 입력하세요.",
                    pattern: {
                      value: /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,
                      message: "이메일 형식만 가능합니다.",
                    },
                  })}
                  placeholder="이 메 일"
                  className="w-full p-2 border rounded dark:bg-gray-700"
                />
              </div>
              <div className="mb-4">
                <input
                  {...register("password", {
                    required: "비밀번호를 입력하세요.",
                    minLength: {
                      value: 4,
                      message: "비밀번호가 너무 짧습니다.",
                    },
                    maxLength: {
                      value: 16,
                      message: "비밀번호가 너무 깁니다.",
                    },
                    pattern: {
                      value: /^(?=.*?[0-9]).{4,16}$/,
                      message:
                        "비밀번호는 숫자, 특수문자가 각각 최소 1개이상이어야 합니다.",
                    },
                  })}
                  type="password"
                  autoComplete="current-password"
                  placeholder="비밀번호"
                  className="w-full p-2 border rounded dark:bg-gray-700"
                />
              </div>
              <div className="mb-4">
                <button className="bg-black dark:bg-white dark:text-black text-white p-2 rounded">
                  로그인 하기
                </button>
              </div>
            </form>
            <div className="text-red-500">
              {errors?.email?.message
                ? errors?.email?.message
                : errors?.password?.message
                ? errors?.password?.message
                : " "}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}