'use client';
import Modal from '../Modal/Modal';
import css from '../Modal/Modal.module.css';
import '../../app/globals.css';
import styles from './AuthPromptModal.module.css';
import Link from 'next/link';

interface AuthPromptModalProps {
    onClose: () => void;
}

export default function AuthPromptModal({ onClose }: AuthPromptModalProps) {
    return (
        <Modal onClose={onClose} modalClassName={styles.modal} closeButtonStyles={styles.closeButton}>
            <h2 className={`${css.message} ${styles.message}`}>Помилка під час додавання відгуку</h2>
            <p className={`${css.details} ${styles.details}`}>Щоб залишити відгук вам треба увійти, якщо ще немає облікового запису зареєструйтесь</p>
            <div className={css.options}>
                <Link href='/login' className='secondary-btn'>Увійти</Link>
                <Link href='/register' className='primary-btn'>Зареєструватись</Link>
            </div>
        </Modal>
    );
}