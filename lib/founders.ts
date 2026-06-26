import type { SupabaseClient } from '@supabase/supabase-js'

export const FOUNDER_LIMIT = 100
const LOW_SPOTS_THRESHOLD = 4

export async function getFounderCount(supabase: SupabaseClient): Promise<number> {
  const { count } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('is_founder', true)
    .eq('is_approved', true)
  return count ?? 0
}

export type FounderStatus =
  | { status: 'available' }
  | { status: 'low'; remaining: number }
  | { status: 'full' }

export function getFounderStatus(count: number): FounderStatus {
  const remaining = FOUNDER_LIMIT - count
  if (remaining <= 0) return { status: 'full' }
  if (remaining <= LOW_SPOTS_THRESHOLD) return { status: 'low', remaining }
  return { status: 'available' }
}
