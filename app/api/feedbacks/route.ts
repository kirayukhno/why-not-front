import { NextResponse } from "next/server";
import { isAxiosError } from "axios";
import { api} from '../api';

export async function GET() {
  try {
    const apiRes = await api.get("/api/feedback");
    return NextResponse.json(apiRes.data, { status: apiRes.status });
  } catch (error) {
    if (isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.message ?? error.message },
        { status: error.response?.status ?? 500 },
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
