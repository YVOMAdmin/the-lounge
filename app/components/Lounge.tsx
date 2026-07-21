'use client'

import { useState, useMemo, useEffect, useCallback, useRef, memo } from "react";
import { createBrowserClient } from '@supabase/ssr'
import { isAdminEmail } from '@/lib/admin'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const FONT = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap');`;

const CATEGORIES = [
  { id: "rant",       label: "Rant",         emoji: "🔥", color: "#F4622A" },
  { id: "advice",     label: "Need Advice",  emoji: "🙋", color: "#7C5CFC" },
  { id: "experience", label: "Story Time",   emoji: "📖", color: "#0EAD8B" },
  { id: "wins",       label: "Small Win",    emoji: "🎉", color: "#F5A623" },
  { id: "venting",    label: "Just Venting", emoji: "☁️", color: "#5B8DD9" },
];

const POSTIT_ROTATIONS = [-3, 2, -1.5, 2.5, -2, 1.5];
const WORK_TYPE_ICON: Record<string,string> = { Remote: '🏠', Hybrid: '🔁', 'Office-based': '🏢' };

const EVENT_TYPES = [
  { id: "coffee",     label: "Virtual Coffee",  emoji: "☕", color: "#F5A623" },
  { id: "coffeemtg",  label: "Coffee Meeting",  emoji: "☕", color: "#C47D2A" },
  { id: "networking", label: "Networking",      emoji: "🤝", color: "#0EAD8B" },
  { id: "qa",         label: "Q&A",             emoji: "🙋", color: "#7C5CFC" },
  { id: "skillshare", label: "Skill Share",     emoji: "💡", color: "#F4622A" },
  { id: "webinar",    label: "Webinar",         emoji: "📣", color: "#5B8DD9" },
  { id: "social",     label: "Social Events",   emoji: "🎉", color: "#E91E8C" },
];

const JOB_TABS = [
  { id: "PA/EA",             label: "PA / EA",           emoji: "👤", color: "#FFCDD9" },
  { id: "Office Manager",    label: "Office Manager",    emoji: "📋", color: "#C5B8F5" },
  { id: "Virtual Assistant", label: "Virtual Assistant", emoji: "💻", color: "#B8F0D0" },
  { id: "Operations",        label: "Operations",        emoji: "⚙️", color: "#FFE5B4" },
  { id: "Chief of Staff",    label: "Chief of Staff",    emoji: "👑", color: "#B3D9FF" },
  { id: "Entry Level",       label: "Entry Level",       emoji: "📥", color: "#F9C4A0" },
  { id: "HR",                label: "HR",                emoji: "👥", color: "#FFC8F0" },
  { id: "Finance",           label: "Finance",            emoji: "💰", color: "#D0F0C0" },
  { id: "Compliance",        label: "Compliance",        emoji: "✅", color: "#C8E0FF" },
];

const MAX_POST_IMAGES = 4;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

const AVATARS = ["📋","🗂","📌","☕","🖨","📎","📁","✉️","🗓","💼"];
const FIRST   = ["Diane","Karen","Priya","Chloe","Nadia","Ruth","Bex","Simone","Tara","Mel"];
const LOCS    = ["EST","GMT","PST","AEST","CET","GMT-5","IST","GMT+8","CST","MST"];
const MONTHS  = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS    = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const RESOURCE_SECTIONS = [
  { id: "resources", label: "Resources",       emoji: "📚", color: "#B8F0D0" },
  { id: "contacts",  label: "Useful Contacts", emoji: "🤝", color: "#FFE5B4" },
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
const fmtEnd = (d: Date, duration: number) => {
  const end = new Date(d.getTime() + duration * 60000);
  return d.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}) + ' - ' + end.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"});
};
const fmtDate= (d: Date)    => `${d.getDate()} ${MONTHS[d.getMonth()]}`;
const timeAgo = (iso: string) => {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

function mapReplyTree(replies: any[], targetId: any, fn: (r: any) => any): any[] {
  return (replies||[]).map((r:any) => {
    if (r.id === targetId) return fn(r);
    if (r.replies && r.replies.length) return { ...r, replies: mapReplyTree(r.replies, targetId, fn) };
    return r;
  });
}
function addNestedReply(replies: any[], targetId: any, newReply: any): any[] {
  return (replies||[]).map((r:any) => {
    if (r.id === targetId) return { ...r, replies: [...(r.replies||[]), newReply] };
    if (r.replies && r.replies.length) return { ...r, replies: addNestedReply(r.replies, targetId, newReply) };
    return r;
  });
}
function collectLikedReplies(posts: any[], likedReplies: Set<any>): {postId:any,postPreview:string,reply:any}[] {
  const result: {postId:any,postPreview:string,reply:any}[] = [];
  const walk = (replies: any[], postId: any, preview: string) => {
    (replies||[]).forEach((r:any) => {
      if (likedReplies.has(r.id)) result.push({ postId, postPreview: preview, reply: r });
      if (r.replies && r.replies.length) walk(r.replies, postId, preview);
    });
  };
  posts.forEach((p:any) => walk(p.replies, p.id, p.content || p.question || ""));
  return result;
}

type ReplyItemProps = {
  r: any; postId: any; myAvatar: string; myName: string; isAdmin: boolean; isFounder: boolean;
  likedReplies: Set<any>; openReplyInputs: Set<any>; nestedReplyDrafts: any; expandedReplies: Set<any>;
  onToggleReplyLike: (postId: any, replyId: any) => void;
  onToggleReplyInput: (replyId: any, name: string) => void;
  onNestedDraftChange: (replyId: any, value: string) => void;
  onSubmitNestedReply: (postId: any, replyId: any) => void;
  onToggleExpanded: (replyId: any) => void;
};

const ReplyItem = memo(function ReplyItem({ r, postId, myAvatar, myName, isAdmin, isFounder, likedReplies, openReplyInputs, nestedReplyDrafts, expandedReplies, onToggleReplyLike, onToggleReplyInput, onNestedDraftChange, onSubmitNestedReply, onToggleExpanded }: ReplyItemProps) {
  const isLiked = likedReplies.has(r.id);
  const likeCount = r.likes || 0;
  const inputOpen = openReplyInputs.has(r.id);
  const childReplies = r.replies || [];
  const draft = nestedReplyDrafts[r.id] || "";
  const isExpanded = expandedReplies.has(r.id);
  return (
    <div className="reply">
      <div className="reply-avi">{r.avatar}</div>
      <div className="reply-body">
        <span className="reply-who">{r.name}{isAdmin&&r.name===myName&&<span className="admin-badge">Admin</span>}{isFounder&&r.name===myName&&<span className="founder-badge">🌟 Founder</span>}</span>
        <span className="reply-loc">{r.loc} · {r.time}</span>
        <div className="reply-text">{r.text}</div>
        <div className="reply-actions">
          <button className={`reply-act ${isLiked?"on":""}`} onClick={()=>onToggleReplyLike(postId, r.id)}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            {likeCount}
          </button>
          <button className="reply-act" onClick={()=>onToggleReplyInput(r.id, r.name)}>Reply</button>
          {childReplies.length>0 && (
            <button className="view-replies-toggle" onClick={()=>onToggleExpanded(r.id)}>
              {isExpanded ? "▲ Hide replies" : `▼ View ${childReplies.length} ${childReplies.length===1?"reply":"replies"}`}
            </button>
          )}
        </div>
        {inputOpen && (
          <div className="reply-input-row reply-input-row-nested" style={{marginTop:8}}>
            <div className="reply-avi">{myAvatar}</div>
            <div className="reply-input-stack" style={{width:'100%',maxWidth:'100%'}}>
              <textarea className="reply-input nested-reply-input" rows={1} placeholder={`Reply to @${r.name}...`} value={draft}
                style={{width:'100%',maxWidth:'100%',boxSizing:'border-box',minHeight:80}}
                onChange={(e:any)=>{onNestedDraftChange(r.id, e.target.value);e.target.style.height="auto";e.target.style.height=`${e.target.scrollHeight}px`;}}/>
              <button className="reply-send" onClick={()=>onSubmitNestedReply(postId, r.id)} disabled={!draft.trim()}>Reply</button>
            </div>
          </div>
        )}
        {childReplies.length>0 && isExpanded && (
          <div className="nested-replies">
            {childReplies.map((child:any)=>(
              <ReplyItem key={child.id} r={child} postId={postId} myAvatar={myAvatar} myName={myName} isAdmin={isAdmin} isFounder={isFounder}
                likedReplies={likedReplies} openReplyInputs={openReplyInputs} nestedReplyDrafts={nestedReplyDrafts} expandedReplies={expandedReplies}
                onToggleReplyLike={onToggleReplyLike} onToggleReplyInput={onToggleReplyInput}
                onNestedDraftChange={onNestedDraftChange} onSubmitNestedReply={onSubmitNestedReply} onToggleExpanded={onToggleExpanded}/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

const ReplyBlock = memo(function ReplyBlock({ p, isOpen, onToggle }: { p: any; isOpen: boolean; onToggle: () => void }) {
  const count = (p.replies || []).length;
  return (
    <button className="act" onClick={onToggle}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      {count} {count===1?"Comment":"Comments"}
    </button>
  );
});

const CommentsPanel = memo(function CommentsPanel({ p, myAvatar, myName, isAdmin, isFounder, isOpen, draft, onDraftChange, onSubmit, likedReplies, openReplyInputs, nestedReplyDrafts, expandedReplies, onToggleReplyLike, onToggleReplyInput, onNestedDraftChange, onSubmitNestedReply, onToggleExpanded }: {
  p: any; myAvatar: string; myName: string; isAdmin: boolean; isFounder: boolean; isOpen: boolean;
  draft: string; onDraftChange: (value: string) => void; onSubmit: () => void;
  likedReplies: Set<any>; openReplyInputs: Set<any>; nestedReplyDrafts: any; expandedReplies: Set<any>;
  onToggleReplyLike: (postId: any, replyId: any) => void;
  onToggleReplyInput: (replyId: any, name: string) => void;
  onNestedDraftChange: (replyId: any, value: string) => void;
  onSubmitNestedReply: (postId: any, replyId: any) => void;
  onToggleExpanded: (replyId: any) => void;
}) {
  const [composerOpen, setComposerOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement|null>(null);

  const openComposer = () => {
    setComposerOpen(true);
    setTimeout(()=>textareaRef.current?.focus(), 0);
  };
  const handleBlur = () => {
    setTimeout(()=>{ if(!draft.trim()) setComposerOpen(false); }, 150);
  };

  return (
    <div className="comments-panel">
      {isOpen && <>
        {(p.replies||[]).length>0 && (
          <div className="replies">
            {(p.replies||[]).map((r:any)=>(
              <ReplyItem key={r.id} r={r} postId={p.id} myAvatar={myAvatar} myName={myName} isAdmin={isAdmin} isFounder={isFounder}
                likedReplies={likedReplies} openReplyInputs={openReplyInputs} nestedReplyDrafts={nestedReplyDrafts} expandedReplies={expandedReplies}
                onToggleReplyLike={onToggleReplyLike} onToggleReplyInput={onToggleReplyInput}
                onNestedDraftChange={onNestedDraftChange} onSubmitNestedReply={onSubmitNestedReply} onToggleExpanded={onToggleExpanded}/>
            ))}
          </div>
        )}
        {!composerOpen ? (
          <div className="comment-input-preview" onClick={openComposer}>
            <div className="reply-avi">{myAvatar}</div>
            <span className="comment-input-preview-text">Add a comment...</span>
          </div>
        ) : (
          <div className="reply-input-row comment-input-row">
            <div className="reply-avi">{myAvatar}</div>
            <div className="reply-input-stack" style={{width:'100%',maxWidth:'100%'}}>
              <textarea ref={textareaRef} className="reply-input comment-input" rows={1} placeholder="Add a comment..." autoFocus
                style={{width:'100%',maxWidth:'100%',boxSizing:'border-box',minHeight:80}} value={draft}
                onChange={(e:any)=>{onDraftChange(e.target.value);e.target.style.height="auto";e.target.style.height=`${e.target.scrollHeight}px`;}}
                onBlur={handleBlur}/>
              <button className="reply-send" onClick={()=>{onSubmit();setComposerOpen(false);}} disabled={!draft.trim()}>Reply</button>
            </div>
          </div>
        )}
      </>}
    </div>
  );
});

export default function Lounge() {
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
  const [posts, setPosts]             = useState<any[]>([]);
  const [postsLoaded, setPostsLoaded] = useState(false);
  const [events, setEvents]           = useState(SEED_EVENTS);
  const [filter, setFilter]           = useState("all");
  const [search, setSearch]           = useState("");
  const [compose, setCompose]         = useState(false);
  const [draft, setDraft]             = useState({content:"",category:"rant"});
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews]   = useState<string[]>([]);
  const [imageError, setImageError]   = useState<string|null>(null);
  const [posting, setPosting]         = useState(false);
  const fileInputRef = useRef<HTMLInputElement|null>(null);
  const [composePoll, setComposePoll] = useState(false);
  const [pollDraft, setPollDraft]     = useState({question:"",options:["","",""]});
  const [liked, setLiked]             = useState(new Set<any>());
  const [toast, setToast]             = useState<string|null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<any>(null);
  const [openReplies, setOpenReplies] = useState(new Set<any>());
  const [replyDrafts, setReplyDrafts] = useState<any>({});
  const [likedReplies, setLikedReplies] = useState(new Set<any>());
  const [openReplyInputs, setOpenReplyInputs] = useState(new Set<any>());
  const [nestedReplyDrafts, setNestedReplyDrafts] = useState<any>({});
  const [expandedReplies, setExpandedReplies] = useState(new Set<any>());
  const [votedPolls, setVotedPolls]   = useState<any>({});
  const [activeTab, setActiveTab]     = useState("feed");
  const [calMonth, setCalMonth]       = useState(new Date().getMonth());
  const [calYear, setCalYear]         = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState<number|null>(null);
  const [jobListings, setJobListings] = useState<any[]>([]);
  const [jobTab, setJobTab]           = useState("PA/EA");
  const [resourceSection, setResourceSection] = useState("resources");
  const [resources, setResources]     = useState<any[]>([]);
  const [usefulContacts, setUsefulContacts] = useState<any[]>([]);
  const [jobCalMonth, setJobCalMonth] = useState(new Date().getMonth());
  const [jobCalYear, setJobCalYear]   = useState(new Date().getFullYear());
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [jobDayModal, setJobDayModal] = useState<number|null>(null);
  const [jobFavourites, setJobFavourites] = useState<any[]>([]);
  const [composeEvent, setComposeEvent] = useState(false);
  const [submittedEvent, setSubmittedEvent] = useState(false);
  const [rsvpd, setRsvpd]             = useState(new Set<any>());
  const [eventDraft, setEventDraft]   = useState({title:"",type:"coffee",date:"",time:"",timezone:"GMT",duration:60,description:"",link:"",dropIn:false});
  const [myAvatar, setMyAvatar] = useState("☕");
  const [myName, setMyName]     = useState("You");
  const [myLoc, setMyLoc]       = useState("GMT");
const [userEmail, setUserEmail] = useState<string | null>(null)
const [userId, setUserId] = useState<string | null>(null)
const [isFounder, setIsFounder] = useState(false)
const isAdmin = isAdminEmail(userEmail)
const [membershipType, setMembershipType] = useState('member')
const [signedUpAsMember, setSignedUpAsMember] = useState(false)
const isFreeTier = !isAdmin && membershipType === 'free'
const [upgradeModalOpen, setUpgradeModalOpen] = useState(false)
const [upgrading, setUpgrading] = useState(false)
const [upgradeDone, setUpgradeDone] = useState(false)
const [notifications, setNotifications] = useState<any[]>([])
const [notifPref, setNotifPref] = useState<boolean>(() => {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem('lounge_notif_pref') !== 'false';
})
const [settingsOpen, setSettingsOpen] = useState(false)
const [likesOpen, setLikesOpen] = useState(false)
const [viewFilter, setViewFilter] = useState<'all'|'mine'|'liked'>('all')
const [profileForm, setProfileForm] = useState({username:"",location:""})
const [savingProfile, setSavingProfile] = useState(false)
const [newsletterOptedIn, setNewsletterOptedIn] = useState(false)
const [showNotifications, setShowNotifications] = useState(false)
const [menuOpen, setMenuOpen] = useState(false)
const SUGGESTION_TYPES = [
  { id: 'feedback', label: 'Feedback', emoji: '💬' },
  { id: 'suggestion', label: 'Suggestion', emoji: '💡' },
  { id: 'idea', label: 'Idea', emoji: '✨' },
]
const [suggestionType, setSuggestionType] = useState('suggestion')
const [suggestionMessage, setSuggestionMessage] = useState('')
const [suggestionSubmitted, setSuggestionSubmitted] = useState(false)
const [suggestionLoading, setSuggestionLoading] = useState(false)
const [approvedSuggestions, setApprovedSuggestions] = useState<any[]>([])


  const feed = useMemo(()=>{
    let list = filter==="all" ? posts : posts.filter((p:any)=>p.category===filter||p.type==="poll");
    if (viewFilter==="mine") list = list.filter((p:any)=>p.name===myName);
    if (viewFilter==="liked") list = list.filter((p:any)=>p.type!=="poll"&&liked.has(p.id));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p:any)=>(p.content&&p.content.toLowerCase().includes(q))||(p.question&&p.question.toLowerCase().includes(q))||(p.name&&p.name.toLowerCase().includes(q)));
    }
    return list;
  },[posts,filter,search,viewFilter,liked,myName]);
  const likedPostsList = useMemo(()=>posts.filter((p:any)=>p.type!=="poll"&&liked.has(p.id)),[posts,liked]);
  const likedCommentsList = useMemo(()=>collectLikedReplies(posts, likedReplies),[posts,likedReplies]);
  const trendingHashtags = useMemo(()=>{
    const counts: Record<string, number> = {};
    posts.forEach((p:any)=>{
      if (!p.content) return;
      const matches = p.content.match(/#[a-zA-Z0-9_]+/g);
      if (matches) matches.forEach((tag:string)=>{ counts[tag]=(counts[tag]||0)+1; });
    });
    return Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([tag])=>tag);
  },[posts]);

  const daysInMonth  = (m:number,y:number) => new Date(y,m+1,0).getDate();
  const firstDayOfMonth = (m:number,y:number) => new Date(y,m,1).getDay();
  const eventsForDay = (day:number) => events.filter((e:any)=>{
    const d=new Date(e.date);
    return d.getDate()===day&&d.getMonth()===calMonth&&d.getFullYear()===calYear&&e.approved;
  });
  const selectedDayEvents = selectedDay ? eventsForDay(selectedDay) : [];
  const prevMonth = ()=>{ if(calMonth===0){setCalMonth(11);setCalYear((y:number)=>y-1);}else setCalMonth((m:number)=>m-1); setSelectedDay(null); };
  const nextMonth = ()=>{ if(calMonth===11){setCalMonth(0);setCalYear((y:number)=>y+1);}else setCalMonth((m:number)=>m+1); setSelectedDay(null); };
  const jobPrevMonth = ()=>{ if(jobCalMonth===0){setJobCalMonth(11);setJobCalYear((y:number)=>y-1);}else setJobCalMonth((m:number)=>m-1); };
  const jobNextMonth = ()=>{ if(jobCalMonth===11){setJobCalMonth(0);setJobCalYear((y:number)=>y+1);}else setJobCalMonth((m:number)=>m+1); };
  const jobsForDay = (tab:string, day:number) => jobListings.filter((j:any)=>{
    if(j.role_category!==tab) return false;
    const d=new Date(j.posted_date+"T00:00:00");
    return d.getDate()===day&&d.getMonth()===jobCalMonth&&d.getFullYear()===jobCalYear;
  });
  const isFavourited = (jobId:any) => jobFavourites.some((f:any)=>f.job_id===jobId);
  const toggleFavourite = async (jobId:any) => {
    if (!userId) return;
    const existing = jobFavourites.find((f:any)=>f.job_id===jobId);
    if (existing) {
      setJobFavourites((prev:any)=>prev.filter((f:any)=>f.id!==existing.id));
      await supabase.from('job_favourites').delete().eq('id', existing.id);
    } else {
      const { data } = await supabase.from('job_favourites').insert({ user_id: userId, job_id: jobId }).select().single();
      if (data) setJobFavourites((prev:any)=>[data, ...prev]);
    }
  };
  const toggleJobApplied = async (fav:any) => {
    const applied = !fav.applied;
    const applied_at = applied ? new Date().toISOString() : null;
    setJobFavourites((prev:any)=>prev.map((f:any)=>f.id===fav.id?{...f,applied,applied_at}:f));
    await supabase.from('job_favourites').update({ applied, applied_at }).eq('id', fav.id);
    if (applied) showToast("Marked as applied ✓");
  };

  const showToast = (msg:string)=>{ setToast(msg); setTimeout(()=>setToast(null),3000); };
 const toggleLike = async (id: any) => {
  if (!userId) return;
  const was = liked.has(id);
  setLiked((prev: any) => { const n = new Set(prev); was ? n.delete(id) : n.add(id); return n; });
  setPosts((prev: any) => prev.map((p: any) => p.id === id && p.likes != null ? { ...p, likes: was ? p.likes - 1 : p.likes + 1 } : p));
  if (was) {
    await supabase.from('likes').delete().eq('post_id', id).eq('profile_id', userId);
  } else {
    await supabase.from('likes').insert({ post_id: id, profile_id: userId });
    const post = posts.find((p:any)=>p.id===id); if(post?.author_id){ const s=await supabase.auth.getSession(); fetch('/api/notify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({user_id:post.author_id,type:'like',post_id:id,from_user_id:s.data.session?.user.id,from_username:myName,message:`${myName} liked your post`})}) }
  }
};

  const toggleReplies=useCallback((id:any)=>setOpenReplies((prev:any)=>{const n=new Set(prev);n.has(id)?n.delete(id):n.add(id);return n;}),[]);
 const submitReply=async(postId:any)=>{
    const text=(replyDrafts[postId]||"").trim();
    if(!text||!userId)return;
    const { data, error } = await supabase.from('replies').insert({ post_id: postId, author_id: userId, content: text }).select().single();
    if (error) { showToast("Failed to post reply"); return; }
    setPosts((prev:any)=>prev.map((p:any)=>p.id===postId?{...p,replies:[...(p.replies||[]),{id:data.id,avatar:myAvatar,name:myName,loc:myLoc,time:"just now",text,likes:0,replies:[]}]}:p));
    setReplyDrafts((prev:any)=>({...prev,[postId]:""}));
    showToast("Reply posted ✓");
    const post = posts.find((p:any)=>p.id===postId); if(post?.author_id){ const s=await supabase.auth.getSession(); fetch('/api/notify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({user_id:post.author_id,type:'reply',post_id:postId,from_user_id:s.data.session?.user.id,from_username:myName,message:`${myName} replied to your post`})}) }
  };
  const toggleReplyLike = (postId:any, replyId:any) => {
    const was = likedReplies.has(replyId);
    setLikedReplies((prev:any)=>{const n=new Set(prev); was?n.delete(replyId):n.add(replyId); return n;});
    setPosts((prev:any)=>prev.map((p:any)=>p.id!==postId?p:{...p,replies:mapReplyTree(p.replies||[],replyId,(r:any)=>({...r,likes:(r.likes||0)+(was?-1:1)}))}));
  };
  const toggleReplyInput = (replyId:any, name:string) => {
    setOpenReplyInputs((prev:any)=>{const n=new Set(prev); n.has(replyId)?n.delete(replyId):n.add(replyId); return n;});
    setNestedReplyDrafts((prev:any)=>prev[replyId]!==undefined?prev:{...prev,[replyId]:`@${name} `});
  };
  const submitNestedReply = async (postId:any, parentReplyId:any) => {
    const text=(nestedReplyDrafts[parentReplyId]||"").trim();
    if(!text||!userId)return;
    const { data, error } = await supabase.from('replies').insert({ post_id: postId, author_id: userId, parent_comment_id: parentReplyId, content: text }).select().single();
    if (error) { showToast("Failed to post reply"); return; }
    const newReply={id:data.id,avatar:myAvatar,name:myName,loc:myLoc,time:"just now",text,likes:0,replies:[]};
    setPosts((prev:any)=>prev.map((p:any)=>p.id!==postId?p:{...p,replies:addNestedReply(p.replies||[],parentReplyId,newReply)}));
    setNestedReplyDrafts((prev:any)=>({...prev,[parentReplyId]:""}));
    setOpenReplyInputs((prev:any)=>{const n=new Set(prev); n.delete(parentReplyId); return n;});
    setExpandedReplies((prev:any)=>{const n=new Set(prev); n.add(parentReplyId); return n;});
    showToast("Reply posted ✓");
  };
  const toggleExpandedReplies = (replyId:any) => {
    setExpandedReplies((prev:any)=>{const n=new Set(prev); n.has(replyId)?n.delete(replyId):n.add(replyId); return n;});
  };
  const voteOnPoll=(pollId:any,optId:any)=>{
    if(votedPolls[pollId])return;
    setVotedPolls((prev:any)=>({...prev,[pollId]:optId}));
    setPosts((prev:any)=>prev.map((p:any)=>p.id!==pollId?p:{...p,options:p.options.map((o:any)=>o.id===optId?{...o,votes:o.votes+1}:o)}));
  };
  const handleImageSelect = (e:any) => {
    const files: File[] = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;
    setImageError(null);
    const valid: File[] = [];
    for (const f of files) {
      if (!ALLOWED_IMAGE_TYPES.includes(f.type)) { setImageError("Only JPG, PNG, GIF and WEBP images are allowed"); continue; }
      if (f.size > MAX_IMAGE_SIZE) { setImageError("Each image must be under 5MB"); continue; }
      valid.push(f);
    }
    setSelectedImages((prev:File[])=>{
      const room = MAX_POST_IMAGES - prev.length;
      if (valid.length > room) setImageError(`You can only attach up to ${MAX_POST_IMAGES} images`);
      return [...prev, ...valid.slice(0, Math.max(room,0))];
    });
  };
  const removeSelectedImage = (index:number) => {
    setSelectedImages((prev:File[])=>prev.filter((_,i)=>i!==index));
  };
  const closeCompose = () => {
    setCompose(false); setSelectedImages([]); setImageError(null);
  };
  useEffect(()=>{
    const urls = selectedImages.map((f:File)=>URL.createObjectURL(f));
    setImagePreviews(urls);
    return ()=>{ urls.forEach((u:string)=>URL.revokeObjectURL(u)); };
  },[selectedImages]);
  const submitPost=async()=>{
    if(!draft.content.trim()||!userId)return;
    setPosting(true);
    let imageUrls: string[] = [];
    if (selectedImages.length) {
      const formData = new FormData();
      selectedImages.forEach((f:File)=>formData.append("images", f));
      try {
        const res = await fetch("/api/upload-image", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) { setImageError(data.error || "Failed to upload images"); setPosting(false); return; }
        imageUrls = data.urls || [];
      } catch {
        setImageError("Failed to upload images"); setPosting(false); return;
      }
    }
    const { data, error } = await supabase.from('posts').insert({ author_id: userId, content: draft.content, category_id: draft.category, images: imageUrls }).select().single();
    if (error) { showToast("Failed to post"); setPosting(false); return; }
    setPosts((prev:any)=>[{id:data.id,avatar:myAvatar,name:myName,loc:myLoc,category:draft.category,time:"just now",content:draft.content,images:imageUrls,likes:0,replies:[],author_id:userId,reshareCount:0},...prev]);
    setDraft({content:"",category:"rant"});setSelectedImages([]);setCompose(false);setPosting(false);showToast("Posted to The Lounge ✓");
  };
  const submitPoll=()=>{
    const opts=pollDraft.options.filter((o:string)=>o.trim());
    if(!pollDraft.question.trim()||opts.length<2)return;
    setPosts((prev:any)=>[{id:Date.now(),type:"poll",avatar:myAvatar,name:myName,loc:myLoc,time:"just now",question:pollDraft.question,options:opts.map((t:string,i:number)=>({id:String.fromCharCode(97+i),text:t,votes:0})),replies:[]},...prev]);
    setPollDraft({question:"",options:["","",""]});setComposePoll(false);showToast("Poll posted ✓");
  };
  const deletePost = async () => {
    const id = deleteConfirmId;
    setPosts((prev:any)=>prev.filter((p:any)=>p.id!==id));
    setDeleteConfirmId(null);
    showToast("Post deleted");
    await supabase.from('posts').delete().eq('id', id);
  };
  const resharePost = async (p:any) => {
    const target = p.isReshare ? p.original : p;
    if (!userId || target.type === "poll") {
      setPosts((prev:any)=>{
        const updated = prev.map((post:any)=>post.id===target.id?{...post,reshareCount:(post.reshareCount||0)+1}:post);
        const newPost = {
          id: Date.now(), avatar: myAvatar, name: myName, loc: myLoc, time: "just now",
          isReshare: true, reshareCount: 0,
          original: { id: target.id, avatar: target.avatar, name: target.name, loc: target.loc, time: target.time, content: target.content, category: target.category, images: target.images, type: target.type, question: target.question, options: target.options ? target.options.map((o:any)=>({...o})) : undefined },
          likes: 0, replies: [],
        };
        return [newPost, ...updated];
      });
      showToast("Reshared to The Lounge ✓");
      return;
    }
    // content/category_id are NOT NULL on posts with no default, and
    // content also has a check constraint rejecting '' specifically
    // (confirmed live — a single space passes, empty string doesn't) —
    // so a reshare row uses a single-space caption and inherits the
    // original post's category rather than adding a new one.
    const { data, error } = await supabase.from('posts').insert({ author_id: userId, original_post_id: target.id, content: " ", category_id: target.category, images: [] }).select().single();
    if (error) { showToast("Failed to reshare"); return; }
    setPosts((prev:any)=>{
      const updated = prev.map((post:any)=>post.id===target.id?{...post,reshareCount:(post.reshareCount||0)+1}:post);
      const newPost = {
        id: data.id, avatar: myAvatar, name: myName, loc: myLoc, time: "just now",
        isReshare: true, reshareCount: 0, author_id: userId,
        original: { id: target.id, avatar: target.avatar, name: target.name, loc: target.loc, time: target.time, content: target.content, category: target.category, images: target.images },
        likes: 0, replies: [],
      };
      return [newPost, ...updated];
    });
    showToast("Reshared to The Lounge ✓");
  };
  const toggleRsvp=(eventId:any)=>{
    const was=rsvpd.has(eventId);
    setRsvpd((prev:any)=>{const n=new Set(prev);was?n.delete(eventId):n.add(eventId);return n;});
    setEvents((prev:any)=>prev.map((e:any)=>e.id===eventId?{...e,attendees:was?e.attendees.filter((a:string)=>a!==myName):[...e.attendees,myName]}:e));
    showToast(was?"RSVP cancelled":"You're going! ✓");
  };
  const submitSuggestion = async () => {
    if (!suggestionMessage.trim()) return;
    setSuggestionLoading(true);
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { window.location.href = '/auth/login'; return; }
    await supabase.from('suggestions').insert({ type: suggestionType, message: suggestionMessage });
    await fetch('/api/suggestion-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: suggestionType, message: suggestionMessage }),
    });
    setSuggestionSubmitted(true);
    setSuggestionLoading(false);
  };
  const submitEvent = async () => {
  if (!eventDraft.title.trim() || !eventDraft.date || !eventDraft.time) return;
const { data: { session } } = await supabase.auth.getSession()
if (!session) { window.location.href = '/auth/login'; return; }
  await supabase.from('events').insert({

    title: eventDraft.title,
    date: eventDraft.date,
    time: eventDraft.time,
    description: eventDraft.description,
    link: eventDraft.link,
    type: eventDraft.type,
    is_approved: false,
  });
  await fetch('/api/event-notification', {
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

  setSubmittedEvent(true);
  setComposeEvent(false);
  showToast("Event submitted for approval");
};
const saveProfile = async () => {
  if (!userId) return;
  setSavingProfile(true);
  const username = profileForm.username.trim();
  const location = profileForm.location.trim();
  const { error } = await supabase.from('profiles').update({ username, location }).eq('id', userId);
  if (!error) {
    if (username) setMyName(username);
    if (location) setMyLoc(location);
    showToast("Profile updated ✓");
  } else {
    showToast("Failed to update profile");
  }
  setSavingProfile(false);
};
const saveAvatar = async (emoji: string) => {
  if (!userId) return;
  setMyAvatar(emoji);
  const { error } = await supabase.from('profiles').update({ avatar_emoji: emoji }).eq('id', userId);
  if (error) showToast("Failed to update avatar");
};
const toggleNewsletter = async (checked: boolean) => {
  setNewsletterOptedIn(checked);
  if (!userId) return;
  const { error } = await supabase.from('profiles').update({ newsletter_opted_in: checked }).eq('id', userId);
  if (error) showToast("Failed to update preference");
};
const toggleNotifPref = (checked: boolean) => {
  setNotifPref(checked);
  if (typeof window !== 'undefined') localStorage.setItem('lounge_notif_pref', checked ? 'true' : 'false');
};
const upgradeMembership = async () => {
  if (!userId) return;
  setUpgrading(true);
  // TODO(item 25 — Stripe): this instantly flips membership_type for
  // free during the beta/Founders Offer, since Member is £0 right now.
  // Once Stripe billing is live, replace this with a real checkout
  // session for anyone upgrading after that point — this direct DB
  // write should only remain as a fallback for £0-price periods, if at
  // all. It intentionally never touches signed_up_as_member, so
  // upgrading here can never retroactively grant the Founder badge.
  const { error } = await supabase.from('profiles').update({ membership_type: 'member' }).eq('id', userId);
  if (!error) {
    setMembershipType('member');
    setUpgradeDone(true);
    showToast("You're now a Member — welcome! 🎉");
  } else {
    showToast('Failed to upgrade. Please try again.');
  }
  setUpgrading(false);
};
useEffect(() => {
  async function checkApproval() {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      setUserEmail(session.user.email ?? null)
      setUserId(session.user.id)
      if (notifPref) fetchNotifications(session.user.id)

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_approved, is_founder, username, avatar_emoji, location, newsletter_opted_in, membership_type, signed_up_as_member')
        .eq('id', session.user.id)
        .single()
      if (profile && !profile.is_approved) {
        await supabase.auth.signOut()
window.location.href = '/auth/pending'
        return
      }
      if (profile) {
        setIsFounder(!!profile.is_founder)
        setMyName(profile.username || "You")
        setMyAvatar(profile.avatar_emoji || "☕")
        setMyLoc(profile.location || "GMT")
        setProfileForm({ username: profile.username || "", location: profile.location || "" })
        setNewsletterOptedIn(!!profile.newsletter_opted_in)
        setMembershipType(profile.membership_type || "member")
        setSignedUpAsMember(!!profile.signed_up_as_member)
      }
    }
  }
  async function fetchNotifications(userId: string) {
  const res = await fetch(`/api/notifications?userId=${userId}`)
  const { data } = await res.json()
  if (data) setNotifications(data)
}

  checkApproval()
}, [])
useEffect(() => {
  async function loadSuggestions() {
    const { data } = await supabase
      .from('suggestions')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
    if (data) setApprovedSuggestions(data)
  }
  loadSuggestions()
}, [])
useEffect(() => {
  async function loadResources() {
    const { data } = await supabase
      .from('resources')
      .select('*')
      .order('position', { ascending: true })
    if (data) setResources(data)
  }
  async function loadUsefulContacts() {
    const { data } = await supabase
      .from('useful_contacts')
      .select('*')
      .order('position', { ascending: true })
    if (data) setUsefulContacts(data)
  }
  loadResources()
  loadUsefulContacts()
}, [])
useEffect(() => {
  async function loadEvents() {
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('is_approved', true)
    if (data && data.length > 0) {
      const dbEvents = data.map((e: any) => ({
        id: e.id,
        type: e.type || 'social',
        title: e.title,
        host: 'Community',
        hostAvatar: '📅',
        hostLoc: 'GMT',
        date: new Date(`${e.date}T${e.time}`),
        timezone: 'GMT',
        duration: 60,
        dropIn: false,
        description: e.description || '',
        attendees: [],
        approved: true,
        link: e.link || '',
      }))
      setEvents((prev: any) => [
        ...prev.filter((e: any) => !e.id.toString().startsWith('e')),
        ...dbEvents,
      ])
    }
  }
  loadEvents()
}, [])
useEffect(() => {
  async function loadJobs() {
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
    const { data } = await supabase
      .from('job_listings')
      .select('*')
      .or(`is_active.eq.true,closed_at.gt.${ninetyDaysAgo}`)
      .order('posted_date', { ascending: false })
    if (data) setJobListings(data)
  }
  loadJobs()
}, [])
useEffect(() => {
  async function loadFavourites() {
    if (!userId) { setJobFavourites([]); return }
    const { data } = await supabase
      .from('job_favourites')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (data) setJobFavourites(data)
  }
  loadFavourites()
}, [userId])
useEffect(() => {
  async function loadPosts() {
    const { data: postsData } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    if (!postsData) { setPostsLoaded(true); return }

    const { data: likesData } = await supabase.from('likes').select('*')
    const { data: repliesData } = await supabase.from('replies').select('*').order('created_at', { ascending: true })

    const userIds = Array.from(new Set([
      ...postsData.map((p: any) => p.author_id),
      ...(repliesData || []).map((r: any) => r.author_id),
    ].filter(Boolean)))

    const profilesMap: Record<string, any> = {}
    if (userIds.length) {
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, username, avatar_emoji, location')
        .in('id', userIds)
      ;(profilesData || []).forEach((pr: any) => { profilesMap[pr.id] = pr })
    }
    const profileFor = (id: string) => profilesMap[id] || { username: 'Member', avatar_emoji: '☕', location: 'GMT' }

    const likesByPost: Record<string, number> = {}
    ;(likesData || []).forEach((l: any) => { likesByPost[l.post_id] = (likesByPost[l.post_id] || 0) + 1 })

    // replies.parent_comment_id (null = top-level comment on the post,
    // set = a reply to another reply) builds the real nested tree the
    // "reply, like, view replies" comment UI expects.
    const repliesByParent: Record<string, any[]> = {}
    ;(repliesData || []).forEach((r: any) => {
      const key = r.parent_comment_id || `post:${r.post_id}`
      ;(repliesByParent[key] = repliesByParent[key] || []).push(r)
    })
    const buildReplies = (postId: string, parentId: string | null = null): any[] => {
      const key = parentId || `post:${postId}`
      return (repliesByParent[key] || []).map((r: any) => {
        const prof = profileFor(r.author_id)
        return {
          id: r.id, avatar: prof.avatar_emoji || '☕', name: prof.username || 'Member', loc: prof.location || 'GMT',
          time: timeAgo(r.created_at), text: r.content, likes: 0,
          replies: buildReplies(postId, r.id),
        }
      })
    }

    const postsById: Record<string, any> = {}
    postsData.forEach((p: any) => { postsById[p.id] = p })

    const reshareCounts: Record<string, number> = {}
    postsData.forEach((p: any) => { if (p.original_post_id) reshareCounts[p.original_post_id] = (reshareCounts[p.original_post_id] || 0) + 1 })

    const mapPost = (p: any) => {
      const prof = profileFor(p.author_id)
      return {
        id: p.id, avatar: prof.avatar_emoji || '☕', name: prof.username || 'Member', loc: prof.location || 'GMT',
        time: timeAgo(p.created_at), category: p.category_id, content: p.content,
        images: p.images || [], likes: likesByPost[p.id] || 0, author_id: p.author_id,
        replies: buildReplies(p.id), hot: !!p.is_hot,
      }
    }

    const mapped = postsData.map((p: any) => {
      const base = mapPost(p)
      if (p.original_post_id) {
        const orig = postsById[p.original_post_id]
        return { ...base, isReshare: true, reshareCount: reshareCounts[p.id] || 0, original: orig ? mapPost(orig) : null }
      }
      return { ...base, reshareCount: reshareCounts[p.id] || 0 }
    }).filter((p: any) => !(p.isReshare && !p.original))

    setPosts(mapped)
    setPostsLoaded(true)
  }
  loadPosts()
}, [])
useEffect(() => {
  if (!userId || !postsLoaded) return
  async function loadMyLikes() {
    const { data } = await supabase.from('likes').select('post_id').eq('profile_id', userId)
    if (data) setLiked(new Set(data.map((l: any) => l.post_id)))
  }
  loadMyLikes()
}, [userId, postsLoaded])

  const totalDays=daysInMonth(calMonth,calYear);
  const firstDay=firstDayOfMonth(calMonth,calYear);
  const calCells:any[]=[];
  for(let i=0;i<firstDay;i++)calCells.push(null);
  for(let d=1;d<=totalDays;d++)calCells.push(d);
  const todayDate=new Date();
  const isToday=(d:number)=>d===todayDate.getDate()&&calMonth===todayDate.getMonth()&&calYear===todayDate.getFullYear();

  const jobTotalDays=daysInMonth(jobCalMonth,jobCalYear);
  const jobFirstDay=firstDayOfMonth(jobCalMonth,jobCalYear);
  const jobCalCells:any[]=[];
  for(let i=0;i<jobFirstDay;i++)jobCalCells.push(null);
  for(let d=1;d<=jobTotalDays;d++)jobCalCells.push(d);

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
        <span className="event-date">{fmtDate(d)} · {fmtEnd(d, event.duration)} {event.timezone}</span>
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
     body{background:#F5F0E8;color:#1A1814;font-family:'IBM Plex Sans',sans-serif;min-height:100vh}
.ticker{overflow:hidden;display:flex;height:34px;align-items:stretch}
.ticker-track{display:inline-flex;animation:ticker 32s linear infinite;align-items:stretch}
@keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.ticker-seg{display:flex;align-items:center;padding:0 24px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;font-weight:700;white-space:nowrap;height:34px}
.hdr{position:sticky;top:0;z-index:50;background:#F5F0E8;border-bottom:3px solid #F9C4A0;padding:0 12px}
.hdr-inner{display:flex;flex-direction:column;gap:4px}
.hdr-row1{display:flex;align-items:center;width:100%;gap:6px;flex-wrap:wrap;padding:4px 0}
.hdr-row2{display:flex;justify-content:center;align-items:center;padding:0;margin:0;line-height:0;font-size:0}
.hdr-row3{display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;padding:4px 0}
.brand-name{display:none}
      .search-wrap{flex:1;max-width:none;position:relative}
      .btn-icon-sm{background:transparent;color:#F9C4A0;border:1.5px solid #F9C4A0;border-radius:100px;padding:3px 7px;cursor:pointer;font-family:'Inter',sans-serif;font-weight:600;font-size:10px;transition:all 0.15s;display:inline-flex;align-items:center;justify-content:center;white-space:nowrap}
      .btn-icon-sm:hover{background:#F9C4A0;color:#fff}
      .btn-icon-sm-solid{background:#F9C4A0;color:#fff;border:1.5px solid #F9C4A0;border-radius:100px;padding:3px 7px;cursor:pointer;font-family:'Inter',sans-serif;font-weight:600;font-size:10px;transition:background 0.15s;display:inline-flex;align-items:center;justify-content:center;white-space:nowrap}
      .hamburger-btn{background:none;border:none;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;width:36px;height:36px;flex-shrink:0}
      .hamburger-btn span{display:block;width:18px;height:2px;background:#7B5EA7;border-radius:2px}
      .hdr-menu-dropdown{position:absolute;left:0;top:40px;width:220px;background:#fff;border:1px solid #E8E3DC;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.1);z-index:100;overflow:hidden}
      .hdr-menu-link{display:block;padding:12px 16px;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;color:#1A1814;text-decoration:none;border-bottom:1px solid #F0EDE8}
      .hdr-menu-link:last-child{border-bottom:none}
      .hdr-menu-link:hover{color:#7B5EA7;background:#FAFAF8}
      .search-input{width:100%;background:#F0EDE8;border:1px solid #E2DDD6;border-radius:8px;color:#1A1814;font-family:'IBM Plex Sans',sans-serif;font-size:13px;padding:7px 12px 7px 34px;outline:none;transition:all 0.2s}
      .search-input:focus{background:#fff;border-color:#B8B0A4}
      .search-input::placeholder{color:#B8B0A4}
      .search-icon{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:#B8B0A4;pointer-events:none}
      .search-clear{position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;color:#B8B0A4;cursor:pointer;font-size:14px}
.btn-icon{background:transparent;color:#F9C4A0;border:2px solid #F9C4A0;border-radius:100px;padding:5px 11px;cursor:pointer;font-family:'Inter',sans-serif;font-weight:600;font-size:11px;transition:all 0.15s;height:32px;display:inline-flex;align-items:center;justify-content:center;text-align:center;box-sizing:border-box}
.btn-icon:hover{background:#F9C4A0;color:#fff}
.btn-icon-solid{background:#F9C4A0;color:#fff;border:2px solid #F9C4A0;border-radius:100px;padding:5px 11px;cursor:pointer;font-family:'Inter',sans-serif;font-weight:600;font-size:11px;transition:background 0.15s;height:32px;display:inline-flex;align-items:center;justify-content:center;text-align:center;box-sizing:border-box}
.btn-icon-solid:hover{background:#d4724a}
.btn-row3{background:#FFB3C6;color:#1A1208;border:2px solid #FFB3C6;border-radius:100px;padding:5px 11px;cursor:pointer;font-family:'Inter',sans-serif;font-weight:600;font-size:11px;transition:background 0.15s;min-width:130px;height:32px;display:inline-flex;align-items:center;justify-content:center;text-align:center;box-sizing:border-box}
.btn-row3:hover{background:#ff99b5;border-color:#ff99b5}
      .btn-host{background:transparent;border:1px solid;border-radius:7px;padding:6px 13px;cursor:pointer;font-family:'IBM Plex Sans',sans-serif;font-weight:600;font-size:11px;transition:all 0.15s;white-space:nowrap;flex-shrink:0}
      .wrap{max-width:900px;width:100%;min-width:0;box-sizing:border-box;margin:0 auto;padding:24px 28px}
      .layout{display:flex;gap:28px;min-width:0}
      .feed{flex:1;min-width:0}
      .rail{width:236px;flex-shrink:0}
      @media(max-width:680px){.rail{display:none} .wrap{padding:16px 14px}}
.tabs{display:flex;gap:6px;margin-bottom:20px;padding:0;flex-wrap:wrap}
.tab{flex:1;padding:10px;border:2.5px solid #F9C4A0;background:transparent;font-family:'Inter',sans-serif;font-size:12px;font-weight:600;color:#F9C4A0;border-radius:100px;cursor:pointer;transition:all 0.15s;text-align:center}
.tab.on{background:#F9C4A0;color:#fff;border-color:#F9C4A0}
      .filters{display:flex;gap:8px;margin-bottom:20px;overflow-x:auto;padding-bottom:4px}
.chip{padding:3px 9px;border-radius:100px;border:1.5px solid #7B5EA7;background:transparent;color:#7B5EA7;font-family:'Inter',sans-serif;font-size:10px;font-weight:600;cursor:pointer;white-space:nowrap;transition:all 0.15s}
.chip:hover{background:#7B5EA7;color:#fff}
.chip.on{background:#7B5EA7;border-color:#7B5EA7;color:#fff}
.card{background:#fff;border:2px solid #F9C4A0;border-radius:16px;padding:20px 20px 14px;margin-bottom:12px;transition:box-shadow 0.15s,transform 0.15s;position:relative;overflow:hidden}
.card:hover{box-shadow:4px 4px 0 #F9C4A0;transform:translateY(-2px)}
      .card.rant{border-top:4px solid #F4622A}
      .card.advice{border-top:4px solid #7C5CFC}
      .card.experience{border-top:4px solid #0EAD8B}
      .card.wins{border-top:4px solid #F5A623}
      .card.venting{border-top:4px solid #5B8DD9}
      .card.poll-card{border-top:4px solid #7C5CFC}
      .card.reshare-card{border-top:4px solid #F9C4A0}
      .reshare-label{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600;color:#F9C4A0;font-family:'Inter',sans-serif;margin-bottom:10px}
      .reshare-embed{border:1px solid #F0EDE8;border-radius:10px;padding:12px 14px;margin-bottom:4px}
      .reshare-embed .card-who{margin-bottom:8px}
      .card-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px}
      .card-who{display:flex;align-items:center;gap:10px}
      .avi{width:36px;height:36px;border-radius:10px;background:#F0EDE8;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
      .who-name{font-family:'Fraunces',serif;font-weight:600;font-size:14px;color:#1A1814}
      .admin-badge{display:inline-block;background:#7B5EA7;color:#fff;font-family:'Inter',sans-serif;font-weight:600;font-size:10px;padding:2px 8px;border-radius:100px;margin-left:6px;vertical-align:middle;line-height:1.4}
      .founder-badge{display:inline-block;background:#F5A623;color:#1A1208;font-family:'Inter',sans-serif;font-weight:600;font-size:10px;padding:2px 8px;border-radius:100px;margin-left:6px;vertical-align:middle;line-height:1.4}
      .who-meta{font-size:11px;color:#9E9587;margin-top:1px}
      .badge-wrap{display:flex;align-items:center;gap:6px;flex-shrink:0}
      .cat-badge{font-size:10px;font-weight:600;padding:3px 9px;border-radius:100px;letter-spacing:0.4px;text-transform:uppercase;display:flex;align-items:center;gap:4px}
      .poll-badge{font-size:10px;font-weight:600;padding:3px 9px;border-radius:100px;background:#EDE9FF;color:#7C5CFC;border:1px solid #D4C8FF;letter-spacing:0.4px;text-transform:uppercase}
      .hot{background:#FEF0EB;color:#F4622A;border:1px solid #FACDB8;font-size:10px;font-weight:700;padding:3px 7px;border-radius:100px}
      .card-delete-btn{position:relative;display:inline-flex;align-items:center;justify-content:center;background:transparent;border:1.5px solid #F9C4A0;border-radius:100px;color:#F9C4A0;cursor:pointer;font-family:'IBM Plex Sans',sans-serif;font-size:12px;padding:4px 9px;line-height:1;flex-shrink:0;transition:all 0.15s}
      .card-delete-btn:hover,.card-delete-btn:focus-visible{background:#F9C4A0;color:#fff}
      .card-delete-btn::after{content:"Delete post";position:absolute;bottom:calc(100% + 7px);right:0;background:#1A1208;color:#fff;font-family:'Inter',sans-serif;font-size:10px;font-weight:600;padding:4px 9px;border-radius:6px;white-space:nowrap;opacity:0;visibility:hidden;transition:opacity 0.15s;pointer-events:none;z-index:10}
      .card-delete-btn:hover::after,.card-delete-btn:focus-visible::after{opacity:1;visibility:visible}
      .compose-notice{font-size:11px;color:#9E9587;font-family:'Inter',sans-serif;margin-top:10px}
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
      .act:hover{color:#1A1814}.act.on{color:#F4622A}
      .comments-panel{width:100%;max-width:100%;margin:0;margin-left:0;padding:0}
      .replies{margin-top:12px;border-top:1px solid #F0EDE8;padding-top:12px;width:100%;max-width:100%}
      .comment-input-row{margin-top:12px;margin-left:0;padding-top:12px;border-top:1px solid #F0EDE8}
      .comment-input-preview{display:flex;align-items:center;gap:8px;margin-top:12px;padding-top:12px;border-top:1px solid #F0EDE8;cursor:pointer;width:100%;max-width:100%}
      .comment-input-preview-text{font-family:'Inter',sans-serif;font-size:13px;color:#B8B0A4}
      .reply{display:flex;gap:10px;margin-bottom:10px}
      .reply-avi{width:26px;height:26px;border-radius:7px;background:#F0EDE8;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0}
      .reply-body{flex:1;min-width:0}.reply-who{font-family:'Fraunces',serif;font-weight:600;font-size:13px;color:#1A1814}
      .reply-loc{font-size:10px;color:#9E9587;margin-left:6px}
      .reply-text{font-size:13px;color:#3A3530;line-height:1.6;margin-top:2px;word-break:break-word;overflow-wrap:break-word;white-space:pre-wrap}
      .reply-actions{display:flex;align-items:center;gap:14px;margin-top:6px;flex-wrap:wrap}
      .reply-act{display:flex;align-items:center;gap:4px;background:none;border:none;cursor:pointer;font-family:'IBM Plex Sans',sans-serif;font-size:11px;color:#9E9587;transition:color 0.15s;padding:0}
      .reply-act:hover{color:#1A1814}
      .reply-act.on{color:#F9C4A0}
      .nested-replies{margin-top:10px;margin-left:14px;padding-left:14px;border-left:2px solid #F9C4A0;min-width:0}
      .view-replies-toggle{display:inline-flex;align-items:center;background:none;border:none;cursor:pointer;padding:0;margin:0;font-family:'Inter',sans-serif;font-size:12px;font-weight:600;color:#7B5EA7;white-space:nowrap}
      .view-replies-toggle:hover{text-decoration:underline}
      .reply-input-row{display:flex;gap:8px;margin-top:10px;align-items:flex-start;overflow:hidden;min-width:0;width:100%;max-width:100%}
      .reply-input-row-nested{margin-left:-36px;width:calc(100% + 36px);max-width:calc(100% + 36px)}
      .reply-input-stack{display:flex;flex-direction:column;gap:8px;align-items:stretch;flex:1 1 auto;width:100%;max-width:100%;min-width:0}
      .reply-input{display:block;width:100%;max-width:100%;min-width:0;box-sizing:border-box;background:#FAFAF8;border:1px solid #E2DDD6;border-radius:8px;color:#1A1814;font-family:'IBM Plex Sans',sans-serif;font-size:13px;padding:8px 11px;resize:none;outline:none;min-height:44px;overflow:hidden;word-break:break-word;overflow-wrap:break-word;white-space:pre-wrap}
      .reply-input::placeholder{color:#9E9587;opacity:1}
      .comment-input{min-height:80px;width:100%;max-width:100%}
      .nested-reply-input{min-height:80px;width:100%;max-width:100%}
.reply-send{flex-shrink:0;align-self:flex-end;background:#F9C4A0;border:none;border-radius:100px;color:#fff;font-size:12px;font-weight:600;padding:8px 13px;cursor:pointer;white-space:nowrap;font-family:'Inter',sans-serif}
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
      .contacts-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:14px}
      .contact-card{background:#fff;border:1px solid #E8E3DC;border-radius:14px;padding:20px 16px;text-align:center;transition:box-shadow 0.15s,transform 0.15s}
      .contact-card:hover{box-shadow:0 4px 24px rgba(0,0,0,0.06);transform:translateY(-1px)}
      .contact-avi{width:56px;height:56px;border-radius:50%;background:#F5F0E8;border:1px solid #E8E3DC;display:flex;align-items:center;justify-content:center;font-size:24px;margin:0 auto 12px;overflow:hidden}
      .contact-avi img{width:100%;height:100%;object-fit:cover}
      .contact-name{font-family:'Fraunces',serif;font-weight:600;font-size:14px;color:#1A1814;margin-bottom:2px}
      .contact-role{font-size:11px;color:#7B5EA7;text-transform:uppercase;letter-spacing:0.6px;font-weight:600;margin-bottom:8px}
      .contact-bio{font-size:12px;color:#6B6358;line-height:1.5;margin-bottom:12px}
      .contact-email{font-size:12px;color:#F9C4A0;font-weight:700;text-decoration:none;word-break:break-all}
      .contact-email:hover{text-decoration:underline}

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
.rsvp-btn{background:#F9C4A0;color:#fff;border:none;border-radius:100px;padding:6px 14px;font-size:12px;font-weight:600;cursor:pointer;font-family:'Inter',sans-serif;transition:background 0.15s}
.rsvp-btn:hover{background:#d4724a}
.rsvp-btn.going{background:#2DC653}
.rsvp-btn.going:hover{background:#25a845}
      .join-btn{background:#EDF9F5;color:#0EAD8B;border:1px solid #B8EDD8;border-radius:7px;padding:6px 12px;font-size:12px;font-weight:600;cursor:pointer;font-family:'IBM Plex Sans',sans-serif;text-decoration:none;transition:all 0.15s}

      .cal-section-head{display:flex;align-items:center;justify-content:space-between;margin:24px 0 14px}
      .cal-section-title{font-family:'Fraunces',serif;font-weight:600;font-size:15px;color:#1A1814}
      .cal-nav{display:flex;align-items:center;gap:10px}
      .cal-month{font-family:'Fraunces',serif;font-weight:600;font-size:14px;color:#1A1814;min-width:130px;text-align:center}
      .cal-btn{background:none;border:1px solid #D4CEC5;border-radius:7px;width:28px;height:28px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#6B6358;transition:all 0.15s;font-size:13px}
      .cal-btn:hover{border-color:#1A1814;color:#1A1814}
      .calendar{background:#fff;border:1px solid #E8E3DC;border-radius:14px;padding:14px;margin-bottom:16px}
      .cal-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:2px}
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

      /* ── Job Board ── */
      .job-cabinet{display:flex;align-items:flex-end;flex-wrap:wrap;gap:6px 6px;margin-bottom:0;position:relative;z-index:1}
      .job-cabinet-tab{padding:9px 15px 11px;border-radius:10px 10px 0 0;border:1px solid rgba(0,0,0,0.1);border-bottom:none;font-family:'Inter',sans-serif;font-size:12px;font-weight:700;color:#1A1814;cursor:pointer;white-space:nowrap;transition:all 0.15s;flex:0 0 auto;opacity:0.75}
      .job-cabinet-tab:hover{opacity:0.95}
      .job-cabinet-tab.active{z-index:10;opacity:1;box-shadow:0 -2px 8px rgba(0,0,0,0.08)}
      .job-cabinet-body{border:2px solid rgba(0,0,0,0.1);border-radius:14px;padding:20px;position:relative;z-index:5;overflow:hidden}
      .job-cal-grid{gap:0}
      .job-cal-cell{cursor:default;aspect-ratio:auto;height:140px;align-items:flex-start;padding-top:6px;border-radius:0;border-right:1px solid #E8E3DC;border-bottom:1px solid #E8E3DC}
      .job-cal-cell:hover{background:transparent}
      .postit-stack{display:flex;flex-direction:column;align-items:center;gap:6px;margin-top:6px;width:100%}
      .postit{position:relative;width:calc(100% - 6px);border-radius:2px 8px 6px 9px;box-shadow:0 3px 6px rgba(0,0,0,0.15),0 1px 2px rgba(0,0,0,0.1);cursor:pointer;display:flex;flex-direction:column;align-items:flex-start;justify-content:flex-start;padding:11px 8px 7px;transition:transform 0.15s;box-sizing:border-box}
      .postit::after{content:'';position:absolute;bottom:0;right:0;width:11px;height:11px;background:linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.16) 50%);border-radius:0 0 2px 0;pointer-events:none}
      .postit:hover{transform:scale(1.04) rotate(0deg) !important;z-index:5}
      .postit-pin{font-size:15px;position:absolute;top:-7px;left:50%;transform:translateX(-50%);filter:drop-shadow(0 1px 1px rgba(0,0,0,0.35))}
      .postit-title{font-family:'Inter',sans-serif;font-size:10px;font-weight:800;line-height:1.25;color:#1A1208;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;text-overflow:ellipsis;overflow-wrap:break-word;width:100%}
      .postit-company{font-family:'Inter',sans-serif;font-size:8.5px;font-weight:600;color:#3A3530;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:100%}
      .postit-meta-line{font-family:'Inter',sans-serif;font-size:7.5px;color:#5A5248;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:100%}
      .postit.closed{filter:grayscale(0.85);opacity:0.7}
      .postit-stamp{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-14deg);background:rgba(255,251,245,0.92);border:1.5px solid #8a2020;color:#8a2020;font-family:'Inter',sans-serif;font-weight:800;font-size:9px;letter-spacing:0.5px;padding:1px 7px;border-radius:4px;pointer-events:none;text-transform:uppercase;white-space:nowrap}
      .postit-more{font-family:'Inter',sans-serif;font-size:9px;color:#6B6358;font-weight:700;align-self:center;background:#fff;border:1px solid #E2DDD6;border-radius:100px;padding:2px 8px;cursor:pointer;transition:all 0.15s}
      .postit-more:hover{background:#F0EDE8;border-color:#D4CEC5}
      .job-disclaimer{text-align:center;font-size:11px;color:#9E9587;font-family:'Inter',sans-serif;margin-top:20px;padding-top:16px;border-top:1px solid #F0EDE8}
      @media(max-width:680px){
        .cal-section-head{flex-wrap:wrap;gap:8px;margin:16px 0 12px}
        .cal-month{min-width:0}
        .cal-btn{width:32px;height:32px}
        .job-cabinet{flex-wrap:nowrap;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding-bottom:2px}
        .job-cabinet::-webkit-scrollbar{display:none}
        .job-cabinet-body{padding:14px}
        .calendar{padding:8px}
        .job-cal-cell{height:110px}
        .postit-stack{gap:4px;margin-top:5px}
        .postit{border-radius:2px 6px 5px 7px;box-shadow:0 2px 4px rgba(0,0,0,0.18);padding:9px 6px 5px}
        .postit::after{width:8px;height:8px}
        .postit-pin{font-size:11px;top:-6px}
        .postit-title{font-size:7.5px;line-height:1.2;-webkit-line-clamp:2}
        .postit-company{font-size:6.5px}
        .postit-meta-line{font-size:6px}
        .postit-stamp{font-size:6px;padding:1px 4px}
        .postit-more{font-size:8px;align-self:center}
      }
      .postit-modal{border-radius:4px;width:100%;max-width:420px;padding:34px 28px 28px;position:relative;box-shadow:6px 6px 0 rgba(0,0,0,0.12),0 24px 80px rgba(0,0,0,0.2);animation:su 0.2s ease;transform:rotate(-1deg);max-height:90vh;display:flex;flex-direction:column}
      .postit-modal-body{overflow-y:auto;min-height:0}
      .postit-modal-pin{position:absolute;top:-16px;left:50%;transform:translateX(-50%);font-size:28px;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.3))}
      .postit-modal-close{position:absolute;top:14px;right:14px;background:none;border:none;font-size:15px;color:#1A1208;cursor:pointer;opacity:0.5;padding:4px}
      .postit-modal-close:hover{opacity:1}
      .postit-modal-title{font-family:'Fraunces',serif;font-weight:700;font-size:19px;color:#1A1814;margin-bottom:4px}
      .postit-modal-company{font-family:'Inter',sans-serif;font-weight:600;font-size:14px;color:#3A3530;margin-bottom:8px}
      .postit-modal-meta{font-size:12px;color:#5A5248;margin-bottom:4px}
      .postit-modal-meta:last-of-type{margin-bottom:14px}
      .postit-modal-desc{font-size:13px;color:#3A3530;line-height:1.6;margin-bottom:16px;background:rgba(255,255,255,0.4);border-radius:8px;padding:12px 14px}
      .postit-modal-badges{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:14px}
      .job-source-badge{background:#1A1208;color:#fff;font-size:10px;font-weight:700;padding:4px 10px;border-radius:100px;letter-spacing:0.4px;text-transform:uppercase}
      .postit-fav-btn{display:block;width:100%;box-sizing:border-box;background:rgba(255,255,255,0.5);border:1.5px solid #1A1208;color:#1A1208;font-family:'Inter',sans-serif;font-weight:700;font-size:12px;padding:8px 14px;border-radius:100px;cursor:pointer;margin-bottom:6px;transition:all 0.15s}
      .postit-fav-btn.on{background:#1A1208;color:#fff}
      .postit-fav-hint{font-size:10px;color:#5A5248;text-align:center;margin-bottom:16px;line-height:1.4}
      .job-vetted-note{font-size:11px;color:#5A5248;margin-bottom:16px;line-height:1.5}
      .postit-view-btn{display:block;background:#1A1208;color:#fff;text-decoration:none;font-family:'Inter',sans-serif;font-weight:700;font-size:13px;padding:10px 20px;border-radius:100px;text-align:center;width:100%;box-sizing:border-box;margin-bottom:10px}
      .postit-view-btn:hover{background:#3A3530}
      .postit-closed-notice{display:block;background:rgba(0,0,0,0.06);color:#5A5248;font-family:'Inter',sans-serif;font-weight:600;font-size:13px;padding:10px 20px;border-radius:100px;text-align:center;width:100%;box-sizing:border-box;margin-bottom:10px}
      .job-day-list{display:flex;flex-direction:column;gap:8px;margin-top:14px;max-height:50vh;overflow-y:auto}
      .job-day-list-item{border:1px solid #E8E3DC;border-radius:10px;padding:10px 14px;cursor:pointer;transition:all 0.15s}
      .job-day-list-item:hover{border-color:#D4CEC5;background:#FAFAF8}
      .job-day-list-item.closed{opacity:0.65}
      .job-day-list-title{font-family:'Fraunces',serif;font-weight:600;font-size:14px;color:#1A1814;display:flex;align-items:center;gap:8px}
      .job-day-list-status{font-family:'Inter',sans-serif;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.4px;color:#8a2020;border:1px solid #8a2020;border-radius:100px;padding:1px 7px}
      .job-day-list-company{font-size:12px;color:#9E9587;margin-top:2px}

      /* Free tier lock */
      .locked-wrap{position:relative}
      .locked-overlay{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:24px;z-index:10;background:rgba(245,240,232,0.4)}
      .locked-icon{font-size:36px;margin-bottom:10px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.15))}
      .locked-title{font-family:'Fraunces',serif;font-weight:700;font-size:19px;color:#1A1814;margin-bottom:6px}
      .locked-sub{font-size:13px;color:#5A5248;max-width:280px;line-height:1.5;margin-bottom:18px}
      .upgrade-btn{background:#F9C4A0;color:#fff;border:none;border-radius:100px;padding:12px 28px;font-family:'Syne',sans-serif;font-weight:700;font-size:14px;cursor:pointer;box-shadow:0 4px 14px rgba(249,196,160,0.5);transition:all 0.15s}
      .upgrade-btn:hover{background:#d4724a}
      .upgrade-note{font-size:12px;color:#9E9587;line-height:1.6;margin-bottom:16px;background:#FAFAF8;border:1px solid #E8E3DC;border-radius:10px;padding:10px 12px}

      /* Sidebar */
.rail-card{background:#fff;border:2px solid #F9C4A0;border-radius:14px;padding:16px;margin-bottom:12px}
.rail-support-link{display:block;color:#7B5EA7;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;text-decoration:none}
.rail-support-link:hover{text-decoration:underline}
.rail-title{font-family:'Syne',sans-serif;font-weight:700;font-size:14px;color:#F9C4A0;margin-bottom:10px}
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
      .modal-title-row{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:18px}
      .modal-title-row .modal-title{margin-bottom:0}
      .modal-close{background:none;border:none;font-size:15px;color:#9E9587;cursor:pointer;line-height:1;padding:4px;flex-shrink:0}
      .modal-close:hover{color:#1A1814}
      .settings-link{display:inline-block;font-size:13px;color:#7B5EA7;font-weight:600;text-decoration:none;margin-bottom:14px}
      .settings-link:hover{text-decoration:underline}
      .settings-quick-row{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:4px}
      .view-filter-banner{display:flex;align-items:center;justify-content:space-between;background:#FEF0EB;border:1px solid #FACDB8;border-radius:10px;padding:8px 14px;margin-bottom:14px;font-size:12px;font-weight:600;color:#F4622A;font-family:'Inter',sans-serif}
      .view-filter-banner button{background:none;border:none;color:#F4622A;font-weight:600;cursor:pointer;font-size:12px;font-family:'Inter',sans-serif}
      .no-liked-item{font-size:13px;color:#9E9587;font-style:italic;margin-bottom:14px}
      .job-fav-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 0;border-bottom:1px solid #F0EDE8}
      .job-fav-row:last-of-type{border-bottom:none}
      .job-fav-info{min-width:0}
      .job-fav-title{font-family:'Fraunces',serif;font-weight:600;font-size:13px;color:#1A1814}
      .job-fav-star{font-size:11px}
      .job-fav-meta{font-size:11px;color:#9E9587;margin-top:2px}
      .job-fav-applied-date{font-size:10px;color:#0EAD8B;font-weight:600;margin-top:3px}
      .job-fav-apply-link{display:inline-block;font-size:11px;font-weight:700;color:#7B5EA7;text-decoration:none;margin-top:4px}
      .job-fav-apply-link:hover{text-decoration:underline}
      .job-fav-applied{display:flex;align-items:center;gap:6px;font-size:12px;color:#3A3530;cursor:pointer;white-space:nowrap;flex-shrink:0}
      .job-fav-gone{font-size:12px;color:#9E9587;font-style:italic}
      .job-fav-row.applied{opacity:0.5}
      .job-fav-row.applied .job-fav-title,.job-fav-row.applied .job-fav-meta{text-decoration:line-through}
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
.btn-cancel{background:none;border:2px solid #7B5EA7;border-radius:100px;color:#7B5EA7;font-family:'Inter',sans-serif;font-weight:600;font-size:13px;padding:8px 16px;cursor:pointer}
.btn-submit{background:#F9C4A0;border:none;border-radius:100px;color:#fff;font-family:'Inter',sans-serif;font-weight:600;font-size:13px;padding:8px 20px;cursor:pointer}
.btn-submit:disabled{opacity:0.3;cursor:default}
      .section-label{font-size:11px;color:#9E9587;letter-spacing:1.2px;text-transform:uppercase;margin:14px 0 7px}
      .add-opt-btn{background:none;border:1px dashed #D4CEC5;border-radius:8px;color:#9E9587;font-size:12px;padding:8px;width:100%;cursor:pointer;font-family:'IBM Plex Sans',sans-serif}
      .photo-upload-row{display:flex;align-items:center;gap:10px;margin-top:10px}
      .photo-upload-count{font-size:11px;color:#9E9587}
      .photo-upload-error{font-size:12px;color:#F4622A;margin-top:6px}
      .image-preview-grid{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}
      .image-preview-item{position:relative;width:64px;height:64px;border-radius:8px;overflow:hidden;border:1px solid #E2DDD6;flex-shrink:0}
      .image-preview-item img{width:100%;height:100%;object-fit:cover;display:block}
      .image-preview-remove{position:absolute;top:2px;right:2px;width:18px;height:18px;border-radius:50%;background:rgba(26,24,20,0.7);color:#fff;border:none;font-size:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;line-height:1}
      .post-images-grid{display:grid;grid-template-columns:1fr;gap:6px;margin-top:12px;border-radius:12px;overflow:hidden}
      .post-images-grid.grid-2{grid-template-columns:1fr 1fr}
      .post-images-grid img{width:100%;height:100%;object-fit:cover;display:block;max-height:320px}
      .approval-note{background:#FEF9ED;border:1px solid #F5E4A0;border-radius:8px;padding:10px 14px;font-size:12px;color:#8A6F20;margin-top:14px;line-height:1.5}
      .dropin-toggle{display:flex;align-items:center;gap:10px;margin-top:10px;cursor:pointer;user-select:none}
      .dropin-toggle input{width:16px;height:16px;cursor:pointer}
      .dropin-toggle-label{font-size:13px;color:#3A3530}
      .success-banner{text-align:center;padding:32px 20px}
      .success-emoji{font-size:40px;margin-bottom:12px}
      .success-title{font-family:'Fraunces',serif;font-weight:700;font-size:18px;color:#1A1814;margin-bottom:6px}
      .success-sub{font-size:13px;color:#6B6358;line-height:1.6}
      .toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1A1814;color:#F5F2ED;font-family:'IBM Plex Sans',sans-serif;font-size:12px;padding:11px 20px;border-radius:10px;z-index:300;box-shadow:0 8px 32px rgba(0,0,0,0.2)}
.site-footer{text-align:center;padding:32px 24px 24px;border-top:3px solid #F9C4A0;margin-top:8px}
.site-footer-copy{font-size:12px;color:#9E9587;margin-bottom:8px;font-family:'Inter',sans-serif}
.site-footer-links{display:flex;gap:16px;justify-content:center;align-items:center}
.site-footer-link{font-size:12px;color:#7B5EA7;text-decoration:none;font-weight:600}
.site-footer-link:hover{color:#F9C4A0}
    `}</style>

    <div>
{/* Ticker */}
<div className="ticker">
  <div className="ticker-track">
    {[...TICKER_SEGS, ...TICKER_SEGS].map((seg:any, i:number) => (
      <span key={i} className="ticker-seg" style={{background:seg.bg, color:seg.color}}>{seg.text}</span>
    ))}
  </div>
</div>

      {/* Header */}
      <header className="hdr">
        <div className="hdr-inner">
        <div className="hdr-row1">
          <div style={{ position: 'relative' }}>
            <button className="hamburger-btn" onClick={()=>setMenuOpen(!menuOpen)} aria-label="Open menu">
              <span/><span/><span/>
            </button>
            {menuOpen && (
              <div className="hdr-menu-dropdown">
                <a href="/support" className="hdr-menu-link" onClick={()=>setMenuOpen(false)}>Support Beyond Our Walls 🧡</a>
                <a href="/contact" className="hdr-menu-link" onClick={()=>setMenuOpen(false)}>✉️ Contact Us</a>
              </div>
            )}
          </div>
          <div className="search-wrap">
            <span className="search-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
            <input className="search-input" placeholder="Search posts, names..." value={search} onChange={(e:any)=>setSearch(e.target.value)}/>
            {search&&<button className="search-clear" onClick={()=>setSearch("")}>✕</button>}
          </div>
          <div style={{ position: 'relative' }}>
  <button className="btn-icon-sm" onClick={() => {
    setShowNotifications(!showNotifications)
    if (!showNotifications) {
      fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: notifications[0]?.user_id })
      }).then(() => setNotifications(n => n.map(x => ({ ...x, is_read: true }))))
    }
  }}>
    🔔
    {notifications.filter(n => !n.is_read).length > 0 && (
      <span style={{ position: 'absolute', top: '-4px', right: '-4px', backgroundColor: '#F9C4A0', color: '#fff', borderRadius: '50%', width: '16px', height: '16px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {notifications.filter(n => !n.is_read).length}
      </span>
    )}
  </button>
  {showNotifications && (
    <div style={{ position: 'absolute', right: 0, top: '36px', width: '280px', backgroundColor: '#fff', border: '1px solid #E8E3DC', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', zIndex: 100, maxHeight: '320px', overflowY: 'auto' }}>
      {notifications.length === 0 ? (
        <p style={{ padding: '16px', textAlign: 'center', color: '#9E9587', fontSize: '13px' }}>No notifications yet</p>
      ) : (
        notifications.map(n => (
          <div key={n.id} style={{ padding: '12px 16px', borderBottom: '1px solid #f0ede8', backgroundColor: n.is_read ? '#fff' : '#fdf8f3' }}>
            <p style={{ margin: 0, fontSize: '13px', color: '#1A1814' }}>{n.message}</p>
            <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#9E9587' }}>{new Date(n.created_at).toLocaleDateString()}</p>
          </div>
        ))
      )}
    </div>
  )}
</div>
          <button className="btn-icon-sm" onClick={()=>setLikesOpen(true)} aria-label="Your likes">❤️</button>
          <button className="btn-icon-sm" onClick={()=>setSettingsOpen(true)} aria-label="Settings">⚙️</button>
          {isAdmin && (
  <a href="/admin" className="btn-icon-sm-solid" style={{ textDecoration: 'none' }}>
    ← Admin
  </a>
)}
          <button className="btn-icon-sm" onClick={async () => { await supabase.auth.signOut(); window.location.href = '/auth/login'; }}>Log out</button>
        </div>
        <div className="hdr-row2">
<a href="/" style={{display:'block'}}><img src="/community-logo.png" alt="The Lounge Community" style={{height:'120px',width:'auto',flexShrink:0,display:'block',margin:0}}/></a>
        </div>
        <div className="hdr-row3">
          <button className="btn-row3" onClick={()=>isFreeTier?setUpgradeModalOpen(true):setComposePoll(true)}>+ Poll</button>
          <button className="btn-row3" onClick={()=>isFreeTier?setUpgradeModalOpen(true):setCompose(true)}>+ Post</button>
          <button className="btn-row3" onClick={()=>isFreeTier?setUpgradeModalOpen(true):setActiveTab("suggestions")}>📮 Suggestion Box</button>
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
              <button className={`tab ${activeTab==="jobs"?"on":""}`} onClick={()=>setActiveTab("jobs")}>💼 Job Board</button>
            </div>

            <div className="locked-wrap">
            <div style={(isFreeTier&&activeTab!=="jobs")?{filter:"blur(6px)",pointerEvents:"none",userSelect:"none"}:undefined}>

            {/* ── FEED ── */}
            {activeTab==="feed"&&<>
              {viewFilter!=="all"&&(
                <div className="view-filter-banner">
                  <span>Showing: {viewFilter==="mine"?"📝 My Posts":"❤️ My Liked Posts"}</span>
                  <button onClick={()=>setViewFilter("all")}>✕ Clear</button>
                </div>
              )}
              <div className="filters">
                <button className={`chip ${filter==="all"?"on":""}`} onClick={()=>setFilter("all")}>All</button>
                {CATEGORIES.map((c:any)=>(
                  <button key={c.id} className={`chip ${filter===c.id?"on":""}`} onClick={()=>setFilter(c.id)}>{c.emoji} {c.label}</button>
                ))}
              </div>
              {feed.length===0&&<div className="no-results"><div className="no-results-emoji">🔍</div><div className="no-results-title">Nothing found</div><div className="no-results-sub">Try a different search or filter</div></div>}
              {feed.map((p:any)=>{
                const isLiked=liked.has(p.id);
                if(p.isReshare){
                  const o=p.original;
                  return(
                    <div key={p.id} className="card reshare-card">
                      <div className="card-top">
                        <div className="card-who"><div className="avi">{p.avatar}</div><div><div className="who-name">{p.name}{isAdmin&&p.name===myName&&<span className="admin-badge">Admin</span>}{isFounder&&p.name===myName&&<span className="founder-badge">🌟 Founder</span>}</div><div className="who-meta">{p.loc} · {p.time}</div></div></div>
                        <div className="badge-wrap">
                          {(p.name===myName||isAdmin)&&<button className="card-delete-btn" onClick={()=>setDeleteConfirmId(p.id)} aria-label="Delete post">🗑️</button>}
                        </div>
                      </div>
                      <div className="reshare-label">
                        🔁 {o.type==="poll"?"Reshared poll — tap to see original":(o.images&&o.images.length>0?"Reshared with images":"Reshared")}
                      </div>
                      <div className="reshare-embed">
                        <div className="card-who">
                          <div className="avi" style={{width:28,height:28,fontSize:14}}>{o.avatar}</div>
                          <div><div className="who-name" style={{fontSize:13}}>{o.name}</div><div className="who-meta">{o.loc} · {o.time}</div></div>
                        </div>
                        {o.type==="poll"?(
                          <>
                            <div className="poll-q" style={{fontSize:13}}>{o.question}</div>
                            <div className="poll-options">
                              {o.options.map((opt:any)=>(
                                <div key={opt.id} className="poll-opt voted" style={{cursor:"default"}}>
                                  <div className="poll-opt-inner"><span className="poll-opt-text">{opt.text}</span><span className="poll-opt-pct">{opt.votes} votes</span></div>
                                </div>
                              ))}
                            </div>
                          </>
                        ):(
                          <>
                            <div className="card-body" style={{fontSize:13}}>{o.content}</div>
                            {o.images&&o.images.length>0&&(
                              <div className={`post-images-grid ${o.images.length>1?"grid-2":""}`}>
                                {o.images.map((src:string,i:number)=>(<img key={i} src={src} alt=""/>))}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      <div className="card-foot">
                        <button className={`act ${isLiked?"on":""}`} onClick={()=>toggleLike(p.id)}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                          {p.likes}
                        </button>
                        <ReplyBlock p={p} isOpen={openReplies.has(p.id)} onToggle={()=>toggleReplies(p.id)}/>
                        <button className="act" onClick={()=>resharePost(p)}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 2l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
                          {p.reshareCount||0}
                        </button>
                      </div>
                      <CommentsPanel p={p} myAvatar={myAvatar} myName={myName} isAdmin={isAdmin} isFounder={isFounder} isOpen={openReplies.has(p.id)} draft={replyDrafts[p.id]||""} onDraftChange={(v:string)=>setReplyDrafts((prev:any)=>({...prev,[p.id]:v}))} onSubmit={()=>submitReply(p.id)}
                      likedReplies={likedReplies} openReplyInputs={openReplyInputs} nestedReplyDrafts={nestedReplyDrafts} expandedReplies={expandedReplies}
                      onToggleReplyLike={toggleReplyLike} onToggleReplyInput={toggleReplyInput}
                      onNestedDraftChange={(replyId:any,v:string)=>setNestedReplyDrafts((prev:any)=>({...prev,[replyId]:v}))}
                      onSubmitNestedReply={submitNestedReply} onToggleExpanded={toggleExpandedReplies}/>
                    </div>
                  );
                }
                if(p.type==="poll"){
                  const voted=votedPolls[p.id];
                  const total=p.options.reduce((s:number,o:any)=>s+o.votes,0);
                  const winner=voted?p.options.reduce((a:any,b:any)=>a.votes>b.votes?a:b).id:null;
                  return(
                    <div key={p.id} className="card poll-card">
                      <div className="card-top">
                        <div className="card-who"><div className="avi">{p.avatar}</div><div><div className="who-name">{p.name}{isAdmin&&p.name===myName&&<span className="admin-badge">Admin</span>}{isFounder&&p.name===myName&&<span className="founder-badge">🌟 Founder</span>}</div><div className="who-meta">{p.loc} · {p.time}</div></div></div>
                        <div className="badge-wrap">
                          <span className="poll-badge">📊 Poll</span>
                          {(p.name===myName||isAdmin)&&<button className="card-delete-btn" onClick={()=>setDeleteConfirmId(p.id)} aria-label="Delete post">🗑️</button>}
                        </div>
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
                      <div className="card-foot">
                        <ReplyBlock p={p} isOpen={openReplies.has(p.id)} onToggle={()=>toggleReplies(p.id)}/>
                        <button className="act" onClick={()=>resharePost(p)}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 2l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
                          {p.reshareCount||0}
                        </button>
                      </div>
                      <CommentsPanel p={p} myAvatar={myAvatar} myName={myName} isAdmin={isAdmin} isFounder={isFounder} isOpen={openReplies.has(p.id)} draft={replyDrafts[p.id]||""} onDraftChange={(v:string)=>setReplyDrafts((prev:any)=>({...prev,[p.id]:v}))} onSubmit={()=>submitReply(p.id)}
                      likedReplies={likedReplies} openReplyInputs={openReplyInputs} nestedReplyDrafts={nestedReplyDrafts} expandedReplies={expandedReplies}
                      onToggleReplyLike={toggleReplyLike} onToggleReplyInput={toggleReplyInput}
                      onNestedDraftChange={(replyId:any,v:string)=>setNestedReplyDrafts((prev:any)=>({...prev,[replyId]:v}))}
                      onSubmitNestedReply={submitNestedReply} onToggleExpanded={toggleExpandedReplies}/>
                    </div>
                  );
                }
                const cat=catOf(p.category);
                return(
                  <div key={p.id} className={`card ${p.category}`}>
                    <div className="card-top">
                      <div className="card-who"><div className="avi">{p.avatar}</div><div><div className="who-name">{p.name}{isAdmin&&p.name===myName&&<span className="admin-badge">Admin</span>}{isFounder&&p.name===myName&&<span className="founder-badge">🌟 Founder</span>}</div><div className="who-meta">{p.loc} · {p.time}</div></div></div>
                      <div className="badge-wrap">
                        <span className="cat-badge" style={{background:`${cat.color}15`,color:cat.color,border:`1px solid ${cat.color}2A`}}>{cat.emoji} {cat.label}</span>
                        {p.hot&&<span className="hot">HOT</span>}
                        {(p.name===myName||isAdmin)&&<button className="card-delete-btn" onClick={()=>setDeleteConfirmId(p.id)} aria-label="Delete post">🗑️</button>}
                      </div>
                    </div>
                    <div className="card-body">{p.content}</div>
                    {p.images&&p.images.length>0&&(
                      <div className={`post-images-grid ${p.images.length>1?"grid-2":""}`}>
                        {p.images.map((src:string,i:number)=>(<img key={i} src={src} alt=""/>))}
                      </div>
                    )}
                    <div className="card-foot">
                      <button className={`act ${isLiked?"on":""}`} onClick={()=>toggleLike(p.id)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                        {p.likes}
                      </button>
                      <ReplyBlock p={p} isOpen={openReplies.has(p.id)} onToggle={()=>toggleReplies(p.id)}/>
                      <button className="act" onClick={()=>resharePost(p)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 2l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
                        {p.reshareCount||0}
                      </button>
                    </div>
                    <CommentsPanel p={p} myAvatar={myAvatar} myName={myName} isAdmin={isAdmin} isFounder={isFounder} isOpen={openReplies.has(p.id)} draft={replyDrafts[p.id]||""} onDraftChange={(v:string)=>setReplyDrafts((prev:any)=>({...prev,[p.id]:v}))} onSubmit={()=>submitReply(p.id)}
                      likedReplies={likedReplies} openReplyInputs={openReplyInputs} nestedReplyDrafts={nestedReplyDrafts} expandedReplies={expandedReplies}
                      onToggleReplyLike={toggleReplyLike} onToggleReplyInput={toggleReplyInput}
                      onNestedDraftChange={(replyId:any,v:string)=>setNestedReplyDrafts((prev:any)=>({...prev,[replyId]:v}))}
                      onSubmitNestedReply={submitNestedReply} onToggleExpanded={toggleExpandedReplies}/>
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
            {activeTab==="resources"&&(()=>{
              const templates = resources.filter((r:any)=>r.category==="templates");
              const courses = resources.filter((r:any)=>r.category==="courses");
              const sectionInfo = RESOURCE_SECTIONS.find((sec:any)=>sec.id===resourceSection) || RESOURCE_SECTIONS[0];
              const renderResourceCard = (r:any) => r.url ? (
                <a key={r.id} href={r.url} target="_blank" rel="noopener noreferrer" className="resource-card" style={{textDecoration:"none"}}>
                  <div className="resource-emoji">{r.emoji}</div>
                  <div><div className="resource-title">{r.title}</div><div className="resource-desc">{r.description}</div></div>
                  <div className="resource-arrow">→</div>
                </a>
              ) : (
                <div key={r.id} className="resource-card" style={{cursor:"default"}}>
                  <div className="resource-emoji">{r.emoji}</div>
                  <div><div className="resource-title">{r.title}</div><div className="resource-desc">{r.description}</div></div>
                </div>
              );
              return(<div>
                <div className="job-cabinet">
                  {RESOURCE_SECTIONS.map((sec:any)=>(
                    <button key={sec.id} className={`job-cabinet-tab ${resourceSection===sec.id?"active":""}`} style={{background:sec.color}} onClick={()=>setResourceSection(sec.id)}>{sec.emoji} {sec.label}</button>
                  ))}
                </div>
                <div className="job-cabinet-body" style={{background:`${sectionInfo.color}22`,borderColor:sectionInfo.color}}>
                  {resourceSection==="resources"&&<>
                    <div className="resources-head">Templates &amp; Guides</div>
                    <div className="resources-sub">Curated by the community — things that actually help with the day-to-day.</div>
                    {templates.length===0
                      ? <div style={{fontSize:12,color:"#9E9587",fontStyle:"italic",marginBottom:20}}>Nothing here yet.</div>
                      : templates.map(renderResourceCard)}

                    <div className="resources-head" style={{marginTop:24}}>Courses</div>
                    <div className="resources-sub">Learning worth your time.</div>
                    {courses.length===0
                      ? <div style={{fontSize:12,color:"#9E9587",fontStyle:"italic"}}>Nothing here yet.</div>
                      : courses.map(renderResourceCard)}
                  </>}

                  {resourceSection==="contacts"&&<>
                    <div className="resources-head">Useful Contacts</div>
                    <div className="resources-sub">People our members trust — reach out directly.</div>
                    {usefulContacts.length===0
                      ? <div style={{fontSize:12,color:"#9E9587",fontStyle:"italic"}}>Nothing here yet.</div>
                      : <div className="contacts-grid">
                          {usefulContacts.map((c:any)=>(
                            <div key={c.id} className="contact-card">
                              <div className="contact-avi">{c.photo_url ? <img src={c.photo_url} alt={c.name}/> : "🤝"}</div>
                              <div className="contact-name">{c.name}</div>
                              <div className="contact-role">{c.role}</div>
                              {c.bio && <div className="contact-bio">{c.bio}</div>}
                              <a className="contact-email" href={`mailto:${c.email}`}>{c.email}</a>
                            </div>
                          ))}
                        </div>}
                  </>}
                </div>
              </div>);
            })()}

            {/* ── SUGGESTION BOX ── */}
            {activeTab==="suggestions"&&<div>
              <div className="resources-head">The Suggestion Box</div>
              <div className="resources-sub">Got an idea, feedback, or something you'd love to see in The Lounge? Drop it in. We read every single one.</div>
              {suggestionSubmitted?(
                <div className="success-banner" style={{background:"#fff",border:"1px solid #E8E3DC",borderRadius:14,marginBottom:20}}>
                  <div className="success-emoji">🎉</div>
                  <div className="success-title">Thank you!</div>
                  <div className="success-sub">Your suggestion has been received. We will review it and may feature it below.</div>
                  <div className="modal-foot" style={{justifyContent:"center",marginTop:20}}>
                    <button className="btn-submit" onClick={()=>{setSuggestionSubmitted(false);setSuggestionMessage("");setSuggestionType("suggestion");}}>Submit another</button>
                  </div>
                </div>
              ):(
                <div className="resource-card" style={{flexDirection:"column",alignItems:"stretch",cursor:"default"}}>
                  <div className="section-label" style={{marginTop:0}}>What is this?</div>
                  <div className="cats" style={{marginBottom:12}}>
                    {SUGGESTION_TYPES.map((t:any)=>(
                      <button key={t.id} className={`cat-opt ${suggestionType===t.id?"sel":""}`} onClick={()=>setSuggestionType(t.id)}>{t.emoji} {t.label}</button>
                    ))}
                  </div>
                  <div className="section-label">Your message</div>
                  <textarea placeholder="Tell us what is on your mind..." value={suggestionMessage} onChange={(e:any)=>setSuggestionMessage(e.target.value)}/>
                  <div className="modal-foot" style={{justifyContent:"flex-end"}}>
                    <button className="btn-submit" onClick={submitSuggestion} disabled={!suggestionMessage.trim()||suggestionLoading}>{suggestionLoading?"Dropping it in...":"Drop it in the box"}</button>
                  </div>
                </div>
              )}
              {approvedSuggestions.length>0&&(
                <div style={{marginTop:24}}>
                  <div className="resources-head" style={{fontSize:17}}>From the community</div>
                  <div className="resources-sub">Suggestions and ideas we have heard from members.</div>
                  {approvedSuggestions.map((s:any)=>(
                    <div key={s.id} className="resource-card" style={{cursor:"default"}}>
                      <div>
                        <span className="cat-badge" style={{background:"#FEF0EB",color:"#F9C4A0",border:"1px solid #FACDB8",marginBottom:8}}>{SUGGESTION_TYPES.find((t:any)=>t.id===s.type)?.emoji} {s.type}</span>
                        <div className="card-body" style={{marginTop:8}}>{s.message}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>}

            {/* ── JOB BOARD ── */}
            {activeTab==="jobs"&&(()=>{
              const tabInfo = JOB_TABS.find((t:any)=>t.id===jobTab) || JOB_TABS[0];
              return(<div>
              <div className="events-hero">
                <div>
                  <div className="events-hero-title">💼 Job Board</div>
                  <div className="events-hero-sub">Curated admin & EA roles — Reed, direct employer listings, and member shares.</div>
                </div>
              </div>

              <div className="job-cabinet">
                {JOB_TABS.map((t:any)=>(
                  <button key={t.id} className={`job-cabinet-tab ${jobTab===t.id?"active":""}`} style={{background:t.color}} onClick={()=>setJobTab(t.id)}>{t.emoji} {t.label}</button>
                ))}
              </div>

              <div className="job-cabinet-body" style={{background:`${tabInfo.color}22`,borderColor:tabInfo.color}}>
                <div className="cal-section-head" style={{marginTop:0}}>
                  <div className="cal-section-title">{tabInfo.emoji} {tabInfo.label}</div>
                  <div className="cal-nav">
                    <button className="cal-btn" onClick={jobPrevMonth}>‹</button>
                    <span className="cal-month">{MONTHS[jobCalMonth]} {jobCalYear}</span>
                    <button className="cal-btn" onClick={jobNextMonth}>›</button>
                  </div>
                </div>

                <div className="calendar" style={{borderTop:`3px solid ${tabInfo.color}`}}>
                  <div className="cal-grid job-cal-grid">
                    {DAYS.map((d:string)=><div key={d} className="cal-day-label">{d}</div>)}
                    {jobCalCells.map((day:any,i:number)=>{
                      if(!day)return<div key={`j${i}`} className="cal-cell job-cal-cell empty"/>;
                      const dayJobs=jobsForDay(jobTab,day);
                      // Prefer a still-live listing as the one shown by default — a
                      // closed/filled job never blocks a live one from surfacing, it
                      // only shows if every listing that day has closed.
                      const featured=dayJobs.find((j:any)=>j.status!=="closed"&&j.status!=="filled")||dayJobs[0];
                      const isClosed=featured&&(featured.status==="closed"||featured.status==="filled");
                      const rot=POSTIT_ROTATIONS[day%POSTIT_ROTATIONS.length];
                      return(
                        <div key={day} className={`cal-cell job-cal-cell${dayJobs.length?" has-jobs":""}`}>
                          <div className="cal-num">{day}</div>
                          {featured&&(
                            <div className="postit-stack">
                              <div className={`postit${isClosed?" closed":""}`} style={{background:tabInfo.color,transform:`rotate(${rot}deg)`}} onClick={()=>setSelectedJob(featured)}>
                                <span className="postit-pin">⭐</span>
                                <div className="postit-title">{featured.title}</div>
                                <div className="postit-company">{featured.company}</div>
                                <div className="postit-meta-line">📍 {featured.location}</div>
                                {isClosed&&<span className="postit-stamp">{featured.status==="filled"?"Filled":"Closed"}</span>}
                              </div>
                              {dayJobs.length>1&&<button type="button" className="postit-more" onClick={()=>setJobDayModal(day)}>+{dayJobs.length-1} more</button>}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="job-disclaimer">All jobs are reviewed before posting. The Lounge Community accepts no liability for the accuracy of listings or recruitment outcomes. 📌</div>
              </div>
              </div>);
            })()}

            </div>
            {isFreeTier&&activeTab!=="jobs"&&(
              <div className="locked-overlay">
                <div className="locked-icon">🔒</div>
                <div className="locked-title">Members Only</div>
                <div className="locked-sub">Upgrade your membership to unlock the Feed, Events, Resources and Suggestion Box.</div>
                <button className="upgrade-btn" onClick={()=>setUpgradeModalOpen(true)}>⭐ Upgrade Membership</button>
              </div>
            )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="rail">
            <div className="welcome">
              <div className="welcome-head">Hey {myAvatar} {myName}{isAdmin&&<span className="admin-badge">Admin</span>}{isFounder&&<span className="founder-badge">🌟 Founder</span>}</div>
              <div className="welcome-body">A <span className="welcome-hl">safe, closed space</span> to share, vent, and support each other. Your people. Your space. No judgement..</div>
            </div>
            <div className="rail-card">
              <a href="/support" className="rail-support-link">Support Beyond Our Walls 🧡</a>
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
    {trendingHashtags.length===0
      ? <div style={{fontSize:12,color:"#9E9587"}}>No hashtags yet — be the first to use one!</div>
      : trendingHashtags.map((t:string)=>(
        <div key={t}><span className="tag" onClick={()=>setSearch(t.slice(1))}>{t}</span></div>
      ))}
    {events.filter((e:any)=>e.approved&&new Date(e.date)>=new Date()).slice(0,3).length>0&&(
      <>
        <div style={{height:1,background:'#F0EDE8',margin:'12px 0'}}/>
        <div className="rail-title" style={{marginBottom:8}}>Upcoming Events</div>
        {events.filter((e:any)=>e.approved&&new Date(e.date)>=new Date()).sort((a:any,b:any)=>new Date(a.date).getTime()-new Date(b.date).getTime()).slice(0,3).map((e:any)=>{
          const d=new Date(e.date);
          return(
            <div key={e.id} style={{marginBottom:10,cursor:'pointer'}} onClick={()=>setActiveTab('events')}>
              <div style={{fontSize:12,fontWeight:600,color:'#1A1814',fontFamily:"'Fraunces',serif",lineHeight:1.3}}>{e.title}</div>
              <div style={{fontSize:11,color:'#9E9587',marginTop:2}}>{fmtDate(d)} · {fmt(d)}</div>
            </div>
          );
        })}
      </>
    )}
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
          <a href="/contact" className="site-footer-link">Contact</a>
          <span style={{color:"#D4CEC5"}}>·</span>
          <a href="/support" className="site-footer-link">Support Beyond Our Walls 🧡</a>
        </div>
      </footer>

      {/* Compose Post */}
      {compose&&<div className="overlay" onClick={(e:any)=>e.target===e.currentTarget&&closeCompose()}>
        <div className="modal">
          <div className="modal-title">What's going on?</div>
          <div className="modal-who"><div className="avi">{myAvatar}</div><div><div className="compose-name">{myName}{isAdmin&&<span className="admin-badge">Admin</span>}{isFounder&&<span className="founder-badge">🌟 Founder</span>} · {myLoc}</div><div className="compose-sub">Posting to The Lounge</div></div></div>
          <textarea style={{minHeight:140}} placeholder="Tell the group what's really going on..." value={draft.content} onChange={(e:any)=>setDraft((d:any)=>({...d,content:e.target.value}))}/>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" multiple style={{display:"none"}} onChange={handleImageSelect}/>
          <div className="photo-upload-row">
            <button type="button" className="btn-icon" onClick={()=>fileInputRef.current?.click()} disabled={selectedImages.length>=MAX_POST_IMAGES}>📷 Add Photos</button>
            <span className="photo-upload-count">{selectedImages.length}/{MAX_POST_IMAGES}</span>
          </div>
          {imageError&&<div className="photo-upload-error">{imageError}</div>}
          {imagePreviews.length>0&&(
            <div className="image-preview-grid">
              {imagePreviews.map((src:string,i:number)=>(
                <div key={i} className="image-preview-item">
                  <img src={src} alt=""/>
                  <button type="button" className="image-preview-remove" onClick={()=>removeSelectedImage(i)}>✕</button>
                </div>
              ))}
            </div>
          )}
          <div className="cats">{CATEGORIES.map((c:any)=>(<button key={c.id} className={`cat-opt ${draft.category===c.id?"sel":""}`} onClick={()=>setDraft((d:any)=>({...d,category:c.id}))}>{c.emoji} {c.label}</button>))}</div>
          <div className="compose-notice">Posts and images are automatically removed after 90 days 🗓️</div>
          <div className="modal-foot"><button className="btn-cancel" onClick={closeCompose}>Cancel</button><button className="btn-submit" onClick={submitPost} disabled={!draft.content.trim()||posting}>{posting?"Posting...":"Post"}</button></div>
        </div>
      </div>}

      {/* Compose Poll */}
      {composePoll&&<div className="overlay" onClick={(e:any)=>e.target===e.currentTarget&&setComposePoll(false)}>
        <div className="modal">
          <div className="modal-title">Create a Poll</div>
          <div className="modal-who"><div className="avi">{myAvatar}</div><div><div className="compose-name">{myName}{isAdmin&&<span className="admin-badge">Admin</span>}{isFounder&&<span className="founder-badge">🌟 Founder</span>} · {myLoc}</div><div className="compose-sub">Posting to The Lounge</div></div></div>
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
              <div className="modal-who"><div className="avi">{myAvatar}</div><div><div className="compose-name">{myName}{isAdmin&&<span className="admin-badge">Admin</span>}{isFounder&&<span className="founder-badge">🌟 Founder</span>} · {myLoc}</div><div className="compose-sub">Submitted for admin approval</div></div></div>
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
                <div style={{display:'flex',gap:8}}>
  <select className="input-field" style={{marginBottom:0}} value={Math.floor(eventDraft.duration/60)} onChange={(e:any)=>setEventDraft((d:any)=>({...d,duration:parseInt(e.target.value)*60+d.duration%60}))}>
    {[0,1,2,3,4].map(h=><option key={h} value={h}>{h}h</option>)}
  </select>
  <select className="input-field" style={{marginBottom:0}} value={eventDraft.duration%60} onChange={(e:any)=>setEventDraft((d:any)=>({...d,duration:Math.floor(d.duration/60)*60+parseInt(e.target.value)}))}>
    {[0,15,30,45].map(m=><option key={m} value={m}>{m}min</option>)}
  </select>
</div>

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

      {/* Settings */}
      {settingsOpen&&<div className="overlay" onClick={(e:any)=>e.target===e.currentTarget&&setSettingsOpen(false)}>
        <div className="modal">
          <div className="modal-title-row">
            <div className="modal-title">⚙️ Settings</div>
            <button className="modal-close" onClick={()=>setSettingsOpen(false)} aria-label="Close">✕</button>
          </div>

          <div className="section-label" style={{marginTop:0}}>Change Password</div>
          <a href="/auth/forgot-password" className="settings-link">🔑 Reset your password →</a>

          <div className="section-label">Update Profile</div>
          <input className="input-field" placeholder="Display name" value={profileForm.username} onChange={(e:any)=>setProfileForm((f:any)=>({...f,username:e.target.value}))}/>
          <input className="input-field" placeholder="Location (e.g. GMT)" value={profileForm.location} onChange={(e:any)=>setProfileForm((f:any)=>({...f,location:e.target.value}))}/>
          <button className="btn-submit" style={{marginBottom:8}} onClick={saveProfile} disabled={savingProfile}>{savingProfile?"Saving...":"Save Profile"}</button>

          <div className="section-label">Change Avatar</div>
          <div className="cats" style={{marginBottom:8}}>
            {AVATARS.map((a:string)=>(<button key={a} className={`cat-opt ${myAvatar===a?"sel":""}`} onClick={()=>saveAvatar(a)}>{a}</button>))}
          </div>

          <div className="section-label">Communication Preferences</div>
          <label className="dropin-toggle">
            <input type="checkbox" checked={notifPref} onChange={(e:any)=>toggleNotifPref(e.target.checked)}/>
            <span className="dropin-toggle-label">🔔 Enable notifications</span>
          </label>
          <label className="dropin-toggle" style={{marginTop:8}}>
            <input type="checkbox" checked={newsletterOptedIn} onChange={(e:any)=>toggleNewsletter(e.target.checked)}/>
            <span className="dropin-toggle-label">✉️ Newsletter &amp; updates</span>
          </label>

          <div className="section-label">Quick Views</div>
          <div className="settings-quick-row">
            <button className="btn-icon" onClick={()=>{setViewFilter("mine");setActiveTab("feed");setSettingsOpen(false);}}>📝 My Posts</button>
            <button className="btn-icon" onClick={()=>{setViewFilter("liked");setActiveTab("feed");setSettingsOpen(false);}}>❤️ My Liked Posts</button>
          </div>

          <div className="section-label">⭐ Favourited Jobs</div>
          {jobFavourites.length===0?(
            <div className="no-liked-item">No favourite jobs yet</div>
          ):jobFavourites.map((fav:any)=>{
            const job = jobListings.find((j:any)=>j.id===fav.job_id);
            return (
              <div key={fav.id} className={`job-fav-row${fav.applied?" applied":""}`}>
                {job?(
                  <>
                    <div className="job-fav-info">
                      <div className="job-fav-title"><span className="job-fav-star">⭐</span> {job.title}</div>
                      <div className="job-fav-meta">{job.company} · {job.location}{job.work_type?` · ${WORK_TYPE_ICON[job.work_type]||''} ${job.work_type}`:''}</div>
                      {fav.applied&&fav.applied_at&&<div className="job-fav-applied-date">Applied {new Date(fav.applied_at).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</div>}
                      <a className="job-fav-apply-link" href={job.url} target="_blank" rel="noreferrer">Apply →</a>
                    </div>
                    <label className="job-fav-applied">
                      <input type="checkbox" checked={!!fav.applied} onChange={()=>toggleJobApplied(fav)}/>
                      Applied ✓
                    </label>
                  </>
                ):(
                  <div className="job-fav-gone">This listing is no longer available</div>
                )}
              </div>
            );
          })}

          <div className="modal-foot"><button className="btn-cancel" onClick={()=>setSettingsOpen(false)}>Close</button></div>
        </div>
      </div>}

      {/* Likes panel */}
      {likesOpen&&<div className="overlay" onClick={(e:any)=>e.target===e.currentTarget&&setLikesOpen(false)}>
        <div className="modal">
          <div className="modal-title-row">
            <div className="modal-title">❤️ Your Likes</div>
            <button className="modal-close" onClick={()=>setLikesOpen(false)} aria-label="Close">✕</button>
          </div>

          <div className="section-label" style={{marginTop:0}}>Liked Posts</div>
          {likedPostsList.length===0?(
            <div className="no-liked-item">No liked posts yet</div>
          ):likedPostsList.map((p:any)=>(
            <div key={p.id} className="resource-card" style={{cursor:"default"}}>
              <div className="avi">{p.avatar}</div>
              <div><div className="who-name">{p.name}</div><div className="card-body" style={{fontSize:13,marginTop:4}}>{p.content}</div></div>
            </div>
          ))}

          <div className="section-label">Liked Comments</div>
          {likedCommentsList.length===0?(
            <div className="no-liked-item">No liked comments yet</div>
          ):likedCommentsList.map((item:any,i:number)=>(
            <div key={i} className="reply" style={{marginBottom:14}}>
              <div className="reply-avi">{item.reply.avatar}</div>
              <div className="reply-body">
                <span className="reply-who">{item.reply.name}</span>
                <div className="reply-text">{item.reply.text}</div>
                <div style={{fontSize:11,color:"#9E9587",marginTop:4}}>on: &ldquo;{item.postPreview.slice(0,60)}{item.postPreview.length>60?"…":""}&rdquo;</div>
              </div>
            </div>
          ))}

          <div className="modal-foot"><button className="btn-cancel" onClick={()=>setLikesOpen(false)}>Close</button></div>
        </div>
      </div>}

      {/* Delete confirmation */}
      {deleteConfirmId!=null&&<div className="overlay" onClick={(e:any)=>e.target===e.currentTarget&&setDeleteConfirmId(null)}>
        <div className="modal" style={{maxWidth:380}}>
          <div className="modal-title">Delete post?</div>
          <div style={{fontSize:13,color:"#6B6358",lineHeight:1.6,marginBottom:20}}>Are you sure you want to delete this post? This cannot be undone.</div>
          <div className="modal-foot">
            <button className="btn-cancel" onClick={()=>setDeleteConfirmId(null)}>Cancel</button>
            <button className="btn-submit" style={{background:"#F4622A"}} onClick={deletePost}>Delete</button>
          </div>
        </div>
      </div>}

      {/* Job detail */}
      {selectedJob&&(()=>{
        const jobColor = (JOB_TABS.find((t:any)=>t.id===selectedJob.role_category)||JOB_TABS[0]).color;
        const faved = isFavourited(selectedJob.id);
        const isClosed = selectedJob.status==="closed"||selectedJob.status==="filled";
        return(
        <div className="overlay" onClick={(e:any)=>e.target===e.currentTarget&&setSelectedJob(null)}>
          <div className="postit-modal" style={{background:jobColor}}>
            <button className="postit-modal-close" onClick={()=>setSelectedJob(null)} aria-label="Close">✕</button>
            <div className="postit-modal-pin">⭐</div>
            <div className="postit-modal-body">
              <div className="postit-modal-title">{selectedJob.title}</div>
              <div className="postit-modal-company">{selectedJob.company}</div>
              <div className="postit-modal-meta">📍 {selectedJob.location}{selectedJob.work_type?` · ${WORK_TYPE_ICON[selectedJob.work_type]||''} ${selectedJob.work_type}`:''}</div>
              {selectedJob.salary&&<div className="postit-modal-meta">💷 {selectedJob.salary}</div>}
              {selectedJob.description&&<div className="postit-modal-desc">{selectedJob.description}</div>}
              {isClosed&&(
                <div className="postit-modal-badges">
                  <span className="job-source-badge" style={{background:"#8a2020"}}>{selectedJob.status==="filled"?"Filled":"Closed"}</span>
                </div>
              )}
              {isClosed
                ? <div className="postit-closed-notice">This role is no longer available.</div>
                : <a className="postit-view-btn" href={selectedJob.url} target="_blank" rel="noreferrer">View Job →</a>}
              {!isClosed&&(
                <>
                  <button className={`postit-fav-btn ${faved?"on":""}`} onClick={()=>toggleFavourite(selectedJob.id)}>{faved?"⭐ Favourited":"☆ Favourite"}</button>
                  <div className="postit-fav-hint">Save as a reminder to apply later</div>
                </>
              )}
              <div className="job-vetted-note">All jobs are reviewed before posting. The Lounge Community accepts no liability for the accuracy of listings or recruitment outcomes.</div>
            </div>
          </div>
        </div>
        );
      })()}

      {/* Day jobs list */}
      {jobDayModal!==null&&(()=>{
        const dj = jobsForDay(jobTab, jobDayModal);
        const tabInfo2 = JOB_TABS.find((t:any)=>t.id===jobTab) || JOB_TABS[0];
        return(
        <div className="overlay" onClick={(e:any)=>e.target===e.currentTarget&&setJobDayModal(null)}>
          <div className="modal" style={{maxWidth:420}}>
            <div className="modal-title-row">
              <div className="modal-title">{tabInfo2.emoji} Jobs posted {jobDayModal} {MONTHS[jobCalMonth]}</div>
              <button className="modal-close" onClick={()=>setJobDayModal(null)} aria-label="Close">✕</button>
            </div>
            <div className="job-day-list">
              {dj.map((job:any)=>{
                const isClosed = job.status==="closed"||job.status==="filled";
                return(
                  <div key={job.id} className={`job-day-list-item${isClosed?" closed":""}`} onClick={()=>{setSelectedJob(job);setJobDayModal(null);}}>
                    <div className="job-day-list-title">{job.title}{isClosed&&<span className="job-day-list-status">{job.status==="filled"?"Filled":"Closed"}</span>}</div>
                    <div className="job-day-list-company">{job.company}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        );
      })()}

      {/* Upgrade Membership */}
      {upgradeModalOpen&&(
        <div className="overlay" onClick={(e:any)=>e.target===e.currentTarget&&!upgrading&&setUpgradeModalOpen(false)}>
          <div className="modal" style={{maxWidth:380}}>
            <div className="modal-title-row">
              <div className="modal-title">⭐ Upgrade Membership</div>
              <button className="modal-close" onClick={()=>setUpgradeModalOpen(false)} aria-label="Close">✕</button>
            </div>
            {upgradeDone?(
              <>
                <div style={{fontSize:14,color:"#1A1814",lineHeight:1.6,marginBottom:20}}>🎉 You're now a Member — welcome! The Feed, Events, Resources and Suggestion Box are unlocked.</div>
                <button className="btn-submit" style={{width:"100%"}} onClick={()=>{setUpgradeModalOpen(false);setUpgradeDone(false);}}>Continue</button>
              </>
            ):(
              <>
                <div style={{fontSize:13,color:"#6B6358",lineHeight:1.6,marginBottom:16}}>
                  During our beta, Membership is <strong>£0</strong> — full access to the Feed, Events, Resources and the Suggestion Box, on top of the Job Board you already have.
                </div>
                {!signedUpAsMember&&(
                  <div className="upgrade-note">Note: the 🌟 Founder badge is reserved for members who chose Member at signup — upgrading now won't grant it retroactively.</div>
                )}
                <div className="modal-foot">
                  <button className="btn-cancel" onClick={()=>setUpgradeModalOpen(false)} disabled={upgrading}>Cancel</button>
                  <button className="btn-submit" onClick={upgradeMembership} disabled={upgrading}>{upgrading?"Upgrading…":"Upgrade Now"}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {toast&&<div className="toast">{toast}</div>}
    </div>
  </>);
}
