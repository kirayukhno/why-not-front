import Image from "next/image";
import styles from "./LocationGallery.module.css";

type LocationGalleryProps = {
  imageSrc: string;
  imageAlt: string;
};

export const LocationGallery = ({
  imageSrc,
  imageAlt,
}: LocationGalleryProps) => {
  return (
    <div className={styles.locationGallery}>
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(min-width: 1440px) 755px, (min-width: 768px) calc(100vw - 64px), calc(100vw - 40px)"
          className={styles.image}
          unoptimized={imageSrc.startsWith("data:image/")}
        />
      ) : (
        <div className={styles.placeholder}>Без зображення</div>
      )}
    </div>
  );
};
