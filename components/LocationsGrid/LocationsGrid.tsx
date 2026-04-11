import css from "./LocationsGrid.module.css";
import { Location } from "@/types/types";
import LocationCard from "../LocationCard/LocationCard";

type LocationsGridProps = {
  locations: Location[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasNextPage: boolean;
  scrollTargetIndex?: number | null;
  onLoadMore: () => void;
  showEditButton?: boolean;
};

export default function LocationsGrid({
  locations,
  isLoading,
  isLoadingMore,
  hasNextPage,
  scrollTargetIndex = null,
  onLoadMore,
  showEditButton = false,
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
        {locations.map((location, index) => (
          <div
            key={location._id}
            data-location-index={
              scrollTargetIndex === index ? String(index) : undefined
            }
          >
            <LocationCard location={location} showEditButton={showEditButton} />
          </div>
        ))}
      </div>

      {hasNextPage && (
        <div className={css.buttonWrap}>
          <button
            type="button"
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
