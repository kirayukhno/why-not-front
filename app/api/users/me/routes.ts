// app/api/users/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api, ApiError } from "../../api";


export async function GET() {
  const cookieStore = await cookies();

  try {
    const { data, status } = await api.get("/api/users/current", {
      headers: { cookie: cookieStore.toString() },
    });

    return NextResponse.json(data, { status });
  } catch (error) {
    const err = error as ApiError;
    console.error("Error fetching current user:", err.response?.data ?? err.message);

    return NextResponse.json(
      { error: err.response?.data?.error ?? err.message },
      { status: err.response?.status || 500 }
    );
  }
}


export async function PATCH(req: NextRequest) {
  const cookieStore = await cookies();
  const body = await req.json();

  try {
    const { data, status, headers } = await api.patch("/api/users/me", body, {
      headers: { cookie: cookieStore.toString() },
    });

    const res = NextResponse.json(data, { status });


    const setCookie = headers["set-cookie"];
    if (setCookie) {
      const cookiesArr = Array.isArray(setCookie) ? setCookie : [setCookie];
      cookiesArr.forEach((c) => res.headers.append("set-cookie", c));
    }

    return res;
  } catch (error) {
    const err = error as ApiError;
    console.error("Error updating user profile:", err.response?.data ?? err.message);

    return NextResponse.json(
      { error: err.response?.data?.error ?? err.message },
      { status: err.response?.status || 500 }
    );
  }
}