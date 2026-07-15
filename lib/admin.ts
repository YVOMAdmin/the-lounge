// Single source of truth for admin identification. Used client-side (e.g.
// app/components/Lounge.tsx's isAdmin/isFreeTier gating) as well as
// server-side, so this reads the NEXT_PUBLIC_-prefixed env var — a plain
// ADMIN_MEMBER_EMAIL would be stripped to undefined in the browser bundle,
// since Next.js only inlines NEXT_PUBLIC_* vars client-side. This is not a
// new client-side exposure: the email this replaces was already a literal
// hardcoded string in Lounge.tsx.
export const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_MEMBER_EMAIL

export function isAdminEmail(email: string | null | undefined): boolean {
  return !!ADMIN_EMAIL && email === ADMIN_EMAIL
}
