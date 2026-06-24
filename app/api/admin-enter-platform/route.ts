import { createClient } from '@supabase/supabase-js'
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

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email: MEMBER_EMAIL,
    options: { redirectTo: `${origin}/community` },
  })

  if (error || !data?.properties?.action_link) {
    return NextResponse.json({ error: 'Failed to generate link' }, { status: 500 })
  }

  return NextResponse.redirect(data.properties.action_link)
}
