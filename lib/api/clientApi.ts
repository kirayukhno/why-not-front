
import { nextServer } from "./api";
import type { User, Feedback, FeedbacksResponse } from "@/types/types";

// Auth API
export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}
export const register = async (data: RegisterData): Promise<User> => {
  const response = await nextServer.post<User>("/auth/register", data);
  return response.data;
};

export const login = async (data: LoginData): Promise<User> => {
  const response = await nextServer.post<User>("/auth/login", data);
  return response.data;
};


export const logout = async (): Promise<void> => {
  await nextServer.post('/auth/logout')
};

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
      const res = await nextServer.get("/users/current");
      return res.data;
    } catch (error) {
      console.error("Client API Error (getCurrentUser):", error);
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
      console.error(`Client API Error (getUserLocations):`, error);
      return { data: { data: [], totalItems: 0 } };
    }
  },
};


