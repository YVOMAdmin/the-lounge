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
        <h1 style={{fontFamily:"Georgia,serif",fontWeight:700,fontSize:22,color:'#1A1814',marginBottom:8}

ls app/auth/forgot-password/
ls app/auth/reset-password/

