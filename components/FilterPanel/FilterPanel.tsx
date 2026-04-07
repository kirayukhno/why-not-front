"use client";

import { useEffect, useRef, useState } from "react";
import css from "./FilterPanel.module.css";
import { LocationType, Region } from "@/types/types";

type FilterPanelProps = {
  regions: Region[];
  types: LocationType[];
  searchValue: string;
  selectedRegion: string;
  selectedType: string;
  selectedSort: string;
  onChange: (key: string, value: string) => void;
};

export default function FilterPanel({
  regions,
  types,
  searchValue,
  selectedRegion,
  selectedType,
  selectedSort,
  onChange,
}: FilterPanelProps) {
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const typeDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        typeDropdownRef.current &&
        !typeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsTypeOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedTypeName =
    types.find(
      (type) =>
        type._id === selectedType ||
        type.slug === selectedType ||
        type.type === selectedType,
    )?.type || "";

  return (
    <div className={css.wrapper}>
      <input
        className={css.input}
        type="text"
        placeholder="Пошук"
        value={searchValue}
        onChange={(e) => onChange("search", e.target.value)}
      />

      <select
        className={css.select}
        value={selectedRegion}
        onChange={(e) => onChange("region", e.target.value)}
      >
        <option value="">Регіон</option>
        {regions.map((region) => (
          <option key={region._id} value={region._id}>
            {region.region}
          </option>
        ))}
      </select>

      <div className={css.typeDropdown} ref={typeDropdownRef}>
        <button
          type="button"
          className={css.typeTrigger}
          onClick={() => setIsTypeOpen((prev) => !prev)}
        >
          <span>{selectedTypeName || "Тип локації"}</span>
          <span className={css.arrow}>⌄</span>
        </button>

        {isTypeOpen && (
          <div className={css.typeMenu}>
            {types.length > 0 ? (
              types.map((type) => (
                <label key={type._id} className={css.checkboxLabel}>
                  <input
                    className={css.checkbox}
                    type="checkbox"
                    checked={selectedType === type._id}
                    onChange={() => {
                      onChange(
                        "type",
                        selectedType === type._id ? "" : type._id,
                      );
                      setIsTypeOpen(false);
                    }}
                  />
                  <span>{type.type}</span>
                </label>
              ))
            ) : (
              <p className={css.emptyText}>Немає типів</p>
            )}
          </div>
        )}
      </div>

      <select
        className={css.sortSelect}
        value={selectedSort}
        onChange={(e) => onChange("sort", e.target.value)}
      >
        <option value="">Сортування</option>
        <option value="popular">За популярністю</option>
        <option value="rating">За рейтингом</option>
        <option value="newest">Новіші спочатку</option>
      </select>
    </div>
  );
}
