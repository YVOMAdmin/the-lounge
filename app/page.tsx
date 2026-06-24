'use client'

import { useState } from "react";

const FONT = `@import url('https://fonts.googleapis.com/css2?family=Lilita+One&family=Inter:wght@400;500;600&display=swap');`;

const TICKER_SEGS = [
  { text: 'For the ones who keep it all running', bg: '#FFCDD9', color: '#1A1208' },
  { text: '✦', bg: '#FFCDD9', color: '#7B5EA7' },
  { text: 'The Lounge Community', bg: '#B8F0D0', color: '#1A1208' },
  { text: '✦', bg: '#B8F0D0', color: '#7B5EA7' },
  { text: 'Admin & EA Support Professionals', bg: '#C5B8F5', color: '#1A1208' },
  { text: '✦', bg: '#C5B8F5', color: '#F9C4A0' },
  { text: 'For the ones who keep it all running', bg: '#FFE5B4', color: '#1A1208' },
  { text: '✦', bg: '#FFE5B4', color: '#7B5EA7' },
  { text: 'The Lounge Community', bg: '#B3D9FF', color: '#1A1208' },
  { text: '✦', bg: '#B3D9FF', color: '#7B5EA7' },
];

const BENEFITS = [
  { text: 'A place to talk & seek support', bg: '#FFCDD9' },
  { text: 'Events & networking opportunities', bg: '#C5B8F5' },
  { text: 'Access to the job board', bg: '#FFE5B4' },
  { text: 'Promote your own services & events', bg: '#B8F0D0' },
  { text: 'Access to helpful resources', bg: '#B3D9FF' },
];

const FAQS = [
  { q: 'Who is The Lounge Community for?', a: 'The Lounge is built for Virtual Assistants, Executive Assistants, Personal Assistants, Office Managers, and Operations specialists. If you work in admin or executive support, this is your place.' },
  { q: 'How do I join?', a: 'Simply click "Come and Connect" and complete a short sign-up form. All new members are reviewed before being approved to keep the community safe and relevant.' },
  { q: 'What happens after the Founders Offer ends?', a: "Your £2.00/month rate is locked in forever. You will never be moved to the full price — that's our promise to our founding members." },
  { q: 'Can I cancel my membership at any time?', a: 'Yes, absolutely. No contracts, no fuss. You can cancel whenever you like.' },
  { q: 'Can I promote my own services as a member?', a: 'Yes! Paid members can share and promote their own services and events within the community.' },
  { q: 'Is The Lounge moderated?', a: 'Yes. The Lounge is an actively moderated space. We want it to remain kind, supportive and professional for everyone.' },
  { q: 'How do I suggest a feature or give feedback?', a: 'Members have access to the Suggestion Box inside the platform. We read every single one.' },
  { q: "Can I attend events if I'm on the free plan?", a: 'Free members can view upcoming events but please note that events hosted through The Lounge will require a paid membership to RSVP and attend. Some events may also be available through external organisers directly.' },
];

function ScallopBadge({ text, bg }: { text: string; bg: string }) {
  const n = 14;
  const r = 44;
  const bump = 9;
  const cx = 60, cy = 60;
  const points = Array.from({ length: n * 2 }).map((_, i) => {
    const angle = (i / (n * 2)) * Math.PI * 2 - Math.PI / 2;
    const radius = i % 2 === 0 ? r + bump : r - bump * 0.3;
    return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
  });
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join(' ') + ' Z';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 140, height: 140, position: 'relative', flexShrink: 0 }}>
      <svg width="140" height="140" viewBox="0 0 120 120" style={{ position: 'absolute', top: 0, left: 0 }}>
        <path d={pathD} fill="white" transform="scale(1.08) translate(-4.5, -4.5)" />
        <path d={pathD} fill={bg} />
      </svg>
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 11, lineHeight: 1.4, color: '#1A1208', padding: '0 14px', maxWidth: 90 }}>{text}</div>
    </div>
  );
}

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <style>{`
        ${FONT}
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F5F0E8; font-family: 'Inter', sans-serif; color: #1A1208; }

        .ticker { overflow: hidden; display: flex; height: 34px; align-items: stretch; }
        .ticker-track { display: inline-flex; animation: ticker 32s linear infinite; align-items: stretch; }
        @keyframes ticker { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .ticker-seg { display: flex; align-items: center; padding: 0 24px; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 700; white-space: nowrap; height: 34px; }

        .nav { position: sticky; top: 0; z-index: 100; background: #F5F0E8; border-bottom: 2px solid #F9C4A0; padding: 10px 20px; display: flex; align-items: center; justify-content: space-between; }
        .hamburger { background: none; border: none; cursor: pointer; display: flex; flex-direction: column; gap: 5px; padding: 4px; }
        .hamburger span { display: block; width: 24px; height: 2px; background: #7B5EA7; border-radius: 2px; }

        .btn-outline { background: transparent; color: #F9C4A0; border: 2px solid #F9C4A0; border-radius: 100px; padding: 6px 16px; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 12px; cursor: pointer; transition: all 0.15s; text-decoration: none; display: inline-block; }
        .btn-outline:hover { background: #F9C4A0; color: #1A1208; }

        .drawer { position: fixed; top: 0; left: 0; bottom: 0; width: 260px; background: #fff; z-index: 200; box-shadow: 4px 0 24px rgba(0,0,0,0.1); transform: translateX(-100%); transition: transform 0.25s ease; padding: 32px 24px; }
        .drawer.open { transform: translateX(0); }
        .drawer-close { background: none; border: none; font-size: 22px; cursor: pointer; color: #7B5EA7; margin-bottom: 28px; display: block; }
        .drawer-title { font-family: 'Lilita One', cursive; font-size: 18px; color: #7B5EA7; margin-bottom: 20px; }
        .drawer-link { display: block; padding: 12px 0; font-size: 14px; font-weight: 600; color: #1A1208; border-bottom: 1px solid #F0EDE8; cursor: pointer; transition: color 0.15s; font-family: 'Inter', sans-serif; text-decoration: none; }
        .drawer-link:hover { color: #7B5EA7; }
        .overlay-bg { position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 150; }

        .page-tabs { display: flex; gap: 8px; padding: 16px 20px 0; justify-content: center; }
        .page-tab { padding: 8px 18px; border: 2px solid #F9C4A0; background: transparent; font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600; color: #F9C4A0; border-radius: 100px; cursor: pointer; transition: all 0.15s; }
        .page-tab.on { background: #F9C4A0; color: #1A1208; }

        .hero { text-align: center; padding: 24px 24px 8px; }
        .intro { max-width: 640px; margin: 0 auto 28px; text-align: center; padding: 0 20px; }
        .intro-lead { font-family: 'Lilita One', cursive; font-size: 17px; color: #7B5EA7; margin-bottom: 12px; }
        .intro-body { font-size: 13px; line-height: 1.85; color: #3A3530; margin-bottom: 10px; }
        .intro-tag { font-size: 14px; font-style: italic; color: #7B5EA7; font-weight: 600; margin-top: 4px; display: block; }
        .join-wrap { text-align: center; margin-bottom: 44px; }

        .benefits-section { padding: 0 20px 48px; width: 100%; }
        .benefits-title { font-family: 'Lilita One', cursive; font-size: 22px; color: #7B5EA7; text-align: center; margin-bottom: 32px; }
        .benefits-cluster { position: relative; width: 340px; height: 340px; margin: 0 auto; }

        .pricing-section { background: #fff; border-radius: 20px; max-width: 680px; margin: 0 auto 48px; padding: 32px 28px; border: 2px solid #F9C4A0; }
        .pricing-title { font-family: 'Lilita One', cursive; font-size: 20px; color: #7B5EA7; text-align: center; margin-bottom: 24px; }
        .pricing-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .pricing-card { border-radius: 14px; padding: 20px; border: 2px solid #F9C4A0; }
        .pricing-card.paid { background: linear-gradient(135deg, #FFCDD9 0%, #C5B8F5 100%); border-color: transparent; }
        .pricing-tier { font-family: 'Lilita One', cursive; font-size: 18px; color: #1A1208; margin-bottom: 4px; }
        .pricing-price { font-size: 22px; font-weight: 700; color: #7B5EA7; margin-bottom: 14px; font-family: 'Lilita One', cursive; }
        .pricing-price span { font-size: 12px; font-weight: 400; color: #6B6358; font-family: 'Inter', sans-serif; }
        .pricing-feature { font-size: 12px; color: #3A3530; margin-bottom: 7px; display: flex; align-items: flex-start; gap: 7px; line-height: 1.4; font-family: 'Inter', sans-serif; }
        .pricing-feature::before { content: '✓'; color: #7B5EA7; font-weight: 700; flex-shrink: 0; }
        .pricing-feature.locked::before { content: '✕'; color: #C4BEB6; }
        .pricing-feature.locked { color: #C4BEB6; }

        .faq-section { max-width: 680px; margin: 0 auto; padding: 0 20px 48px; }
        .faq-title { font-family: 'Lilita One', cursive; font-size: 22px; color: #7B5EA7; text-align: center; margin-bottom: 24px; }
        .faq-item { background: #fff; border: 2px solid #F9C4A0; border-radius: 14px; margin-bottom: 10px; overflow: hidden; }
        .faq-q { padding: 16px 20px; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 13px; color: #1A1208; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 12px; }
        .faq-q:hover { color: #7B5EA7; }
        .faq-arrow { font-size: 16px; color: #F9C4A0; flex-shrink: 0; transition: transform 0.2s; }
        .faq-arrow.open { transform: rotate(180deg); }
        .faq-a { padding: 0 20px 16px; font-size: 13px; color: #3A3530; line-height: 1.75; font-family: 'Inter', sans-serif; }

        .footer { text-align: center; padding: 24px; border-top: 2px solid #F9C4A0; font-size: 12px; color: #9E9587; font-family: 'Inter', sans-serif; }
        .footer a { color: #7B5EA7; text-decoration: none; font-weight: 600; margin: 0 8px; }
      `}</style>

      <div className="ticker">
        <div className="ticker-track">
          {[...TICKER_SEGS, ...TICKER_SEGS].map((seg, i) => (
            <span key={i} className="ticker-seg" style={{ background: seg.bg, color: seg.color }}>{seg.text}</span>
          ))}
        </div>
      </div>

      <nav className="nav">
        <button className="hamburger" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <span/><span/><span/>
        </button>
        <a href="/auth/login" className="btn-outline">Log in</a>
      </nav>

      {menuOpen && <div className="overlay-bg" onClick={() => setMenuOpen(false)} />}
      <div className={`drawer ${menuOpen ? 'open' : ''}`}>
        <button className="drawer-close" onClick={() => setMenuOpen(false)}>✕</button>
        <div className="drawer-title">Menu</div>
        <a href="mailto:hello@theloungecommunity.co.uk" className="drawer-link">✉️ Contact Us</a>
      </div>

      {/* Page Tabs */}
      <div className="page-tabs">
        <button className={`page-tab ${activeTab === 'home' ? 'on' : ''}`} onClick={() => setActiveTab('home')}>Home</button>
        <button className={`page-tab ${activeTab === 'pricing' ? 'on' : ''}`} onClick={() => setActiveTab('pricing')}>Pricing & Subscriptions</button>
        <button className={`page-tab ${activeTab === 'faqs' ? 'on' : ''}`} onClick={() => setActiveTab('faqs')}>FAQs</button>
      </div>

      {/* HOME TAB */}
      {activeTab === 'home' && <>
        <div className="hero">
          <img src="/community-logo.png" alt="The Lounge Community" style={{ height: '130px', width: 'auto', margin: '0 auto', display: 'block' }} />
        </div>

        <div className="intro">
          <div className="intro-lead">Welcome to The Lounge Community</div>
          <p className="intro-body">An online platform and professional community built for Virtual Assistants, Executive Assistants, Personal Assistants, Office Managers, and Operations specialists who keep everything running behind the scenes. Created out of a real experience of professional isolation as a freelancer — because finding your people shouldn't be this hard.</p>
          <p className="intro-body">The Lounge is somewhere to connect with others in the same world, share what's actually going on, ask the questions you can't ask anywhere else, and grow — together. Whether you're brand new to the industry or a seasoned pro, this is your place.</p>
          <span className="intro-tag">Connect, share, and grow — with people who just get it.</span>
        </div>

        <div className="join-wrap">
          <a href="/auth/signup" className="btn-outline">Come and Connect</a>
        </div>

        <div className="benefits-section">
          <div className="benefits-title">The Benefits of Being a Member</div>
          <div className="benefits-cluster">
            <div style={{ position: 'absolute', top: 6, left: 6 }}><ScallopBadge text={BENEFITS[0].text} bg={BENEFITS[0].bg} /></div>
            <div style={{ position: 'absolute', top: 6, right: 6 }}><ScallopBadge text={BENEFITS[1].text} bg={BENEFITS[1].bg} /></div>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}><ScallopBadge text={BENEFITS[2].text} bg={BENEFITS[2].bg} /></div>
            <div style={{ position: 'absolute', bottom: 6, left: 6 }}><ScallopBadge text={BENEFITS[3].text} bg={BENEFITS[3].bg} /></div>
            <div style={{ position: 'absolute', bottom: 6, right: 6 }}><ScallopBadge text={BENEFITS[4].text} bg={BENEFITS[4].bg} /></div>
          </div>
        </div>
      </>}

      {/* PRICING TAB */}
      {activeTab === 'pricing' && <div style={{ padding: '24px 20px 48px' }}>
        <div className="pricing-section">
          <div className="pricing-title">Membership Plans</div>
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="pricing-tier">Free</div>
              <div className="pricing-price">£0 <span>/ month</span></div>
              <div className="pricing-feature">Events & networking (read only)</div>
              <div className="pricing-feature">Job Board (read only)</div>
              <div className="pricing-feature locked">Full Feed access (inc. polls & posts)</div>
              <div className="pricing-feature locked">Resources library</div>
              <div className="pricing-feature locked">Suggestion Box</div>
              <div className="pricing-feature locked">Promote your own services & events</div>
            </div>
            <div className="pricing-card paid">
              <div className="pricing-tier">Member</div>
              <div className="pricing-price">£2.00 <span style={{textDecoration:'line-through', color:'#9E9587'}}>£5.00</span> <span>/ month</span></div>
              <div style={{fontSize:11, color:'#7B5EA7', fontWeight:600, fontFamily:"'Inter',sans-serif", marginBottom:12, background:'rgba(255,255,255,0.5)', borderRadius:8, padding:'4px 8px', display:'inline-block'}}>🌟 Special Founders Offer — limited time only!</div>
              <div className="pricing-feature">Events & networking</div>
              <div className="pricing-feature">Job Board</div>
              <div className="pricing-feature">Full Feed access (inc. polls & posts)</div>
              <div className="pricing-feature">Resources library</div>
              <div className="pricing-feature">Suggestion Box</div>
              <div className="pricing-feature">Promote your own services & events</div>
            </div>
          </div>
          <div style={{fontSize:12, color:'#1A1208', fontFamily:"'Inter',sans-serif", lineHeight:1.7, marginTop:20, fontStyle:'italic', borderTop:'1px solid #F9C4A0', paddingTop:16, textAlign:'center'}}>🌟 Our Founders Offer is an exclusive rate for our very first members. Become part of the community for just £2.00/month and keep your founders status forever — limited spaces available.</div>
        </div>
      </div>}

      {/* FAQS TAB */}
      {activeTab === 'faqs' && <div className="faq-section" style={{marginTop:24}}>
        <div className="faq-title">Frequently Asked Questions</div>
        {FAQS.map((faq, i) => (
          <div key={i} className="faq-item">
            <div className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              {faq.q}
              <span className={`faq-arrow ${openFaq === i ? 'open' : ''}`}>▼</span>
            </div>
            {openFaq === i && <div className="faq-a">{faq.a}</div>}
          </div>
        ))}
      </div>}

      <footer className="footer">
        <div>© {new Date().getFullYear()} Your Virtual Office Manager Ltd · The Lounge Community</div>
        <div style={{ marginTop: 8 }}>
          <a href="/privacy">Privacy Policy</a>·
          <a href="/terms">Terms of Use</a>·
          <a href="mailto:hello@theloungecommunity.co.uk">Contact</a>
        </div>
      </footer>
    </>
  );
}
