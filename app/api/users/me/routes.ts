// app/api/users/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api, APIError } from "../../api";

export async function GET() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll()
    .map(current => `${current.name}=${current.value}`)
    .join('; ');

  try {
    const { data, status } = await api.get("/users/current", { 
      headers: { Cookie: cookieHeader },
    });
    return NextResponse.json(data, { status });
  } catch (error) {

    const err = error as APIError;
    console.error("Error fetching current user:", err.response?.data ?? err.message);



    return NextResponse.json(
      { error: err.response?.data?.error ?? err.message },
      { status: err.response?.status || 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll()
    .map(c => `${c.name}=${c.value}`)
    .join('; ');

  const body = await req.json();
  try {
    const { data, status, headers } = await api.patch("/users/me", body, { // ← без /api
      headers: { Cookie: cookieHeader },
    });
    const res = NextResponse.json(data, { status });
    const setCookie = headers["set-cookie"];
    if (setCookie) {
      const cookiesArr = Array.isArray(setCookie) ? setCookie : [setCookie];
      cookiesArr.forEach((current) => res.headers.append("Set-Cookie", current));
    }
    return res;
  } catch (error) {

    const err = error as APIError;
    console.error("Error updating user profile:", err.response?.data ?? err.message);



    return NextResponse.json(
      { error: err.response?.data?.error ?? err.message },
      { status: err.response?.status || 500 }
    );
  }
}