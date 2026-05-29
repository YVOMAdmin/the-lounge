import { NextResponse } from 'next/server';
import { ratelimit } from '@/lib/ratelimit';
import { headers } from 'next/headers';

export async function POST(request: Request) {
  const { title, date, time, description, link } = await request.json();
  const ip = (await headers()).get('x-forwarded-for') ?? 'anonymous'
const { success } = await ratelimit.limit(ip)
if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })


  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'The Lounge <hello@theloungecommunity.co.uk>',
      to: 'hello@theloungecommunity.co.uk',
      subject: '📅 New event submitted for approval',
      html: `
        <p><strong>${title}</strong></p>
        <p>${date} at ${time}</p>
        <p>${description}</p>
        ${link ? `<p>Link: <a href="${link}">${link}</a></p>` : ''}
        <p><a href="https://theloungecommunity.co.uk/admin">Review in Admin →</a></p>
      `,
    })
  });

  const data = await res.json();
  console.log('Resend response:', JSON.stringify(data));

  return NextResponse.json({ ok: true, resend: data });
}
