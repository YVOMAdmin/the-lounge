import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

async function verifyTOTP(secret: string, token: string): Promise<boolean> {
  const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = '';
  for (const char of secret.toUpperCase()) {
    const val = base32Chars.indexOf(char);
    if (val === -1) continue;
    bits += val.toString(2).padStart(5, '0');
  }
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.slice(i, i + 8), 2));
  }
  const key = new Uint8Array(bytes);
  const timeStep = Math.floor(Date.now() / 1000 / 30);

  async function hotp(counter: number): Promise<string> {
    const data = new Uint8Array(8);
    let c = counter;
    for (let i = 7; i >= 0; i--) { data[i] = c & 0xff; c >>= 8; }
    const cryptoKey = await crypto.subtle.importKey('raw', key, { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']);
    const sig = await crypto.subtle.sign('HMAC', cryptoKey, data);
    const arr = new Uint8Array(sig);
    const offset = arr[19] & 0xf;
    const code = ((arr[offset] & 0x7f) << 24 | arr[offset+1] << 16 | arr[offset+2] << 8 | arr[offset+3]) % 1000000;
    return code.toString().padStart(6, '0');
  }

  return Promise.all([hotp(timeStep - 1), hotp(timeStep), hotp(timeStep + 1)])
    .then(codes => codes.includes(token));
}

export async function GET() {
  const cookieStore = await cookies();
  const auth = cookieStore.get('admin_auth');
  if (auth?.value === 'true') return NextResponse.json({ ok: true });
  return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
}

export async function POST(request: Request) {
  const { password, totp } = await request.json();
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }
  if (!totp) {
    return NextResponse.json({ error: 'TOTP code required' }, { status: 401 });
  }
  const valid = await verifyTOTP(process.env.ADMIN_TOTP_SECRET!, totp);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid code' }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set('admin_auth', 'true', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 8,
  });
  return response;
}
