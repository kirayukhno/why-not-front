import type { LocationType, Region } from "@/types/types";

const toLookupKey = (value: string) => value.trim().toLowerCase();
const compactLookupKey = (value: string) =>
  toLookupKey(value).replace(/[\s-_]+/g, "");

export const regionFallbackMap: Record<string, string> = {
  odeshchyna: "Одещина",
  khersonshchyna: "Херсонщина",
  bukovyna: "Буковина",
  ukrainskikarpaty: "Українські Карпати",
  chornomorskeuzberezhzhya: "Чорноморське узбережжя",
};

export const typeFallbackMap: Record<string, string> = {
  hory: "Гори",
  hirskolyzhnyikurort: "Гірськолижний курорт",
  istorychnemistse: "Історичне місце",
  kanyon: "Каньйон",
  miskyividpochynok: "Міський відпочинок",
  more: "Море",
  natsionalnyipark: "Національний парк",
  ozero: "Озеро",
  park: "Парк",
  pechera: "Печера",
  pliash: "Пляж",
  plyazh: "Пляж",
  richka: "Річка",
  spakurort: "Спа-курорт",
  termalnidzherela: "Термальні джерела",
  vodospad: "Водоспад",
  zamok: "Замок",
  zapovidnyk: "Заповідник",
  kempinh: "Кемпінг",
  lis: "Ліс",
};

export const findRegionLabel = (value: string, regions?: Region[] | null) => {
  const normalizedValue = toLookupKey(value);
  const compactValue = compactLookupKey(value);

  const match = regions?.find((region) => {
    return (
      String(region._id) === value ||
      toLookupKey(region.slug) === normalizedValue ||
      toLookupKey(region.region) === normalizedValue ||
      compactLookupKey(region.slug) === compactValue ||
      compactLookupKey(region.region) === compactValue
    );
  });

  return match?.region || regionFallbackMap[compactValue] || value;
};

export const findTypeLabel = (value: string, types?: LocationType[] | null) => {
  const normalizedValue = toLookupKey(value);
  const compactValue = compactLookupKey(value);

  const match = types?.find((type) => {
    return (
      String(type._id) === value ||
      toLookupKey(type.slug) === normalizedValue ||
      toLookupKey(type.type) === normalizedValue ||
      compactLookupKey(type.slug) === compactValue ||
      compactLookupKey(type.type) === compactValue
    );
  });

  return match?.type || typeFallbackMap[compactValue] || value;
};

export const matchesRegionFilter = (
  rawRegion: unknown,
  selectedRegion: string,
  regions?: Region[] | null,
) => {
  if (!selectedRegion) {
    return true;
  }

  if (typeof rawRegion !== "string") {
    return false;
  }

  const selected = regions?.find((region) => region._id === selectedRegion);

  return (
    rawRegion === selectedRegion ||
    rawRegion === selected?.slug ||
    rawRegion === selected?.region ||
    compactLookupKey(rawRegion) === compactLookupKey(selected?.slug || "") ||
    compactLookupKey(rawRegion) === compactLookupKey(selected?.region || "")
  );
};

export const matchesTypeFilter = (
  rawType: unknown,
  selectedType: string,
  types?: LocationType[] | null,
) => {
  if (!selectedType) {
    return true;
  }

  if (typeof rawType !== "string") {
    return false;
  }

  const selected = types?.find((type) => type._id === selectedType);

  return (
    rawType === selectedType ||
    rawType === selected?.slug ||
    rawType === selected?.type ||
    compactLookupKey(rawType) === compactLookupKey(selected?.slug || "") ||
    compactLookupKey(rawType) === compactLookupKey(selected?.type || "")
  );
};
