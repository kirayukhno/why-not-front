// lib/api/auth.ts
import { nextServer } from "./api";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

export const getCurrentUser = async () => {
  const res = await nextServer.get(`${API_URL}/users/current`, {
    withCredentials: true,
  });
  return res.data;

};
