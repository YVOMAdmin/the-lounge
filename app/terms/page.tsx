// app/terms/page.tsx
// Add this file to your project at: app/terms/page.tsx

export default function TermsPage() {
  return (
    <div style={styles.page}>
      <div style={styles.wrap}>

        {/* Header */}
        <div style={styles.header}>
          <a href="/" style={styles.back}>← Back to The Lounge</a>
          <div style={styles.badge}>Legal</div>
        </div>

        <h1 style={styles.h1}>Terms of Use</h1>
        <p style={styles.meta}>The Lounge Community · theloungecommunity.co.uk · Last updated: 28 May 2026</p>
        <hr style={styles.rule}/>

        <Section title="1. About These Terms">
          <p>These Terms of Use ("Terms") govern your access to and use of The Lounge Community at theloungecommunity.co.uk, operated by Your Virtual Office Manager Ltd, a company registered in England and Wales.</p>
          <p style={styles.mt}>By creating an account and using The Lounge, you agree to these Terms in full. These Terms are governed by the laws of England and Wales.</p>
        </Section>

        <Section title="Disclaimer of Liability">
          <p>The content shared by members on The Lounge Community platform, including advice, opinions, and experiences, is provided for informational and peer support purposes only. It does not constitute professional legal, financial, medical, HR or any other professional advice. Your Virtual Office Manager Ltd and The Lounge Community accept no responsibility or liability for any actions taken based on content shared by members. Always seek professional advice where appropriate.</p>
        </Section>

        <Section title="2. What The Lounge Is">
          <p>The Lounge is a private, approval-based online community for administrative and executive support professionals — remote or office-based. It is a space to share experiences, seek advice, vent, celebrate wins, and connect with others who understand the realities of the work you do.</p>
          <p style={styles.mt}>The Lounge is not a public forum. Access is restricted to approved members only.</p>
        </Section>

        <Section title="3. Eligibility">
          <p>To use The Lounge, you must:</p>
          <ul style={styles.ul}>
            <li>Be 18 years of age or older</li>
            <li>Work in or have worked in an administrative, executive support, operations, or related professional role — remote or office-based</li>
            <li>Have signed up and been approved by an administrator</li>
            <li>Agree to and comply with these Terms</li>
          </ul>
          <p style={styles.mt}>We reserve the right to verify eligibility and to decline or revoke membership at our sole discretion.</p>
        </Section>

        <Section title="4. Your Account">
          {[
            ["Registration", "You must provide accurate information when creating your account. You are responsible for keeping your account details up to date."],
            ["Security", "You are responsible for maintaining the confidentiality of your password and for all activity that occurs under your account. If you believe your account has been compromised, contact us immediately."],
            ["One account per person", "You may not create multiple accounts. Creating duplicate accounts may result in all accounts being suspended."],
            ["Non-transferable", "Your account is personal to you and may not be transferred, sold, or shared with another person."],
          ].map(([t, d]) => (
            <p key={t as string} style={styles.mt}><strong>{t}</strong> — {d}</p>
          ))}
        </Section>

        <Section title="5. Community Rules">
          <p>The Lounge exists because its members are trusted to treat it with respect. In return, we keep it closed, safe, and judgment-free.</p>
          <p style={{...styles.mt, fontWeight: 600, color: "#1A1814"}}>You agree to:</p>
          <ul style={styles.ul}>
            <li>Be respectful of other members, even when you disagree</li>
            <li>Keep conversations relevant to work, admin, and professional life, admin, professional life, and community topics</li>
            <li>Support fellow members — this is a space to lift each other up</li>
            <li>Post honestly and authentically</li>
            <li>Keep what is shared here within the community</li>
          </ul>
          <p style={{...styles.mt, fontWeight: 600, color: "#1A1814"}}>You agree NOT to:</p>
          <ul style={styles.ul}>
            <li>Harass, bully, threaten, or intimidate any member</li>
            <li>Post content that is discriminatory on the basis of race, ethnicity, gender, sexuality, disability, religion, or any other characteristic</li>
            <li>Share another member's posts, messages, or personal information outside the platform without their explicit consent</li>
            <li>Impersonate another person or misrepresent your identity</li>
            <li>Post spam or unsolicited cold outreach to other members</li>
            <li>Share misinformation or deliberately misleading content</li>
            <li>Post content that is illegal under the laws of England and Wales</li>
            <li>Attempt to hack, scrape, or disrupt the platform</li>
            <li>Use the platform primarily as a sales channel or for cold commercial outreach</li>
            <li>Use the platform to recruit members to competing services or platforms</li>
          </ul>
        </Section>

        <Section title="5b. Sharing Your Work">
          <div style={styles.highlight}>
            The Lounge is not a sales platform — it is a community first. However, we absolutely encourage members to share their work, services, and expertise with each other.
          </div>
          <p style={{...styles.mt, fontWeight: 600, color: "#1A1814"}}>You are welcome to:</p>
          <ul style={styles.ul}>
            <li>Mention your services, business, or freelance work when it is genuinely relevant to a conversation</li>
            <li>Share resources, tools, or products you have created that would genuinely help other members</li>
            <li>Post in the community feed about something you have launched or are proud of</li>
            <li>Offer your skills or services when another member asks for recommendations</li>
            <li>Include your website or professional links in your profile</li>
          </ul>
          <p style={styles.mt}><strong>What we ask</strong> is that any self-promotion comes from a place of genuine helpfulness rather than cold selling. Think of it like a conversation with a trusted colleague over coffee — share what you do, be proud of it, but lead with community first.</p>
          <p style={styles.mt}>Repeated or aggressive promotion that disrupts the community experience may result in a warning or removal.</p>
        </Section>

        <Section title="6. Confidentiality — What Happens in The Lounge, Stays in The Lounge">
          <p>The Lounge is a closed community built on trust. Members often share candid, personal, and professionally sensitive content.</p>
          <p style={{...styles.mt, fontWeight: 600, color: "#1A1814"}}>You agree that you will not:</p>
          <ul style={styles.ul}>
            <li>Screenshot, copy, or reproduce other members' posts outside of The Lounge</li>
            <li>Share another member's words, identity, or personal details with anyone outside the community</li>
            <li>Use content shared in The Lounge in any external publication, social media post, article, or broadcast</li>
          </ul>
          <p style={{...styles.mt, background:"#FEF0EB", border:"1px solid #FACDB8", borderRadius:8, padding:"12px 16px", color:"#8A3A20"}}>Breach of this rule is considered a serious violation and will result in immediate removal from the community.</p>
        </Section>

        <Section title="7. Your Content">
          {[
            ["Ownership", "You retain ownership of the content you post in The Lounge."],
            ["Licence to us", "By posting content, you grant Your Virtual Office Manager Ltd a non-exclusive, royalty-free licence to store, display, and distribute your content to other members for the purpose of operating the platform. This licence ends when you delete the content or close your account."],
            ["Responsibility", "You are solely responsible for the content you post. Any advice shared in The Lounge is for informational and peer support purposes only and should not be treated as professional legal, financial, medical, or HR advice."],
          ].map(([t, d]) => (
            <p key={t as string} style={styles.mt}><strong>{t}</strong> — {d}</p>
          ))}
        </Section>

        <Section title="8. Events">
          <p>Members may submit events for community consideration. All submissions are subject to admin review and approval before being published.</p>
          <p style={{...styles.mt, fontWeight: 600, color: "#1A1814"}}>By submitting an event, you confirm that:</p>
          <ul style={styles.ul}>
            <li>The event details are accurate</li>
            <li>You have the right to host the event and share the Meeting Link / Event Links / Website provided</li>
            <li>The event is appropriate for the community and complies with these Terms</li>
          </ul>
        </Section>

        <Section title="9. Moderation and Enforcement">
          <p>We reserve the right to issue warnings, remove content, temporarily suspend, or permanently ban accounts for breaches of these Terms. For serious violations we may act without prior warning.</p>
          <p style={styles.mt}>To report a breach: <a href="mailto:hello@theloungecommunity.co.uk" style={styles.link}>hello@theloungecommunity.co.uk</a></p>
        </Section>

        <Section title="10. Availability and Changes">
          <p>We aim to keep The Lounge running reliably but cannot guarantee uninterrupted access. We reserve the right to change or discontinue features, update these Terms, or close the community if necessary.</p>
        </Section>

        <Section title="11. Disclaimer of Warranties">
          <p>The Lounge is provided "as is." To the fullest extent permitted by law, we make no warranties regarding reliability, accuracy, or fitness for a particular purpose. We are not responsible for member content, any loss arising from your use of the platform, or decisions made based on community advice.</p>
        </Section>

        <Section title="12. Limitation of Liability">
          <p>Our total liability to you for any claim shall not exceed £100. Nothing in these Terms limits liability for death or personal injury caused by negligence or fraud.</p>
        </Section>

        <Section title="13. Third-Party Services">
          <p>The Lounge uses Supabase, Vercel, and Resend to operate. Your use is also subject to those providers' terms. We are not responsible for their practices.</p>
        </Section>

        <Section title="14. Changes to These Terms">
          <p>We may update these Terms from time to time. Significant changes will be notified via the platform or email. Continued use after updated Terms are posted constitutes acceptance.</p>
        </Section>

        <Section title="15. Termination">
          <p><strong>By you</strong> — Close your account at any time by emailing <a href="mailto:hello@theloungecommunity.co.uk" style={styles.link}>hello@theloungecommunity.co.uk</a>.</p>
          <p style={styles.mt}><strong>By us</strong> — We may suspend or terminate your account at any time for breach of these Terms or at our sole discretion.</p>
        </Section>

        <Section title="16. Governing Law">
          <p>These Terms are governed by the laws of England and Wales. Disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
        </Section>

        <Section title="17. Contact Us">
          <p><strong>Email:</strong> <a href="mailto:hello@theloungecommunity.co.uk" style={styles.link}>hello@theloungecommunity.co.uk</a><br/><strong>Website:</strong> theloungecommunity.co.uk<br/><strong>Company:</strong> Your Virtual Office Manager Ltd</p>
        </Section>

        <div style={styles.legalLinks}>
          <a href="/privacy" style={styles.legalLink}>Privacy Policy</a>
          <span style={{color:"#D4CEC5"}}>·</span>
          <a href="/terms" style={styles.legalLink}>Terms of Use</a>
        </div>

        <p style={styles.footer}>These Terms are written in plain English because we believe you deserve to understand what you're agreeing to. If anything is unclear, please get in touch.</p>
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
  page:       { background: "#F5F2ED", minHeight: "100vh", padding: "40px 24px", fontFamily: "'IBM Plex Sans', sans-serif" },
  wrap:       { maxWidth: 720, margin: "0 auto", background: "#fff", border: "1px solid #E8E3DC", borderRadius: 16, padding: "40px 48px" },
  header:     { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 },
  back:       { fontSize: 13, color: "#6B6358", textDecoration: "none", fontWeight: 500 },
  badge:      { fontSize: 10, color: "#9E9587", letterSpacing: "1.5px", textTransform: "uppercase" as const, border: "1px solid #D4CEC5", borderRadius: 4, padding: "2px 8px" },
  h1:         { fontFamily: "'Georgia', serif", fontWeight: 700, fontSize: 28, color: "#1A1814", letterSpacing: "-0.5px", marginBottom: 8 },
  meta:       { fontSize: 12, color: "#9E9587", marginBottom: 24 },
  rule:       { border: "none", borderTop: "1px solid #E8E3DC", margin: "0 0 36px" },
  mt:         { marginTop: 12 },
  ul:         { paddingLeft: 20, marginTop: 8, lineHeight: 2 },
  link:       { color: "#0EAD8B", textDecoration: "none" },
  highlight:  { background: "#FFFBF5", border: "1px solid #E8E3DC", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#3A3530", marginTop: 4 },
  legalLinks: { display: "flex", gap: 12, alignItems: "center", marginTop: 40, paddingTop: 20, borderTop: "1px solid #E8E3DC" },
  legalLink:  { fontSize: 12, color: "#6B6358", textDecoration: "none" },
  footer:     { fontSize: 12, color: "#9E9587", fontStyle: "italic", marginTop: 16 },
}
