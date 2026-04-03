import { useQuery } from "@tanstack/react-query";
import { nextServer } from "./api";


export type CreateLocationPayload = FormData;

export const createLocation = async (formData: CreateLocationPayload) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const response = await fetch(
    "https://relax-map-back.onrender.com/api/locations",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Не вдалося створити локацію");
  }

  return data;
};


export const getLocationById = async (locationId: string) => {
  const response = await fetch(
    `https://relax-map-back.onrender.com/api/locations/${locationId}`,
    {
      cache: "no-store",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Не вдалося отримати локацію");
  }

  return data;
};


export const updateLocation = async (
  locationId: string,
  formData: FormData
) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const response = await fetch(
    `https://relax-map-back.onrender.com/api/locations/${locationId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Не вдалося оновити локацію");
  }

  return data;
};

export interface Location {
  _id: string;
  name: string;
  description: string;
  image: string;
  rate: number;
  locationType: string;
  region: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  ownerId: string;
  feedbacksId: string[];
}

interface GetLocationsParams {
  page?: number;
  limit?: number;
  region?: string;
  type?: string;
  search?: string;
}

interface GetLocationsResponse {
  status: number;
  message: string;
  data: Location[];
}


const fetchLocations = async (
  params: GetLocationsParams
): Promise<Location[]> => {
  try {
    const response = await nextServer.get<GetLocationsResponse>("/locations", {
      params,
    });
    return response.data.data || [];
  } catch (error) {
    console.error("Failed to fetch locations:", error);
    throw error;
  }
};


export const usePopularLocations = (limit: number = 6) => {
  return useQuery({
    queryKey: ["popularLocations", { limit }],
    queryFn: () =>
      fetchLocations({
        limit,
        page: 1,
      }),
    staleTime: 5 * 60 * 1000,
  });
};

export const useFilteredLocations = (params: GetLocationsParams) => {
  return useQuery({
    queryKey: ["locations", params],
    queryFn: () => fetchLocations(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useLocationById = (id: string) => {
  return useQuery({
    queryKey: ["location", id],
    queryFn: async () => {
      const response = await nextServer.get<{
        status: number;
        message: string;
        data: Location;
      }>(`/locations/${id}`);
      return response.data.data;
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
};