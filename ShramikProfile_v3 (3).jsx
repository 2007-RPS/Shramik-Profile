import { useState, useEffect } from "react";

/* =============================================================
   SHRAMIK -- India's Verified Worker Network
   Clean rewrite v3.1 -- zero accumulated bugs
   Design: Dark navy mesh hero, teal accent, bento grid
   Fonts: Syne (display) + Plus Jakarta Sans (body)
   12 pages, fully responsive, mobile hamburger nav
============================================================= */

// --- TOKENS --------------------------------------------------
const T = {
  void:"#020408", base:"#060D18", l1:"#0C1829", l2:"#112035",
  glass:"rgba(255,255,255,0.06)", glassB:"rgba(255,255,255,0.10)",
  white:"#FFFFFF", offwhite:"#F7F9FC", subtle:"#F0F4F9",
  border:"#E2E8F0", borderM:"#CBD5E1",
  ink:"#0A1628", body:"#334155", muted:"#64748B", dim:"#94A3B8",
  teal:"#00E5C3", tealM:"#00C9A7", tealD:"#009E82",
  tealGlow:"rgba(0,229,195,0.15)",
  violet:"#8B5CF6", violetL:"#A78BFA", violetGlow:"rgba(139,92,246,0.15)",
  amber:"#F59E0B", amberL:"#FCD34D",
  green:"#10B981", greenBg:"#ECFDF5",
  red:"#EF4444", gold:"#FBBF24",
  s1:"0 1px 3px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.08)",
  s2:"0 4px 20px rgba(0,0,0,0.12)",
  s3:"0 12px 48px rgba(0,0,0,0.18)",
  r:"10px", rM:"16px", rL:"22px", rX:"32px",
};

// --- GLOBAL STYLES -------------------------------------------
function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');
      *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
      html{scroll-behavior:smooth}
      body,#root{font-family:'Plus Jakarta Sans',system-ui,sans-serif;background:${T.offwhite};color:${T.body};overflow-x:hidden;-webkit-font-smoothing:antialiased}
      .font-display{font-family:'Syne',system-ui,sans-serif;letter-spacing:-0.04em}
      .grad-teal{background:linear-gradient(120deg,${T.teal},${T.violetL});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
      .grad-amber{background:linear-gradient(120deg,${T.amber},#F97316);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
      .grad-violet{background:linear-gradient(120deg,${T.violetL},${T.teal});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
      @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
      @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
      @keyframes slideLeft{from{transform:translateX(0)}to{transform:translateX(-50%)}}
      @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.6;transform:scale(0.95)}}
      @keyframes menuSlide{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
      .anim-fadeup{animation:fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both}
      .anim-fadeup-1{animation:fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.1s both}
      .anim-fadeup-2{animation:fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.2s both}
      .anim-fadein{animation:fadeIn 0.4s ease both}
      .anim-float{animation:floatY 4s ease-in-out infinite}
      .anim-menuslide{animation:menuSlide 0.25s cubic-bezier(0.22,1,0.36,1) both}
      .lift{transition:transform 0.22s cubic-bezier(0.34,1.56,0.64,1),box-shadow 0.22s ease,border-color 0.2s}
      .lift:hover{transform:translateY(-4px)}
      .card-glow:hover{box-shadow:0 0 0 1.5px ${T.teal}44,0 12px 40px rgba(0,229,195,0.14)}
      .btn-teal:hover{filter:brightness(1.08);transform:translateY(-2px)}
      .btn-ghost:hover{border-color:${T.teal}!important;color:${T.teal}!important}
      ::-webkit-scrollbar{width:5px}
      ::-webkit-scrollbar-track{background:${T.offwhite}}
      ::-webkit-scrollbar-thumb{background:${T.borderM};border-radius:3px}
      .marquee{display:flex;width:max-content;animation:slideLeft 32s linear infinite}
      .marquee:hover{animation-play-state:paused}
      .mesh-bg{background:radial-gradient(ellipse 80% 60% at 20% 40%,rgba(0,229,195,0.13) 0%,transparent 60%),radial-gradient(ellipse 60% 50% at 80% 20%,rgba(139,92,246,0.11) 0%,transparent 60%),${T.base}}
      .dot-bg{background-image:radial-gradient(circle,rgba(255,255,255,0.035) 1px,transparent 1px);background-size:28px 28px}
      .tab-on{background:${T.teal}!important;color:${T.base}!important;font-weight:700!important}
      input,textarea,select{font-family:'Plus Jakarta Sans',system-ui;color:${T.ink}}
      input::placeholder,textarea::placeholder{color:${T.dim}}
      select option{background:#fff;color:${T.ink}}
      .hamburger{display:none}
      @media(max-width:900px){
        .nav-links{display:none!important}
        .hamburger{display:flex!important}
        .grid-hero{grid-template-columns:1fr!important}
        .grid-3{grid-template-columns:1fr 1fr!important}
        .grid-4{grid-template-columns:1fr 1fr!important}
        .grid-plan{grid-template-columns:1fr!important}
        .grid-profile{grid-template-columns:1fr!important}
        .footer-grid{grid-template-columns:1fr 1fr!important}
      }
      @media(max-width:600px){
        .grid-3{grid-template-columns:1fr!important}
        .grid-4{grid-template-columns:1fr 1fr!important}
        .grid-2{grid-template-columns:1fr!important}
        .bento-grid{grid-template-columns:1fr!important}
        .h1-big{font-size:36px!important;letter-spacing:-1px!important}
        .h2-big{font-size:28px!important}
        .sec-pad{padding:60px 16px!important}
        .otp-input{width:40px!important;height:50px!important;font-size:18px!important}
        .sidebar-sticky{position:static!important}
        .dash-4{grid-template-columns:1fr 1fr!important}
        .footer-grid{grid-template-columns:1fr!important}
      }
    `}</style>
  );
}

// --- HELPERS -------------------------------------------------
function row(align, justify, gap) {
  return { display:"flex", alignItems:align||"center", justifyContent:justify||"flex-start", gap:gap||0, flexWrap:"wrap" };
}
function col(gap) { return { display:"flex", flexDirection:"column", gap:gap||0 }; }
function card(p, extra) { return Object.assign({ background:T.white, border:"1px solid #E8EDF4", borderRadius:T.rM, padding:p||24, boxShadow:T.s1 }, extra||{}); }
var inp = { width:"100%", background:"#F8FAFC", border:"1.5px solid #E2E8F0", borderRadius:T.r, padding:"11px 14px", fontSize:14, outline:"none", transition:"border-color 0.15s" };

// --- ATOMS ---------------------------------------------------
function Chip(props) {
  var label=props.label, color=props.color||T.teal, size=props.size||11, dot=props.dot;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, background:color+"18", color:color, border:"1px solid "+color+"28", borderRadius:T.rX, padding:"4px "+(size+2)+"px", fontSize:size, fontWeight:700, whiteSpace:"nowrap" }}>
      {dot && <span style={{ width:6, height:6, borderRadius:"50%", background:color, flexShrink:0 }} />}
      {label}
    </span>
  );
}

function Stars(props) {
  var n=props.n||0, size=props.size||14, interactive=props.interactive, onChange=props.onChange;
  var hover = useState(0);
  var hoverVal = hover[0], setHover = hover[1];
  return (
    <span style={row("center","flex-start",3)}>
      {[1,2,3,4,5].map(function(s) {
        return (
          <span key={s} style={{ fontSize:size, color:s<=(hoverVal||n)?T.gold:"#E2E8F0", cursor:interactive?"pointer":"default", lineHeight:1, transition:"color 0.1s" }}
            onMouseEnter={function(){ if(interactive) setHover(s); }}
            onMouseLeave={function(){ if(interactive) setHover(0); }}
            onClick={function(){ if(interactive && onChange) onChange(s); }}>
            &#9733;
          </span>
        );
      })}
    </span>
  );
}

function Score(props) {
  var n=props.n, count=props.count;
  var c = n>=4.7?T.green:n>=4.3?T.tealM:T.amber;
  return (
    <span style={Object.assign(row("center","flex-start",5), { background:c+"14", border:"1px solid "+c+"22", borderRadius:T.rX, padding:"4px 11px" })}>
      <span style={{ fontSize:12, color:T.gold }}>&#9733;</span>
      <span style={{ fontSize:13, fontWeight:800, color:c }}>{n.toFixed(1)}</span>
      {count!==undefined && <span style={{ fontSize:11, color:T.muted }}>({count})</span>}
    </span>
  );
}

function Avi(props) {
  var text=props.text, bg=props.bg, size=props.size||44, r=props.r||12, ring=props.ring;
  return (
    <div style={{ width:size, height:size, borderRadius:r, background:bg, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.33, fontWeight:800, color:"#fff", fontFamily:"'Syne',system-ui", boxShadow:ring?"0 0 0 2px "+T.base+",0 0 0 4px "+T.teal:undefined }}>
      {text}
    </div>
  );
}

function TrustLevel(props) {
  var score=props.score;
  var lvl = score>=4.8 ? { label:"Platinum", c:"#94A3B8", icon:"Plat." }
    : score>=4.5 ? { label:"Gold", c:T.amber, icon:"Gold" }
    : score>=4.0 ? { label:"Silver", c:"#8B9CB6", icon:"Silver" }
    : { label:"Rising", c:T.teal, icon:"Rising" };
  return <Chip label={lvl.label} color={lvl.c} />;
}

function BtnTeal(props) {
  var children=props.children, onClick=props.onClick, full=props.full, style=props.style||{};
  return (
    <button onClick={onClick} className="btn-teal"
      style={Object.assign({ display:"inline-flex", alignItems:"center", justifyContent:"center", gap:8, background:"linear-gradient(135deg,"+T.teal+","+T.tealM+")", color:T.base, border:"none", borderRadius:T.r, padding:"12px 24px", fontSize:14, fontWeight:700, fontFamily:"'Plus Jakarta Sans',system-ui", cursor:"pointer", boxShadow:"0 4px 20px "+T.tealGlow, transition:"filter 0.15s,transform 0.15s", width:full?"100%":undefined }, style)}>
      {children}
    </button>
  );
}

function BtnGhost(props) {
  var children=props.children, onClick=props.onClick, full=props.full, dark=props.dark, style=props.style||{};
  return (
    <button onClick={onClick} className="btn-ghost"
      style={Object.assign({ display:"inline-flex", alignItems:"center", justifyContent:"center", gap:8, background:"transparent", color:dark?T.snow70||"rgba(255,255,255,0.7)":T.body, border:"1.5px solid "+(dark?"rgba(255,255,255,0.25)":"#CBD5E1"), borderRadius:T.r, padding:"12px 24px", fontSize:14, fontWeight:600, fontFamily:"'Plus Jakarta Sans',system-ui", cursor:"pointer", transition:"all 0.2s", width:full?"100%":undefined }, style)}>
      {children}
    </button>
  );
}

function BtnViolet(props) {
  var children=props.children, onClick=props.onClick, full=props.full, style=props.style||{};
  return (
    <button onClick={onClick} className="btn-teal"
      style={Object.assign({ display:"inline-flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,"+T.violet+",#6D28D9)", color:"#fff", border:"none", borderRadius:T.r, padding:"12px 24px", fontSize:14, fontWeight:700, fontFamily:"'Plus Jakarta Sans',system-ui", cursor:"pointer", boxShadow:"0 4px 20px "+T.violetGlow, transition:"filter 0.15s,transform 0.15s", width:full?"100%":undefined }, style)}>
      {children}
    </button>
  );
}

function BtnAmber(props) {
  var children=props.children, onClick=props.onClick, full=props.full, style=props.style||{};
  return (
    <button onClick={onClick} className="btn-teal"
      style={Object.assign({ display:"inline-flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,"+T.amber+",#F97316)", color:"#fff", border:"none", borderRadius:T.r, padding:"12px 24px", fontSize:14, fontWeight:700, fontFamily:"'Plus Jakarta Sans',system-ui", cursor:"pointer", boxShadow:"0 4px 20px rgba(245,158,11,0.3)", transition:"filter 0.15s,transform 0.15s", width:full?"100%":undefined }, style)}>
      {children}
    </button>
  );
}

// --- DATA ----------------------------------------------------
var WORKERS = [
  { id:1, name:"Rekha Devi", role:"Domestic Helper", city:"Hyderabad", area:"Banjara Hills", verified:true, score:4.8, reviews:34, exp:7, skills:["Cooking","Cleaning","Child Care","Elderly Care"], bio:"7 years with families in Banjara Hills & Jubilee Hills. Specialist in South-Indian cooking.", salary:"14,000/mo", avi:"RD", color:"#0D9488", avail:"Available", lang:["Telugu","Hindi"], since:"2017", completePct:98, badges:["Top Rated","Police Verified","Background Check"], jobs:[{ emp:"Sharma Residence", role:"Cook & Help", dur:"Jan 2021-Mar 2024", rating:5, review:"Rekha is exceptional - punctual, trustworthy and an outstanding cook.", verified:true, date:"Mar 2024" },{ emp:"Mehta Family, Jubilee Hills", role:"Full House Help", dur:"Jun 2019-Dec 2020", rating:5, review:"Reliable and honest. Always went above and beyond.", verified:true, date:"Dec 2020" }] },
  { id:2, name:"Rajan Kumar", role:"Plumber", city:"Bengaluru", area:"Whitefield", verified:true, score:4.6, reviews:58, exp:12, skills:["Pipe Fitting","Leak Repair","Bathroom Fixtures","Gas Line"], bio:"Licensed plumber, 12 years. 500+ residential jobs. Emergency calls available 24/7.", salary:"1,200/visit", avi:"RK", color:"#2563EB", avail:"Available", lang:["Kannada","Hindi"], since:"2012", completePct:100, badges:["Licensed","Emergency 24/7","Gas Certified"], jobs:[{ emp:"Green Park Apartments", role:"Resident Plumber", dur:"2022-Present", rating:5, review:"Fixed a burst pipe at midnight without a complaint.", verified:true, date:"2024" }] },
  { id:3, name:"Suresh Nair", role:"Security Guard", city:"Mumbai", area:"Powai", verified:true, score:4.9, reviews:42, exp:9, skills:["Access Control","CCTV","Emergency Response","Night Patrol"], bio:"Ex-Army. 9 years residential security. Zero incident record 4 years running.", salary:"18,000/mo", avi:"SN", color:"#7C3AED", avail:"Available", lang:["Malayalam","Hindi","English"], since:"2015", completePct:99, badges:["Ex-Army","Police Verified","Fire Safety"], jobs:[{ emp:"Lodha Splendora, Thane", role:"Head Guard", dur:"2020-Present", rating:5, review:"Suresh transformed our building security. Zero incidents in 4 years.", verified:true, date:"2024" }] },
  { id:4, name:"Priya Singh", role:"Cook", city:"Pune", area:"Koregaon Park", verified:true, score:4.4, reviews:19, exp:4, skills:["North Indian","Tiffin Service","Baking","Meal Prep"], bio:"Punjabi and continental cuisine specialist. Daily tiffin for working couples.", salary:"10,000/mo", avi:"PS", color:"#D97706", avail:"Available", lang:["Hindi","Marathi"], since:"2020", completePct:82, badges:["Tiffin Service"], jobs:[{ emp:"Tiwari Family, Aundh", role:"Cook", dur:"2022-Present", rating:4, review:"Consistent quality, very hygienic. Kids love her food.", verified:true, date:"2024" }] },
  { id:5, name:"Mohan Das", role:"Electrician", city:"Delhi", area:"Lajpat Nagar", verified:true, score:4.7, reviews:67, exp:15, skills:["Wiring","MCB","Inverter Setup","CCTV","AC Fitting"], bio:"15 years licensed electrician. CPWD-empanelled. Residential and commercial projects.", salary:"900/hr", avi:"MD", color:"#059669", avail:"On Job", lang:["Hindi","English"], since:"2009", completePct:96, badges:["CPWD","Licensed","Verified"], jobs:[{ emp:"DLF Sector 22 Society", role:"Society Electrician", dur:"2019-Present", rating:5, review:"Mohan is our go-to electrician. Professional and reliable.", verified:true, date:"2024" }] },
  { id:6, name:"Fatima Begum", role:"Elderly Care", city:"Hyderabad", area:"Jubilee Hills", verified:true, score:4.9, reviews:28, exp:6, skills:["Patient Care","Medicine Mgmt","Night Care","Physiotherapy Assist"], bio:"Trained elderly carer, 6 years. Mobility, medication, companionship.", salary:"20,000/mo", avi:"FB", color:"#DC2626", avail:"Available", lang:["Telugu","Urdu","Hindi"], since:"2018", completePct:100, badges:["Trained Carer","Night Care","Police Verified"], jobs:[{ emp:"Reddy Family, Jubilee Hills", role:"Live-in Carer", dur:"2021-Present", rating:5, review:"Fatima is an angel. Our mother is in the best hands.", verified:true, date:"2024" }] },
];

var CATS = [
  { icon:"[M]", label:"Domestic Help", n:"4,200+", color:T.tealM },
  { icon:"[W]", label:"Plumbers", n:"1,800+", color:T.violet },
  { icon:"[S]", label:"Security", n:"2,100+", color:"#7C3AED" },
  { icon:"[C]", label:"Cooks", n:"3,400+", color:T.amber },
  { icon:"[E]", label:"Electricians", n:"2,300+", color:T.green },
  { icon:"[O]", label:"Elderly Care", n:"1,400+", color:"#EC4899" },
  { icon:"[D]", label:"Drivers", n:"3,800+", color:"#0EA5E9" },
  { icon:"[B]", label:"Carpenters", n:"900+", color:"#92400E" },
];

// --- NAV -----------------------------------------------------
function Nav(props) {
  var page=props.page, setPage=props.setPage, user=props.user, setUser=props.setUser;
  var menuState = useState(false);
  var menuOpen = menuState[0], setMenuOpen = menuState[1];
  var onDark = page==="landing" || page==="auth" || page==="enterprise";
  var navBg = onDark ? "rgba(6,13,24,0.92)" : "rgba(255,255,255,0.92)";
  var borderC = onDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)";
  var links = [
    { id:"search", l:"Find Workers" },
    { id:"pricing", l:"Pricing" },
    { id:"for-societies", l:"For Societies" },
    { id:"for-workers", l:"For Workers" },
    { id:"enterprise", l:"Enterprise" },
  ];

  function getDash() {
    if (!user) return "auth";
    if (user.type==="worker") return "worker-dashboard";
    if (user.type==="society") return "society-dashboard";
    if (user.type==="admin") return "admin";
    return "employer-dashboard";
  }

  function AuthButtons() {
    if (user) {
      return (
        <div style={row("center","flex-end",10)}>
          <div onClick={function(){ setPage(getDash()); }} style={Object.assign(row("center","flex-start",8), { cursor:"pointer", background:onDark?T.glass:T.subtle, borderRadius:T.r, padding:"6px 12px", border:"1px solid "+(onDark?T.glassB:"#E2E8F0") })}>
            <Avi text={user.name[0]} bg={T.tealM} size={26} r={7} />
            <span style={{ fontSize:13, fontWeight:600, color:onDark?"#fff":T.ink }}>{user.name.split(" ")[0]}</span>
          </div>
          <button onClick={function(){ setUser(null); setPage("landing"); }} style={{ background:"none", border:"none", cursor:"pointer", fontSize:13, color:onDark?"rgba(255,255,255,0.45)":T.muted, fontFamily:"'Plus Jakarta Sans',system-ui" }}>Sign out</button>
        </div>
      );
    }
    return (
      <div style={row("center","flex-end",10)}>
        <button onClick={function(){ setPage("auth"); }} style={{ background:"none", border:"none", cursor:"pointer", fontSize:13.5, fontWeight:600, color:onDark?"rgba(255,255,255,0.7)":T.body, fontFamily:"'Plus Jakarta Sans',system-ui" }}>Sign in</button>
        <BtnTeal onClick={function(){ setPage("auth"); }} style={{ padding:"8px 18px", fontSize:13 }}>Get started</BtnTeal>
      </div>
    );
  }

  return (
    <div>
      <nav style={{ position:"sticky", top:0, zIndex:200, background:navBg, backdropFilter:"blur(24px)", borderBottom:"1px solid "+borderC }}>
        <div style={Object.assign(row("center","space-between"), { maxWidth:1200, margin:"0 auto", height:60, padding:"0 24px" })}>
          <div onClick={function(){ setPage("landing"); setMenuOpen(false); }} style={Object.assign(row("center","flex-start",10), { cursor:"pointer", flexShrink:0 })}>
            <div style={{ width:32, height:32, borderRadius:9, background:"linear-gradient(135deg,"+T.teal+","+T.tealM+")", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontFamily:"'Syne',system-ui", fontWeight:800, color:T.base, flexShrink:0 }}>S</div>
            <span className="font-display" style={{ fontSize:18, fontWeight:800, color:onDark?"#fff":T.ink, letterSpacing:"-0.5px", whiteSpace:"nowrap" }}>Shramik<span style={{ color:T.teal }}>.</span></span>
          </div>

          <div className="nav-links" style={row("center","flex-start",2)}>
            {links.map(function(l) {
              return (
                <button key={l.id} onClick={function(){ setPage(l.id); }}
                  style={{ background:"none", border:"none", cursor:"pointer", padding:"7px 12px", fontSize:13.5, fontWeight:page===l.id?700:500, color:page===l.id?T.teal:onDark?"rgba(255,255,255,0.7)":T.muted, fontFamily:"'Plus Jakarta Sans',system-ui", borderRadius:8, transition:"color 0.15s" }}>
                  {l.l}
                </button>
              );
            })}
          </div>

          <div style={row("center","flex-end",10)}>
            <div className="nav-links">
              <AuthButtons />
            </div>
            <button className="hamburger" onClick={function(){ setMenuOpen(function(o){ return !o; }); }}
              style={{ background:"none", border:"1px solid "+(onDark?T.glassB:"#E2E8F0"), borderRadius:8, width:38, height:38, cursor:"pointer", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:5, padding:8, flexShrink:0 }}>
              {[0,1,2].map(function(i) {
                return <span key={i} style={{ display:"block", width:18, height:2, background:onDark?"#fff":T.ink, borderRadius:2 }} />;
              })}
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className="anim-menuslide" style={{ position:"fixed", top:60, left:0, right:0, zIndex:199, background:onDark?"rgba(6,13,24,0.97)":"rgba(255,255,255,0.97)", backdropFilter:"blur(24px)", borderBottom:"1px solid "+borderC, padding:"16px 24px 24px" }}>
          {links.map(function(l) {
            return (
              <button key={l.id} onClick={function(){ setPage(l.id); setMenuOpen(false); }}
                style={{ display:"block", width:"100%", textAlign:"left", background:"none", border:"none", cursor:"pointer", padding:"12px 0", fontSize:16, fontWeight:page===l.id?700:500, color:page===l.id?T.teal:onDark?"#fff":T.ink, fontFamily:"'Plus Jakarta Sans',system-ui", borderBottom:"1px solid "+borderC }}>
                {l.l}
              </button>
            );
          })}
          <div style={{ marginTop:16 }}><AuthButtons /></div>
        </div>
      )}
    </div>
  );
}

// --- LANDING -------------------------------------------------
function Landing(props) {
  var setPage=props.setPage, setUser=props.setUser;
  var cState = useState({ w:0, s:0, r:0 });
  var counts=cState[0], setCounts=cState[1];

  useEffect(function() {
    var tgt = { w:24100, s:1280, r:98200 };
    var f = 0, FRAMES = 80;
    var timer = setInterval(function() {
      f++;
      var p = f/FRAMES;
      var ease = 1 - Math.pow(1-p, 3);
      setCounts({ w:Math.floor(tgt.w*ease), s:Math.floor(tgt.s*ease), r:Math.floor(tgt.r*ease) });
      if (f>=FRAMES) clearInterval(timer);
    }, 18);
    return function() { clearInterval(timer); };
  }, []);

  var wiState = useState(0);
  var wi=wiState[0], setWi=wiState[1];
  var words = ["trusted","verified","reliable","proven"];
  useEffect(function() {
    var timer = setInterval(function() { setWi(function(i){ return (i+1)%words.length; }); }, 2400);
    return function() { clearInterval(timer); };
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="mesh-bg dot-bg" style={{ padding:"96px 32px 100px", overflow:"hidden", position:"relative" }}>
        <div style={{ position:"absolute", top:"15%", left:"8%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(0,229,195,0.12) 0%,transparent 70%)", pointerEvents:"none", filter:"blur(40px)" }} />
        <div style={{ position:"absolute", top:"30%", right:"5%", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,rgba(139,92,246,0.10) 0%,transparent 70%)", pointerEvents:"none", filter:"blur(40px)" }} />

        <div style={{ maxWidth:1200, margin:"0 auto", position:"relative" }}>
          <div className="grid-hero" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"center" }}>

            {/* Left */}
            <div className="anim-fadeup">
              <div style={Object.assign(row("center","flex-start",8), { marginBottom:28 })}>
                <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:T.glass, border:"1px solid "+T.glassB, borderRadius:T.rX, padding:"6px 16px" }}>
                  <div style={{ width:7, height:7, borderRadius:"50%", background:T.teal, animation:"pulse 2s infinite" }} />
                  <span style={{ fontSize:12, fontWeight:600, color:"rgba(255,255,255,0.7)", letterSpacing:0.8 }}>INDIA'S VERIFIED WORKER NETWORK</span>
                </div>
              </div>

              <h1 className="font-display h1-big" style={{ fontSize:60, fontWeight:800, lineHeight:1.05, letterSpacing:"-2px", color:"#fff", marginBottom:24 }}>
                Your workers,<br />
                <span className="grad-teal" key={wi} style={{ animation:"fadeIn 0.4s ease" }}>{words[wi]}.</span>
              </h1>

              <p style={{ fontSize:17, color:"rgba(255,255,255,0.5)", lineHeight:1.8, maxWidth:440, marginBottom:36 }}>
                Verified profiles. Portable ratings. From maids and cooks to plumbers and guards - every worker your home or society needs.
              </p>

              <div style={Object.assign(row("center","flex-start",14), { marginBottom:44 })}>
                <BtnTeal onClick={function(){ setPage("search"); }} style={{ padding:"14px 28px", fontSize:15 }}>Find verified workers</BtnTeal>
                <BtnGhost onClick={function(){ setPage("for-workers"); }} dark={true} style={{ padding:"14px 24px", fontSize:14 }}>I am a worker</BtnGhost>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:28, paddingTop:36, borderTop:"1px solid rgba(255,255,255,0.06)" }}>
                {[[counts.w.toLocaleString()+"+","Verified workers"],[counts.s.toLocaleString()+"+","Societies"],[Math.floor(counts.r/1000)+"K+","Verified ratings"]].map(function(item) {
                  return (
                    <div key={item[1]}>
                      <div className="font-display" style={{ fontSize:30, fontWeight:800, color:T.teal, lineHeight:1 }}>{item[0]}</div>
                      <div style={{ fontSize:13, color:"rgba(255,255,255,0.45)", marginTop:4 }}>{item[1]}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right card */}
            <div className="anim-float anim-fadeup-1" style={{ position:"relative" }}>
              <div style={{ background:"rgba(12,24,41,0.85)", backdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:T.rX, padding:28, boxShadow:"0 0 40px rgba(0,229,195,0.2),0 24px 64px rgba(0,0,0,0.5)" }}>
                <div style={Object.assign(row("flex-start","space-between"), { marginBottom:20 })}>
                  <div style={row("flex-start","flex-start",14)}>
                    <Avi text="RD" bg={T.tealM} size={54} r={14} ring={true} />
                    <div>
                      <div className="font-display" style={{ fontSize:17, fontWeight:800, color:"#fff" }}>Rekha Devi</div>
                      <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", marginTop:2 }}>Domestic Helper - 7 yrs</div>
                      <div style={{ marginTop:6 }}><Chip label="Verified" color={T.teal} /></div>
                    </div>
                  </div>
                  <Score n={4.8} count={34} />
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:18 }}>
                  {[["7 yrs","Experience"],["34","Reviews"],["98%","Completion"]].map(function(item) {
                    return (
                      <div key={item[1]} style={{ background:T.glass, borderRadius:10, padding:"12px 10px", textAlign:"center", border:"1px solid rgba(255,255,255,0.06)" }}>
                        <div style={{ fontSize:16, fontWeight:800, color:T.teal }}>{item[0]}</div>
                        <div style={{ fontSize:10, color:"rgba(255,255,255,0.45)", marginTop:2 }}>{item[1]}</div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ background:T.glass, borderRadius:12, padding:"12px 14px", marginBottom:18 }}>
                  <div style={{ fontSize:11, color:T.teal, fontWeight:700, marginBottom:5 }}>Latest Review</div>
                  <p style={{ fontSize:12.5, color:"rgba(255,255,255,0.65)", fontStyle:"italic", lineHeight:1.65 }}>"Rekha is exceptional - punctual, honest, and an outstanding cook."</p>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", marginTop:5 }}>- Sharma Family, Banjara Hills</div>
                </div>
                <BtnTeal onClick={function(){ setPage("search"); }} full={true} style={{ padding:"11px", fontSize:13.5 }}>View Profile and Hire</BtnTeal>
              </div>
              <div style={{ position:"absolute", top:-18, right:-24, background:"rgba(12,24,41,0.9)", backdropFilter:"blur(12px)", border:"1px solid rgba(0,229,195,0.3)", borderRadius:12, padding:"9px 14px", transform:"rotate(2deg)", fontSize:12, color:"rgba(255,255,255,0.8)", fontWeight:600, whiteSpace:"nowrap" }}>Hired in 18 min</div>
              <div style={{ position:"absolute", bottom:28, left:-32, background:"rgba(12,24,41,0.9)", backdropFilter:"blur(12px)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:12, padding:"9px 14px", transform:"rotate(-2deg)", fontSize:12, color:"rgba(255,255,255,0.7)", fontWeight:600, whiteSpace:"nowrap" }}>Police Verified</div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST RIBBON */}
      <div style={{ background:T.l1, borderTop:"1px solid rgba(255,255,255,0.06)", borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"15px 0", overflow:"hidden" }}>
        <div className="marquee">
          {["Prestige Group","DLF Residencies","Brigade Society","Lodha Living","Sobha Complexes","Godrej Properties","Puravankara","Shapoorji Pallonji","Embassy Group","Phoenix Mills","Prestige Group","DLF Residencies","Brigade Society","Lodha Living","Sobha Complexes","Godrej Properties"].map(function(s, i) {
            return <span key={i} style={{ padding:"0 44px", fontSize:13, fontWeight:600, color:"rgba(255,255,255,0.25)", whiteSpace:"nowrap" }}>{s}</span>;
          })}
        </div>
      </div>

      {/* PAIN SECTION */}
      <section className="sec-pad" style={{ padding:"100px 32px", background:T.white }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:64 }}>
            <Chip label="THE PROBLEM" color={T.violet} size={11} />
            <h2 className="font-display h2-big" style={{ fontSize:44, fontWeight:800, color:T.ink, letterSpacing:"-1.5px", lineHeight:1.1, marginTop:16 }}>
              Three broken relationships.<br /><span className="grad-teal">One platform fixes them all.</span>
            </h2>
          </div>
          <div className="grid-3" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
            {[
              { who:"Families", color:T.violet, problem:"I can't verify if this person is safe for my home and children. WhatsApp forwards are useless.", solution:"Background-verified profiles, police clearance, 30+ employer-verified reviews - before you call.", stats:[["22 min","Avg hire time"],["97%","Safety rating"]] },
              { who:"Societies", color:T.teal, problem:"Unknown workers enter daily. No record. No verification. The secretary is overwhelmed.", solution:"QR gate management. Live entry log. Instant alerts on flagged workers. Full monthly audit.", stats:[["0","Safety incidents"],["72+","Workers managed"]] },
              { who:"Workers", color:T.amber, problem:"I've worked 10 years but nobody believes me. No proof. Always underpaid.", solution:"Portable verified work history. Your reputation travels with you. Proven workers earn 35-45% more.", stats:[["45%","Income increase"],["0","Cost to join"]] },
            ].map(function(s) {
              return (
                <div key={s.who} className="lift card-glow" style={card(32, { borderTop:"3px solid "+s.color, cursor:"default" })}>
                  <div style={Object.assign(row("center","space-between"), { marginBottom:16 })}>
                    <div style={{ fontSize:14, fontWeight:700, color:s.color }}>{s.who}</div>
                  </div>
                  <p style={{ fontSize:15.5, color:T.ink, lineHeight:1.6, fontStyle:"italic", marginBottom:18, fontWeight:500 }}>"{s.problem}"</p>
                  <div style={{ height:1, background:"#F0F4F9", marginBottom:16 }} />
                  <p style={{ fontSize:13.5, color:T.body, lineHeight:1.7, marginBottom:20 }}><span style={{ color:s.color, fontWeight:700 }}>Our answer: </span>{s.solution}</p>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                    {s.stats.map(function(st) {
                      return (
                        <div key={st[1]} style={{ background:s.color+"0C", borderRadius:10, padding:"10px 14px" }}>
                          <div className="font-display" style={{ fontSize:22, fontWeight:800, color:s.color }}>{st[0]}</div>
                          <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>{st[1]}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="sec-pad" style={{ padding:"90px 32px", background:T.offwhite }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={Object.assign(row("flex-end","space-between"), { marginBottom:52 })}>
            <div>
              <Chip label="BROWSE WORKERS" color={T.teal} size={11} />
              <h2 className="font-display h2-big" style={{ fontSize:38, fontWeight:800, color:T.ink, letterSpacing:"-1.2px", marginTop:14 }}>Every skill. Every city.</h2>
            </div>
            <BtnGhost onClick={function(){ setPage("search"); }}>View all workers</BtnGhost>
          </div>
          <div className="grid-4" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
            {CATS.map(function(c) {
              return (
                <div key={c.label} className="lift card-glow" onClick={function(){ setPage("search"); }}
                  style={card(24, { cursor:"pointer", textAlign:"center", borderBottom:"3px solid "+c.color })}>
                  <div style={{ width:56, height:56, borderRadius:14, background:c.color+"18", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, margin:"0 auto 14px" }}>{c.icon}</div>
                  <div className="font-display" style={{ fontSize:15, fontWeight:800, color:T.ink, marginBottom:3 }}>{c.label}</div>
                  <div style={{ fontSize:13, color:c.color, fontWeight:700 }}>{c.n}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mesh-bg dot-bg sec-pad" style={{ padding:"96px 32px", overflow:"hidden" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:64 }}>
            <Chip label="HOW IT WORKS" color={T.teal} size={11} />
            <h2 className="font-display h2-big" style={{ fontSize:40, fontWeight:800, color:"#fff", letterSpacing:"-1.2px", marginTop:16 }}>Trust built in three steps.</h2>
          </div>
          <div className="grid-3" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
            {[
              { n:"01", title:"Register and Verify", desc:"Mobile number + Aadhaar. We run background and police checks. Takes 24-48 hours.", color:T.teal },
              { n:"02", title:"Search and Match", desc:"Filter by city, skill, rating, availability. AI-matched recommendations. Instant contact.", color:T.violet },
              { n:"03", title:"Rate and Build", desc:"After every job, verified ratings compound into a portable Trust Score. It grows forever.", color:T.amber },
            ].map(function(s) {
              return (
                <div key={s.n} className="lift" style={{ background:"rgba(255,255,255,0.06)", backdropFilter:"blur(16px)", border:"1px solid "+s.color+"22", borderRadius:T.rM, padding:32 }}>
                  <div className="font-display" style={{ fontSize:40, fontWeight:800, color:s.color+"30", marginBottom:8, lineHeight:1 }}>{s.n}</div>
                  <div className="font-display" style={{ fontSize:19, fontWeight:800, color:"#fff", marginBottom:10 }}>{s.title}</div>
                  <p style={{ fontSize:14, color:"rgba(255,255,255,0.5)", lineHeight:1.75 }}>{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="sec-pad" style={{ padding:"90px 32px", background:T.offwhite }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <Chip label="REAL STORIES" color={T.violet} size={11} />
            <h2 className="font-display h2-big" style={{ fontSize:40, fontWeight:800, color:T.ink, letterSpacing:"-1.2px", marginTop:16 }}>People trust it.</h2>
          </div>
          <div className="grid-3" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
            {[
              { q:"Hired Rekha in 20 minutes. The background check gave us immediate peace of mind. Worth every rupee.", name:"Priya Sharma", role:"Resident, Banjara Hills", avi:"PS", c:T.violet },
              { q:"I had 8 years of experience but no proof. Now employers see my verified history and I earn 40% more.", name:"Vijay Kumar", role:"Security Guard, Bengaluru", avi:"VK", c:T.amber },
              { q:"Managing 320 flats used to mean chaos. Shramik cut security incidents to zero in 3 months.", name:"Ramesh Iyer", role:"Secretary, Prestige Complex", avi:"RI", c:T.teal },
            ].map(function(t) {
              return (
                <div key={t.name} className="lift card-glow" style={card(30, { borderLeft:"4px solid "+t.c })}>
                  <Stars n={5} size={15} />
                  <p style={{ fontSize:15, color:T.body, lineHeight:1.75, margin:"14px 0 22px", fontStyle:"italic", fontWeight:500 }}>"{t.q}"</p>
                  <div style={row("center","flex-start",12)}>
                    <Avi text={t.avi} bg={t.c} size={40} r={10} />
                    <div>
                      <div style={{ fontSize:14, fontWeight:700, color:T.ink }}>{t.name}</div>
                      <div style={{ fontSize:12, color:T.muted }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA GRID */}
      <section className="sec-pad" style={{ padding:"90px 32px", background:T.base }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <h2 className="font-display h2-big" style={{ fontSize:40, fontWeight:800, color:"#fff", letterSpacing:"-1.2px" }}>Who are you?</h2>
            <p style={{ fontSize:16, color:"rgba(255,255,255,0.45)", marginTop:10 }}>Built for everyone in the ecosystem.</p>
          </div>
          <div className="grid-4" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
            {[
              { icon:"H", title:"Family", sub:"Find verified help for your home. Background-checked, rated, ready.", cta:"Find Help", color:T.teal, page:"search" },
              { icon:"S", title:"Society / RWA", sub:"Gate management. Worker registry. Monthly audit. All in one hub.", cta:"Set Up Hub", color:T.violet, page:"for-societies" },
              { icon:"W", title:"Worker", sub:"Build your digital work history. Get found faster. Earn 45% more.", cta:"Join Free", color:T.amber, page:"for-workers" },
              { icon:"E", title:"Enterprise", sub:"Bulk verified hiring for hotels, construction, and facilities.", cta:"Talk to Sales", color:"#7C3AED", page:"enterprise" },
            ].map(function(c) {
              return (
                <div key={c.title} className="lift" onClick={function(){ setPage(c.page); }}
                  style={{ background:"rgba(255,255,255,0.06)", border:"1px solid "+c.color+"20", borderRadius:T.rM, padding:28, cursor:"pointer", textAlign:"center" }}>
                  <div style={{ width:56, height:56, borderRadius:14, background:c.color+"18", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, fontWeight:800, color:c.color, margin:"0 auto 14px", fontFamily:"'Syne',system-ui" }}>{c.icon}</div>
                  <div className="font-display" style={{ fontSize:16, fontWeight:800, color:"#fff", marginBottom:8 }}>{c.title}</div>
                  <p style={{ fontSize:13, color:"rgba(255,255,255,0.45)", lineHeight:1.65, marginBottom:20 }}>{c.sub}</p>
                  <div style={{ background:c.color+"18", border:"1px solid "+c.color+"35", borderRadius:T.r, padding:"9px 16px", fontSize:13, fontWeight:700, color:c.color }}>{c.cta}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background:"#020408", padding:"60px 32px 28px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div className="footer-grid" style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr", gap:40, marginBottom:48 }}>
            <div>
              <div className="font-display" style={{ fontSize:22, fontWeight:800, color:"#fff", marginBottom:14 }}>Shramik<span style={{ color:T.teal }}>.</span></div>
              <p style={{ fontSize:13.5, color:"rgba(255,255,255,0.3)", lineHeight:1.8, maxWidth:240 }}>India's trusted worker identity platform. Giving 500M informal workers their professional voice.</p>
            </div>
            {[["Product",["Find Workers","For Societies","For Workers","Pricing","Enterprise"]],["Company",["About Us","Blog","Careers","Press"]],["Support",["Help Center","Contact","Safety"]],["Legal",["Privacy","Terms","Data Policy"]]].map(function(section) {
              return (
                <div key={section[0]}>
                  <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.3)", letterSpacing:1.5, marginBottom:16, textTransform:"uppercase" }}>{section[0]}</div>
                  {section[1].map(function(item) {
                    return <div key={item} style={{ fontSize:13.5, color:"rgba(255,255,255,0.45)", marginBottom:10, cursor:"pointer" }}>{item}</div>;
                  })}
                </div>
              );
            })}
          </div>
          <div style={Object.assign(row("center","space-between"), { borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:24 })}>
            <span style={{ fontSize:12.5, color:"rgba(255,255,255,0.25)" }}>2025 Shramik Technologies Pvt. Ltd.</span>
            <div style={row("center","flex-end",12)}>
              <Chip label="ISO 27001" color={T.teal} size={10} />
              <Chip label="DPDP Compliant" color={T.violet} size={10} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- SEARCH --------------------------------------------------
function Search(props) {
  var setPage=props.setPage, setViewId=props.setViewId;
  var qState=useState(""), fRoleState=useState("All"), fCityState=useState("All"), sortState=useState("rating"), viewState=useState("grid");
  var query=qState[0],setQuery=qState[1], fRole=fRoleState[0],setFRole=fRoleState[1];
  var fCity=fCityState[0],setFCity=fCityState[1], sortBy=sortState[0],setSort=sortState[1];
  var view=viewState[0],setView=viewState[1];

  var roles = ["All"].concat(WORKERS.map(function(w){ return w.role; }).filter(function(v,i,a){ return a.indexOf(v)===i; }));
  var cities = ["All"].concat(WORKERS.map(function(w){ return w.city; }).filter(function(v,i,a){ return a.indexOf(v)===i; }));

  var filtered = WORKERS.filter(function(w) {
    var q = query.toLowerCase();
    return (fRole==="All" || w.role===fRole) && (fCity==="All" || w.city===fCity) && (!q || w.name.toLowerCase().includes(q) || w.role.toLowerCase().includes(q) || w.skills.some(function(s){ return s.toLowerCase().includes(q); }));
  }).sort(function(a,b){ return sortBy==="rating" ? b.score-a.score : b.exp-a.exp; });

  return (
    <div style={{ background:T.offwhite, minHeight:"100vh" }}>
      <div style={{ background:T.white, borderBottom:"1px solid #E8EDF4", padding:"26px 32px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <h1 className="font-display" style={{ fontSize:26, fontWeight:800, color:T.ink, marginBottom:18 }}>Find Verified Workers</h1>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap", alignItems:"center" }}>
            <input value={query} onChange={function(e){ setQuery(e.target.value); }} placeholder="Search name, skill or role..." style={Object.assign({}, inp, { flex:1, minWidth:200, height:44, borderRadius:T.r })} />
            <select value={fRole} onChange={function(e){ setFRole(e.target.value); }} style={Object.assign({}, inp, { width:160, height:44 })}>
              {roles.map(function(r){ return <option key={r}>{r}</option>; })}
            </select>
            <select value={fCity} onChange={function(e){ setFCity(e.target.value); }} style={Object.assign({}, inp, { width:140, height:44 })}>
              {cities.map(function(c){ return <option key={c}>{c}</option>; })}
            </select>
            <select value={sortBy} onChange={function(e){ setSort(e.target.value); }} style={Object.assign({}, inp, { width:160, height:44 })}>
              <option value="rating">Highest Rated</option>
              <option value="exp">Most Experienced</option>
            </select>
            <div style={row("center","flex-end",6)}>
              {["grid","list"].map(function(v) {
                return <button key={v} onClick={function(){ setView(v); }} style={{ width:40, height:44, border:"1.5px solid "+(view===v?T.teal:"#E2E8F0"), background:view===v?"rgba(0,229,195,0.06)":T.white, borderRadius:T.r, cursor:"pointer", fontSize:16, color:view===v?T.tealM:T.dim }}>{v==="grid"?"#":"="}</button>;
              })}
            </div>
          </div>
          <div style={{ marginTop:10, fontSize:13, color:T.muted }}><strong style={{ color:T.ink }}>{filtered.length}</strong> verified workers</div>
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"28px 32px" }}>
        {view==="grid" ? (
          <div className="grid-3" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:18 }}>
            {filtered.map(function(w) {
              return (
                <div key={w.id} className="lift card-glow" style={card(24, { cursor:"pointer" })} onClick={function(){ setViewId(w.id); setPage("worker-view"); }}>
                  <div style={Object.assign(row("center","space-between"), { marginBottom:14 })}>
                    <Avi text={w.avi} bg={w.color} size={48} r={12} ring={w.verified} />
                    <Score n={w.score} count={w.reviews} />
                  </div>
                  <div className="font-display" style={{ fontSize:16, fontWeight:800, color:T.ink }}>{w.name}</div>
                  <div style={{ fontSize:13, color:T.muted, marginBottom:10 }}>{w.role} - {w.area}, {w.city}</div>
                  <div style={Object.assign(row("center","flex-start",6), { flexWrap:"wrap" })}>
                    {w.skills.slice(0,3).map(function(s){ return <Chip key={s} label={s} color={T.tealM} size={10} />; })}
                  </div>
                  <div style={{ height:1, background:"#F0F4F9", margin:"14px 0" }} />
                  <div style={row("center","space-between")}>
                    <span style={{ fontSize:13, color:T.muted }}>{w.exp} yrs - Rs.{w.salary}</span>
                    <Chip label={w.avail} color={w.avail==="Available"?T.green:T.amber} size={10} dot={true} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={col(12)}>
            {filtered.map(function(w) {
              return (
                <div key={w.id} className="lift" style={Object.assign(card(20), row("center","space-between"), { cursor:"pointer" })} onClick={function(){ setViewId(w.id); setPage("worker-view"); }}>
                  <div style={row("center","flex-start",16)}>
                    <Avi text={w.avi} bg={w.color} size={52} r={12} ring={w.verified} />
                    <div>
                      <div style={row("center","flex-start",10)}>
                        <div className="font-display" style={{ fontSize:15, fontWeight:800, color:T.ink }}>{w.name}</div>
                        <TrustLevel score={w.score} />
                      </div>
                      <div style={{ fontSize:13, color:T.muted, marginTop:3 }}>{w.role} - {w.area}, {w.city} - {w.exp} yrs</div>
                      <div style={Object.assign(row("center","flex-start",6), { marginTop:7, flexWrap:"wrap" })}>
                        {w.skills.slice(0,4).map(function(s){ return <Chip key={s} label={s} color={T.tealM} size={10} />; })}
                      </div>
                    </div>
                  </div>
                  <div style={Object.assign(col(8), { textAlign:"right" })}>
                    <Score n={w.score} count={w.reviews} />
                    <div className="font-display" style={{ fontSize:15, fontWeight:800, color:T.ink }}>Rs.{w.salary}</div>
                    <Chip label={w.avail} color={w.avail==="Available"?T.green:T.amber} size={10} dot={true} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// --- WORKER PROFILE ------------------------------------------
function WorkerView(props) {
  var wId=props.wId, setPage=props.setPage;
  var w = WORKERS.filter(function(x){ return x.id===wId; })[0] || WORKERS[0];
  var hireState=useState(false), ratedState=useState(0);
  var hire=hireState[0],setHire=hireState[1];
  var rated=ratedState[0],setRated=ratedState[1];

  return (
    <div style={{ background:T.offwhite }}>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"32px 32px" }}>
        <button onClick={function(){ setPage("search"); }} style={{ background:"none", border:"none", fontSize:14, color:T.tealM, cursor:"pointer", fontFamily:"'Plus Jakarta Sans',system-ui", marginBottom:24 }}>Back to Search</button>
        <div className="grid-profile" style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:22 }}>
          <div style={col(18)}>
            <div style={card(32)}>
              <div style={row("flex-start","space-between")}>
                <div style={row("flex-start","flex-start",20)}>
                  <Avi text={w.avi} bg={w.color} size={80} r={18} ring={w.verified} />
                  <div>
                    <h1 className="font-display" style={{ fontSize:28, fontWeight:800, color:T.ink, marginBottom:4 }}>{w.name}</h1>
                    <div style={{ fontSize:15, color:T.muted, marginBottom:10 }}>{w.role} - {w.area}, {w.city}</div>
                    <div style={row("center","flex-start",8)}>
                      {w.badges.map(function(b){ return <Chip key={b} label={b} color={T.tealM} />; })}
                    </div>
                  </div>
                </div>
                <div style={col(8)}>
                  <Score n={w.score} count={w.reviews} />
                  <TrustLevel score={w.score} />
                  <Chip label={w.avail} color={w.avail==="Available"?T.green:T.amber} dot={true} />
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginTop:24 }}>
                {[["Experience",w.exp+" yrs"],["Since",w.since],["Salary","Rs."+w.salary],["Completion",w.completePct+"%"]].map(function(item) {
                  return (
                    <div key={item[0]} style={{ background:T.subtle, borderRadius:T.rM, padding:"12px 14px" }}>
                      <div style={{ fontSize:11, color:T.muted, marginBottom:3 }}>{item[0]}</div>
                      <div className="font-display" style={{ fontSize:17, fontWeight:800, color:T.ink }}>{item[1]}</div>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop:20, background:T.subtle, borderRadius:T.rM, padding:16 }}>
                <div style={{ fontSize:13, fontWeight:600, color:T.ink, marginBottom:6 }}>About</div>
                <p style={{ fontSize:14, color:T.body, lineHeight:1.75 }}>{w.bio}</p>
              </div>
            </div>

            <div style={card(24)}>
              <div className="font-display" style={{ fontSize:15, fontWeight:800, color:T.ink, marginBottom:14 }}>Skills and Languages</div>
              <div style={Object.assign(row("center","flex-start",8), { flexWrap:"wrap", marginBottom:12 })}>
                {w.skills.map(function(s){ return <Chip key={s} label={s} color={T.tealM} />; })}
              </div>
              <div style={{ fontSize:13, color:T.muted }}>Languages: {w.lang.join(", ")}</div>
            </div>

            <div style={card(24)}>
              <div className="font-display" style={{ fontSize:15, fontWeight:800, color:T.ink, marginBottom:18 }}>Verified Work History</div>
              {w.jobs.map(function(j, i) {
                return (
                  <div key={i} style={{ borderLeft:"3px solid "+T.tealM, paddingLeft:20, marginBottom:24 }}>
                    <div style={Object.assign(row("center","space-between"), { marginBottom:6 })}>
                      <div className="font-display" style={{ fontSize:14, fontWeight:800, color:T.ink }}>{j.emp}</div>
                      {j.verified && <Chip label="Employer Verified" color={T.teal} size={10} />}
                    </div>
                    <div style={{ fontSize:13, color:T.muted, marginBottom:8 }}>{j.role} - {j.dur}</div>
                    <Stars n={j.rating} size={13} />
                    <p style={{ fontSize:13.5, color:T.body, fontStyle:"italic", marginTop:8, lineHeight:1.65 }}>"{j.review}"</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="sidebar-sticky" style={{ position:"sticky", top:80 }}>
            <div style={card(24)}>
              <BtnTeal onClick={function(){ setHire(true); }} full={true} style={{ padding:"14px", fontSize:15 }}>Hire {w.name.split(" ")[0]}</BtnTeal>
              <div style={{ height:1, background:"#F0F4F9", margin:"18px 0" }} />
              <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:12 }}>Quick Info</div>
              {[["Location",w.area+", "+w.city],["Pay","Rs."+w.salary],["Status",w.avail],["Since",w.since]].map(function(item) {
                return (
                  <div key={item[0]} style={Object.assign(row("flex-start","space-between"), { padding:"9px 0", borderBottom:"1px solid #F0F4F9" })}>
                    <span style={{ fontSize:12, color:T.muted }}>{item[0]}</span>
                    <span style={{ fontSize:12.5, fontWeight:600, color:T.ink, textAlign:"right", maxWidth:140 }}>{item[1]}</span>
                  </div>
                );
              })}
              <div style={{ height:1, background:"#F0F4F9", margin:"18px 0" }} />
              <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:12 }}>Rate this worker</div>
              <Stars n={rated} size={28} interactive={true} onChange={setRated} />
            </div>
          </div>
        </div>
      </div>

      {hire && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }} onClick={function(){ setHire(false); }}>
          <div style={card(32, { maxWidth:440, width:"100%" })} onClick={function(e){ e.stopPropagation(); }}>
            <div className="font-display" style={{ fontSize:20, fontWeight:800, color:T.ink, marginBottom:6 }}>Hire {w.name}</div>
            <p style={{ fontSize:14, color:T.muted, marginBottom:22 }}>Direct hire. No commission. No middleman.</p>
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:12.5, fontWeight:600, color:T.ink, marginBottom:6 }}>Start Date</div>
              <input type="date" style={Object.assign({}, inp, { borderRadius:T.r, height:44 })} />
            </div>
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:12.5, fontWeight:600, color:T.ink, marginBottom:6 }}>Duration</div>
              <select style={Object.assign({}, inp, { borderRadius:T.r, height:44 })}>
                <option>Part-time (4 hrs/day)</option>
                <option>Full-time (8 hrs/day)</option>
                <option>Live-in</option>
                <option>One-time job</option>
              </select>
            </div>
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:12.5, fontWeight:600, color:T.ink, marginBottom:6 }}>Message</div>
              <textarea rows={3} placeholder="Tell the worker about the job..." style={Object.assign({}, inp, { resize:"none", borderRadius:T.r })} />
            </div>
            <BtnTeal onClick={function(){ setHire(false); }} full={true} style={{ padding:"13px", marginTop:8 }}>Send Request</BtnTeal>
            <BtnGhost onClick={function(){ setHire(false); }} full={true} style={{ marginTop:10, padding:"11px" }}>Cancel</BtnGhost>
          </div>
        </div>
      )}
    </div>
  );
}

// --- PRICING -------------------------------------------------
function Pricing(props) {
  var setPage=props.setPage;
  var cycleState=useState("monthly"), tabState=useState("societies");
  var cycle=cycleState[0],setCycle=cycleState[1];
  var tab=tabState[0],setTab=tabState[1];

  var sPlans = [
    { name:"Free", monthly:0, annual:0, color:T.tealM, ghost:true, sub:"Forever free", features:["50 worker profiles","Basic entry log","Resident app","Email support"], cta:"Start free" },
    { name:"Pro", monthly:2999, annual:1999, color:T.violet, popular:true, sub:"For active societies", features:["Unlimited profiles","QR gate management","Real-time alerts","Monthly audit PDF","WhatsApp integration","Priority support","Custom branding"], cta:"Start 30-day trial" },
    { name:"Estate", monthly:7999, annual:4999, color:"#7C3AED", sub:"Multi-complex RWAs", features:["Everything in Pro","Multi-tower support","API access","Dedicated account manager","99.9% SLA"], cta:"Contact sales" },
  ];
  var wPlans = [
    { name:"Basic", monthly:0, annual:0, color:T.tealM, ghost:true, sub:"Free forever", features:["Verified profile","WhatsApp share","Unlimited ratings","QR Trust Card","Job search"], cta:"Create free profile" },
    { name:"Pro", monthly:149, annual:99, color:T.amber, popular:true, sub:"For serious workers", features:["Everything in Basic","Priority placement","Employment letter PDF","Income proof for banks","Weekly job alerts","Premium badge","Chat support"], cta:"Go Pro for Rs.149/mo" },
    { name:"Worker+", monthly:299, annual:199, color:T.red, sub:"Full financial access", features:["Everything in Pro","Salary advance Rs.25K","Accident insurance Rs.1L","Free health check","Training certifications","Featured slot"], cta:"Get all benefits" },
  ];
  var plans = tab==="societies" ? sPlans : wPlans;

  return (
    <div style={{ background:T.white }}>
      <section style={{ padding:"80px 32px 60px", background:"radial-gradient(ellipse 80% 60% at 50% 0%,rgba(139,92,246,0.06) 0%,transparent 70%)" }}>
        <div style={{ maxWidth:860, margin:"0 auto", textAlign:"center" }}>
          <Chip label="PRICING" color={T.violet} size={11} />
          <h1 className="font-display h1-big" style={{ fontSize:50, fontWeight:800, color:T.ink, letterSpacing:"-1.8px", margin:"18px 0 14px" }}>Simple, honest pricing.</h1>
          <p style={{ fontSize:16, color:T.muted, marginBottom:40 }}>No hidden fees. No contracts. Cancel anytime.</p>
          <div style={{ display:"inline-flex", background:T.subtle, border:"1px solid #E2E8F0", borderRadius:T.rM, padding:4, marginBottom:32 }}>
            {[["societies","For Societies"],["workers","For Workers"]].map(function(item) {
              return (
                <button key={item[0]} onClick={function(){ setTab(item[0]); }}
                  style={{ padding:"10px 28px", borderRadius:11, border:"none", cursor:"pointer", background:tab===item[0]?T.white:"transparent", boxShadow:tab===item[0]?T.s1:"none", fontSize:14, fontWeight:tab===item[0]?700:500, color:tab===item[0]?T.ink:T.muted, fontFamily:"'Plus Jakarta Sans',system-ui", transition:"all 0.2s" }}>
                  {item[1]}
                </button>
              );
            })}
          </div>
          <div style={row("center","center",12)}>
            <span style={{ fontSize:14, color:cycle==="monthly"?T.ink:T.muted, fontWeight:cycle==="monthly"?600:400 }}>Monthly</span>
            <div onClick={function(){ setCycle(function(c){ return c==="monthly"?"annual":"monthly"; }); }}
              style={{ width:44, height:24, background:cycle==="annual"?T.teal:"#CBD5E1", borderRadius:12, position:"relative", cursor:"pointer", transition:"background 0.2s" }}>
              <div style={{ width:18, height:18, background:"#fff", borderRadius:"50%", position:"absolute", top:3, left:cycle==="annual"?23:3, transition:"left 0.2s", boxShadow:"0 1px 4px rgba(0,0,0,0.18)" }} />
            </div>
            <span style={{ fontSize:14, color:cycle==="annual"?T.ink:T.muted, fontWeight:cycle==="annual"?600:400 }}>Annual</span>
            {cycle==="annual" && <Chip label="Save 33%" color={T.teal} size={11} />}
          </div>
        </div>
      </section>
      <section style={{ padding:"40px 32px 80px" }}>
        <div style={{ maxWidth:1000, margin:"0 auto" }}>
          <div className="grid-plan" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:22, alignItems:"start" }}>
            {plans.map(function(p) {
              var price = cycle==="monthly" ? p.monthly : p.annual;
              return (
                <div key={p.name} className="lift" style={card(32, { border:p.popular?"2px solid "+p.color:"1px solid #E8EDF4", position:"relative" })}>
                  {p.popular && <div style={{ position:"absolute", top:-13, left:"50%", transform:"translateX(-50%)", background:p.color, color:"#fff", borderRadius:T.rX, padding:"5px 16px", fontSize:11, fontWeight:700, whiteSpace:"nowrap" }}>MOST POPULAR</div>}
                  <div style={{ fontSize:16, fontWeight:700, color:T.ink, marginBottom:3 }}>{p.name}</div>
                  <div style={{ fontSize:13, color:T.muted, marginBottom:14 }}>{p.sub}</div>
                  <div style={{ fontSize:40, fontWeight:800, color:p.color, fontFamily:"'Syne',system-ui", lineHeight:1, marginBottom:4 }}>{price===0?"Rs.0":"Rs."+price.toLocaleString()}</div>
                  <div style={{ height:1, background:"#F0F4F9", margin:"18px 0" }} />
                  {p.features.map(function(f) {
                    return (
                      <div key={f} style={Object.assign(row("flex-start","flex-start",9), { marginBottom:10 })}>
                        <span style={{ color:p.color, fontSize:14, flexShrink:0, marginTop:1 }}>+</span>
                        <span style={{ fontSize:13.5, color:T.body }}>{f}</span>
                      </div>
                    );
                  })}
                  <div style={{ marginTop:22 }}>
                    {p.ghost ? <BtnGhost onClick={function(){ setPage("auth"); }} full={true}>{p.cta}</BtnGhost>
                      : p.color===T.violet||p.color==="#7C3AED" ? <BtnViolet onClick={function(){ setPage("auth"); }} full={true}>{p.cta}</BtnViolet>
                      : p.color===T.amber ? <BtnAmber onClick={function(){ setPage("auth"); }} full={true}>{p.cta}</BtnAmber>
                      : <BtnTeal onClick={function(){ setPage("auth"); }} full={true}>{p.cta}</BtnTeal>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

// --- FOR SOCIETIES -------------------------------------------
function ForSocieties(props) {
  var setPage=props.setPage, setUser=props.setUser;
  return (
    <div>
      <section style={{ padding:"88px 32px", background:"radial-gradient(ellipse 70% 60% at 30% 50%,rgba(139,92,246,0.08) 0%,transparent 60%),"+T.white, borderBottom:"1px solid #E8EDF4" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div className="grid-hero" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:72, alignItems:"center" }}>
            <div>
              <Chip label="FOR SOCIETIES AND RWAS" color={T.violet} size={11} />
              <h1 className="font-display h1-big grad-violet" style={{ fontSize:52, fontWeight:800, color:T.ink, letterSpacing:"-1.8px", lineHeight:1.08, margin:"20px 0 18px" }}>Your society's<br /><span>security backbone.</span></h1>
              <p style={{ fontSize:16, color:T.muted, lineHeight:1.8, marginBottom:36, maxWidth:460 }}>Stop relying on WhatsApp forwards. Give every resident peace of mind with a fully managed, verified worker network.</p>
              <div style={row("center","flex-start",14)}>
                <BtnViolet onClick={function(){ setUser({ name:"Prestige Society", type:"society", id:99 }); setPage("society-dashboard"); }} style={{ padding:"14px 28px" }}>Set Up Society Hub</BtnViolet>
                <BtnGhost onClick={function(){}} >View live demo</BtnGhost>
              </div>
            </div>
            <div className="lift" style={card(26, { border:"1px solid "+T.violet+"25", boxShadow:"0 0 40px "+T.violetGlow })}>
              <div style={Object.assign(row("center","space-between"), { marginBottom:20 })}>
                <div className="font-display" style={{ fontSize:14, fontWeight:700, color:T.ink }}>Prestige Lakeside - Bengaluru</div>
                <Chip label="LIVE" color={T.green} dot={true} size={11} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:18 }}>
                {[["320","Flats",T.violet],["72","Workers",T.teal],["14","Today Entries",T.amber],["0","Unverified",T.green]].map(function(item) {
                  return (
                    <div key={item[1]} style={{ background:T.subtle, borderRadius:T.rM, padding:"14px 16px" }}>
                      <div className="font-display" style={{ fontSize:26, fontWeight:800, color:item[2], lineHeight:1 }}>{item[0]}</div>
                      <div style={{ fontSize:12, color:T.muted, marginTop:4 }}>{item[1]}</div>
                    </div>
                  );
                })}
              </div>
              {["Rekha Devi - Flat 402 - 07:34 AM","Rajan Kumar - Flat 118 - 08:12 AM","Suresh Nair - Gate - 08:15 AM"].map(function(e) {
                return <div key={e} style={Object.assign(row("center","space-between"), { padding:"9px 12px", background:T.greenBg, border:"1px solid #A7F3D0", borderRadius:9, marginBottom:8, fontSize:12.5, color:T.green, fontWeight:600 })}>{e} OK</div>;
              })}
            </div>
          </div>
        </div>
      </section>
      <section className="sec-pad" style={{ padding:"72px 32px", background:T.offwhite }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <h2 className="font-display h2-big" style={{ fontSize:36, fontWeight:800, color:T.ink, textAlign:"center", marginBottom:48 }}>Built for how societies actually work.</h2>
          <div className="grid-3" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
            {[["Registry","Every worker verified and organized. Filter by skill, status, flat access."],["QR Gate","Guards scan QR codes. Full profile loads instantly. No unknowns."],["Alerts","Flagged worker tries entry? Residents and committee notified instantly."],["Feedback","Residents rate workers. Issues auto-escalated."],["Reports","Full entry log - who, when, which flat - as PDF."],["WhatsApp","Workers share Shramik QR. Verification takes 2 seconds."]].map(function(f) {
              return (
                <div key={f[0]} className="lift card-glow" style={card(26)}>
                  <div className="font-display" style={{ fontSize:16, fontWeight:800, color:T.ink, marginBottom:8 }}>{f[0]}</div>
                  <div style={{ fontSize:13.5, color:T.muted, lineHeight:1.65 }}>{f[1]}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

// --- FOR WORKERS ---------------------------------------------
function ForWorkers(props) {
  var setPage=props.setPage;
  return (
    <div>
      <section style={{ padding:"88px 32px", background:"radial-gradient(ellipse 70% 60% at 80% 50%,rgba(245,158,11,0.07) 0%,transparent 60%),"+T.white, borderBottom:"1px solid #E8EDF4" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div className="grid-hero" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:72, alignItems:"center" }}>
            <div>
              <Chip label="FOR MAIDS COOKS PLUMBERS GUARDS DRIVERS" color={T.amber} size={11} />
              <h1 className="font-display h1-big grad-amber" style={{ fontSize:52, fontWeight:800, color:T.ink, letterSpacing:"-1.8px", lineHeight:1.08, margin:"20px 0 18px" }}>Your hard work,<br /><span>finally on record.</span></h1>
              <p style={{ fontSize:16, color:T.muted, lineHeight:1.8, marginBottom:36, maxWidth:450 }}>You have worked for years. Now let your reputation work for you. A verified profile gets you hired faster and paid 35-45% more.</p>
              <BtnAmber onClick={function(){ setPage("auth"); }} style={{ padding:"14px 28px", fontSize:15 }}>Create free profile</BtnAmber>
            </div>
            <div className="lift" style={card(26, { maxWidth:340, boxShadow:T.s3 })}>
              <div style={Object.assign(row("flex-start","space-between"), { marginBottom:18 })}>
                <div style={row("flex-start","flex-start",14)}>
                  <Avi text="RD" bg={T.tealM} size={54} r={13} ring={true} />
                  <div>
                    <div className="font-display" style={{ fontSize:16, fontWeight:800, color:T.ink }}>Rekha Devi</div>
                    <div style={{ fontSize:12, color:T.muted }}>Domestic Helper</div>
                    <div style={{ marginTop:5 }}><Chip label="Verified" color={T.teal} size={11} /></div>
                  </div>
                </div>
                <Score n={4.8} count={34} />
              </div>
              <div style={{ background:T.amberBg||"rgba(245,158,11,0.08)", border:"1px solid "+T.amber+"22", borderRadius:T.r, padding:"12px 14px", marginBottom:14 }}>
                <div style={Object.assign(row("center","space-between"), { marginBottom:7 })}>
                  <span style={{ fontSize:12, fontWeight:700, color:T.amber }}>Trust Score</span>
                  <span style={{ fontSize:13, fontWeight:800, color:T.amber }}>96 / 100</span>
                </div>
                <div style={{ height:7, background:T.amber+"20", borderRadius:4, overflow:"hidden" }}>
                  <div style={{ width:"96%", height:"100%", background:"linear-gradient(90deg,"+T.amber+",#FBBF24)", borderRadius:4 }} />
                </div>
              </div>
              <div style={Object.assign(row("center","space-between"), { padding:"11px 14px", background:T.greenBg, border:"1px solid #A7F3D0", borderRadius:T.r })}>
                <div>
                  <div style={{ fontSize:11, color:T.muted }}>Monthly Earnings</div>
                  <div className="font-display" style={{ fontSize:22, fontWeight:800, color:T.green }}>Rs.14,000</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:11, color:T.muted }}>vs. before profile</div>
                  <div style={{ fontSize:15, fontWeight:700, color:T.tealM }}>+42% more</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="sec-pad" style={{ padding:"72px 32px", background:T.offwhite }}>
        <div style={{ maxWidth:960, margin:"0 auto" }}>
          <h2 className="font-display h2-big" style={{ fontSize:36, fontWeight:800, color:T.ink, textAlign:"center", marginBottom:48 }}>4 steps. Free forever.</h2>
          <div className="grid-4" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:18 }}>
            {[["01","Register","Mobile number only. 2 minutes."],["02","Verify","Aadhaar linked. Verified badge earned."],["03","Work","Employers find you. Show QR."],["04","Grow","Ratings compound. Earn more."]].map(function(s) {
              return (
                <div key={s[0]} className="lift card-glow" style={card(24, { textAlign:"center", borderTop:"3px solid "+T.amber })}>
                  <div className="font-display" style={{ fontSize:30, fontWeight:800, color:T.amber+"30", marginBottom:4 }}>{s[0]}</div>
                  <div className="font-display" style={{ fontSize:15, fontWeight:800, color:T.ink, marginBottom:6 }}>{s[1]}</div>
                  <div style={{ fontSize:12.5, color:T.muted, lineHeight:1.6 }}>{s[2]}</div>
                </div>
              );
            })}
          </div>
          <div style={{ textAlign:"center", marginTop:44 }}>
            <BtnAmber onClick={function(){ setPage("auth"); }} style={{ padding:"15px 36px", fontSize:16 }}>Create my free profile</BtnAmber>
          </div>
        </div>
      </section>
    </div>
  );
}

// --- ENTERPRISE ----------------------------------------------
function Enterprise(props) {
  var setPage=props.setPage;
  return (
    <div>
      <section className="mesh-bg dot-bg" style={{ padding:"88px 32px 96px", overflow:"hidden" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div className="grid-hero" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:72, alignItems:"center" }}>
            <div>
              <Chip label="ENTERPRISE AND CORPORATE" color={T.violetL} size={11} />
              <h1 className="font-display h1-big grad-violet" style={{ fontSize:52, fontWeight:800, color:"#fff", letterSpacing:"-1.8px", lineHeight:1.08, margin:"20px 0 18px" }}>Verified talent,<br /><span>enterprise scale.</span></h1>
              <p style={{ fontSize:16, color:"rgba(255,255,255,0.55)", lineHeight:1.8, marginBottom:36, maxWidth:460 }}>Hotels, construction, hospitals, facility managers. Hire hundreds of verified blue-collar workers with full compliance documentation in 48 hours.</p>
              <div style={row("center","flex-start",14)}>
                <BtnViolet onClick={function(){ setPage("auth"); }} style={{ padding:"14px 28px" }}>Schedule Demo</BtnViolet>
                <BtnGhost dark={true} onClick={function(){}} style={{ padding:"14px 24px" }}>Download Brochure</BtnGhost>
              </div>
            </div>
            <div className="grid-2" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              {[["500+","Enterprise Clients"],["48 hr","Hire to Deploy"],["Rs.0","Middleman Fees"],["100%","Compliance Docs"]].map(function(item) {
                return (
                  <div key={item[1]} style={{ background:"rgba(255,255,255,0.06)", backdropFilter:"blur(12px)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:T.rM, padding:24, textAlign:"center" }}>
                    <div className="font-display" style={{ fontSize:32, fontWeight:800, color:T.violetL, lineHeight:1 }}>{item[0]}</div>
                    <div style={{ fontSize:13, color:"rgba(255,255,255,0.5)", marginTop:8 }}>{item[1]}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      <section className="sec-pad" style={{ padding:"80px 32px", background:T.white }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <h2 className="font-display h2-big" style={{ fontSize:36, fontWeight:800, color:T.ink, textAlign:"center", marginBottom:48 }}>Every blue-collar industry.</h2>
          <div className="grid-3" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
            {[["Hotels","Housekeeping, Kitchen Staff, Security, Concierge"],["Construction","Labourers, Masons, Plumbers, Electricians"],["Healthcare","Patient Attendants, Ward Boys, Cleaners"],["Manufacturing","Machine Operators, Line Workers, Supervisors"],["Retail","Security, Janitors, Delivery Staff, Store Help"],["Facility Mgmt","Housekeeping Teams, Plumbers, Electricians"]].map(function(u) {
              return (
                <div key={u[0]} className="lift card-glow" style={card(26)}>
                  <div className="font-display" style={{ fontSize:16, fontWeight:800, color:T.ink, marginBottom:8 }}>{u[0]}</div>
                  <div style={{ fontSize:13.5, color:T.muted, lineHeight:1.65 }}>{u[1]}</div>
                </div>
              );
            })}
          </div>
          <div style={{ textAlign:"center", marginTop:48 }}>
            <BtnViolet onClick={function(){ setPage("auth"); }} style={{ padding:"15px 36px", fontSize:16 }}>Get Enterprise Demo</BtnViolet>
          </div>
        </div>
      </section>
    </div>
  );
}

// --- AUTH ----------------------------------------------------
function Auth(props) {
  var setPage=props.setPage, setUser=props.setUser;
  var stepState=useState(1), roleState=useState(""), phoneState=useState(""), nameState=useState(""), loadState=useState(false);
  var step=stepState[0],setStep=stepState[1];
  var role=roleState[0],setRole=roleState[1];
  var phone=phoneState[0],setPhone=phoneState[1];
  var name=nameState[0],setName=nameState[1];
  var loading=loadState[0],setLoading=loadState[1];
  var otpState=useState(["","","","","",""]);
  var otp=otpState[0],setOtp=otpState[1];

  var roles = [
    { id:"employer", icon:"H", label:"Family / Employer", sub:"Hire verified home help", color:T.teal },
    { id:"society",  icon:"S", label:"Society / RWA",     sub:"Manage complex workers",  color:T.violet },
    { id:"worker",   icon:"W", label:"Worker",             sub:"Build my profile",        color:T.amber },
    { id:"admin",    icon:"A", label:"Admin",              sub:"Platform admin",          color:"#94A3B8" },
  ];

  function finish() {
    setLoading(true);
    setTimeout(function() {
      var names = { worker:name||"Rekha Devi", employer:name||"Sharma Family", society:name||"Prestige Society", admin:"Admin" };
      var types = { worker:"worker", employer:"employer", society:"society", admin:"admin" };
      var u = { name:names[role]||names.employer, type:types[role]||"employer" };
      setUser(u);
      var pages = { worker:"worker-dashboard", employer:"employer-dashboard", society:"society-dashboard", admin:"admin" };
      setPage(pages[role]||"employer-dashboard");
    }, 1400);
  }

  function updateOtp(i, val) {
    var next = otp.slice();
    next[i] = val;
    setOtp(next);
    if (val && i < 5) {
      var el = document.getElementById("otp-"+( i+1));
      if (el) el.focus();
    }
  }

  return (
    <div className="mesh-bg dot-bg" style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 20px" }}>
      <div style={{ width:"100%", maxWidth:480 }}>
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <div className="font-display" style={{ fontSize:26, fontWeight:800, color:"#fff" }}>Shramik<span style={{ color:T.teal }}>.</span></div>
          <div style={{ fontSize:14, color:"rgba(255,255,255,0.45)", marginTop:4 }}>Secure login - All roles</div>
        </div>

        <div style={row("center","center",0)}>
          {[1,2,3].map(function(s) {
            return (
              <div key={s} style={row("center","center",0)}>
                <div style={{ width:34, height:34, borderRadius:"50%", background:s<=step?T.teal:"rgba(255,255,255,0.06)", border:"2px solid "+(s<=step?T.teal:"rgba(255,255,255,0.12)"), display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:s<=step?T.base:"rgba(255,255,255,0.3)", transition:"all 0.3s" }}>
                  {s<step?"v":s}
                </div>
                {s<3 && <div style={{ width:48, height:2, background:s<step?T.teal:"rgba(255,255,255,0.08)", transition:"background 0.3s" }} />}
              </div>
            );
          })}
        </div>

        <div style={{ marginTop:32, background:"rgba(12,24,41,0.85)", backdropFilter:"blur(24px)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:T.rX, padding:36 }}>
          {step===1 && (
            <div>
              <h2 className="font-display" style={{ fontSize:22, fontWeight:800, color:"#fff", marginBottom:6 }}>Who are you?</h2>
              <p style={{ fontSize:14, color:"rgba(255,255,255,0.5)", marginBottom:24 }}>Choose your role to get started.</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:24 }}>
                {roles.map(function(r) {
                  return (
                    <div key={r.id} onClick={function(){ setRole(r.id); }}
                      style={{ padding:18, borderRadius:T.rM, border:"2px solid "+(role===r.id?r.color:"rgba(255,255,255,0.12)"), background:role===r.id?r.color+"18":"rgba(255,255,255,0.04)", cursor:"pointer", textAlign:"center", transition:"all 0.2s" }}>
                      <div style={{ width:40, height:40, borderRadius:10, background:r.color+"20", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:800, color:r.color, margin:"0 auto 8px", fontFamily:"'Syne',system-ui" }}>{r.icon}</div>
                      <div style={{ fontSize:13, fontWeight:700, color:role===r.id?r.color:"#fff" }}>{r.label}</div>
                      <div style={{ fontSize:11, color:"rgba(255,255,255,0.45)", marginTop:2 }}>{r.sub}</div>
                    </div>
                  );
                })}
              </div>
              <BtnTeal onClick={function(){ if(role) setStep(2); }} full={true} style={{ opacity:role?1:0.4, padding:"13px", fontSize:14.5 }}>Continue</BtnTeal>
            </div>
          )}

          {step===2 && (
            <div>
              <h2 className="font-display" style={{ fontSize:22, fontWeight:800, color:"#fff", marginBottom:6 }}>Enter mobile</h2>
              <p style={{ fontSize:14, color:"rgba(255,255,255,0.5)", marginBottom:24 }}>We'll send a verification code.</p>
              <div style={Object.assign(row("center","flex-start",0), { border:"1.5px solid rgba(255,255,255,0.15)", borderRadius:T.rM, overflow:"hidden", background:"rgba(255,255,255,0.06)", marginBottom:18 })}>
                <span style={{ padding:"0 16px", fontSize:14, color:"rgba(255,255,255,0.5)", borderRight:"1px solid rgba(255,255,255,0.12)", height:50, display:"flex", alignItems:"center" }}>+91</span>
                <input value={phone} onChange={function(e){ setPhone(e.target.value.replace(/\D/g,"").slice(0,10)); }}
                  placeholder="98765 43210" maxLength={10}
                  style={{ background:"transparent", border:"none", color:"#fff", flex:1, padding:"0 16px", height:50, fontSize:15, outline:"none", fontFamily:"'Plus Jakarta Sans',system-ui" }} />
              </div>
              <BtnTeal onClick={function(){ if(phone.length>=10) setStep(3); }} full={true} style={{ opacity:phone.length>=10?1:0.4, padding:"13px" }}>Send OTP</BtnTeal>
              <button onClick={function(){ setStep(1); }} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.4)", fontSize:13, cursor:"pointer", display:"block", margin:"14px auto 0", fontFamily:"'Plus Jakarta Sans',system-ui" }}>Back</button>
            </div>
          )}

          {step===3 && (
            <div>
              <h2 className="font-display" style={{ fontSize:22, fontWeight:800, color:"#fff", marginBottom:6 }}>Enter OTP</h2>
              <p style={{ fontSize:14, color:"rgba(255,255,255,0.5)", marginBottom:24 }}>Sent to +91 {phone}</p>
              <div style={Object.assign(row("center","center",10), { marginBottom:18 })}>
                {otp.map(function(d, i) {
                  return (
                    <input key={i} id={"otp-"+i} maxLength={1} value={d}
                      onChange={function(e){ updateOtp(i, e.target.value.replace(/\D/,"")); }}
                      className="otp-input"
                      style={{ width:48, height:56, textAlign:"center", fontSize:22, fontWeight:700, background:"rgba(255,255,255,0.06)", border:"2px solid "+(d?T.teal:"rgba(255,255,255,0.12)"), borderRadius:T.rM, color:"#fff", outline:"none", fontFamily:"'Syne',system-ui", transition:"border-color 0.15s" }} />
                  );
                })}
              </div>
              <input value={name} onChange={function(e){ setName(e.target.value); }} placeholder="Your full name"
                style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1.5px solid rgba(255,255,255,0.12)", borderRadius:T.rM, color:"#fff", padding:"0 16px", height:50, fontSize:15, outline:"none", fontFamily:"'Plus Jakarta Sans',system-ui", marginBottom:18 }} />
              <BtnTeal onClick={finish} full={true} style={{ opacity:otp.join("").length>=4?1:0.4, padding:"13px" }}>
                {loading?"Verifying...":"Enter Dashboard"}
              </BtnTeal>
              <p style={{ fontSize:11.5, color:"rgba(255,255,255,0.3)", textAlign:"center", marginTop:14 }}>Demo mode - any OTP works</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- DASHBOARDS ----------------------------------------------
function DashTabs(props) {
  var tabs=props.tabs, active=props.active, onChange=props.onChange, color=props.color||T.teal;
  return (
    <div style={{ display:"inline-flex", background:T.white, border:"1px solid #E8EDF4", borderRadius:T.rM, padding:4, marginBottom:28, gap:3, flexWrap:"wrap" }}>
      {tabs.map(function(t) {
        var isActive = active===t[0];
        return (
          <button key={t[0]} onClick={function(){ onChange(t[0]); }}
            style={{ padding:"8px 16px", border:"none", borderRadius:10, cursor:"pointer", fontSize:13.5, fontWeight:isActive?700:500, background:isActive?color:"transparent", color:isActive?T.base:T.muted, fontFamily:"'Plus Jakarta Sans',system-ui", transition:"all 0.2s" }}>
            {t[1]}
          </button>
        );
      })}
    </div>
  );
}

function WorkerDash(props) {
  var user=props.user;
  var tabState=useState("overview");
  var tab=tabState[0],setTab=tabState[1];
  var w = WORKERS[0];

  return (
    <div style={{ background:T.offwhite, minHeight:"100vh" }}>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"32px 32px" }}>
        <div style={Object.assign(row("center","space-between"), { marginBottom:28 })}>
          <div>
            <h1 className="font-display" style={{ fontSize:24, fontWeight:800, color:T.ink }}>Welcome back, {user&&user.name?user.name.split(" ")[0]:"Rekha"}</h1>
            <p style={{ fontSize:14, color:T.muted, marginTop:4 }}>Your verified worker profile</p>
          </div>
          <div style={row("center","flex-end",10)}>
            <Chip label="Aadhaar Verified" color={T.teal} />
            <Chip label="Active" color={T.green} dot={true} />
          </div>
        </div>
        <DashTabs tabs={[["overview","Overview"],["wallet","Wallet"],["ratings","Ratings"],["jobs","Job Matches"],["profile","Profile"]]} active={tab} onChange={setTab} />

        {tab==="overview" && (
          <div style={col(18)}>
            <div className="dash-4" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
              {[["Trust Score","96/100",T.gold],["Reviews","34",T.teal],["Profile Views","428",T.violet],["Monthly Pay","Rs.14,000",T.green]].map(function(item) {
                return (
                  <div key={item[0]} style={card(20)}>
                    <div style={{ fontSize:12, color:T.muted, marginBottom:3 }}>{item[0]}</div>
                    <div className="font-display" style={{ fontSize:20, fontWeight:800, color:item[2] }}>{item[1]}</div>
                  </div>
                );
              })}
            </div>
            <div style={card(24)}>
              <div className="font-display" style={{ fontSize:15, fontWeight:800, color:T.ink, marginBottom:16 }}>Latest Verified Reviews</div>
              {w.jobs.map(function(j, i) {
                return (
                  <div key={i} style={{ padding:"14px", background:T.subtle, borderRadius:T.r, marginBottom:10, borderLeft:"3px solid "+T.tealM }}>
                    <div style={Object.assign(row("center","space-between"), { marginBottom:5 })}>
                      <span style={{ fontSize:13, fontWeight:700, color:T.ink }}>{j.emp}</span>
                      <Stars n={j.rating} size={12} />
                    </div>
                    <p style={{ fontSize:13, color:T.body, fontStyle:"italic" }}>"{j.review}"</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab==="wallet" && (
          <div style={col(18)}>
            <div style={card(0, { overflow:"hidden", background:"linear-gradient(135deg,"+T.l1+","+T.l2+")" })}>
              <div style={{ padding:"28px 28px 0" }}>
                <div style={{ fontSize:13, color:"rgba(255,255,255,0.5)", marginBottom:6 }}>Lifetime Earnings</div>
                <div className="font-display" style={{ fontSize:44, fontWeight:800, color:T.teal }}>Rs.1,68,000</div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", borderTop:"1px solid rgba(255,255,255,0.06)", marginTop:20 }}>
                {[["Rs.14,000","Monthly"],["42% more","vs. before"],["98%","Completion"]].map(function(item) {
                  return (
                    <div key={item[1]} style={{ padding:"20px 24px" }}>
                      <div className="font-display" style={{ fontSize:22, fontWeight:800, color:"#fff" }}>{item[0]}</div>
                      <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginTop:4 }}>{item[1]}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="grid-2" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
              {[["Salary Advance","Up to Rs.10,000 advance. Instant approval.",T.violet,"Apply"],["Accident Insurance","Rs.1L cover at Rs.29/month.",T.teal,"Get Insured"],["Health Check","Free annual checkup. 500+ centres.",T.green,"Book Free"],["Skill Training","Certifications in cooking, care, more.",T.amber,"View Courses"]].map(function(b) {
                return (
                  <div key={b[0]} style={card(22, { borderLeft:"3px solid "+b[2] })}>
                    <div className="font-display" style={{ fontSize:15, fontWeight:800, color:T.ink, marginBottom:6 }}>{b[0]}</div>
                    <div style={{ fontSize:13, color:T.muted, lineHeight:1.6, marginBottom:14 }}>{b[1]}</div>
                    <div style={{ background:b[2]+"12", border:"1px solid "+b[2]+"25", borderRadius:9, padding:9, textAlign:"center", fontSize:13, fontWeight:700, color:b[2], cursor:"pointer" }}>{b[3]}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab==="ratings" && (
          <div style={col(14)}>
            {w.jobs.map(function(j, i) {
              return (
                <div key={i} style={card(22, { borderLeft:"3px solid "+T.tealM })}>
                  <div style={Object.assign(row("center","space-between"), { marginBottom:7 })}>
                    <div className="font-display" style={{ fontSize:14, fontWeight:800, color:T.ink }}>{j.emp}</div>
                    <Stars n={j.rating} size={13} />
                  </div>
                  <p style={{ fontSize:13.5, color:T.body, fontStyle:"italic", lineHeight:1.65 }}>"{j.review}"</p>
                </div>
              );
            })}
          </div>
        )}

        {tab==="jobs" && (
          <div style={col(12)}>
            {[["Cook needed - Jubilee Hills","Mehta Family","Rs.12,000/mo","95%"],["Full-time domestic help","Krishnan Residence","Rs.15,000/mo","88%"],["Part-time 4 hrs/day","Singh Family","Rs.7,500/mo","79%"]].map(function(j) {
              return (
                <div key={j[0]} className="lift" style={card(22)}>
                  <div style={row("center","space-between")}>
                    <div>
                      <div className="font-display" style={{ fontSize:15, fontWeight:800, color:T.ink, marginBottom:4 }}>{j[0]}</div>
                      <div style={{ fontSize:13, color:T.muted }}>{j[1]} - {j[2]}</div>
                    </div>
                    <div style={Object.assign(col(8), { textAlign:"right" })}>
                      <div className="font-display" style={{ fontSize:24, fontWeight:800, color:T.teal }}>{j[3]}</div>
                      <div style={{ fontSize:11, color:T.muted }}>Match</div>
                      <BtnTeal style={{ padding:"8px 18px", fontSize:12 }}>Apply</BtnTeal>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab==="profile" && (
          <div style={card(28)}>
            <div className="font-display" style={{ fontSize:15, fontWeight:800, color:T.ink, marginBottom:20 }}>Edit Profile</div>
            <div className="grid-2" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              {["Full Name","Role","City","Locality","Expected Salary","Years Experience"].map(function(l) {
                return (
                  <div key={l}>
                    <div style={{ fontSize:12.5, fontWeight:600, color:T.muted, marginBottom:6 }}>{l}</div>
                    <input style={Object.assign({}, inp, { borderRadius:T.r, height:44 })} placeholder={"Enter "+l} />
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop:16 }}>
              <div style={{ fontSize:12.5, fontWeight:600, color:T.muted, marginBottom:6 }}>About You</div>
              <textarea rows={4} defaultValue={w.bio} style={Object.assign({}, inp, { resize:"vertical" })} />
            </div>
            <BtnTeal style={{ marginTop:20, padding:"12px 28px" }}>Save Changes</BtnTeal>
          </div>
        )}
      </div>
    </div>
  );
}

function EmployerDash(props) {
  var user=props.user, setPage=props.setPage;
  var tabState=useState("overview"), rateState=useState(null), ratingState=useState(0);
  var tab=tabState[0],setTab=tabState[1];
  var rateW=rateState[0],setRateW=rateState[1];
  var ratingN=ratingState[0],setRatingN=ratingState[1];

  return (
    <div style={{ background:T.offwhite, minHeight:"100vh" }}>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"32px 32px" }}>
        <div style={Object.assign(row("center","space-between"), { marginBottom:28 })}>
          <div>
            <h1 className="font-display" style={{ fontSize:24, fontWeight:800, color:T.ink }}>Hello, {user&&user.name?user.name:"Sharma Family"}</h1>
            <p style={{ fontSize:14, color:T.muted, marginTop:4 }}>Manage your workers and post new jobs</p>
          </div>
          <BtnTeal onClick={function(){ setPage("search"); }} style={{ padding:"10px 22px", fontSize:13.5 }}>+ Find Worker</BtnTeal>
        </div>
        <DashTabs tabs={[["overview","Overview"],["hired","My Workers"],["post","Post Job"]]} active={tab} onChange={setTab} />

        {tab==="overview" && (
          <div style={col(18)}>
            <div className="dash-4" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
              {[["Active Workers","2",T.teal],["Reviews Given","5",T.gold],["Jobs Posted","3",T.violet],["Profile Views","28",T.amber]].map(function(item) {
                return (
                  <div key={item[0]} style={card(20)}>
                    <div style={{ fontSize:12, color:T.muted, marginBottom:3 }}>{item[0]}</div>
                    <div className="font-display" style={{ fontSize:22, fontWeight:800, color:item[2] }}>{item[1]}</div>
                  </div>
                );
              })}
            </div>
            <div style={card(24)}>
              <div className="font-display" style={{ fontSize:15, fontWeight:800, color:T.ink, marginBottom:16 }}>Currently Hired</div>
              {WORKERS.slice(0,2).map(function(w) {
                return (
                  <div key={w.id} style={Object.assign(card(16, { background:T.subtle }), row("center","space-between"), { marginBottom:12 })}>
                    <div style={row("center","flex-start",14)}>
                      <Avi text={w.avi} bg={w.color} size={44} r={11} ring={true} />
                      <div>
                        <div className="font-display" style={{ fontSize:14, fontWeight:800, color:T.ink }}>{w.name}</div>
                        <div style={{ fontSize:13, color:T.muted }}>{w.role} - Since Jan 2024</div>
                      </div>
                    </div>
                    <div style={row("center","flex-end",10)}>
                      <Score n={w.score} count={w.reviews} />
                      <BtnTeal onClick={function(){ setRateW(w); }} style={{ padding:"8px 16px", fontSize:12 }}>Rate</BtnTeal>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab==="post" && (
          <div style={card(28)}>
            <div className="font-display" style={{ fontSize:16, fontWeight:800, color:T.ink, marginBottom:20 }}>Post a New Job</div>
            <div className="grid-2" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              {["Job Title","Location","Salary Budget","Start Date"].map(function(l) {
                return (
                  <div key={l}>
                    <div style={{ fontSize:12.5, fontWeight:600, color:T.muted, marginBottom:6 }}>{l}</div>
                    <input style={Object.assign({}, inp, { borderRadius:T.r, height:44 })} placeholder={l} />
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop:16 }}>
              <div style={{ fontSize:12.5, fontWeight:600, color:T.muted, marginBottom:6 }}>Description</div>
              <textarea rows={4} placeholder="Describe the work and requirements..." style={Object.assign({}, inp, { resize:"none", borderRadius:T.r })} />
            </div>
            <BtnTeal style={{ marginTop:20, padding:"12px 28px" }}>Post Job</BtnTeal>
          </div>
        )}
      </div>

      {rateW && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }} onClick={function(){ setRateW(null); }}>
          <div style={card(32, { maxWidth:420, width:"100%" })} onClick={function(e){ e.stopPropagation(); }}>
            <div className="font-display" style={{ fontSize:20, fontWeight:800, color:T.ink, marginBottom:6 }}>Rate {rateW.name}</div>
            <p style={{ fontSize:13.5, color:T.muted, marginBottom:22 }}>Your verified review builds their professional reputation.</p>
            <div style={Object.assign(row("center","center"), { marginBottom:22 })}>
              <Stars n={ratingN} size={36} interactive={true} onChange={setRatingN} />
            </div>
            <textarea rows={3} placeholder="Share your experience..." style={Object.assign({}, inp, { resize:"none", borderRadius:T.r, marginBottom:16 })} />
            <BtnTeal onClick={function(){ setRateW(null); }} full={true} style={{ padding:"13px" }}>Submit Verified Review</BtnTeal>
          </div>
        </div>
      )}
    </div>
  );
}

function SocietyDash(props) {
  var user=props.user, setPage=props.setPage;
  var tabState=useState("dashboard");
  var tab=tabState[0],setTab=tabState[1];
  var pendState=useState([
    { id:1, name:"Amit Sharma", role:"Plumber", status:"pending" },
    { id:2, name:"Gita Devi", role:"Domestic Helper", status:"pending" },
    { id:3, name:"Ramesh Yadav", role:"Electrician", status:"pending" },
  ]);
  var pending=pendState[0],setPending=pendState[1];

  function updatePending(id, status) {
    setPending(function(prev){ return prev.map(function(x){ return x.id===id ? Object.assign({},x,{status:status}) : x; }); });
  }

  var entries = [
    { name:"Rekha Devi", role:"Domestic Helper", flat:"402", time:"07:34", ok:true },
    { name:"Rajan Kumar", role:"Plumber", flat:"118", time:"08:12", ok:true },
    { name:"Suresh Nair", role:"Guard", flat:"Gate", time:"08:15", ok:true },
    { name:"Unknown Visitor", role:"Unregistered", flat:"?", time:"09:02", ok:false },
  ];

  return (
    <div style={{ background:T.offwhite, minHeight:"100vh" }}>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"32px 32px" }}>
        <div style={Object.assign(row("center","space-between"), { marginBottom:28 })}>
          <div>
            <h1 className="font-display" style={{ fontSize:24, fontWeight:800, color:T.ink }}>{user&&user.name?user.name:"Prestige Society"} Hub</h1>
            <p style={{ fontSize:14, color:T.muted, marginTop:4 }}>Society management dashboard</p>
          </div>
          <div style={row("center","flex-end",10)}>
            <Chip label="LIVE" color={T.green} dot={true} />
            <BtnViolet style={{ padding:"10px 20px", fontSize:13 }}>+ Register Worker</BtnViolet>
          </div>
        </div>
        <DashTabs tabs={[["dashboard","Dashboard"],["entry","Entry Log"],["registry","Registry"],["approvals","Approvals"],["notices","Notices"]]} active={tab} onChange={setTab} color={T.violet} />

        {tab==="dashboard" && (
          <div style={col(18)}>
            <div className="dash-4" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
              {[["Flats","320",T.violet],["Verified Workers","72",T.teal],["Today Entries","14",T.amber],["Pending Approvals",pending.filter(function(p){ return p.status==="pending"; }).length,T.red]].map(function(item) {
                return (
                  <div key={item[0]} style={card(20)}>
                    <div style={{ fontSize:12, color:T.muted, marginBottom:3 }}>{item[0]}</div>
                    <div className="font-display" style={{ fontSize:24, fontWeight:800, color:item[2] }}>{item[1]}</div>
                  </div>
                );
              })}
            </div>
            <div className="grid-2" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
              <div style={card(22)}>
                <div className="font-display" style={{ fontSize:14, fontWeight:800, color:T.ink, marginBottom:14 }}>Live Entry Feed</div>
                {entries.map(function(e) {
                  return (
                    <div key={e.name} style={Object.assign(row("center","space-between"), { padding:"10px 12px", background:T.subtle, borderRadius:T.r, marginBottom:8, borderLeft:"3px solid "+(e.ok?T.tealM:T.red) })}>
                      <div>
                        <div style={{ fontSize:13, fontWeight:600, color:T.ink }}>{e.name}</div>
                        <div style={{ fontSize:11, color:T.muted }}>{e.role} - Flat {e.flat} - {e.time}</div>
                      </div>
                      <Chip label={e.ok?"OK":"Flag"} color={e.ok?T.green:T.red} size={10} />
                    </div>
                  );
                })}
              </div>
              <div style={card(22)}>
                <div className="font-display" style={{ fontSize:14, fontWeight:800, color:T.ink, marginBottom:14 }}>Worker Mix</div>
                {[["Domestic Helpers",28,T.teal],["Security Guards",12,T.violet],["Plumbers",8,T.amber],["Electricians",6,T.green],["Others",18,T.muted]].map(function(item) {
                  return (
                    <div key={item[0]} style={{ marginBottom:10 }}>
                      <div style={Object.assign(row("center","space-between"), { marginBottom:4, fontSize:13 })}>
                        <span style={{ color:T.body }}>{item[0]}</span>
                        <span style={{ fontWeight:700, color:item[2] }}>{item[1]}</span>
                      </div>
                      <div style={{ height:6, background:"#F0F4F9", borderRadius:3, overflow:"hidden" }}>
                        <div style={{ width:Math.round((item[1]/72)*100)+"%", height:"100%", background:item[2], borderRadius:3 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {tab==="approvals" && (
          <div style={col(14)}>
            {pending.filter(function(p){ return p.status==="pending"; }).length===0 && (
              <div style={card(40, { textAlign:"center" })}>
                <div className="font-display" style={{ fontSize:16, fontWeight:700, color:T.ink }}>All caught up!</div>
              </div>
            )}
            {pending.filter(function(p){ return p.status==="pending"; }).map(function(p) {
              return (
                <div key={p.id} style={Object.assign(card(20), row("center","space-between"))}>
                  <div style={row("center","flex-start",14)}>
                    <Avi text={p.name[0]} bg={T.violet} size={44} r={11} />
                    <div>
                      <div className="font-display" style={{ fontSize:14, fontWeight:800, color:T.ink }}>{p.name}</div>
                      <div style={{ fontSize:13, color:T.muted }}>{p.role}</div>
                    </div>
                  </div>
                  <div style={row("center","flex-end",10)}>
                    <button onClick={function(){ updatePending(p.id,"approved"); }} style={{ background:T.greenBg, color:T.green, border:"none", borderRadius:9, padding:"8px 16px", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'Plus Jakarta Sans',system-ui" }}>Approve</button>
                    <button onClick={function(){ updatePending(p.id,"rejected"); }} style={{ background:"#FEF2F2", color:T.red, border:"none", borderRadius:9, padding:"8px 16px", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'Plus Jakarta Sans',system-ui" }}>Reject</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab==="entry" && (
          <div style={card(0, { overflow:"hidden" })}>
            <div style={Object.assign(row("center","space-between"), { padding:"18px 22px", borderBottom:"1px solid #F0F4F9" })}>
              <div className="font-display" style={{ fontSize:15, fontWeight:800, color:T.ink }}>Today's Entry Log</div>
              <BtnGhost style={{ padding:"8px 16px", fontSize:12 }}>Download PDF</BtnGhost>
            </div>
            {entries.map(function(e, i) {
              return (
                <div key={e.name} style={Object.assign(row("center","space-between"), { padding:"14px 22px", borderBottom:"1px solid #F0F4F9", background:i%2===0?T.white:T.offwhite })}>
                  <div style={row("center","flex-start",14)}>
                    <div style={{ width:10, height:10, borderRadius:"50%", background:e.ok?T.green:T.red, flexShrink:0 }} />
                    <div>
                      <div style={{ fontSize:14, fontWeight:600, color:T.ink }}>{e.name}</div>
                      <div style={{ fontSize:12, color:T.muted }}>{e.role}</div>
                    </div>
                  </div>
                  <div style={{ fontSize:13, color:T.muted }}>Flat {e.flat}</div>
                  <div style={{ fontSize:13, fontWeight:600, color:T.ink }}>{e.time} AM</div>
                  <Chip label={e.ok?"Verified":"Unknown"} color={e.ok?T.green:T.red} size={10} dot={true} />
                </div>
              );
            })}
          </div>
        )}

        {tab==="registry" && (
          <div style={card(0, { overflow:"hidden" })}>
            <div style={Object.assign(row("center","space-between"), { padding:"18px 22px", borderBottom:"1px solid #F0F4F9" })}>
              <div className="font-display" style={{ fontSize:15, fontWeight:800, color:T.ink }}>Worker Registry</div>
              <input placeholder="Search..." style={Object.assign({}, inp, { width:200, height:38, fontSize:13 })} />
            </div>
            {WORKERS.slice(0,5).map(function(w, i) {
              return (
                <div key={w.id} style={Object.assign(row("center","space-between"), { padding:"13px 22px", borderBottom:"1px solid #F0F4F9", background:i%2===0?T.white:T.offwhite })}>
                  <div style={row("center","flex-start",12)}>
                    <Avi text={w.avi} bg={w.color} size={32} r={9} ring={w.verified} />
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:T.ink }}>{w.name}</div>
                      <div style={{ fontSize:12, color:T.muted }}>{w.role}</div>
                    </div>
                  </div>
                  <div style={{ fontSize:13, color:T.tealM }}>{w.city}</div>
                  <div style={row("center","flex-start",3)}>
                    <span style={{ fontSize:12, color:T.gold }}>*</span>
                    <span style={{ fontSize:13, fontWeight:700 }}>{w.score}</span>
                  </div>
                  <Chip label={w.verified?"Active":"Pending"} color={w.verified?T.green:T.amber} size={10} />
                </div>
              );
            })}
          </div>
        )}

        {tab==="notices" && (
          <div style={col(14)}>
            {[["Water Maintenance","Water supply suspended Dec 15, 7AM-2PM.","info"],["Verification Policy","All new workers must submit updated Aadhaar from Jan 1.","alert"],["Worker of the Month","Congrats Rekha Devi - highest-rated in December.","success"]].map(function(n) {
              return (
                <div key={n[0]} style={card(20, { borderLeft:"4px solid "+(n[2]==="info"?T.violet:n[2]==="alert"?T.amber:T.green) })}>
                  <div className="font-display" style={{ fontSize:14, fontWeight:800, color:T.ink, marginBottom:7 }}>{n[0]}</div>
                  <p style={{ fontSize:13.5, color:T.muted, lineHeight:1.65 }}>{n[1]}</p>
                </div>
              );
            })}
            <div style={card(22)}>
              <div className="font-display" style={{ fontSize:14, fontWeight:800, color:T.ink, marginBottom:14 }}>Post a Notice</div>
              <input placeholder="Notice title..." style={Object.assign({}, inp, { marginBottom:10 })} />
              <textarea rows={3} placeholder="Notice message..." style={Object.assign({}, inp, { resize:"none", marginBottom:12 })} />
              <BtnViolet style={{ padding:"11px 24px", fontSize:13 }}>Post to All Residents</BtnViolet>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Admin() {
  var tabState=useState("overview");
  var tab=tabState[0],setTab=tabState[1];

  return (
    <div style={{ background:T.offwhite, minHeight:"100vh" }}>
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"32px 32px" }}>
        <div style={Object.assign(row("center","space-between"), { marginBottom:28 })}>
          <div>
            <h1 className="font-display" style={{ fontSize:24, fontWeight:800, color:T.ink }}>Admin Dashboard</h1>
            <p style={{ fontSize:14, color:T.muted, marginTop:4 }}>Platform-wide oversight and controls</p>
          </div>
          <div style={row("center","flex-end",10)}>
            <Chip label="Production" color={T.red} />
            <Chip label="v3.1.0" color={T.muted} />
          </div>
        </div>
        <DashTabs tabs={[["overview","Overview"],["users","Users"],["revenue","Revenue"],["reports","Reports"]]} active={tab} onChange={setTab} color={T.base} />

        {tab==="overview" && (
          <div style={col(20)}>
            <div className="dash-4" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
              {[["Total Workers","24,118",T.teal,"+195 this month"],["Societies","1,280",T.violet,"+34 this month"],["Total Ratings","98,200",T.gold,"+2,840 this month"],["MRR","Rs.38.4L",T.green,"+9.6% MoM"]].map(function(item) {
                return (
                  <div key={item[0]} style={card(22)}>
                    <div style={{ fontSize:12, color:T.muted, marginBottom:3 }}>{item[0]}</div>
                    <div className="font-display" style={{ fontSize:22, fontWeight:800, color:item[2] }}>{item[1]}</div>
                    <div style={{ fontSize:12, color:T.green, marginTop:4 }}>{item[3]}</div>
                  </div>
                );
              })}
            </div>
            <div className="grid-3" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:18 }}>
              {[
                { title:"Revenue Streams", rows:[["Society Subs","Rs.18.2L"],["Background Checks","Rs.6.4L"],["Worker Pro","Rs.5.8L"],["Enterprise","Rs.8.0L"]] },
                { title:"Platform Health", rows:[["Verification Rate","98.4%"],["Avg Hire Time","22 min"],["Job Completion","97.3%"],["Fraud Blocked","0"]] },
                { title:"System Status", rows:[["API Uptime","99.98%"],["OTP Delivery","99.4%"],["Open Tickets","7"],["Flagged Reviews","3"]] },
              ].map(function(section) {
                return (
                  <div key={section.title} style={card(22)}>
                    <div className="font-display" style={{ fontSize:14, fontWeight:800, color:T.ink, marginBottom:14 }}>{section.title}</div>
                    {section.rows.map(function(r) {
                      return (
                        <div key={r[0]} style={Object.assign(row("center","space-between"), { padding:"9px 0", borderBottom:"1px solid #F0F4F9" })}>
                          <span style={{ fontSize:13, color:T.muted }}>{r[0]}</span>
                          <span style={{ fontSize:13, fontWeight:700, color:T.ink }}>{r[1]}</span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab==="revenue" && (
          <div style={col(18)}>
            <div className="dash-4" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
              {[["MRR","Rs.38.4L",T.green],["ARR","Rs.4.6Cr",T.teal],["Avg Society Plan","Rs.2,999",T.violet],["Avg Worker Plan","Rs.149",T.amber]].map(function(item) {
                return (
                  <div key={item[0]} style={card(20)}>
                    <div className="font-display" style={{ fontSize:26, fontWeight:800, color:item[2] }}>{item[1]}</div>
                    <div style={{ fontSize:13, color:T.muted, marginTop:6 }}>{item[0]}</div>
                  </div>
                );
              })}
            </div>
            <div style={card(24)}>
              <div className="font-display" style={{ fontSize:15, fontWeight:800, color:T.ink, marginBottom:18 }}>Revenue by Stream</div>
              {[["Society Subscriptions","Rs.18.2L",47,T.violet],["Enterprise B2B","Rs.8.0L",21,"#7C3AED"],["Background Checks","Rs.6.4L",17,T.teal],["Worker Pro Plans","Rs.5.8L",15,T.amber]].map(function(item) {
                return (
                  <div key={item[0]} style={{ marginBottom:14 }}>
                    <div style={Object.assign(row("center","space-between"), { marginBottom:6, fontSize:14 })}>
                      <span style={{ color:T.body }}>{item[0]}</span>
                      <span style={{ fontWeight:700, color:T.ink }}>{item[1]} ({item[2]}%)</span>
                    </div>
                    <div style={{ height:8, background:"#F0F4F9", borderRadius:4, overflow:"hidden" }}>
                      <div style={{ width:item[2]+"%", height:"100%", background:item[3], borderRadius:4 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab==="users" && (
          <div style={card(0, { overflow:"hidden" })}>
            <div style={Object.assign(row("center","space-between"), { padding:"18px 22px", borderBottom:"1px solid #F0F4F9" })}>
              <div className="font-display" style={{ fontSize:15, fontWeight:800, color:T.ink }}>All Workers</div>
              <input placeholder="Search..." style={Object.assign({}, inp, { width:200, height:38, fontSize:13 })} />
            </div>
            {WORKERS.map(function(w, i) {
              return (
                <div key={w.id} style={Object.assign(row("center","space-between"), { padding:"13px 22px", borderBottom:"1px solid #F0F4F9", background:i%2===0?T.white:T.offwhite, flexWrap:"wrap", gap:10 })}>
                  <div style={row("center","flex-start",12)}>
                    <Avi text={w.avi} bg={w.color} size={32} r={8} ring={w.verified} />
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:T.ink }}>{w.name}</div>
                      <div style={{ fontSize:12, color:T.muted }}>{w.role} - {w.city}</div>
                    </div>
                  </div>
                  <div style={row("center","flex-end",10)}>
                    <div style={row("center","flex-start",3)}>
                      <span style={{ fontSize:12, color:T.gold }}>*</span>
                      <span style={{ fontSize:13, fontWeight:700 }}>{w.score}</span>
                    </div>
                    <Chip label={w.verified?"Active":"Pending"} color={w.verified?T.green:T.amber} size={10} />
                    <button style={{ background:T.subtle, border:"1px solid #E8EDF4", borderRadius:7, padding:"4px 10px", fontSize:11, cursor:"pointer", color:T.muted, fontFamily:"'Plus Jakarta Sans',system-ui" }}>View</button>
                    <button style={{ background:"#FEF2F2", color:T.red, border:"none", borderRadius:7, padding:"4px 10px", fontSize:11, cursor:"pointer", fontFamily:"'Plus Jakarta Sans',system-ui" }}>Flag</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// --- APP ROOT ------------------------------------------------
export default function App() {
  var pageState=useState("landing"), userState=useState(null), viewIdState=useState(null);
  var page=pageState[0],setPage=pageState[1];
  var user=userState[0],setUser=userState[1];
  var viewId=viewIdState[0],setViewId=viewIdState[1];

  function renderPage() {
    if (page==="landing")           return <Landing setPage={setPage} setUser={setUser} />;
    if (page==="search")            return <Search setPage={setPage} setViewId={setViewId} />;
    if (page==="worker-view")       return <WorkerView wId={viewId} setPage={setPage} />;
    if (page==="pricing")           return <Pricing setPage={setPage} />;
    if (page==="for-societies")     return <ForSocieties setPage={setPage} setUser={setUser} />;
    if (page==="for-workers")       return <ForWorkers setPage={setPage} />;
    if (page==="enterprise")        return <Enterprise setPage={setPage} />;
    if (page==="auth")              return <Auth setPage={setPage} setUser={setUser} />;
    if (page==="worker-dashboard")  return <WorkerDash user={user} />;
    if (page==="employer-dashboard")return <EmployerDash user={user} setPage={setPage} />;
    if (page==="society-dashboard") return <SocietyDash user={user} setPage={setPage} />;
    if (page==="admin")             return <Admin />;
    return <Landing setPage={setPage} setUser={setUser} />;
  }

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif", minHeight:"100vh", background:T.offwhite }}>
      <GlobalStyles />
      {page!=="auth" && <Nav page={page} setPage={setPage} user={user} setUser={setUser} />}
      {renderPage()}
    </div>
  );
}
