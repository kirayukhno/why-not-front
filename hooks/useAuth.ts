"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser } from "@/services/auth";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    retry: false,
  });
  const logout = async () => {
    queryClient.invalidateQueries({ queryKey: ["currentUser"] });
  };
  return {
    user: data,
    isAuthenticated: !!data,
    isLoading,
    isError,
    logout
  };
};