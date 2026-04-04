import { NextRequest, NextResponse } from "next/server";
import { nextServer } from "../../api";
import { cookies } from "next/headers";
import { parse } from "cookie";
import { isAxiosError } from "axios";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiRes = await nextServer.post("/auth/register", body);

    const cookieStore = await cookies();
    const setCookie = apiRes.headers["set-cookie"];

    if (setCookie) {
      const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

      for (const cookieStr of cookieArray) {
        const parsed = parse(cookieStr);
        const options = {
          expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
          path: parsed.Path,
          maxAge: Number(parsed["Max-Age"]),
        };

        if (parsed.accessToken)
          cookieStore.set("accessToken", parsed.accessToken, options);
        if (parsed.refreshToken)
          cookieStore.set("refreshToken", parsed.refreshToken, options);
      }

      return NextResponse.json(apiRes.data, { status: apiRes.status });
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  } catch (error) {
    if (isAxiosError(error)) {
      const backendMessage = error.response?.data?.message;
      const status = error.response?.status ?? 500;
      return NextResponse.json(
        { error: backendMessage ?? error.message },
        { status },
      );
    }
    console.log("Unknown error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
