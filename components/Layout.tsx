import { classbinder } from "@/libs/utils";
import { darkState, loginState } from "@/utils/atoms";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  canGoBack?: boolean;
  hasTabBar?: boolean;
}

export default function Layout({
  title,
  canGoBack,
  hasTabBar,
  children,
}: LayoutProps) {
  const [isRecoilLogin, setIsRecoilLogin] = useRecoilState(loginState);
  const [isLogin, setIsLogin] = useState(isRecoilLogin);
  const [userName, setUserName] = useState("");
  const [isDark, setIsDark] = useRecoilState(darkState);

  const nav = useRouter();

  const onClick = () => {
    nav.back();
  };

  const onMoveHome = () => {
    nav.push("/");
  };

  const onLogout = () => {
    localStorage.removeItem("UserData");
    setIsRecoilLogin(false);
    setUserName("");
    nav.push("/");
  };

  const onDarkModeToggle = () => {
    console.log(isDark);
    setIsDark((current) => !current);
    // 다크모드이면
    if (isDark) {
      document.body.classList.remove("dark");
    } else {
      document.body.classList.add("dark");
    }
  };

  useEffect(() => {
    console.log(`로그인 여부 ${isLogin}`);

    setIsLogin(isRecoilLogin);
    if (localStorage.getItem("UserData")) {
      setUserName(JSON.parse(localStorage.getItem("UserData")!).name);
    }
  }, [isRecoilLogin]);

  return (
    <div className="dark:text-gray-100 text-gray-800">
      <div
        className={
          "dark:bg-black transition-colors bg-white w-full left-0 text-lg px-10 font-medium py-3 fixed  border-b top-0 flex items-center justify-between z-30"
        }
      >
        {title ? (
          <span className="cursor-pointer" onClick={onMoveHome}>
            {title}
          </span>
        ) : null}
        {isLogin ? (
          <div className="flex flex-row gap-3">
            <h2>{userName}</h2>
            <button onClick={onLogout}>로그아웃</button>
          </div>
        ) : null}
        {isDark ? (
          <div className="cursor-pointer" onClick={onDarkModeToggle}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
              />
            </svg>
          </div>
        ) : (
          <div className="cursor-pointer" onClick={onDarkModeToggle}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
              />
            </svg>
          </div>
        )}
      </div>
      <div className={""}>{children}</div>
      {hasTabBar ? (
        <nav
          className="bg-white left-0 text-gray-700 border-t fixed bottom-0 w-full px-10 pb-5 pt-3 flex justify-between text-xs
          dark:bg-black dark:text-gray-100
        "
        >
          <div
            onClick={() => {
              isLogin ? onLogout() : null;
            }}
          >
            <Link href="/login" legacyBehavior>
              <a className="flex flex-col items-center space-y-2">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
                {isLogin ? <span>로그 아웃</span> : <span>로 그 인</span>}
              </a>
            </Link>
          </div>

          <div className={isLogin ? "hidden" : ""}>
            <Link href="/signup" legacyBehavior>
              <a className="flex flex-col items-center space-y-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                  />
                </svg>

                <span>회원 가입</span>
              </a>
            </Link>
          </div>

          <div className={isLogin ? "" : "hidden"}>
            <Link href={isLogin ? "/quesans" : "/login"} legacyBehavior>
              <a className="flex flex-col items-center space-y-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                  />
                </svg>
                <span>QnA</span>
              </a>
            </Link>
          </div>

          <Link href={isLogin ? "/chatbot" : "/login"} legacyBehavior>
            <a className="flex flex-col items-center space-y-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                />
              </svg>

              <span>챗 봇</span>
            </a>
          </Link>
        </nav>
      ) : null}
    </div>
  );
}