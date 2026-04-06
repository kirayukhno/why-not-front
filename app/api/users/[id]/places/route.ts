// app/api/users/[id]/places/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api, ApiError } from "../../../api";

type Props = {
  params: Promise<{ id: string }>;
};


export async function GET(req: NextRequest, { params }: Props) {
  const cookieStore = await cookies();
  const { id } = await params;

  try {
    const searchParams = req.nextUrl.searchParams;
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "6";

    const { data, status } = await api.get(`/api/users/${id}/locations`, {
      params: { page, limit },
      headers: { cookie: cookieStore.toString() },
    });

    return NextResponse.json(data, { status });
  } catch (error) {
    const err = error as ApiError;
    console.error("Error fetching user locations:", err.response?.data ?? err.message);

    return NextResponse.json(
      { error: err.response?.data?.error ?? err.message },
      { status: err.response?.status || 500 }
    );
  }
}