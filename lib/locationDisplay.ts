import type { LocationType, Region } from "@/types/types";

const toLookupKey = (value: string) => value.trim().toLowerCase();
const compactLookupKey = (value: string) =>
  toLookupKey(value).replace(/[\s-_]+/g, "");
const transliterateLookupKey = (value: string) =>
  compactLookupKey(
    value
      .toLowerCase()
      .replace(/ь/g, "")
      .replace(/’|'/g, "")
      .replace(/щ/g, "shch")
      .replace(/ш/g, "sh")
      .replace(/ч/g, "ch")
      .replace(/ц/g, "ts")
      .replace(/ю/g, "iu")
      .replace(/я/g, "ia")
      .replace(/ж/g, "zh")
      .replace(/х/g, "kh")
      .replace(/ї/g, "i")
      .replace(/й/g, "i")
      .replace(/є/g, "ie")
      .replace(/ґ/g, "g")
      .replace(/і/g, "i")
      .replace(/а/g, "a")
      .replace(/б/g, "b")
      .replace(/в/g, "v")
      .replace(/г/g, "h")
      .replace(/д/g, "d")
      .replace(/е/g, "e")
      .replace(/з/g, "z")
      .replace(/и/g, "y")
      .replace(/к/g, "k")
      .replace(/л/g, "l")
      .replace(/м/g, "m")
      .replace(/н/g, "n")
      .replace(/о/g, "o")
      .replace(/п/g, "p")
      .replace(/р/g, "r")
      .replace(/с/g, "s")
      .replace(/т/g, "t")
      .replace(/у/g, "u")
      .replace(/ф/g, "f"),
  );

const DEFAULT_LOCATION_TYPES: LocationType[] = [
  { _id: "68d51e2e0e6bcc357e9833a0", type: "Історичне місце", slug: "istorychne-mistse" },
  { _id: "68d51e2e0e6bcc357e98339b", type: "Озеро", slug: "ozero" },
  { _id: "68d51e2e0e6bcc357e98339d", type: "Річка", slug: "richka" },
  { _id: "68d51e2e0e6bcc357e9833a6", type: "Кемпінг", slug: "kempinh" },
  { _id: "68d51e2e0e6bcc357e9833a8", type: "Каньйон", slug: "kanyon" },
  { _id: "68d51e2e0e6bcc357e9833a7", type: "Заповідник", slug: "zapovidnyk" },
  { _id: "68d51e2e0e6bcc357e9833a1", type: "Термальні джерела", slug: "termalni-dzherela" },
  { _id: "68d51e2e0e6bcc357e98339c", type: "Ліс", slug: "lis" },
  { _id: "68d51e2e0e6bcc357e98339f", type: "Національний парк", slug: "natsionalnyi-park" },
  { _id: "68d51e2e0e6bcc357e9833a5", type: "Водоспад", slug: "vodospad" },
  { _id: "68d51e2e0e6bcc357e983399", type: "Гори", slug: "hory" },
  { _id: "68d51e2e0e6bcc357e98339a", type: "Міський відпочинок", slug: "miskyi-vidpochynok" },
  { _id: "68d51e2e0e6bcc357e9833a3", type: "Гірськолижний курорт", slug: "hirskolyzhnyi-kurort" },
  { _id: "68d51e2e0e6bcc357e9833a4", type: "Замок", slug: "zamok" },
  { _id: "68d51e2e0e6bcc357e9833a2", type: "Спа-курорт", slug: "spa-kurort" },
  { _id: "68d51e2e0e6bcc357e9833a9", type: "Печера", slug: "pechera" },
  { _id: "68d51e2e0e6bcc357e983398", type: "Море", slug: "more" },
  { _id: "68d51e2e0e6bcc357e98339e", type: "Пляж", slug: "plyazh" },
];

const getTypesSource = (types?: LocationType[] | null) =>
  types && types.length > 0 ? types : DEFAULT_LOCATION_TYPES;

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

  return match?.region || value;
};

export const findTypeLabel = (value: string, types?: LocationType[] | null) => {
  const normalizedValue = toLookupKey(value);
  const compactValue = compactLookupKey(value);
  const translitValue = transliterateLookupKey(value);

  const match = getTypesSource(types).find((type) => {
    return (
      String(type._id) === value ||
      toLookupKey(type.slug) === normalizedValue ||
      toLookupKey(type.type) === normalizedValue ||
      compactLookupKey(type.slug) === compactValue ||
      compactLookupKey(type.type) === compactValue ||
      transliterateLookupKey(type.type) === translitValue
    );
  });

  return match?.type || value;
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

  const selected = getTypesSource(types).find((type) => type._id === selectedType);
  const rawTypeValue = String(rawType);

  return (
    rawTypeValue === selectedType ||
    rawTypeValue === selected?.slug ||
    rawTypeValue === selected?.type ||
    compactLookupKey(rawTypeValue) === compactLookupKey(selected?.slug || "") ||
    compactLookupKey(rawTypeValue) === compactLookupKey(selected?.type || "") ||
    transliterateLookupKey(rawTypeValue) === transliterateLookupKey(selected?.type || "")
  );
};
