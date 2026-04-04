import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://relax-map-back.onrender.com/api';

type RouteContext = {
  params: Promise<{
    locationId: string;
  }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { locationId } = await context.params;
    const formData = await request.formData();
    const authHeader = request.headers.get('authorization');

    const response = await fetch(`${BASE_URL}/locations/${locationId}`, {
      method: 'PATCH',
      headers: authHeader ? { Authorization: authHeader } : {},
      body: formData,
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { message: 'Server error while updating location' },
      { status: 500 }
    );
  }
}