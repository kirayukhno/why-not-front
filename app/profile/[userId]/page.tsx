import styles from './page.module.css';
import ProfileInfo from '@/components/Profile/ProfileInfo';
import LocationsGrid from '@/components/Shared/LocationsGrid';//імпортувати коли інший розробник напише 
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
    userService.getCurrentUser(token)
  ]);

  if (!userResult) notFound();

  const isOwner = currentUserResult?.data?._id === userId;
  
  const user = {
    id: userId,
    name: userResult.data.username,
    avatarUrl: userResult.data.avatar,
    articlesCount: locationsResult.data.totalItems || 0,
  };

  const userLocations = locationsResult.data.data || [];

  return (
    <main className={styles.wrapper}>
      <ProfileInfo user={user} />
      <div className={styles.locationsSection}>
        {!isOwner && <h2 className={styles.sectionTitle}>Локації</h2>}
        {userLocations.length > 0 ? (
          <LocationsGrid locations={userLocations} />
        ) : (
          <ProfilePlaceholder isOwner={isOwner} />
        )}
      </div>
    </main>
  );
}