import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    await supabase.auth.exchangeCodeForSession(code)
    // Confirming an email only proves ownership of the inbox — it is not
    // admin approval. Always sign the session out here so the only way
    // into /community is via /auth/login, which re-checks is_approved.
    await supabase.auth.signOut()
  }

  return NextResponse.redirect(`${origin}/auth/pending`)
}
