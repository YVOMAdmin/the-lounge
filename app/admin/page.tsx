'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
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

const s = {
  page: { minHeight: '100vh', backgroundColor: '#edeae4', fontFamily: 'Georgia, serif', padding: '0' },
  loginPage: { minHeight: '100vh', backgroundColor: '#edeae4', fontFamily: 'Georgia, serif', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  loginCard: { backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden', width: '360px' },
  loginAccent: { height: '4px', backgroundColor: '#e8602c' },
  loginBody: { padding: '36px' },
  ticker: { backgroundColor: '#1a1a1a', padding: '10px 24px', overflow: 'hidden' },
  tickerText: { margin: 0, fontSize: '11px', letterSpacing: '2px', color: '#ffffff', whiteSpace: 'nowrap' as const },
  header: { padding: '28px 40px 20px', borderBottom: '1px solid #ddd9d2', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logo: { margin: 0, fontSize: '28px', fontWeight: 700, color: '#1a1a1a', fontFamily: 'Georgia, serif' },
  badge: { display: 'inline-block', padding: '5px 14px', backgroundColor: '#1a1a1a', borderRadius: '20px', fontSize: '11px', color: '#ffffff', letterSpacing: '1px' },
  main: { padding: '32px 40px', maxWidth: '800px', margin: '0 auto' },
  sectionTitle: { margin: '0 0 20px', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase' as const, color: '#999' },
  card: { backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden', marginBottom: '12px' },
  cardAccent: { height: '4px', backgroundColor: '#e8602c' },
  cardBody: { padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' },
  avatar: { width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#edeae4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 },
  memberInfo: { flex: 1 },
  memberName: { margin: '0 0 2px', fontSize: '16px', fontWeight: 700, color: '#1a1a1a' },
  memberMeta: { margin: 0, fontSize: '12px', color: '#999' },
  actions: { display: 'flex', gap: '8px' },
  approveBtn: { padding: '10px 20px', backgroundColor: '#1a1a1a', color: '#ffffff', border: 'none', borderRadius: '24px', fontSize: '12px', fontFamily: 'Georgia, serif', cursor: 'pointer', fontWeight: 'bold', letterSpacing: '0.5px' },
  rejectBtn: { padding: '10px 20px', backgroundColor: 'transparent', color: '#999', border: '1.5px solid #ddd', borderRadius: '24px', fontSize: '12px', fontFamily: 'Georgia, serif', cursor: 'pointer', letterSpacing: '0.5px' },
  empty: { backgroundColor: '#ffffff', borderRadius: '16px', padding: '48px 24px', textAlign: 'center' as const },
  emptyText: { margin: 0, fontSize: '16px', fontStyle: 'italic', color: '#999' },
  stats: { display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' as const },
  statCard: { backgroundColor: '#ffffff', borderRadius: '12px', padding: '16px 20px', flex: 1 },
  statNum: { margin: '0 0 4px', fontSize: '28px', fontWeight: 700, color: '#1a1a1a' },
  statLabel: { margin: 0, fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase' as const, color: '#999' },
  input: { width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1.5px solid #ddd', fontFamily: 'Georgia, serif', fontSize: '14px', marginBottom: '12px', boxSizing: 'border-box' as const, outline: 'none' },
  submitBtn: { width: '100%', padding: '13px', backgroundColor: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '24px', fontFamily: 'Georgia, serif', fontSize: '13px', cursor: 'pointer', fontWeight: 'bold', letterSpacing: '0.5px' },
  error: { margin: '0 0 12px', fontSize: '13px', color: '#e8602c', fontFamily: 'Georgia, serif' },
}

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
    await supabase.from('profiles').update({ is_approved: true }).eq('id', id)
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
        <div style={s.loginCard}>
          <div style={s.loginAccent} />
          <div style={s.loginBody}>
            <h1 style={{ ...s.logo, marginBottom: '6px' }}>The Lounge</h1>
            <p style={{ margin: '0 0 28px', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#999' }}>Admin Access</p>
            {loginError && <p style={s.error}>{loginError}</p>}
            <input type="password" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleLogin() }} style={s.input} />
            <input type="text" placeholder="Enter TOTP code" value={totp} onChange={e => setTotp(e.target.value)} style={s.input} />
            <button onClick={handleLogin} style={s.submitBtn} disabled={loginLoading}>{loginLoading ? 'Checking...' : 'Enter →'}</button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main style={s.page}>
      <div style={s.ticker}>
        <p style={s.tickerText}>For the ones who keep it all running &nbsp;·&nbsp; For the ones who keep it all running &nbsp;·&nbsp; For the ones who keep it all running</p>
      </div>
  <div style={s.header}>
  <h1 style={s.logo}>The Lounge</h1>
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
    <span style={{ fontSize: '13px', color: '#999', fontFamily: 'Georgia, serif' }}>Paige - Your Virtual Office Manager</span>
    <span style={s.badge}>Admin</span>
    <a href="/" style={{ padding: '8px 16px', backgroundColor: '#e8602c', color: '#fff', borderRadius: '24px', fontSize: '12px', fontFamily: 'Georgia, serif', textDecoration: 'none', fontWeight: 'bold' }}>Enter Platform →</a>
  </div>
</div>


      <div style={s.main}>

        {/* Stats */}
        <div style={s.stats}>
          <div style={s.statCard}>
            <p style={s.statNum}>{pending.length}</p>
            <p style={s.statLabel}>Pending Members</p>
          </div>
          <div style={s.statCard}>
            <p style={s.statNum}>{approved.length}</p>
            <p style={s.statLabel}>Approved Members</p>
          </div>
          <div style={s.statCard}>
            <p style={s.statNum}>{pendingEvents.length}</p>
            <p style={s.statLabel}>Pending Events</p>
          </div>
          <div style={s.statCard}>
            <p style={s.statNum}>{pendingSuggestions.length}</p>
            <p style={s.statLabel}>Pending Suggestions</p>
          </div>
        </div>

        {/* Pending Suggestions */}
        <p style={s.sectionTitle}>Suggestions Pending Approval</p>
        {pendingSuggestions.length === 0 ? (
          <div style={s.empty}><p style={s.emptyText}>No pending suggestions ☕</p></div>
        ) : (
          pendingSuggestions.map(suggestion => (
            <div key={suggestion.id} style={s.card}>
              <div style={s.cardAccent} />
              <div style={s.cardBody}>
                <div style={s.memberInfo}>
                  <p style={{ ...s.memberMeta, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>{suggestion.type}</p>
                  <p style={s.memberName}>{suggestion.message}</p>
                  <p style={s.memberMeta}>{new Date(suggestion.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <div style={s.actions}>
                  <button style={s.rejectBtn} onClick={() => rejectSuggestion(suggestion.id)} disabled={processing === suggestion.id}>Reject</button>
                  <button style={s.approveBtn} onClick={() => approveSuggestion(suggestion.id)} disabled={processing === suggestion.id}>
                    {processing === suggestion.id ? '...' : 'Approve →'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Approved Suggestions */}
        {approvedSuggestions.length > 0 && (
          <>
            <p style={{ ...s.sectionTitle, marginTop: '32px' }}>Approved Suggestions</p>
            {approvedSuggestions.map(suggestion => (
              <div key={suggestion.id} style={s.card}>
                <div style={{ ...s.cardAccent, backgroundColor: '#4caf7d' }} />
                <div style={s.cardBody}>
                  <div style={s.memberInfo}>
                    <p style={{ ...s.memberMeta, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>{suggestion.type}</p>
                    <p style={s.memberName}>{suggestion.message}</p>
                  </div>
                  <div style={s.actions}>
                    <button style={s.rejectBtn} onClick={() => rejectSuggestion(suggestion.id)} disabled={processing === suggestion.id}>Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Pending Events */}
        <p style={{ ...s.sectionTitle, marginTop: '32px' }}>Events Pending Approval</p>
        {pendingEvents.length === 0 ? (
          <div style={s.empty}><p style={s.emptyText}>No pending events ☕</p></div>
        ) : (
          pendingEvents.map(event => (
            <div key={event.id} style={s.card}>
              <div style={s.cardAccent} />
              <div style={s.cardBody}>
                <div style={s.memberInfo}>
                  <p style={s.memberName}>{event.title}</p>
                  <p style={s.memberMeta}>{event.date} at {event.time}</p>
                  {event.description && <p style={{ ...s.memberMeta, marginTop: '4px' }}>{event.description}</p>}
                  {event.link && <p style={{ ...s.memberMeta, marginTop: '4px' }}><a href={event.link} target="_blank" rel="noreferrer">{event.link}</a></p>}
                </div>
                <div style={s.actions}>
                  <button style={s.rejectBtn} onClick={() => rejectEvent(event.id)} disabled={processing === event.id}>Reject</button>
                  <button style={s.approveBtn} onClick={() => approveEvent(event.id)} disabled={processing === event.id}>
                    {processing === event.id ? '...' : 'Approve →'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Approved Events */}
        {approvedEvents.length > 0 && (
          <>
            <p style={{ ...s.sectionTitle, marginTop: '32px' }}>Approved Events</p>
            {approvedEvents.map(event => (
              <div key={event.id} style={s.card}>
                <div style={{ ...s.cardAccent, backgroundColor: '#4caf7d' }} />
                <div style={s.cardBody}>
                  <div style={s.memberInfo}>
                    <p style={s.memberName}>{event.title}</p>
                    <p style={s.memberMeta}>{event.date} at {event.time}</p>
                  </div>
                  <div style={s.actions}>
                    <button style={s.rejectBtn} onClick={() => rejectEvent(event.id)} disabled={processing === event.id}>Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Pending Members */}
        <p style={{ ...s.sectionTitle, marginTop: '32px' }}>Members Pending Approval</p>
        {loading ? (
          <div style={s.empty}><p style={s.emptyText}>Loading...</p></div>
        ) : pending.length === 0 ? (
          <div style={s.empty}><p style={s.emptyText}>No pending members — you're all caught up ☕</p></div>
        ) : (
          pending.map(member => (
            <div key={member.id} style={s.card}>
              <div style={s.cardAccent} />
              <div style={s.cardBody}>
                <div style={s.avatar}>{member.avatar_emoji || '☕'}</div>
                <div style={s.memberInfo}>
                  <p style={s.memberName}>{member.username}</p>
                  <p style={s.memberMeta}>{member.location || 'Unknown'} · {new Date(member.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <div style={s.actions}>
                  <button style={s.rejectBtn} onClick={() => rejectMember(member.id)} disabled={processing === member.id}>Reject</button>
                  <button style={s.approveBtn} onClick={() => approveMember(member.id)} disabled={processing === member.id}>
                    {processing === member.id ? '...' : 'Approve →'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Approved Members */}
        {approved.length > 0 && (
          <>
            <p style={{ ...s.sectionTitle, marginTop: '32px' }}>Approved Members</p>
            {approved.map(member => (
              <div key={member.id} style={s.card}>
                <div style={{ ...s.cardAccent, backgroundColor: '#4caf7d' }} />
                <div style={s.cardBody}>
                  <div style={s.avatar}>{member.avatar_emoji || '☕'}</div>
                  <div style={s.memberInfo}>
                    <p style={s.memberName}>{member.username}</p>
                    <p style={s.memberMeta}>{member.location || 'Unknown'} · Approved</p>
                  </div>
                  <div style={s.actions}>
                    <button style={s.rejectBtn} onClick={() => rejectMember(member.id)} disabled={processing === member.id}>Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

      </div>
    </main>
  )
}
