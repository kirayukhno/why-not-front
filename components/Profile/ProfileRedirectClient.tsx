"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function ProfileRedirectClient() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated || !user?.id) {
      router.replace("/sign-in");
      return;
    }

    router.replace(`/profile/${user.id}`);
  }, [isAuthenticated, isLoading, router, user?.id]);

  return null;
}
