"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FilterPanel from "../FilterPanel/FilterPanel";
import LocationsGrid from "../LocationsGrid/LocationsGrid";
import {
  fetchLocationTypes,
  fetchLocations,
  fetchRegions,
} from "@/lib/api/clientApi";
import { Location, LocationType, Region } from "@/types";
import css from "./LocationsPage.module.css";

export default function LocationsPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gridRef = useRef<HTMLDivElement | null>(null);

  const [locations, setLocations] = useState<Location[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [types, setTypes] = useState<LocationType[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

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

        const data = await fetchLocations({
          page: 1,
          limit: 9,
          search: searchValue || undefined,
          region: selectedRegion || undefined,
          type: selectedType || undefined,
          sort: selectedSort || undefined,
        });

        setLocations(data.items || []);
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

  const handleLoadMore = async () => {
    try {
      const nextPage = currentPage + 1;
      setIsLoadingMore(true);

      const data = await fetchLocations({
        page: nextPage,
        limit: 9,
        search: searchValue || undefined,
        region: selectedRegion || undefined,
        type: selectedType || undefined,
        sort: selectedSort || undefined,
      });

      setLocations((prev) => [...prev, ...(data.items || [])]);
      setCurrentPage(nextPage);
      setHasNextPage(Boolean(data.hasNextPage));
      setTimeout(() => {
        gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 0);
    } catch (error) {
      console.error("Failed to load more locations:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <section className={`section ${css.sectionOverride}`}>
      <div className={css.pageWrap}>
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

        <div ref={gridRef}>
          <LocationsGrid
            locations={locations}
            isLoading={isLoading}
            isLoadingMore={isLoadingMore}
            hasNextPage={hasNextPage}
            onLoadMore={handleLoadMore}
          />
        </div>
      </div>
    </section>
  );
}
