import { nextServer } from './api';
import { cookies } from 'next/headers';
import type { Feedback, FeedbacksResponse } from '@/types/types';

export const getFeedbacks = async () => {
  try {
    const res = await nextServer.get('/feedback', {
      params: { perPage: 10 },
    });
    return (res.data?.feedbacks ?? []).map((f: Feedback) => ({
      ...f,
      id: f._id,
    }));
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    return [];
  }
};

export const getLocationFeedbacks = async (locationId: string): Promise<Feedback[]> => {
  const res = await nextServer.get<FeedbacksResponse>(
    `/locations/${locationId}/feedbacks`
  );
  return (res.data?.feedbacks ?? []).map((f) => ({
    ...f,
    id: f._id,
  }));
};

export const getLocationById = async (locationId: string) => {
  const response = await fetch(
    `https://relax-map-back.onrender.com/api/locations/${locationId}`,
    { cache: 'no-store' }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Не вдалося отримати локацію');
  return data.data;
};

export const serverUserService = {
  getCurrentUser: async () => {
    try {
      const cookieStore = await cookies();
      const cookieHeader = cookieStore.toString();
      const res = await nextServer.get('/users/current', {
        headers: { Cookie: cookieHeader },
      });
      return res.data;
    } catch {
      return null;
    }
  },
  getUserById: async (userId: string) => {
    try {
      const res = await nextServer.get(`/users/${userId}`);
      return res.data;
    } catch {
      return null;
    }
  },
  getUserLocations: async (userId: string) => {
    try {
      const res = await nextServer.get(`/users/${userId}/locations`);
      return res.data;
    } catch {
      return { data: { data: [], totalItems: 0 } };
    }
  },
};  export const serverLocationService = {
  getLocationById: async (locationId: string) => {
    try {
      const res = await nextServer.get(`/locations/${locationId}`);
      return res.data;
    } catch (error) {
      console.error(`Server API Error (getLocationById):`, error);
      return null;
    }
  },
};