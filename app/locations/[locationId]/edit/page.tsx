import { getLocationById, serverUserService } from '@/lib/api/serverApi';
import LocationForm from '@/components/LocationForm/LocationForm';
import { redirect } from 'next/navigation';

type EditLocationPageProps = {
  params: Promise<{
    locationId: string;
  }>;
};

const extractRelationValue = (value: unknown, nestedKey: string) => {
  if (typeof value === 'string') {
    return value;
  }

  if (value && typeof value === 'object') {
    const source = value as Record<string, unknown>;

    return String(source._id || source.slug || source[nestedKey] || '');
  }

  return '';
};

const extractImageValue = (value: unknown) => {
  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value)) {
    const firstImage = value[0];

    return extractImageValue(firstImage);
  }

  if (value && typeof value === 'object') {
    const source = value as Record<string, unknown>;

    return String(
      source.url || source.secure_url || source.path || source.src || source.imageUrl || '',
    );
  }

  return '';
};

export default async function EditLocationPage({
  params,
}: EditLocationPageProps) {
  const { locationId } = await params;
  const [locationData, currentUser] = await Promise.all([
    getLocationById(locationId),
    serverUserService.getCurrentUser(),
  ]);

  if (!locationData) {
    return (
      <section className="section">
        <div className="container">
          <h1>Редагування місця</h1>
          <p>Не вдалося отримати дані про локацію.</p>
        </div>
      </section>
    );
  }

  const rawLocation = locationData as Record<string, unknown>;
  const currentUserId =
    (typeof currentUser?.data?.id === 'string' ? currentUser.data.id : '') ||
    (typeof currentUser?.data?._id === 'string' ? currentUser.data._id : '') ||
    (typeof currentUser?.id === 'string' ? currentUser.id : '') ||
    (typeof currentUser?._id === 'string' ? currentUser._id : '');
  const ownerId =
    (typeof rawLocation.ownerId === 'string' ? rawLocation.ownerId : '') ||
    (rawLocation.owner &&
    typeof rawLocation.owner === 'object' &&
    '_id' in rawLocation.owner
      ? String((rawLocation.owner as { _id?: string })._id || '')
      : '');

  if (!currentUserId) {
    redirect(`/login?from=${encodeURIComponent(`/locations/${locationId}/edit`)}`);
  }

  if (!ownerId || ownerId !== currentUserId) {
    redirect(`/locations/${locationId}`);
  }

  const initialData = {
    _id: String(rawLocation._id || locationId),
    name: String(rawLocation.name || ''),
    type:
      extractRelationValue(rawLocation.type, 'type') ||
      extractRelationValue(rawLocation.locationType, 'type'),
    region: extractRelationValue(rawLocation.region, 'region'),
    description: String(rawLocation.description || ''),
    image: extractImageValue(rawLocation.image) || extractImageValue(rawLocation.images),
  };

  return (
    <section className="section">
      <div className="container">
        <h1>Редагування місця</h1>
        <LocationForm
          mode="edit"
          locationId={locationId}
          initialData={initialData}
        />
      </div>
    </section>
  );
}
