import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/', '/privacy', '/terms', '/support', '/contact']
const STATIC_FILE = /\.(png|jpe?g|gif|svg|webp|ico|css|js|map|txt|xml)$/i

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (STATIC_FILE.test(pathname)) {
    return NextResponse.next()
  }

  const response = NextResponse.next({ request })

  // Always wire up the cookie-syncing client, even on public pages.
  // getUser() silently refreshes an expiring access token using the
  // refresh token cookie and writes the renewed cookies onto `response`
  // via setAll. Skipping this on public pages (as the previous version
  // did, returning early before touching cookies at all) meant a
  // logged-in member browsing /support or /contact for a while could
  // come back to /community with a stale, already-expired access token
  // — which read as "logged out" even though no cookie was ever cleared.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (PUBLIC_PATHS.includes(pathname)) {
    return response
  }

  if (!user) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_approved')
    .eq('id', user.id)
    .single()

  if (!profile || !profile.is_approved) {
    return NextResponse.redirect(new URL('/auth/pending', request.url))
  }

  return response
}

export const config = {
matcher: ['/((?!_next/static|_next/image|favicon.ico|auth|api|admin).*)'],
}
