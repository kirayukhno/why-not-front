import { getLocationById } from '@/lib/api/serverApi';
import { LocationInfoBlock } from '@/components/LocationInfoBlock/LocationInfoBlock';
import { LocationGallery } from '@/components/LocationGallery/LocationGallery';
import { LocationDescription } from '@/components/LocationDescription/LocationDescription';
import ReviewsSection from '@/components/ReviewsSection/ReviewsSection';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface ToolDetailsPageProps {
    params: Promise<{ locationId: string }>;
};


export async function generateMetadata({ params }: ToolDetailsPageProps): Promise<Metadata> {
    const { locationId } = await params;
    const locationData = await getLocationById(locationId);
    console.log(locationData);

    if (!locationData) {
        return { title: 'Локацію не знайдено' };
    }

    return {
        title: locationData.name,
        description: locationData.description?.slice(0, 160),
        openGraph: {
            title: locationData.name,
            description: locationData.description?.slice(0, 160),
            images: [{ url: locationData.image }],
        },
    };
}

export default async function ToolDetailsPage({ params }: ToolDetailsPageProps) {
    const { locationId } = await params;
    const locationData = await getLocationById(locationId);

    if (!locationData) {
        notFound();
    }

    return (
        <div className='container'>
            <LocationInfoBlock
                title={locationData.name}
                rating={locationData.rate}
                region={locationData.regionName ?? locationData.region ?? ''}
                type={locationData.locationTypeName ?? locationData.locationType ?? ''}
                authorId={locationData.owner?._id ?? locationData.ownerId ?? ''}
                authorName={locationData.authorName ?? ''}
            />
            <LocationGallery imageSrc={locationData.image} imageAlt={locationData.name} />
            <LocationDescription text={locationData.description ?? 'Опис відсутній.'} />
            <ReviewsSection locationId={locationId} feedbacks={locationData.feedbacksId} />
        </div>
    );
}