// app/api/locations/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: NextRequest) {
  try {
    console.log('POST /api/locations called');
    console.log('BACKEND_URL =', BACKEND_URL);

    if (!BACKEND_URL) {
      return NextResponse.json(
        { message: 'NEXT_PUBLIC_API_URL is not defined' },
        { status: 500 }
      );
    }

    const formData = await req.formData();

    for (const [key, value] of formData.entries()) {
      console.log('formData entry:', key, value);
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    console.log('accessToken exists =', Boolean(accessToken));

    const headers: HeadersInit = {};

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${BACKEND_URL}/api/locations`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const rawText = await response.text();

    console.log('backend status =', response.status);
    console.log('backend response =', rawText);

    let data: unknown;

    try {
      data = JSON.parse(rawText);
    } catch {
      data = { message: rawText || 'Invalid backend response' };
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('POST /api/locations route error:', error);

    return NextResponse.json(
      {
        message: 'Не вдалося створити локацію',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
=======


// import { NextRequest, NextResponse } from "next/server";
// import { api, ApiError } from "../api";



// export async function GET(req: NextRequest) {
//   try {
   
//     const search = req.nextUrl.searchParams.toString();

  
//     const url = search
//       ? `/api/locations?${search}`
//       : `/api/locations`;

  
//     const apiRes = await api.get(url);


//     return NextResponse.json(apiRes.data);
//   } catch (error) {
//     const err = error as ApiError;

//     return NextResponse.json(
//       {
//         error: err.response?.data?.error ?? err.message,
//       },
//       {
//         status: err.response?.status || 500,
//       }
//     );
//   }
// };



// export async function POST(req: NextRequest) {
//   try {

//     const cookieHeader = req.headers.get("cookie") || "";


//     const formData = await req.formData();


//     const apiRes = await api.post("/api/locations", formData, {
//       headers: {
//         cookie: cookieHeader,
 
//       },
//     });

//     const res = NextResponse.json(apiRes.data);

 
//     const setCookie = apiRes.headers["set-cookie"];
//     if (setCookie) {
//       const cookies = Array.isArray(setCookie)
//         ? setCookie
//         : [setCookie];

//       cookies.forEach((cookie) => {
//         res.headers.append("set-cookie", cookie);
//       });
//     }

//     return res;
//   } catch (error) {
//     const err = error as ApiError;

//     return NextResponse.json(
//       {
//         error: err.response?.data?.error ?? err.message,
//       },
//       {
//         status: err.response?.status || 500,
//       }

    );
  }
}