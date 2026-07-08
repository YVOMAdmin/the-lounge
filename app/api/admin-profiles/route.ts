import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { FOUNDER_LIMIT, getFounderCount } from '@/lib/founders'

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

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return NextResponse.json({ data })
}
export async function POST(req: Request) {
  const cookieStore = await cookies()
  const adminAuth = cookieStore.get('admin_auth')

  if (!adminAuth?.value) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { userId } = await req.json()

  // Founder status is decided at approval time, not at signup — only
  // approved members count toward the founder cap (see FOUNDER_LIMIT).
  // signed_up_as_member is a frozen snapshot of the original signup
  // choice (see app/auth/signup/page.tsx) — free-tier signups are never
  // eligible, even while slots remain open, and this doesn't change if
  // they later upgrade via the Upgrade Membership button.
  const { data: signupProfile } = await supabase
    .from('profiles')
    .select('signed_up_as_member, username, email')
    .eq('id', userId)
    .single()
  const founderCount = await getFounderCount(supabase)
  const isFounder = !!signupProfile?.signed_up_as_member && founderCount < FOUNDER_LIMIT

  const { error } = await supabase
    .from('profiles')
    .update({ is_approved: true, is_founder: isFounder })
    .eq('id', userId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Returned so the admin panel can send the welcome email without
  // needing its own (anon-key, no-session) read of another member's
  // profile — profiles.email is not readable by anon/authenticated,
  // only via this service-role route.
  return NextResponse.json({ success: true, username: signupProfile?.username, email: signupProfile?.email })
}
