import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()
  const adminAuth = cookieStore.get('admin_auth')

  if (!adminAuth?.value) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email: 'hello@theloungecommunity.co.uk',
  })

  if (error || !data?.properties?.action_link) {
    return NextResponse.json({ error: 'Failed to generate link' }, { status: 500 })
  }

  return NextResponse.redirect(data.properties.action_link)
}
