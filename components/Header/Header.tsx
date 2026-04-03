"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./Header.module.css";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <Image src="/logo.svg" alt="logo" width={24} height={24} />
          <span>Relax Map</span>
        </Link>
        <div className={styles.container}>
          {isAuthenticated ? (
            <>
              <nav className={styles.nav}>
                <Link href="/locations" className={styles.link}>
                  Місця відпочинку
                </Link>
                <Link href="/profile" className={styles.link}>
                  Мій Профіль
                </Link>
                <Link href="/locations/add" className={styles.link}>
                  Поділитись локацією
                </Link>
                <span>{user?.name}</span>
              </nav>
              <div className={styles.actions}>
                <button onClick={() => setShowModal(true)}>Вихід</button>
              </div>
            </>
          ) : (
            <>
              <nav className={styles.nav}>
                <Link href="/" className={styles.link}>
                  Головна
                </Link>
                <Link href="/locations" className={styles.link}>
                  Місця відпочинку
                </Link>
              </nav>
              <div className={styles.actions}>
                <Link href="/sign-in" className={styles.login}>
                  Вхід
                </Link>
                <Link href="/sign-up" className={styles.register}>
                  Реєстрація
                </Link>
              </div>
            </>
          )}
          {/* Burger */}
          <button className={styles.burger} onClick={toggleMenu}>
            <span className={isOpen ? styles.lineActive : ""}></span>
            <span className={isOpen ? styles.lineActive : ""}></span>
            <span className={isOpen ? styles.lineActive : ""}></span>
          </button>
          {/* Mobile menu */}
          {isAuthenticated ? (
            <>
              <div
                className={`${styles.mobileMenu} ${isOpen ? styles.open : ""}`}
              >
                <nav className={styles.mobileNav}>
                  <Link href="/locations" onClick={toggleMenu}>
                    Місця відпочинку
                  </Link>
                  <Link href="/profile" onClick={toggleMenu}>
                    Мій Профіль
                  </Link>
                  <Link href="/locations/add" onClick={toggleMenu}>
                    Поділитись локацією
                  </Link>
                  <button onClick={() => setShowModal(true)}>Вихід</button>
                </nav>
              </div>
            </>
          ) : (
            <>
              <div
                className={`${styles.mobileMenu} ${isOpen ? styles.open : ""}`}
              >
                <nav className={styles.mobileNav}>
                  <Link href="/" onClick={toggleMenu}>
                    Головна
                  </Link>
                  <Link href="/locations" onClick={toggleMenu}>
                    Місця відпочинку
                  </Link>
                  <Link href="/sign-in" onClick={toggleMenu}>
                    Вхід
                  </Link>
                  <Link href="/sign-up" onClick={toggleMenu}>
                    Реєстрація
                  </Link>
                </nav>
              </div>
            </>
          )}
          {/* Overlay */}
          {isOpen && (
            <div className={styles.overlay} onClick={toggleMenu}></div>
          )}
        </div>

        {showModal && (
  <>
    {/* Overlay */}
    <div
      className={styles.modalOverlay}
      onClick={() => setShowModal(false)}
    ></div>

    {/* Modal */}
    <div className={styles.modal}>
      <p className={styles.modalText}>Вийти з акаунту?</p>

      <div className={styles.modalActions}>
        <button
          className={styles.cancelBtn}
          onClick={() => setShowModal(false)}
        >
          Ні
        </button>

        <button
          className={styles.confirmBtn}
          onClick={() => {
            logout();
            setShowModal(false);
          }}
        >
          Так
        </button>
      </div>
    </div>
  </>
)}
      </div>
    </header>
  );
};

export default Header;
