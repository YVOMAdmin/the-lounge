import { createClient } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { ADMIN_EMAIL } from '@/lib/admin'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const adminAuth = cookieStore.get('admin_auth')

  if (!adminAuth?.value) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Admin email not configured' }, { status: 500 })
  }

  const { origin } = new URL(request.url)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email: ADMIN_EMAIL,
    options: { redirectTo: `${origin}/community` },
  })

  if (error || !data?.properties?.hashed_token) {
    return NextResponse.json({ error: 'Failed to generate link' }, { status: 500 })
  }

  // Verify server-side via /auth/confirm rather than redirecting to
  // Supabase's own action_link — see that route for why (the action_link
  // comes back as a URL fragment this PKCE-flow client never reads).
  const confirmUrl = new URL('/auth/confirm', origin)
  confirmUrl.searchParams.set('token_hash', data.properties.hashed_token)
  confirmUrl.searchParams.set('type', 'magiclink')
  confirmUrl.searchParams.set('next', '/community')

  return NextResponse.redirect(confirmUrl)
}
