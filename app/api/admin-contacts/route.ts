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

  const { data, error } = await supabase
    .from('useful_contacts')
    .select('*')
    .order('position', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(req: Request) {
  const cookieStore = await cookies()
  const adminAuth = cookieStore.get('admin_auth')
  if (!adminAuth?.value) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { action } = body

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  if (action === 'create') {
    const { name, role, bio, photo_url, email, position } = body
    if (!name?.trim() || !role?.trim() || !email?.trim()) {
      return NextResponse.json({ error: 'Name, role and email are required' }, { status: 400 })
    }
    const { error } = await supabase.from('useful_contacts').insert({
      name: name.trim(),
      role: role.trim(),
      bio: bio?.trim() || null,
      photo_url: photo_url?.trim() || null,
      email: email.trim(),
      position: position ?? 0,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  if (action === 'update') {
    const { id, name, role, bio, photo_url, email, position } = body
    if (!id || !name?.trim() || !role?.trim() || !email?.trim()) {
      return NextResponse.json({ error: 'Name, role and email are required' }, { status: 400 })
    }
    const { error } = await supabase.from('useful_contacts').update({
      name: name.trim(),
      role: role.trim(),
      bio: bio?.trim() || null,
      photo_url: photo_url?.trim() || null,
      email: email.trim(),
      position: position ?? 0,
    }).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  if (action === 'delete') {
    const { id } = body
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    const { error } = await supabase.from('useful_contacts').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
