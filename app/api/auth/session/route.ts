import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "../../api";
import { isAxiosError } from "axios";

const mergeCookieHeader = (cookieHeader: string, setCookieHeader?: string | string[]) => {
  const cookieMap = new Map<string, string>();

  cookieHeader
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean)
    .forEach((cookie) => {
      const separatorIndex = cookie.indexOf("=");

      if (separatorIndex === -1) {
        return;
      }

      const name = cookie.slice(0, separatorIndex).trim();
      const value = cookie.slice(separatorIndex + 1).trim();
      cookieMap.set(name, value);
    });

  const cookieArray = Array.isArray(setCookieHeader)
    ? setCookieHeader
    : setCookieHeader
      ? [setCookieHeader]
      : [];

  cookieArray.forEach((cookie) => {
    const [cookiePair] = cookie.split(";");

    if (!cookiePair) {
      return;
    }

    const separatorIndex = cookiePair.indexOf("=");

    if (separatorIndex === -1) {
      return;
    }

    const name = cookiePair.slice(0, separatorIndex).trim();
    const value = cookiePair.slice(separatorIndex + 1).trim();
    cookieMap.set(name, value);
  });

  return Array.from(cookieMap.entries())
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");
};

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  if (!accessToken && !refreshToken) {
    return NextResponse.json(
      { authenticated: false, user: null },
      { status: 200 },
    );
  }

  const getCurrentUser = async (cookieValue: string) => {
    const response = await api.get("/users/current", {
      headers: {
        Cookie: cookieValue,
      },
    });

    const user = response.data?.data ?? response.data ?? null;

    return {
      authenticated: Boolean(user),
      user,
    };
  };

  try {
    return NextResponse.json(await getCurrentUser(cookieHeader), {
      status: 200,
    });
  } catch (error) {
    if (!refreshToken) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 200 },
      );
    }

    if (!isAxiosError(error) || error.response?.status !== 401) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 200 },
      );
    }

    try {
      const refreshResponse = await api.post(
        "/auth/refresh",
        {},
        {
          headers: {
            Cookie: cookieHeader,
          },
        },
      );

      const setCookieHeader = refreshResponse.headers["set-cookie"];
      const refreshedCookieHeader = mergeCookieHeader(cookieHeader, setCookieHeader);
      const response = NextResponse.json(
        await getCurrentUser(refreshedCookieHeader),
        { status: 200 },
      );

      if (setCookieHeader) {
        const cookieArray = Array.isArray(setCookieHeader)
          ? setCookieHeader
          : [setCookieHeader];

        cookieArray.forEach((cookie) => {
          response.headers.append("Set-Cookie", cookie);
        });
      }

      return response;
    } catch {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 200 },
      );
    }
  }
}
