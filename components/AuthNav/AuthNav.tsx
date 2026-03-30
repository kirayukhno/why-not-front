"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./AuthNav.module.css";

export default function AuthNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <Link
        href="/sign-up"
        className={`${styles.link} ${pathname === "/sign-up" ? styles.active : ""}`}
      >
        Реєстрація
      </Link>
      <Link
        href="/sign-in"
        className={`${styles.link} ${pathname === "/sign-in" ? styles.active : ""}`}
      >
        Вхід
      </Link>
    </nav>
  );
}
