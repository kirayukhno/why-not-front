// app/api/auth/logout/route.ts

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "../../api";

export async function POST() {
  const cookieStore = await cookies();
  try {
    await api.post(
      "/auth/logout",
      {},
      {
        headers: {
          Cookie: cookieStore.toString(),
        },
      },
    );
  } catch (error) {
    console.error("Logout request failed:", error);
  }

  const response = NextResponse.json({
    message: "Logged out successfully",
  });

  const expiredCookie = {
    value: "",
    path: "/",
    expires: new Date(0),
    maxAge: 0,
  };

  response.cookies.set("accessToken", expiredCookie.value, expiredCookie);
  response.cookies.set("refreshToken", expiredCookie.value, expiredCookie);
  response.cookies.set("sessionId", expiredCookie.value, expiredCookie);

  return response;
}
