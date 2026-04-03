"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./layout.module.css";
import "../globals.css";

type Props = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    router.refresh();
    setTimeout(() => {
      setLoading(false);
    }, 0);
  }, [router]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container">
      <header className={styles.header}>
        <Image
          src="/logo.svg"
          alt="Relax Map"
          width={24}
          height={24}
          priority
        />
        <p>Relax Map</p>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <p>© 2025 Relax Map</p>
      </footer>
    </div>
  );
}
