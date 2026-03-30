import axios, { AxiosError } from "axios";
import { nextServer } from "./api";

interface UserProfileResponse {
  data: {
    username: string;
    avatar: string;
  };
}

interface UserLocationsResponse {
  data: {
    data: any[]; 
    totalItems: number;
  };
}

interface CurrentUserResponse {
  data: {
    _id: string;
    username: string;
    avatar: string;
  };
}

export const userService = {
  async getUserById(userId: string): Promise<UserProfileResponse | null> {
    try {
      const { data } = await nextServer.get<UserProfileResponse>(`/users/${userId}`);
      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          return null; 
        }
      }
      throw error;
    }
  },

  async getUserLocations(userId: string): Promise<UserLocationsResponse> {
    try {
      const { data } = await nextServer.get<UserLocationsResponse>(`/users/${userId}/locations`);
      return data;
    } catch (error: unknown) {
      return { data: { data: [], totalItems: 0 } };
    }
  },

  async getCurrentUser(token: string | undefined): Promise<CurrentUserResponse | null> {
    if (!token) return null;
    
    try {
      const { data } = await nextServer.get<CurrentUserResponse>("/users/current", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error: unknown) {
      return null;
    }
  },
};