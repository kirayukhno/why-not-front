import Image from 'next/image';
import css from './Profile.module.css';
import type { User } from '@/types/types';

interface ProfileInfoProps {
  user: User;
}

export default function ProfileInfo({ user }: ProfileInfoProps) {
  return (
    <div className={css.profileInfoContainer}>
      <div className={css.avatarWrapper}>
        <Image
          src={user.avatarUrl || '/defaultUserAvatar.jpg'}
          alt={`Аватар ${user.name}`}
          width={145}
          height={145}
          className={css.avatar}
        />
      </div>

      <div className={css.textGroup}>
        <h1 className={css.userName}>{user.name}</h1>
        <p className={css.articlesCount}>Статей: {user.articlesCount}</p>
      </div>
    </div>
  );
}
