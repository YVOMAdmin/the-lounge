'use client'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleReset() {
    setLoading(true)
    await supabase.auth.updateUser({ password })
    setDone(true)
    setLoading(false)
  }

  return (
    <main style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'#F5F0E8',padding:24,fontFamily:"'Inter',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

      <a href="/"><img src="/community-logo.png" alt="The Lounge Community" style={{height:120,width:'auto',marginBottom:28,display:'block'}}/></a>

      <div style={{background:'#fff',border:'2.5px solid #E8845A',borderRadius:20,padding:36,width:'100%',maxWidth:400,textAlign:'center',boxShadow:'4px 4px 0 #E8845A'}}>
        <div style={{height:5,background:'#E8845A',borderRadius:'16px 16px 0 0',margin:'-36px -36px 28px'}}/>

        <div style={{fontSize:40,marginBottom:12}}>🔐</div>
        <h1 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:22,color:'#E8845A',marginBottom:8,letterSpacing:'-0.03em'}}>Choose a new password</h1>

        {done ? (
          <>
            <div style={{fontSize:40,marginBottom:12}}>✅</div>
            <p style={{fontSize:13,color:'#6B6358',lineHeight:1.7,marginBottom:20}}>Password updated! You can now log in with your new password.</p>
            <a href="/auth/login" style={{display:'block',padding:'12px 0',background:'#E8845A',color:'#fff',borderRadius:100,fontSize:14,fontWeight:700,textDecoration:'none',fontFamily:"'Syne',sans-serif"}}>
              Go to login →
            </a>
          </>
        ) : (
          <>
            <p style={{fontSize:13,color:'#6B6358',lineHeight:1.7,marginBottom:20}}>Enter your new password below.</p>
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={e=>setPassword(e.target.value)}
              style={{width:'100%',padding:'11px 16px',borderRadius:100,border:'2px solid #E8845A',fontSize:14,marginBottom:14,boxSizing:'border-box',outline:'none',background:'#FAFAF8',color:'#1A1208'}}
            />
            <button
              onClick={handleReset}
              disabled={!password||loading}
              style={{width:'100%',padding:'12px 0',background:'#E8845A',color:'#fff',border:'none',borderRadius:100,fontSize:14,cursor:'pointer',fontWeight:700,fontFamily:"'Syne',sans-serif",opacity:!password||loading?0.6:1}}
            >
              {loading ? 'Updating…' : 'Update password →'}
            </button>
          </>
        )}
      </div>
    </main>
  )
}