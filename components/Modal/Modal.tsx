import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import css from './Modal.module.css'
import closeIcon from '../../public/close.svg';
import Image from 'next/image';

interface ModalProps {
    onClose: () => void;
    children: React.ReactNode;
    modalClassName?: string;
    closeButtonStyles?: string;
}

export default function Modal({ onClose, children, modalClassName, closeButtonStyles }: ModalProps) {
    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };
  
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
	
        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [onClose]);

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
                >
                    <Image
                        src={closeIcon}
                        alt="Close button"
                        width={24}
                        height={24}
                    />
                </button>
                {children}
            </div>
        </div>,
        document.body
    );
}
