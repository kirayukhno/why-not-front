// app/api/auth/session/route.ts

// app/api/auth/session/route.ts

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "../../api";
import { parse } from "cookie";

export async function GET() {

  const cookieStore = await cookies();


  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;


  if (accessToken) {
    return NextResponse.json({ success: true });
  }

  
  if (refreshToken) {
  
    const apiRes = await api.post(
      "/auth/refresh",
      {},
      {

        headers: {
          Cookie: cookieStore.toString(),
        },
      }
    );

  
    const setCookie = apiRes.headers["set-cookie"];

    if (setCookie) {
      const cookieArray = Array.isArray(setCookie)
        ? setCookie
        : [setCookie];

  
      for (const cookieStr of cookieArray) {
        const parsed = parse(cookieStr);

        const options = {
          path: "/",
          maxAge: parsed["Max-Age"]
            ? Number(parsed["Max-Age"])
            : undefined,
        };

  
        if (parsed.accessToken) {
          cookieStore.set("accessToken", parsed.accessToken, options);
        }

        if (parsed.refreshToken) {
          cookieStore.set("refreshToken", parsed.refreshToken, options);
        }

        if (parsed.sessionId) {
          cookieStore.set("sessionId", parsed.sessionId, options);
        }
      }

      return NextResponse.json({ success: true });
    }
  }

 
  return NextResponse.json({ success: false });
}