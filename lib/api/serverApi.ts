// lib/api/serverApi.ts
import { cookies } from "next/headers";
import { nextServer } from "./api";

const BASE_URL = "https://relax-map-back.onrender.com/api";


export const getLocationById = async (locationId: string) => {
  const response = await fetch(`${BASE_URL}/locations/${locationId}`, {
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Не вдалося отримати локацію");
  }

  return data;
};

export const serverUserService = {
  getCurrentUser: async () => {
    try {
      const cookieStore = await cookies();
      const cookieHeader = cookieStore.toString();

      const res = await nextServer.get("/users/current", {
        headers: {
          Cookie: cookieHeader,
        },
      });
      return res.data;
    } catch (error) {
      console.error("Server API Error (getCurrentUser):", error);
      return null;
    }
  },

  getUserById: async (userId: string) => {
    try {
      const res = await nextServer.get(`/users/${userId}`);
      return res.data;
    } catch (error) {
      console.error(`Server API Error (getUserById ${userId}):`, error);
      return null;
    }
  },

  getUserLocations: async (userId: string) => {
    try {
      const res = await nextServer.get(`/users/${userId}/locations`);
      return res.data;
    } catch (error) {
      console.error(`Server API Error (getUserLocations):`, error);
      return { data: { data: [], totalItems: 0 } };
    }
  },
};