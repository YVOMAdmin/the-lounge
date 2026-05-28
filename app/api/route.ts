import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const username = body.record?.username || 'Someone'
  const location = body.record?.location || 'unknown location'

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'hello@theloungecommunity.co.uk',
      to: 'paige@yourvirtualofficemanager.co.uk',
      subject: '🎉 New member request — The Lounge',
      html: `<p><strong>${username}</strong> from ${location} has requested to join The Lounge.</p><p><a href="https://theloungecommunity.co.uk/admin">Review and approve →</a></p>`
    })
  })

  return NextResponse.json({ ok: true })
}
