
import { nextServer } from './api';
import { cookies } from 'next/headers';
import { Feedback, FeedbacksResponse } from "@/types/types";

export async function getFeedbacks() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const headers: Record<string, string> = {};

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const res = await nextServer.get('/feedbacks', {
      headers,
    });

    return res.data;
  } catch (error) {
    console.error('Server API Error (getFeedbacks):', error);
    return { data: [] };
  }
}

// : Feedbacks API
// export const getFeedbacks = async (): Promise<Feedback[]> => {
//   const res = await nextServer.get<FeedbacksResponse>("/api/feedback", {
//     params: { perPage: 10 },
//   });
//   return (res.data?.feedbacks ?? []).map((f) => ({
//     ...f,
//     id: f._id,
//   }));
// };

export const getLocationFeedbacks = async (
  locationId: string,
): Promise<Feedback[]> => {
  const res = await nextServer.get<FeedbacksResponse>(
    `/api/locations/${locationId}/feedbacks`,
  );
  return (res.data?.feedbacks ?? []).map((f) => ({
    ...f,
    id: f._id,
  }));
};



export const serverUserService = {
  getCurrentUser: async () => {
    try {
      const cookieStore = await cookies();
      const cookieHeader = cookieStore.toString();


