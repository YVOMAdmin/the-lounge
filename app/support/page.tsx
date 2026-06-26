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

type Org = { name: string; url: string; desc: string; note?: string }

const MENTAL_HEALTH: Org[] = [
  { name: 'Mind', url: 'https://www.mind.org.uk', desc: 'Mental health support, information and advice' },
  { name: 'CALM (Campaign Against Living Miserably)', url: 'https://www.thecalmzone.net', desc: 'Support for anyone who needs to talk, including a free helpline and webchat' },
  { name: 'Samaritans', url: 'https://www.samaritans.org', desc: 'Free, confidential support 24/7. Call 116 123' },
  { name: 'Marmalade Trust', url: 'https://www.marmaladetrust.org/loneliness', desc: 'Loneliness support and resources, available to everyone', note: 'Based in Bristol, North Somerset and South Gloucestershire, but resources are available to all.' },
]

const WORKPLACE_LEGAL: Org[] = [
  { name: 'Citizens Advice', url: 'https://www.citizensadvice.org.uk', desc: 'Free, confidential advice on legal, financial and other problems' },
  { name: 'Acas', url: 'https://www.acas.org.uk', desc: 'Free workplace advice and support for employees and employers' },
]

const MONEY_MENTAL_HEALTH: Org[] = [
  { name: 'Money and Mental Health Policy Institute', url: 'https://www.moneyandmentalhealth.org', desc: 'Practical help for people struggling with both money and mental health' },
]

function OrgCard({ org }: { org: Org }) {
  return (
    <div style={{background:'#fff',border:'2px solid #F9C4A0',borderRadius:16,padding:'20px 22px',marginBottom:14}}>
      <div style={{fontFamily:"'Lilita One',cursive",fontWeight:400,fontSize:16,color:'#1A1208',marginBottom:6}}>{org.name}</div>
      <p style={{fontSize:13,color:'#6B6358',lineHeight:1.6,margin:0,marginBottom:org.note?6:14}}>{org.desc}</p>
      {org.note && <p style={{fontSize:11,color:'#9E9587',fontStyle:'italic',lineHeight:1.5,margin:'0 0 14px'}}>{org.note}</p>}
      <a href={org.url} target="_blank" rel="noopener noreferrer" style={{display:'inline-block',padding:'8px 18px',background:'#F9C4A0',color:'#1A1208',borderRadius:100,fontFamily:"'Inter',sans-serif",fontSize:12,fontWeight:600,textDecoration:'none'}}>
        Visit website →
      </a>
    </div>
  )
}

function Section({ title, orgs }: { title: string; orgs: Org[] }) {
  return (
    <div style={{marginBottom:36}}>
      <h2 style={{fontFamily:"'Lilita One',cursive",fontWeight:400,fontSize:20,color:'#7B5EA7',marginBottom:16}}>{title}</h2>
      {orgs.map(org => <OrgCard key={org.name} org={org} />)}
    </div>
  )
}

export default function SupportPage() {
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

      <div style={{maxWidth:680,margin:'0 auto',padding:'24px 24px 40px'}}>
        <a href="/" style={{fontSize:12,color:'#9E9587',textDecoration:'none'}}>← Back to The Lounge</a>

        <div style={{marginTop:24,marginBottom:32}}>
          <h1 style={{fontFamily:"'Lilita One',cursive",fontWeight:400,fontSize:28,color:'#7B5EA7',marginBottom:12,letterSpacing:'-0.01em'}}>Support Beyond Our Walls 🧡</h1>
          <p style={{fontSize:14,color:'#3A3530',lineHeight:1.8}}>Sometimes life gets heavy. Whether you're struggling with your mental health, finances, or workplace stress — you don't have to face it alone. Here are some organisations that can help. 🧡</p>
        </div>

        <Section title="Mental Health" orgs={MENTAL_HEALTH} />
        <Section title="Workplace & Legal" orgs={WORKPLACE_LEGAL} />
        <Section title="Money & Mental Health" orgs={MONEY_MENTAL_HEALTH} />
      </div>

      <footer className="site-footer">
        <div className="site-footer-copy">© {new Date().getFullYear()} Your Virtual Office Manager Ltd · The Lounge Community</div>
        <div className="site-footer-links">
          <a href="/privacy" className="site-footer-link">Privacy Policy</a>
          <span style={{color:'#D4CEC5'}}>·</span>
          <a href="/terms" className="site-footer-link">Terms of Use</a>
          <span style={{color:'#D4CEC5'}}>·</span>
          <a href="mailto:hello@theloungecommunity.co.uk" className="site-footer-link">Contact</a>
        </div>
      </footer>
    </main>
  )
}
