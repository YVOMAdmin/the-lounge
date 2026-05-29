export default function PendingPage() {
  return (
    <main style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#F5F2ED',padding:24,fontFamily:"'IBM Plex Sans',sans-serif"}}>
      <div style={{background:'#fff',border:'1px solid #E8E3DC',borderRadius:18,padding:36,width:'100%',maxWidth:440,boxShadow:'0 8px 40px rgba(0,0,0,0.07)',textAlign:'center'}}>
        <div style={{fontSize:48,marginBottom:16}}>⏳</div>
        <h1 style={{fontFamily:"Georgia,serif",fontWeight:700,fontSize:22,color:'#1A1814',marginBottom:12}}>Approval pending</h1>
        <p style={{fontSize:13,color:'#6B6358',lineHeight:1.7,marginBottom:20}}>
          Thanks for signing up! Your account is being reviewed by our team. We'll email you once you're approved — usually within 24 hours.
        </p>
        <div style={{background:'#FFFBF5',border:'1px solid #E8E3DC',borderRadius:10,padding:'14px 16px',fontSize:12,color:'#6B6358',lineHeight:1.6,marginBottom:20}}>
          💙 The Lounge is a closed community for administrative and executive support professionals professionals. We review every member to keep it a safe, trusted space.
        </div>
        <p style={{fontSize:12,color:'#9E9587'}}>
          Wrong account? <a href="/auth/login" style={{color:'#1A1814',fontWeight:600}}>Log in with a different email</a>
        </p>
      </div>
    </main>
  )
}
