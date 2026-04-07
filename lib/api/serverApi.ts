import { api } from './api';
import { cookies } from 'next/headers';
import type { Feedback, FeedbacksResponse } from '@/types/types';

export const getFeedbacks = async () => {
  try {
    const res = await api.get('/feedback', {
      params: { perPage: 10 },
    });
    return (res.data?.feedbacks ?? []).map((f: Feedback) => ({
      ...f,
      id: f._id,
    }));
  } catch {
    return [];
  }
};

export const getLocationFeedbacks = async (locationId: string): Promise<Feedback[]> => {
  const res = await api.get<FeedbacksResponse>(
    `/locations/${locationId}/feedbacks`
  );
  return (res.data?.feedbacks ?? []).map((f) => ({
    ...f,
    id: f._id,
  }));
};

export const getLocationById = async (locationId: string) => {
  const res = await api.get(`/locations/${locationId}`);
  return res.data.data;
};

export const serverUserService = {
 getCurrentUser: async () => {
    try {
      const cookieStore = await cookies();
      const allCookies = cookieStore.getAll();
      const cookieHeader = allCookies
        .map(c => `${c.name}=${c.value}`)
        .join('; ');
      
      const res = await api.get('/users/current', {
        headers: { Cookie: cookieHeader },
      });
      return res.data;
    } catch {
      return null;
    }
  },
getUserById: async (userId: string) => {
  console.log("API baseURL:", api.defaults.baseURL);
  console.log("Full URL:", `${api.defaults.baseURL}/users/${userId}`);
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
      return res.data;
    } catch {
      return { data: { data: [], totalItems: 0 } };
    }
  },
};
