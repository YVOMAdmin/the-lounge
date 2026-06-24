'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Member = {
  id: string
  username: string
  email?: string
  location: string
  avatar_emoji: string
  created_at: string
  is_approved: boolean
}

type Event = {
  id: string
  title: string
  date: string
  time: string
  description: string
  link: string
  is_approved: boolean
  created_at: string
}

type Suggestion = {
  id: string
  type: string
  message: string
  is_approved: boolean
  created_at: string
}

const ACCENT = '#F9C4A0'
const PURPLE = '#7B5EA7'
const GREEN = '#2DC653'
const CREAM = '#F5F0E8'
const DARK = '#1A1208'

const s = {
  page: { minHeight: '100vh', backgroundColor: CREAM, fontFamily: "'Inter', sans-serif", padding: '0' },
  loginPage: { minHeight: '100vh', backgroundColor: CREAM, fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', padding: 24 },
  loginCard: { backgroundColor: '#ffffff', borderRadius: '20px', overflow: 'hidden', width: '100%', maxWidth: '380px', border: `2.5px solid ${ACCENT}`, boxShadow: `4px 4px 0 ${ACCENT}` },
  loginAccent: { height: '5px', backgroundColor: ACCENT },
  loginBody: { padding: '36px' },
  ticker: { backgroundColor: DARK, padding: '0', overflow: 'hidden', display: 'flex', height: '34px', alignItems: 'stretch' },
  tickerTrack: { display: 'inline-flex', animation: 'ticker 28s linear infinite', alignItems: 'stretch' },
  header: { padding: '16px 32px', borderBottom: `3px solid ${ACCENT}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: CREAM, position: 'sticky' as const, top: 0, zIndex: 50 },
  logo: { margin: 0, fontSize: '22px', fontWeight: 800, color: ACCENT, fontFamily: "'Syne', sans-serif", letterSpacing: '-0.03em' },
  badge: { display: 'inline-block', padding: '4px 12px', backgroundColor: PURPLE, borderRadius: '100px', fontSize: '11px', color: '#ffffff', fontWeight: 600 },
  main: { padding: '28px 32px', maxWidth: '860px', margin: '0 auto' },
  sectionTitle: { margin: '0 0 16px', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase' as const, color: PURPLE, fontWeight: 700 },
  card: { backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden', marginBottom: '10px', border: `2px solid ${ACCENT}` },
  cardAccent: { height: '4px', backgroundColor: ACCENT },
  cardBody: { padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' },
  avatar: { width: '44px', height: '44px', borderRadius: '10px', backgroundColor: CREAM, border: `2px solid ${ACCENT}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 },
  memberInfo: { flex: 1 },
  memberName: { margin: '0 0 2px', fontSize: '15px', fontWeight: 700, color: DARK, fontFamily: "'Syne', sans-serif" },
  memberMeta: { margin: 0, fontSize: '12px', color: '#8A8070' },
  actions: { display: 'flex', gap: '8px' },
  approveBtn: { padding: '8px 16px', backgroundColor: ACCENT, color: '#ffffff', border: 'none', borderRadius: '100px', fontSize: '12px', cursor: 'pointer', fontWeight: 700 },
  rejectBtn: { padding: '8px 16px', backgroundColor: 'transparent', color: PURPLE, border: `1.5px solid ${PURPLE}`, borderRadius: '100px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 },
  empty: { backgroundColor: '#ffffff', borderRadius: '16px', padding: '40px 24px', textAlign: 'center' as const, border: `2px dashed ${ACCENT}` },
  emptyText: { margin: 0, fontSize: '14px', fontStyle: 'italic', color: '#8A8070' },
  stats: { display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' as const },
  statCard: { backgroundColor: '#ffffff', borderRadius: '14px', padding: '16px 20px', flex: 1, border: `2px solid ${ACCENT}` },
  statNum: { margin: '0 0 4px', fontSize: '28px', fontWeight: 800, color: ACCENT, fontFamily: "'Syne', sans-serif" },
  statLabel: { margin: 0, fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase' as const, color: PURPLE, fontWeight: 600 },
  input: { width: '100%', padding: '11px 16px', borderRadius: '100px', border: `2px solid ${ACCENT}`, fontSize: '14px', marginBottom: '12px', boxSizing: 'border-box' as const, outline: 'none', background: '#FAFAF8', color: DARK },
  submitBtn: { width: '100%', padding: '12px', backgroundColor: ACCENT, color: '#fff', border: 'none', borderRadius: '100px', fontSize: '14px', cursor: 'pointer', fontWeight: 700, fontFamily: "'Syne', sans-serif" },
  error: { margin: '0 0 12px', fontSize: '13px', color: '#FF4D4D', padding: '8px 12px', background: '#FFE8E8', borderRadius: 8, border: '1px solid #FF4D4D' },
}

const TICKER_SEGS = [
  { text: 'For the ones who keep it all running', bg: '#FFB3C6', color: DARK },
  { text: '✦', bg: '#FFB3C6', color: ACCENT },
  { text: 'The Lounge Community', bg: '#B8F0D0', color: DARK },
  { text: '✦', bg: '#B8F0D0', color: PURPLE },
  { text: 'Admin Panel', bg: '#C5B8F5', color: DARK },
  { text: '✦', bg: '#C5B8F5', color: ACCENT },
  { text: 'For the ones who keep it all running', bg: '#FFE5B4', color: DARK },
  { text: '✦', bg: '#FFE5B4', color: '#FF4D4D' },
]

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [totp, setTotp] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [pending, setPending] = useState<Member[]>([])
  const [approved, setApproved] = useState<Member[]>([])
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState<string | null>(null)
  const [pendingEvents, setPendingEvents] = useState<Event[]>([])
  const [approvedEvents, setApprovedEvents] = useState<Event[]>([])
  const [pendingSuggestions, setPendingSuggestions] = useState<Suggestion[]>([])
  const [approvedSuggestions, setApprovedSuggestions] = useState<Suggestion[]>([])

  useEffect(() => {
    fetch('/api/admin-auth', { method: 'GET' })
      .then(r => { if (r.ok) { setAuthed(true); fetchMembers(); fetchEvents(); fetchSuggestions() } })
      .catch(() => {})
  }, [])

  async function handleLogin() {
    setLoginLoading(true)
    setLoginError('')
    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, totp }),
      })
      if (res.ok) {
        setAuthed(true)
        fetchMembers()
        fetchEvents()
        fetchSuggestions()
      } else {
        setLoginError('Incorrect password.')
      }
    } catch {
      setLoginError('Something went wrong. Try again.')
    }
    setLoginLoading(false)
  }

  async function fetchMembers() {
    setLoading(true)
    const res = await fetch('/api/admin-profiles')
    const { data } = await res.json()
    if (data) {
      setPending(data.filter((m: Member) => !m.is_approved))
      setApproved(data.filter((m: Member) => m.is_approved))
    }
    setLoading(false)
  }

  async function fetchEvents() {
    const { data } = await supabase.from('events').select('*').order('created_at', { ascending: false })
    if (data) {
      setPendingEvents(data.filter((e: Event) => !e.is_approved))
      setApprovedEvents(data.filter((e: Event) => e.is_approved))
    }
  }

  async function fetchSuggestions() {
    const { data } = await supabase.from('suggestions').select('*').order('created_at', { ascending: false })
    if (data) {
      setPendingSuggestions(data.filter((s: Suggestion) => !s.is_approved))
      setApprovedSuggestions(data.filter((s: Suggestion) => s.is_approved))
    }
  }

  async function approveEvent(id: string) {
    setProcessing(id)
    await supabase.from('events').update({ is_approved: true }).eq('id', id)
    await fetchEvents()
    setProcessing(null)
  }

  async function rejectEvent(id: string) {
    setProcessing(id)
    await supabase.from('events').delete().eq('id', id)
    await fetchEvents()
    setProcessing(null)
  }

  async function approveSuggestion(id: string) {
    setProcessing(id)
    await supabase.from('suggestions').update({ is_approved: true }).eq('id', id)
    await fetchSuggestions()
    setProcessing(null)
  }

  async function rejectSuggestion(id: string) {
    setProcessing(id)
    await supabase.from('suggestions').delete().eq('id', id)
    await fetchSuggestions()
    setProcessing(null)
  }

  async function approveMember(id: string) {
    setProcessing(id)
    const { data: member } = await supabase.from('profiles').select('username, email').eq('id', id).single()
    await fetch('/api/admin-profiles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: id }),
    })
    if (member?.email) {
      await fetch('/api/welcome-member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: member.username, email: member.email }),
      })
    }
    await fetchMembers()
    setProcessing(null)
  }

  async function rejectMember(id: string) {
    setProcessing(id)
    await fetch('/api/admin-remove-member', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: id }),
    })
    await supabase.from('profiles').delete().eq('id', id)
    await fetchMembers()
    setProcessing(null)
  }

  if (!authed) {
    return (
      <main style={s.loginPage}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Lilita+One&family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>
        <a href="/"><img src="/community-logo.png" alt="The Lounge Community" style={{height:52,width:'auto',marginBottom:28,display:'block'}}/></a>
        <div style={s.loginCard}>
          <div style={s.loginAccent} />
          <div style={s.loginBody}>
            <h1 style={{...s.logo, fontFamily:"'Lilita One',cursive", fontWeight:400, fontSize:'24px', letterSpacing:'-0.01em', marginBottom:'6px'}}>Admin Access</h1>
            <p style={{margin:'0 0 24px',fontSize:'12px',color:'#8A8070'}}>The Lounge Community</p>
            {loginError && <p style={s.error}>{loginError}</p>}
            <input type="password" placeholder="Enter password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')handleLogin()}} style={s.input}/>
            <input type="text" placeholder="Enter TOTP code" value={totp} onChange={e=>setTotp(e.target.value)} style={s.input}/>
            <button onClick={handleLogin} style={s.submitBtn} disabled={loginLoading}>{loginLoading?'Checking…':'Enter →'}</button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main style={s.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lilita+One&family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap');
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .ticker-seg { display:flex; align-items:center; padding:0 24px; font-size:11px; letter-spacing:0.1em; text-transform:uppercase; font-weight:700; white-space:nowrap; height:34px; }
        .ticker-track { display:inline-flex; animation:ticker 28s linear infinite; align-items:stretch; }
      `}</style>

      {/* Ticker */}
      <div style={s.ticker}>
        <div className="ticker-track">
          {[...TICKER_SEGS, ...TICKER_SEGS].map((seg, i) => (
            <span key={i} className="ticker-seg" style={{background:seg.bg, color:seg.color}}>{seg.text}</span>
          ))}
        </div>
      </div>

      {/* Header */}
      <div style={s.header}>
        <a href="/"><img src="/community-logo.png" alt="The Lounge Community" style={{height:44,width:'auto'}}/></a>
        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <span style={{fontSize:'12px',color:'#8A8070'}}>Paige - Your Virtual Office Manager</span>
          <span style={s.badge}>Admin</span>
          <a href="/api/admin-enter-platform" style={{padding:'7px 14px',backgroundColor:ACCENT,color:'#fff',borderRadius:'100px',fontSize:'12px',textDecoration:'none',fontWeight:700}}>Enter Platform →</a>
        </div>
      </div>

      <div style={s.main}>

        {/* Stats */}
        <div style={s.stats}>
          <div style={s.statCard}><p style={s.statNum}>{pending.length}</p><p style={s.statLabel}>Pending Members</p></div>
          <div style={s.statCard}><p style={s.statNum}>{approved.length}</p><p style={s.statLabel}>Approved Members</p></div>
          <div style={s.statCard}><p style={s.statNum}>{pendingEvents.length}</p><p style={s.statLabel}>Pending Events</p></div>
          <div style={s.statCard}><p style={s.statNum}>{pendingSuggestions.length}</p><p style={s.statLabel}>Pending Suggestions</p></div>
        </div>

        {/* Pending Suggestions */}
        <p style={s.sectionTitle}>Suggestions Pending Approval</p>
        {pendingSuggestions.length === 0 ? (
          <div style={s.empty}><p style={s.emptyText}>No pending suggestions ☕</p></div>
        ) : pendingSuggestions.map(suggestion => (
          <div key={suggestion.id} style={s.card}>
            <div style={s.cardAccent}/>
            <div style={s.cardBody}>
              <div style={s.memberInfo}>
                <p style={{...s.memberMeta,marginBottom:'4px',textTransform:'uppercase',letterSpacing:'1px',color:PURPLE}}>{suggestion.type}</p>
                <p style={s.memberName}>{suggestion.message}</p>
                <p style={s.memberMeta}>{new Date(suggestion.created_at).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</p>
              </div>
              <div style={s.actions}>
                <button style={s.rejectBtn} onClick={()=>rejectSuggestion(suggestion.id)} disabled={processing===suggestion.id}>Reject</button>
                <button style={s.approveBtn} onClick={()=>approveSuggestion(suggestion.id)} disabled={processing===suggestion.id}>{processing===suggestion.id?'…':'Approve →'}</button>
              </div>
            </div>
          </div>
        ))}

        {/* Approved Suggestions */}
        {approvedSuggestions.length > 0 && <>
          <p style={{...s.sectionTitle,marginTop:'28px'}}>Approved Suggestions</p>
          {approvedSuggestions.map(suggestion => (
            <div key={suggestion.id} style={s.card}>
              <div style={{...s.cardAccent,backgroundColor:GREEN}}/>
              <div style={s.cardBody}>
                <div style={s.memberInfo}>
                  <p style={{...s.memberMeta,marginBottom:'4px',textTransform:'uppercase',letterSpacing:'1px',color:PURPLE}}>{suggestion.type}</p>
                  <p style={s.memberName}>{suggestion.message}</p>
                </div>
                <div style={s.actions}>
                  <button style={s.rejectBtn} onClick={()=>rejectSuggestion(suggestion.id)} disabled={processing===suggestion.id}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </>}

        {/* Pending Events */}
        <p style={{...s.sectionTitle,marginTop:'28px'}}>Events Pending Approval</p>
        {pendingEvents.length === 0 ? (
          <div style={s.empty}><p style={s.emptyText}>No pending events ☕</p></div>
        ) : pendingEvents.map(event => (
          <div key={event.id} style={s.card}>
            <div style={s.cardAccent}/>
            <div style={s.cardBody}>
              <div style={s.memberInfo}>
                <p style={s.memberName}>{event.title}</p>
                <p style={s.memberMeta}>{event.date} at {event.time}</p>
                {event.description && <p style={{...s.memberMeta,marginTop:'4px'}}>{event.description}</p>}
                {event.link && <p style={{...s.memberMeta,marginTop:'4px'}}><a href={event.link} target="_blank" rel="noreferrer" style={{color:ACCENT}}>{event.link}</a></p>}
              </div>
              <div style={s.actions}>
                <button style={s.rejectBtn} onClick={()=>rejectEvent(event.id)} disabled={processing===event.id}>Reject</button>
                <button style={s.approveBtn} onClick={()=>approveEvent(event.id)} disabled={processing===event.id}>{processing===event.id?'…':'Approve →'}</button>
              </div>
            </div>
          </div>
        ))}

        {/* Approved Events */}
        {approvedEvents.length > 0 && <>
          <p style={{...s.sectionTitle,marginTop:'28px'}}>Approved Events</p>
          {approvedEvents.map(event => (
            <div key={event.id} style={s.card}>
              <div style={{...s.cardAccent,backgroundColor:GREEN}}/>
              <div style={s.cardBody}>
                <div style={s.memberInfo}>
                  <p style={s.memberName}>{event.title}</p>
                  <p style={s.memberMeta}>{event.date} at {event.time}</p>
                </div>
                <div style={s.actions}>
                  <button style={s.rejectBtn} onClick={()=>rejectEvent(event.id)} disabled={processing===event.id}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </>}

        {/* Pending Members */}
        <p style={{...s.sectionTitle,marginTop:'28px'}}>Members Pending Approval</p>
        {loading ? (
          <div style={s.empty}><p style={s.emptyText}>Loading…</p></div>
        ) : pending.length === 0 ? (
          <div style={s.empty}><p style={s.emptyText}>No pending members — you're all caught up ☕</p></div>
        ) : pending.map(member => (
          <div key={member.id} style={s.card}>
            <div style={s.cardAccent}/>
            <div style={s.cardBody}>
              <div style={s.avatar}>{member.avatar_emoji||'☕'}</div>
              <div style={s.memberInfo}>
                <p style={s.memberName}>{member.username}</p>
                <p style={s.memberMeta}>{member.location||'Unknown'} · {new Date(member.created_at).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</p>
              </div>
              <div style={s.actions}>
                <button style={s.rejectBtn} onClick={()=>rejectMember(member.id)} disabled={processing===member.id}>Reject</button>
                <button style={s.approveBtn} onClick={()=>approveMember(member.id)} disabled={processing===member.id}>{processing===member.id?'…':'Approve →'}</button>
              </div>
            </div>
          </div>
        ))}

        {/* Approved Members */}
        {approved.length > 0 && <>
          <p style={{...s.sectionTitle,marginTop:'28px'}}>Approved Members</p>
          {approved.map(member => (
            <div key={member.id} style={s.card}>
              <div style={{...s.cardAccent,backgroundColor:GREEN}}/>
              <div style={s.cardBody}>
                <div style={s.avatar}>{member.avatar_emoji||'☕'}</div>
                <div style={s.memberInfo}>
                  <p style={s.memberName}>{member.username}</p>
                  <p style={s.memberMeta}>{member.location||'Unknown'} · Approved</p>
                </div>
                <div style={s.actions}>
                  <button style={s.rejectBtn} onClick={()=>rejectMember(member.id)} disabled={processing===member.id}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </>}

      </div>
    </main>
  )
}