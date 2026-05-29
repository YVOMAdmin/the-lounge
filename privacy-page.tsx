// app/privacy/page.tsx
// Add this file to your project at: app/privacy/page.tsx

export default function PrivacyPage() {
  return (
    <div style={styles.page}>
      <div style={styles.wrap}>

        {/* Header */}
        <div style={styles.header}>
          <a href="/" style={styles.back}>← Back to The Lounge</a>
          <div style={styles.badge}>Legal</div>
        </div>

        <h1 style={styles.h1}>Privacy Policy</h1>
        <p style={styles.meta}>The Lounge Community · theloungecommunity.co.uk · Last updated: 28 May 2026</p>
        <hr style={styles.rule}/>

        <Section title="1. Who We Are">
          <p>The Lounge Community ("The Lounge", "we", "us", "our") is a private online community platform for administrative and executive support professionalsdministrative professionals. The Lounge is operated by Your Virtual Office Manager Ltd, a company registered in England and Wales.</p>
          <p style={styles.mt}><strong>Data Controller:</strong> Your Virtual Office Manager Ltd<br/>Contact: <a href="mailto:hello@theloungecommunity.co.uk" style={styles.link}>hello@theloungecommunity.co.uk</a></p>
        </Section>

        <Section title="2. What This Policy Covers">
          <p>This Privacy Policy explains how we collect, use, store and protect your personal data when you use theloungecommunity.co.uk. It applies to all members and visitors of The Lounge Community.</p>
          <p style={styles.mt}>By creating an account and using The Lounge, you agree to the collection and use of your information as described in this policy.</p>
        </Section>

        <Section title="3. What Data We Collect">
          <p style={styles.subhead}>Data you provide directly</p>
          <p>When you create an account, we collect:</p>
          <ul style={styles.ul}>
            <li>Your email address</li>
            <li>Your chosen username</li>
            <li>Your timezone or location (optional)</li>
            <li>Your chosen avatar emoji</li>
            <li>Your password (stored in encrypted form — we never see it in plain text)</li>
          </ul>
          <p style={styles.mt}>When you use the platform, we collect:</p>
          <ul style={styles.ul}>
            <li>Posts and replies you write</li>
            <li>Polls you create and votes you cast</li>
            <li>Events you submit or RSVP to</li>
            <li>Your likes and interactions</li>
          </ul>
          <p style={styles.subhead}>Data collected automatically</p>
          <p>When you visit The Lounge, we may automatically collect your IP address, browser type and version, pages visited and time spent, and referring website. We use this data solely to keep the platform running securely and do not use it for advertising or tracking purposes.</p>
        </Section>

        <Section title="4. Why We Collect Your Data">
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Purpose</th>
                <th style={styles.th}>Legal Basis</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Creating and managing your account", "Performance of a contract"],
                ["Displaying your posts and replies to other members", "Performance of a contract"],
                ["Sending essential service emails", "Performance of a contract"],
                ["Keeping the platform secure and preventing abuse", "Legitimate interests"],
                ["Improving the platform based on usage patterns", "Legitimate interests"],
                ["Complying with legal obligations", "Legal obligation"],
              ].map(([p, l], i) => (
                <tr key={i} style={i%2===0?styles.trEven:{}}>
                  <td style={styles.td}>{p}</td>
                  <td style={styles.td}>{l}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={styles.highlight}>
            We do <strong>not</strong> use your data for advertising. We do <strong>not</strong> sell your data to third parties. Ever.
          </div>
        </Section>

        <Section title="5. Who We Share Your Data With">
          <p>We share your data only where necessary to operate the platform:</p>
          <p style={styles.mt}><strong>Supabase</strong> (supabase.com) — our database and authentication provider. GDPR compliant.</p>
          <p style={styles.mt}><strong>Vercel</strong> (vercel.com) — our hosting provider. GDPR compliant.</p>
          <p style={styles.mt}><strong>Resend</strong> (resend.com) — our email delivery provider, used only for transactional emails such as account verification and password resets.</p>
          <p style={styles.mt}>We do not share your data with any other third parties, advertisers, data brokers, or analytics platforms.</p>
        </Section>

        <Section title="6. Community Visibility">
          <p>The Lounge is a <strong>closed, invite-only community</strong>. Your posts, replies, and profile information are visible only to other approved members. Nothing you post is publicly accessible on the internet.</p>
          <p style={styles.mt}>Your email address is <strong>never</strong> visible to other members.</p>
        </Section>

        <Section title="7. How Long We Keep Your Data">
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Data</th>
                <th style={styles.th}>Retention Period</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Account information", "Until you delete your account"],
                ["Posts and replies", "Until you delete them, or until account deletion"],
                ["Email logs (delivery records)", "30 days"],
                ["Server logs (IP addresses etc.)", "90 days"],
              ].map(([d, r], i) => (
                <tr key={i} style={i%2===0?styles.trEven:{}}>
                  <td style={styles.td}>{d}</td>
                  <td style={styles.td}>{r}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={styles.mt}>When you delete your account, your personal information and all posts will be permanently deleted within 30 days.</p>
        </Section>

        <Section title="8. Your Rights Under UK GDPR">
          {[
            ["Right to access", "Request a copy of the personal data we hold about you."],
            ["Right to rectification", "Ask us to correct any inaccurate data."],
            ["Right to erasure", "Ask us to delete your account and all associated data."],
            ["Right to restrict processing", "Ask us to limit how we use your data."],
            ["Right to data portability", "Request your data in a machine-readable format."],
            ["Right to object", "Object to processing based on legitimate interests."],
            ["Right to withdraw consent", "Where we rely on consent, withdraw it at any time."],
          ].map(([right, desc]) => (
            <div key={right} style={styles.rightItem}>
              <strong>{right}</strong> — {desc}
            </div>
          ))}
          <p style={styles.mt}>To exercise any of these rights, email: <a href="mailto:hello@theloungecommunity.co.uk" style={styles.link}>hello@theloungecommunity.co.uk</a>. We will respond within <strong>30 days</strong>.</p>
        </Section>

        <Section title="9. Cookies">
          <p>The Lounge uses only essential cookies required for the platform to function — specifically to keep you logged in between sessions. We do not use tracking cookies, advertising cookies, or any third-party analytics cookies.</p>
        </Section>

        <Section title="10. Data Security">
          <ul style={styles.ul}>
            <li>All data is transmitted over HTTPS (encrypted in transit)</li>
            <li>Passwords are hashed using bcrypt — we never store plain text passwords</li>
            <li>Database access is restricted using Row Level Security</li>
            <li>API keys and secrets are stored securely and never exposed publicly</li>
            <li>Access to the database is restricted to authorised personnel only</li>
          </ul>
        </Section>

        <Section title="11. Data Breaches">
          <p>In the event of a personal data breach that is likely to result in a risk to your rights and freedoms, we will notify the Information Commissioner's Office (ICO) within 72 hours and inform affected members without undue delay.</p>
        </Section>

        <Section title="12. Children">
          <p>The Lounge is intended for adults (18+). We do not knowingly collect data from anyone under 18. If you believe a minor has created an account, please contact us and we will delete it promptly.</p>
        </Section>

        <Section title="13. Changes to This Policy">
          <p>We may update this Privacy Policy from time to time. When we make significant changes, we will notify members via the platform or by email.</p>
        </Section>

        <Section title="14. Complaints">
          <p>You have the right to lodge a complaint with the UK's data protection authority:</p>
          <p style={styles.mt}><strong>Information Commissioner's Office (ICO)</strong><br/>Website: <a href="https://ico.org.uk" target="_blank" rel="noreferrer" style={styles.link}>ico.org.uk</a><br/>Helpline: 0303 123 1113</p>
          <p style={styles.mt}>We would appreciate the opportunity to address your concerns directly first. Please email us at <a href="mailto:hello@theloungecommunity.co.uk" style={styles.link}>hello@theloungecommunity.co.uk</a>.</p>
        </Section>

        <Section title="15. Contact Us">
          <p><strong>Email:</strong> <a href="mailto:hello@theloungecommunity.co.uk" style={styles.link}>hello@theloungecommunity.co.uk</a><br/><strong>Website:</strong> theloungecommunity.co.uk<br/><strong>Company:</strong> Your Virtual Office Manager Ltd</p>
        </Section>

        <p style={styles.footer}>This policy was written in plain English intentionally. If anything is unclear, please get in touch.</p>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <h2 style={{ fontFamily: "'Georgia', serif", fontWeight: 700, fontSize: 18, color: "#1A1814", marginBottom: 14, paddingBottom: 8, borderBottom: "1px solid #E8E3DC" }}>{title}</h2>
      <div style={{ fontSize: 14, color: "#3A3530", lineHeight: 1.75 }}>{children}</div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page:     { background: "#F5F2ED", minHeight: "100vh", padding: "40px 24px", fontFamily: "'IBM Plex Sans', sans-serif" },
  wrap:     { maxWidth: 720, margin: "0 auto", background: "#fff", border: "1px solid #E8E3DC", borderRadius: 16, padding: "40px 48px" },
  header:   { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 },
  back:     { fontSize: 13, color: "#6B6358", textDecoration: "none", fontWeight: 500 },
  badge:    { fontSize: 10, color: "#9E9587", letterSpacing: "1.5px", textTransform: "uppercase" as const, border: "1px solid #D4CEC5", borderRadius: 4, padding: "2px 8px" },
  h1:       { fontFamily: "'Georgia', serif", fontWeight: 700, fontSize: 28, color: "#1A1814", letterSpacing: "-0.5px", marginBottom: 8 },
  meta:     { fontSize: 12, color: "#9E9587", marginBottom: 24 },
  rule:     { border: "none", borderTop: "1px solid #E8E3DC", margin: "0 0 36px" },
  mt:       { marginTop: 12 },
  subhead:  { fontWeight: 600, color: "#1A1814", marginTop: 16, marginBottom: 6 },
  ul:       { paddingLeft: 20, marginTop: 8, lineHeight: 2 },
  link:     { color: "#0EAD8B", textDecoration: "none" },
  table:    { width: "100%", borderCollapse: "collapse" as const, marginTop: 12, fontSize: 13 },
  th:       { background: "#F5F2ED", padding: "10px 14px", textAlign: "left" as const, fontSize: 11, color: "#6B6358", letterSpacing: "0.8px", textTransform: "uppercase" as const, fontWeight: 600 },
  td:       { padding: "10px 14px", borderTop: "1px solid #F0EDE8", verticalAlign: "top" as const },
  trEven:   { background: "#FAFAF8" },
  highlight:{ background: "#FFFBF5", border: "1px solid #E8E3DC", borderRadius: 8, padding: "12px 16px", marginTop: 16, fontSize: 13, color: "#3A3530" },
  rightItem:{ padding: "8px 0", borderBottom: "1px solid #F0EDE8", fontSize: 14, color: "#3A3530" },
  footer:   { fontSize: 12, color: "#9E9587", fontStyle: "italic", marginTop: 40, paddingTop: 20, borderTop: "1px solid #E8E3DC" },
}
