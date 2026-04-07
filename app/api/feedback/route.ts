import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { api, ApiError } from '../api';

export async function GET() {
  try {
    const { data, status } = await api.get('/feedback');
    return NextResponse.json(data, { status });
  } catch (error) {
    const err = error as ApiError;
    return NextResponse.json(
      { error: err.response?.data?.error ?? err.response?.data?.message ?? err.message },
      { status: err.response?.status || 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join('; ');

  try {
    const body = await req.json();
    const locationId =
      typeof body?.locationId === 'string' ? body.locationId : undefined;
    const payload = {
      description: body?.description,
      rate: body?.rate,
    };

    if (!locationId) {
      throw new Error('Location id is required');
    }

    const response = await api.post(
      `/feedback/locations/${locationId}/feedbacks`,
      payload,
      {
        headers: { Cookie: cookieHeader },
      },
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    const err = error as ApiError;
    return NextResponse.json(
      {
        error: err.response?.data?.error ?? err.response?.data?.message ?? err.message,
        message: err.response?.data?.message ?? err.response?.data?.error ?? err.message,
      },
      { status: err.response?.status || 500 },
    );
  }
}
