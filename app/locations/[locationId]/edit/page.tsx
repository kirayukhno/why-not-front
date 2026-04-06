import { serverLocationService } from '@/lib/api/serverApi';
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
  const locationData = await serverLocationService.getLocationById(locationId);

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

  return (
    <section className="section">
      <div className="container">
        <h1>Редагування місця</h1>
        <LocationForm
          mode="edit"
          locationId={locationId}
          initialData={locationData.data}
        />
      </div>
    </section>
  );
}