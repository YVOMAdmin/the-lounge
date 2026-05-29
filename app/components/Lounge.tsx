'use client'

import { useState, useMemo } from "react";

const FONT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;0,700;1,400;1,600&family=IBM+Plex+Sans:wght@400;500;600&display=swap');`;

const CATEGORIES = [
  { id: "rant",       label: "Rant",         emoji: "🔥", color: "#F4622A" },
  { id: "advice",     label: "Need Advice",  emoji: "🙋", color: "#7C5CFC" },
  { id: "experience", label: "Story Time",   emoji: "📖", color: "#0EAD8B" },
  { id: "wins",       label: "Small Win",    emoji: "🎉", color: "#F5A623" },
  { id: "venting",    label: "Just Venting", emoji: "☁️", color: "#5B8DD9" },
];

const EVENT_TYPES = [
  { id: "coffee",     label: "Virtual Coffee",  emoji: "☕", color: "#F5A623" },
  { id: "coffeemtg",  label: "Coffee Meeting",  emoji: "☕", color: "#C47D2A" },
  { id: "networking", label: "Networking",      emoji: "🤝", color: "#0EAD8B" },
  { id: "qa",         label: "Q&A",             emoji: "🙋", color: "#7C5CFC" },
  { id: "skillshare", label: "Skill Share",     emoji: "💡", color: "#F4622A" },
  { id: "webinar",    label: "Webinar",         emoji: "📣", color: "#5B8DD9" },
  { id: "social",     label: "Social Events",   emoji: "🎉", color: "#E91E8C" },
];

const AVATARS = ["📋","🗂","📌","☕","🖨","📎","📁","✉️","🗓","💼"];
const FIRST   = ["Diane","Karen","Priya","Chloe","Nadia","Ruth","Bex","Simone","Tara","Mel"];
const LOCS    = ["EST","GMT","PST","AEST","CET","GMT-5","IST","GMT+8","CST","MST"];
const MONTHS  = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS    = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const SEED_POSTS: any[] = [
  { id:1, avatar:"📋", name:"Diane", loc:"GMT", category:"rant", time:"3m ago", hot:true,
    content:"Someone just booked a 'quick meeting to discuss the agenda' for a meeting that already has an agenda. I coordinate seven executives. I have arranged 14 catering orders this week. I am working from my kitchen table and my patience is thinner than the paper I no longer print.",
    likes:284, replies:[
      { id:101, avatar:"☕", name:"Nadia", loc:"CET", time:"2m ago", text:"The agenda meeting is my villain origin story. You have my full solidarity." },
      { id:102, avatar:"📁", name:"Chloe", loc:"AEST", time:"1m ago", text:"I once had a pre-meeting to prepare for the pre-meeting. We discussed whether we needed an agenda for that one too." },
    ]},
  { id:2, avatar:"✉️", name:"Priya", loc:"IST", category:"advice", time:"18m ago", hot:true,
    content:"How do you stop a director from cc'ing you on every single email 'just so you're in the loop'? I have 847 unread emails. I am the loop. I am drowning in the loop.",
    likes:341, replies:[
      { id:201, avatar:"🗓", name:"Bex", loc:"GMT", time:"15m ago", text:"I set up a filter that auto-files anything CC'd to me from him into a folder called 'Maybe Later.' Life-changing." },
      { id:202, avatar:"📌", name:"Karen", loc:"EST", time:"10m ago", text:"847 unread is actually impressive restraint. I stopped counting at 2,000." },
    ]},
  { id:"poll-1", type:"poll", avatar:"🗓", name:"Bex", loc:"GMT", time:"40m ago",
    question:"It's 5:28 PM on a Friday. A senior leader just emailed asking for 'a quick update'. What do you do?",
    options:[
      { id:"a", text:"Pretend I didn't see it until Monday", votes:38 },
      { id:"b", text:"Reply at 5:29 PM out of spite", votes:61 },
      { id:"c", text:"Draft a response and then delete it", votes:44 },
      { id:"d", text:"Close the laptop and go for a walk", votes:27 },
    ], replies:[]},
  { id:3, avatar:"🗓", name:"Bex", loc:"GMT", category:"experience", time:"45m ago", hot:true,
    content:"Had to reschedule the same board meeting four times because one non-exec can never do Tuesdays, one can never do mornings, and one is 'flexible but not Fridays.' I finally found a slot. It took three weeks. It is a Tuesday morning. Nobody said a word.",
    likes:519, replies:[
      { id:301, avatar:"✉️", name:"Priya", loc:"IST", time:"30m ago", text:"The silence after a successful reschedule is both a victory and an insult." },
    ]},
  { id:4, avatar:"☕", name:"Nadia", loc:"CET", category:"wins", time:"1h ago", hot:true,
    content:"Set up a Calendly link, sent it to the entire leadership team, and not a single person has emailed me asking 'when are you free?' today. Day one. We don't celebrate small victories enough.",
    likes:603, replies:[
      { id:401, avatar:"📋", name:"Diane", loc:"GMT", time:"55m ago", text:"This is the most inspiring thing I have read all week. Which Calendly plan? Asking for immediate implementation." },
    ]},
  { id:5, avatar:"📌", name:"Karen", loc:"EST", category:"venting", time:"3h ago",
    content:"Admin and EA life means you're expected to be available instantly on Slack, Teams, WhatsApp, email, AND a phone call 'just to confirm you saw the email.' Meanwhile I am also managing five inboxes, two shared calendars, and a spreadsheet that has a spreadsheet inside it.",
    likes:412, replies:[]},
  { id:6, avatar:"🗂", name:"Ruth", loc:"PST", category:"rant", time:"7h ago", hot:true,
    content:"They gave us a new expenses system. The training video is 47 minutes long. I have to resubmit every receipt from October. October. I have been in admin for eleven years and I have never felt closer to simply walking into the sea.",
    likes:698, replies:[
      { id:601, avatar:"☕", name:"Nadia", loc:"CET", time:"6h ago", text:"October receipts. In this economy. I'm so sorry." },
      { id:602, avatar:"📌", name:"Karen", loc:"EST", time:"5h ago", text:"The sea is always there for us. Solidarity." },
    ]},
];

const RESOURCES = [
  { emoji:"📄", title:"Email boundary scripts", desc:"Copy-paste responses for out-of-hours requests" },
  { emoji:"🗓", title:"Calendar block templates", desc:"Focus time, admin blocks, no-meeting windows" },
  { emoji:"💬", title:"Slack status playbook", desc:"Statuses that actually communicate your workload" },
  { emoji:"🧘", title:"Burnout self-check", desc:"A quiet 5-min read when things feel heavy" },
];

const now = new Date();
const SEED_EVENTS: any[] = [
  { id:"e1", type:"coffee", title:"Morning Coffee & Chat", host:"Diane", hostAvatar:"📋", hostLoc:"GMT",
    date: new Date(now.getFullYear(), now.getMonth(), now.getDate()+2, 9, 0),
    timezone:"GMT", duration:60, dropIn:true,
    description:"Just a relaxed catch-up over coffee. No agenda, no slides, just faces. New members especially welcome!",
    attendees:["Priya","Nadia","Karen","Bex"], approved:true, link:"https://meet.google.com" },
  { id:"e2", type:"coffeemtg", title:"Coffee & Co-working Session", host:"Priya", hostAvatar:"✉️", hostLoc:"IST",
    date: new Date(now.getFullYear(), now.getMonth(), now.getDate()+3, 10, 0),
    timezone:"GMT", duration:90, dropIn:false,
    description:"Bring your to-do list. We work alongside each other on camera — great for accountability and a bit of company.",
    attendees:["Ruth","Chloe"], approved:true, link:"https://zoom.us" },
  { id:"e3", type:"networking", title:"New Members Mixer", host:"Simone", hostAvatar:"💼", hostLoc:"GMT-5",
    date: new Date(now.getFullYear(), now.getMonth(), now.getDate()+4, 17, 0),
    timezone:"GMT", duration:45, dropIn:false,
    description:"Just joined The Lounge? Come say hello. Regulars welcome too — let's make everyone feel at home.",
    attendees:["Diane","Karen","Tara","Mel","Bex"], approved:true, link:"https://zoom.us" },
  { id:"e4", type:"skillshare", title:"Taming the Shared Inbox", host:"Bex", hostAvatar:"🗓", hostLoc:"GMT",
    date: new Date(now.getFullYear(), now.getMonth(), now.getDate()+5, 12, 0),
    timezone:"GMT", duration:45, dropIn:false,
    description:"Sharing the exact folder structure and rules I use to manage 3 shared inboxes without losing my mind.",
    attendees:["Ruth","Simone","Chloe"], approved:true, link:"https://zoom.us" },
  { id:"e5", type:"qa", title:"Ask Me Anything: Executive Support", host:"Karen", hostAvatar:"📌", hostLoc:"EST",
    date: new Date(now.getFullYear(), now.getMonth(), now.getDate()+8, 14, 0),
    timezone:"EST", duration:45, dropIn:false,
    description:"15 years supporting C-suite. Bring your questions, I'll bring honest answers.",
    attendees:["Nadia","Bex"], approved:true, link:"https://meet.google.com" },
  { id:"e6", type:"social", title:"Friday Wind-Down 🍷", host:"Nadia", hostAvatar:"☕", hostLoc:"CET",
    date: new Date(now.getFullYear(), now.getMonth(), now.getDate()+9, 16, 30),
    timezone:"GMT", duration:60, dropIn:true,
    description:"End the week with people who actually get it. Moaning strongly encouraged. Drinks optional but recommended.",
    attendees:["Diane","Ruth","Chloe","Priya","Karen"], approved:true, link:"https://meet.google.com" },
  { id:"e7", type:"networking", title:"Admin Professionals Roundtable", host:"Ruth", hostAvatar:"🗂", hostLoc:"PST",
    date: new Date(now.getFullYear(), now.getMonth(), now.getDate()+12, 18, 0),
    timezone:"GMT", duration:60, dropIn:false,
    description:"Open discussion on where admin and EA roles are heading. Share your experience, hear from others.",
    attendees:["Simone","Karen","Diane"], approved:true, link:"https://zoom.us" },
];

const MARQUEE = "For the ones who keep it all running · For the ones who keep it all running · For the ones who keep it all running · For the ones who keep it all running · ";

const catOf  = (id: string) => CATEGORIES.find(c=>c.id===id) || CATEGORIES[0];
const typeOf = (id: string) => EVENT_TYPES.find(t=>t.id===id) || EVENT_TYPES[0];
const fmt    = (d: Date)    => d.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"});
const fmtDate= (d: Date)    => `${d.getDate()} ${MONTHS[d.getMonth()]}`;

export default function Lounge() {
  const [posts, setPosts]             = useState(SEED_POSTS);
  const [events, setEvents]           = useState(SEED_EVENTS);
  const [filter, setFilter]           = useState("all");
  const [search, setSearch]           = useState("");
  const [compose, setCompose]         = useState(false);
  const [draft, setDraft]             = useState({content:"",category:"rant"});
  const [composePoll, setComposePoll] = useState(false);
  const [pollDraft, setPollDraft]     = useState({question:"",options:["","",""]});
  const [liked, setLiked]             = useState(new Set<any>());
  const [toast, setToast]             = useState<string|null>(null);
  const [openReplies, setOpenReplies] = useState(new Set<any>());
  const [replyDrafts, setReplyDrafts] = useState<any>({});
  const [votedPolls, setVotedPolls]   = useState<any>({});
  const [activeTab, setActiveTab]     = useState("feed");
  const [calMonth, setCalMonth]       = useState(new Date().getMonth());
  const [calYear, setCalYear]         = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState<number|null>(null);
  const [composeEvent, setComposeEvent] = useState(false);
  const [submittedEvent, setSubmittedEvent] = useState(false);
  const [rsvpd, setRsvpd]             = useState(new Set<any>());
  const [eventDraft, setEventDraft]   = useState({title:"",type:"coffee",date:"",time:"",timezone:"GMT",duration:60,description:"",link:"",dropIn:false});
  const [myAvatar] = useState("☕");
  const [myName]   = useState("You");
  const [myLoc]    = useState("GMT");

  const feed = useMemo(()=>{
    let list = filter==="all" ? posts : posts.filter((p:any)=>p.category===filter||p.type==="poll");
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p:any)=>(p.content&&p.content.toLowerCase().includes(q))||(p.question&&p.question.toLowerCase().includes(q))||(p.name&&p.name.toLowerCase().includes(q)));
    }
    return list;
  },[posts,filter,search]);

  const daysInMonth  = (m:number,y:number) => new Date(y,m+1,0).getDate();
  const firstDayOfMonth = (m:number,y:number) => new Date(y,m,1).getDay();
  const eventsForDay = (day:number) => events.filter((e:any)=>{
    const d=new Date(e.date);
    return d.getDate()===day&&d.getMonth()===calMonth&&d.getFullYear()===calYear&&e.approved;
  });
  const selectedDayEvents = selectedDay ? eventsForDay(selectedDay) : [];
  const prevMonth = ()=>{ if(calMonth===0){setCalMonth(11);setCalYear((y:number)=>y-1);}else setCalMonth((m:number)=>m-1); setSelectedDay(null); };
  const nextMonth = ()=>{ if(calMonth===11){setCalMonth(0);setCalYear((y:number)=>y+1);}else setCalMonth((m:number)=>m+1); setSelectedDay(null); };

  const showToast = (msg:string)=>{ setToast(msg); setTimeout(()=>setToast(null),3000); };
  const toggleLike = (id:any)=>{
    const was=liked.has(id);
    setLiked((prev:any)=>{const n=new Set(prev);was?n.delete(id):n.add(id);return n;});
    setPosts((prev:any)=>prev.map((p:any)=>p.id===id&&p.likes!=null?{...p,likes:was?p.likes-1:p.likes+1}:p));
  };
  const toggleReplies=(id:any)=>setOpenReplies((prev:any)=>{const n=new Set(prev);n.has(id)?n.delete(id):n.add(id);return n;});
  const submitReply=(postId:any)=>{
    const text=(replyDrafts[postId]||"").trim();
    if(!text)return;
    setPosts((prev:any)=>prev.map((p:any)=>p.id===postId?{...p,replies:[...(p.replies||[]),{id:Date.now(),avatar:myAvatar,name:myName,loc:myLoc,time:"just now",text}]}:p));
    setReplyDrafts((prev:any)=>({...prev,[postId]:""}));
    showToast("Reply posted ✓");
  };
  const voteOnPoll=(pollId:any,optId:any)=>{
    if(votedPolls[pollId])return;
    setVotedPolls((prev:any)=>({...prev,[pollId]:optId}));
    setPosts((prev:any)=>prev.map((p:any)=>p.id!==pollId?p:{...p,options:p.options.map((o:any)=>o.id===optId?{...o,votes:o.votes+1}:o)}));
  };
  const submitPost=()=>{
    if(!draft.content.trim())return;
    setPosts((prev:any)=>[{id:Date.now(),avatar:myAvatar,name:myName,loc:myLoc,category:draft.category,time:"just now",content:draft.content,likes:0,replies:[]},...prev]);
    setDraft({content:"",category:"rant"});setCompose(false);showToast("Posted to The Lounge ✓");
  };
  const submitPoll=()=>{
    const opts=pollDraft.options.filter((o:string)=>o.trim());
    if(!pollDraft.question.trim()||opts.length<2)return;
    setPosts((prev:any)=>[{id:Date.now(),type:"poll",avatar:myAvatar,name:myName,loc:myLoc,time:"just now",question:pollDraft.question,options:opts.map((t:string,i:number)=>({id:String.fromCharCode(97+i),text:t,votes:0})),replies:[]},...prev]);
    setPollDraft({question:"",options:["","",""]});setComposePoll(false);showToast("Poll posted ✓");
  };
  const toggleRsvp=(eventId:any)=>{
    const was=rsvpd.has(eventId);
    setRsvpd((prev:any)=>{const n=new Set(prev);was?n.delete(eventId):n.add(eventId);return n;});
    setEvents((prev:any)=>prev.map((e:any)=>e.id===eventId?{...e,attendees:was?e.attendees.filter((a:string)=>a!==myName):[...e.attendees,myName]}:e));
    showToast(was?"RSVP cancelled":"You're going! ✓");
  };
  const submitEvent=()=>{
    if(!eventDraft.title.trim()||!eventDraft.date||!eventDraft.time)return;
    setSubmittedEvent(true);setComposeEvent(false);showToast("Event submitted for approval ✓");
  };fetch('/api/event-notification', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: eventDraft.title,
    date: eventDraft.date,
    time: eventDraft.time,
    description: eventDraft.description,
    link: eventDraft.link,
  })
});
  const totalDays=daysInMonth(calMonth,calYear);
  const firstDay=firstDayOfMonth(calMonth,calYear);
  const calCells:any[]=[];
  for(let i=0;i<firstDay;i++)calCells.push(null);
  for(let d=1;d<=totalDays;d++)calCells.push(d);
  const todayDate=new Date();
  const isToday=(d:number)=>d===todayDate.getDate()&&calMonth===todayDate.getMonth()&&calYear===todayDate.getFullYear();

  const ReplyBlock=({p}:{p:any})=>{
    const open=openReplies.has(p.id);
    const count=(p.replies||[]).length;
    return(<>
      <button className="act" onClick={()=>toggleReplies(p.id)}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        {count} {count===1?"reply":"replies"}
      </button>
      {open&&<div className="replies">
        {(p.replies||[]).map((r:any)=>(
          <div key={r.id} className="reply">
            <div className="reply-avi">{r.avatar}</div>
            <div className="reply-body">
              <span className="reply-who">{r.name}</span>
              <span className="reply-loc">{r.loc} · {r.time}</span>
              <div className="reply-text">{r.text}</div>
            </div>
          </div>
        ))}
        <div className="reply-input-row">
          <div className="reply-avi">{myAvatar}</div>
          <textarea className="reply-input" rows={1} placeholder="Add a reply..." value={replyDrafts[p.id]||""} onChange={(e:any)=>setReplyDrafts((prev:any)=>({...prev,[p.id]:e.target.value}))}/>
          <button className="reply-send" onClick={()=>submitReply(p.id)} disabled={!(replyDrafts[p.id]||"").trim()}>Reply</button>
        </div>
      </div>}
    </>);
  };

  const EventCard=({event,compact}:{event:any,compact:boolean})=>{
    const t=typeOf(event.type);
    const isGoing=rsvpd.has(event.id);
    const d=new Date(event.date);
    return(
      <div className="event-card" style={{borderLeft:`3px solid ${t.color}`}}>
        <div className="event-top">
          <span className="event-type-badge" style={{background:`${t.color}15`,color:t.color,border:`1px solid ${t.color}2A`}}>{t.emoji} {t.label}</span>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            {event.dropIn&&<span className="dropin-pill">🚪 Drop-in</span>}
            <span className="event-date">{fmtDate(d)} · {fmt(d)} {event.timezone}</span>
          </div>
        </div>
        <div className="event-title">{event.title}</div>
        {!compact&&<div className="event-desc">{event.description}</div>}
        <div className="event-foot">
          <div className="event-host">
            <span className="event-host-avi">{event.hostAvatar}</span>
            <span className="event-host-name">{event.host}</span>
            <span className="event-dur">· {event.duration}min · 👥 {event.attendees.length}</span>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <button className={`rsvp-btn ${isGoing?"going":""}`} onClick={()=>toggleRsvp(event.id)}>{isGoing?"✓ Going":"RSVP"}</button>
            {isGoing&&<a href={event.link} target="_blank" rel="noreferrer" className="join-btn">Join →</a>}
          </div>
        </div>
      </div>
    );
  };

  const FeaturedSection=({typeId,title,emoji,tagline,hostLabel}:{typeId:string,title:string,emoji:string,tagline:string,hostLabel:string})=>{
    const t=typeOf(typeId);
    const upcoming=events.filter((e:any)=>e.approved&&e.type===typeId&&new Date(e.date)>=new Date());
    return(
      <div className="featured-section" style={{borderTop:`3px solid ${t.color}`}}>
        <div className="featured-head">
          <div>
            <div className="featured-title">{emoji} {title}</div>
            <div className="featured-sub">{tagline}</div>
          </div>
          <button className="btn-host" style={{borderColor:t.color,color:t.color}} onClick={()=>{setSubmittedEvent(false);setEventDraft((d:any)=>({...d,type:typeId}));setComposeEvent(true);}}>+ {hostLabel}</button>
        </div>
        {upcoming.length===0?(
          <div className="featured-empty">
            <span style={{fontSize:28}}>{emoji}</span>
            <div style={{fontSize:13,color:"#9E9587",marginTop:8}}>No upcoming {title.toLowerCase()} yet — be the first to host one!</div>
          </div>
        ):(
          <div className="featured-cards">
            {upcoming.slice(0,3).map((e:any)=>{
              const isGoing=rsvpd.has(e.id);
              const d=new Date(e.date);
              return(
                <div key={e.id} className="mini-event-card" style={{borderTop:`2px solid ${t.color}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <span style={{fontSize:18}}>{e.hostAvatar}</span>
                      <div>
                        <div style={{fontFamily:"'Fraunces',serif",fontWeight:600,fontSize:13,color:"#1A1814"}}>{e.host}</div>
                        <div style={{fontSize:11,color:"#9E9587"}}>{fmtDate(d)} · {fmt(d)} {e.timezone}</div>
                      </div>
                    </div>
                    {e.dropIn&&<span className="dropin-pill">Drop-in</span>}
                  </div>
                  <div style={{fontFamily:"'Fraunces',serif",fontWeight:600,fontSize:14,color:"#1A1814",marginBottom:6,lineHeight:1.4}}>{e.title}</div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:11,color:"#9E9587"}}>👥 {e.attendees.length} going · {e.duration}min</span>
                    <div style={{display:"flex",gap:6}}>
                      <button className={`rsvp-btn ${isGoing?"going":""}`} style={{fontSize:11,padding:"5px 12px"}} onClick={()=>toggleRsvp(e.id)}>{isGoing?"✓ Going":"RSVP"}</button>
                      {isGoing&&<a href={e.link} target="_blank" rel="noreferrer" className="join-btn" style={{fontSize:11,padding:"5px 10px"}}>Join →</a>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return(<>
    <style>{`
      ${FONT}
      *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
      body{background:#F5F2ED;color:#1A1814;font-family:'IBM Plex Sans',sans-serif;min-height:100vh}
      .ticker{background:#1A1814;overflow:hidden;height:30px;display:flex;align-items:center}
      .ticker-track{display:flex;animation:ticker 28s linear infinite;white-space:nowrap}
      .ticker-track:hover{animation-play-state:paused}
      @keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
      .ticker-text{font-family:'Fraunces',serif;font-style:italic;font-size:12px;color:#9E9587;letter-spacing:0.3px;padding:0 8px}
      .hdr{position:sticky;top:30px;z-index:50;background:rgba(245,242,237,0.94);backdrop-filter:blur(16px);border-bottom:1px solid #E2DDD6;padding:0 28px}
      .hdr-inner{max-width:900px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;height:56px;gap:12px}
      .brand-name{font-family:'Fraunces',serif;font-weight:700;font-size:21px;color:#1A1814;letter-spacing:-0.5px;white-space:nowrap}
      .search-wrap{flex:1;max-width:280px;position:relative}
      .search-input{width:100%;background:#F0EDE8;border:1px solid #E2DDD6;border-radius:8px;color:#1A1814;font-family:'IBM Plex Sans',sans-serif;font-size:13px;padding:7px 12px 7px 34px;outline:none;transition:all 0.2s}
      .search-input:focus{background:#fff;border-color:#B8B0A4}
      .search-input::placeholder{color:#B8B0A4}
      .search-icon{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:#B8B0A4;pointer-events:none}
      .search-clear{position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;color:#B8B0A4;cursor:pointer;font-size:14px}
      .hdr-actions{display:flex;gap:6px;align-items:center;flex-shrink:0}
      .btn-icon{background:transparent;color:#1A1814;border:1px solid #D4CEC5;border-radius:7px;padding:6px 12px;cursor:pointer;font-family:'IBM Plex Sans',sans-serif;font-weight:500;font-size:12px;transition:all 0.15s}
      .btn-icon:hover{border-color:#1A1814}
      .btn-icon-solid{background:#1A1814;color:#F5F2ED;border:none;border-radius:7px;padding:6px 12px;cursor:pointer;font-family:'IBM Plex Sans',sans-serif;font-weight:600;font-size:12px;transition:background 0.15s}
      .btn-icon-solid:hover{background:#2D2922}
      .btn-host{background:transparent;border:1px solid;border-radius:7px;padding:6px 13px;cursor:pointer;font-family:'IBM Plex Sans',sans-serif;font-weight:600;font-size:11px;transition:all 0.15s;white-space:nowrap;flex-shrink:0}
      .wrap{max-width:900px;margin:0 auto;padding:24px 28px}
      .layout{display:flex;gap:28px}
      .feed{flex:1;min-width:0}
      .rail{width:236px;flex-shrink:0}
      @media(max-width:680px){.rail{display:none}}
      .tabs{display:flex;gap:4px;margin-bottom:20px;background:#EDE9E3;border-radius:10px;padding:4px}
      .tab{flex:1;padding:7px;border:none;background:transparent;font-family:'IBM Plex Sans',sans-serif;font-size:13px;font-weight:500;color:#6B6358;border-radius:7px;cursor:pointer;transition:all 0.15s}
      .tab.on{background:#fff;color:#1A1814;box-shadow:0 1px 4px rgba(0,0,0,0.08)}
      .filters{display:flex;gap:8px;margin-bottom:20px;overflow-x:auto;padding-bottom:4px}
      .chip{padding:5px 14px;border-radius:100px;border:1px solid #D4CEC5;background:transparent;color:#6B6358;font-family:'IBM Plex Sans',sans-serif;font-size:12px;cursor:pointer;white-space:nowrap;transition:all 0.15s}
      .chip:hover{border-color:#B8B0A4;color:#1A1814}
      .chip.on{background:#1A1814;border-color:#1A1814;color:#F5F2ED}
      .card{background:#fff;border:1px solid #E8E3DC;border-radius:14px;padding:20px 20px 14px;margin-bottom:12px;transition:box-shadow 0.15s,transform 0.15s;position:relative;overflow:hidden}
      .card:hover{box-shadow:0 4px 24px rgba(0,0,0,0.06);transform:translateY(-1px)}
      .card::after{content:'';position:absolute;top:0;left:0;right:0;height:3px;border-radius:14px 14px 0 0}
      .card.rant::after{background:#F4622A}.card.advice::after{background:#7C5CFC}.card.experience::after{background:#0EAD8B}.card.wins::after{background:#F5A623}.card.venting::after{background:#5B8DD9}.card.poll-card::after{background:linear-gradient(90deg,#7C5CFC,#5B8DD9)}
      .card-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px}
      .card-who{display:flex;align-items:center;gap:10px}
      .avi{width:36px;height:36px;border-radius:10px;background:#F0EDE8;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
      .who-name{font-family:'Fraunces',serif;font-weight:600;font-size:14px;color:#1A1814}
      .who-meta{font-size:11px;color:#9E9587;margin-top:1px}
      .badge-wrap{display:flex;align-items:center;gap:6px;flex-shrink:0}
      .cat-badge{font-size:10px;font-weight:600;padding:3px 9px;border-radius:100px;letter-spacing:0.4px;text-transform:uppercase;display:flex;align-items:center;gap:4px}
      .poll-badge{font-size:10px;font-weight:600;padding:3px 9px;border-radius:100px;background:#EDE9FF;color:#7C5CFC;border:1px solid #D4C8FF;letter-spacing:0.4px;text-transform:uppercase}
      .hot{background:#FEF0EB;color:#F4622A;border:1px solid #FACDB8;font-size:10px;font-weight:700;padding:3px 7px;border-radius:100px}
      .card-body{font-family:'Fraunces',serif;font-style:italic;font-size:14px;line-height:1.75;color:#3A3530}
      .poll-q{font-family:'Fraunces',serif;font-weight:600;font-size:15px;color:#1A1814;line-height:1.5;margin-bottom:14px}
      .poll-options{display:flex;flex-direction:column;gap:8px;margin-bottom:4px}
      .poll-opt{position:relative;border-radius:9px;overflow:hidden;cursor:pointer;border:1px solid #E8E3DC;transition:border-color 0.15s}
      .poll-opt:hover{border-color:#B8B0A4}.poll-opt.voted{cursor:default}
      .poll-bar{position:absolute;left:0;top:0;bottom:0;background:#F0EDE8;transition:width 0.4s ease;z-index:0}
      .poll-bar.winner{background:#EDE9FF}
      .poll-opt-inner{position:relative;z-index:1;display:flex;justify-content:space-between;align-items:center;padding:9px 13px}
      .poll-opt-text{font-size:13px;color:#1A1814}.poll-opt-pct{font-size:12px;font-weight:600;color:#6B6358}
      .poll-opt.my-vote .poll-opt-text{font-weight:600;color:#7C5CFC}
      .poll-total{font-size:11px;color:#9E9587;margin-top:7px}
      .card-foot{display:flex;align-items:center;gap:16px;margin-top:12px;padding-top:12px;border-top:1px solid #F0EDE8}
      .act{display:flex;align-items:center;gap:5px;background:none;border:none;cursor:pointer;font-family:'IBM Plex Sans',sans-serif;font-size:12px;color:#9E9587;transition:color 0.15s;padding:0}
      .act:hover{color:#1A1814}.act.on{color:#F4622A}.act-sep{margin-left:auto}
      .replies{margin-top:12px;border-top:1px solid #F0EDE8;padding-top:12px}
      .reply{display:flex;gap:10px;margin-bottom:10px}
      .reply-avi{width:26px;height:26px;border-radius:7px;background:#F0EDE8;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0}
      .reply-body{flex:1}.reply-who{font-family:'Fraunces',serif;font-weight:600;font-size:13px;color:#1A1814}
      .reply-loc{font-size:10px;color:#9E9587;margin-left:6px}
      .reply-text{font-size:13px;color:#3A3530;line-height:1.6;margin-top:2px}
      .reply-input-row{display:flex;gap:8px;margin-top:10px;align-items:flex-start}
      .reply-input{flex:1;background:#FAFAF8;border:1px solid #E2DDD6;border-radius:8px;color:#1A1814;font-family:'IBM Plex Sans',sans-serif;font-size:13px;padding:8px 11px;resize:none;outline:none;min-height:36px}
      .reply-send{background:#1A1814;border:none;border-radius:8px;color:#F5F2ED;font-size:12px;font-weight:600;padding:8px 13px;cursor:pointer;white-space:nowrap;font-family:'IBM Plex Sans',sans-serif}
      .reply-send:disabled{opacity:0.3;cursor:default}
      .no-results{text-align:center;padding:48px 20px}
      .no-results-emoji{font-size:36px;margin-bottom:12px}
      .no-results-title{font-family:'Fraunces',serif;font-weight:600;font-size:17px;color:#1A1814;margin-bottom:6px}
      .no-results-sub{font-size:13px;color:#9E9587}
      .resource-card{background:#fff;border:1px solid #E8E3DC;border-radius:14px;padding:18px;margin-bottom:12px;display:flex;gap:14px;align-items:flex-start;cursor:pointer;transition:box-shadow 0.15s,transform 0.15s}
      .resource-card:hover{box-shadow:0 4px 24px rgba(0,0,0,0.06);transform:translateY(-1px)}
      .resource-emoji{font-size:26px;line-height:1}
      .resource-title{font-family:'Fraunces',serif;font-weight:600;font-size:14px;color:#1A1814;margin-bottom:3px}
      .resource-desc{font-size:12px;color:#6B6358;line-height:1.5}
      .resource-arrow{margin-left:auto;color:#C4BEB6;font-size:16px;align-self:center}
      .resources-head{font-family:'Fraunces',serif;font-weight:700;font-size:19px;color:#1A1814;margin-bottom:5px}
      .resources-sub{font-size:13px;color:#6B6358;margin-bottom:20px;line-height:1.6}

      /* ── Events ── */
      .events-hero{background:linear-gradient(135deg,#FFFBF5,#F0EDE8);border:1px solid #E8E3DC;border-radius:14px;padding:20px 24px;margin-bottom:20px;display:flex;align-items:center;justify-content:space-between;gap:12px}
      .events-hero-title{font-family:'Fraunces',serif;font-weight:700;font-size:17px;color:#1A1814;margin-bottom:4px}
      .events-hero-sub{font-size:13px;color:#6B6358;line-height:1.6}

      .featured-section{background:#fff;border:1px solid #E8E3DC;border-radius:14px;padding:20px;margin-bottom:16px;overflow:hidden}
      .featured-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:16px}
      .featured-title{font-family:'Fraunces',serif;font-weight:700;font-size:16px;color:#1A1814;margin-bottom:3px}
      .featured-sub{font-size:12px;color:#6B6358;line-height:1.5}
      .featured-empty{text-align:center;padding:24px;background:#FAFAF8;border-radius:10px;border:1px dashed #D4CEC5}
      .featured-cards{display:flex;flex-direction:column;gap:10px}

      .mini-event-card{background:#FAFAF8;border:1px solid #E8E3DC;border-radius:10px;padding:14px;transition:box-shadow 0.15s}
      .mini-event-card:hover{box-shadow:0 3px 12px rgba(0,0,0,0.06)}

      .dropin-pill{background:#EDF9F5;color:#0EAD8B;border:1px solid #B8EDD8;border-radius:100px;font-size:10px;font-weight:600;padding:2px 8px;white-space:nowrap}

      .event-card{background:#fff;border:1px solid #E8E3DC;border-radius:12px;padding:16px;margin-bottom:10px;transition:box-shadow 0.15s}
      .event-card:hover{box-shadow:0 3px 16px rgba(0,0,0,0.06)}
      .event-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;gap:8px;flex-wrap:wrap}
      .event-type-badge{font-size:10px;font-weight:600;padding:3px 9px;border-radius:100px;letter-spacing:0.4px;text-transform:uppercase;flex-shrink:0}
      .event-date{font-size:11px;color:#9E9587}
      .event-title{font-family:'Fraunces',serif;font-weight:600;font-size:15px;color:#1A1814;margin-bottom:6px;line-height:1.4}
      .event-desc{font-size:12px;color:#6B6358;line-height:1.6;margin-bottom:10px}
      .event-foot{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}
      .event-host{display:flex;align-items:center;gap:6px}
      .event-host-avi{font-size:16px}
      .event-host-name{font-size:12px;font-weight:600;color:#1A1814;font-family:'Fraunces',serif}
      .event-dur{font-size:11px;color:#9E9587}
      .rsvp-btn{background:#1A1814;color:#F5F2ED;border:none;border-radius:7px;padding:6px 14px;font-size:12px;font-weight:600;cursor:pointer;font-family:'IBM Plex Sans',sans-serif;transition:background 0.15s}
      .rsvp-btn:hover{background:#2D2922}
      .rsvp-btn.going{background:#0EAD8B}
      .rsvp-btn.going:hover{background:#0B9678}
      .join-btn{background:#EDF9F5;color:#0EAD8B;border:1px solid #B8EDD8;border-radius:7px;padding:6px 12px;font-size:12px;font-weight:600;cursor:pointer;font-family:'IBM Plex Sans',sans-serif;text-decoration:none;transition:all 0.15s}

      .cal-section-head{display:flex;align-items:center;justify-content:space-between;margin:24px 0 14px}
      .cal-section-title{font-family:'Fraunces',serif;font-weight:600;font-size:15px;color:#1A1814}
      .cal-nav{display:flex;align-items:center;gap:10px}
      .cal-month{font-family:'Fraunces',serif;font-weight:600;font-size:14px;color:#1A1814;min-width:130px;text-align:center}
      .cal-btn{background:none;border:1px solid #D4CEC5;border-radius:7px;width:28px;height:28px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#6B6358;transition:all 0.15s;font-size:13px}
      .cal-btn:hover{border-color:#1A1814;color:#1A1814}
      .calendar{background:#fff;border:1px solid #E8E3DC;border-radius:14px;padding:14px;margin-bottom:16px}
      .cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px}
      .cal-day-label{text-align:center;font-size:10px;color:#9E9587;font-weight:600;padding:5px 0;letter-spacing:0.5px}
      .cal-cell{aspect-ratio:1;border-radius:7px;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding:3px 2px;cursor:pointer;transition:background 0.12s;position:relative;min-height:32px}
      .cal-cell:hover{background:#F0EDE8}
      .cal-cell.empty{cursor:default}.cal-cell.empty:hover{background:transparent}
      .cal-cell.today .cal-num{background:#1A1814;color:#F5F2ED;border-radius:50%;width:20px;height:20px;display:flex;align-items:center;justify-content:center}
      .cal-cell.selected{background:#EDE9E3}
      .cal-num{font-size:11px;color:#1A1814;line-height:1;margin-bottom:2px;width:20px;height:20px;display:flex;align-items:center;justify-content:center}
      .cal-dots{display:flex;gap:2px;justify-content:center;flex-wrap:wrap;max-width:24px}
      .cal-dot{width:4px;height:4px;border-radius:50%}
      .selected-day-panel{background:#FFFBF5;border:1px solid #E8E3DC;border-radius:12px;padding:14px;margin-bottom:16px}
      .selected-day-title{font-family:'Fraunces',serif;font-weight:600;font-size:14px;color:#1A1814;margin-bottom:12px}
      .no-events-day{font-size:13px;color:#9E9587;font-style:italic}
      .upcoming-head{font-family:'Fraunces',serif;font-weight:600;font-size:14px;color:#1A1814;margin-bottom:12px;margin-top:4px}
      .section-divider{display:flex;align-items:center;gap:12px;margin:24px 0 20px}
      .section-divider-line{flex:1;height:1px;background:#E8E3DC}
      .section-divider-text{font-size:10px;color:#9E9587;letter-spacing:1.5px;text-transform:uppercase;white-space:nowrap}

      /* Sidebar */
      .rail-card{background:#fff;border:1px solid #E8E3DC;border-radius:12px;padding:16px;margin-bottom:12px}
      .rail-title{font-family:'Fraunces',serif;font-weight:600;font-size:14px;color:#1A1814;margin-bottom:10px}
      .rail-num{font-family:'Fraunces',serif;font-weight:700;font-size:26px;color:#1A1814;letter-spacing:-1px;line-height:1}
      .rail-sub{font-size:11px;color:#9E9587;margin-top:2px;margin-bottom:10px}
      .live-dot{display:inline-block;width:6px;height:6px;border-radius:50%;background:#0EAD8B;margin-right:5px;animation:blink 2.2s infinite}
      @keyframes blink{0%,100%{opacity:1}50%{opacity:0.25}}
      .tag{display:inline-block;font-size:12px;color:#7C5CFC;margin-bottom:7px;cursor:pointer}
      .tag:hover{text-decoration:underline}
      .welcome{background:linear-gradient(135deg,#FFFBF5 0%,#F0EDE8 100%);border:1px solid #E8E3DC;border-radius:12px;padding:16px;margin-bottom:12px}
      .welcome-head{font-family:'Fraunces',serif;font-weight:700;font-size:14px;color:#1A1814;margin-bottom:5px}
      .welcome-body{font-size:12px;color:#6B6358;line-height:1.65}
      .welcome-hl{color:#0EAD8B;font-weight:600}

      /* Modals */
      .overlay{position:fixed;inset:0;z-index:200;background:rgba(26,24,20,0.5);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:24px;animation:fi 0.15s ease}
      @keyframes fi{from{opacity:0}}
      .modal{background:#fff;border:1px solid #E8E3DC;border-radius:18px;width:100%;max-width:540px;padding:26px;animation:su 0.2s ease;box-shadow:0 24px 80px rgba(0,0,0,0.12);max-height:90vh;overflow-y:auto}
      @keyframes su{from{opacity:0;transform:translateY(14px)}}
      .modal-title{font-family:'Fraunces',serif;font-weight:700;font-size:19px;color:#1A1814;margin-bottom:18px}
      .modal-who{display:flex;align-items:center;gap:10px;margin-bottom:14px}
      .compose-name{font-family:'Fraunces',serif;font-weight:600;font-size:14px}
      .compose-sub{font-size:11px;color:#9E9587}
      textarea{width:100%;min-height:110px;background:#FAFAF8;border:1px solid #E2DDD6;border-radius:10px;color:#1A1814;font-family:'Fraunces',serif;font-style:italic;font-size:14px;line-height:1.7;padding:13px;resize:none;outline:none;transition:border-color 0.15s}
      textarea:focus{border-color:#B8B0A4}
      textarea::placeholder{color:#C4BEB6}
      .input-field{width:100%;background:#FAFAF8;border:1px solid #E2DDD6;border-radius:9px;color:#1A1814;font-family:'IBM Plex Sans',sans-serif;font-size:13px;padding:10px 13px;outline:none;transition:border-color 0.15s;margin-bottom:8px}
      .input-field:focus{border-color:#B8B0A4}
      .input-field::placeholder{color:#C4BEB6}
      .input-row{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px}
      .cats{display:flex;gap:7px;flex-wrap:wrap;margin-top:4px}
      .cat-opt{padding:5px 13px;border-radius:100px;border:1px solid #D4CEC5;background:transparent;color:#6B6358;font-size:11px;font-weight:500;cursor:pointer;transition:all 0.15s;font-family:'IBM Plex Sans',sans-serif}
      .cat-opt.sel{background:#1A1814;border-color:#1A1814;color:#F5F2ED}
      .modal-foot{display:flex;justify-content:flex-end;gap:9px;margin-top:16px}
      .btn-cancel{background:none;border:1px solid #D4CEC5;border-radius:8px;color:#6B6358;font-family:'IBM Plex Sans',sans-serif;font-weight:500;font-size:13px;padding:8px 16px;cursor:pointer}
      .btn-submit{background:#1A1814;border:none;border-radius:8px;color:#F5F2ED;font-family:'IBM Plex Sans',sans-serif;font-weight:600;font-size:13px;padding:8px 20px;cursor:pointer}
      .btn-submit:disabled{opacity:0.3;cursor:default}
      .section-label{font-size:11px;color:#9E9587;letter-spacing:1.2px;text-transform:uppercase;margin:14px 0 7px}
      .add-opt-btn{background:none;border:1px dashed #D4CEC5;border-radius:8px;color:#9E9587;font-size:12px;padding:8px;width:100%;cursor:pointer;font-family:'IBM Plex Sans',sans-serif}
      .approval-note{background:#FEF9ED;border:1px solid #F5E4A0;border-radius:8px;padding:10px 14px;font-size:12px;color:#8A6F20;margin-top:14px;line-height:1.5}
      .dropin-toggle{display:flex;align-items:center;gap:10px;margin-top:10px;cursor:pointer;user-select:none}
      .dropin-toggle input{width:16px;height:16px;cursor:pointer}
      .dropin-toggle-label{font-size:13px;color:#3A3530}
      .success-banner{text-align:center;padding:32px 20px}
      .success-emoji{font-size:40px;margin-bottom:12px}
      .success-title{font-family:'Fraunces',serif;font-weight:700;font-size:18px;color:#1A1814;margin-bottom:6px}
      .success-sub{font-size:13px;color:#6B6358;line-height:1.6}
      .toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1A1814;color:#F5F2ED;font-family:'IBM Plex Sans',sans-serif;font-size:12px;padding:11px 20px;border-radius:10px;z-index:300;box-shadow:0 8px 32px rgba(0,0,0,0.2)}
      .site-footer{text-align:center;padding:32px 24px 24px;border-top:1px solid #E8E3DC;margin-top:8px}
      .site-footer-copy{font-size:12px;color:#9E9587;margin-bottom:8px;font-family:'IBM Plex Sans',sans-serif}
      .site-footer-links{display:flex;gap:16px;justify-content:center;align-items:center}
      .site-footer-link{font-size:12px;color:#6B6358;text-decoration:none}
      .site-footer-link:hover{color:#1A1814}
    `}</style>

    <div>
      {/* Ticker */}
      <div className="ticker">
        <div className="ticker-track">
          <span className="ticker-text">{MARQUEE}</span>
          <span className="ticker-text">{MARQUEE}</span>
        </div>
      </div>

      {/* Header */}
      <header className="hdr">
        <div className="hdr-inner">
          <span className="brand-name">The Lounge</span>
          <div className="search-wrap">
            <span className="search-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
            <input className="search-input" placeholder="Search posts, names..." value={search} onChange={(e:any)=>setSearch(e.target.value)}/>
            {search&&<button className="search-clear" onClick={()=>setSearch("")}>✕</button>}
          </div>
          <div className="hdr-actions">
            <button className="btn-icon" onClick={()=>setComposePoll(true)}>+ Poll</button>
            <button className="btn-icon-solid" onClick={()=>setCompose(true)}>+ Post</button>
          </div>
        </div>
      </header>

      <div className="wrap">
        <div className="layout">
          <div className="feed">
            {/* Tabs */}
            <div className="tabs">
              <button className={`tab ${activeTab==="feed"?"on":""}`} onClick={()=>setActiveTab("feed")}>💬 Feed</button>
              <button className={`tab ${activeTab==="events"?"on":""}`} onClick={()=>setActiveTab("events")}>📅 Events</button>
              <button className={`tab ${activeTab==="resources"?"on":""}`} onClick={()=>setActiveTab("resources")}>📌 Resources</button>
            </div>

            {/* ── FEED ── */}
            {activeTab==="feed"&&<>
              <div className="filters">
                <button className={`chip ${filter==="all"?"on":""}`} onClick={()=>setFilter("all")}>All</button>
                {CATEGORIES.map((c:any)=>(
                  <button key={c.id} className={`chip ${filter===c.id?"on":""}`} onClick={()=>setFilter(c.id)}>{c.emoji} {c.label}</button>
                ))}
              </div>
              {feed.length===0&&<div className="no-results"><div className="no-results-emoji">🔍</div><div className="no-results-title">Nothing found</div><div className="no-results-sub">Try a different search or filter</div></div>}
              {feed.map((p:any)=>{
                const isLiked=liked.has(p.id);
                if(p.type==="poll"){
                  const voted=votedPolls[p.id];
                  const total=p.options.reduce((s:number,o:any)=>s+o.votes,0);
                  const winner=voted?p.options.reduce((a:any,b:any)=>a.votes>b.votes?a:b).id:null;
                  return(
                    <div key={p.id} className="card poll-card">
                      <div className="card-top">
                        <div className="card-who"><div className="avi">{p.avatar}</div><div><div className="who-name">{p.name}</div><div className="who-meta">{p.loc} · {p.time}</div></div></div>
                        <span className="poll-badge">📊 Poll</span>
                      </div>
                      <div className="poll-q">{p.question}</div>
                      <div className="poll-options">
                        {p.options.map((opt:any)=>{
                          const pct=total>0?Math.round((opt.votes/total)*100):0;
                          return(
                            <div key={opt.id} className={`poll-opt${voted?" voted":""}${voted===opt.id?" my-vote":""}`} onClick={()=>voteOnPoll(p.id,opt.id)}>
                              <div className={`poll-bar${winner===opt.id?" winner":""}`} style={{width:voted?`${pct}%`:"0%"}}/>
                              <div className="poll-opt-inner"><span className="poll-opt-text">{opt.text}</span>{voted&&<span className="poll-opt-pct">{pct}%</span>}</div>
                            </div>
                          );
                        })}
                      </div>
                      {voted&&<div className="poll-total">{total} votes total</div>}
                      <div className="card-foot"><ReplyBlock p={p}/></div>
                    </div>
                  );
                }
                const cat=catOf(p.category);
                return(
                  <div key={p.id} className={`card ${p.category}`}>
                    <div className="card-top">
                      <div className="card-who"><div className="avi">{p.avatar}</div><div><div className="who-name">{p.name}</div><div className="who-meta">{p.loc} · {p.time}</div></div></div>
                      <div className="badge-wrap">
                        <span className="cat-badge" style={{background:`${cat.color}15`,color:cat.color,border:`1px solid ${cat.color}2A`}}>{cat.emoji} {cat.label}</span>
                        {p.hot&&<span className="hot">HOT</span>}
                      </div>
                    </div>
                    <div className="card-body">{p.content}</div>
                    <div className="card-foot">
                      <button className={`act ${isLiked?"on":""}`} onClick={()=>toggleLike(p.id)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                        {p.likes}
                      </button>
                      <ReplyBlock p={p}/>
                      <button className="act act-sep">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </>}

            {/* ── EVENTS ── */}
            {activeTab==="events"&&<>
              {/* Hero */}
              <div className="events-hero">
                <div>
                  <div className="events-hero-title">📅 Community Events</div>
                  <div className="events-hero-sub">Virtual coffees, networking sessions and socials — no commute required.</div>
                </div>
                <button className="btn-icon-solid" style={{whiteSpace:"nowrap",flexShrink:0}} onClick={()=>{setSubmittedEvent(false);setComposeEvent(true);}}>+ Host an Event</button>
              </div>

              {/* Calendar FIRST */}
              <div className="cal-section-head">
                <div className="cal-section-title">📆 Monthly View</div>
                <div className="cal-nav">
                  <button className="cal-btn" onClick={prevMonth}>‹</button>
                  <span className="cal-month">{MONTHS[calMonth]} {calYear}</span>
                  <button className="cal-btn" onClick={nextMonth}>›</button>
                </div>
              </div>

              <div className="calendar">
                <div className="cal-grid">
                  {DAYS.map((d:string)=><div key={d} className="cal-day-label">{d}</div>)}
                  {calCells.map((day:any,i:number)=>{
                    if(!day)return<div key={`e${i}`} className="cal-cell empty"/>;
                    const dayEvs=eventsForDay(day);
                    return(
                      <div key={day} className={`cal-cell${isToday(day)?" today":""}${selectedDay===day?" selected":""}${dayEvs.length?" has-events":""}`} onClick={()=>setSelectedDay(selectedDay===day?null:day)}>
                        <div className="cal-num">{day}</div>
                        {dayEvs.length>0&&<div className="cal-dots">{dayEvs.slice(0,3).map((e:any)=>{const t=typeOf(e.type);return<div key={e.id} className="cal-dot" style={{background:t.color}}/>;})}</div>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {selectedDay&&(
                <div className="selected-day-panel">
                  <div className="selected-day-title">{selectedDay} {MONTHS[calMonth]}</div>
                  {selectedDayEvents.length===0?<div className="no-events-day">No events on this day</div>:selectedDayEvents.map((e:any)=><EventCard key={e.id} event={e} compact={false}/>)}
                </div>
              )}

              {/* Featured sections */}
              <div className="section-divider">
                <div className="section-divider-line"/>
                <span className="section-divider-text">Featured Events</span>
                <div className="section-divider-line"/>
              </div>
              <FeaturedSection typeId="coffee" title="Virtual Coffee" emoji="☕" tagline="Drop in, say hello, moan about your inbox. No agenda. No slides. Just people." hostLabel="Coffee Chat"/>
              <FeaturedSection typeId="coffeemtg" title="Coffee Meetings" emoji="☕" tagline="Focused catch-ups and co-working sessions — bring your to-do list and some company." hostLabel="Coffee Meeting"/>
              <FeaturedSection typeId="networking" title="Networking" emoji="🤝" tagline="Meet the people behind the inboxes. Build your professional network from your sofa." hostLabel="Networking Event"/>

              <div className="section-divider">
                <div className="section-divider-line"/>
                <span className="section-divider-text">All Upcoming Events</span>
                <div className="section-divider-line"/>
              </div>
              {events.filter((e:any)=>e.approved&&new Date(e.date)>=new Date()).sort((a:any,b:any)=>new Date(a.date).getTime()-new Date(b.date).getTime()).map((e:any)=>(
                <EventCard key={e.id} event={e} compact={false}/>
              ))}
            </>}

            {/* ── RESOURCES ── */}
            {activeTab==="resources"&&<div>
              <div className="resources-head">Pinned Resources</div>
              <div className="resources-sub">Curated by the community — things that actually help with the day-to-day.</div>
              {RESOURCES.map((r:any,i:number)=>(
                <div key={i} className="resource-card">
                  <div className="resource-emoji">{r.emoji}</div>
                  <div><div className="resource-title">{r.title}</div><div className="resource-desc">{r.desc}</div></div>
                  <div className="resource-arrow">→</div>
                </div>
              ))}
            </div>}
          </div>

          {/* Sidebar */}
          <aside className="rail">
            <div className="welcome">
              <div className="welcome-head">Hey {myAvatar} {myName}</div>
              <div className="welcome-body">A <span className="welcome-hl">safe, closed space</span> to share, vent, and support each other. Your people. Your space. No judgement..</div>
            </div>
            <div className="rail-card">
              <div className="rail-title">Right now</div>
              <div className="rail-num">3,104</div>
              <div className="rail-sub"><span className="live-dot"/>members online</div>
              <div className="rail-num">7.1k</div>
              <div className="rail-sub">posts today</div>
            </div>
            {activeTab==="events"&&(
              <div className="rail-card">
                <div className="rail-title">Your RSVPs</div>
                {events.filter((e:any)=>rsvpd.has(e.id)).length===0
                  ?<div style={{fontSize:12,color:"#9E9587",fontStyle:"italic"}}>No RSVPs yet!</div>
                  :events.filter((e:any)=>rsvpd.has(e.id)).map((e:any)=>{
                    const d=new Date(e.date);
                    return<div key={e.id} style={{marginBottom:10}}>
                      <div style={{fontSize:12,fontWeight:600,color:"#1A1814",fontFamily:"'Fraunces',serif"}}>{e.title}</div>
                      <div style={{fontSize:11,color:"#9E9587"}}>{fmtDate(d)} · {fmt(d)}</div>
                    </div>;
                  })
                }
              </div>
            )}
            {activeTab==="feed"&&(
              <div className="rail-card">
                <div className="rail-title">Trending</div>
                {["#JustOneMoreReschedule","#847UnreadEmails","#ASAPAtFivePM","#TheAgendaMeeting","#NewExpensesSystem","#ManagingUpIsAJob"].map((t:string)=>(
                  <div key={t}><span className="tag" onClick={()=>setSearch(t.slice(1))}>{t}</span></div>
                ))}
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Footer */}
      <footer className="site-footer">
        <div className="site-footer-copy">© {new Date().getFullYear()} Your Virtual Office Manager Ltd · The Lounge Community</div>
        <div className="site-footer-links">
          <a href="/privacy" className="site-footer-link">Privacy Policy</a>
          <span style={{color:"#D4CEC5"}}>·</span>
          <a href="/terms" className="site-footer-link">Terms of Use</a>
          <span style={{color:"#D4CEC5"}}>·</span>
          <a href="mailto:hello@theloungecommunity.co.uk" className="site-footer-link">Contact</a>
        </div>
      </footer>

      {/* Compose Post */}
      {compose&&<div className="overlay" onClick={(e:any)=>e.target===e.currentTarget&&setCompose(false)}>
        <div className="modal">
          <div className="modal-title">What's going on?</div>
          <div className="modal-who"><div className="avi">{myAvatar}</div><div><div className="compose-name">{myName} · {myLoc}</div><div className="compose-sub">Posting to The Lounge</div></div></div>
          <textarea placeholder="Tell the group what's really going on..." value={draft.content} onChange={(e:any)=>setDraft((d:any)=>({...d,content:e.target.value}))}/>
          <div className="cats">{CATEGORIES.map((c:any)=>(<button key={c.id} className={`cat-opt ${draft.category===c.id?"sel":""}`} onClick={()=>setDraft((d:any)=>({...d,category:c.id}))}>{c.emoji} {c.label}</button>))}</div>
          <div className="modal-foot"><button className="btn-cancel" onClick={()=>setCompose(false)}>Cancel</button><button className="btn-submit" onClick={submitPost} disabled={!draft.content.trim()}>Post</button></div>
        </div>
      </div>}

      {/* Compose Poll */}
      {composePoll&&<div className="overlay" onClick={(e:any)=>e.target===e.currentTarget&&setComposePoll(false)}>
        <div className="modal">
          <div className="modal-title">Create a Poll</div>
          <div className="modal-who"><div className="avi">{myAvatar}</div><div><div className="compose-name">{myName} · {myLoc}</div><div className="compose-sub">Posting to The Lounge</div></div></div>
          <div className="section-label">Your question</div>
          <input className="input-field" placeholder="Ask the community something..." value={pollDraft.question} onChange={(e:any)=>setPollDraft((d:any)=>({...d,question:e.target.value}))}/>
          <div className="section-label">Options</div>
          {pollDraft.options.map((opt:string,i:number)=>(<input key={i} className="input-field" placeholder={`Option ${i+1}`} value={opt} onChange={(e:any)=>{const opts=[...pollDraft.options];opts[i]=e.target.value;setPollDraft((d:any)=>({...d,options:opts}));}}/>))}
          {pollDraft.options.length<5&&<button className="add-opt-btn" onClick={()=>setPollDraft((d:any)=>({...d,options:[...d.options,""]}))}>+ Add option</button>}
          <div className="modal-foot"><button className="btn-cancel" onClick={()=>setComposePoll(false)}>Cancel</button><button className="btn-submit" onClick={submitPoll} disabled={!pollDraft.question.trim()||pollDraft.options.filter((o:string)=>o.trim()).length<2}>Post Poll</button></div>
        </div>
      </div>}

      {/* Submit Event */}
      {composeEvent&&<div className="overlay" onClick={(e:any)=>e.target===e.currentTarget&&setComposeEvent(false)}>
        <div className="modal">
          {submittedEvent?(
            <div className="success-banner">
              <div className="success-emoji">🎉</div>
              <div className="success-title">Event submitted!</div>
              <div style={{fontSize:13,color:"#6B6358",lineHeight:1.6,marginTop:6}}>We'll review your event within 24 hours and let you know when it's live.</div>
              <div className="modal-foot" style={{justifyContent:"center",marginTop:20}}><button className="btn-submit" onClick={()=>setComposeEvent(false)}>Done</button></div>
            </div>
          ):(
            <>
              <div className="modal-title">Host an Event</div>
              <div className="modal-who"><div className="avi">{myAvatar}</div><div><div className="compose-name">{myName} · {myLoc}</div><div className="compose-sub">Submitted for admin approval</div></div></div>
              <div className="section-label">Event type</div>
              <div className="cats">
                {EVENT_TYPES.map((t:any)=>(<button key={t.id} className={`cat-opt ${eventDraft.type===t.id?"sel":""}`} onClick={()=>setEventDraft((d:any)=>({...d,type:t.id}))}>{t.emoji} {t.label}</button>))}
              </div>
              <div className="section-label">Title</div>
              <input className="input-field" placeholder="e.g. Morning Coffee & Chat" value={eventDraft.title} onChange={(e:any)=>setEventDraft((d:any)=>({...d,title:e.target.value}))}/>
              <div className="section-label">Date & Time</div>
              <div className="input-row">
                <input className="input-field" style={{marginBottom:0}} type="date" value={eventDraft.date} onChange={(e:any)=>setEventDraft((d:any)=>({...d,date:e.target.value}))}/>
                <input className="input-field" style={{marginBottom:0}} type="time" value={eventDraft.time} onChange={(e:any)=>setEventDraft((d:any)=>({...d,time:e.target.value}))}/>
              </div>
              <div className="input-row" style={{marginTop:8}}>
                <input className="input-field" style={{marginBottom:0}} placeholder="Timezone (e.g. GMT)" value={eventDraft.timezone} onChange={(e:any)=>setEventDraft((d:any)=>({...d,timezone:e.target.value}))}/>
                <input className="input-field" style={{marginBottom:0}} type="number" placeholder="Duration (mins)" value={eventDraft.duration} onChange={(e:any)=>setEventDraft((d:any)=>({...d,duration:e.target.value}))}/>
              </div>
              <label className="dropin-toggle">
                <input type="checkbox" checked={eventDraft.dropIn} onChange={(e:any)=>setEventDraft((d:any)=>({...d,dropIn:e.target.checked}))}/>
                <span className="dropin-toggle-label">🚪 This is a drop-in event (no RSVP needed, come and go freely)</span>
              </label>
              <div className="section-label">Description</div>
              <textarea style={{minHeight:80}} placeholder="What's this event about? Who should come?" value={eventDraft.description} onChange={(e:any)=>setEventDraft((d:any)=>({...d,description:e.target.value}))}/>
              <div className="section-label">Meeting Link / Event Links / Website</div>
              <input className="input-field" placeholder="Zoom, Google Meet, Teams..." value={eventDraft.link} onChange={(e:any)=>setEventDraft((d:any)=>({...d,link:e.target.value}))}/>
              <div className="approval-note">⏳ Your event will be reviewed by an admin before going live. We aim to approve within 24 hours.</div>
              <div className="modal-foot">
                <button className="btn-cancel" onClick={()=>setComposeEvent(false)}>Cancel</button>
                <button className="btn-submit" onClick={submitEvent} disabled={!eventDraft.title.trim()||!eventDraft.date||!eventDraft.time}>Submit for Approval</button>
              </div>
            </>
          )}
        </div>
      </div>}

      {toast&&<div className="toast">{toast}</div>}
    </div>
  </>);
}
