import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { type, message } = await request.json();

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'The Lounge <hello@theloungecommunity.co.uk>',
      to: 'hello@theloungecommunity.co.uk',
      subject: `💡 New ${type} in The Suggestion Box`,
      html: `
        <p><strong>Type:</strong> ${type}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <p><a href="https://theloungecommunity.co.uk/admin">Review in Admin →</a></p>
      `,
    })
  });

  const data = await res.json();
  console.log('Resend response:', JSON.stringify(data));
  return NextResponse.json({ ok: true });
}
