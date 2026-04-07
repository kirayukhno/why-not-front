// lib/api/auth.ts
import { nextServer } from "./api";

export const getCurrentUser = async () => {
  const res = await nextServer.get("/api/users/me", {
    withCredentials: true,
  });
  return res.data?.data ?? res.data ?? null;
};
