'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const AVATARS = ['📋','🗂','📌','☕','🖨','📎','📁','✉️','🗓','💼']

export default function SignupPage() {
  const [form, setForm]     = useState({ email:'', password:'', username:'', location:'', avatar_emoji:'📋' })
  const [error, setError]   = useState<string|null>(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone]     = useState(false)

  // Check for invite token
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
  const invite = params?.get('invite')
  const validInvite = invite === 'theloungeaccessest26'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          username: form.username,
          avatar_emoji: form.avatar_emoji,
          location: form.location,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setDone(true)
  }

  // No invite token — show waitlist
  if (!validInvite) {
    return (
      <main style={s.page}>
        <div style={s.card}>
          <div style={{fontSize:40,marginBottom:16}}>🔒</div>
          <h1 style={s.h1}>The Lounge is invite-only</h1>
          <p style={{fontSize:13,color:'#6B6358',lineHeight:1.6,marginBottom:20}}>
            You need an invite link to join. If someone referred you, ask them to share their invite link with you.
          </p>
          <p style={{fontSize:12,color:'#9E9587'}}>Already have an account? <a href="/auth/login" style={{color:'#1A1814',fontWeight:600}}>Log in</a></p>
        </div>
      </main>
    )
  }

  // Success — pending approval
  if (done) {
    return (
      <main style={s.page}>
        <div style={s.card}>
          <div style={{fontSize:40,marginBottom:16}}>🎉</div>
          <h1 style={s.h1}>You're on the list!</h1>
          <p style={{fontSize:13,color:'#6B6358',lineHeight:1.7,marginBottom:8}}>
            Thanks for joining The Lounge, <strong>{form.username}</strong>!
          </p>
          <p style={{fontSize:13,color:'#6B6358',lineHeight:1.7}}>
            Your account is being reviewed. We'll email you at <strong>{form.email}</strong> once you're approved — usually within 24 hours.
          </p>
          <div style={{background:'#FFFBF5',border:'1px solid #E8E3DC',borderRadius:10,padding:'14px 16px',marginTop:20,fontSize:12,color:'#6B6358',lineHeight:1.6}}>
            💙 While you wait — we're a community for remote admin professionals to share, vent, and support each other. Your people. Your space. No judgement..
          </div>
        </div>
      </main>
    )
  }

  return (
    <main style={s.page}>
      <div style={s.card}>
        <a href="/" style={{fontSize:12,color:'#9E9587',textDecoration:'none',display:'block',marginBottom:20}}>← Back to The Lounge</a>
        <h1 style={s.h1}>Join The Lounge</h1>
        <p style={{fontSize:13,color:'#6B6358',marginBottom:24,lineHeight:1.6}}>
          A closed space for the ones who keep it all running.
        </p>

        <form onSubmit={handleSubmit}>
          <label style={s.label}>Pick your avatar</label>
          <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:16}}>
            {AVATARS.map(a=>(
              <button key={a} type="button"
                style={{width:38,height:38,borderRadius:9,background:'#F0EDE8',border:form.avatar_emoji===a?'2px solid #1A1814':'2px solid transparent',fontSize:18,cursor:'pointer'}}
                onClick={()=>setForm(f=>({...f,avatar_emoji:a}))}>{a}
              </button>
            ))}
          </div>

          <label style={s.label}>Username</label>
          <input style={s.input} placeholder="e.g. diane_gmt" required
            value={form.username} onChange={e=>setForm(f=>({...f,username:e.target.value}))}/>

          <label style={s.label}>Timezone / Location</label>
          <input style={s.input} placeholder="e.g. GMT, EST, London"
            value={form.location} onChange={e=>setForm(f=>({...f,location:e.target.value}))}/>

          <label style={s.label}>Email</label>
          <input style={s.input} type="email" placeholder="you@example.com" required
            value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/>

          <label style={s.label}>Password</label>
          <input style={s.input} type="password" placeholder="At least 8 characters" required minLength={8}
            value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))}/>

          {error && <p style={{color:'#F4622A',fontSize:13,marginTop:10}}>{error}</p>}

          <button style={{marginTop:20,width:'100%',background:'#1A1814',color:'#F5F2ED',border:'none',borderRadius:9,padding:'11px 0',fontSize:14,fontWeight:600,cursor:'pointer',opacity:loading?0.6:1}} type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>

          <p style={{fontSize:11,color:'#9E9587',textAlign:'center',marginTop:12,lineHeight:1.6}}>
            By creating an account you agree to our{' '}
            <a href="/terms" style={{color:'#0EAD8B',textDecoration:'none'}}>Terms of Use</a>
            {' '}and{' '}
            <a href="/privacy" style={{color:'#0EAD8B',textDecoration:'none'}}>Privacy Policy</a>
          </p>
        </form>

        <p style={{marginTop:16,fontSize:13,color:'#9E9587',textAlign:'center'}}>
          Already have an account? <a href="/auth/login" style={{color:'#1A1814',fontWeight:600}}>Log in</a>
        </p>
      </div>
    </main>
  )
}

const s: Record<string,React.CSSProperties> = {
  page:  { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#F5F2ED', padding:24, fontFamily:"'IBM Plex Sans',sans-serif" },
  card:  { background:'#fff', border:'1px solid #E8E3DC', borderRadius:18, padding:36, width:'100%', maxWidth:440, boxShadow:'0 8px 40px rgba(0,0,0,0.07)' },
  h1:    { fontFamily:"Georgia,serif", fontWeight:700, fontSize:22, color:'#1A1814', marginBottom:6 },
  label: { display:'block', fontSize:11, color:'#9E9587', textTransform:'uppercase' as const, letterSpacing:'1.2px', marginBottom:6, marginTop:14 },
  input: { width:'100%', background:'#FAFAF8', border:'1px solid #E2DDD6', borderRadius:9, padding:'10px 13px', fontSize:14, color:'#1A1814', outline:'none', boxSizing:'border-box' as const },
}
