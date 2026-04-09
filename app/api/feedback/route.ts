import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { api, ApiError } from '../api';

type FeedbackListResponse = {
  feedbacks?: unknown[];
  data?: {
    feedbacks?: unknown[];
  };
};

export async function GET(req: NextRequest) {
  try {
    const locationId = req.nextUrl.searchParams.get('locationId');
    const endpoint = locationId
      ? `/feedback/locations/${locationId}/feedbacks`
      : '/feedback';
    const { data, status } = await api.get<FeedbackListResponse>(endpoint, {
      params: locationId ? undefined : { page: 1, perPage: 10 },
    });
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
  const hasSessionToken =
    cookieStore.has('accessToken') || cookieStore.has('refreshToken');

  if (!hasSessionToken) {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'Потрібно увійти, щоб залишити відгук' },
      { status: 401 },
    );
  }

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

    const response = await api.post('/feedback', {
      ...payload,
      locationId,
    }, {
      headers: { Cookie: cookieHeader },
    });

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
