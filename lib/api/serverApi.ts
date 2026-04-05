
import { nextServer } from "./api";
import { Feedback, FeedbacksResponse } from "@/types/types";
import { cookies } from 'next/headers';

// : Feedbacks API
export const getFeedbacks = async (): Promise<Feedback[]> => {
  const res = await nextServer.get<FeedbacksResponse>("/api/feedback", {
    params: { perPage: 10 },
  });
  return (res.data?.feedbacks ?? []).map((f) => ({
    ...f,
    id: f._id,
  }));
};

export const getLocationFeedbacks = async (
  locationId: string,
): Promise<Feedback[]> => {
  const res = await nextServer.get<FeedbacksResponse>(
    `/api/locations/${locationId}/feedbacks`,
  );



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
