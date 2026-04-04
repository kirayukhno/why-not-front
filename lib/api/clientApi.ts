import axios from "axios";
import { nextServer } from "./api";

const baseURL = process.env.NEXT_PUBLIC_API_URL + "/api";

const clientApi = axios.create({
  baseURL,
  withCredentials: true,
});

const nextClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL + "/api",
  withCredentials: true,
});

export interface FetchLocationsParams {
  page?: number;
  limit?: number;
  search?: string;
  region?: string;
  type?: string;
  sort?: string;
}

export const fetchLocations = async (params: FetchLocationsParams) => {
  const response = await clientApi.get("/locations", { params });
  return response.data.data;
};

export const fetchRegions = async () => {
  const response = await clientApi.get("/categories/regions");
  return response.data.data;
};

export const fetchLocationTypes = async () => {
  const response = await clientApi.get("/categories/types");
  return response.data.data;
};

export default clientApi;

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

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const register = async (data: RegisterData) => {
  try {
    const res = await nextClient.post("/auth/register", data);
    return res.data;
  } catch (error) {
    console.error("Client API Error (register):", error);
    throw error;
  }
};

export const login = async (data: LoginData) => {
  try {
    const res = await nextClient.post("/auth/login", data);
    return res.data;
  } catch (error) {
    console.error("Client API Error (login):", error);
    throw error;
  }
};
