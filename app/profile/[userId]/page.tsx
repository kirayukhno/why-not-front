import styles from './page.module.css';
import ProfileInfo from '@/components/Profile/ProfileInfo';
import LocationsGrid from '@/components/LocationsGrid/LocationsGrid';
import ProfilePlaceholder from '@/components/Profile/ProfilePlaceholder';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { userService } from '@/lib/api/user-service';

interface PageProps {
  params: { userId: string };
}

export default async function ProfilePage({ params }: PageProps) {
  const { userId } = await params;
  const cookieStore = await cookies();
  
  const token = cookieStore.get('token')?.value;

  const [userResult, locationsResult, currentUserResult] = await Promise.all([
    userService.getUserById(userId),
    userService.getUserLocations(userId),
    userService.getCurrentUser() 
  ]);
  if (!userResult || !userResult.data) {
    console.log("User not found for ID:", userId);
    notFound();
  }

  const isOwner = currentUserResult?.data?._id === userId;
  console.log("UserId" + userId);
  const user = {
    id: userId,
    name: userResult.data.name || "Unknown User",
    avatarUrl: userResult.data.avatarURL || "",
    articlesCount: locationsResult?.data?.totalItems || 0,
  };

  const userLocations = locationsResult?.data?.data || [];
  const hasMore = locationsResult?.data?.page < locationsResult?.data?.totalPages;

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
            onLoadMore={() => {
              console.log("Тут потрібна клієнтська логіка для дозавантаження");
            }}
          />
        ) : (
          <ProfilePlaceholder isOwner={isOwner} />
        )}
      </div>
    </main>
  );
}