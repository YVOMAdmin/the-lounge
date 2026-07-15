'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const AVATARS = ['📋','🗂','📌','☕','🖨','📎','📁','✉️','🗓','💼']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: CURRENT_YEAR - 1900 + 1 }, (_, i) => CURRENT_YEAR - i)

const MEMBERSHIP_TYPES = [
  { id: 'free', label: 'Free', price: '£0', priceNote: '/month', features: 'Job Board & Events — read only' },
  { id: 'member', label: 'Member', price: '£2.00', priceNote: '/month', features: 'Full access · 🌟 Founders Offer' },
]

function calculateAge(birthMonth: number, birthYear: number): number {
  const now = new Date()
  let age = now.getFullYear() - birthYear
  if (now.getMonth() + 1 < birthMonth) age -= 1
  return age
}

export default function SignupPage() {
  const [form, setForm] = useState({
    email: '', password: '', username: '', location: '', avatar_emoji: '📋',
    membership_type: 'free', profession: '', birth_month: '', birth_year: '',
    terms_accepted: false, newsletter_opted_in: false,
  })
  const [error, setError] = useState<string|null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const birthMonth = parseInt(form.birth_month, 10)
    const birthYear = parseInt(form.birth_year, 10)

    if (!birthMonth || !birthYear) {
      setError('Please select your birth month and year.')
      return
    }

    if (calculateAge(birthMonth, birthYear) < 18) {
      setError('You must be 18 or older to join The Lounge.')
      return
    }

    if (!form.terms_accepted) {
      setError('You must agree to the Terms of Use and Privacy Policy to continue.')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          username: form.username,
          avatar_emoji: form.avatar_emoji,
          location: form.location,
          membership_type: form.membership_type,
          signed_up_as_member: form.membership_type === 'member',
          profession: form.profession,
          birth_month: birthMonth,
          birth_year: birthYear,
          terms_accepted: form.terms_accepted,
          newsletter_opted_in: form.newsletter_opted_in,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) { setError(error.message); setLoading(false); return }

    // All profile fields (including terms_accepted, newsletter_opted_in,
    // signed_up_as_member) are set by the handle_new_user() DB trigger
    // from this signUp() call's options.data, since that trigger runs
    // with a privileged role regardless of whether a session comes back
    // here. A prior client-side follow-up .update() used to try to write
    // these fields directly, but it silently failed on every signup: this
    // project requires email confirmation, so signUp() never returns an
    // active session, and the update ran unauthenticated as `anon`, which
    // has never held UPDATE privilege on profiles.

    setDone(true)
  }

  if (done) {
    return (
      <main style={s.page}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Lilita+One&family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>
        <a href="/"><img src="/community-logo.png" alt="The Lounge Community" style={{height:120,width:'auto',marginBottom:28,display:'block'}}/></a>
        <div style={s.card}>
          <div style={s.accentBar}/>
          <div style={{fontSize:40,marginBottom:16}}>🎉</div>
          <h1 style={s.h1}>You're on the list!</h1>
          <p style={{fontSize:13,color:'#6B6358',lineHeight:1.7,marginBottom:8}}>
            Thanks for joining The Lounge, <strong>{form.username}</strong>!
          </p>
          <p style={{fontSize:13,color:'#6B6358',lineHeight:1.7}}>
            Your account is being reviewed. We'll email you at <strong>{form.email}</strong> once approved — usually within 24 hours.
          </p>
          <div style={{background:'#FFF8F5',border:'2px solid #F9C4A0',borderRadius:12,padding:'14px 16px',marginTop:20,fontSize:12,color:'#6B6358',lineHeight:1.6}}>
            💙 We're a community for administrative and executive support professionals to share, vent, and support each other. Your people. Your space. No judgement.
          </div>
        </div>
      </main>
    )
  }

  return (
    <main style={s.page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Lilita+One&family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>
      <a href="/"><img src="/community-logo.png" alt="The Lounge Community" style={{height:120,width:'auto',marginBottom:28,display:'block'}}/></a>
      <div style={s.card}>
        <div style={s.accentBar}/>
        <h1 style={s.h1}>Join The Lounge</h1>
        <p style={{fontSize:13,color:'#6B6358',marginBottom:24,lineHeight:1.6}}>
          A closed space for the ones who keep it all running.
        </p>

        <form onSubmit={handleSubmit}>
          <label style={s.label}>Pick your avatar</label>
          <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:16}}>
            {AVATARS.map(a=>(
              <button key={a} type="button"
                style={{width:38,height:38,borderRadius:10,background:'#F5F0E8',border:form.avatar_emoji===a?'2.5px solid #F9C4A0':'2px solid transparent',fontSize:18,cursor:'pointer'}}
                onClick={()=>setForm(f=>({...f,avatar_emoji:a}))}>{a}
              </button>
            ))}
          </div>

          <label style={s.label}>Username</label>
          <input style={s.input} placeholder="e.g. diane_gmt" required
            value={form.username} onChange={e=>setForm(f=>({...f,username:e.target.value}))}/>
          <p style={{fontSize:11,color:'#9E9587',fontFamily:"'Inter',sans-serif",fontStyle:'italic',margin:'6px 0 0'}}>This is how you'll appear in the community — feel free to use a nickname!</p>

          <label style={s.label}>Timezone / Location</label>
          <input style={s.input} placeholder="e.g. GMT, EST, London"
            value={form.location} onChange={e=>setForm(f=>({...f,location:e.target.value}))}/>

          <label style={s.label}>What is your profession?</label>
          <input style={s.input} placeholder="e.g. Executive Assistant" required
            value={form.profession} onChange={e=>setForm(f=>({...f,profession:e.target.value}))}/>

          <label style={s.label}>Date of birth</label>
          <div style={{display:'flex',gap:8,marginBottom:8}}>
            <select style={s.select} required value={form.birth_month}
              onChange={e=>setForm(f=>({...f,birth_month:e.target.value}))}>
              <option value="">Month</option>
              {MONTHS.map((m,i)=>(<option key={m} value={i+1}>{m}</option>))}
            </select>
            <select style={s.select} required value={form.birth_year}
              onChange={e=>setForm(f=>({...f,birth_year:e.target.value}))}>
              <option value="">Year</option>
              {YEARS.map(y=>(<option key={y} value={y}>{y}</option>))}
            </select>
          </div>
          <p style={{fontSize:11,color:'#9E9587',marginBottom:16,marginTop:0}}>You must be 18 or older to join. This is kept private and never shown publicly.</p>

          <label style={s.label}>Membership type</label>
          <div style={{display:'flex',gap:10,marginBottom:16}}>
            {MEMBERSHIP_TYPES.map(m=>{
              const selected = form.membership_type === m.id
              return (
                <div key={m.id} onClick={()=>setForm(f=>({...f,membership_type:m.id}))}
                  style={{
                    flex:1, cursor:'pointer', textAlign:'center', borderRadius:16, padding:'14px 12px',
                    border: selected ? '2.5px solid #F9C4A0' : '2px solid #E8E3DC',
                    background: selected ? '#FFF8F5' : '#FAFAF8', transition:'all 0.15s',
                  }}>
                  <div style={{fontFamily:"'Lilita One',cursive",fontSize:15,color:'#1A1208',marginBottom:4}}>{m.label}</div>
                  <div style={{fontSize:17,fontWeight:700,color:'#7B5EA7',marginBottom:6}}>
                    {m.price}<span style={{fontSize:11,fontWeight:400,color:'#9E9587'}}>{m.priceNote}</span>
                  </div>
                  <div style={{fontSize:10,color:'#6B6358',lineHeight:1.5}}>{m.features}</div>
                </div>
              )
            })}
          </div>

          <label style={s.label}>Email</label>
          <input style={s.input} type="email" placeholder="you@example.com" required
            value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/>

          <label style={s.label}>Password</label>
          <div style={{position:'relative'}}>
            <input style={{...s.input,paddingRight:44}} type={showPassword?'text':'password'} placeholder="At least 8 characters" required minLength={8}
              value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))}/>
            <button type="button" onClick={()=>setShowPassword(v=>!v)} aria-label={showPassword?'Hide password':'Show password'} style={{position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',padding:0,cursor:'pointer',color:'#F9C4A0',display:'flex',alignItems:'center'}}>
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
          </div>

          <label style={s.checkboxLabel}>
            <input type="checkbox" style={s.checkbox} checked={form.terms_accepted}
              onChange={e=>setForm(f=>({...f,terms_accepted:e.target.checked}))}/>
            <span>
              I agree to the{' '}
              <a href="/terms" target="_blank" rel="noopener noreferrer" style={{color:'#7B5EA7',fontWeight:600,textDecoration:'none'}}>Terms of Use</a>
              {' '}and{' '}
              <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{color:'#7B5EA7',fontWeight:600,textDecoration:'none'}}>Privacy Policy</a>
            </span>
          </label>

          <label style={s.checkboxLabel}>
            <input type="checkbox" style={s.checkbox} checked={form.newsletter_opted_in}
              onChange={e=>setForm(f=>({...f,newsletter_opted_in:e.target.checked}))}/>
            <span>I'd like to receive newsletters and updates from The Lounge Community</span>
          </label>

          {error && <p style={{color:'#FF4D4D',fontSize:13,marginTop:10,padding:'8px 12px',background:'#FFE8E8',borderRadius:8,border:'1px solid #FF4D4D'}}>{error}</p>}

          <button style={{marginTop:20,width:'100%',background:'#F9C4A0',color:'#fff',border:'none',borderRadius:100,padding:'12px 0',fontSize:14,fontWeight:700,cursor:'pointer',opacity:loading?0.6:1,fontFamily:"'Syne',sans-serif"}} type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account →'}
          </button>
        </form>

        <p style={{marginTop:16,fontSize:13,color:'#9E9587',textAlign:'center'}}>
          Already have an account? <a href="/auth/login" style={{color:'#F9C4A0',fontWeight:700}}>Log in</a>
        </p>
      </div>
    </main>
  )
}

const s: Record<string,React.CSSProperties> = {
  page:     { minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'#F5F0E8', padding:24, fontFamily:"'Inter',sans-serif" },
  card:     { background:'#fff', border:'2.5px solid #F9C4A0', borderRadius:20, padding:36, width:'100%', maxWidth:440, boxShadow:'4px 4px 0 #F9C4A0' },
  accentBar:{ height:5, background:'#F9C4A0', borderRadius:'16px 16px 0 0', margin:'-36px -36px 28px' },
  h1:       { fontFamily:"'Lilita One',cursive", fontWeight:400, fontSize:24, color:'#F9C4A0', marginBottom:6, letterSpacing:'-0.01em' },
  label:    { display:'block', fontSize:11, color:'#7B5EA7', textTransform:'uppercase' as const, letterSpacing:'1.2px', marginBottom:6, marginTop:14, fontWeight:600 },
  input:    { width:'100%', background:'#FAFAF8', border:'2px solid #F9C4A0', borderRadius:100, padding:'10px 16px', fontSize:14, color:'#1A1208', outline:'none', boxSizing:'border-box' as const },
  select:   { flex:1, background:'#FAFAF8', border:'2px solid #F9C4A0', borderRadius:100, padding:'10px 16px', fontSize:14, color:'#1A1208', outline:'none', boxSizing:'border-box' as const, fontFamily:"'Inter',sans-serif" },
  checkboxLabel: { display:'flex', alignItems:'flex-start', gap:8, marginTop:14, fontSize:13, color:'#7B5EA7', fontFamily:"'Inter',sans-serif", lineHeight:1.5, cursor:'pointer' as const },
  checkbox: { width:16, height:16, marginTop:1, flexShrink:0, accentColor:'#F9C4A0', cursor:'pointer' as const },
}
