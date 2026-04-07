import css from "./LocationCard.module.css";
import { Location } from "@/types/types";
import Link from "next/link";
import Image from "next/image";
import StarRating from "../ui/star-rating";

type LocationCardProps = {
  location: Location;
};

export default function LocationCard({ location }: LocationCardProps) {
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
        <Image
          src={imageSrc}
          alt={location.name}
          width={420}
          height={200}
          className={css.image}
          unoptimized={isDataImage}
        />
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

        <Link
          href={`/locations/${location._id}`}
          className={`secondary-btn ${css.button}`}
        >
          Переглянути локацію
        </Link>
      </div>
    </article>
  );
}
