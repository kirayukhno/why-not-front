import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://relax-map-back.onrender.com/api';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const authHeader = request.headers.get('authorization');

    const response = await fetch(`${BASE_URL}/locations`, {
      method: 'POST',
      headers: authHeader ? { Authorization: authHeader } : {},
      body: formData,
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { message: 'Server error while creating location' },
      { status: 500 }
    );
  }
}