import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { getFounderCount, getFounderStatus } from '@/lib/founders'

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const count = await getFounderCount(supabase)

  // Only the derived status (and remaining count, once spots are low) is
  // ever sent to the browser — never the raw founder count itself.
  return NextResponse.json(getFounderStatus(count))
}
