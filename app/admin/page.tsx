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

const s = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#edeae4',
    fontFamily: 'Georgia, serif',
    padding: '0',
  },
  ticker: {
    backgroundColor: '#1a1a1a',
    padding: '10px 24px',
    overflow: 'hidden',
  },
  tickerText: {
    margin: 0,
    fontSize: '11px',
    letterSpacing: '2px',
    color: '#ffffff',
    whiteSpace: 'nowrap' as const,
  },
  header: {
    padding: '28px 40px 20px',
    borderBottom: '1px solid #ddd9d2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    margin: 0,
    fontSize: '28px',
    fontWeight: 700,
    color: '#1a1a1a',
    fontFamily: 'Georgia, serif',
  },
  badge: {
    display: 'inline-block',
    padding: '5px 14px',
    backgroundColor: '#1a1a1a',
    borderRadius: '20px',
    fontSize: '11px',
    color: '#ffffff',
    letterSpacing: '1px',
  },
  main: {
    padding: '32px 40px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  sectionTitle: {
    margin: '0 0 20px',
    fontSize: '11px',
    letterSpacing: '3px',
    textTransform: 'uppercase' as const,
    color: '#999',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    overflow: 'hidden',
    marginBottom: '12px',
  },
  cardAccent: {
    height: '4px',
    backgroundColor: '#e8602c',
  },
  cardBody: {
    padding: '20px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
  },
  avatar: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: '#edeae4',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
    flexShrink: 0,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    margin: '0 0 2px',
    fontSize: '16px',
    fontWeight: 700,
    color: '#1a1a1a',
  },
  memberMeta: {
    margin: 0,
    fontSize: '12px',
    color: '#999',
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  approveBtn: {
    padding: '10px 20px',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    border: 'none',
    borderRadius: '24px',
    fontSize: '12px',
    fontFamily: 'Georgia, serif',
    cursor: 'pointer',
    fontWeight: 'bold',
    letterSpacing: '0.5px',
  },
  rejectBtn: {
    padding: '10px 20px',
    backgroundColor: 'transparent',
    color: '#999',
    border: '1.5px solid #ddd',
    borderRadius: '24px',
    fontSize: '12px',
    fontFamily: 'Georgia, serif',
    cursor: 'pointer',
    letterSpacing: '0.5px',
  },
  empty: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '48px 24px',
    textAlign: 'center' as const,
  },
  emptyText: {
    margin: 0,
    fontSize: '16px',
    fontStyle: 'italic',
    color: '#999',
  },
  stats: {
    display: 'flex',
    gap: '12px',
    marginBottom: '28px',
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '16px 20px',
    flex: 1,
  },
  statNum: {
    margin: '0 0 4px',
    fontSize: '28px',
    fontWeight: 700,
    color: '#1a1a1a',
  },
  statLabel: {
    margin: 0,
    fontSize: '11px',
    letterSpacing: '2px',
    textTransform: 'uppercase' as const,
    color: '#999',
  },
}

export default function AdminPage() {
  const [pending, setPending] = useState<Member[]>([])
  const [approved, setApproved] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    fetchMembers()
  }, [])

  async function fetchMembers() {
    setLoading(true)
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) {
      setPending(data.filter((m: Member) => !m.is_approved))
      setApproved(data.filter((m: Member) => m.is_approved))
    }
    setLoading(false)
  }

  async function approveMember(id: string) {
    setProcessing(id)
    await supabase
      .from('profiles')
      .update({ is_approved: true })
      .eq('id', id)
    await fetchMembers()
    setProcessing(null)
  }

  async function rejectMember(id: string) {
    setProcessing(id)
    await supabase
      .from('profiles')
      .delete()
      .eq('id', id)
    await fetchMembers()
    setProcessing(null)
  }

  return (
    <main style={s.page}>
      <div style={s.ticker}>
        <p style={s.tickerText}>
          For the ones who keep it all running &nbsp;·&nbsp; For the ones who keep it all running &nbsp;·&nbsp; For the ones who keep it all running
        </p>
      </div>

      <div style={s.header}>
        <h1 style={s.logo}>The Lounge</h1>
        <span style={s.badge}>Admin</span>
      </div>

      <div style={s.main}>

        {/* Stats */}
        <div style={s.stats}>
          <div style={s.statCard}>
            <p style={s.statNum}>{pending.length}</p>
            <p style={s.statLabel}>Pending</p>
          </div>
          <div style={s.statCard}>
            <p style={s.statNum}>{approved.length}</p>
            <p style={s.statLabel}>Approved</p>
          </div>
          <div style={s.statCard}>
            <p style={s.statNum}>{pending.length + approved.length}</p>
            <p style={s.statLabel}>Total</p>
          </div>
        </div>

        {/* Pending */}
        <p style={s.sectionTitle}>Pending Approval</p>

        {loading ? (
          <div style={s.empty}><p style={s.emptyText}>Loading...</p></div>
        ) : pending.length === 0 ? (
          <div style={s.empty}>
            <p style={s.emptyText}>No pending members — you're all caught up ☕</p>
          </div>
        ) : (
          pending.map(member => (
            <div key={member.id} style={s.card}>
              <div style={s.cardAccent} />
              <div style={s.cardBody}>
                <div style={s.avatar}>{member.avatar_emoji || '☕'}</div>
                <div style={s.memberInfo}>
                  <p style={s.memberName}>{member.username}</p>
                  <p style={s.memberMeta}>{member.location} · {new Date(member.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <div style={s.actions}>
                  <button
                    style={s.rejectBtn}
                    onClick={() => rejectMember(member.id)}
                    disabled={processing === member.id}
                  >
                    Reject
                  </button>
                  <button
                    style={s.approveBtn}
                    onClick={() => approveMember(member.id)}
                    disabled={processing === member.id}
                  >
                    {processing === member.id ? '...' : 'Approve →'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Approved */}
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
                    <p style={s.memberMeta}>{member.location} · Approved</p>
                  </div>
                  <span style={{ fontSize: '11px', color: '#4caf7d', letterSpacing: '1px' }}>✓ MEMBER</span>
                </div>
              </div>
            ))}
          </>
        )}

      </div>
    </main>
  )
}
