'use client'

import { useState } from 'react'

const AVATARS = ['📋','🗂','📌','☕','🖨','📎','📁','✉️','🗓','💼']

export default function SignupPage() {
  const [form, setForm] = useState({ email:'', password:'', username:'', location:'', avatar_emoji:'📋' })

  return (
    <main style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#F5F2ED',padding:24,fontFamily:"'IBM Plex Sans',sans-serif"}}>
      <div style={{background:'#fff',border:'1px solid #E8E3DC',borderRadius:18,padding:36,width:'100%',maxWidth:440,boxShadow:'0 8px 40px rgba(0,0,0,0.07)'}}>
        <h1 style={{fontFamily:"Georgia,serif",fontWeight:700,fontSize:22,color:'#1A1814',marginBottom:6}}>Join The Lounge</h1>
        <p style={{fontSize:13,color:'#6B6358',marginBottom:24,lineHeight:1.6}}>A closed space for the ones who keep it all running.</p>

        <label style={styles.label}>Pick your avatar</label>
        <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:16}}>
          {AVATARS.map(a=>(
            <button key={a} type="button"
              style={{width:38,height:38,borderRadius:9,background:'#F0EDE8',border:form.avatar_emoji===a?'2px solid #1A1814':'2px solid transparent',fontSize:18,cursor:'pointer'}}
              onClick={()=>setForm(f=>({...f,avatar_emoji:a}))}>{a}</button>
          ))}
        </div>

        <label style={styles.label}>Username</label>
        <input style={styles.input} placeholder="e.g. diane_gmt" value={form.username} onChange={e=>setForm(f=>({...f,username:e.target.value}))}/>

        <label style={styles.label}>Timezone / Location</label>
        <input style={styles.input} placeholder="e.g. GMT, EST, London" value={form.location} onChange={e=>setForm(f=>({...f,location:e.target.value}))}/>

        <label style={styles.label}>Email</label>
        <input style={styles.input} type="email" placeholder="you@example.com" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/>

        <label style={styles.label}>Password</label>
        <input style={styles.input} type="password" placeholder="At least 8 characters" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))}/>

        <button style={{marginTop:20,width:'100%',background:'#1A1814',color:'#F5F2ED',border:'none',borderRadius:9,padding:'11px 0',fontSize:14,fontWeight:600,cursor:'pointer'}}>
          Create account
        </button>

        <p style={{fontSize:11,color:'#9E9587',textAlign:'center',marginTop:12,lineHeight:1.6}}>
          By creating an account you agree to our{' '}
          <a href="/terms" style={{color:'#0EAD8B',textDecoration:'none'}}>Terms of Use</a>
          {' '}and{' '}
          <a href="/privacy" style={{color:'#0EAD8B',textDecoration:'none'}}>Privacy Policy</a>
        </p>

        <p style={{marginTop:16,fontSize:13,color:'#9E9587',textAlign:'center'}}>
          Already have an account? <a href="/auth/login" style={{color:'#1A1814',fontWeight:600}}>Log in</a>
        </p>
      </div>
    </main>
  )
}

const styles: Record<string,React.CSSProperties> = {
  label: {display:'block',fontSize:11,color:'#9E9587',textTransform:'uppercase',letterSpacing:'1.2px',marginBottom:6,marginTop:14},
  input: {width:'100%',background:'#FAFAF8',border:'1px solid #E2DDD6',borderRadius:9,padding:'10px 13px',fontSize:14,color:'#1A1814',outline:'none',boxSizing:'border-box'},
}
