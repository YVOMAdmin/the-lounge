export default function PendingPage() {
  return (
    <main style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'#F5F0E8',padding:24,fontFamily:"'Inter',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>
      
      <a href="/"><img src="/community-logo.png" alt="The Lounge Community" style={{height:120,width:'auto',marginBottom:28,display:'block'}}/></a>
      
      <div style={{background:'#fff',border:'2.5px solid #E8845A',borderRadius:20,padding:36,width:'100%',maxWidth:440,boxShadow:'4px 4px 0 #E8845A',textAlign:'center'}}>
        <div style={{height:5,background:'#E8845A',borderRadius:'16px 16px 0 0',margin:'-36px -36px 28px'}}/>
        
        <div style={{fontSize:48,marginBottom:16}}>⏳</div>
        <h1 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:22,color:'#E8845A',marginBottom:12,letterSpacing:'-0.03em'}}>Approval pending</h1>
        <p style={{fontSize:13,color:'#6B6358',lineHeight:1.7,marginBottom:20}}>
          Thanks for signing up! Your account is being reviewed by our team. We'll email you once you're approved — usually within 24 hours.
        </p>
        <div style={{background:'#FFF8F5',border:'2px solid #E8845A',borderRadius:12,padding:'14px 16px',fontSize:12,color:'#6B6358',lineHeight:1.6,marginBottom:20}}>
          💙 The Lounge is a closed community for administrative and executive support professionals. We review every member to keep it a safe, trusted space.
        </div>
        <p style={{fontSize:12,color:'#9E9587'}}>
          Wrong account? <a href="/auth/login" style={{color:'#E8845A',fontWeight:700}}>Log in with a different email</a>
        </p>
      </div>
    </main>
  )
}