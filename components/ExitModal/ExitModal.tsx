'use client';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import '../../app/globals.css';

interface ExitModalProps {
    onClose: () => void;
}

export default function ExitModal({onClose}:ExitModalProps) {
    const handleExit = async () => {
        await fetch('/api/logout', { method: 'POST' });
    };

    return (
                <ConfirmationModal
                    onClose={onClose}
                    title="Ви точно хочете вийти?"
                    message="Ми будемо сумувати за вами!"
                    cancelButtonText="Відмінити"
                    confirmButtonText="Вийти"
                    onConfirm={handleExit}
                    onCancel={onClose}
                />
    );
}