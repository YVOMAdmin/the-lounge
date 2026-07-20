import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'

// Server-side counterpart to /auth/callback, for links generated via
// supabase.auth.admin.generateLink() (currently just admin-enter-platform)
// rather than a browser-initiated signInWithOtp()/signUp() call.
//
// The admin API can only ever produce a token_hash-style link, never a
// PKCE `code` — a PKCE code exchange requires a code_verifier that only
// the originating browser holds, which an admin-triggered link never has.
// Redirecting straight to Supabase's own /verify endpoint (the previous
// approach) confirms the OTP but then redirects back with the session as
// a `#access_token=` URL fragment (implicit-flow style) — fragments are
// never sent to the server, and this app's client (createBrowserClient
// from @supabase/ssr, PKCE by default) never reads one client-side either
// (no code anywhere calls setSession from window.location.hash), so the
// session was silently dropped and the visitor landed back at
// /auth/login. This route verifies the token_hash directly server-side
// via verifyOtp and sets the session cookies itself, the same way
// /auth/callback does for exchangeCodeForSession — no fragment involved.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next')
  const safeNext = next && next.startsWith('/') && !next.startsWith('//') ? next : '/community'

  let destination = `${origin}/auth/login`
  const cookiesToApply: { name: string; value: string; options: Record<string, unknown> }[] = []

  if (token_hash && type) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll(cookiesToSet) { cookiesToApply.push(...cookiesToSet) },
        },
      }
    )

    const { data } = await supabase.auth.verifyOtp({ token_hash, type })
    const user = data?.user

    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_approved')
        .eq('id', user.id)
        .single()

      if (profile?.is_approved) {
        destination = `${origin}${safeNext}`
      } else {
        await supabase.auth.signOut()
        destination = `${origin}/auth/pending`
      }
    }
  }

  const response = NextResponse.redirect(destination)
  cookiesToApply.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
  return response
}
