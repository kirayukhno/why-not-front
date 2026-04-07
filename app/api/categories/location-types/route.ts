import { NextResponse } from "next/server";
import { api, ApiError } from "../../api";

export async function GET() {
  try {
    const apiRes = await api.get("/categories/location-types");

    return NextResponse.json(apiRes.data);
  } catch (error) {
    const err = error as ApiError;

    return NextResponse.json(
      {
        error: err.response?.data?.error ?? err.message,
      },
      {
        status: err.response?.status || 500,
      },
    );
  }
}
