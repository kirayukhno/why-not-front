"use client";

import Link from 'next/link';
import { useState } from 'react';
import styles from './Header.module.css';

// Тут для прикладу: true = користувач авторизований
// У реальному проєкті це береться з контексту або useSession / Redux
const isAuthenticated = false; 

const Header = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const closeModal = () => {
    setShowLogoutModal(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">Relax Map</Link>
      </div>

      <nav className={styles.nav}>
        {isAuthenticated ? (
          <>
            <Link href="/locations">Місця відпочинку</Link>
            <Link href="/pro">Мій Профіль</Link>
            <Link href="/locations/add" className={styles.shareBtn}>
              Поділитись локацією
            </Link>
            <button onClick={handleLogoutClick} className={styles.logoutBtn}>
              🔓 Вихід
            </button>
          </>
        ) : (
          <>
            <Link href="/">Головна</Link>
            <Link href="/locations">Місця відпочинку</Link>
            <Link href="/login" className={styles.loginBtn}>
              Вхід
            </Link>
            <Link href="/signup" className={styles.signupBtn}>
              Реєстрація
            </Link>
          </>
        )}
      </nav>

      {showLogoutModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <p>Ви впевнені, що хочете вийти?</p>
            <button onClick={closeModal}>Скасувати</button>
            <button
              onClick={() => {
                closeModal();
                console.log('logout'); // Тут підключати реальний logout
              }}
            >
              Вийти
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;