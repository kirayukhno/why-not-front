import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

type RouteContext = {
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
    );
  }
}