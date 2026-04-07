import { getFeedbacks, getLocationById, getLocationFeedbacks, serverUserService } from '@/lib/api/serverApi';
import { LocationInfoBlock } from '@/components/LocationInfoBlock/LocationInfoBlock';
import { LocationGallery } from '@/components/LocationGallery/LocationGallery';
import { LocationDescription } from '@/components/LocationDescription/LocationDescription';
import ReviewsSection from '@/components/ReviewsSection/ReviewsSection';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import type { Feedback } from '@/types/types';

interface ToolDetailsPageProps {
  params: Promise<{ locationId: string }>;
}

export async function generateMetadata({ params }: ToolDetailsPageProps): Promise<Metadata> {
  const { locationId } = await params;
  const locationData = await getLocationById(locationId);

  if (!locationData) {
    return { title: 'Локацію не знайдено' };
  }

  return {
    title: locationData.name,
    description: locationData.description?.slice(0, 160),
    openGraph: {
      title: locationData.name,
      description: locationData.description?.slice(0, 160),
      images: locationData.image ? [{ url: locationData.image }] : [],
    },
  };
}

export default async function ToolDetailsPage({ params }: ToolDetailsPageProps) {
  const { locationId } = await params;
  const [locationData, feedbacks] = await Promise.all([
    getLocationById(locationId),
    getLocationFeedbacks(locationId),
  ]);

  if (!locationData) {
    notFound();
  }

  const authorId =
    typeof locationData.ownerId === 'string'
      ? locationData.ownerId
      : locationData.owner?._id ?? '';

  const authorResponse =
    !locationData.authorName && authorId
      ? await serverUserService.getUserById(authorId)
      : null;

  const authorName =
    locationData.authorName || authorResponse?.data?.name || authorResponse?.name || '';

  const fallbackFeedbacks = Array.isArray(locationData.feedbacksId)
    ? locationData.feedbacksId.filter(
        (feedback: unknown): feedback is Feedback =>
          !!feedback &&
          typeof feedback === 'object' &&
          '_id' in feedback &&
          'userName' in feedback &&
          'rate' in feedback,
      )
    : [];

  const feedbackIds = Array.isArray(locationData.feedbacksId)
    ? locationData.feedbacksId.map((feedback: unknown) =>
        typeof feedback === 'string'
          ? feedback
          : feedback && typeof feedback === 'object' && '_id' in feedback
            ? String(feedback._id)
            : '',
      )
    : [];

  const globalFeedbacks =
    feedbacks.length === 0 && feedbackIds.length > 0 ? await getFeedbacks() : [];

  const filteredGlobalFeedbacks =
    globalFeedbacks.length > 0
      ? globalFeedbacks.filter((feedback) => feedbackIds.includes(feedback._id))
      : [];

  const resolvedFeedbacks =
    feedbacks.length > 0
      ? feedbacks
      : filteredGlobalFeedbacks.length > 0
        ? filteredGlobalFeedbacks
        : fallbackFeedbacks;

  return (
    <div className="container">
      <LocationInfoBlock
        title={locationData.name}
        rating={locationData.rate ?? locationData.rating ?? 0}
        region={locationData.regionName ?? locationData.region ?? ''}
        type={locationData.locationTypeName ?? locationData.locationType ?? ''}
        authorId={authorId}
        authorName={authorName}
      />
      <LocationGallery imageSrc={locationData.image} imageAlt={locationData.name} />
      <LocationDescription text={locationData.description ?? 'Опис відсутній.'} />
      <ReviewsSection locationId={locationId} feedbacks={resolvedFeedbacks} />
    </div>
  );
}
