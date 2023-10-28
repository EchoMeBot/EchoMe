import { Inter } from "next/font/google";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import Image from "next/image";
import backgroundImg from "@/public/background03.png";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();

  const joinUs = () => {
    router.push("/signup");
  };
  const quesans = () => {
    router.push("/quesans");
  };

  return (
    <Layout title="EchoMe" hasTabBar>
      <div className="flex justify-center items-center h-screen mx-auto dark:bg-gray-900 transition-colors">
          <div className="max-w-md mx-auto">
          {/* <div className="page-1 h-full overflow-y-scroll bg-[url('../public/background03.png')]"> */}
          <div className="page-1 h-full overflow-y-scroll justify-center mt-4">
            <h1>환 영 합 니 다1</h1>
            <button onClick={joinUs} className="bg-black text-white p-2 rounded justify-center mt-4">
              JOIN US
            </button><br/>
            <button onClick={quesans} className="bg-black text-white p-2 rounded justify-center mt-4">
              Q&A
            </button>
          </div>
          <div className="page-1 h-full overflow-y-scroll justify-center mt-4">
            <h1>환 영 합 니 다2</h1>
          </div>
          <div className="page-1 h-full overflow-y-scroll justify-center mt-4">
            <h1>환 영 합 니 다3</h1>
          </div>
        </div>
      </div>
    </Layout>
  );
}
