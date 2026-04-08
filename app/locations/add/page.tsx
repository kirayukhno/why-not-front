import LocationForm from '@/components/LocationForm/LocationForm';
import css from "./page.module.css";

export default function CreateLocationPage() {
  return (
      <div className="container">
        <h1 className={css.title}>Додавання нового місця</h1>
        <LocationForm mode="create" />
      </div>
  );
}