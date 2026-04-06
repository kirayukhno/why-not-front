

import { nextServer } from "./api";
import type { User, Feedback, FeedbacksResponse } from "@/types/types";
import { AxiosError } from "axios";

// Auth API
export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export type LoginData = {
  email: string;
  password: string;
};


export const register = async (data: RegisterData): Promise<User> => {
  try {
    const response = await nextServer.post<User>("/auth/register", data);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ error?: string }>;

    throw new Error(err.response?.data?.error || "Ошибка регистрации");
  }
};

export async function login(data: LoginData) {
  try {
    const res = await nextServer.post('/auth/login', data);
    return res.data;
  } catch (error: unknown) {
    console.error('Client API Error (login):', error);

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error('Помилка входу');
  }
}


// Feedbacks API
export const getLocationFeedbacks = async (
  locationId: string,
): Promise<Feedback[]> => {
  const res = await nextServer.get<FeedbacksResponse>(
    `/api/locations/${locationId}/feedbacks`,
  );
  return res.data?.feedbacks ?? [];
};


export const clientUserService = {
  getCurrentUser: async () => {
    try {
      const res = await nextServer.get('/users/current');
      return res.data;
    } catch (error) {
      console.error('Client API Error (getCurrentUser):', error);
      return null;
    }
  },

  getUserById: async (userId: string) => {
    try {
      const res = await nextServer.get(`/users/${userId}`);
      return res.data;
    } catch (error) {
      console.error(`Client API Error (getUserById ${userId}):`, error);
      return null;
    }
  },

  getUserLocations: async (userId: string) => {
    try {
      const res = await nextServer.get(`/users/${userId}/locations`);
      return res.data;
    } catch (error) {
      console.error('Client API Error (getUserLocations):', error);
      return { data: { data: [], totalItems: 0 } };
    }
  },
};

export const clientLocationService = {
  createLocation: async (formData: FormData) => {
    try {
      const res = await nextServer.post('/locations', formData);
      return res.data;
    } catch (error) {
      console.error('Client API Error (createLocation):', error);
      throw error;
    }
  },

  updateLocation: async (locationId: string, formData: FormData) => {
    try {
      const res = await nextServer.patch(`/locations/${locationId}`, formData);
      return res.data;
    } catch (error) {
      console.error(`Client API Error (updateLocation ${locationId}):`, error);
      throw error;
    }
  },

  getLocationById: async (locationId: string) => {
    try {
      const res = await nextServer.get(`/locations/${locationId}`);
      return res.data;
    } catch (error) {
      console.error(`Client API Error (getLocationById ${locationId}):`, error);
      throw error;
    }
  },
};

