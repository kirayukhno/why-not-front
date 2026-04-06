import LocationForm from '@/components/LocationForm/LocationForm';

export default function CreateLocationPage() {
  return (
    <section className="section">
      <div className="container">
        <h1>Додавання нового місця</h1>
        <LocationForm mode="create" />
      </div>
    </section>
  );
}