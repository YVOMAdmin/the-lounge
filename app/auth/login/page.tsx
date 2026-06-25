'use client'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
    window.location.href = '/community'
  }

  return (
    <main style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'#F5F0E8',padding:24,fontFamily:"'Inter',sans-serif"}}>
      
      {/* Logo */}
      <a href="/" style={{marginBottom:28,display:'block'}}>
        <img src="/community-logo.png" alt="The Lounge Community" style={{height:120,width:'auto'}}/>
      </a>

      <div style={{background:'#fff',border:'2.5px solid #F9C4A0',borderRadius:20,padding:36,width:'100%',maxWidth:400,boxShadow:'4px 4px 0 #F9C4A0'}}>
        
        {/* Accent bar */}
        <div style={{height:5,background:'#F9C4A0',borderRadius:'16px 16px 0 0',margin:'-36px -36px 28px'}}/>
        
        <h1 style={{fontFamily:"'Lilita One',cursive",fontWeight:400,fontSize:24,color:'#F9C4A0',marginBottom:6,letterSpacing:'-0.01em'}}>Welcome back</h1>
        <p style={{fontSize:13,color:'#6B6358',marginBottom:24,lineHeight:1.6}}>Log in to The Lounge Community</p>
        
        <form onSubmit={handleLogin}>
          <label style={{display:'block',fontSize:11,color:'#7B5EA7',textTransform:'uppercase',letterSpacing:'1.2px',marginBottom:6,fontWeight:600}}>Email</label>
          <input type="email" required placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%',background:'#FAFAF8',border:'2px solid #F9C4A0',borderRadius:100,padding:'10px 16px',fontSize:14,color:'#1A1208',outline:'none',boxSizing:'border-box',marginBottom:14}}/>
          
          <label style={{display:'block',fontSize:11,color:'#7B5EA7',textTransform:'uppercase',letterSpacing:'1.2px',marginBottom:6,fontWeight:600}}>Password</label>
          <div style={{position:'relative',marginBottom:4}}>
            <input type={showPassword?'text':'password'} required placeholder="Your password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%',background:'#FAFAF8',border:'2px solid #F9C4A0',borderRadius:100,padding:'10px 44px 10px 16px',fontSize:14,color:'#1A1208',outline:'none',boxSizing:'border-box'}}/>
            <button type="button" onClick={()=>setShowPassword(v=>!v)} aria-label={showPassword?'Hide password':'Show password'} style={{position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',padding:0,cursor:'pointer',color:'#F9C4A0',display:'flex',alignItems:'center'}}>
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
          </div>
          
          <p style={{textAlign:'right',marginBottom:16}}><a href="/auth/forgot-password" style={{fontSize:12,color:'#7B5EA7',fontWeight:600}}>Forgot password?</a></p>
          
          {error && <p style={{color:'#FF4D4D',fontSize:13,marginBottom:12,padding:'8px 12px',background:'#FFE8E8',borderRadius:8,border:'1px solid #FF4D4D'}}>{error}</p>}
          
          <button type="submit" disabled={loading} style={{width:'100%',background:'#F9C4A0',color:'#fff',border:'none',borderRadius:100,padding:'12px 0',fontSize:14,fontWeight:700,cursor:'pointer',opacity:loading?0.6:1,fontFamily:"'Syne',sans-serif",letterSpacing:'0.02em'}}>
            {loading ? 'Logging in…' : 'Log in →'}
          </button>
        </form>
        
        <p style={{marginTop:16,fontSize:13,color:'#9E9587',textAlign:'center'}}>
          Don't have an account? <a href="/auth/signup" style={{color:'#F9C4A0',fontWeight:700}}>Sign up</a>
        </p>
      </div>

      {/* Syne font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Lilita+One&family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>
    </main>
  )
}