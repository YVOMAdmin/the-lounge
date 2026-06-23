'use client'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setLoading(true)
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://theloungecommunity.co.uk/auth/reset-password',
    })
    setSent(true)
    setLoading(false)
  }

  return (
    <main style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'#F5F0E8',padding:24,fontFamily:"'Inter',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

      <a href="/"><img src="/community-logo.png" alt="The Lounge Community" style={{height:75,width:'auto',marginBottom:28,display:'block'}}/></a>

      <div style={{background:'#fff',border:'2.5px solid #E8845A',borderRadius:20,padding:36,width:'100%',maxWidth:400,textAlign:'center',boxShadow:'4px 4px 0 #E8845A'}}>
        <div style={{height:5,background:'#E8845A',borderRadius:'16px 16px 0 0',margin:'-36px -36px 28px'}}/>

        <div style={{fontSize:40,marginBottom:12}}>🔑</div>
        <h1 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:22,color:'#E8845A',marginBottom:8,letterSpacing:'-0.03em'}}>Reset your password</h1>

        {sent ? (
          <div>
            <div style={{fontSize:40,marginBottom:12}}>📬</div>
            <p style={{fontSize:13,color:'#6B6358',lineHeight:1.7}}>Check your email for a reset link. It may take a minute or two to arrive.</p>
          </div>
        ) : (
          <>
            <p style={{fontSize:13,color:'#6B6358',lineHeight:1.7,marginBottom:20}}>Enter your email and we'll send you a reset link.</p>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e=>setEmail(e.target.value)}
              style={{width:'100%',padding:'11px 16px',borderRadius:100,border:'2px solid #E8845A',fontSize:14,marginBottom:14,boxSizing:'border-box',outline:'none',background:'#FAFAF8',color:'#1A1208'}}
            />
            <button
              onClick={handleSubmit}
              disabled={!email||loading}
              style={{width:'100%',padding:'12px 0',background:'#E8845A',color:'#fff',border:'none',borderRadius:100,fontSize:14,cursor:'pointer',fontWeight:700,fontFamily:"'Syne',sans-serif",opacity:!email||loading?0.6:1}}
            >
              {loading ? 'Sending…' : 'Send reset link →'}
            </button>
          </>
        )}

        <p style={{fontSize:12,color:'#9E9587',marginTop:20}}>
          <a href="/auth/login" style={{color:'#E8845A',fontWeight:700}}>← Back to login</a>
        </p>
      </div>
    </main>
  )
}