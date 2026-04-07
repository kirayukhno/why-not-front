// app/api/users/[id]/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api, ApiError } from "../../api";

type Props = {
  params: Promise<{ id: string }>;
};


export async function GET(_req: Request, { params }: Props) {
  const cookieStore = await cookies();
  const { id } = await params;

  try {

    const { data, status } = await api.get(`/users/${id}`, {
      headers: { cookie: cookieStore.toString() },
    });

    return NextResponse.json(data, { status });
  } catch (error) {
    const err = error as ApiError;
    console.error("Error fetching user by ID:", err.response?.data ?? err.message);

    return NextResponse.json(
      { error: err.response?.data?.error ?? err.message },
      { status: err.response?.status || 500 }
    );
  }
}
