"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser } from "../lib/api/auth";
import { nextServer } from "../lib/api/api";
import { User } from "../types/types";

export const useAuth = () => {
  const queryClient = useQueryClient();
  
  const { data, isLoading, isError } = useQuery<User | null>({
  queryKey: ["currentUser"],
  queryFn: getCurrentUser,
  retry: false,
});

  const normalizedUser = data
    ? {
        ...data,
        id: data.id || data._id || "",
      }
    : null;
  
const logout = async () => {
    await nextServer.post("/api/auth/logout");
    queryClient.setQueryData(["currentUser"], null);
    await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
  };
  
  return {
    user: normalizedUser,
    isAuthenticated: !!normalizedUser,
    isLoading,
    isError,
    logout
  };
};
