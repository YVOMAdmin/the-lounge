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

const TICKER_SEGS = [
  { text: 'For the ones who keep it all running', bg: '#FFB3C6', color: '#1A1208' },
  { text: '✦', bg: '#FFB3C6', color: '#F9C4A0' },
  { text: 'The Lounge Community', bg: '#B8F0D0', color: '#1A1208' },
  { text: '✦', bg: '#B8F0D0', color: '#7B5EA7' },
  { text: 'Admin & EA Support Professionals', bg: '#C5B8F5', color: '#1A1208' },
  { text: '✦', bg: '#C5B8F5', color: '#F9C4A0' },
  { text: 'For the ones who keep it all running', bg: '#FFE5B4', color: '#1A1208' },
  { text: '✦', bg: '#FFE5B4', color: '#FF4D4D' },
  { text: 'The Lounge Community', bg: '#B3D9FF', color: '#1A1208' },
  { text: '✦', bg: '#B3D9FF', color: '#7B5EA7' },
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
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { window.location.href = '/auth/login'; return; }
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
    <main style={{minHeight:'100vh',background:'#F5F0E8',fontFamily:"'Inter',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lilita+One&family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap');
        .ticker{overflow:hidden;display:flex;height:34px;align-items:stretch}
        .ticker-track{display:inline-flex;animation:ticker 32s linear infinite;align-items:stretch}
        @keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .ticker-seg{display:flex;align-items:center;padding:0 24px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;font-weight:700;white-space:nowrap;height:34px}
        .site-footer{text-align:center;padding:32px 24px 24px;border-top:3px solid #F9C4A0;margin-top:8px}
        .site-footer-copy{font-size:12px;color:#9E9587;margin-bottom:8px;font-family:'Inter',sans-serif}
        .site-footer-links{display:flex;gap:16px;justify-content:center;align-items:center}
        .site-footer-link{font-size:12px;color:#7B5EA7;text-decoration:none;font-weight:600}
        .site-footer-link:hover{color:#F9C4A0}
        .sb-type-btn{padding:8px 16px;border-radius:100px;font-family:'Inter',sans-serif;font-size:12px;cursor:pointer;font-weight:600;transition:all 0.15s}
        .sb-textarea{width:100%;min-height:120px;background:#FAFAF8;border:2px solid #F9C4A0;border-radius:16px;padding:13px 16px;font-size:14px;font-family:'Inter',sans-serif;resize:none;outline:none;box-sizing:border-box;line-height:1.7;color:#1A1208}
        .sb-textarea::placeholder{color:#B8B0A4}
        .sb-submit{margin-top:16px;width:100%;padding:13px;background:#F9C4A0;color:#fff;border:none;border-radius:100px;font-family:'Syne',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:background 0.15s}
        .sb-submit:disabled{opacity:0.4;cursor:default}
      `}</style>

      {/* Ticker */}
      <div className="ticker">
        <div className="ticker-track">
          {[...TICKER_SEGS, ...TICKER_SEGS].map((seg:any, i:number) => (
            <span key={i} className="ticker-seg" style={{background:seg.bg, color:seg.color}}>{seg.text}</span>
          ))}
        </div>
      </div>

      <div style={{textAlign:'center',padding:'24px 24px 4px'}}>
        <a href="/community"><img src="/community-logo.png" alt="The Lounge Community" style={{height:120,width:'auto',display:'inline-block'}}/></a>
      </div>

      <div style={{maxWidth:640,margin:'0 auto',padding:'24px 24px 40px'}}>
        <a href="/community" style={{fontSize:12,color:'#9E9587',textDecoration:'none'}}>← Back to The Lounge</a>
        <div style={{marginTop:24,marginBottom:32}}>
          <h1 style={{fontFamily:"'Lilita One',cursive",fontWeight:400,fontSize:28,color:'#F9C4A0',marginBottom:8,letterSpacing:'-0.01em'}}>The Suggestion Box</h1>
          <p style={{fontSize:14,color:'#6B6358',lineHeight:1.7}}>Got an idea, feedback, or something you would love to see in The Lounge? Drop it in. We read every single one.</p>
        </div>
        {submitted ? (
          <div style={{background:'#fff',borderRadius:20,padding:32,textAlign:'center',border:'2.5px solid #F9C4A0',boxShadow:'4px 4px 0 #F9C4A0'}}>
            <div style={{fontSize:40,marginBottom:12}}>🎉</div>
            <h2 style={{fontFamily:"'Lilita One',cursive",fontWeight:400,fontSize:20,color:'#7B5EA7',marginBottom:8}}>Thank you!</h2>
            <p style={{fontSize:13,color:'#6B6358',lineHeight:1.7,marginBottom:20}}>Your suggestion has been received. We will review it and may feature it below.</p>
            <button onClick={()=>{setSubmitted(false);setMessage('');setType('suggestion')}} style={{padding:'10px 24px',background:'#F9C4A0',color:'#fff',border:'none',borderRadius:100,fontFamily:"'Syne',sans-serif",fontSize:13,cursor:'pointer',fontWeight:700}}>Submit another</button>
          </div>
        ) : (
          <div style={{background:'#fff',borderRadius:20,padding:32,border:'2.5px solid #F9C4A0',boxShadow:'4px 4px 0 #F9C4A0',marginBottom:32}}>
            <p style={{fontSize:11,color:'#7B5EA7',letterSpacing:'1.2px',textTransform:'uppercase',marginBottom:12,fontWeight:600}}>What is this?</p>
            <div style={{display:'flex',gap:8,marginBottom:20,flexWrap:'wrap'}}>
              {TYPES.map(t=>(
                <button key={t.id} className="sb-type-btn" onClick={()=>setType(t.id)} style={{border:type===t.id?'none':'1.5px solid #F9C4A0',background:type===t.id?'#F9C4A0':'transparent',color:type===t.id?'#fff':'#6B6358'}}>
                  {t.emoji} {t.label}
                </button>
              ))}
            </div>
            <p style={{fontSize:11,color:'#7B5EA7',letterSpacing:'1.2px',textTransform:'uppercase',marginBottom:8,fontWeight:600}}>Your message</p>
            <textarea className="sb-textarea" value={message} onChange={e=>setMessage(e.target.value)} placeholder="Tell us what is on your mind..."/>
            <button className="sb-submit" onClick={handleSubmit} disabled={!message.trim()||loading}>
              {loading ? 'Dropping it in...' : 'Drop it in the box'}
            </button>
          </div>
        )}
        {approved.length > 0 && (
          <div>
            <h2 style={{fontFamily:"'Lilita One',cursive",fontWeight:400,fontSize:20,color:'#7B5EA7',marginBottom:6}}>From the community</h2>
            <p style={{fontSize:13,color:'#6B6358',marginBottom:20}}>Suggestions and ideas we have heard from members.</p>
            {approved.map((s:any)=>(
              <div key={s.id} style={{background:'#fff',borderRadius:16,padding:'18px 20px',marginBottom:10,border:'2px solid #F9C4A0'}}>
                <span style={{fontSize:10,fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',color:'#7B5EA7',marginBottom:8,display:'block'}}>{TYPES.find(t=>t.id===s.type)?.emoji} {s.type}</span>
                <p style={{margin:0,fontSize:14,fontFamily:"'Inter',sans-serif",color:'#3A3530',lineHeight:1.7}}>{s.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="site-footer">
        <div className="site-footer-copy">© {new Date().getFullYear()} Your Virtual Office Manager Ltd · The Lounge Community</div>
        <div className="site-footer-links">
          <a href="/privacy" className="site-footer-link">Privacy Policy</a>
          <span style={{color:"#D4CEC5"}}>·</span>
          <a href="/terms" className="site-footer-link">Terms of Use</a>
          <span style={{color:"#D4CEC5"}}>·</span>
          <a href="mailto:hello@theloungecommunity.co.uk" className="site-footer-link">Contact</a>
        </div>
      </footer>
    </main>
  )
}
