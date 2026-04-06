// app/api/auth/logout/route.ts

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "../../api";

export async function POST() {

  const cookieStore = await cookies();


  await api.post(
    "/auth/logout",
    {}, // body пустой
    {
      headers: {

        Cookie: cookieStore.toString(),
      },
    }
  );

  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  cookieStore.delete("sessionId");

  return NextResponse.json({
    message: "Logged out successfully",
  });
}