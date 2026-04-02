import css from "./LocationsGrid.module.css";
import { Location } from "@/types";
import LocationCard from "../LocationCard/LocationCard";

type LocationsGridProps = {
  locations: Location[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
};

export default function LocationsGrid({
  locations,
  isLoading,
  isLoadingMore,
  hasNextPage,
  onLoadMore,
}: LocationsGridProps) {
  if (isLoading) {
    return <p className={css.loading}>Завантаження...</p>;
  }

  if (!isLoading && locations.length === 0) {
    return <p className={css.empty}>Нічого не знайдено.</p>;
  }

  return (
    <div>
      <div className={css.grid}>
        {locations.map((location) => (
          <LocationCard key={location._id} location={location} />
        ))}
      </div>

      {hasNextPage && (
        <div className={css.buttonWrap}>
          <button
            className="primary-btn"
            onClick={onLoadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? "Завантаження..." : "Показати ще"}
          </button>
        </div>
      )}
    </div>
  );
}
