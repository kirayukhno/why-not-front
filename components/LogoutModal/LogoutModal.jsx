"use client";

import styles from "./LogoutModal.module.css";
import { useEffect } from "react";

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose}></div>

      <div className={styles.modal}>
        <h2 className={styles.title}>Ви точно хочете вийти?</h2>

        <p className={styles.text}>
          Ми будемо сумувати за вами!
        </p>

        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onClose}>
            Відмінити
          </button>

          <button className={styles.confirm} onClick={onConfirm}>
            Вийти
          </button>
        </div>
      </div>
    </>
  );
}