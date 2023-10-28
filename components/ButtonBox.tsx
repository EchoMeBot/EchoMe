import Link from "next/link";
import styles from "@/styles/ButtonBox.module.css";
import Chatbot from "@/pages/chatbot";
import { useNavigate, useRoutes } from "react-router-dom";
import { useRouter } from "next/navigation";

export default function ButtonBox() {
  return (
    <div className={styles.container}>
      <div className={styles.buttonBox}>
        <div className={styles.button}>
          <Link legacyBehavior href="/Chatbot">
            <a>Chatbot</a>
          </Link>
          {/* <Chatbot/> */}
        </div>
        <div className={styles.button}>
          <Link legacyBehavior href="/MakeLink">
            <a>MakeLink</a>
          </Link>
        </div>
        <div className={styles.button}>
          <Link legacyBehavior href="/Question">
            <a>Questions</a>
          </Link>
        </div>
        <div className={styles.button}>
          <Link legacyBehavior href="/MakeLink">
            <a>UpdateInfo</a>
          </Link>
        </div>
      </div>
    </div>
  );
}
