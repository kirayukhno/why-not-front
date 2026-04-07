"use client";

import ProfileInfo from '@/components/Profile/ProfileInfo';
import LocationsGrid from '@/components/LocationsGrid/LocationsGrid';
import ProfilePlaceholder from '@/components/Profile/ProfilePlaceholder';
import { useAuth } from '@/hooks/useAuth';
import type { Location, User } from '@/types/types';
import styles from '@/app/(public routes)/profile/[userId]/page.module.css';

type ProfilePageContentProps = {
  profileUserId: string;
  user: User;
  userLocations: Location[];
  hasMore: boolean;
};

export default function ProfilePageContent({
  profileUserId,
  user,
  userLocations,
  hasMore,
}: ProfilePageContentProps) {
  const { user: currentUser } = useAuth();
  const isOwner = currentUser?.id === profileUserId;

  return (
    <main className={styles.wrapper}>
      <ProfileInfo user={user} />
      <div className={styles.locationsSection}>
        {!isOwner && <h2 className={styles.sectionTitle}>Локації</h2>}

        {userLocations.length > 0 ? (
          <LocationsGrid
            locations={userLocations}
            isLoading={false}
            isLoadingMore={false}
            hasNextPage={hasMore}
            onLoadMore={() => {}}
          />
        ) : (
          <ProfilePlaceholder isOwner={isOwner} />
        )}
      </div>
    </main>
  );
}
