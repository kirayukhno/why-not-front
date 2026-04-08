"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FilterPanel from "../FilterPanel/FilterPanel";
import LocationsGrid from "../LocationsGrid/LocationsGrid";
import {
  fetchLocationTypes,
  fetchLocations,
  fetchRegions,
} from "@/lib/api/clientApi";
import { Location, LocationType, Region } from "@/types/types";
import css from "./LocationsPage.module.css";

export default function LocationsPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [locations, setLocations] = useState<Location[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [types, setTypes] = useState<LocationType[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [scrollTargetIndex, setScrollTargetIndex] = useState<number | null>(null);

  const searchValue = searchParams.get("search") || "";
  const selectedRegion = searchParams.get("region") || "";
  const selectedType = searchParams.get("type") || "";
  const selectedSort = searchParams.get("sort") || "";

  const updateSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.set("page", "1");
    router.push(`/locations?${params.toString()}`);
  };

  useEffect(() => {
    const getFilterData = async () => {
      try {
        const [regionsData, typesData] = await Promise.all([
          fetchRegions(),
          fetchLocationTypes(),
        ]);

        setRegions(regionsData || []);
        setTypes(typesData || []);
      } catch (error) {
        console.error("Failed to fetch filter data:", error);
      }
    };

    getFilterData();
  }, []);

  useEffect(() => {
    const getLocations = async () => {
      try {
        setIsLoading(true);
        setCurrentPage(1);
        setScrollTargetIndex(null);

        const data = await fetchLocations({
          page: 1,
          limit: 9,
          search: searchValue || undefined,
          region: selectedRegion || undefined,
          type: selectedType || undefined,
          sort: selectedSort || undefined,
        });

        setLocations(data.items);
        setHasNextPage(Boolean(data.hasNextPage));
      } catch (error) {
        console.error("Failed to fetch locations:", error);
        setLocations([]);
        setHasNextPage(false);
      } finally {
        setIsLoading(false);
      }
    };

    getLocations();
  }, [searchValue, selectedRegion, selectedType, selectedSort]);

  useEffect(() => {
    if (scrollTargetIndex === null || locations.length <= scrollTargetIndex) {
      return;
    }

    const scrollTarget = document.querySelector<HTMLElement>(
      `[data-location-index="${scrollTargetIndex}"]`,
    );

    if (!scrollTarget) {
      return;
    }

    requestAnimationFrame(() => {
      scrollTarget.scrollIntoView({ behavior: "smooth", block: "start" });
      setScrollTargetIndex(null);
    });
  }, [locations, scrollTargetIndex]);

  const handleLoadMore = async () => {
    try {
      const nextPage = currentPage + 1;
      const nextBatchStartIndex = locations.length;
      setIsLoadingMore(true);

      const data = await fetchLocations({
        page: nextPage,
        limit: 9,
        search: searchValue || undefined,
        region: selectedRegion || undefined,
        type: selectedType || undefined,
        sort: selectedSort || undefined,
      });

      setLocations((prev) => [...prev, ...data.items]);
      setCurrentPage(nextPage);
      setHasNextPage(Boolean(data.hasNextPage));
      setScrollTargetIndex(nextBatchStartIndex);
    } catch (error) {
      console.error("Failed to load more locations:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <section className={`section ${css.sectionOverride}`}>
      <div className="container">
        <h1 className={css.title}>Усі місця відпочинку</h1>
        <FilterPanel
          regions={regions}
          types={types}
          searchValue={searchValue}
          selectedRegion={selectedRegion}
          selectedType={selectedType}
          selectedSort={selectedSort}
          onChange={updateSearchParams}
        />

        <div>
          <LocationsGrid
            locations={locations}
            isLoading={isLoading}
            isLoadingMore={isLoadingMore}
            hasNextPage={hasNextPage}
            scrollTargetIndex={scrollTargetIndex}
            onLoadMore={handleLoadMore}
          />
        </div>
      </div>
    </section>
  );
}
