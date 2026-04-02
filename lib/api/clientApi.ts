import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL + "/api";

const clientApi = axios.create({
  baseURL,
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
