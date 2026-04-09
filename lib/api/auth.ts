import { nextServer } from "./api";
import { AxiosError } from "axios";
import type { User } from "@/types/types";

type SessionResponse = {
  authenticated: boolean;
  user: User | null;
};

export const getSession = async (): Promise<SessionResponse> => {
  const res = await nextServer.get("/api/auth/session", {
    withCredentials: true,
  });

  return {
    authenticated: Boolean(res.data?.authenticated),
    user: res.data?.user ?? null,
  };
};

export const getCurrentUser = async () => {
  try {
    const session = await getSession();
    return session.user;
  } catch (error) {
    const err = error as AxiosError<{ error?: string }>;

    if (err.response?.status === 401) {
      return null;
    }

    throw error;
  }
};
