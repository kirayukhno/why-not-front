// app/api/locations/[locationId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { api, ApiError } from "../../api";

type Params = {
  params: Promise<{
    locationId: string;
  }>;
};



export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { locationId } = await params;

    const apiRes = await api.get(`/api/locations/${locationId}`);

    return NextResponse.json(apiRes.data);
  } catch (error) {
    const err = error as ApiError;

    return NextResponse.json(
      {
        error: err.response?.data?.error ?? err.message,
      },
      {
        status: err.response?.status || 500,
      }
    );
  }
}


export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { locationId } = await params;

 
    const cookieHeader = req.headers.get("cookie") || "";

  
    const formData = await req.formData();

 
    const apiRes = await api.patch(
      `/api/locations/${locationId}`,
      formData,
      {
        headers: {
  
          Cookie: cookieHeader,
        },
      }
    );

    const res = NextResponse.json(apiRes.data);


    const setCookie = apiRes.headers["set-cookie"];
    if (setCookie) {
      const cookies = Array.isArray(setCookie)
        ? setCookie
        : [setCookie];

      cookies.forEach((cookie) => {
        res.headers.append("set-cookie", cookie);
      });
    }

    return res;
  } catch (error) {
    const err = error as ApiError;

    return NextResponse.json(
      {
        error: err.response?.data?.error ?? err.message,
      },
      {
        status: err.response?.status || 500,
      }
    );
  }
}