import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_approved')
      .eq('id', session.user.id)
      .single()

    if (!profile?.is_approved) {
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL('/pending-approval', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/'],
}
