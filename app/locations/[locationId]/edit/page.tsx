import { getLocationById } from '@/lib/api/serverApi';
import LocationForm from '@/components/LocationForm/LocationForm';

type EditLocationPageProps = {
  params: Promise<{
    locationId: string;
  }>;
};

export default async function EditLocationPage({
  params,
}: EditLocationPageProps) {
  const { locationId } = await params;
  const locationData = await getLocationById(locationId);

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

  const initialData = {
    _id: String(rawLocation._id || locationId),
    name: String(rawLocation.name || ''),
    type: String(rawLocation.type || rawLocation.locationType || ''),
    region: String(rawLocation.region || ''),
    description: String(rawLocation.description || ''),
    image: typeof rawLocation.image === 'string' ? rawLocation.image : '',
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
