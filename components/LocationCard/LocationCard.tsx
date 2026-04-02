import css from "./LocationCard.module.css";
import { Location } from "@/types";

type LocationCardProps = {
  location: Location;
};

export default function LocationCard({ location }: LocationCardProps) {
  return (
    <article className={css.card}>
      <div className={css.imagePlaceholder}>Фото</div>

      <div className={css.content}>
        <p className={css.typeText}>Тип</p>
        <p className={css.rating}>★★★★★</p>
        <h3 className={css.title}>{location.name}</h3>

        <button type="button" className={`secondary-btn ${css.button}`}>
          Переглянути локацію
        </button>
      </div>
    </article>
  );
}
