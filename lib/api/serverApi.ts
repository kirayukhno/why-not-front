import { api } from './api';
import { cookies } from 'next/headers';
import type { Feedback, FeedbacksResponse } from '@/types/types';
import { findRegionLabel, findTypeLabel } from '@/lib/locationDisplay';

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

const normalizeFeedbacks = (payload: unknown): Feedback[] => {
  const data = payload as
    | { feedbacks?: Feedback[]; data?: { feedbacks?: Feedback[] } }
    | undefined;

  const items = data?.feedbacks ?? data?.data?.feedbacks ?? [];

  return items.map((feedback) => ({
    ...feedback,
    id: feedback._id,
  }));
};

const normalizeLocationDetails = async (
  location: Record<string, unknown> | null | undefined,
) => {
  if (!location) {
    return null;
  }

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
    } catch {}
  }

  const rawRegion =
    typeof location.region === 'string'
      ? location.region
      : location.region && typeof location.region === 'object' && 'region' in location.region
        ? String(location.region.region)
        : '';

  const rawType =
    typeof location.locationType === 'string'
      ? location.locationType
      : typeof location.type === 'string'
        ? location.type
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
        ? findRegionLabel(location.regionName)
        : findRegionLabel(rawRegion),
    locationTypeName:
      typeof location.locationTypeName === 'string' && location.locationTypeName
        ? findTypeLabel(location.locationTypeName)
        : findTypeLabel(rawType),
  };
};

export const getFeedbacks = async () => {
  try {
    const res = await api.get('/feedback', {
      params: { perPage: 10 },
    });

    const feedbacks = normalizeFeedbacks(res.data);

    if (feedbacks.length > 0) {
      return feedbacks;
    }
  } catch {}

  try {
    const fallbackRes = await api.get('/feedbacks', {
      params: { perPage: 10 },
    });

    return normalizeFeedbacks(fallbackRes.data);
  } catch {
    return [];
  }
};

export const getLocationFeedbacks = async (locationId: string): Promise<Feedback[]> => {
  try {
    const res = await api.get<FeedbacksResponse>(
      `/feedback/locations/${locationId}/feedbacks`,
    );
    return (res.data?.feedbacks ?? []).map((f) => ({
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

      const allFeedbacks = normalizeFeedbacks(feedbacksRes.data);

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
      //
    }

    try {
      const fallbackRes = await api.get(`/users/${userId}/places`);
      const items = fallbackRes.data?.data?.data ?? fallbackRes.data?.data?.places;

      if (Array.isArray(items) && items.length > 0) {
        return fallbackRes.data;
      }
    } catch {
      //
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
