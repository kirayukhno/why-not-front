"use client";

import Link from 'next/link';
import { useState } from 'react';
import styles from './Header.module.css';
//.\.\services\auth.ts';
import { useAuth } from '@/hooks/useAuth';  

  const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);

  return (
    <header className={styles.header}>
      <Link href="/">Relax Map</Link>

      <nav>
        {isAuthenticated ? (
          <>
            <Link href="/locations">Місця відпочинку</Link>
            <Link href="/pro">Мій Профіль</Link>
            <Link href="/locations/add">Поділитись локацією</Link>

            <span>{user?.name}</span>

            <button onClick={() => setShowModal(true)}>Вихід</button>
          </>
        ) : (
          <>
            <Link href="/">Головна</Link>
            <Link href="/locations">Місця відпочинку</Link>
            <Link href="/login">Вхід</Link>
            <Link href="/signup">Реєстрація</Link>
          </>
        )}
      </nav>

      {showModal && (
        <div>
          <p>Вийти?</p>
          <button onClick={() => setShowModal(false)}>Ні</button>
          <button onClick={logout}>Так</button>
        </div>
      )}
    </header>
  );
};

export default Header;