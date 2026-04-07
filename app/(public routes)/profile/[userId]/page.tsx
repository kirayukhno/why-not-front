import ProfilePageContent from '@/components/Profile/ProfilePageContent';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api/api';
import { getLocationById, serverUserService } from '@/lib/api/serverApi';
import { findRegionLabel, findTypeLabel } from '@/lib/locationDisplay';
import type { LocationType, Region, Location } from '@/types/types';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ userId: string }>;
}

const isRegionLike = (value: unknown): value is Region =>
  !!value &&
  typeof value === 'object' &&
  '_id' in value &&
  'region' in value &&
  'slug' in value;

const isLocationTypeLike = (value: unknown): value is LocationType =>
  !!value &&
  typeof value === 'object' &&
  '_id' in value &&
  'type' in value &&
  'slug' in value;

const toDataImage = (value?: string) => {
  if (!value) {
    return '';
  }

  if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:image/')) {
    return value;
  }

  return `data:image/jpeg;base64,${value}`;
};

const extractList = <T,>(payload: unknown): T[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!payload || typeof payload !== 'object') {
    return [];
  }

  const source = payload as Record<string, unknown>;

  return (
    (Array.isArray(source.locations) ? source.locations : null) ||
    (Array.isArray(source.places) ? source.places : null) ||
    (Array.isArray(source.items) ? source.items : null) ||
    (Array.isArray(source.data) ? source.data : null) ||
    (source.data && typeof source.data === 'object' ? extractList<T>(source.data) : [])
  );
};

const extractTotal = (payload: unknown, fallback: number) => {
  if (!payload || typeof payload !== 'object') {
    return fallback;
  }

  const source = payload as Record<string, unknown>;

  return Number(
    source.totalItems ??
      source.totalPlaces ??
      source.total ??
      (source.data && typeof source.data === 'object'
        ? (source.data as Record<string, unknown>).totalItems ??
          (source.data as Record<string, unknown>).totalPlaces ??
          (source.data as Record<string, unknown>).total
        : undefined) ??
      fallback,
  );
};

const extractTotalPages = (payload: unknown) => {
  if (!payload || typeof payload !== 'object') {
    return 1;
  }

  const source = payload as Record<string, unknown>;

  return Number(
    source.totalPages ??
      (source.data && typeof source.data === 'object'
        ? (source.data as Record<string, unknown>).totalPages
        : undefined) ??
      1,
  );
};

const extractPage = (payload: unknown) => {
  if (!payload || typeof payload !== 'object') {
    return 1;
  }

  const source = payload as Record<string, unknown>;

  return Number(
    source.page ??
      (source.data && typeof source.data === 'object'
        ? (source.data as Record<string, unknown>).page
        : undefined) ??
      1,
  );
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { userId } = await params;

  try {
    const userResult = await serverUserService.getUserById(userId);

    if (!userResult?.data) {
      return {
        title: 'Користувача не знайдено',
        description: 'Сторінка користувача не існує або була видалена.',
      };
    }

    const userName = userResult.data.name || 'Користувач';
    const avatarUrl = userResult.data.avatarURL || userResult.data.avatar || '';

    return {
      title: `Профіль ${userName}`,
      description: `Перегляньте профіль та локації користувача ${userName}.`,
      openGraph: {
        title: `Профіль ${userName}`,
        description: `Перегляньте профіль та локації користувача ${userName}.`,
        images: avatarUrl ? [{ url: avatarUrl }] : [],
        type: 'profile',
      },
    };
  } catch {
    return {
      title: 'Профіль користувача',
    };
  }
}

export default async function ProfilePage({ params }: PageProps) {
  const { userId } = await params;

  const [userResult, locationsResult, regionsRes, typesRes] = await Promise.all([
    serverUserService.getUserById(userId),
    serverUserService.getUserLocations(userId),
    api.get('/categories/regions').catch(() => null),
    api.get('/categories/location-types').catch(() => null),
  ]);

  if (!userResult?.data?.name) {
    notFound();
  }

  const locationsPayload = locationsResult?.data ?? locationsResult ?? {};
  const rawUserLocations = extractList<Record<string, unknown>>(locationsPayload);
  const regions = extractList<Region>(regionsRes?.data);
  const types = extractList<LocationType>(typesRes?.data);

  const userLocations: Location[] = await Promise.all(
    rawUserLocations.map(async (location) => {
      const rawRegion =
        (typeof location.region === 'string' ? location.region : null) ||
        (location.region && typeof location.region === 'object' && '_id' in location.region
          ? String((location.region as Record<string, unknown>)._id || '')
          : '') ||
        (location.region && typeof location.region === 'object' && 'slug' in location.region
          ? String((location.region as Record<string, unknown>).slug || '')
          : '') ||
        (location.region && typeof location.region === 'object' && 'region' in location.region
          ? String((location.region as Record<string, unknown>).region || '')
          : '');

      const rawType =
        (typeof location.type === 'string' ? location.type : null) ||
        (location.type && typeof location.type === 'object' && '_id' in location.type
          ? String((location.type as Record<string, unknown>)._id || '')
          : '') ||
        (location.type && typeof location.type === 'object' && 'slug' in location.type
          ? String((location.type as Record<string, unknown>).slug || '')
          : '') ||
        (location.type && typeof location.type === 'object' && 'type' in location.type
          ? String((location.type as Record<string, unknown>).type || '')
          : '') ||
        (typeof location.locationType === 'string' ? location.locationType : null) ||
        (location.locationType &&
        typeof location.locationType === 'object' &&
        '_id' in location.locationType
          ? String((location.locationType as Record<string, unknown>)._id || '')
          : '') ||
        (location.locationType &&
        typeof location.locationType === 'object' &&
        'slug' in location.locationType
          ? String((location.locationType as Record<string, unknown>).slug || '')
          : '') ||
        (location.locationType &&
        typeof location.locationType === 'object' &&
        'type' in location.locationType
          ? String((location.locationType as Record<string, unknown>).type || '')
          : '');

      const rawImage =
        (typeof location.image === 'string' ? location.image : null) ||
        (Array.isArray(location.images) && typeof location.images[0] === 'string'
          ? location.images[0]
          : '');

      const normalizedRegionName = rawRegion ? findRegionLabel(rawRegion, regions) : '';
      const normalizedTypeName = rawType ? findTypeLabel(rawType, types) : '';
      const detailsResult = location._id ? await getLocationById(String(location._id)) : null;
      const details =
        detailsResult && typeof detailsResult === 'object'
          ? (detailsResult as Record<string, unknown>)
          : null;

      const finalTypeLabel = findTypeLabel(
        String(details?.locationTypeName || normalizedTypeName || rawType || ''),
        types,
      );
      const finalRegionLabel = findRegionLabel(
        String(details?.regionName || normalizedRegionName || rawRegion || ''),
        regions,
      );
      const resolvedRegion = isRegionLike(details?.region) ? details.region : rawRegion;
      const resolvedType = isLocationTypeLike(details?.type) ? details.type : rawType;
      const resolvedLocationType =
        typeof details?.locationType === 'string' ? details.locationType : finalTypeLabel || rawType;

      return {
        _id: String(location._id || details?._id || ''),
        name: String(location.name || details?.name || ''),
        description:
          typeof location.description === 'string'
            ? location.description
            : String(details?.description || ''),
        region: resolvedRegion,
        type: resolvedType,
        image: String(details?.image || toDataImage(rawImage)),
        images: Array.isArray(location.images)
          ? location.images.filter((item): item is string => typeof item === 'string')
          : undefined,
        rate: Number(location.rate ?? location.rating ?? details?.rate ?? details?.rating ?? 0),
        rating: Number(
          location.rating ?? location.rate ?? details?.rating ?? details?.rate ?? 0,
        ),
        locationType: resolvedLocationType,
        locationTypeName: finalTypeLabel,
        regionName: finalRegionLabel,
      };
    }),
  );

  const totalItems = extractTotal(locationsPayload, userLocations.length);
  const currentPage = extractPage(locationsPayload);
  const totalPages = extractTotalPages(locationsPayload);
  const hasMore = currentPage < totalPages;

  const user = {
    id: userId,
    name: userResult.data.name || 'Unknown User',
    avatarUrl: userResult.data.avatarURL || userResult.data.avatar || '',
    articlesCount: totalItems,
  };

  return (
    <ProfilePageContent
      profileUserId={userId}
      user={user}
      userLocations={userLocations}
      hasMore={hasMore}
    />
  );
}
