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
  { id: "coffee",    label: "Virtual Coffee", emoji: "☕", color: "#F5A623" },
  { id: "webinar",   label: "Webinar",        emoji: "📣", color: "#7C5CFC" },
  { id: "qa",        label: "Q&A",            emoji: "🙋", color: "#0EAD8B" },
  { id: "skillshare",label: "Skill Share",    emoji: "💡", color: "#F4622A" },
  { id: "social",    label: "Social",         emoji: "🎉", color: "#5B8DD9" },
];

const AVATARS = ["📋","🗂","📌","☕","🖨","📎","📁","✉️","🗓","💼"];
const FIRST   = ["Diane","Karen","Priya","Chloe","Nadia","Ruth","Bex","Simone","Tara","Mel"];
const LOCS    = ["EST","GMT","PST","AEST","CET","GMT-5","IST","GMT+8","CST","MST"];

const SEED_POSTS = [
  { id:1, avatar:"📋", name:"Diane", loc:"GMT", category:"rant", time:"3m ago", hot:true, content:"Someone just booked a 'quick meeting to discuss the agenda' for a meeting that already has an agenda. I coordinate seven executives. I have arranged 14 catering orders this week. I am working from my kitchen table and my patience is thinner than the paper I no longer print.", likes:284, replies:[
    { id:101, avatar:"☕", name:"Nadia", loc:"CET", time:"2m ago", text:"The agenda meeting is my villain origin story. You have my full solidarity." },
    { id:102, avatar:"📁", name:"Chloe", loc:"AEST", time:"1m ago", text:"I once had a pre-meeting to prepare for the pre-meeting. We discussed whether we needed an agenda for that one too." },
  ]},
  { id:2, avatar:"✉️", name:"Priya", loc:"IST", category:"advice", time:"18m ago", hot:true, content:"How do you stop a director from cc'ing you on every single email 'just so you're in the loop'? I have 847 unread emails. I am the loop. I am drowning in the loop.", likes:341, replies:[
    { id:201, avatar:"🗓", name:"Bex", loc:"GMT", time:"15m ago", text:"I set up a filter that auto-files anything CC'd to me from him into a folder called 'Maybe Later.' Life-changing." },
    { id:202, avatar:"📌", name:"Karen", loc:"EST", time:"10m ago", text:"847 unread is actually impressive restraint. I stopped counting at 2,000." },
  ]},
  { id:"poll-1", type:"poll", avatar:"🗓", name:"Bex", loc:"GMT", time:"40m ago", question:"It's 5:28 PM on a Friday. A senior leader just emailed asking for 'a quick update'. What do you do?", options:[
    { id:"a", text:"Pretend I didn't see it until Monday", votes:38 },
    { id:"b", text:"Reply at 5:29 PM out of spite", votes:61 },
    { id:"c", text:"Draft a response and then delete it", votes:44 },
    { id:"d", text:"Close the laptop and go for a walk", votes:27 },
  ], replies:[]},
  { id:3, avatar:"🗓", name:"Bex", loc:"GMT", category:"experience", time:"45m ago", hot:true, content:"Had to reschedule the same board meeting four times because one non-exec can never do Tuesdays, one can never do mornings, and one is 'flexible but not Fridays.' I finally found a slot. It took three weeks. It is a Tuesday morning. Nobody said a word.", likes:519, replies:[
    { id:301, avatar:"✉️", name:"Priya", loc:"IST", time:"30m ago", text:"The silence after a successful reschedule is both a victory and an insult." },
  ]},
  { id:4, avatar:"☕", name:"Nadia", loc:"CET", category:"wins", time:"1h ago", hot:true, content:"Set up a Calendly link, sent it to the entire leadership team, and not a single person has emailed me asking 'when are you free?' today. Day one. We don't celebrate small victories enough.", likes:603, replies:[
    { id:401, avatar:"📋", name:"Diane", loc:"GMT", time:"55m ago", text:"This is the most inspiring thing I have read all week. Which Calendly plan? Asking for immediate implementation." },
  ]},
  { id:5, avatar:"📌", name:"Karen", loc:"EST", category:"venting", time:"3h ago", content:"Remote admin life means you're expected to be available instantly on Slack, Teams, WhatsApp, email, AND a phone call 'just to confirm you saw the email.' Meanwhile I am also managing five inboxes, two shared calendars, and a spreadsheet that has a spreadsheet inside it.", likes:412, replies:[]},
  { id:6, avatar:"🗂", name:"Ruth", loc:"PST", category:"rant", time:"7h ago", hot:true, content:"They gave us a new expenses system. The training video is 47 minutes long. I have to resubmit every receipt from October. October. I have been in admin for eleven years and I have never felt closer to simply walking into the sea.", likes:698, replies:[
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

// Seed events — approved ones visible to all
const now = new Date();
const SEED_EVENTS = [
  { id:"e1", type:"coffee", title:"Morning Coffee & Chat", host:"Diane", hostAvatar:"📋", hostLoc:"GMT", date: new Date(now.getFullYear(), now.getMonth(), now.getDate()+2, 9, 0), timezone:"GMT", duration:60, description:"Just a relaxed catch-up over coffee. No agenda, no slides, just faces. New members especially welcome!", attendees:["Priya","Nadia","Karen","Bex"], approved:true, link:"https://meet.google.com" },
  { id:"e2", type:"skillshare", title:"Taming the Shared Inbox", host:"Bex", hostAvatar:"🗓", hostLoc:"GMT", date: new Date(now.getFullYear(), now.getMonth(), now.getDate()+5, 12, 0), timezone:"GMT", duration:45, description:"Sharing the exact folder structure and rules I use to manage 3 shared inboxes without losing my mind. Q&A included.", attendees:["Ruth","Simone","Chloe"], approved:true, link:"https://zoom.us" },
  { id:"e3", type:"webinar", title:"Setting Boundaries Without the Drama", host:"Simone", hostAvatar:"💼", hostLoc:"GMT-5", date: new Date(now.getFullYear(), now.getMonth(), now.getDate()+8, 17, 0), timezone:"GMT", duration:60, description:"Practical scripts and strategies for pushing back on unreasonable requests — professionally and confidently.", attendees:["Diane","Karen","Priya","Ruth","Tara","Mel"], approved:true, link:"https://zoom.us" },
  { id:"e4", type:"qa", title:"Ask Me Anything: Executive Support", host:"Karen", hostAvatar:"📌", hostLoc:"EST", date: new Date(now.getFullYear(), now.getMonth(), now.getDate()+12, 14, 0), timezone:"EST", duration:45, description:"15 years supporting C-suite. Bring your questions, I'll bring honest answers.", attendees:["Nadia","Bex"], approved:true, link:"https://meet.google.com" },
  { id:"e5", type:"social", title:"Friday Wind-Down ☁️", host:"Nadia", hostAvatar:"☕", hostLoc:"CET", date: new Date(now.getFullYear(), now.getMonth(), now.getDate()+14, 16, 30), timezone:"GMT", duration:30, description:"End the week with people who actually get it. Moaning encouraged.", attendees:["Diane","Ruth","Chloe","Priya","Karen"], approved:true, link:"https://meet.google.com" },
];

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const MARQUEE = "For the ones who keep it all running · For the ones who keep it all running · For the ones who keep it all running · For the ones who keep it all running · ";
const catOf = (id) => CATEGORIES.find(c => c.id === id) || CATEGORIES[0];
const typeOf = (id) => EVENT_TYPES.find(t => t.id === id) || EVENT_TYPES[0];

const fmt = (date) => date.toLocaleTimeString("en-GB", { hour:"2-digit", minute:"2-digit" });
const fmtDate = (date) => `${date.getDate()} ${MONTHS[date.getMonth()]}`;

export default function Lounge() {
  const [posts, setPosts]             = useState(SEED_POSTS);
  const [events, setEvents]           = useState(SEED_EVENTS);
  const [filter, setFilter]           = useState("all");
  const [search, setSearch]           = useState("");
  const [compose, setCompose]         = useState(false);
  const [draft, setDraft]             = useState({ content:"", category:"rant" });
  const [composePoll, setComposePoll] = useState(false);
  const [pollDraft, setPollDraft]     = useState({ question:"", options:["","",""] });
  const [liked, setLiked]             = useState(new Set());
  const [toast, setToast]             = useState(null);
  const [openReplies, setOpenReplies] = useState(new Set());
  const [replyDrafts, setReplyDrafts] = useState({});
  const [votedPolls, setVotedPolls]   = useState({});
  const [activeTab, setActiveTab]     = useState("feed");
  const [calMonth, setCalMonth]       = useState(new Date().getMonth());
  const [calYear, setCalYear]         = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);
  const [composeEvent, setComposeEvent] = useState(false);
  const [rsvpd, setRsvpd]             = useState(new Set());
  const [eventDraft, setEventDraft]   = useState({ title:"", type:"coffee", date:"", time:"", timezone:"GMT", duration:60, description:"", link:"" });
  const [submittedEvent, setSubmittedEvent] = useState(false);
  const [myAvatar] = useState("☕");
  const [myName]   = useState("You");
  const [myLoc]    = useState("GMT");

  const feed = useMemo(() => {
    let list = filter==="all" ? posts : posts.filter(p => p.category===filter || p.type==="poll");
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        (p.content && p.content.toLowerCase().includes(q)) ||
        (p.question && p.question.toLowerCase().includes(q)) ||
        (p.name && p.name.toLowerCase().includes(q))
      );
    }
    return list;
  }, [posts, filter, search]);

  // Calendar helpers
  const daysInMonth = (m, y) => new Date(y, m+1, 0).getDate();
  const firstDayOfMonth = (m, y) => new Date(y, m, 1).getDay();

  const eventsForDay = (day) => events.filter(e => {
    const d = new Date(e.date);
    return d.getDate()===day && d.getMonth()===calMonth && d.getFullYear()===calYear && e.approved;
  });

  const selectedDayEvents = selectedDay ? eventsForDay(selectedDay) : [];

  const prevMonth = () => {
    if (calMonth===0) { setCalMonth(11); setCalYear(y=>y-1); }
    else setCalMonth(m=>m-1);
    setSelectedDay(null);
  };
  const nextMonth = () => {
    if (calMonth===11) { setCalMonth(0); setCalYear(y=>y+1); }
    else setCalMonth(m=>m+1);
    setSelectedDay(null);
  };

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(null),3000); };

  const toggleLike = (id) => {
    const was = liked.has(id);
    setLiked(prev=>{ const n=new Set(prev); was?n.delete(id):n.add(id); return n; });
    setPosts(prev=>prev.map(p=>p.id===id&&p.likes!=null?{...p,likes:was?p.likes-1:p.likes+1}:p));
  };
  const toggleReplies = (id) => setOpenReplies(prev=>{ const n=new Set(prev); n.has(id)?n.delete(id):n.add(id); return n; });
  const submitReply = (postId) => {
    const text = (replyDrafts[postId]||"").trim();
    if (!text) return;
    setPosts(prev=>prev.map(p=>p.id===postId?{...p,replies:[...(p.replies||[]),{id:Date.now(),avatar:myAvatar,name:myName,loc:myLoc,time:"just now",text}]}:p));
    setReplyDrafts(prev=>({...prev,[postId]:""}));
    showToast("Reply posted ✓");
  };
  const voteOnPoll = (pollId, optId) => {
    if (votedPolls[pollId]) return;
    setVotedPolls(prev=>({...prev,[pollId]:optId}));
    setPosts(prev=>prev.map(p=>p.id!==pollId?p:{...p,options:p.options.map(o=>o.id===optId?{...o,votes:o.votes+1}:o)}));
  };
  const submitPost = () => {
    if (!draft.content.trim()) return;
    setPosts(prev=>[{id:Date.now(),avatar:myAvatar,name:myName,loc:myLoc,category:draft.category,time:"just now",content:draft.content,likes:0,replies:[]},...prev]);
    setDraft({content:"",category:"rant"}); setCompose(false); showToast("Posted to The Lounge ✓");
  };
  const submitPoll = () => {
    const opts = pollDraft.options.filter(o=>o.trim());
    if (!pollDraft.question.trim()||opts.length<2) return;
    setPosts(prev=>[{id:Date.now(),type:"poll",avatar:myAvatar,name:myName,loc:myLoc,time:"just now",question:pollDraft.question,options:opts.map((t,i)=>({id:String.fromCharCode(97+i),text:t,votes:0})),replies:[]},...prev]);
    setPollDraft({question:"",options:["","",""]}); setComposePoll(false); showToast("Poll posted ✓");
  };
  const toggleRsvp = (eventId) => {
    const was = rsvpd.has(eventId);
    setRsvpd(prev=>{ const n=new Set(prev); was?n.delete(eventId):n.add(eventId); return n; });
    setEvents(prev=>prev.map(e=>e.id===eventId?{...e,attendees:was?e.attendees.filter(a=>a!==myName):[...e.attendees,myName]}:e));
    showToast(was ? "RSVP cancelled" : "You're going! ✓");
  };
  const submitEvent = () => {
    if (!eventDraft.title.trim()||!eventDraft.date||!eventDraft.time) return;
    setSubmittedEvent(true);
    setComposeEvent(false);
    showToast("Event submitted for approval ✓");
  };

  const ReplyBlock = ({ p }) => {
    const open = openReplies.has(p.id);
    const count = (p.replies||[]).length;
    return (<>
      <button className="act" onClick={()=>toggleReplies(p.id)}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        {count} {count===1?"reply":"replies"}
      </button>
      {open && <div className="replies">
        {(p.replies||[]).map(r=>(
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
          <textarea className="reply-input" rows={1} placeholder="Add a reply..." value={replyDrafts[p.id]||""} onChange={e=>setReplyDrafts(prev=>({...prev,[p.id]:e.target.value}))}/>
          <button className="reply-send" onClick={()=>submitReply(p.id)} disabled={!(replyDrafts[p.id]||"").trim()}>Reply</button>
        </div>
      </div>}
    </>);
  };

  const EventCard = ({ event, compact }) => {
    const t = typeOf(event.type);
    const isGoing = rsvpd.has(event.id);
    const d = new Date(event.date);
    return (
      <div className="event-card" style={{borderLeft:`3px solid ${t.color}`}}>
        <div className="event-top">
          <span className="event-type-badge" style={{background:`${t.color}15`,color:t.color,border:`1px solid ${t.color}2A`}}>{t.emoji} {t.label}</span>
          <span className="event-date">{fmtDate(d)} · {fmt(d)} {event.timezone}</span>
        </div>
        <div className="event-title">{event.title}</div>
        {!compact && <div className="event-desc">{event.description}</div>}
        <div className="event-foot">
          <div className="event-host">
            <span className="event-host-avi">{event.hostAvatar}</span>
            <span className="event-host-name">{event.host}</span>
            <span className="event-dur">· {event.duration}min</span>
          </div>
          <div className="event-actions">
            <span className="event-attendees">👥 {event.attendees.length}</span>
            <button className={`rsvp-btn ${isGoing?"going":""}`} onClick={()=>toggleRsvp(event.id)}>
              {isGoing ? "✓ Going" : "RSVP"}
            </button>
            {isGoing && <a href={event.link} target="_blank" rel="noreferrer" className="join-btn">Join →</a>}
          </div>
        </div>
      </div>
    );
  };

  // Build calendar grid
  const totalDays = daysInMonth(calMonth, calYear);
  const firstDay = firstDayOfMonth(calMonth, calYear);
  const calCells = [];
  for (let i=0; i<firstDay; i++) calCells.push(null);
  for (let d=1; d<=totalDays; d++) calCells.push(d);

  const todayDate = new Date();
  const isToday = (d) => d===todayDate.getDate() && calMonth===todayDate.getMonth() && calYear===todayDate.getFullYear();

  return (<>
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

      /* ── Events / Calendar ── */
      .events-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}
      .events-title{font-family:'Fraunces',serif;font-weight:700;font-size:19px;color:#1A1814}
      .events-sub{font-size:12px;color:#9E9587;margin-top:2px}
      .cal-nav{display:flex;align-items:center;gap:10px}
      .cal-month{font-family:'Fraunces',serif;font-weight:600;font-size:15px;color:#1A1814;min-width:140px;text-align:center}
      .cal-btn{background:none;border:1px solid #D4CEC5;border-radius:7px;width:30px;height:30px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#6B6358;transition:all 0.15s;font-size:14px}
      .cal-btn:hover{border-color:#1A1814;color:#1A1814}
      .calendar{background:#fff;border:1px solid #E8E3DC;border-radius:14px;padding:16px;margin-bottom:20px}
      .cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px}
      .cal-day-label{text-align:center;font-size:11px;color:#9E9587;font-weight:600;padding:6px 0;letter-spacing:0.5px}
      .cal-cell{aspect-ratio:1;border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding:4px 2px;cursor:pointer;transition:background 0.12s;position:relative;min-height:36px}
      .cal-cell:hover{background:#F0EDE8}
      .cal-cell.empty{cursor:default}
      .cal-cell.empty:hover{background:transparent}
      .cal-cell.today .cal-num{background:#1A1814;color:#F5F2ED;border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center}
      .cal-cell.selected{background:#EDE9E3}
      .cal-cell.has-events{font-weight:600}
      .cal-num{font-size:12px;color:#1A1814;line-height:1;margin-bottom:2px;width:22px;height:22px;display:flex;align-items:center;justify-content:center}
      .cal-dots{display:flex;gap:2px;justify-content:center;flex-wrap:wrap;max-width:28px}
      .cal-dot{width:5px;height:5px;border-radius:50%}

      .selected-day-panel{background:#FFFBF5;border:1px solid #E8E3DC;border-radius:12px;padding:16px;margin-bottom:20px}
      .selected-day-title{font-family:'Fraunces',serif;font-weight:600;font-size:14px;color:#1A1814;margin-bottom:12px}
      .no-events-day{font-size:13px;color:#9E9587;font-style:italic}

      .event-card{background:#fff;border:1px solid #E8E3DC;border-radius:12px;padding:16px;margin-bottom:10px;border-left:3px solid #0EAD8B;transition:box-shadow 0.15s}
      .event-card:hover{box-shadow:0 3px 16px rgba(0,0,0,0.06)}
      .event-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
      .event-type-badge{font-size:10px;font-weight:600;padding:3px 9px;border-radius:100px;letter-spacing:0.4px;text-transform:uppercase}
      .event-date{font-size:11px;color:#9E9587}
      .event-title{font-family:'Fraunces',serif;font-weight:600;font-size:15px;color:#1A1814;margin-bottom:6px;line-height:1.4}
      .event-desc{font-size:12px;color:#6B6358;line-height:1.6;margin-bottom:10px}
      .event-foot{display:flex;align-items:center;justify-content:space-between;gap:8px}
      .event-host{display:flex;align-items:center;gap:6px}
      .event-host-avi{font-size:16px}
      .event-host-name{font-size:12px;font-weight:600;color:#1A1814;font-family:'Fraunces',serif}
      .event-dur{font-size:11px;color:#9E9587}
      .event-actions{display:flex;align-items:center;gap:8px}
      .event-attendees{font-size:12px;color:#9E9587}
      .rsvp-btn{background:#1A1814;color:#F5F2ED;border:none;border-radius:7px;padding:6px 14px;font-size:12px;font-weight:600;cursor:pointer;font-family:'IBM Plex Sans',sans-serif;transition:background 0.15s}
      .rsvp-btn:hover{background:#2D2922}
      .rsvp-btn.going{background:#0EAD8B}
      .rsvp-btn.going:hover{background:#0B9678}
      .join-btn{background:#EDF9F5;color:#0EAD8B;border:1px solid #B8EDD8;border-radius:7px;padding:6px 12px;font-size:12px;font-weight:600;cursor:pointer;font-family:'IBM Plex Sans',sans-serif;text-decoration:none;transition:all 0.15s}
      .join-btn:hover{background:#D5F5EB}

      .upcoming-head{font-family:'Fraunces',serif;font-weight:600;font-size:14px;color:#1A1814;margin-bottom:12px;margin-top:4px}

      .submit-banner{background:linear-gradient(135deg,#FFFBF5,#F0EDE8);border:1px solid #E8E3DC;border-radius:12px;padding:16px;margin-bottom:20px;display:flex;align-items:center;justify-content:space-between;gap:12px}
      .submit-banner-text{font-size:13px;color:#6B6358;line-height:1.5}
      .submit-banner-title{font-family:'Fraunces',serif;font-weight:600;font-size:14px;color:#1A1814;margin-bottom:3px}

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
      .cats{display:flex;gap:7px;flex-wrap:wrap;margin-top:13px}
      .cat-opt{padding:5px 13px;border-radius:100px;border:1px solid #D4CEC5;background:transparent;color:#6B6358;font-size:11px;font-weight:500;cursor:pointer;transition:all 0.15s;font-family:'IBM Plex Sans',sans-serif}
      .cat-opt.sel{background:#1A1814;border-color:#1A1814;color:#F5F2ED}
      .modal-foot{display:flex;justify-content:flex-end;gap:9px;margin-top:16px}
      .btn-cancel{background:none;border:1px solid #D4CEC5;border-radius:8px;color:#6B6358;font-family:'IBM Plex Sans',sans-serif;font-weight:500;font-size:13px;padding:8px 16px;cursor:pointer}
      .btn-submit{background:#1A1814;border:none;border-radius:8px;color:#F5F2ED;font-family:'IBM Plex Sans',sans-serif;font-weight:600;font-size:13px;padding:8px 20px;cursor:pointer}
      .btn-submit:disabled{opacity:0.3;cursor:default}
      .section-label{font-size:11px;color:#9E9587;letter-spacing:1.2px;text-transform:uppercase;margin:14px 0 7px}
      .add-opt-btn{background:none;border:1px dashed #D4CEC5;border-radius:8px;color:#9E9587;font-size:12px;padding:8px;width:100%;cursor:pointer;font-family:'IBM Plex Sans',sans-serif}
      .approval-note{background:#FEF9ED;border:1px solid #F5E4A0;border-radius:8px;padding:10px 14px;font-size:12px;color:#8A6F20;margin-top:14px;line-height:1.5}
      .success-banner{text-align:center;padding:32px 20px}
      .success-emoji{font-size:40px;margin-bottom:12px}
      .success-title{font-family:'Fraunces',serif;font-weight:700;font-size:18px;color:#1A1814;margin-bottom:6px}
      .success-sub{font-size:13px;color:#6B6358;line-height:1.6}
      .toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1A1814;color:#F5F2ED;font-family:'IBM Plex Sans',sans-serif;font-size:12px;padding:11px 20px;border-radius:10px;z-index:300;box-shadow:0 8px 32px rgba(0,0,0,0.2)}
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
            <input className="search-input" placeholder="Search posts, names..." value={search} onChange={e=>setSearch(e.target.value)}/>
            {search && <button className="search-clear" onClick={()=>setSearch("")}>✕</button>}
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
              <button className={`tab ${activeTab==="feed"?"on":""}`} onClick={()=>setActiveTab("feed")}>💬 Community Feed</button>
              <button className={`tab ${activeTab==="events"?"on":""}`} onClick={()=>setActiveTab("events")}>📅 Events</button>
              <button className={`tab ${activeTab==="resources"?"on":""}`} onClick={()=>setActiveTab("resources")}>📌 Resources</button>
            </div>

            {/* ── FEED ── */}
            {activeTab==="feed" && <>
              <div className="filters">
                <button className={`chip ${filter==="all"?"on":""}`} onClick={()=>setFilter("all")}>All</button>
                {CATEGORIES.map(c=>(
                  <button key={c.id} className={`chip ${filter===c.id?"on":""}`} onClick={()=>setFilter(c.id)}>{c.emoji} {c.label}</button>
                ))}
              </div>
              {feed.length===0 && <div className="no-results"><div className="no-results-emoji">🔍</div><div className="no-results-title">Nothing found</div><div className="no-results-sub">Try a different search or filter</div></div>}
              {feed.map(p => {
                const isLiked = liked.has(p.id);
                if (p.type==="poll") {
                  const voted = votedPolls[p.id];
                  const total = p.options.reduce((s,o)=>s+o.votes,0);
                  const winner = voted ? p.options.reduce((a,b)=>a.votes>b.votes?a:b).id : null;
                  return (
                    <div key={p.id} className="card poll-card">
                      <div className="card-top">
                        <div className="card-who"><div className="avi">{p.avatar}</div><div><div className="who-name">{p.name}</div><div className="who-meta">{p.loc} · {p.time}</div></div></div>
                        <span className="poll-badge">📊 Poll</span>
                      </div>
                      <div className="poll-q">{p.question}</div>
                      <div className="poll-options">
                        {p.options.map(opt=>{
                          const pct = total>0?Math.round((opt.votes/total)*100):0;
                          return (
                            <div key={opt.id} className={`poll-opt${voted?" voted":""}${voted===opt.id?" my-vote":""}`} onClick={()=>voteOnPoll(p.id,opt.id)}>
                              <div className={`poll-bar${winner===opt.id?" winner":""}`} style={{width:voted?`${pct}%`:"0%"}}/>
                              <div className="poll-opt-inner"><span className="poll-opt-text">{opt.text}</span>{voted&&<span className="poll-opt-pct">{pct}%</span>}</div>
                            </div>
                          );
                        })}
                      </div>
                      {voted && <div className="poll-total">{total} votes total</div>}
                      <div className="card-foot"><ReplyBlock p={p}/></div>
                    </div>
                  );
                }
                const cat = catOf(p.category);
                return (
                  <div key={p.id} className={`card ${p.category}`}>
                    <div className="card-top">
                      <div className="card-who"><div className="avi">{p.avatar}</div><div><div className="who-name">{p.name}</div><div className="who-meta">{p.loc} · {p.time}</div></div></div>
                      <div className="badge-wrap">
                        <span className="cat-badge" style={{background:`${cat.color}15`,color:cat.color,border:`1px solid ${cat.color}2A`}}>{cat.emoji} {cat.label}</span>
                        {p.hot && <span className="hot">HOT</span>}
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
            {activeTab==="events" && <>
              <div className="events-header">
                <div>
                  <div className="events-title">📅 Community Events</div>
                  <div className="events-sub">Virtual meetups, skill shares and socials — all in your timezone</div>
                </div>
                <div className="cal-nav">
                  <button className="cal-btn" onClick={prevMonth}>‹</button>
                  <span className="cal-month">{MONTHS[calMonth]} {calYear}</span>
                  <button className="cal-btn" onClick={nextMonth}>›</button>
                </div>
              </div>

              {/* Submit banner */}
              <div className="submit-banner">
                <div>
                  <div className="submit-banner-title">Got something to share?</div>
                  <div className="submit-banner-text">Host a virtual coffee, skill share, or Q&A. Submit your event and we'll review it within 24 hours.</div>
                </div>
                <button className="btn-icon-solid" style={{whiteSpace:"nowrap",flexShrink:0}} onClick={()=>{setSubmittedEvent(false);setComposeEvent(true);}}>+ Submit Event</button>
              </div>

              {/* Calendar */}
              <div className="calendar">
                <div className="cal-grid">
                  {DAYS.map(d=><div key={d} className="cal-day-label">{d}</div>)}
                  {calCells.map((day,i)=>{
                    if (!day) return <div key={`e${i}`} className="cal-cell empty"/>;
                    const dayEvents = eventsForDay(day);
                    return (
                      <div key={day} className={`cal-cell${isToday(day)?" today":""}${selectedDay===day?" selected":""}${dayEvents.length?" has-events":""}`}
                        onClick={()=>setSelectedDay(selectedDay===day?null:day)}>
                        <div className="cal-num">{day}</div>
                        {dayEvents.length>0 && (
                          <div className="cal-dots">
                            {dayEvents.slice(0,3).map(e=>{
                              const t=typeOf(e.type);
                              return <div key={e.id} className="cal-dot" style={{background:t.color}}/>;
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selected day panel */}
              {selectedDay && (
                <div className="selected-day-panel">
                  <div className="selected-day-title">{selectedDay} {MONTHS[calMonth]}</div>
                  {selectedDayEvents.length===0
                    ? <div className="no-events-day">No events on this day</div>
                    : selectedDayEvents.map(e=><EventCard key={e.id} event={e} compact={false}/>)
                  }
                </div>
              )}

              {/* Upcoming events list */}
              <div className="upcoming-head">Upcoming Events</div>
              {events.filter(e=>e.approved && new Date(e.date)>=new Date()).sort((a,b)=>new Date(a.date)-new Date(b.date)).map(e=>(
                <EventCard key={e.id} event={e} compact={false}/>
              ))}
            </>}

            {/* ── RESOURCES ── */}
            {activeTab==="resources" && <div>
              <div className="resources-head">Pinned Resources</div>
              <div className="resources-sub">Curated by the community — things that actually help with the day-to-day.</div>
              {RESOURCES.map((r,i)=>(
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
              <div className="welcome-body">A <span className="welcome-hl">safe, closed space</span> to share, vent, and support each other. No managers, no judgment.</div>
            </div>
            <div className="rail-card">
              <div className="rail-title">Right now</div>
              <div className="rail-num">3,104</div>
              <div className="rail-sub"><span className="live-dot"/>members online</div>
              <div className="rail-num">7.1k</div>
              <div className="rail-sub">posts today</div>
            </div>
            {activeTab==="events" && (
              <div className="rail-card">
                <div className="rail-title">Your RSVPs</div>
                {events.filter(e=>rsvpd.has(e.id)).length===0
                  ? <div style={{fontSize:12,color:"#9E9587",fontStyle:"italic"}}>No RSVPs yet — explore the events tab!</div>
                  : events.filter(e=>rsvpd.has(e.id)).map(e=>{
                    const t=typeOf(e.type);
                    const d=new Date(e.date);
                    return <div key={e.id} style={{marginBottom:10}}>
                      <div style={{fontSize:12,fontWeight:600,color:"#1A1814",fontFamily:"'Fraunces',serif"}}>{e.title}</div>
                      <div style={{fontSize:11,color:"#9E9587"}}>{fmtDate(d)} · {fmt(d)}</div>
                    </div>;
                  })
                }
              </div>
            )}
            {activeTab==="feed" && (
              <div className="rail-card">
                <div className="rail-title">Trending</div>
                {["#JustOneMoreReschedule","#847UnreadEmails","#ASAPAtFivePM","#TheAgendaMeeting","#NewExpensesSystem","#ManagingUpIsAJob"].map(t=>(
                  <div key={t}><span className="tag" onClick={()=>setSearch(t.slice(1))}>{t}</span></div>
                ))}
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Compose Post */}
      {compose && <div className="overlay" onClick={e=>e.target===e.currentTarget&&setCompose(false)}>
        <div className="modal">
          <div className="modal-title">What's going on?</div>
          <div className="modal-who"><div className="avi">{myAvatar}</div><div><div className="compose-name">{myName} · {myLoc}</div><div className="compose-sub">Posting to The Lounge</div></div></div>
          <textarea placeholder="Tell the group what's really going on..." value={draft.content} onChange={e=>setDraft(d=>({...d,content:e.target.value}))}/>
          <div className="cats">{CATEGORIES.map(c=>(<button key={c.id} className={`cat-opt ${draft.category===c.id?"sel":""}`} onClick={()=>setDraft(d=>({...d,category:c.id}))}>{c.emoji} {c.label}</button>))}</div>
          <div className="modal-foot"><button className="btn-cancel" onClick={()=>setCompose(false)}>Cancel</button><button className="btn-submit" onClick={submitPost} disabled={!draft.content.trim()}>Post</button></div>
        </div>
      </div>}

      {/* Compose Poll */}
      {composePoll && <div className="overlay" onClick={e=>e.target===e.currentTarget&&setComposePoll(false)}>
        <div className="modal">
          <div className="modal-title">Create a Poll</div>
          <div className="modal-who"><div className="avi">{myAvatar}</div><div><div className="compose-name">{myName} · {myLoc}</div><div className="compose-sub">Posting to The Lounge</div></div></div>
          <div className="section-label">Your question</div>
          <input className="input-field" placeholder="Ask the community something..." value={pollDraft.question} onChange={e=>setPollDraft(d=>({...d,question:e.target.value}))}/>
          <div className="section-label">Options</div>
          {pollDraft.options.map((opt,i)=>(<input key={i} className="input-field" placeholder={`Option ${i+1}`} value={opt} onChange={e=>{ const opts=[...pollDraft.options]; opts[i]=e.target.value; setPollDraft(d=>({...d,options:opts})); }}/>))}
          {pollDraft.options.length<5 && <button className="add-opt-btn" onClick={()=>setPollDraft(d=>({...d,options:[...d.options,""]}))}>+ Add option</button>}
          <div className="modal-foot"><button className="btn-cancel" onClick={()=>setComposePoll(false)}>Cancel</button><button className="btn-submit" onClick={submitPoll} disabled={!pollDraft.question.trim()||pollDraft.options.filter(o=>o.trim()).length<2}>Post Poll</button></div>
        </div>
      </div>}

      {/* Submit Event */}
      {composeEvent && <div className="overlay" onClick={e=>e.target===e.currentTarget&&setComposeEvent(false)}>
        <div className="modal">
          {submittedEvent ? (
            <div className="success-banner">
              <div className="success-emoji">🎉</div>
              <div className="success-title">Event submitted!</div>
              <div className="success-sub">We'll review your event within 24 hours and let you know when it's live. Thank you for contributing to the community!</div>
              <div className="modal-foot" style={{justifyContent:"center",marginTop:20}}><button className="btn-submit" onClick={()=>setComposeEvent(false)}>Done</button></div>
            </div>
          ) : (
            <>
              <div className="modal-title">Submit an Event</div>
              <div className="modal-who"><div className="avi">{myAvatar}</div><div><div className="compose-name">{myName} · {myLoc}</div><div className="compose-sub">Submitted for admin approval</div></div></div>
              <div className="section-label">Event type</div>
              <div className="cats" style={{marginTop:0,marginBottom:12}}>
                {EVENT_TYPES.map(t=>(
                  <button key={t.id} className={`cat-opt ${eventDraft.type===t.id?"sel":""}`} onClick={()=>setEventDraft(d=>({...d,type:t.id}))}>{t.emoji} {t.label}</button>
                ))}
              </div>
              <div className="section-label">Title</div>
              <input className="input-field" placeholder="e.g. Morning Coffee & Chat" value={eventDraft.title} onChange={e=>setEventDraft(d=>({...d,title:e.target.value}))}/>
              <div className="section-label">Date & Time</div>
              <div className="input-row">
                <input className="input-field" style={{marginBottom:0}} type="date" value={eventDraft.date} onChange={e=>setEventDraft(d=>({...d,date:e.target.value}))}/>
                <input className="input-field" style={{marginBottom:0}} type="time" value={eventDraft.time} onChange={e=>setEventDraft(d=>({...d,time:e.target.value}))}/>
              </div>
              <div className="input-row" style={{marginTop:8}}>
                <input className="input-field" style={{marginBottom:0}} placeholder="Timezone (e.g. GMT)" value={eventDraft.timezone} onChange={e=>setEventDraft(d=>({...d,timezone:e.target.value}))}/>
                <input className="input-field" style={{marginBottom:0}} type="number" placeholder="Duration (mins)" value={eventDraft.duration} onChange={e=>setEventDraft(d=>({...d,duration:e.target.value}))}/>
              </div>
              <div className="section-label">Description</div>
              <textarea style={{minHeight:80}} placeholder="What's this event about? Who should come?" value={eventDraft.description} onChange={e=>setEventDraft(d=>({...d,description:e.target.value}))}/>
              <div className="section-label">Meeting link</div>
              <input className="input-field" placeholder="Zoom, Google Meet, Teams..." value={eventDraft.link} onChange={e=>setEventDraft(d=>({...d,link:e.target.value}))}/>
              <div className="approval-note">⏳ Your event will be reviewed by an admin before going live. We'll approve within 24 hours.</div>
              <div className="modal-foot">
                <button className="btn-cancel" onClick={()=>setComposeEvent(false)}>Cancel</button>
                <button className="btn-submit" onClick={submitEvent} disabled={!eventDraft.title.trim()||!eventDraft.date||!eventDraft.time}>Submit for Approval</button>
              </div>
            </>
          )}
        </div>
      </div>}

      {toast && <div className="toast">{toast}</div>}
    </div>
  </>);
}
