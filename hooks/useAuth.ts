"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser } from "../lib/api/auth";
import { User } from "../types/types";

export const useAuth = () => {
  const queryClient = useQueryClient();
  
  const { data, isLoading, isError } = useQuery<User | null>({
  queryKey: ["currentUser"],
  queryFn: getCurrentUser,
  retry: false,
});
  
const logout = async () => {
    queryClient.setQueryData(["currentUser"], null);
  };
  
  return {
    user: data ?? null,
    isAuthenticated: !!data,
    isLoading,
    isError,
    logout
  };
};