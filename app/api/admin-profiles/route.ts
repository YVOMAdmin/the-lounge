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
  // approved members count toward the 100-founder cap.
  const founderCount = await getFounderCount(supabase)
  const isFounder = founderCount < FOUNDER_LIMIT

  const { error } = await supabase
    .from('profiles')
    .update({ is_approved: true, is_founder: isFounder })
    .eq('id', userId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
