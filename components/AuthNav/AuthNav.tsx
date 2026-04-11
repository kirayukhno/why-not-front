"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./AuthNav.module.css";

export default function AuthNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <Link
        href="/register"
        className={`${styles.link} ${pathname === "/register" ? styles.active : ""}`}
      >
        Реєстрація
      </Link>
      <Link
        href="/login"
        className={`${styles.link} ${pathname === "/login" ? styles.active : ""}`}
      >
        Вхід
      </Link>
    </nav>
  );
}
