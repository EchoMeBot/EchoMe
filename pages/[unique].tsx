import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import dynamic from "next/dynamic";
import { useEffect } from "react";

// ssr: false 옵션을 사용하여 서버 측 렌더링을 제외
const Chatbot2 = dynamic(() => import("./chatbot2"), { ssr: false });

let memberName;
let uuid;

const ChatbotPage = () => {
  const router = useRouter();
  const { unique } = router.query;

  useEffect(() => {
    // 현재 페이지의 경로
    const currentPath = router.pathname;

    // 현재 페이지의 쿼리 파라미터
    const { query } = router;

    // 전체 주소
    const fullUrl = typeof window !== "undefined" ? window.location.href : "";
    console.log("currentPath:" + currentPath);
    console.log("fullURL:" + fullUrl);
    console.log("query : " + unique);

    // query.unique가 문자열이라면 split 가능
    if (typeof unique === "string") {
      const [name, id] = unique.split("=");
      memberName = name;
      uuid = id;
      //console.log(memberName);
      //console.log(uuid);
    }

    // 이펙트 정리 함수 반환
    return () => {
      // 정리 로직 작성
      // 예: 컴포넌트가 언마운트되거나 의존성이 변경될 때 실행
    };
  }, [router, unique]); // router와 unique를 의존성 배열에 추가

  return (
    <Layout title="Chatbot Page">
      <div className="h-full">
        {/* 페이지 내용을 원하는 대로 구성할 수 있습니다. */}
        <Chatbot2 />
      </div>
    </Layout>
  );
};

export default ChatbotPage;
