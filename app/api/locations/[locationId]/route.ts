// app/api/locations/[locationId]/route.ts


import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { api, ApiError } from "../../api";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

type RouteContext = {

type Params = {

  params: Promise<{
    locationId: string;
  }>;
};


export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    if (!BACKEND_URL) {
      return NextResponse.json(
        { message: 'NEXT_PUBLIC_API_URL is not defined' },
        { status: 500 }
      );
    }

    const { locationId } = await context.params;
    const formData = await req.formData();

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    const headers: HeadersInit = {};

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${BACKEND_URL}/api/locations/${locationId}`, {
      method: 'PATCH',
      headers,
      body: formData,
    });

    const rawText = await response.text();

    let data: unknown;

    try {
      data = JSON.parse(rawText);
    } catch {
      data = { message: rawText || 'Invalid backend response' };
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('PATCH /api/locations/[locationId] route error:', error);

    return NextResponse.json(
      {
        message: 'Не вдалося оновити локацію',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
=======


// export async function GET(_req: NextRequest, { params }: Params) {
//   try {
//     const { locationId } = await params;

//     const apiRes = await api.get(`/api/locations/${locationId}`);

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
// }


// export async function PATCH(req: NextRequest, { params }: Params) {
//   try {
//     const { locationId } = await params;

 
//     const cookieHeader = req.headers.get("cookie") || "";

  
//     const formData = await req.formData();

 
//     const apiRes = await api.patch(
//       `/api/locations/${locationId}`,
//       formData,
//       {
//         headers: {
  
//           Cookie: cookieHeader,
//         },
//       }
//     );

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