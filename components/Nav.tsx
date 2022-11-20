import Link from "next/link";
import { IoPrism } from "react-icons/io5";
import styles from "../styles/Nav.module.css";

export default function Nav() {
  return (
    <div className={styles.Nav}>
      <Link href="/">
        <a>
          <IoPrism />
          <p>Arcshare</p>
        </a>
      </Link>
    </div>
  );
}
