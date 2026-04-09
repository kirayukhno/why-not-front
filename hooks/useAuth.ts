"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSession } from "../lib/api/auth";
import { nextServer } from "../lib/api/api";
import { User } from "../types/types";

export const useAuth = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<{
    authenticated: boolean;
    user: User | null;
  }>({
    queryKey: ["authSession"],
    queryFn: getSession,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const normalizedUser = data?.user
    ? {
        ...data.user,
        id: data.user.id || data.user._id || "",
      }
    : null;

  const logout = async () => {
    await nextServer.post("/api/auth/logout");
    queryClient.setQueryData(["authSession"], {
      authenticated: false,
      user: null,
    });
    await queryClient.invalidateQueries({ queryKey: ["authSession"] });
  };

  return {
    user: normalizedUser,
    isAuthenticated: Boolean(data?.authenticated && normalizedUser),
    isLoading,
    isError,
    logout,
  };
};
