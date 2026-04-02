import Link from "next/link";
import styles from "./LocationInfoBlock.module.css";

type LocationInfoBlockProps = {
  title: string;
  rating?: number;
  region: string;
  type: string;
  authorId: string;
  authorName: string;
  className?: string;
};

export const LocationInfoBlock = ({
  title,
  rating,
  region,
  type,
  authorId,
  authorName,
  className,
}: LocationInfoBlockProps) => {
  const hasRating = typeof rating === "number" && !Number.isNaN(rating);
  const ratingRounded = hasRating ? Math.round(rating * 2) / 2 : 0;
  const ratingText = hasRating ? rating.toFixed(1) : null;

  return (
    <section
      className={[styles.locationInfoBlock, className]
        .filter(Boolean)
        .join(" ")}
      aria-labelledby="location-title"
    >
      {/* Rating */}
      <div className={styles.ratingRow}>
        <span className={styles.stars} aria-hidden="true">
          {Array.from({ length: 5 }, (_, index) => {
            const starValue = ratingRounded - index;
            const iconId =
              starValue >= 1
                ? "icon-star-filled"
                : starValue === 0.5
                  ? "icon-star-half"
                  : "icon-star-rate";

            return (
              <svg
                key={`star-${index}`}
                width="24"
                height="24"
                className={styles.starIcon}
                aria-hidden="true"
              >
                <use href={`/img/icons.svg#${iconId}`} />
              </svg>
            );
          })}
        </span>
        <span className={styles.ratingValue}>{ratingText ?? "—"}</span>
      </div>

      {/* Title */}
      <h1 id="location-title" className={styles.title}>
        {title}
      </h1>

      {/* Meta */}
      <div className={styles.metaList}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Регіон:</span>
          <span className={styles.metaText}>{region}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Тип локації:</span>
          <span className={styles.metaText}>{type}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Автор статті:</span>
          {authorId ? (
            <Link
              href={`/profile/${authorId}`}
              className={`${styles.metaText} ${styles.metaTextLink}`}
            >
              {authorName}
            </Link>
          ) : (
            <span className={styles.metaText}>{authorName}</span>
          )}
        </div>
      </div>
    </section>
  );
};
