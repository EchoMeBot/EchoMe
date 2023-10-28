import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";

interface IFormData {
  email: string;
  name: string;
  password: string;
  phoneNum: string;
}

export default function Signup() {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormData>();

  /* ===================================== */
  const nav = useRouter();
  /* ===== LJM. useRouter (next 전용) ===== */

  const onValid = async (data: IFormData) => {
    try {
      console.log("회원 가입 폼");
      console.log(data);
      // console.log(ssnResult);
      console.log(data);
      const response = await axios.post(
        `http://localhost:8080/v1/members/create`,
        data
      );

      //회원가입 성공 시 isSignUpSuccess 를 true로 설정

      /* ===== 로그인 성공 후 홈 페이지로 이동 ===== */
      nav.push("/");
      /* ===== LJM. 로그인 성공 시 이동 ===== */
    } catch (error) {
      console.log("error");
      nav.push("/");
    }
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
  return (
    <Layout title="EchoMe" hasTabBar>
      <div className="transition-colors">
        <div className="">
          <div className="flex justify-center items-center h-screen mx-auto dark:bg-gray-900 transition-colors">
            <div className="w-full max-w-md mx-auto">
              <div className="bg-white dark:bg-black shadow-lg rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold">회원 가입</h2>
                </div>
                <div className="">
                  <form onSubmit={handleSubmit(onValid)}>
                    <div className="mb-4">
                      <input
                        {...register("email", {
                          required: "이메일을 입력하세요.",
                          pattern: {
                            value:
                              /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,
                            message: "이메일 형식만 가능합니다.",
                          },
                        })}
                        placeholder="이메일 형식"
                        className="w-full p-2 border rounded dark:bg-gray-700"
                      />
                    </div>
                    <div className="mb-4">
                      <input
                        {...register("name", {
                          required: "이름을 입력하세요.",
                        })}
                        placeholder="이 름"
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
                            // value: /^(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{4,16}$/,
                            value: /^(?=.*?[0-9]).{4,16}$/,
                            message:
                              "비밀번호는 숫자, 특수문자가 각각 최소 1개이상이어야 합니다.",
                          },
                        })}
                        type="password"
                        autoComplete="current-password"
                        placeholder="숫자와 특수문자를 섞은 8-16 자리 숫자"
                        className="w-full p-2 border rounded dark:bg-gray-700"
                      />
                    </div>
                    <div className="mb-4">
                      <input
                        {...register("phoneNum", {
                          required: "전화번호를 입력해 주세요.",
                          pattern: {
                            value: /^\d{3}-\d{4}-\d{4}$/,
                            message: "전화번호 형식이 맞지 않습니다.",
                          },
                          onChange: (
                            event: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            event.target.value = formatPhone(
                              event.target.value
                            );
                          },
                        })}
                        placeholder="( - ) 없이 입력"
                        maxLength={13}
                        className="w-full p-2 border rounded dark:bg-gray-700"
                      />
                    </div>
                    <div className="">
                      <button className="bg-black text-white p-2 rounded dark:bg-white dark:text-black">
                        가입 하기
                      </button>
                    </div>
                  </form>
                </div>

                <div className="">
                  {errors?.email?.message
                    ? errors?.email?.message
                    : errors?.name?.message
                    ? errors?.name?.message
                    : errors?.password?.message
                    ? errors?.password?.message
                    : errors?.phoneNum?.message
                    ? errors?.phoneNum?.message
                    : " "}
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