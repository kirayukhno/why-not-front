"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./Header.module.css";
import { useAuth } from "@/hooks/useAuth";
import LogoutModal from "@/components/LogoutModal/LogoutModal";

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
              <Link href="/profile" className={styles.linkprofile}>
                Мій профіль
              </Link>
              <Link href="/locations/add" className={styles.sharelocation}>
                Поділитись локацією
              </Link>
              <div className={styles.userBlock}>
                <span className={styles.userName}>{user?.name || "User"}</span>
                <a className={styles.logout} onClick={() => setShowModal(true)}>
                  <Image
                    src="/img/logout.svg"
                    alt="Logout"
                    width={24}
                    height={24}
                  />
                </a>
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
        </nav>

        {/*  Burger menu */}
        <button
          className={`${styles.burger} ${isOpen ? styles.active : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/*  Mobile menu */}
      <div className={`${styles.mobileMenu} ${isOpen ? styles.open : ""}`}>
        <nav className={styles.mobileNav}>
          <Link href="/" onClick={() => setIsOpen(false)}>
            Головна
          </Link>
          <Link href="/locations" onClick={() => setIsOpen(false)}>
            Місця відпочинку
          </Link>

          {isAuthenticated && (
            <>
              <Link href="/profile" onClick={() => setIsOpen(false)}>
                Профіль
              </Link>
              <Link href="/LocationDescription" className={styles.register} onClick={() => setIsOpen(false)}>
                Опублікувати статтю
              </Link>

              <button
                className={styles.logoutMobile}
                onClick={() => {
                  setShowModal(true);
                  setIsOpen(false);
                }}
              >
                Вийти
              </button>
            </>
          )}

          {!isAuthenticated && (
            <>
              <Link href="/sign-in" className={styles.login} onClick={() => setIsOpen(false)}>
                Вхід
              </Link>
              <Link href="/sign-up" className={styles.register} onClick={() => setIsOpen(false)}>
                Реєстрація
              </Link>
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

      {/*  Modal */}
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
