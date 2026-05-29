'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const TYPES = [
  { id: 'feedback', label: 'Feedback', emoji: '💬' },
  { id: 'suggestion', label: 'Suggestion', emoji: '💡' },
  { id: 'idea', label: 'Idea', emoji: '✨' },
]

export default function SuggestionBoxPage() {
  const [type, setType] = useState('suggestion')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [approved, setApproved] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('suggestions')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
      if (data) setApproved(data)
    }
    load()
  }, [])

  async function handleSubmit() {
    if (!message.trim()) return
    setLoading(true)
    await supabase.from('suggestions').insert({ type, message })
    await fetch('/api/suggestion-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, message }),
    })
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <main style={{minHeight:'100vh',background:'#F5F2ED',fontFamily:"'IBM Plex Sans',sans-serif"}}>
      <div style={{background:'#1A1814',padding:'10px 24px'}}>
        <p style={{margin:0,fontSize:11,letterSpacing:2,color:'#fff',fontFamily:"Georgia,serif",fontStyle:'italic'}}>For the ones who keep it all running</p>
      </div>
      <div style={{maxWidth:640,margin:'0 auto',padding:'40px 24px'}}>
        <a href="/" style={{fontSize:12,color:'#9E9587',textDecoration:'none'}}>Back to The Lounge</a>
        <div style={{marginTop:24,marginBottom:32}}>
          <h1 style={{fontFamily:"Georgia,serif",fontWeight:700,fontSize:32,color:'#1A1814',marginBottom:8}}>The Suggestion Box</h1>
          <p style={{fontSize:14,color:'#6B6358',lineHeight:1.7}}>Got an idea, feedback, or something you would love to see in The Lounge? Drop it in. We read every single one.</p>
        </div>
        {submitted ? (
          <div style={{background:'#fff',borderRadius:16,padding:32,textAlign:'center',border:'1px solid #E8E3DC'}}>
            <div style={{fontSize:40,marginBottom:12}}>🎉</div>
            <h2 style={{fontFamily:"Georgia,serif",fontWeight:700,fontSize:20,color:'#1A1814',marginBottom:8}}>Thank you!</h2>
            <p style={{fontSize:13,color:'#6B6358',lineHeight:1.7,marginBottom:20}}>Your suggestion has been received. We will review it and may feature it below.</p>
            <button onClick={()=>{setSubmitted(false);setMessage('');setType('suggestion')}} style={{padding:'10px 24px',background:'#1A1814',color:'#fff',border:'none',borderRadius:24,fontFamily:"Georgia,serif",fontSize:13,cursor:'pointer',fontWeight:'bold'}}>Submit another</button>
          </div>
        ) : (
          <div style={{background:'#fff',borderRadius:16,padding:32,border:'1px solid #E8E3DC',marginBottom:32}}>
            <div style={{height:4,background:'#e8602c',borderRadius:'16px 16px 0 0',margin:'-32px -32px 28px'}}/>
            <p style={{fontSize:11,color:'#9E9587',letterSpacing:'1.2px',textTransform:'uppercase',marginBottom:12}}>What is this?</p>
            <div style={{display:'flex',gap:8,marginBottom:20}}>
              {TYPES.map(t=>(
                <button key={t.id} onClick={()=>setType(t.id)} style={{padding:'8px 16px',borderRadius:24,border:type===t.id?'none':'1.5px solid #ddd',background:type===t.id?'#1A1814':'transparent',color:type===t.id?'#fff':'#6B6358',fontFamily:"IBM Plex Sans,sans-serif",fontSize:12,cursor:'pointer',fontWeight:600}}>
                  {t.emoji} {t.label}
                </button>
              ))}
            </div>
            <p style={{fontSize:11,color:'#9E9587',letterSpacing:'1.2px',textTransform:'uppercase',marginBottom:8}}>Your message</p>
            <textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Tell us what is on your mind..." style={{width:'100%',minHeight:120,background:'#FAFAF8',border:'1px solid #E2DDD6',borderRadius:10,padding:13,fontSize:14,fontFamily:"Georgia,serif",fontStyle:'italic',resize:'none',outline:'none',boxSizing:'border-box',lineHeight:1.7,color:'#1A1814'}}/>
            <button onClick={handleSubmit} disabled={!message.trim()||loading} style={{marginTop:16,width:'100%',padding:13,background:'#1A1814',color:'#fff',border:'none',borderRadius:24,fontFamily:"Georgia,serif",fontSize:13,cursor:'pointer',fontWeight:'bold',opacity:!message.trim()||loading?0.4:1}}>
              {loading ? 'Dropping it in...' : 'Drop it in the box'}
            </button>
          </div>
        )}
        {approved.length > 0 && (
          <div>
            <h2 style={{fontFamily:"Georgia,serif",fontWeight:700,fontSize:20,color:'#1A1814',marginBottom:6}}>From the community</h2>
            <p style={{fontSize:13,color:'#6B6358',marginBottom:20}}>Suggestions and ideas we have heard from members.</p>
            {approved.map((s:any)=>(
              <div key={s.id} style={{background:'#fff',borderRadius:14,padding:'18px 20px',marginBottom:10,border:'1px solid #E8E3DC'}}>
                <span style={{fontSize:10,fontWeight:600,letterSpacing:'1px',textTransform:'uppercase',color:'#e8602c',marginBottom:8,display:'block'}}>{TYPES.find(t=>t.id===s.type)?.emoji} {s.type}</span>
                <p style={{margin:0,fontSize:14,fontFamily:"Georgia,serif",fontStyle:'italic',color:'#3A3530',lineHeight:1.7}}>{s.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
