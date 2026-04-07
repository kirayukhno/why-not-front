import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { api, ApiError } from '../../api';

type RouteContext = {
  params: Promise<{ locationId: string }>;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const rebuildFormData = (incomingFormData: FormData) => {
  const outgoingFormData = new FormData();

  for (const [key, value] of incomingFormData.entries()) {
    if (value instanceof File) {
      outgoingFormData.append(key, value, value.name);
    } else {
      outgoingFormData.append(key, String(value));
    }
  }

  return outgoingFormData;
};

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { locationId } = await context.params;
    const { data, status } = await api.get(`/locations/${locationId}`);
    return NextResponse.json(data, { status });
  } catch (error) {
    const err = error as ApiError;
    console.error('GET /locations/[id] proxy error:', err.response?.status, err.response?.data);
    return NextResponse.json(
      {
        error: err.response?.data?.error ?? err.response?.data?.message ?? err.message,
        message: err.response?.data?.message ?? err.response?.data?.error ?? err.message,
      },
      { status: err.response?.status || 500 },
    );
  }
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join('; ');

  try {
    const { locationId } = await context.params;
    if (!API_BASE_URL) {
      throw new Error('NEXT_PUBLIC_API_URL is not configured');
    }

    const formData = rebuildFormData(await req.formData());
    const response = await fetch(`${API_BASE_URL}/locations/${locationId}`, {
      method: 'PATCH',
      headers: {
        Cookie: cookieHeader,
      },
      body: formData,
    });
    const data = await response.json().catch(() => null);
    const nextResponse = NextResponse.json(data, { status: response.status });
    const setCookie = response.headers.get('set-cookie');

    if (setCookie) {
      nextResponse.headers.append('Set-Cookie', setCookie);
    }

    return nextResponse;
  } catch (error) {
    const err = error as ApiError;
    console.error('PATCH /locations/[id] proxy error:', err.response?.status, err.response?.data);
    return NextResponse.json(
      {
        error: err.response?.data?.error ?? err.response?.data?.message ?? err.message,
        message: err.response?.data?.message ?? err.response?.data?.error ?? err.message,
      },
      { status: err.response?.status || 500 },
    );
  }
}
