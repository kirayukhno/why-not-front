"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import styles from './Header.module.css';
import { useAuth } from '@/hooks/useAuth';  

  const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);

  return (
    <header className={styles.header}>
        
    <Link href="/" className={styles.logo}>
      <Image src="/logo.svg" alt="logo" width={24} height={24} />
      <span>Relax Map</span>
    </Link>
      <nav>
        {isAuthenticated ? (
          <>
            <Link href="/locations">Місця відпочинку</Link>
            <Link href="/profile">Мій Профіль</Link>
            <Link href="/locations/add">Поділитись локацією</Link>
            <span>{user?.name}</span>
            <button onClick={() => setShowModal(true)}>Вихід</button>
          </>
        ) : (
          <>
            <Link href="/">Головна</Link>
            <Link href="/locations">Місця відпочинку</Link>
            <Link href="/sign-in">Вхід</Link>
            <Link href="/sign-up">Реєстрація</Link>
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