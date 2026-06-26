'use client'
import { useState } from 'react'

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

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string|null>(null)

  const allFilled = form.name.trim() && form.email.trim() && form.subject.trim() && form.message.trim()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!allFilled) return
    setLoading(true)
    setError(null)
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (!res.ok) {
      setError('Something went wrong sending your message. Please try again.')
      setLoading(false)
      return
    }
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <main style={{minHeight:'100vh',background:'#F5F0E8',fontFamily:"'Inter',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lilita+One&family=Inter:wght@400;500;600&display=swap');
        .ticker{overflow:hidden;display:flex;height:34px;align-items:stretch}
        .ticker-track{display:inline-flex;animation:ticker 32s linear infinite;align-items:stretch}
        @keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .ticker-seg{display:flex;align-items:center;padding:0 24px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;font-weight:700;white-space:nowrap;height:34px}
        .site-footer{text-align:center;padding:32px 24px 24px;border-top:3px solid #F9C4A0;margin-top:8px}
        .site-footer-copy{font-size:12px;color:#9E9587;margin-bottom:8px;font-family:'Inter',sans-serif}
        .site-footer-links{display:flex;gap:16px;justify-content:center;align-items:center}
        .site-footer-link{font-size:12px;color:#7B5EA7;text-decoration:none;font-weight:600}
        .site-footer-link:hover{color:#F9C4A0}
        .contact-label{display:block;font-size:11px;color:#7B5EA7;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:6px;margin-top:14px;font-weight:600;font-family:'Inter',sans-serif}
        .contact-input{width:100%;background:#FAFAF8;border:2px solid #F9C4A0;border-radius:100px;padding:10px 16px;font-size:14px;font-family:'Inter',sans-serif;color:#1A1208;outline:none;box-sizing:border-box}
        .contact-input::placeholder{color:#B8B0A4}
        .contact-textarea{width:100%;min-height:140px;background:#FAFAF8;border:2px solid #F9C4A0;border-radius:16px;padding:13px 16px;font-size:14px;font-family:'Inter',sans-serif;color:#1A1208;outline:none;box-sizing:border-box;resize:none;line-height:1.7}
        .contact-textarea::placeholder{color:#B8B0A4}
        .contact-submit{margin-top:20px;width:100%;padding:13px;background:#FFCDD9;color:#1A1208;border:none;border-radius:100px;font-family:'Inter',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:opacity 0.15s}
        .contact-submit:disabled{opacity:0.5;cursor:default}
      `}</style>

      {/* Ticker */}
      <div className="ticker">
        <div className="ticker-track">
          {[...TICKER_SEGS, ...TICKER_SEGS].map((seg, i) => (
            <span key={i} className="ticker-seg" style={{background:seg.bg, color:seg.color}}>{seg.text}</span>
          ))}
        </div>
      </div>

      <div style={{textAlign:'center',padding:'24px 24px 4px'}}>
        <a href="/"><img src="/community-logo.png" alt="The Lounge Community" style={{height:120,width:'auto',display:'inline-block'}}/></a>
      </div>

      <div style={{maxWidth:560,margin:'0 auto',padding:'24px 24px 40px'}}>
        <a href="/" style={{fontSize:12,color:'#9E9587',textDecoration:'none'}}>← Back to The Lounge</a>

        <div style={{marginTop:24,marginBottom:32}}>
          <h1 style={{fontFamily:"'Lilita One',cursive",fontWeight:400,fontSize:28,color:'#7B5EA7',marginBottom:12,letterSpacing:'-0.01em'}}>Get in touch 🧡</h1>
          <p style={{fontSize:14,color:'#3A3530',lineHeight:1.8}}>We'd love to hear from you. Whether it's a question, some feedback, or just a hello — drop us a message and we'll get back to you.</p>
        </div>

        {submitted ? (
          <div style={{background:'#fff',borderRadius:20,padding:32,textAlign:'center',border:'2.5px solid #F9C4A0',boxShadow:'4px 4px 0 #F9C4A0'}}>
            <div style={{fontSize:40,marginBottom:12}}>🎉</div>
            <h2 style={{fontFamily:"'Lilita One',cursive",fontWeight:400,fontSize:20,color:'#7B5EA7',marginBottom:8}}>Message sent!</h2>
            <p style={{fontSize:13,color:'#6B6358',lineHeight:1.7}}>Thanks for getting in touch! We'll get back to you soon. 🧡</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{background:'#fff',borderRadius:20,padding:32,border:'2.5px solid #F9C4A0',boxShadow:'4px 4px 0 #F9C4A0'}}>
            <label className="contact-label">Full name</label>
            <input className="contact-input" required placeholder="Your name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/>

            <label className="contact-label">Email address</label>
            <input className="contact-input" type="email" required placeholder="you@example.com" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/>

            <label className="contact-label">Subject</label>
            <input className="contact-input" required placeholder="What's this about?" value={form.subject} onChange={e=>setForm(f=>({...f,subject:e.target.value}))}/>

            <label className="contact-label">Message</label>
            <textarea className="contact-textarea" required placeholder="Tell us more..." value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))}/>

            {error && <p style={{color:'#FF4D4D',fontSize:13,marginTop:12,padding:'8px 12px',background:'#FFE8E8',borderRadius:8,border:'1px solid #FF4D4D'}}>{error}</p>}

            <button className="contact-submit" type="submit" disabled={!allFilled||loading}>
              {loading ? 'Sending...' : 'Send message'}
            </button>
          </form>
        )}
      </div>

      <footer className="site-footer">
        <div className="site-footer-copy">© {new Date().getFullYear()} Your Virtual Office Manager Ltd · The Lounge Community</div>
        <div className="site-footer-links">
          <a href="/privacy" className="site-footer-link">Privacy Policy</a>
          <span style={{color:'#D4CEC5'}}>·</span>
          <a href="/terms" className="site-footer-link">Terms of Use</a>
          <span style={{color:'#D4CEC5'}}>·</span>
          <a href="/support" className="site-footer-link">Support Beyond Our Walls 🧡</a>
        </div>
      </footer>
    </main>
  )
}
