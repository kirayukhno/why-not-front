import styles from "./LocationDescription.module.css";

type LocationDescriptionProps = {
  text: string;
};

export const LocationDescription = ({ text }: LocationDescriptionProps) => {
  return (
    <div className={styles.locationDescription}>
      <p className={styles.text}>{text}</p>
    </div>
  );
};
