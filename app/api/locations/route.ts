// app/api/locations/route.ts

import { NextRequest, NextResponse } from "next/server";
import { api, ApiError } from "../api";



export async function GET(req: NextRequest) {
  try {
   
    const search = req.nextUrl.searchParams.toString();

  
    const url = search
      ? `/api/locations?${search}`
      : `/api/locations`;

  
    const apiRes = await api.get(url);


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
};



export async function POST(req: NextRequest) {
  try {

    const cookieHeader = req.headers.get("cookie") || "";


    const formData = await req.formData();


    const apiRes = await api.post("/api/locations", formData, {
      headers: {
        cookie: cookieHeader,
 
      },
    });

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