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
    <div className="container">
      <div className={styles.locationGallery}>
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(min-width: 1440px) 705px, 100vw"
          className={styles.image}
        />
      </div>
    </div>
  );
};
