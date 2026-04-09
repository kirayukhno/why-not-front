import { NextRequest, NextResponse } from "next/server";
import { api} from "../../api";
import { isAxiosError } from "axios";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiRes = await api.post("/auth/register", body);

    const response = NextResponse.json(apiRes.data, { status: apiRes.status });
    const setCookie = apiRes.headers["set-cookie"];

    if (setCookie) {
      const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

      cookieArray.forEach((cookie) => {
        response.headers.append("Set-Cookie", cookie);
      });
    }

    return response;
  } catch (error) {
    if (isAxiosError(error)) {
      const backendMessage = error.response?.data?.message;
      const status = error.response?.status ?? 500;
      return NextResponse.json(
        { error: backendMessage ?? error.message },
        { status },
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
