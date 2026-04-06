import { nextServer } from './api';
import { cookies } from 'next/headers';

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