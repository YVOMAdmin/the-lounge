import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'

const MEMBER_EMAIL = 'hello@theloungecommunity.co.uk'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const adminAuth = cookieStore.get('admin_auth')

  if (!adminAuth?.value) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { origin } = new URL(request.url)

  // The Admin API has no "create a session for this user" call, so a
  // magic link is still the underlying mechanism — but we never send the
  // browser through Supabase's hosted verify/redirect URL (which is what
  // depended on the Redirect URLs allowlist and kept breaking). Instead we
  // generate the link purely to get its token_hash, verify that OTP
  // server-to-server, and write the resulting session into cookies
  // ourselves before redirecting.
  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
    type: 'magiclink',
    email: MEMBER_EMAIL,
  })

  const tokenHash = linkData?.properties?.hashed_token

  if (linkError || !tokenHash) {
    return NextResponse.json({ error: 'Failed to generate session token' }, { status: 500 })
  }

  const cookiesToApply: { name: string; value: string; options: Record<string, unknown> }[] = []

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

  const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
    type: 'email',
    token_hash: tokenHash,
    email: MEMBER_EMAIL,
  })

  if (verifyError || !verifyData?.session) {
    return NextResponse.json({ error: 'Failed to verify session token' }, { status: 500 })
  }

  const response = NextResponse.redirect(`${origin}/community`)
  cookiesToApply.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
  return response
}
