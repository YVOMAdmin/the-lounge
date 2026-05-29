'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string|null>(null)
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    window.location.href = '/'
  }

  return (
    <main style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#F5F2ED',padding:24,fontFamily:"'IBM Plex Sans',sans-serif"}}>
      <div style={{background:'#fff',border:'1px solid #E8E3DC',borderRadius:18,padding:36,width:'100%',maxWidth:400,boxShadow:'0 8px 40px rgba(0,0,0,0.07)'}}>
        <div style={{height:4,background:'#e8602c',borderRadius:'18px 18px 0 0',margin:'-36px -36px 28px'}}/>
        <h1 style={{fontFamily:"Georgia,serif",fontWeight:700,fontSize:22,color:'#1A1814',marginBottom:6}}>Welcome back</h1>
        <p style={{fontSize:13,color:'#6B6358',marginBottom:24,lineHeight:1.6}}>Log in to The Lounge</p>
        <form onSubmit={handleLogin}>
          <label style={{display:'block',fontSize:11,color:'#9E9587',textTransform:'uppercase',letterSpacing:'1.2px',marginBottom:6}}>Email</label>
          <input type="email" required placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%',background:'#FAFAF8',border:'1px solid #E2DDD6',borderRadius:9,padding:'10px 13px',fontSize:14,color:'#1A1814',outline:'none',boxSizing:'border-box',marginBottom:14}}/>
          <label style={{display:'block',fontSize:11,color:'#9E9587',textTransform:'uppercase',letterSpacing:'1.2px',marginBottom:6}}>Password</label>
          <input type="password" required placeholder="Your password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%',background:'#FAFAF8',border:'1px solid #E2DDD6',borderRadius:9,padding:'10px 13px',fontSize:14,color:'#1A1814',outline:'none',boxSizing:'border-box',marginBottom:4}}/>
          <p style={{textAlign:'right',marginBottom:16}}><a href="/auth/forgot-password" style={{fontSize:12,color:'#6B6358'}}>Forgot password?</a></p>
          {error && <p style={{color:'#F4622A',fontSize:13,marginBottom:12}}>{error}</p>}
          <button type="submit" disabled={loading} style={{width:'100%',background:'#1A1814',color:'#F5F2ED',border:'none',borderRadius:9,padding:'11px 0',fontSize:14,fontWeight:600,cursor:'pointer',opacity:loading?0.6:1}}>
            {loading ? 'Logging in…' : 'Log in →'}
          </button>
        </form>
        <p style={{marginTop:16,fontSize:13,color:'#9E9587',textAlign:'center'}}>
          Don't have an account? <a href="/auth/signup" style={{color:'#1A1814',fontWeight:600}}>Sign up</a>
        </p>
      </div>
    </main>
  )
}
