import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const auth = cookieStore.get('admin_auth');
  if (auth?.value === 'true') return NextResponse.json({ ok: true });
  return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
}

export async function POST(request: Request) {
  const { password } = await request.json();
  if (password === process.env.ADMIN_PASSWORD) {
    const response = NextResponse.json({ ok: true });
    response.cookies.set('admin_auth', 'true', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 8,
    });
    return response;
  }
  return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
}
