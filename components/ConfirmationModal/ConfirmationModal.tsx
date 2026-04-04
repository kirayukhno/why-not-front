import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import css from './ConfirmationModal.module.css'
import closeIcon from '../../public/close.svg';
import Image from 'next/image';
import Loader from '../Loader/Loader';

interface ModalProps {
    onClose: () => void;
    title: string;
    message?: string;
    confirmButtonText: string;
    cancelButtonText: string;
    onConfirm: () => Promise<void> | void;
    onCancel: () => void;
    modalClassName?: string;
    closeButtonStyles?: string;
}

export default function ConfirmationModal({ onClose, title, message, confirmButtonText, cancelButtonText, onConfirm, onCancel, modalClassName, closeButtonStyles }: ModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            await onConfirm();
            onClose();
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    }
  
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !isLoading) {
                onClose();
            }
        };
	
        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [onClose, isLoading]);

    return createPortal(
        <div
            className={css.backdrop}
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
        >
            <div className={`${css.modal} ${modalClassName || ''}`} >
                <button
                    className={`${css.closeButton} ${closeButtonStyles || ''}`}
                    onClick={onClose}
                    aria-label="Close modal"
                    disabled={isLoading}
                >
                    <Image
                        src={closeIcon}
                        alt="Close button"
                        width={24}
                        height={24}
                    />
                </button>
                <h2 className={css.message}>{title}</h2>
                <p className={css.details}>{message}</p>
                <div className={css.options}>
                    <button
                        className='secondary-btn'
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        {cancelButtonText}
                    </button>
                    <button
                        className='primary-btn'
                        onClick={handleConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader/> : confirmButtonText}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
