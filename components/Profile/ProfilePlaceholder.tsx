import Link from 'next/link';
import css from './ProfilePlaceHolder.module.css';

interface ProfilePlaceholderProps {
  isOwner: boolean;
}

export default function ProfilePlaceholder({ isOwner }: ProfilePlaceholderProps) {
  return (
    <div className={css.wrapper}>
      
      <div className={css.placeholderContainer}>
        {isOwner ? (
          <>
            <p className={css.placeholderText}>
              Ви ще нічого не публікували, поділіться своєю першою локацією!
            </p>
            <Link href="/create-location" className={css.actionButton}>
              Поділитись локацією
            </Link>
          </>
        ) : (
          <>
            <p className={css.placeholderText}>
              Цей користувач ще не ділився локаціями
            </p>
            <Link href="/" className={css.actionButton}>
              Назад до локацій
            </Link>
          </>
        )}
      </div>
    </div>
  );
}