import { NextResponse } from 'next/server';
import { ratelimit } from '@/lib/ratelimit';
import { headers } from 'next/headers';


export async function POST(request: Request) {
  const body = await request.json();
  const username = body.record?.username || 'Someone';
  const location = body.record?.location || 'unknown location';

  const ip = (await headers()).get('x-forwarded-for') ?? 'anonymous'
  const { success } = await ratelimit.limit(ip)
  if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'hello@theloungecommunity.co.uk',
      to: 'hello@theloungecommunity.co.uk',
      subject: '🎉 New member request – The Lounge',
      html: `<p><strong>${username}</strong> from ${location} has requested to join The Lounge.</p>`,
    })
  });

  return NextResponse.json({ ok: true });
}
