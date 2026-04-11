import css from "./LocationCard.module.css";
import { Location } from "@/types/types";
import Link from "next/link";
import Image from "next/image";
import StarRating from "../ui/star-rating";

type LocationCardProps = {
  location: Location;
  showEditButton?: boolean;
};
 
export default function LocationCard({
  location,
  showEditButton = false,
}: LocationCardProps) {
  const locationTypeLabel = location.locationTypeName ?? location.locationType ?? "";
  const regionLabel =
    location.regionName ||
    (typeof location.region === "string" ? location.region : location.region?.region) ||
    "";
  const rating = Number(location.rate ?? location.rating ?? 0);
  const imageSrc = location.image || "";
  const isDataImage = imageSrc.startsWith("data:image/");

  return (
    <article className={css.card}>
      {imageSrc ? (
        <div className={css.imageWrapper}>
          <Image
            src={imageSrc}
            alt={location.name}
            fill
            sizes="(min-width: 1440px) 421px, (min-width: 768px) calc((100vw - 96px) / 2), 100vw"
            className={css.image}
            unoptimized={isDataImage}
          />
        </div>
      ) : (
        <div className={css.imagePlaceholder}>Без зображення</div>
      )}

      <div className={css.content}>
        <p className={css.typeText}>
          {locationTypeLabel}
          {regionLabel ? ` • ${regionLabel}` : ""}
        </p>
        <StarRating rate={rating} size={22} />
        <h3 className={css.title}>{location.name}</h3>

        <div className={css.actions}>
          {showEditButton ? (
            <Link
              href={`/locations/${location._id}/edit`}
              className={`secondary-btn ${css.editButton}`}
              aria-label={`Редагувати локацію ${location.name}`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M10.996 2.003a1.886 1.886 0 0 1 2.667 2.667l-7.33 7.33-3.2.533.533-3.2 7.33-7.33Z"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          ) : null}
          <Link
            href={`/locations/${location._id}`}
            className={`secondary-btn ${css.button}`}
          >
            Переглянути локацію
          </Link>
        </div>
      </div>
    </article>
  );
}
