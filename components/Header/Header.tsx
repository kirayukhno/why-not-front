"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./Header.module.css";
// import { useAuth } from "@/hooks/useAuth";

type LogoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div>
        <p>Ви дійсно хочете вийти?</p>
        <button type="button" onClick={onConfirm}>
          Так
        </button>
        <button type="button" onClick={onClose}>
          Ні
        </button>
      </div>
    </div>
  );
}

export default function Header() {
  // const { isAuthenticated, user, logout } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    
    <header className={styles.header}>
      <div className={styles.container}>
        {/*  Logo */}
        <Link href="/" className={styles.logo}>
          <Image src="/logo.svg" alt="logo" width={28} height={28} />
          <span>Relax Map</span>
        </Link>

        {/* Меню Header */}
        <nav className={styles.nav}>
          <div className={styles.mainlocations}>
            <Link href="/" className={styles.linkmain}>
              Головна
            </Link>
            <Link href="/locations" className={styles.linklocations}>
              Місця відпочинку
            </Link>
          </div>
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
              <Link href="/sign-in" className={styles.login}>
                Вхід
              </Link>
              <Link href="/sign-up" className={styles.register}>
                Реєстрація
              </Link>
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
        </nav>
      </div>

      {isOpen && (
          <div
            className={styles.overlay}
            onClick={() => setIsOpen(false)}
          />
        )}

      {/* 🔹 Modal */}
      <LogoutModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => {
          logout();
          setShowModal(false);
          setIsOpen(false);
        }}
      />
    </header>
  );
}
