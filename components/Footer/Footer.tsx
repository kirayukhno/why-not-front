import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        
        {/*  Logo + description */}
        <div className={styles.info}>
        <Link href="/" className={styles.logo}>
          <Image src="/logo.svg" alt="logo" width={24} height={24} />
          <span>Relax Map</span>
        </Link>
        </div>

        {/* 🔹 Navigation */}
        <nav className={styles.nav}>
          <Link href="/" className={styles.link}>
            Головна
          </Link>
          <Link href="/locations" className={styles.link}>
            Місця відпочинку
          </Link>
        </nav>

        {/* 🔹 Socials */}
 <div className={styles.socials}>
  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
    <Image src="/img/facebook.svg" alt="Facebook" width={24} height={24} />
  </a>

  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
    <Image src="/img/instagram.svg" alt="Instagram" width={24} height={24} />
  </a>

  <a href="https://x.com/" target="_blank" rel="noopener noreferrer">
    <Image src="/img/X.svg" alt="X" width={24} height={24} />
  </a>

  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
    <Image src="/img/youtube.svg" alt="Youtube" width={24} height={24} />
  </a>
</div>
      </div>

      {/*  Copyright */}
      <div className={styles.bottom}>
        © 2026 Природні Мандри. Усі права захищені.
      </div>
    </footer>
  );
}