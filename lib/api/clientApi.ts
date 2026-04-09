import { nextServer, api } from './api';
import type {
  User,
  Feedback,
  FeedbacksResponse,
  Location,
  LocationType,
  Region,
} from '@/types/types';
import { AxiosError } from 'axios';
import { useQuery } from '@tanstack/react-query';
import {
  findRegionLabel,
  findTypeLabel,
  matchesRegionFilter,
  matchesTypeFilter,
} from '@/lib/locationDisplay';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export type LoginData = {
  email: string;
  password: string;
};

export interface FetchLocationsParams {
  page?: number;
  limit?: number;
  search?: string;
  region?: string;
  type?: string;
  sort?: string;
}

let regionsCache: Region[] | null = null;
let locationTypesCache: LocationType[] | null = null;
let categoriesPromise: Promise<void> | null = null;

const isValidImageUrl = (value: unknown) =>
  typeof value === 'string' &&
  !!value.trim() &&
  (value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('data:image/'));

const toImageSrc = (value: unknown) => {
  if (typeof value !== 'string' || !value.trim()) {
    return '';
  }

  return isValidImageUrl(value) ? value : `data:image/jpeg;base64,${value}`;
};

const extractRegions = (payload: unknown): Region[] => {
  const data = payload as
    | {
        regions?: Region[];
        data?: { regions?: Region[]; data?: Region[] };
      }
    | undefined;

  return data?.regions ?? data?.data?.regions ?? data?.data?.data ?? [];
};

const extractLocationTypes = (payload: unknown): LocationType[] => {
  const data = payload as
    | {
        locationTypes?: LocationType[];
        data?: { locationTypes?: LocationType[]; data?: LocationType[] };
      }
    | undefined;

  return data?.locationTypes ?? data?.data?.locationTypes ?? data?.data?.data ?? [];
};

const normalizeRegionItem = (region: Region): Region => ({
  ...region,
  region: findRegionLabel(region.region || region.slug, regionsCache),
});

const normalizeLocationTypeItem = (type: LocationType): LocationType => ({
  ...type,
  type: findTypeLabel(type.type || type.slug, locationTypesCache),
});

const ensureCategoriesCache = async () => {
  if (regionsCache && locationTypesCache) {
    return;
  }

  if (!categoriesPromise) {
    categoriesPromise = Promise.all([
      api.get('/categories/regions'),
      api.get('/categories/location-types'),
    ])
      .then(([regionsResponse, typesResponse]) => {
        regionsCache = extractRegions(regionsResponse.data).map(normalizeRegionItem);
        locationTypesCache = extractLocationTypes(typesResponse.data).map(
          normalizeLocationTypeItem,
        );
      })
      .finally(() => {
        categoriesPromise = null;
      });
  }

  await categoriesPromise;
};

const getRegionLabel = (location: Record<string, unknown>) => {
  const region = location.region;

  if (typeof location.regionName === 'string' && location.regionName) {
    return findRegionLabel(location.regionName, regionsCache);
  }

  if (region && typeof region === 'object' && 'region' in region) {
    return String(region.region);
  }

  if (typeof region === 'string') {
    return findRegionLabel(region, regionsCache);
  }

  return '';
};

const getTypeLabel = (location: Record<string, unknown>) => {
  const locationType = location.type;

  if (typeof location.locationTypeName === 'string' && location.locationTypeName) {
    return findTypeLabel(location.locationTypeName, locationTypesCache);
  }

  if (typeof location.locationType === 'string' && location.locationType) {
    return findTypeLabel(location.locationType, locationTypesCache);
  }

  if (locationType && typeof locationType === 'object' && 'type' in locationType) {
    return String(locationType.type);
  }

  if (typeof locationType === 'string') {
    return findTypeLabel(locationType, locationTypesCache);
  }

  return '';
};

const normalizeLocation = (location: Record<string, unknown>): Location => ({
  _id: String(location._id || ''),
  name: String(location.name || ''),
  description: typeof location.description === 'string' ? location.description : '',
  region:
    typeof location.region === 'string'
      ? location.region
      : (location.region as Region | string),
  type:
    typeof location.type === 'string'
      ? location.type
      : typeof location.locationType === 'string'
        ? location.locationType
        : (location.type as LocationType | string),
  image:
    toImageSrc(
      typeof location.image === 'string'
        ? location.image
        : Array.isArray(location.images) && typeof location.images[0] === 'string'
          ? location.images[0]
          : '',
    ) || undefined,
  images: Array.isArray(location.images)
    ? location.images
        .filter((item): item is string => typeof item === 'string')
        .map((item) => toImageSrc(item))
    : undefined,
  rate: Number(location.rate ?? location.rating ?? 0),
  rating: Number(location.rating ?? location.rate ?? 0),
  regionName: getRegionLabel(location),
  locationType:
    typeof location.locationType === 'string'
      ? location.locationType
      : typeof location.type === 'string'
        ? location.type
        : undefined,
  locationTypeName: getTypeLabel(location),
});

const sortLocations = (items: Array<Record<string, unknown>>, sort?: string) => {
  const sortedItems = [...items];

  if (sort === 'popular') {
    sortedItems.sort((a, b) => Number(b.rate || b.rating || 0) - Number(a.rate || a.rating || 0));
  } else if (sort === 'rating') {
    sortedItems.sort((a, b) => Number(b.rate || b.rating || 0) - Number(a.rate || a.rating || 0));
  } else if (sort === 'newest') {
    sortedItems.sort(
      (a, b) =>
        new Date(String(b.createdAt || 0)).getTime() -
        new Date(String(a.createdAt || 0)).getTime(),
    );
  }

  return sortedItems;
};

const applyClientFilters = (
  items: Array<Record<string, unknown>>,
  params: FetchLocationsParams,
) => {
  return items.filter((location) => {
    const matchesSearch =
      !params.search ||
      String(location.name || '')
        .toLowerCase()
        .includes(params.search.toLowerCase());

    const rawRegion =
      typeof location.region === 'string'
        ? location.region
        : location.region && typeof location.region === 'object' && '_id' in location.region
          ? String(location.region._id)
          : '';

    const rawType =
      typeof location.type === 'string'
        ? location.type
        : typeof location.locationType === 'string'
          ? location.locationType
          : location.type && typeof location.type === 'object' && '_id' in location.type
            ? String(location.type._id)
            : '';

    return (
      matchesSearch &&
      matchesRegionFilter(rawRegion, params.region || '', regionsCache) &&
      matchesTypeFilter(rawType, params.type || '', locationTypesCache)
    );
  });
};

const fetchLocationsSource = async (params: FetchLocationsParams) => {
  const response = await api.get('/locations', { params });
  let sourceItems = Array.isArray(response.data?.data) ? response.data.data : [];

  if (sourceItems.length === 0 && (params.region || params.type || params.search)) {
    const fallbackResponse = await api.get('/locations', {
      params: { page: 1, limit: 1000 },
    });

    sourceItems = applyClientFilters(
      Array.isArray(fallbackResponse.data?.data) ? fallbackResponse.data.data : [],
      params,
    );
  }

  return sourceItems;
};

export const fetchLocations = async (params: FetchLocationsParams): Promise<{
  items: Location[];
  hasNextPage: boolean;
}> => {
  await ensureCategoriesCache();
  const sourceItems = await fetchLocationsSource(params);
  const sortedItems = sortLocations(sourceItems, params.sort);
  const items: Location[] = sortedItems.map((location: Record<string, unknown>) =>
    normalizeLocation(location),
  );

  return {
    items,
    hasNextPage: items.length === (params.limit || 9),
  };
};

export const fetchRegions = async () => {
  const response = await api.get('/categories/regions');
  regionsCache = extractRegions(response.data).map(normalizeRegionItem);
  return regionsCache;
};

export const fetchLocationTypes = async () => {
  const response = await api.get('/categories/location-types');
  locationTypesCache = extractLocationTypes(response.data).map(
    normalizeLocationTypeItem,
  );
  return locationTypesCache;
};

export const register = async (data: RegisterData): Promise<User> => {
  try {
    const response = await nextServer.post<User>('/api/auth/register', data);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ error?: string }>;
    throw new Error(err.response?.data?.error || 'Помилка реєстрації');
  }
};

export async function login(data: LoginData) {
  try {
    const res = await nextServer.post('/api/auth/login', data);
    return res.data;
  } catch (error: unknown) {
    if (error instanceof Error) throw new Error(error.message);
    throw new Error('Помилка входу');
  }
}

export const getLocationFeedbacks = async (locationId: string): Promise<Feedback[]> => {
  const res = await nextServer.get<
    FeedbacksResponse & { data?: { feedbacks?: Feedback[] } }
  >(
    `/api/feedback`,
    {
      params: { locationId },
    },
  );
  return res.data.feedbacks ?? res.data.data?.feedbacks ?? [];
};

export const clientUserService = {
  getCurrentUser: async () => {
    try {
      const res = await nextServer.get('/api/auth/session');
      return res.data?.user ?? null;
    } catch {
      return null;
    }
  },
  getUserById: async (userId: string) => {
    try {
      const res = await api.get(`/users/${userId}`);
      return res.data;
    } catch {
      return null;
    }
  },
  getUserLocations: async (userId: string) => {
    try {
      const res = await api.get(`/users/${userId}/locations`);
      const items = res.data?.data?.data;

      if (Array.isArray(items) && items.length > 0) {
        return res.data;
      }
    } catch {
    }

    try {
      const fallbackRes = await api.get(`/users/${userId}/places`);
      const items = fallbackRes.data?.data?.data ?? fallbackRes.data?.data?.places;

      if (Array.isArray(items) && items.length > 0) {
        return fallbackRes.data;
      }
    } catch {
    }

    try {
      const locationsRes = await api.get('/locations', {
        params: { page: 1, limit: 1000 },
      });
      const allLocations = Array.isArray(locationsRes.data?.data) ? locationsRes.data.data : [];
      const filteredLocations = allLocations.filter((location: Record<string, unknown>) => {
        const ownerId =
          typeof location.ownerId === 'string'
            ? location.ownerId
            : location.owner && typeof location.owner === 'object' && '_id' in location.owner
              ? String(location.owner._id)
              : typeof location.owner === 'string'
                ? location.owner
                : '';

        return ownerId === userId;
      });

      return {
        data: {
          data: filteredLocations,
          totalItems: filteredLocations.length,
          totalPages: 1,
          page: 1,
          limit: filteredLocations.length || 0,
        },
      };
    } catch {
      return { data: { data: [], totalItems: 0 } };
    }
  },
};

export const clientLocationService = {
  createLocation: async (formData: FormData) => {
    try {
      const res = await nextServer.post('/api/locations', formData);
      return res.data;
    } catch (error) {
      const err = error as AxiosError<{ error?: string; message?: string }>;
      throw new Error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          'Сталася помилка',
      );
    }
  },
  updateLocation: async (locationId: string, formData: FormData) => {
    try {
      const res = await nextServer.patch(`/api/locations/${locationId}`, formData);
      return res.data;
    } catch (error) {
      const err = error as AxiosError<{ error?: string; message?: string }>;
      throw new Error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          'Сталася помилка',
      );
    }
  },
  getLocationById: async (locationId: string) => {
    const res = await nextServer.get(`/api/locations/${locationId}`);
    return res.data;
  },
};

const fetchLocationsInternal = async (params: FetchLocationsParams): Promise<Location[]> => {
  await ensureCategoriesCache();
  const sourceItems = await fetchLocationsSource(params);
  return sortLocations(sourceItems, params.sort).map((location: Record<string, unknown>) =>
    normalizeLocation(location),
  );
};

export const usePopularLocations = (limit: number = 6) => {
  return useQuery({
    queryKey: ['popularLocations', { limit }],
    queryFn: () => fetchLocationsInternal({ limit, page: 1 }),
    staleTime: 5 * 60 * 1000,
  });
};

export const useFilteredLocations = (params: FetchLocationsParams) => {
  return useQuery({
    queryKey: ['locations', params],
    queryFn: () => fetchLocationsInternal(params),
    staleTime: 5 * 60 * 1000,
  });
};
