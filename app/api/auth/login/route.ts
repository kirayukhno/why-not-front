import { NextRequest, NextResponse } from "next/server";
import { api } from "@/lib/api/api";
import { isAxiosError } from "axios";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiRes = await api.post("/auth/login", body);

    const responseData = {
      ...apiRes.data,
      userId: apiRes.data.user?._id || apiRes.data.user?.id || apiRes.data._id || apiRes.data.id,
    };

    const res = NextResponse.json(responseData, {
      status: apiRes.status,
    });

    const setCookie = apiRes.headers["set-cookie"];

    if (setCookie) {
      const cookieArray = Array.isArray(setCookie)
        ? setCookie
        : [setCookie];

      cookieArray.forEach((cookie) => {
        console.log('Cookie being set:', cookie);
        res.headers.append("Set-Cookie", cookie);
      });
    }
    console.log('Set-Cookie header:', setCookie);
console.log('Response data:', apiRes.data);

    return res;
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
