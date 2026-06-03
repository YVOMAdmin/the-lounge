import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { user_id, type, post_id, from_user_id, from_username, message } = await req.json()

  if (user_id === from_user_id) return NextResponse.json({ skipped: true })

  const { error } = await supabase
    .from('notifications')
    .insert({ user_id, type, post_id, from_user_id, from_username, message })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
