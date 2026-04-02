import { useQuery } from "@tanstack/react-query";
import { nextServer } from "./api";

// TypeScript інтерфейс для локації
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

// Функція для отримання локацій з сервера
const fetchLocations = async (
  params: GetLocationsParams,
): Promise<Location[]> => {
  try {
    const response = await nextServer.get<GetLocationsResponse>("/locations", {
      params,
    });
    // Структура: response.data.data = { data: [...], page, limit, totalItems, totalPages }
    return response.data.data || [];
  } catch (error) {
    console.error("Failed to fetch locations:", error);
    throw error;
  }
};

// React Query хук для отримання популярних локацій
export const usePopularLocations = (limit: number = 6) => {
  return useQuery({
    queryKey: ["popularLocations", { limit }],
    queryFn: () =>
      fetchLocations({
        limit,
        page: 1,
      }),
    staleTime: 5 * 60 * 1000, // 5 хвилин
    // gcTime: 10 * 60 * 1000, // 10 хвилин (раніше називали cacheTime)
  });
};

// Хук для отримання локацій з фільтрами
export const useFilteredLocations = (params: GetLocationsParams) => {
  return useQuery({
    queryKey: ["locations", params],
    queryFn: () => fetchLocations(params),
    staleTime: 5 * 60 * 1000,
    // gcTime: 10 * 60 * 1000,
  });
};

// Хук для отримання однієї локації за ID
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
    enabled: !!id, // Запит тільки якщо є ID
    staleTime: 10 * 60 * 1000, // 10 хвилин
    // gcTime: 20 * 60 * 1000,
  });
};
