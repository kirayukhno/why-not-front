import { api } from './api';
import { cookies } from 'next/headers';
import type { Feedback, FeedbacksResponse, LocationType, Region } from '@/types/types';
import { findRegionLabel, findTypeLabel } from '@/lib/locationDisplay';

let regionsCache: Region[] | null = null;
let locationTypesCache: LocationType[] | null = null;
let categoriesPromise: Promise<void> | null = null;

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
        regionsCache = extractRegions(regionsResponse.data);
        locationTypesCache = extractLocationTypes(typesResponse.data);
      })
      .finally(() => {
        categoriesPromise = null;
      });
  }

  await categoriesPromise;
};

const isValidImageUrl = (value: unknown) => {
  if (typeof value !== 'string' || !value.trim()) {
    return false;
  }

  return (
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('data:image/')
  );
};

const toImageSrc = (value: unknown) => {
  if (typeof value !== 'string' || !value.trim()) {
    return '';
  }

  if (isValidImageUrl(value)) {
    return value;
  }

  return `data:image/jpeg;base64,${value}`;
};

const normalizeFeedbacks = async (payload: unknown): Promise<Feedback[]> => {
  await ensureCategoriesCache();

  const data = payload as
    | { feedbacks?: Feedback[]; data?: { feedbacks?: Feedback[] } }
    | undefined;

  const items = data?.feedbacks ?? data?.data?.feedbacks ?? [];

  return items.map((feedback) => ({
    ...feedback,
    id: feedback._id,
    locationType:
      typeof feedback.locationType === 'string'
        ? findTypeLabel(feedback.locationType, locationTypesCache)
        : feedback.locationType,
  }));
};

const normalizeLocationDetails = async (
  location: Record<string, unknown> | null | undefined,
) => {
  if (!location) {
    return null;
  }

  await ensureCategoriesCache();

  const rawImages = Array.isArray(location.images) ? location.images : [];
  const imageCandidate =
    location.image ??
    rawImages.find((item) => typeof item === 'string' && item.trim()) ??
    '';

  const ownerId =
    typeof location.ownerId === 'string'
      ? location.ownerId
      : location.owner && typeof location.owner === 'object' && '_id' in location.owner
        ? String(location.owner._id)
        : typeof location.owner === 'string'
          ? location.owner
          : '';

  let authorName =
    typeof location.authorName === 'string' && location.authorName
      ? location.authorName
      : location.owner && typeof location.owner === 'object' && 'name' in location.owner
        ? String(location.owner.name)
        : '';

  if (!authorName && ownerId) {
    try {
      const userRes = await api.get(`/users/${ownerId}`);
      authorName = userRes.data?.data?.name ?? userRes.data?.name ?? '';
    } catch (error) {
      console.error(`Server API Error (author lookup ${ownerId}):`, error);
    }
  }

  const rawRegion =
    typeof location.region === 'string'
      ? location.region
      : location.region && typeof location.region === 'object' && '_id' in location.region
        ? String(location.region._id)
        : location.region && typeof location.region === 'object' && 'slug' in location.region
          ? String(location.region.slug)
      : location.region && typeof location.region === 'object' && 'region' in location.region
        ? String(location.region.region)
        : '';

  const rawType =
    typeof location.locationType === 'string'
      ? location.locationType
      : location.locationType &&
          typeof location.locationType === 'object' &&
          '_id' in location.locationType
        ? String(location.locationType._id)
        : location.locationType &&
            typeof location.locationType === 'object' &&
            'slug' in location.locationType
          ? String(location.locationType.slug)
          : location.locationType &&
              typeof location.locationType === 'object' &&
              'type' in location.locationType
            ? String(location.locationType.type)
      : typeof location.type === 'string'
        ? location.type
        : location.type && typeof location.type === 'object' && '_id' in location.type
          ? String(location.type._id)
          : location.type && typeof location.type === 'object' && 'slug' in location.type
            ? String(location.type.slug)
        : location.type && typeof location.type === 'object' && 'type' in location.type
          ? String(location.type.type)
          : '';

  return {
    ...location,
    ownerId,
    authorName,
    image: toImageSrc(imageCandidate),
    rate: Number(location.rate ?? location.rating ?? 0),
    regionName:
      typeof location.regionName === 'string' && location.regionName
        ? findRegionLabel(location.regionName, regionsCache)
        : findRegionLabel(rawRegion, regionsCache),
    locationTypeName:
      typeof location.locationTypeName === 'string' && location.locationTypeName
        ? findTypeLabel(location.locationTypeName, locationTypesCache)
        : findTypeLabel(rawType, locationTypesCache),
  };
};

export const getFeedbacks = async () => {
  try {
    const res = await api.get('/feedback', {
      params: { perPage: 10 },
    });

    const feedbacks = await normalizeFeedbacks(res.data);

    if (feedbacks.length > 0) {
      return feedbacks;
    }
  } catch (error) {
    console.error('Server API Error (getFeedbacks primary):', error);
  }

  try {
    const fallbackRes = await api.get('/feedbacks', {
      params: { perPage: 10 },
    });

    return await normalizeFeedbacks(fallbackRes.data);
  } catch (error) {
    console.error('Server API Error (getFeedbacks fallback):', error);
    return [];
  }
};

export const getLocationFeedbacks = async (locationId: string): Promise<Feedback[]> => {
  try {
    const res = await api.get<FeedbacksResponse>(
      `/feedback/locations/${locationId}/feedbacks`,
    );
    const feedbacks = await normalizeFeedbacks(res.data);
    return feedbacks.map((f) => ({
      ...f,
      id: f._id,
    }));
  } catch {
    try {
      const [locationsRes, feedbacksRes] = await Promise.all([
        api.get('/locations', { params: { page: 1, limit: 1000 } }),
        api.get('/feedback', { params: { page: 1, perPage: 200 } }),
      ]);

      const locations = Array.isArray(locationsRes.data?.data) ? locationsRes.data.data : [];
      const location = locations.find(
        (item: Record<string, unknown>) => String(item._id) === locationId,
      );

      const feedbackIds = Array.isArray(location?.feedbacksId)
        ? location.feedbacksId.map((item: unknown) =>
            typeof item === 'string'
              ? item
              : item && typeof item === 'object' && '_id' in item
                ? String(item._id)
                : '',
          )
        : [];

      if (feedbackIds.length === 0) {
        return [];
      }

      const allFeedbacks = await normalizeFeedbacks(feedbacksRes.data);

      return allFeedbacks.filter((feedback) => feedbackIds.includes(feedback._id));
    } catch {
      return [];
    }
  }
};

export const getLocationById = async (locationId: string) => {
  try {
    const res = await api.get(`/locations/${locationId}`);
    return await normalizeLocationDetails(res.data.data);
  } catch {
    try {
      const fallbackRes = await api.get('/locations', {
        params: { page: 1, limit: 1000 },
      });

      const items = Array.isArray(fallbackRes.data?.data) ? fallbackRes.data.data : [];
      const location = items.find(
        (item: Record<string, unknown>) => String(item._id) === locationId,
      );

      return await normalizeLocationDetails(location);
    } catch {
      return null;
    }
  }
};

export const serverUserService = {
  getCurrentUser: async () => {
    try {
      const cookieStore = await cookies();
      const allCookies = cookieStore.getAll();
      const cookieHeader = allCookies.map((c) => `${c.name}=${c.value}`).join('; ');

      const res = await api.get('/users/current', {
        headers: { Cookie: cookieHeader },
      });
      return res.data;
    } catch (error) {
      console.error('Server API Error (getCurrentUser):', error);
      return null;
    }
  },
  getUserById: async (userId: string) => {
    try {
      const res = await api.get(`/users/${userId}`);
      return res.data;
    } catch (error) {
      console.error(`Server API Error (getUserById ${userId}):`, error);
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
    } catch (error) {
      console.error(`Server API Error (getUserLocations primary ${userId}):`, error);
    }

    try {
      const fallbackRes = await api.get(`/users/${userId}/places`);
      const items = fallbackRes.data?.data?.data ?? fallbackRes.data?.data?.places;

      if (Array.isArray(items) && items.length > 0) {
        return fallbackRes.data;
      }
    } catch (error) {
      console.error(`Server API Error (getUserLocations fallback ${userId}):`, error);
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
    } catch (error) {
      console.error(`Server API Error (getUserLocations local filter ${userId}):`, error);
      return { data: { data: [], totalItems: 0 } };
    }
  },
};
