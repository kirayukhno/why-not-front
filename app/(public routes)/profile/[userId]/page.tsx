import styles from './page.module.css';
import ProfileInfo from '@/components/Profile/ProfileInfo';
import LocationsGrid from '@/components/LocationsGrid/LocationsGrid';
import ProfilePlaceholder from '@/components/Profile/ProfilePlaceholder';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { serverUserService, } from '@/lib/api/serverApi';
import { Metadata } from 'next';


interface PageProps {
  params: { userId: string };
}


export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { userId } = await params;
 
  try {
    const userResult = await serverUserService.getUserById(userId);
   
    if (!userResult || !userResult.data) {
      return {
        title: 'Користувача не знайдено',
        description: 'Сторінка користувача не існує або була видалена.'
      };
    }


    const userName = userResult.data.name || "Користувач";
    const avatarUrl = userResult.data.avatarURL || "";


    return {
      title: `Профіль ${userName} `,
      description: `Перегляньте профіль та збережені локації користувача ${userName}.`,
      openGraph: {
        title: `Профіль ${userName}`,
        description: `Перегляньте профіль та збережені локації користувача ${userName}.`,
        images: avatarUrl ? [{ url: avatarUrl }] : [],
        type: 'profile',
      },
      twitter: {
        card: 'summary_large_image',
        title: `Профіль ${userName}`,
        description: `Перегляньте профіль та збережені локації користувача ${userName}.`,
        images: avatarUrl ? [avatarUrl] : [],
      }
    };
  } catch (error) {
    return {
      title: 'Профіль користувача',
    };
  }
}

export default async function ProfilePage({ params }: PageProps) {
  const { userId } = await params;
  const cookieStore = await cookies();
 
  const token = cookieStore.get('token')?.value;


const [userResult, locationsResult, currentUserResult] = await Promise.all([
  serverUserService.getUserById(userId),
  serverUserService.getUserLocations(userId),
  serverUserService.getCurrentUser()
  ]);
 
 
  if (!userResult || !userResult.data) {
    console.log("User not found for ID:", userId);
    notFound();
  }


    console.log("TOKEN:", token);
  console.log("CURRENT USER RESULT:", currentUserResult);

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
              // isOwner={isOwner}
            }}
          />
        ) : (
          <ProfilePlaceholder isOwner={isOwner} />
        )}
      </div>
    </main>
  );
}
