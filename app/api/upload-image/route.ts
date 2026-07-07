import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { ratelimit } from '@/lib/ratelimit'
import { headers } from 'next/headers'
import { randomUUID } from 'crypto'

const BUCKET = 'post-images'
const MAX_FILES = 4
const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

let bucketReady: Promise<void> | null = null
function ensureBucket() {
  if (!bucketReady) {
    bucketReady = (async () => {
      const { data } = await supabase.storage.getBucket(BUCKET)
      if (!data) {
        await supabase.storage.createBucket(BUCKET, { public: true, fileSizeLimit: MAX_FILE_SIZE })
      }
    })()
  }
  return bucketReady
}

export async function POST(req: NextRequest) {
  const ip = (await headers()).get('x-forwarded-for') ?? 'anonymous'
  const { success } = await ratelimit.limit(ip)
  if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

  const formData = await req.formData()
  const files = formData.getAll('images').filter((f): f is File => f instanceof File)

  if (files.length === 0) {
    return NextResponse.json({ error: 'No images provided' }, { status: 400 })
  }
  if (files.length > MAX_FILES) {
    return NextResponse.json({ error: `You can only upload up to ${MAX_FILES} images` }, { status: 400 })
  }
  for (const file of files) {
    if (!ALLOWED_TYPES[file.type]) {
      return NextResponse.json({ error: 'Only JPG, PNG, GIF and WEBP images are allowed' }, { status: 400 })
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Each image must be under 5MB' }, { status: 400 })
    }
  }

  try {
    await ensureBucket()

    const urls: string[] = []
    for (const file of files) {
      const ext = ALLOWED_TYPES[file.type]
      const path = `${randomUUID()}.${ext}`
      const buffer = Buffer.from(await file.arrayBuffer())
      const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
        contentType: file.type,
        upsert: false,
      })
      if (error) throw error
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
      urls.push(data.publicUrl)
    }

    return NextResponse.json({ urls })
  } catch (error) {
    console.error('Image upload error:', error)
    return NextResponse.json({ error: 'Failed to upload images' }, { status: 500 })
  }
}
