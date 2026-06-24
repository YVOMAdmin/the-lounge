import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next')
  const safeNext = next && next.startsWith('/') && !next.startsWith('//') ? next : '/community'

  let destination = `${origin}/auth/pending`
  const cookiesToApply: { name: string; value: string; options: Record<string, unknown> }[] = []

  if (code) {
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

    const { data } = await supabase.auth.exchangeCodeForSession(code)
    const user = data?.user

    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_approved')
        .eq('id', user.id)
        .single()

      // Only a code paired with an explicit `next` (the admin magic link)
      // can skip the pending gate, and only if the account is approved.
      // A plain email-confirmation code never carries `next`, so brand new
      // signups always fall through to the sign-out + pending branch below.
      if (next && profile?.is_approved) {
        destination = `${origin}${safeNext}`
      } else {
        // Confirming an email only proves ownership of the inbox — it is
        // not admin approval. Sign the session back out so the only way
        // into /community is via /auth/login, which re-checks is_approved.
        await supabase.auth.signOut()
      }
    }
  }

  const response = NextResponse.redirect(destination)
  cookiesToApply.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
  return response
}
