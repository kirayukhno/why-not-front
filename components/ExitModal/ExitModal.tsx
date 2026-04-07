'use client';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import '../../app/globals.css';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface ExitModalProps {
    onClose: () => void;
}

export default function ExitModal({onClose}:ExitModalProps) {
    const { logout } = useAuth();
    const router = useRouter();
    const handleExit = async () => {
        await logout();
        router.push('/');
        router.refresh();
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
