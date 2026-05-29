import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const token = req.cookies.getAll()
    .find(c => c.name.includes('auth-token'))?.value

  if (!token) {
    return NextResponse.next()
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/profiles?select=is_approved`,
      {
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          'Authorization': `Bearer ${token}`,
        }
      }
    )
    const data = await res.json()
    if (data?.[0]?.is_approved === false) {
      return NextResponse.redirect(new URL('/pending-approval', req.url))
    }
  } catch {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/'],
}
