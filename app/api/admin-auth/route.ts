import { NextResponse } from 'next/server';

const ADMIN_CODE = 'Heavie2026';

export async function POST(request: Request): Promise<NextResponse> {
  const { code } = await request.json();

  if (code === ADMIN_CODE) {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false, error: 'Code incorrect' }, { status: 401 });
}