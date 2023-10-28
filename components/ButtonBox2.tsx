import Link from "next/link";
import styles from "@/styles/ButtonBox.module.css";
import Chatbot from "@/pages/chatbot";
import { useNavigate, useRoutes } from "react-router-dom";
import { useRouter } from "next/navigation";

export default function ButtonBox2() {
  return (
    <div className={styles.container}>
      <div className={styles.buttonBox}>
        <div className={styles.button}>
          <Link legacyBehavior href="/Login">
            <a>Login</a>
          </Link>
          {/* <Chatbot/> */}
        </div>
        <div className={styles.button}>
          <Link legacyBehavior href="/Signup">
            <a>Signup</a>
          </Link>
        </div>
        <div className={styles.button}>
          <Link legacyBehavior href="/Chatbot">
            <a>ChatTest</a>
          </Link>
        </div>
        <div className={styles.button}>
          <Link legacyBehavior href="/MakeLink">
            <a>About Us</a>
          </Link>
        </div>
      </div>
    </div>
  );
}
