'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
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
    <main style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#F5F2ED',padding:24,fontFamily:"'IBM Plex Sans',sans-serif"}}>
      <div style={{background:'#fff',border:'1px solid #E8E3DC',borderRadius:18,padding:36,width:'100%',maxWidth:400,textAlign:'center'}}>
        <div style={{height:4,background:'#e8602c',borderRadius:'18px 18px 0 0',margin:'-36px -36px 28px'}}/>
        <h1 style={{fontFamily:"Georgia,serif",fontWeight:700,fontSize:22,color:'#1A1814',marginBottom:8}}>Reset your password</h1>
        {sent ? (
          <p style={{fontSize:13,color:'#6B6358',lineHeight:1.7}}>Check your email for a reset link.</p>
        ) : (
          <>
            <p style={{fontSize:13,color:'#6B6358',lineHeight:1.7,marginBottom:20}}>Enter your email and we will send you a reset link.</p>
            <input type="email" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%',padding:'12px 16px',borderRadius:8,border:'1.5px solid #ddd',fontFamily:"IBM Plex Sans,sans-serif",fontSize:14,marginBottom:12,boxSizing:'border-box',outline:'none'}}/>
            <button onClick={handleSubmit} disabled={!email||loading} style={{width:'100%',padding:13,background:'#1A1814',color:'#fff',border:'none',borderRadius:24,fontFamily:"Georgia,serif",fontSize:13,cursor:'pointer',fontWeight:'bold'}}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </>
        )}
        <p style={{fontSize:12,color:'#9E9587',marginTop:20}}><a href="/auth/login" style={{color:'#1A1814',fontWeight:600}}>Back to login</a></p>
      </div>
    </main>
  )
}
