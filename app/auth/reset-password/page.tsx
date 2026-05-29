'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
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
    <main style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#F5F2ED',padding:24,fontFamily:"'IBM Plex Sans',sans-serif"}}>
      <div style={{background:'#fff',border:'1px solid #E8E3DC',borderRadius:18,padding:36,width:'100%',maxWidth:400,textAlign:'center'}}>
        <div style={{height:4,background:'#e8602c',borderRadius:'18px 18px 0 0',margin:'-36px -36px 28px'}}/>
        <h1 style={{fontFamily:"Georgia,serif",fontWeight:700,fontSize:22,color:'#1A1814',marginBottom:8}}>Choose a new password</h1>
        {done ? (
          <>
            <p style={{fontSize:13,color:'#6B6358',lineHeight:1.7,marginBottom:20}}>Password

git add .
git commit -m "add forgot and reset password pages"
git push

