import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────────
   SHRAMIK-PROFILE  ·  Trusted Worker Network
   Commercial-grade frontend prototype · All 9 pages
   Design: Clean premium light mode · Sora + System UI
   Stakeholders: Societies · Families · Workers · Admin
───────────────────────────────────────────────────────────────── */

const G = {
  // Base
  white: "#FFFFFF",
  bg: "#F7F9FC",
  bgAlt: "#EEF2F7",
  border: "#E1E8F0",
  borderDark: "#CBD5E1",
  // Text
  ink: "#0B1628",
  body: "#334155",
  muted: "#64748B",
  dim: "#94A3B8",
  // Primary (Teal — trust)
  teal: "#0D9488",
  tealDark: "#0F766E",
  tealLight: "#14B8A6",
  tealBg: "#F0FDFA",
  tealBorder: "#99F6E4",
  // Society accent (Indigo — premium)
  indigo: "#4F46E5",
  indigoDark: "#3730A3",
  indigoBg: "#EEF2FF",
  indigoBorder: "#C7D2FE",
  // Worker accent (Amber — warm, energy)
  amber: "#D97706",
  amberDark: "#B45309",
  amberBg: "#FFFBEB",
  amberBorder: "#FDE68A",
  // Status
  green: "#16A34A",
  greenBg: "#F0FDF4",
  greenBorder: "#BBF7D0",
  red: "#DC2626",
  redBg: "#FEF2F2",
  redBorder: "#FECACA",
  gold: "#F59E0B",
  // Shadows
  shadow: "0 1px 3px rgba(0,0,0,.08), 0 4px 16px rgba(0,0,0,.06)",
  shadowMd: "0 4px 12px rgba(0,0,0,.1), 0 8px 32px rgba(0,0,0,.08)",
  shadowLg: "0 12px 40px rgba(0,0,0,.14)",
  // Radius
  r: "10px", rLg: "16px", rXl: "24px",
};

/* ── FONT: inject Sora via style tag ─────────────────────────── */
const FontStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body, #root { background: ${G.bg}; }
    ::placeholder { color: ${G.dim}; }
    select option { background: #fff; color: ${G.ink}; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: ${G.bg}; }
    ::-webkit-scrollbar-thumb { background: ${G.borderDark}; border-radius: 3px; }
    @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
    @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:.5;} }
    .fade-up { animation: fadeUp .5s ease forwards; }
    .hover-lift { transition: transform .2s, box-shadow .2s; }
    .hover-lift:hover { transform: translateY(-3px); box-shadow: ${G.shadowMd}; }
    .hover-teal:hover { border-color: ${G.teal} !important; }
    .btn-primary:hover { filter: brightness(1.06); }
    .btn-ghost:hover { background: ${G.bg} !important; }
    .nav-link:hover { color: ${G.teal} !important; }
  `}</style>
);

/* ── DESIGN UTILS ──────────────────────────────────────────────── */
const row = (align = "center", justify = "flex-start", gap = 0) =>
  ({ display: "flex", alignItems: align, justifyContent: justify, gap, flexWrap: "wrap" });

const col = (gap = 0) => ({ display: "flex", flexDirection: "column", gap });

const card = (p = 24, extra = {}) => ({
  background: G.white,
  border: `1px solid ${G.border}`,
  borderRadius: G.rLg,
  padding: p,
  boxShadow: G.shadow,
  ...extra,
});

const inp = {
  width: "100%", background: G.white, border: `1.5px solid ${G.border}`,
  borderRadius: G.r, padding: "10px 14px", fontSize: 14,
  color: G.ink, outline: "none", fontFamily: "Sora, system-ui, sans-serif",
  transition: "border-color .15s",
};

const btnPrimary = (extra = {}) => ({
  background: `linear-gradient(135deg, ${G.teal}, ${G.tealDark})`,
  color: "#fff", border: "none", borderRadius: G.r,
  padding: "11px 22px", fontSize: 14, fontWeight: 700,
  fontFamily: "Sora, system-ui, sans-serif", cursor: "pointer",
  boxShadow: `0 3px 12px ${G.teal}44`, transition: "filter .15s",
  ...extra,
});

const btnGhost = (extra = {}) => ({
  background: "transparent", color: G.body,
  border: `1.5px solid ${G.border}`, borderRadius: G.r,
  padding: "11px 22px", fontSize: 14, fontWeight: 600,
  fontFamily: "Sora, system-ui, sans-serif", cursor: "pointer",
  transition: "background .15s", ...extra,
});

const btnIndigo = (extra = {}) => ({
  background: `linear-gradient(135deg, ${G.indigo}, ${G.indigoDark})`,
  color: "#fff", border: "none", borderRadius: G.r,
  padding: "11px 22px", fontSize: 14, fontWeight: 700,
  fontFamily: "Sora, system-ui, sans-serif", cursor: "pointer",
  boxShadow: `0 3px 12px ${G.indigo}44`, transition: "filter .15s", ...extra,
});

/* ── ATOMS ─────────────────────────────────────────────────────── */
function Tag({ label, color = G.teal, bg }) {
  return (
    <span style={{
      background: bg || color + "14", color,
      border: `1px solid ${color}30`,
      borderRadius: 20, padding: "3px 11px",
      fontSize: 12, fontWeight: 600, whiteSpace: "nowrap",
    }}>{label}</span>
  );
}

function Stars({ score = 0, size = 14, interactive = false, onRate }) {
  const [hover, setHover] = useState(0);
  return (
    <span style={row("center", "flex-start", 2)}>
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s}
          style={{ fontSize: size, color: s <= (hover || score) ? G.gold : G.border, cursor: interactive ? "pointer" : "default", lineHeight: 1, transition: "color .1s" }}
          onMouseEnter={() => interactive && setHover(s)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onRate && onRate(s)}>★</span>
      ))}
    </span>
  );
}

function ScorePill({ score, count }) {
  const c = score >= 4.7 ? G.green : score >= 4.3 ? G.teal : G.amber;
  return (
    <span style={{ ...row("center", "flex-start", 5), background: c + "12", border: `1px solid ${c}28`, borderRadius: 20, padding: "4px 11px" }}>
      <span style={{ fontSize: 13, color: G.gold }}>★</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: c }}>{score.toFixed(1)}</span>
      {count !== undefined && <span style={{ fontSize: 12, color: G.muted }}>({count})</span>}
    </span>
  );
}

function Avi({ initials, color, size = 44, r = 12 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: r, background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * .32, fontWeight: 800, color: "#fff", flexShrink: 0, fontFamily: "Sora, system-ui, sans-serif", letterSpacing: .5 }}>
      {initials}
    </div>
  );
}

function Section({ title, sub, children, action }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ ...row("flex-end", "space-between"), marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: G.ink }}>{title}</div>
          {sub && <div style={{ fontSize: 13, color: G.muted, marginTop: 3 }}>{sub}</div>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function Empty({ icon, title, sub }) {
  return (
    <div style={{ textAlign: "center", padding: "52px 20px", color: G.muted }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: G.body, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13 }}>{sub}</div>
    </div>
  );
}

/* ── DATA ──────────────────────────────────────────────────────── */
const WORKERS = [
  { id: 1, name: "Rekha Devi", role: "Domestic Helper", city: "Hyderabad", area: "Banjara Hills", phone: "98765-xxxxx", verified: true, bgCheck: true, score: 4.8, reviews: 34, exp: 7, skills: ["Cooking", "Cleaning", "Child Care", "Elderly Care"], bio: "7 years experience with families across Banjara Hills and Jubilee Hills. Specialises in South Indian cooking and full-house management. Available 6 days a week.", salary: "₹14,000/mo", avi: "RD", color: "#0D9488", avail: "Available", lang: ["Telugu", "Hindi"], completePct: 98, since: "2017", jobs: [{ emp: "Sharma Residence, Banjara Hills", role: "Cook & Help", dur: "Jan 2021 – Mar 2024", rating: 5, review: "Rekha is exceptional — punctual, trustworthy and an outstanding cook. Our kids adore her. Highly recommended.", verified: true, date: "Mar 2024" }, { emp: "Mehta Family, Jubilee Hills", role: "Full House Help", dur: "Jun 2019 – Dec 2020", rating: 5, review: "Reliable and honest. Always went above and beyond. Safe to leave home keys with.", verified: true, date: "Dec 2020" }, { emp: "Reddy Residence, Kondapur", role: "Cook", dur: "2018 – 2019", rating: 4, review: "Great cook, very particular about cleanliness.", verified: true, date: "May 2019" }], badges: ["Top Rated", "Background Verified", "Police Check"] },
  { id: 2, name: "Rajan Kumar", role: "Plumber", city: "Bengaluru", area: "Whitefield", phone: "87654-xxxxx", verified: true, bgCheck: true, score: 4.6, reviews: 58, exp: 12, skills: ["Pipe Fitting", "Leak Repair", "Bathroom Fixtures", "Drainage", "Water Heater"], bio: "Licensed plumber, 12 years. Handled 500+ residential and commercial jobs. Certified for gas pipeline work. Available for emergency calls.", salary: "₹1,200/visit", avi: "RK", color: "#2563EB", avail: "Available", lang: ["Kannada", "Hindi", "Tamil"], completePct: 100, since: "2012", jobs: [{ emp: "Green Park Apartments", role: "Resident Plumber", dur: "2022 – Present", rating: 5, review: "Fixed a burst pipe at midnight without a complaint. Our entire society trusts him.", verified: true, date: "2024" }, { emp: "Brigade Pinnacle", role: "Contract Plumber", dur: "2020 – 2022", rating: 4, review: "Reliable, fair pricing, no unnecessary upselling.", verified: true, date: "2022" }], badges: ["Licensed", "Emergency 24/7", "Gas Certified"] },
  { id: 3, name: "Suresh Nair", role: "Security Guard", city: "Mumbai", area: "Powai", phone: "76543-xxxxx", verified: true, bgCheck: true, score: 4.9, reviews: 42, exp: 9, skills: ["Access Control", "CCTV", "Emergency Response", "Night Patrol", "Fire Safety"], bio: "Ex-Army, 9 years residential security. BIS certified, police verified. Zero incident record for 4 consecutive years. Fluent in emergency protocols.", salary: "₹18,000/mo", avi: "SN", color: "#7C3AED", avail: "Available", lang: ["Malayalam", "Hindi", "English", "Marathi"], completePct: 99, since: "2015", jobs: [{ emp: "Lodha Splendora, Thane", role: "Head Guard", dur: "2020 – Present", rating: 5, review: "Suresh transformed our building security culture. Zero incidents in 4 years. The residents feel genuinely safe.", verified: true, date: "2024" }, { emp: "Godrej Properties, Vikhroli", role: "Security Guard", dur: "2018 – 2020", rating: 5, review: "Exceptional discipline and professionalism. Handled a fire drill with textbook precision.", verified: true, date: "2020" }], badges: ["Ex-Army", "Police Verified", "Fire Safety Trained"] },
  { id: 4, name: "Lakshmi Bai", role: "Cook", city: "Chennai", area: "Adyar", phone: "65432-xxxxx", verified: true, bgCheck: false, score: 4.7, reviews: 28, exp: 5, skills: ["South Indian", "North Indian", "Tiffin Service", "Catering", "Diet Cooking"], bio: "Health-focused cook with expertise in South and North Indian cuisines. FSSAI food handling certified. Manages up to 3 families daily.", salary: "₹12,000/mo", avi: "LB", color: "#D97706", avail: "Busy", lang: ["Tamil", "Telugu", "Hindi"], completePct: 88, since: "2019", jobs: [{ emp: "Krishnaswamy Family, Adyar", role: "Daily Cook", dur: "2022 – Present", rating: 5, review: "Lakshmi's food is better than any restaurant. Our diabetic father's diet has never been more delicious.", verified: true, date: "2024" }], badges: ["FSSAI Certified", "Diet Specialist"] },
  { id: 5, name: "Arjun Singh", role: "Electrician", city: "Delhi", area: "Dwarka Sector 10", phone: "54321-xxxxx", verified: true, bgCheck: true, score: 4.5, reviews: 67, exp: 14, skills: ["Wiring", "MCB & Fuse", "AC Installation", "Inverter Setup", "Solar Panel"], bio: "ITI certified, 14 years across Delhi NCR. Licensed contractor for residential and commercial projects. Insurance covered for all work.", salary: "₹1,500/visit", avi: "AS", color: "#C2410C", avail: "Available", lang: ["Hindi", "Punjabi", "English"], completePct: 96, since: "2010", jobs: [{ emp: "DLF Park Place, Gurugram", role: "Society Electrician", dur: "2021 – Present", rating: 5, review: "Handles the entire 800-flat complex. Responds within 30 min for emergencies. Indispensable.", verified: true, date: "2024" }, { emp: "Ansal Town, Dwarka", role: "Contract Electrician", dur: "2018 – 2021", rating: 4, review: "Completed full rewiring on schedule. Very systematic and clean worker.", verified: true, date: "2021" }], badges: ["ITI Certified", "Licensed Contractor", "Insured"] },
  { id: 6, name: "Priya Hegde", role: "Nanny / Baby Sitter", city: "Pune", area: "Kothrud", phone: "43210-xxxxx", verified: true, bgCheck: true, score: 4.9, reviews: 19, exp: 4, skills: ["Infant Care", "Activity Planning", "First Aid", "School Pickup", "Special Needs"], bio: "Certified childcare professional. Infant first-aid trained. 4 years with families in Kothrud and Baner. References from 6 families available.", salary: "₹15,000/mo", avi: "PH", color: "#DB2777", avail: "Available", lang: ["Kannada", "Marathi", "English", "Hindi"], completePct: 100, since: "2020", jobs: [{ emp: "Joshi Family, Kothrud", role: "Full-time Nanny", dur: "2022 – Present", rating: 5, review: "Our toddler genuinely loves Priya. She is attentive, creative and completely trustworthy. We leave our son with her without a second thought.", verified: true, date: "2024" }, { emp: "Desai Family, Baner", role: "Part-time Babysitter", dur: "2020 – 2022", rating: 5, review: "Always on time, always prepared. A rare find.", verified: true, date: "2022" }], badges: ["First Aid Certified", "Background Check", "Top Rated"] },
];

const CATEGORIES = [
  { label: "House Help", icon: "🏠", count: 380, color: G.teal },
  { label: "Cooks", icon: "🍳", count: 210, color: G.amber },
  { label: "Security", icon: "🛡️", count: 190, color: G.indigo },
  { label: "Plumbers", icon: "🔧", count: 170, color: "#2563EB" },
  { label: "Electricians", icon: "⚡", count: 155, color: "#C2410C" },
  { label: "Nannies", icon: "👶", count: 140, color: "#DB2777" },
  { label: "Drivers", icon: "🚗", count: 120, color: G.green },
  { label: "Gardeners", icon: "🌿", count: 72, color: "#65A30D" },
];

const SOCIETY_WORKERS = [
  { id: 1, name: "Rekha Devi", role: "Domestic Helper", flats: ["A-203", "B-105", "C-310"], verified: true, score: 4.8, status: "active", avi: "RD", color: "#0D9488", entryToday: true, lastSeen: "08:42 AM" },
  { id: 2, name: "Rajan Kumar", role: "Plumber", flats: ["Society"], verified: true, score: 4.6, status: "active", avi: "RK", color: "#2563EB", entryToday: false, lastSeen: "Yesterday" },
  { id: 3, name: "Suresh Nair", role: "Security Guard", flats: ["Gate 1"], verified: true, score: 4.9, status: "active", avi: "SN", color: "#7C3AED", entryToday: true, lastSeen: "On Duty" },
  { id: 4, name: "Mohan Lal", role: "Gardener", flats: ["Society"], verified: false, score: 0, status: "pending", avi: "ML", color: "#65A30D", entryToday: false, lastSeen: "Pending verification" },
];

const EMPLOYER_JOBS = [
  { id: 1, workerName: "Rekha Devi", role: "Cook & House Help", start: "Jan 2024", end: "Ongoing", status: "active", rated: false, wId: 1, avi: "RD", color: "#0D9488" },
  { id: 2, workerName: "Rajan Kumar", role: "Plumber", start: "Nov 2023", end: "Nov 2023", status: "completed", rated: true, wId: 2, avi: "RK", color: "#2563EB", givenRating: 5, givenReview: "Excellent work, fixed everything in one visit." },
  { id: 3, workerName: "Priya Hegde", role: "Babysitter", start: "Jun 2023", end: "Aug 2023", status: "completed", rated: false, wId: 6, avi: "PH", color: "#DB2777" },
];

/* ── NAVIGATION ────────────────────────────────────────────────── */
function Nav({ page, setPage, user, setUser }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = !user
    ? [["search", "Find Workers"], ["for-societies", "For Societies"], ["for-workers", "For Workers"]]
    : user.type === "worker"
    ? [["worker-dashboard", "My Profile"], ["search", "Browse"]]
    : user.type === "society"
    ? [["society-dashboard", "Society Hub"], ["search", "Find Workers"]]
    : user.type === "employer"
    ? [["employer-dashboard", "Dashboard"], ["search", "Find Workers"]]
    : [["admin", "Admin Panel"], ["search", "Browse"]];

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 999, background: G.white,
      borderBottom: `1px solid ${scrolled ? G.border : "transparent"}`,
      boxShadow: scrolled ? G.shadow : "none",
      padding: "0 40px", height: 64,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      transition: "box-shadow .2s, border-color .2s",
      fontFamily: "Sora, system-ui, sans-serif",
    }}>
      {/* Logo */}
      <div onClick={() => setPage("landing")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${G.teal}, ${G.tealDark})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 3px 10px ${G.teal}44` }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" fill="white" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <path d="M17 11l1.5 1.5L21 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span style={{ fontSize: 16, fontWeight: 800, color: G.ink, letterSpacing: -.3 }}>Shramik<span style={{ color: G.teal }}>.</span></span>
      </div>

      {/* Links */}
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {links.map(([p, l]) => (
          <button key={p} onClick={() => setPage(p)} className="nav-link"
            style={{ background: "none", border: "none", cursor: "pointer", padding: "8px 14px", fontSize: 14, fontWeight: 600, color: page === p ? G.teal : G.body, fontFamily: "Sora, system-ui, sans-serif", borderRadius: G.r, transition: "color .15s" }}>
            {l}
          </button>
        ))}
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {!user ? (
          <>
            <button onClick={() => setPage("auth")} style={btnGhost({ padding: "9px 18px", fontSize: 13 })} className="btn-ghost">Login</button>
            <button onClick={() => setPage("auth")} style={btnPrimary({ padding: "9px 18px", fontSize: 13 })} className="btn-primary">Get Started Free</button>
          </>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: G.bg, border: `1px solid ${G.border}`, borderRadius: G.r, padding: "7px 12px" }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: G.teal, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff" }}>{user.name[0]}</div>
              <span style={{ fontSize: 13, color: G.ink, fontWeight: 500 }}>{user.name}</span>
              <Tag label={user.type} color={user.type === "society" ? G.indigo : G.teal} />
            </div>
            <button onClick={() => { setUser(null); setPage("landing"); }} style={btnGhost({ padding: "8px 14px", fontSize: 12 })} className="btn-ghost">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

/* ══════════════════════════════════════════════════════════════════
   PAGE: LANDING
══════════════════════════════════════════════════════════════════ */
function Landing({ setPage, setUser }) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    { name: "Anita Krishnamurthy", role: "Secretary, Prestige Lakeside Habitat, Bengaluru", text: "We switched from WhatsApp groups to Shramik for our 240-flat society. Every worker entering our gate is now verified. The residents finally feel at ease.", avi: "AK", color: G.indigo },
    { name: "Ramesh Iyer", role: "Resident, Sobha City, Mumbai", text: "Found our current cook in 20 minutes. Saw her 4.9 rating and 28 reviews before she even walked in. No more uncomfortable trial periods.", avi: "RI", color: G.teal },
    { name: "Rekha Devi", role: "Domestic Worker, Hyderabad", text: "Pehle log poochte the — 'koi reference hai kya?' Ab main profile dikhaati hoon. 5 star hai. Khud kaam maangne aate hain ab.", avi: "RD", color: G.amber },
  ];

  const painPoints = [
    { who: "For Societies 🏢", icon: "🔍", pain: "Can't vet every worker entering the gate", fix: "Every worker has a verified, govt-ID linked profile before entry." },
    { who: "For Families 👨‍👩‍👧", icon: "🤝", pain: "Finding reliable help is pure word-of-mouth luck", fix: "Browse verified profiles with real employer ratings in 2 minutes." },
    { who: "For Workers 👷", icon: "📱", pain: "Years of good work go unrecognised when you change employers", fix: "Your ratings follow you. Your reputation is yours to keep." },
  ];

  const features = [
    { icon: "✅", title: "Govt. ID Verified Profiles", desc: "Every worker is Aadhaar-verified before their profile goes live. Background check included.", color: G.teal },
    { icon: "⭐", title: "Tamper-Proof Ratings", desc: "Only real, verified employers can rate. Once given, ratings cannot be deleted.", color: G.gold },
    { icon: "📲", title: "WhatsApp-Shareable Profile", desc: "Worker shares their profile link on WhatsApp. You see their entire work history instantly.", color: "#10B981" },
    { icon: "🏢", title: "Society Worker Registry", desc: "One dashboard for your RWA to see every worker entering your complex.", color: G.indigo },
    { icon: "🔐", title: "Secure RBAC System", desc: "Workers and employers have separate, secure access. No data mixing, ever.", color: "#7C3AED" },
    { icon: "📊", title: "Hire History & Analytics", desc: "Track all your past hires, ratings given, and active workers in one place.", color: G.amber },
  ];

  const howItWorks = [
    { step: "1", icon: "📱", title: "Register with phone", sub: "Workers: 2-min signup with Aadhaar. Families: login instantly.", color: G.teal },
    { step: "2", icon: "✅", title: "Profile goes live", sub: "Our team verifies ID. Background check processed. Profile published.", color: G.indigo },
    { step: "3", icon: "🤝", title: "Work & earn ratings", sub: "Every job adds a verified employer review to your permanent record.", color: G.amber },
    { step: "4", icon: "📈", title: "Reputation compounds", sub: "Higher Trust Score = more work, better pay, first-access to premium jobs.", color: "#10B981" },
  ];

  return (
    <div style={{ fontFamily: "Sora, system-ui, sans-serif", background: G.white }}>
      {/* ── HERO ── */}
      <section style={{ padding: "90px 40px 80px", background: G.white, position: "relative", overflow: "hidden" }}>
        {/* background shape */}
        <div style={{ position: "absolute", top: -120, right: -160, width: 600, height: 600, borderRadius: "50%", background: G.tealBg, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -80, left: -100, width: 400, height: 400, borderRadius: "50%", background: G.indigoBg, pointerEvents: "none" }} />

        <div style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", position: "relative" }}>
          <div className="fade-up">
            <div style={{ ...row("center", "flex-start", 8), marginBottom: 22 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: G.green, display: "inline-block", animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: G.green, letterSpacing: 1 }}>1,247 VERIFIED WORKERS · LIVE</span>
            </div>
            <h1 style={{ fontSize: 56, fontWeight: 800, color: G.ink, lineHeight: 1.08, letterSpacing: -2, marginBottom: 10 }}>
              The Trusted Worker<br />Network for <span style={{ color: G.teal }}>Modern India.</span>
            </h1>
            <p style={{ fontSize: 17, color: G.muted, lineHeight: 1.7, maxWidth: 480, marginBottom: 36 }}>
              Find verified domestic workers, plumbers, cooks, and security staff — with real employer ratings and background checks. Built for apartment societies.
            </p>
            <div style={row("center", "flex-start", 12)}>
              <button onClick={() => setPage("search")} style={btnPrimary({ padding: "14px 28px", fontSize: 15 })} className="btn-primary">
                Find Workers →
              </button>
              <button onClick={() => { setUser({ name: "Prestige Society", type: "society", id: 99 }); setPage("society-dashboard"); }}
                style={btnIndigo({ padding: "14px 26px", fontSize: 15 })} className="btn-primary">
                For Societies
              </button>
            </div>
            <div style={{ ...row("center", "flex-start", 20), marginTop: 28 }}>
              {[["1,247", "Verified Workers"], ["892", "Families Served"], ["4.8★", "Avg. Rating"]].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: G.ink }}>{n}</div>
                  <div style={{ fontSize: 12, color: G.muted }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero card */}
          <div style={{ position: "relative" }}>
            <div style={{ ...card(24), boxShadow: G.shadowLg, maxWidth: 340 }}>
              <div style={{ ...row("flex-start", "flex-start", 14), marginBottom: 16 }}>
                <Avi initials="RD" color="#0D9488" size={58} r={14} />
                <div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: G.ink }}>Rekha Devi</div>
                  <div style={{ fontSize: 13, color: G.muted }}>Domestic Helper · Hyderabad</div>
                  <div style={{ ...row("center", "flex-start", 6), marginTop: 5 }}>
                    <Tag label="✓ Verified" color={G.teal} />
                    <Tag label="Aadhaar" color={G.green} />
                  </div>
                </div>
              </div>
              {/* skills */}
              <div style={{ ...row("center", "flex-start", 6), flexWrap: "wrap", marginBottom: 14 }}>
                {["Cooking", "Cleaning", "Child Care"].map(s => <Tag key={s} label={s} color={G.indigo} />)}
              </div>
              {/* score */}
              <div style={{ background: G.bg, borderRadius: G.r, padding: "12px 14px", marginBottom: 14 }}>
                <div style={{ ...row("center", "space-between"), marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: G.muted, fontWeight: 500 }}>Trust Score</span>
                  <ScorePill score={4.8} count={34} />
                </div>
                <Stars score={4.8} size={15} />
                <div style={{ fontSize: 12, color: G.muted, marginTop: 4 }}>34 employer-verified reviews</div>
              </div>
              {/* quick stats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
                {[["7 yrs", "Exp."], ["3", "Employers"], ["98%", "Completion"]].map(([v, l]) => (
                  <div key={l} style={{ background: G.bg, borderRadius: 9, padding: "10px 6px", textAlign: "center", border: `1px solid ${G.border}` }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: G.teal }}>{v}</div>
                    <div style={{ fontSize: 10, color: G.muted }}>{l}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => setPage("search")} style={{ ...btnPrimary(), width: "100%", padding: "11px" }}>View Full Profile →</button>
            </div>
            {/* floating chips */}
            <div style={{ position: "absolute", top: -16, right: -40, background: G.white, border: `1px solid ${G.border}`, borderRadius: 12, padding: "9px 14px", boxShadow: G.shadow, fontSize: 12, color: G.muted, transform: "rotate(2deg)" }}>
              ⭐ "Hired in 20 minutes!"
            </div>
            <div style={{ position: "absolute", bottom: 30, right: -50, background: G.white, border: `1px solid ${G.border}`, borderRadius: 12, padding: "9px 14px", boxShadow: G.shadow, fontSize: 12, color: G.muted, transform: "rotate(-1.5deg)" }}>
              🛡️ Background verified
            </div>
          </div>
        </div>
      </section>

      {/* ── LOGOS / SOCIAL PROOF ── */}
      <div style={{ background: G.bg, borderTop: `1px solid ${G.border}`, borderBottom: `1px solid ${G.border}`, padding: "18px 40px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", ...row("center", "space-between") }}>
          <span style={{ fontSize: 12, color: G.muted, fontWeight: 500, whiteSpace: "nowrap" }}>Trusted by societies across India</span>
          {["Prestige Group", "DLF Residencies", "Brigade Society", "Lodha Complexes", "Sobha Living"].map(s => (
            <span key={s} style={{ fontSize: 13, fontWeight: 600, color: G.borderDark, opacity: .7 }}>{s}</span>
          ))}
        </div>
      </div>

      {/* ── PAIN POINTS ── */}
      <section style={{ padding: "80px 40px", background: G.white }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: G.teal, letterSpacing: 2, marginBottom: 10 }}>THE PROBLEM</div>
            <h2 style={{ fontSize: 38, fontWeight: 800, color: G.ink, letterSpacing: -1, lineHeight: 1.15 }}>Finding reliable help shouldn't be<br />a leap of faith.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }}>
            {painPoints.map((p, i) => (
              <div key={i} style={{ ...card(28), borderTop: `3px solid ${[G.indigo, G.teal, G.amber][i]}` }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: [G.indigo, G.teal, G.amber][i], letterSpacing: 1, marginBottom: 10 }}>{p.who}</div>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{p.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: G.ink, marginBottom: 8 }}>"{p.pain}"</div>
                <div style={{ height: 1, background: G.border, margin: "14px 0" }} />
                <div style={{ fontSize: 13, color: G.body, lineHeight: 1.65 }}>✓ &nbsp;{p.fix}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section style={{ padding: "72px 40px", background: G.bg }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ ...row("flex-end", "space-between"), marginBottom: 40 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: G.teal, letterSpacing: 2, marginBottom: 8 }}>BROWSE BY CATEGORY</div>
              <h2 style={{ fontSize: 34, fontWeight: 800, color: G.ink, letterSpacing: -1 }}>Find any kind of help</h2>
            </div>
            <button onClick={() => setPage("search")} style={btnGhost({ padding: "10px 20px" })} className="btn-ghost">View All →</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            {CATEGORIES.map(c => (
              <div key={c.label} onClick={() => setPage("search")} className="hover-lift"
                style={{ ...card(22), cursor: "pointer", textAlign: "center", borderTop: `3px solid ${c.color}` }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>{c.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: G.ink, marginBottom: 4 }}>{c.label}</div>
                <div style={{ fontSize: 12, color: G.muted }}>{c.count}+ workers</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: "80px 40px", background: G.white }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: G.teal, letterSpacing: 2, marginBottom: 10 }}>HOW IT WORKS</div>
            <h2 style={{ fontSize: 38, fontWeight: 800, color: G.ink, letterSpacing: -1 }}>From unknown to trusted in days.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, position: "relative" }}>
            <div style={{ position: "absolute", top: 35, left: "13%", right: "13%", height: 2, background: `linear-gradient(90deg, ${G.teal}, ${G.indigo})`, opacity: .25, pointerEvents: "none" }} />
            {howItWorks.map((h, i) => (
              <div key={i} style={{ ...card(26), position: "relative" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: h.color + "18", border: `1.5px solid ${h.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16 }}>{h.icon}</div>
                <div style={{ position: "absolute", top: 14, right: 18, fontSize: 22, fontWeight: 800, color: G.border }}>{h.step}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: G.ink, marginBottom: 7 }}>{h.title}</div>
                <div style={{ fontSize: 13, color: G.muted, lineHeight: 1.65 }}>{h.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: "80px 40px", background: G.bg }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: G.teal, letterSpacing: 2, marginBottom: 10 }}>PLATFORM FEATURES</div>
            <h2 style={{ fontSize: 38, fontWeight: 800, color: G.ink, letterSpacing: -1 }}>Everything you need.<br />Nothing you don't.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {features.map((f, i) => (
              <div key={i} style={{ ...card(26) }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: f.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16 }}>{f.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: G.ink, marginBottom: 7 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: G.muted, lineHeight: 1.65 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: "80px 40px", background: G.white }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: G.teal, letterSpacing: 2, marginBottom: 10 }}>WHAT PEOPLE SAY</div>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: G.ink, letterSpacing: -1 }}>Real stories. Real impact.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ ...card(26), borderTop: i === 0 ? `3px solid ${G.indigo}` : i === 1 ? `3px solid ${G.teal}` : `3px solid ${G.amber}` }}>
                <Stars score={5} size={15} />
                <p style={{ fontSize: 14, color: G.body, lineHeight: 1.7, margin: "14px 0 18px", fontStyle: "italic" }}>"{t.text}"</p>
                <div style={row("center", "flex-start", 10)}>
                  <Avi initials={t.avi} color={t.color} size={38} r={10} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: G.ink }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: G.muted }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SPLIT ── */}
      <section style={{ padding: "80px 40px", background: G.bg, borderTop: `1px solid ${G.border}` }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Society */}
          <div style={{ ...card(36), borderTop: `3px solid ${G.indigo}`, background: G.indigoBg, border: `1px solid ${G.indigoBorder}`, borderTop: `3px solid ${G.indigo}` }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>🏢</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: G.ink, marginBottom: 8 }}>Register your Society</div>
            <div style={{ fontSize: 14, color: G.muted, lineHeight: 1.7, marginBottom: 24 }}>
              Get a centralised dashboard for all workers in your complex. Verify who enters, manage the registry, and keep residents safe.
            </div>
            <button onClick={() => { setUser({ name: "Prestige Society", type: "society", id: 99 }); setPage("society-dashboard"); }}
              style={btnIndigo({ padding: "13px 26px", fontSize: 15 })} className="btn-primary">
              Set Up Society Hub →
            </button>
          </div>
          {/* Worker */}
          <div style={{ ...card(36), borderTop: `3px solid ${G.amber}`, background: G.amberBg, border: `1px solid ${G.amberBorder}`, borderTop: `3px solid ${G.amber}` }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>👷</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: G.ink, marginBottom: 8 }}>Build your Profile</div>
            <div style={{ fontSize: 14, color: G.muted, lineHeight: 1.7, marginBottom: 24 }}>
              Create your verified work identity. Your Trust Score travels with you. Get hired faster and access better-paying jobs.
            </div>
            <button onClick={() => setPage("for-workers")} style={{ background: `linear-gradient(135deg, ${G.amber}, ${G.amberDark})`, color: "#fff", border: "none", borderRadius: G.r, padding: "13px 26px", fontSize: 15, fontWeight: 700, fontFamily: "Sora, system-ui, sans-serif", cursor: "pointer", boxShadow: `0 3px 12px ${G.amber}44` }} className="btn-primary">
              Start Building →
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: G.ink, padding: "40px 40px 28px", fontFamily: "Sora, system-ui, sans-serif" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", ...row("flex-start", "space-between") }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 8 }}>Shramik<span style={{ color: G.teal }}>.</span></div>
            <div style={{ fontSize: 13, color: "#64748B", maxWidth: 260, lineHeight: 1.65 }}>The trusted worker network for apartment societies and modern Indian families.</div>
          </div>
          {[["Product", ["Find Workers", "For Societies", "For Workers", "Pricing"]], ["Company", ["About", "Blog", "Careers", "Contact"]], ["Legal", ["Privacy Policy", "Terms", "Safety"]]].map(([heading, items]) => (
            <div key={heading}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#94A3B8", letterSpacing: 1, marginBottom: 14 }}>{heading.toUpperCase()}</div>
              {items.map(item => <div key={item} style={{ fontSize: 13, color: "#64748B", marginBottom: 8, cursor: "pointer" }}>{item}</div>)}
            </div>
          ))}
        </div>
        <div style={{ maxWidth: 1120, margin: "24px auto 0", paddingTop: 20, borderTop: "1px solid #1E3A5F", ...row("center", "space-between") }}>
          <span style={{ fontSize: 12, color: "#475569" }}>© 2025 Shramik Technologies Pvt. Ltd.</span>
          <span style={{ fontSize: 12, color: "#475569" }}>Made with care for 500 million informal workers of India</span>
        </div>
      </footer>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   PAGE: FOR SOCIETIES
══════════════════════════════════════════════════════════════════ */
function ForSocieties({ setPage, setUser }) {
  const features = [
    { icon: "🗂️", title: "Centralized Worker Registry", desc: "See every domestic worker, plumber, guard, and contractor operating in your society — verified and organized." },
    { icon: "🚪", title: "Gate Entry Management", desc: "Security guards approve worker entry using verified Shramik IDs. No unknown faces." },
    { icon: "🚨", title: "Instant Alerts", desc: "Get notified when a worker with a safety flag tries to enter your complex." },
    { icon: "📋", title: "Resident Feedback", desc: "Residents rate workers within the society. Problematic workers are flagged." },
    { icon: "📊", title: "Monthly Reports", desc: "Full audit trail — who entered, when, which flat, verified or not." },
    { icon: "📲", title: "WhatsApp Integration", desc: "Workers show their Shramik QR at gate. Guard scans, instantly sees full profile." },
  ];
  const plans = [
    { name: "Starter", price: "₹0", period: "Free forever", features: ["Up to 50 worker profiles", "Basic registry view", "Resident app access", "Email support"], color: G.teal, cta: "Get Started Free" },
    { name: "Society Pro", price: "₹2,999", period: "per month", features: ["Unlimited worker profiles", "Gate entry management", "Instant alerts system", "Monthly audit reports", "Priority support", "Custom society branding"], color: G.indigo, cta: "Start Free Trial", popular: true },
    { name: "Enterprise", price: "Custom", period: "Multi-society", features: ["Multiple complexes", "Dedicated account manager", "API access", "Custom integrations", "SLA guarantee"], color: G.ink, cta: "Contact Sales" },
  ];

  return (
    <div style={{ fontFamily: "Sora, system-ui, sans-serif", background: G.white }}>
      {/* Hero */}
      <section style={{ padding: "80px 40px", background: `linear-gradient(135deg, ${G.indigoBg}, ${G.white})`, borderBottom: `1px solid ${G.indigoBorder}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>
          <div>
            <Tag label="FOR APARTMENT SOCIETIES & RWAS" color={G.indigo} />
            <h1 style={{ fontSize: 48, fontWeight: 800, color: G.ink, letterSpacing: -1.5, lineHeight: 1.1, margin: "20px 0 16px" }}>
              Your society's<br /><span style={{ color: G.indigo }}>security backbone.</span>
            </h1>
            <p style={{ fontSize: 16, color: G.muted, lineHeight: 1.75, marginBottom: 32, maxWidth: 460 }}>
              Stop relying on WhatsApp forwards and unverified references. Give every resident peace of mind with a fully managed, verified worker network.
            </p>
            <div style={row("center", "flex-start", 14)}>
              <button onClick={() => { setUser({ name: "Prestige Society", type: "society", id: 99 }); setPage("society-dashboard"); }}
                style={btnIndigo({ padding: "14px 28px", fontSize: 15 })} className="btn-primary">
                Set Up Your Society →
              </button>
              <button style={btnGhost({ padding: "14px 22px", fontSize: 14 })} className="btn-ghost">View Demo</button>
            </div>
          </div>
          {/* Society stats card */}
          <div style={{ ...card(28), border: `1px solid ${G.indigoBorder}`, boxShadow: G.shadowLg }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: G.muted, marginBottom: 16 }}>Prestige Lakeside Habitat · Bengaluru</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
              {[["240", "Flats"], ["48", "Registered Workers"], ["12", "Entries Today"], ["0", "Unverified Entries"]].map(([v, l]) => (
                <div key={l} style={{ background: G.bg, borderRadius: G.r, padding: "14px 16px" }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: G.indigo }}>{v}</div>
                  <div style={{ fontSize: 12, color: G.muted }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ ...row("center", "space-between"), padding: "12px 14px", background: G.greenBg, border: `1px solid ${G.greenBorder}`, borderRadius: G.r, marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: G.green }}>✓ All 12 entries today are verified</span>
              <span style={{ fontSize: 11, color: G.green }}>LIVE</span>
            </div>
            <div style={{ fontSize: 12, color: G.muted, textAlign: "center" }}>Live data from your society dashboard</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "72px 40px", background: G.bg }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: 34, fontWeight: 800, color: G.ink, letterSpacing: -1, marginBottom: 12 }}>Built for how societies actually work</h2>
            <p style={{ fontSize: 15, color: G.muted, maxWidth: 500, margin: "0 auto" }}>From the secretary's desk to the security gate — Shramik covers every touchpoint.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
            {features.map((f, i) => (
              <div key={i} style={card(26)}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: G.ink, marginBottom: 7 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: G.muted, lineHeight: 1.65 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: "72px 40px", background: G.white }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: 34, fontWeight: 800, color: G.ink, letterSpacing: -1, marginBottom: 10 }}>Simple, honest pricing</h2>
            <p style={{ fontSize: 15, color: G.muted }}>No hidden fees. Cancel anytime.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, alignItems: "start" }}>
            {plans.map((p, i) => (
              <div key={i} style={{ ...card(28), border: p.popular ? `2px solid ${G.indigo}` : `1px solid ${G.border}`, position: "relative" }}>
                {p.popular && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: G.indigo, color: "#fff", borderRadius: 20, padding: "4px 14px", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>MOST POPULAR</div>}
                <div style={{ fontSize: 16, fontWeight: 700, color: G.ink, marginBottom: 6 }}>{p.name}</div>
                <div style={{ fontSize: 36, fontWeight: 800, color: p.color, lineHeight: 1, marginBottom: 4 }}>{p.price}</div>
                <div style={{ fontSize: 13, color: G.muted, marginBottom: 20 }}>{p.period}</div>
                {p.features.map(f => <div key={f} style={{ ...row("center", "flex-start", 8), marginBottom: 9 }}><span style={{ color: G.teal }}>✓</span><span style={{ fontSize: 13, color: G.body }}>{f}</span></div>)}
                <button style={{ ...(p.popular ? btnIndigo() : btnGhost()), width: "100%", padding: "12px", marginTop: 20 }} className={p.popular ? "btn-primary" : "btn-ghost"}>{p.cta}</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   PAGE: FOR WORKERS
══════════════════════════════════════════════════════════════════ */
function ForWorkers({ setPage }) {
  const benefits = [
    { icon: "⭐", title: "Build a career record", desc: "Every employer you work with can leave a verified rating. Your 5-star reviews stay with you forever — even when you change jobs.", color: G.gold },
    { icon: "📲", title: "Share via WhatsApp", desc: "Send your profile link on WhatsApp. Employers see your full verified work history before they even call you.", color: G.green },
    { icon: "💰", title: "Earn better wages", desc: "Workers with a 4.5+ Trust Score earn 30–40% more than unverified workers. Your profile pays for itself.", color: G.amber },
    { icon: "🏦", title: "Access credit & schemes", desc: "Your verified work history becomes proof of income. Banks and microfinance institutions accept your Shramik profile.", color: G.indigo },
    { icon: "🛡️", title: "You own your data", desc: "Unlike other platforms, your profile belongs to you — not us. Take it anywhere, anytime, forever.", color: G.teal },
    { icon: "🤝", title: "Society preferred status", desc: "Registered societies give priority entry to Shramik-verified workers. Fewer checks, faster entry every day.", color: "#7C3AED" },
  ];

  const steps = [
    { step: "1", title: "Register with mobile", desc: "Just your phone number. Free. Takes 2 minutes.", icon: "📱" },
    { step: "2", title: "Add Aadhaar", desc: "We verify your identity. Your profile gets the ✓ badge.", icon: "🪪" },
    { step: "3", title: "Start working", desc: "Show your QR code to employers. Get rated after every job.", icon: "💼" },
    { step: "4", title: "Watch your score grow", desc: "More ratings = more work. Your Trust Score is your brand.", icon: "📈" },
  ];

  return (
    <div style={{ fontFamily: "Sora, system-ui, sans-serif", background: G.white }}>
      {/* Hero */}
      <section style={{ padding: "80px 40px", background: `linear-gradient(135deg, ${G.amberBg}, ${G.white})`, borderBottom: `1px solid ${G.amberBorder}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>
          <div>
            <Tag label="FOR WORKERS · DOMESTIC · PLUMBERS · GUARDS · COOKS" color={G.amber} />
            <h1 style={{ fontSize: 46, fontWeight: 800, color: G.ink, letterSpacing: -1.5, lineHeight: 1.1, margin: "20px 0 16px" }}>
              Your work history,<br /><span style={{ color: G.amber }}>finally on record.</span>
            </h1>
            <p style={{ fontSize: 16, color: G.muted, lineHeight: 1.75, marginBottom: 32, maxWidth: 440 }}>
              You've worked hard for years. Now let your reputation do the talking. Build a verified profile that gets you hired faster — and paid better.
            </p>
            <div style={row("center", "flex-start", 14)}>
              <button onClick={() => setPage("auth")} style={{ background: `linear-gradient(135deg, ${G.amber}, ${G.amberDark})`, color: "#fff", border: "none", borderRadius: G.r, padding: "14px 28px", fontSize: 15, fontWeight: 700, fontFamily: "Sora, system-ui, sans-serif", cursor: "pointer", boxShadow: `0 3px 12px ${G.amber}44` }} className="btn-primary">
                Create Free Profile →
              </button>
              <span style={{ fontSize: 13, color: G.muted }}>No cost. No middleman.</span>
            </div>
          </div>
          {/* Worker profile preview */}
          <div>
            <div style={{ ...card(24), boxShadow: G.shadowLg, maxWidth: 330 }}>
              <div style={{ ...row("center", "space-between"), marginBottom: 16 }}>
                <div style={{ ...row("flex-start", "flex-start", 12) }}>
                  <Avi initials="RD" color="#0D9488" size={52} r={13} />
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: G.ink }}>Rekha Devi</div>
                    <div style={{ fontSize: 12, color: G.muted }}>Domestic Helper</div>
                    <Tag label="✓ Verified" color={G.teal} />
                  </div>
                </div>
                <ScorePill score={4.8} count={34} />
              </div>
              {/* Progress */}
              <div style={{ background: G.tealBg, border: `1px solid ${G.tealBorder}`, borderRadius: G.r, padding: "12px 14px", marginBottom: 14 }}>
                <div style={{ ...row("center", "space-between"), marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: G.teal }}>Profile Strength</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: G.teal }}>88%</span>
                </div>
                <div style={{ width: "100%", height: 8, background: G.tealBorder, borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: "88%", height: "100%", background: `linear-gradient(90deg, ${G.teal}, ${G.tealLight})`, borderRadius: 4 }} />
                </div>
              </div>
              {/* reviews */}
              {[{emp:"Sharma Family", r:5, text:"Outstanding cook. Completely trustworthy."}, {emp:"Mehta Residence", r:5, text:"Never missed a single day in 18 months."}].map((j, i) => (
                <div key={i} style={{ background: G.bg, borderRadius: G.r, padding: "10px 12px", marginBottom: 8 }}>
                  <div style={{ ...row("center", "space-between"), marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: G.ink }}>{j.emp}</span>
                    <Stars score={j.r} size={11} />
                  </div>
                  <div style={{ fontSize: 12, color: G.muted, fontStyle: "italic" }}>"{j.text}"</div>
                </div>
              ))}
              <div style={{ ...row("center", "center", 6), marginTop: 12, padding: "8px", background: G.amberBg, borderRadius: G.r }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: G.amber }}>💰 Earns ₹14,000/mo · Up from ₹9,000</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section style={{ padding: "72px 40px", background: G.bg }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: G.ink, textAlign: "center", marginBottom: 44, letterSpacing: -1 }}>Simple steps to start</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ ...card(24), textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{s.icon}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: G.border, marginBottom: 8 }}>{s.step}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: G.ink, marginBottom: 6 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: G.muted, lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section style={{ padding: "72px 40px", background: G.white }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: G.ink, textAlign: "center", marginBottom: 44, letterSpacing: -1 }}>Why workers choose Shramik</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {benefits.map((b, i) => (
              <div key={i} style={{ ...card(26), borderLeft: `3px solid ${b.color}` }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{b.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: G.ink, marginBottom: 8 }}>{b.title}</div>
                <div style={{ fontSize: 13, color: G.muted, lineHeight: 1.65 }}>{b.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "60px 40px", background: `linear-gradient(135deg, ${G.amberBg}, ${G.tealBg})`, borderTop: `1px solid ${G.amberBorder}` }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: G.ink, marginBottom: 12, letterSpacing: -1 }}>Ready to build your profile?</h2>
          <p style={{ fontSize: 15, color: G.muted, marginBottom: 28 }}>Free forever. Your data is yours. Takes 2 minutes.</p>
          <button onClick={() => setPage("auth")} style={{ background: `linear-gradient(135deg, ${G.amber}, ${G.amberDark})`, color: "#fff", border: "none", borderRadius: G.r, padding: "15px 36px", fontSize: 16, fontWeight: 700, fontFamily: "Sora, system-ui, sans-serif", cursor: "pointer" }}>Create Free Profile →</button>
        </div>
      </section>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   PAGE: AUTH
══════════════════════════════════════════════════════════════════ */
function Auth({ setPage, setUser }) {
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("worker");
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [job, setJob] = useState("");
  const [city, setCity] = useState("");

  const handleVerify = () => {
    if (otp.length >= 4) {
      if (mode === "login") {
        const map = { worker: { name: "Rekha Devi", type: "worker", id: 1 }, employer: { name: "Ramesh Sharma", type: "employer", id: 99 }, society: { name: "Prestige Society", type: "society", id: 98 }, admin: { name: "Admin", type: "admin", id: 0 } };
        const u = map[role];
        setUser(u);
        setPage(role === "worker" ? "worker-dashboard" : role === "employer" ? "employer-dashboard" : role === "society" ? "society-dashboard" : "admin");
      } else setStep(3);
    }
  };

  const handleCreate = () => {
    if (name.length > 1) {
      const u = { name, type: role, id: Date.now() };
      setUser(u);
      setPage(role === "worker" ? "worker-dashboard" : role === "employer" ? "employer-dashboard" : "society-dashboard");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: G.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Sora, system-ui, sans-serif", padding: 20 }}>
      <div style={{ width: 440, ...card(0), overflow: "hidden", boxShadow: G.shadowLg }}>
        {/* Top */}
        <div style={{ background: G.ink, padding: "28px 32px 22px" }}>
          <div style={{ fontSize: 21, fontWeight: 800, color: "#fff", marginBottom: 4 }}>
            {mode === "login" ? "Welcome back" : "Join Shramik"}
          </div>
          <div style={{ fontSize: 13, color: "#94A3B8" }}>
            {mode === "login" ? "Log in to your account" : "Create your trusted work profile"}
          </div>
          <div style={{ display: "flex", marginTop: 18, background: "#0F2044", borderRadius: 10, padding: 4 }}>
            {["login", "register"].map(m => (
              <button key={m} onClick={() => { setMode(m); setStep(1); }} style={{ flex: 1, padding: "8px", borderRadius: 8, border: "none", cursor: "pointer", background: mode === m ? G.teal : "transparent", color: mode === m ? "#fff" : "#64748B", fontSize: 13, fontWeight: 700, fontFamily: "Sora, system-ui, sans-serif", transition: "all .2s", textTransform: "capitalize" }}>
                {m === "login" ? "Log In" : "Register"}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: "24px 32px" }}>
          {/* Role */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: G.muted, letterSpacing: 1, marginBottom: 10, textTransform: "uppercase" }}>I am a</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {[{ v: "worker", e: "👷", l: "Worker" }, { v: "employer", e: "🏘️", l: "Family" }, { v: "society", e: "🏢", l: "Society" }, { v: "admin", e: "⚙️", l: "Admin" }].map(r => (
                <div key={r.v} onClick={() => setRole(r.v)} style={{ padding: "10px 6px", borderRadius: G.r, cursor: "pointer", border: `2px solid ${role === r.v ? G.teal : G.border}`, background: role === r.v ? G.tealBg : "transparent", textAlign: "center", transition: "all .15s" }}>
                  <div style={{ fontSize: 18 }}>{r.e}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: role === r.v ? G.teal : G.body, marginTop: 3 }}>{r.l}</div>
                </div>
              ))}
            </div>
          </div>

          {step === 1 && (
            <>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, color: G.muted, marginBottom: 6, fontWeight: 600 }}>MOBILE NUMBER</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{ ...inp, width: 56, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: G.muted, fontSize: 13 }}>+91</div>
                  <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="98765 43210" maxLength={10} style={{ ...inp, flex: 1 }} />
                </div>
              </div>
              <button onClick={() => phone.length >= 10 && setStep(2)} style={{ ...btnPrimary(), width: "100%", padding: "13px" }} className="btn-primary">Send OTP →</button>
            </>
          )}

          {step === 2 && (
            <>
              <div style={{ background: G.tealBg, border: `1px solid ${G.tealBorder}`, borderRadius: G.r, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: G.teal, fontWeight: 500 }}>
                ✓ OTP sent to +91 {phone} &nbsp;<span style={{ color: G.muted, fontWeight: 400 }}>(demo: enter any 4 digits)</span>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 12, color: G.muted, marginBottom: 6, fontWeight: 600 }}>ENTER OTP</label>
                <input value={otp} onChange={e => setOtp(e.target.value)} placeholder="· · · ·" maxLength={4} style={{ ...inp, letterSpacing: 14, fontSize: 22, textAlign: "center" }} />
              </div>
              <button onClick={handleVerify} style={{ ...btnPrimary(), width: "100%", padding: "13px", marginBottom: 8 }} className="btn-primary">
                {mode === "login" ? "Log In →" : "Continue →"}
              </button>
              <button onClick={() => setStep(1)} style={{ ...btnGhost(), width: "100%", padding: "11px" }} className="btn-ghost">← Change Number</button>
            </>
          )}

          {step === 3 && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                {[["Full Name", name, setName, "Your full name", "1fr 1fr"], ["City", city, setCity, "e.g. Hyderabad", "1fr 1fr"]].map(([l, v, sv, p]) => (
                  <div key={l}>
                    <label style={{ display: "block", fontSize: 12, color: G.muted, marginBottom: 6, fontWeight: 600 }}>{l.toUpperCase()}</label>
                    <input value={v} onChange={e => sv(e.target.value)} placeholder={p} style={inp} />
                  </div>
                ))}
              </div>
              {role === "worker" && (
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: "block", fontSize: 12, color: G.muted, marginBottom: 6, fontWeight: 600 }}>YOUR WORK</label>
                  <input value={job} onChange={e => setJob(e.target.value)} placeholder="e.g. Cook, Plumber, Security Guard" style={inp} />
                </div>
              )}
              <button onClick={handleCreate} style={{ ...btnPrimary(), width: "100%", padding: "13px", marginTop: 8 }} className="btn-primary">
                Create Profile →
              </button>
            </>
          )}

          <div style={{ marginTop: 18, paddingTop: 16, borderTop: `1px solid ${G.border}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <span style={{ fontSize: 13, color: G.muted }}>Just browsing?</span>
            <span onClick={() => setPage("search")} style={{ fontSize: 13, color: G.teal, cursor: "pointer", fontWeight: 600 }}>Find workers →</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   PAGE: SEARCH / DIRECTORY
══════════════════════════════════════════════════════════════════ */
function Search({ setPage, setViewId }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [city, setCity] = useState("All");
  const [avail, setAvail] = useState("All");
  const [sort, setSort] = useState("score");
  const [layout, setLayout] = useState("grid");
  const cities = ["All", "Hyderabad", "Bengaluru", "Mumbai", "Chennai", "Delhi", "Pune"];
  const cats = ["All", ...new Set(WORKERS.map(w => w.role))];

  let results = WORKERS.filter(w =>
    (cat === "All" || w.role === cat) &&
    (city === "All" || w.city === city) &&
    (avail === "All" || w.avail === avail) &&
    (!q || w.name.toLowerCase().includes(q.toLowerCase()) || w.role.toLowerCase().includes(q.toLowerCase()) || w.skills.some(s => s.toLowerCase().includes(q.toLowerCase())))
  );
  if (sort === "score") results = [...results].sort((a, b) => b.score - a.score);
  else if (sort === "reviews") results = [...results].sort((a, b) => b.reviews - a.reviews);
  else if (sort === "exp") results = [...results].sort((a, b) => b.exp - a.exp);

  return (
    <div style={{ fontFamily: "Sora, system-ui, sans-serif", background: G.bg, minHeight: "100vh" }}>
      {/* Search header */}
      <div style={{ background: G.white, borderBottom: `1px solid ${G.border}`, padding: "24px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: G.ink, marginBottom: 16, letterSpacing: -.5 }}>Find Verified Workers</div>
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <div style={{ display: "flex", flex: 1, background: G.white, border: `1.5px solid ${G.border}`, borderRadius: G.r, overflow: "hidden", alignItems: "center" }}>
              <span style={{ padding: "0 12px", fontSize: 16 }}>🔍</span>
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name, role, skill..." style={{ ...inp, border: "none", flex: 1, padding: "11px 8px" }} />
            </div>
            <select value={cat} onChange={e => setCat(e.target.value)} style={{ ...inp, width: 170 }}>
              {cats.map(c => <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>)}
            </select>
            <select value={city} onChange={e => setCity(e.target.value)} style={{ ...inp, width: 150 }}>
              {cities.map(c => <option key={c} value={c}>{c === "All" ? "All Cities" : c}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 8 }}>
              {["All", "Available", "Busy"].map(a => (
                <button key={a} onClick={() => setAvail(a)} style={avail === a ? btnPrimary({ padding: "6px 14px", fontSize: 12 }) : btnGhost({ padding: "6px 14px", fontSize: 12 })} className={avail === a ? "btn-primary" : "btn-ghost"}>
                  {a === "All" ? "All Workers" : a}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <select value={sort} onChange={e => setSort(e.target.value)} style={{ ...inp, width: 170, padding: "7px 12px", fontSize: 13 }}>
                <option value="score">Highest Rated</option>
                <option value="reviews">Most Reviews</option>
                <option value="exp">Most Experience</option>
              </select>
              {["grid", "list"].map(l => (
                <button key={l} onClick={() => setLayout(l)} style={layout === l ? btnPrimary({ padding: "7px 11px", fontSize: 14 }) : btnGhost({ padding: "7px 11px", fontSize: 14 })}>{l === "grid" ? "⊞" : "☰"}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 40px" }}>
        <div style={{ fontSize: 13, color: G.muted, marginBottom: 18 }}>
          <strong style={{ color: G.ink }}>{results.length}</strong> verified worker{results.length !== 1 ? "s" : ""} found
          {cat !== "All" && <> · <span style={{ color: G.teal }}>{cat}</span></>}
        </div>

        {layout === "grid" ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
            {results.map(w => (
              <div key={w.id} onClick={() => { setViewId(w.id); setPage("worker-view"); }}
                className="hover-lift hover-teal"
                style={{ ...card(22), cursor: "pointer", borderTop: `3px solid ${w.color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <Avi initials={w.avi} color={w.color} size={48} r={12} />
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: G.ink }}>{w.name}</div>
                      <div style={{ fontSize: 12, color: G.muted }}>{w.role}</div>
                      <div style={{ fontSize: 11, color: G.muted }}>{w.area}, {w.city}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: w.avail === "Available" ? G.greenBg : G.amberBg, color: w.avail === "Available" ? G.green : G.amber, border: `1px solid ${w.avail === "Available" ? G.greenBorder : G.amberBorder}`, alignSelf: "flex-start", whiteSpace: "nowrap" }}>
                    {w.avail === "Available" ? "● Available" : "◑ Busy"}
                  </span>
                </div>
                <ScorePill score={w.score} count={w.reviews} />
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, margin: "10px 0 12px" }}>
                  {w.skills.slice(0, 3).map(s => <Tag key={s} label={s} color={G.indigo} />)}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12, borderTop: `1px solid ${G.border}` }}>
                  <span style={{ fontSize: 12, color: G.muted }}>{w.exp} yrs experience</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: G.green }}>{w.salary}</span>
                </div>
                {w.bgCheck && <div style={{ marginTop: 8 }}><Tag label="🛡 Background Check ✓" color={G.green} /></div>}
              </div>
            ))}
          </div>
        ) : (
          <div style={col(12)}>
            {results.map(w => (
              <div key={w.id} onClick={() => { setViewId(w.id); setPage("worker-view"); }}
                className="hover-teal"
                style={{ ...card(18), cursor: "pointer", display: "flex", gap: 18, alignItems: "center", transition: "border-color .15s" }}>
                <Avi initials={w.avi} color={w.color} size={56} r={14} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: G.ink }}>{w.name}</span>
                    {w.verified && <Tag label="✓ Verified" color={G.teal} />}
                    {w.bgCheck && <Tag label="🛡 BG Check" color={G.green} />}
                    <span style={{ fontSize: 11, color: w.avail === "Available" ? G.green : G.amber }}>● {w.avail}</span>
                  </div>
                  <div style={{ fontSize: 13, color: G.teal, marginBottom: 6 }}>{w.role} · {w.city} · {w.exp} yrs exp</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {w.skills.slice(0, 4).map(s => <Tag key={s} label={s} color={G.indigo} />)}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <ScorePill score={w.score} count={w.reviews} />
                  <div style={{ fontSize: 13, fontWeight: 700, color: G.green, marginTop: 6 }}>{w.salary}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        {results.length === 0 && <Empty icon="🔍" title="No workers found" sub="Try adjusting your filters or search terms" />}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   PAGE: WORKER PUBLIC VIEW
══════════════════════════════════════════════════════════════════ */
function WorkerView({ wId, setPage }) {
  const w = WORKERS.find(x => x.id === wId) || WORKERS[0];
  const [hireOpen, setHireOpen] = useState(false);
  const [hireDone, setHireDone] = useState(false);

  return (
    <div style={{ fontFamily: "Sora, system-ui, sans-serif", background: G.bg, minHeight: "100vh" }}>
      {/* Profile header */}
      <div style={{ background: G.white, borderBottom: `1px solid ${G.border}` }}>
        <div style={{ maxWidth: 980, margin: "0 auto", padding: "24px 40px" }}>
          <button onClick={() => setPage("search")} style={{ ...btnGhost({ padding: "7px 14px", fontSize: 12 }), marginBottom: 20 }} className="btn-ghost">← Back to Search</button>
          <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
            <div style={{ position: "relative" }}>
              <Avi initials={w.avi} color={w.color} size={88} r={20} />
              {w.verified && <div style={{ position: "absolute", bottom: -4, right: -4, width: 24, height: 24, borderRadius: "50%", background: G.teal, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, border: `2px solid ${G.white}` }}>✓</div>}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: G.ink, letterSpacing: -.5, margin: 0 }}>{w.name}</h1>
                {w.verified && <Tag label="✓ Verified" color={G.teal} />}
                {w.bgCheck && <Tag label="🛡 Background Check" color={G.green} />}
              </div>
              <div style={{ fontSize: 14, color: G.muted, marginBottom: 10 }}>{w.role} · {w.area}, {w.city} · {w.exp} yrs experience</div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <ScorePill score={w.score} count={w.reviews} />
                <Tag label={w.avail} color={w.avail === "Available" ? G.green : G.amber} />
                <Tag label={w.salary} color={G.green} />
                <Tag label={`Since ${w.since}`} color={G.muted} />
              </div>
            </div>
            <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              <button onClick={() => setHireOpen(true)} style={btnPrimary({ padding: "13px 28px", fontSize: 15 })} className="btn-primary">
                Hire {w.name.split(" ")[0]}
              </button>
              <button style={btnGhost({ padding: "10px 18px", fontSize: 13 })} className="btn-ghost">📲 Share Profile</button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 980, margin: "0 auto", padding: "28px 40px", display: "grid", gridTemplateColumns: "1fr 280px", gap: 22 }}>
        {/* Main */}
        <div style={col(18)}>
          <div style={card(24)}>
            <Section title="About">
              <p style={{ fontSize: 14, color: G.body, lineHeight: 1.75, margin: "0 0 16px" }}>{w.bio}</p>
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                {w.skills.map(s => <Tag key={s} label={s} color={G.indigo} />)}
              </div>
            </Section>
          </div>

          <div style={card(24)}>
            <Section title="Work History" sub="All ratings are employer-verified and permanent">
              {w.jobs.map((j, i) => (
                <div key={i} style={{ borderLeft: `3px solid ${w.color}`, paddingLeft: 18, marginBottom: 22 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: G.ink }}>{j.emp}</div>
                      <div style={{ fontSize: 13, color: G.muted, marginTop: 2 }}>{j.role} · {j.dur}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      {j.verified && <Tag label="✓ Verified" color={G.teal} />}
                      <Stars score={j.rating} size={14} />
                      <span style={{ fontSize: 13, fontWeight: 700, color: G.gold }}>{j.rating}.0</span>
                    </div>
                  </div>
                  <div style={{ background: G.bg, borderRadius: G.r, padding: "11px 14px", fontSize: 13, color: G.body, fontStyle: "italic", lineHeight: 1.65 }}>"{j.review}"</div>
                  <div style={{ fontSize: 11, color: G.dim, marginTop: 6 }}>Rated on {j.date}</div>
                </div>
              ))}
            </Section>
          </div>
        </div>

        {/* Sidebar */}
        <div style={col(14)}>
          <div style={{ ...card(22), borderTop: `3px solid ${w.color}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: G.muted, letterSpacing: 1, marginBottom: 10 }}>TRUST SCORE</div>
            <div style={{ fontSize: 52, fontWeight: 800, color: G.ink, lineHeight: 1 }}>{w.score}</div>
            <div style={{ fontSize: 12, color: G.muted, marginBottom: 8 }}>{w.reviews} employer-verified reviews</div>
            <Stars score={w.score} size={20} />
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${G.border}`, fontSize: 12, color: G.teal, fontWeight: 500 }}>
              🏆 Top 5% in {w.city}
            </div>
          </div>

          <div style={card(20)}>
            {[["📍 Location", `${w.area}, ${w.city}`], ["⏱ Response", "< 1 hour"], ["✅ Completion", `${w.completePct}%`], ["🌐 Languages", w.lang.join(", ")]].map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: `1px solid ${G.border}` }}>
                <span style={{ fontSize: 12, color: G.muted }}>{l}</span>
                <span style={{ fontSize: 12, color: G.ink, fontWeight: 500, textAlign: "right", maxWidth: 130 }}>{v}</span>
              </div>
            ))}
          </div>

          <div style={{ ...card(20), textAlign: "center" }}>
            <div style={{ fontSize: 11, color: G.muted, marginBottom: 10, fontWeight: 600 }}>BADGES</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
              {w.badges.map(b => <Tag key={b} label={b} color={G.amber} />)}
            </div>
          </div>
        </div>
      </div>

      {/* Hire Modal */}
      {hireOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300, backdropFilter: "blur(6px)", fontFamily: "Sora, system-ui, sans-serif" }}>
          <div style={{ ...card(32), width: 460, boxShadow: G.shadowLg }}>
            {!hireDone ? (
              <>
                <div style={{ fontSize: 20, fontWeight: 800, color: G.ink, marginBottom: 4 }}>Hire {w.name.split(" ")[0]}</div>
                <div style={{ fontSize: 13, color: G.muted, marginBottom: 22 }}>Send a hire request — they'll respond within 1 hour</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                  {[["Role", w.role], ["Start Date", ""]].map(([l, d]) => (
                    <div key={l}>
                      <label style={{ display: "block", fontSize: 12, color: G.muted, marginBottom: 5, fontWeight: 600 }}>{l.toUpperCase()}</label>
                      {l === "Start Date" ? <input type="date" style={inp} /> : <input defaultValue={d} style={inp} />}
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: "block", fontSize: 12, color: G.muted, marginBottom: 5, fontWeight: 600 }}>DAYS PER WEEK</label>
                  <select style={inp}><option>6 days</option><option>5 days</option><option>Part-time</option><option>On-call</option></select>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", fontSize: 12, color: G.muted, marginBottom: 5, fontWeight: 600 }}>MESSAGE (OPTIONAL)</label>
                  <textarea rows={3} placeholder="Tell them about your requirements..." style={{ ...inp, resize: "none" }} />
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setHireDone(true)} style={{ ...btnPrimary(), flex: 1, padding: "12px" }} className="btn-primary">Send Hire Request</button>
                  <button onClick={() => setHireOpen(false)} style={btnGhost({ padding: "12px 18px" })} className="btn-ghost">Cancel</button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <div style={{ fontSize: 52, marginBottom: 14 }}>✅</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: G.ink, marginBottom: 8 }}>Request Sent!</div>
                <div style={{ fontSize: 14, color: G.muted, marginBottom: 22 }}>{w.name} will respond within 1 hour.</div>
                <button onClick={() => { setHireOpen(false); setHireDone(false); }} style={btnPrimary({ padding: "12px 28px" })} className="btn-primary">Done</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   PAGE: WORKER DASHBOARD (owner view)
══════════════════════════════════════════════════════════════════ */
function WorkerDash({ user }) {
  const w = WORKERS.find(x => x.id === user?.id) || WORKERS[0];
  const [tab, setTab] = useState("overview");
  const [editMode, setEditMode] = useState(false);

  return (
    <div style={{ fontFamily: "Sora, system-ui, sans-serif", background: G.bg, minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: G.white, borderBottom: `1px solid ${G.border}`, padding: "28px 44px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 22, alignItems: "flex-start" }}>
            <div style={{ position: "relative" }}>
              <Avi initials={w.avi} color={w.color} size={80} r={18} />
              {w.verified && <div style={{ position: "absolute", bottom: -4, right: -4, width: 22, height: 22, borderRadius: "50%", background: G.teal, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, border: `2px solid ${G.white}` }}>✓</div>}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: G.ink, letterSpacing: -.5, margin: 0 }}>{w.name}</h1>
                <Tag label="✓ Verified" color={G.teal} />
                {w.bgCheck && <Tag label="🛡 Background Check" color={G.green} />}
              </div>
              <div style={{ fontSize: 14, color: G.muted, marginBottom: 10 }}>{w.role} · {w.city} · {w.exp} yrs experience</div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <ScorePill score={w.score} count={w.reviews} />
                <Tag label={w.salary} color={G.green} />
                <Tag label="● Available" color={G.green} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
              <button onClick={() => setEditMode(!editMode)} style={editMode ? btnPrimary({ padding: "9px 18px", fontSize: 13 }) : btnGhost({ padding: "9px 18px", fontSize: 13 })} className={editMode ? "btn-primary" : "btn-ghost"}>
                {editMode ? "✓ Save" : "✏ Edit Profile"}
              </button>
              <button style={btnGhost({ padding: "9px 16px", fontSize: 13 })} className="btn-ghost">📲 Share</button>
            </div>
          </div>

          {/* Profile completion */}
          <div style={{ background: G.amberBg, border: `1px solid ${G.amberBorder}`, borderRadius: G.r, padding: "10px 16px", marginTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, color: G.amber, fontWeight: 500 }}>⚡ Profile {w.completePct}% complete — Add languages to improve your ranking</span>
            <div style={{ width: 120, height: 7, background: G.amberBorder, borderRadius: 4, overflow: "hidden" }}>
              <div style={{ width: `${w.completePct}%`, height: "100%", background: G.amber, borderRadius: 4 }} />
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 0, marginTop: 20, borderBottom: `1px solid ${G.border}` }}>
            {["overview", "work history", "skills", "stats"].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ background: "none", border: "none", cursor: "pointer", padding: "10px 18px", fontSize: 13, fontWeight: 600, color: tab === t ? G.teal : G.muted, borderBottom: `2px solid ${tab === t ? G.teal : "transparent"}`, textTransform: "capitalize", fontFamily: "Sora, system-ui, sans-serif", marginBottom: -1, transition: "all .15s" }}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 44px", display: "grid", gridTemplateColumns: "1fr 290px", gap: 22 }}>
        <div style={col(18)}>
          {tab === "overview" && (
            <>
              <div style={card(24)}>
                <Section title="About">
                  {editMode ? <textarea defaultValue={w.bio} rows={4} style={{ ...inp, resize: "vertical" }} /> : <p style={{ fontSize: 14, color: G.body, lineHeight: 1.75, margin: 0 }}>{w.bio}</p>}
                </Section>
              </div>
              <div style={card(24)}>
                <Section title="Recent Reviews">
                  {w.jobs.slice(0, 2).map((j, i) => (
                    <div key={i} style={{ borderLeft: `3px solid ${G.teal}`, paddingLeft: 16, marginBottom: 18 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <div>
                          <span style={{ fontSize: 14, fontWeight: 700, color: G.ink }}>{j.emp}</span>
                          <span style={{ fontSize: 13, color: G.muted, marginLeft: 10 }}>{j.role}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Tag label="✓ Verified" color={G.teal} />
                          <Stars score={j.rating} size={13} />
                        </div>
                      </div>
                      <div style={{ fontSize: 12, color: G.muted, marginBottom: 7 }}>{j.dur}</div>
                      <div style={{ background: G.bg, borderRadius: G.r, padding: "10px 14px", fontSize: 13, color: G.body, fontStyle: "italic", lineHeight: 1.65 }}>"{j.review}"</div>
                    </div>
                  ))}
                </Section>
              </div>
            </>
          )}
          {tab === "work history" && (
            <div style={card(24)}>
              <Section title="Full Work History" sub={`${w.jobs.length} verified positions`}>
                {w.jobs.map((j, i) => (
                  <div key={i} style={{ background: G.bg, borderRadius: G.rLg, padding: 18, marginBottom: 14, border: `1px solid ${G.border}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: G.ink }}>{j.emp}</div>
                        <div style={{ display: "flex", gap: 8, marginTop: 5 }}>
                          <Tag label={j.role} color={G.indigo} /><Tag label={j.dur} color={G.muted} />
                          {j.verified && <Tag label="✓ Employer Verified" color={G.teal} />}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <Stars score={j.rating} size={16} />
                        <div style={{ fontSize: 13, fontWeight: 700, color: G.gold, marginTop: 3 }}>{j.rating}.0 / 5</div>
                      </div>
                    </div>
                    <div style={{ background: G.white, borderRadius: G.r, padding: "10px 14px", fontSize: 13, color: G.body, fontStyle: "italic" }}>"{j.review}"</div>
                  </div>
                ))}
              </Section>
            </div>
          )}
          {tab === "skills" && (
            <div style={card(24)}>
              <Section title="Skills">{editMode ? <input defaultValue={w.skills.join(", ")} style={inp} /> : <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>{w.skills.map(s => <div key={s} style={{ background: G.bg, border: `1.5px solid ${G.border}`, borderRadius: G.r, padding: "10px 18px", fontSize: 14, color: G.ink, fontWeight: 500 }}>{s}</div>)}</div>}</Section>
              <Section title="Languages"><div style={{ display: "flex", gap: 8 }}>{w.lang.map(l => <Tag key={l} label={l} color={G.indigo} />)}</div></Section>
              <Section title="Badges"><div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{w.badges.map(b => <Tag key={b} label={b} color={G.amber} />)}</div></Section>
            </div>
          )}
          {tab === "stats" && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {[{ v: w.reviews, l: "Total Reviews", c: G.teal }, { v: `${w.score} / 5`, l: "Trust Score", c: G.gold }, { v: `${w.exp} yrs`, l: "Experience", c: G.indigo }, { v: `${w.completePct}%`, l: "Job Completion", c: G.green }].map(s => (
                  <div key={s.l} style={{ ...card(22), borderTop: `3px solid ${s.c}` }}>
                    <div style={{ fontSize: 36, fontWeight: 800, color: s.c, marginBottom: 4 }}>{s.v}</div>
                    <div style={{ fontSize: 13, color: G.muted }}>{s.l}</div>
                  </div>
                ))}
              </div>
              <div style={{ ...card(24), marginTop: 14 }}>
                <Section title="Rating Breakdown">
                  {[5, 4, 3, 2, 1].map(r => {
                    const pct = [71, 21, 5, 2, 1][5 - r];
                    return (
                      <div key={r} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                        <span style={{ fontSize: 12, color: G.gold, width: 14 }}>{r}★</span>
                        <div style={{ flex: 1, height: 10, background: G.bg, borderRadius: 5, overflow: "hidden", border: `1px solid ${G.border}` }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: r >= 4 ? G.teal : r === 3 ? G.amber : G.red, borderRadius: 5 }} />
                        </div>
                        <span style={{ fontSize: 12, color: G.muted, width: 30 }}>{pct}%</span>
                      </div>
                    );
                  })}
                </Section>
              </div>
            </>
          )}
        </div>

        {/* Sidebar */}
        <div style={col(14)}>
          <div style={{ ...card(22), borderTop: `3px solid ${w.color}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: G.muted, letterSpacing: 1, marginBottom: 10 }}>YOUR TRUST SCORE</div>
            <div style={{ fontSize: 56, fontWeight: 800, color: G.ink, lineHeight: 1 }}>{w.score}</div>
            <div style={{ fontSize: 12, color: G.muted, marginBottom: 8 }}>{w.reviews} reviews</div>
            <Stars score={w.score} size={22} />
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${G.border}`, fontSize: 12, color: G.teal, fontWeight: 500 }}>
              🏆 Top 5% in {w.city}
            </div>
          </div>

          <div style={card(20)}>
            <div style={{ fontSize: 13, fontWeight: 700, color: G.ink, marginBottom: 12 }}>Quick Actions</div>
            {[["📲 Share Profile Link", G.teal], ["⬇ Download Resume", G.indigo], ["📞 Update Mobile", G.muted]].map(([l, c]) => (
              <button key={l} style={{ ...btnGhost({ width: "100%", padding: "10px 14px", fontSize: 13, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }), justifyContent: "flex-start", color: c }} className="btn-ghost">{l}</button>
            ))}
          </div>

          <div style={{ ...card(20), textAlign: "center" }}>
            <div style={{ fontSize: 11, color: G.muted, marginBottom: 10, fontWeight: 600 }}>SCAN TO VIEW PROFILE</div>
            <div style={{ width: 90, height: 90, margin: "0 auto", background: G.bg, borderRadius: G.r, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, border: `1px solid ${G.border}` }}>⊞</div>
            <div style={{ fontSize: 11, color: G.muted, marginTop: 10 }}>Show this at society gate</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   PAGE: SOCIETY DASHBOARD
══════════════════════════════════════════════════════════════════ */
function SocietyDash({ user, setPage }) {
  const [workers, setWorkers] = useState(SOCIETY_WORKERS);
  const [tab, setTab] = useState("overview");

  return (
    <div style={{ fontFamily: "Sora, system-ui, sans-serif", background: G.bg, minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: G.ink, color: "#fff", padding: "24px 44px", borderBottom: `1px solid #1E3A5F` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, color: "#64748B", fontWeight: 700, letterSpacing: 1.5, marginBottom: 4 }}>SOCIETY HUB</div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: "0 0 4px", letterSpacing: -.3 }}>Prestige Lakeside Habitat</h1>
            <div style={{ fontSize: 13, color: "#94A3B8" }}>Bengaluru · 240 flats · {user?.name || "Anita K."}, Secretary</div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setPage("search")} style={btnPrimary({ padding: "10px 20px", fontSize: 13 })} className="btn-primary">+ Find Workers</button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: G.ink, borderBottom: `1px solid #1E3A5F` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 44px", display: "flex" }}>
          {["overview", "worker registry", "entry log", "notices"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ background: "none", border: "none", cursor: "pointer", padding: "12px 18px", fontSize: 13, fontWeight: 600, color: tab === t ? G.teal : "#64748B", borderBottom: `2px solid ${tab === t ? G.teal : "transparent"}`, textTransform: "capitalize", fontFamily: "Sora, system-ui, sans-serif", marginBottom: -1, transition: "all .15s" }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 44px" }}>
        {tab === "overview" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
              {[{ v: "48", l: "Registered Workers", c: G.teal }, { v: "12", l: "Entries Today", c: G.green }, { v: "1", l: "Pending Verifications", c: G.amber }, { v: "0", l: "Flagged Workers", c: G.red }].map(s => (
                <div key={s.l} style={{ ...card(22), borderTop: `3px solid ${s.c}` }}>
                  <div style={{ fontSize: 36, fontWeight: 800, color: s.c, lineHeight: 1, marginBottom: 4 }}>{s.v}</div>
                  <div style={{ fontSize: 12, color: G.muted }}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
              <div style={card(24)}>
                <Section title="Today's Entries" sub="Live gate log">
                  {[{ name: "Rekha Devi", role: "Domestic Helper", flat: "A-203", time: "08:42 AM", verified: true }, { name: "Suresh Nair", role: "Security Guard", flat: "Gate 1", time: "07:00 AM", verified: true }, { name: "Ramu (Vendor)", role: "Vegetable Vendor", flat: "Multiple", time: "09:15 AM", verified: false }].map((e, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${G.border}` }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: G.ink }}>{e.name}</div>
                        <div style={{ fontSize: 12, color: G.muted }}>{e.role} · {e.flat}</div>
                      </div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ fontSize: 11, color: G.muted }}>{e.time}</span>
                        <Tag label={e.verified ? "✓ Verified" : "! Unverified"} color={e.verified ? G.green : G.amber} />
                      </div>
                    </div>
                  ))}
                </Section>
              </div>
              <div style={card(24)}>
                <Section title="Pending Actions">
                  <div style={{ background: G.amberBg, border: `1px solid ${G.amberBorder}`, borderRadius: G.r, padding: "14px 16px", marginBottom: 12 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: G.amber, marginBottom: 4 }}>1 Verification Pending</div>
                    <div style={{ fontSize: 13, color: G.body }}>Mohan Lal (Gardener) has applied for entry access. Review documents.</div>
                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                      <button style={btnPrimary({ padding: "7px 14px", fontSize: 12 })} className="btn-primary">Review</button>
                      <button style={btnGhost({ padding: "7px 14px", fontSize: 12 })} className="btn-ghost">Skip</button>
                    </div>
                  </div>
                  <div style={{ background: G.tealBg, border: `1px solid ${G.tealBorder}`, borderRadius: G.r, padding: "14px 16px" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: G.teal, marginBottom: 4 }}>48 Workers Registered</div>
                    <div style={{ fontSize: 13, color: G.body }}>All 48 are verified. 44 have police verification. 4 have background checks pending renewal.</div>
                  </div>
                </Section>
              </div>
            </div>
          </>
        )}

        {tab === "worker registry" && (
          <div style={card(24)}>
            <Section title="Society Worker Registry" sub="All workers registered to operate in this complex">
              {workers.map(w => (
                <div key={w.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: `1px solid ${G.border}` }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                    <Avi initials={w.avi} color={w.color} size={44} r={11} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: G.ink, marginBottom: 4 }}>{w.name}</div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <Tag label={w.role} color={G.indigo} />
                        <Tag label={`Flats: ${w.flats.join(", ")}`} color={G.muted} />
                        <Tag label={`Last: ${w.lastSeen}`} color={G.muted} />
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    {w.score > 0 && <ScorePill score={w.score} />}
                    <Tag label={w.status === "active" ? "✓ Active" : "⏳ Pending"} color={w.status === "active" ? G.green : G.amber} />
                    {w.status === "pending" && (
                      <button onClick={() => setWorkers(workers.map(x => x.id === w.id ? { ...x, status: "active", verified: true } : x))}
                        style={btnPrimary({ padding: "7px 14px", fontSize: 12 })} className="btn-primary">Approve</button>
                    )}
                  </div>
                </div>
              ))}
            </Section>
          </div>
        )}

        {tab === "entry log" && (
          <div style={card(24)}>
            <Section title="Entry Log" sub="Last 30 days">
              <Empty icon="📋" title="Entry log coming soon" sub="Full audit trail will appear here once gate scanner is active" />
            </Section>
          </div>
        )}

        {tab === "notices" && (
          <div style={card(24)}>
            <Section title="Society Notices" action={<button style={btnPrimary({ padding: "8px 16px", fontSize: 13 })} className="btn-primary">+ Post Notice</button>}>
              {["Plumbing maintenance: Block C, Floor 2–4, Saturday 10am–2pm", "New security guard Suresh Nair is now verified and on duty at Gate 1", "Society worker verification drive: Submit documents by Mar 20"].map((n, i) => (
                <div key={i} style={{ background: G.bg, borderRadius: G.r, padding: "12px 16px", marginBottom: 10, fontSize: 13, color: G.body, border: `1px solid ${G.border}` }}>
                  📌 &nbsp;{n}
                </div>
              ))}
            </Section>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   PAGE: EMPLOYER (FAMILY) DASHBOARD
══════════════════════════════════════════════════════════════════ */
function EmployerDash({ user, setPage }) {
  const [jobs, setJobs] = useState(EMPLOYER_JOBS);
  const [rateJob, setRateJob] = useState(null);
  const [stars, setStars] = useState(0);
  const [review, setReview] = useState("");
  const [done, setDone] = useState(false);
  const [activeTab, setActiveTab] = useState("my workers");

  const doRate = () => {
    if (stars > 0 && review.length > 10) {
      setJobs(jobs.map(j => j.id === rateJob.id ? { ...j, rated: true, givenRating: stars, givenReview: review } : j));
      setDone(true);
      setTimeout(() => { setRateJob(null); setDone(false); setStars(0); setReview(""); }, 2500);
    }
  };

  return (
    <div style={{ fontFamily: "Sora, system-ui, sans-serif", background: G.bg, minHeight: "100vh" }}>
      <div style={{ background: G.white, borderBottom: `1px solid ${G.border}`, padding: "24px 44px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, color: G.teal, fontWeight: 700, letterSpacing: 1.5, marginBottom: 4 }}>MY DASHBOARD</div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: G.ink, margin: "0 0 4px", letterSpacing: -.5 }}>
              Welcome, {user?.name || "Ramesh Sharma"}
            </h1>
            <p style={{ fontSize: 13, color: G.muted, margin: 0 }}>Flat 4B, Prestige Lakeside Habitat</p>
          </div>
          <button onClick={() => setPage("search")} style={btnPrimary({ padding: "12px 22px", fontSize: 14 })} className="btn-primary">+ Find Workers</button>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 44px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
          {[{ v: jobs.filter(j => j.status === "active").length, l: "Active Workers", c: G.teal }, { v: jobs.length, l: "Total Hires", c: G.indigo }, { v: jobs.filter(j => j.rated).length, l: "Ratings Given", c: G.green }, { v: jobs.filter(j => !j.rated && j.status === "completed").length, l: "Pending Ratings", c: G.amber }].map(s => (
            <div key={s.l} style={{ ...card(20), borderTop: `3px solid ${s.c}` }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: s.c, marginBottom: 4 }}>{s.v}</div>
              <div style={{ fontSize: 12, color: G.muted }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Pending ratings callout */}
        {jobs.some(j => !j.rated && j.status === "completed") && (
          <div style={{ background: G.amberBg, border: `1px solid ${G.amberBorder}`, borderRadius: G.rLg, padding: "14px 20px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: G.amber, fontWeight: 500 }}>
              ⭐ You have {jobs.filter(j => !j.rated && j.status === "completed").length} pending review{jobs.filter(j => !j.rated && j.status === "completed").length > 1 ? "s" : ""} — help workers get more work by leaving a rating
            </span>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: `1px solid ${G.border}`, marginBottom: 20 }}>
          {["my workers", "post a job", "activity"].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{ background: "none", border: "none", cursor: "pointer", padding: "10px 18px", fontSize: 13, fontWeight: 600, color: activeTab === t ? G.teal : G.muted, borderBottom: `2px solid ${activeTab === t ? G.teal : "transparent"}`, textTransform: "capitalize", fontFamily: "Sora, system-ui, sans-serif", marginBottom: -1 }}>{t}</button>
          ))}
        </div>

        {activeTab === "my workers" && (
          <div style={col(12)}>
            {jobs.map(j => (
              <div key={j.id} style={{ ...card(18), borderLeft: `3px solid ${j.status === "active" ? G.teal : j.rated ? G.green : G.amber}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                    <Avi initials={j.avi} color={j.color} size={46} r={11} />
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: G.ink, marginBottom: 5 }}>{j.workerName}</div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <Tag label={j.role} color={G.indigo} />
                        <Tag label={`${j.start} – ${j.end}`} color={G.muted} />
                        <Tag label={j.status === "active" ? "● Active" : "Completed"} color={j.status === "active" ? G.green : G.muted} />
                      </div>
                      {j.rated && j.givenRating && <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}><Stars score={j.givenRating} size={12} /><span style={{ fontSize: 11, color: G.muted, fontStyle: "italic" }}>"{j.givenReview?.slice(0, 50)}..."</span></div>}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    {!j.rated && j.status === "completed" && (
                      <button onClick={() => setRateJob(j)} style={btnPrimary({ padding: "9px 18px", fontSize: 13 })} className="btn-primary">⭐ Rate Worker</button>
                    )}
                    {j.rated && <Tag label="✓ Rated" color={G.green} />}
                    {j.status === "active" && <Tag label="Working Now" color={G.teal} />}
                    <button onClick={() => setPage("worker-view")} style={btnGhost({ padding: "8px 14px", fontSize: 12 })} className="btn-ghost">View Profile</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "post a job" && (
          <div style={{ ...card(28), maxWidth: 580 }}>
            <Section title="Post a Job" sub="Verified workers matching your requirement will be notified">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                {[["Job Title", "e.g. Cook, Security Guard"], ["Category", null], ["Location", "Your area / society"], ["Offered Pay", "e.g. ₹12,000/mo"]].map(([l, p]) => (
                  <div key={l}>
                    <label style={{ display: "block", fontSize: 12, color: G.muted, marginBottom: 5, fontWeight: 600 }}>{l.toUpperCase()}</label>
                    {l === "Category" ? <select style={inp}>{CATEGORIES.map(c => <option key={c.label}>{c.label}</option>)}</select> : <input placeholder={p} style={inp} />}
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, color: G.muted, marginBottom: 5, fontWeight: 600 }}>MIN. TRUST SCORE</label>
                <select style={inp}><option>Any (4.0+)</option><option>Good (4.3+)</option><option>Excellent (4.5+)</option><option>Top Rated (4.7+)</option></select>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 12, color: G.muted, marginBottom: 5, fontWeight: 600 }}>JOB DESCRIPTION</label>
                <textarea rows={4} placeholder="Describe duties, timings, expectations..." style={{ ...inp, resize: "vertical" }} />
              </div>
              <button style={btnPrimary({ padding: "13px 28px", fontSize: 14 })} className="btn-primary">Post Job →</button>
            </Section>
          </div>
        )}

        {activeTab === "activity" && (
          <div style={card(24)}>
            <Section title="Activity History">
              {[{ icon: "⭐", t: "You rated Rajan Kumar 5 stars", d: "3 days ago" }, { icon: "👷", t: "Rekha Devi started working", d: "2 months ago" }, { icon: "📋", t: "You posted a Cook job", d: "4 months ago" }].map((a, i) => (
                <div key={i} style={{ display: "flex", gap: 14, padding: "12px 0", borderBottom: `1px solid ${G.border}` }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: G.bg, border: `1px solid ${G.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{a.icon}</div>
                  <div><div style={{ fontSize: 13, color: G.ink }}>{a.t}</div><div style={{ fontSize: 11, color: G.muted, marginTop: 3 }}>{a.d}</div></div>
                </div>
              ))}
            </Section>
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {rateJob && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300, backdropFilter: "blur(6px)", fontFamily: "Sora, system-ui, sans-serif" }}>
          <div style={{ ...card(32), width: 480, boxShadow: G.shadowLg }}>
            {!done ? (
              <>
                <div style={{ fontSize: 20, fontWeight: 800, color: G.ink, marginBottom: 4 }}>Rate {rateJob.workerName}</div>
                <div style={{ fontSize: 13, color: G.muted, marginBottom: 22 }}>{rateJob.role} · {rateJob.start} – {rateJob.end}</div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", fontSize: 12, color: G.muted, marginBottom: 10, fontWeight: 600 }}>OVERALL RATING</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Stars score={stars} size={38} interactive onRate={setStars} />
                    {stars > 0 && <span style={{ fontSize: 20, fontWeight: 800, color: G.gold }}>{stars}.0</span>}
                  </div>
                  {stars > 0 && <div style={{ fontSize: 13, color: G.muted, marginTop: 6 }}>{["", "Very Poor", "Poor", "Average", "Good", "Excellent!"][stars]}</div>}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                  {["Punctuality", "Cleanliness", "Communication", "Quality of Work"].map(a => (
                    <div key={a} style={{ background: G.bg, borderRadius: G.r, padding: "12px 14px" }}>
                      <div style={{ fontSize: 12, color: G.muted, marginBottom: 5, fontWeight: 500 }}>{a}</div>
                      <Stars score={stars || 3} size={14} interactive onRate={() => { }} />
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 12, color: G.muted, marginBottom: 6, fontWeight: 600 }}>YOUR REVIEW</label>
                  <textarea value={review} onChange={e => setReview(e.target.value)} rows={4} placeholder="Describe your experience working with this person..." style={{ ...inp, resize: "none" }} />
                </div>
                <div style={{ background: G.tealBg, border: `1px solid ${G.tealBorder}`, borderRadius: G.r, padding: "10px 14px", marginBottom: 18, fontSize: 12, color: G.teal }}>
                  🔒 This rating will be permanently linked to your verified account. It cannot be deleted or modified.
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setRateJob(null)} style={btnGhost({ padding: "12px 18px" })} className="btn-ghost">Cancel</button>
                  <button onClick={doRate} disabled={stars === 0 || review.length < 10} style={{ ...btnPrimary({ flex: 1, padding: "12px" }), opacity: stars === 0 || review.length < 10 ? .45 : 1 }} className="btn-primary">
                    Submit Verified Rating
                  </button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "28px 0" }}>
                <div style={{ fontSize: 52, marginBottom: 14 }}>✅</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: G.ink, marginBottom: 8 }}>Rating Submitted!</div>
                <div style={{ fontSize: 14, color: G.muted }}>Your verified review has been added to {rateJob.workerName}'s permanent Trust Profile.</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   PAGE: ADMIN PANEL
══════════════════════════════════════════════════════════════════ */
function Admin() {
  const [tab, setTab] = useState("overview");
  const [pending, setPending] = useState([
    { id: 101, name: "Meena Kumari", role: "Domestic Helper", city: "Jaipur", phone: "99887-xxxxx", date: "12 Mar 2025", docs: ["Aadhaar", "Photo"], status: "pending" },
    { id: 102, name: "Vikram Yadav", role: "Driver", city: "Lucknow", phone: "88776-xxxxx", date: "11 Mar 2025", docs: ["Aadhaar", "Driving License", "Photo"], status: "pending" },
    { id: 103, name: "Geetha R", role: "Cook", city: "Bengaluru", phone: "77665-xxxxx", date: "10 Mar 2025", docs: ["Aadhaar", "Photo"], status: "pending" },
  ]);

  const approve = id => setPending(p => p.map(x => x.id === id ? { ...x, status: "approved" } : x));
  const reject = id => setPending(p => p.map(x => x.id === id ? { ...x, status: "rejected" } : x));
  const activePending = pending.filter(p => p.status === "pending");
  const maxBar = 195;

  return (
    <div style={{ fontFamily: "Sora, system-ui, sans-serif", background: G.bg, minHeight: "100vh" }}>
      <div style={{ background: G.ink, color: "#fff", padding: "22px 44px", borderBottom: "1px solid #1E3A5F" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, color: "#64748B", letterSpacing: 1.5, fontWeight: 700, marginBottom: 4 }}>ADMIN CONTROL CENTRE</div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: -.3 }}>Shramik. Platform Admin</h1>
          </div>
          {activePending.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#1A3557", borderRadius: G.r, padding: "8px 14px" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: G.amber, display: "inline-block", animation: "pulse 1.5s infinite" }} />
              <span style={{ fontSize: 12, color: G.amber, fontWeight: 600 }}>{activePending.length} pending verifications</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: G.ink, borderBottom: "1px solid #1E3A5F" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 44px", display: "flex" }}>
          {["overview", "verifications", "users", "reports"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ background: "none", border: "none", cursor: "pointer", padding: "12px 18px", fontSize: 13, fontWeight: 600, color: tab === t ? G.teal : "#64748B", borderBottom: `2px solid ${tab === t ? G.teal : "transparent"}`, textTransform: "capitalize", fontFamily: "Sora, system-ui, sans-serif", marginBottom: -1 }}>
              {t === "verifications" && activePending.length > 0 ? `${t} (${activePending.length})` : t}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 44px" }}>
        {tab === "overview" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 22 }}>
              {[{ v: "1,247", l: "Total Workers", c: G.teal }, { v: "892", l: "Employers", c: G.indigo }, { v: "4,230", l: "Verified Ratings", c: G.green }, { v: "48", l: "Active Societies", c: G.amber }].map(s => (
                <div key={s.l} style={{ ...card(22), borderTop: `3px solid ${s.c}` }}>
                  <div style={{ fontSize: 34, fontWeight: 800, color: s.c, marginBottom: 4 }}>{s.v}</div>
                  <div style={{ fontSize: 12, color: G.muted }}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
              {/* Bar chart */}
              <div style={card(24)}>
                <Section title="Monthly Registrations" sub="New worker signups per month (2024)">
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 110 }}>
                    {[40, 55, 62, 80, 95, 110, 102, 130, 145, 160, 178, 195].map((v, i) => (
                      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <div style={{ width: "70%", height: `${(v / maxBar) * 100}px`, background: `linear-gradient(180deg, ${G.teal}, ${G.tealDark})`, borderRadius: "3px 3px 0 0", minHeight: 4 }} />
                        <div style={{ fontSize: 8, color: G.dim }}>M{i + 1}</div>
                      </div>
                    ))}
                  </div>
                </Section>
              </div>
              {/* Category breakdown */}
              <div style={card(24)}>
                <Section title="Worker Categories">
                  {CATEGORIES.slice(0, 6).map(c => (
                    <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9 }}>
                      <span style={{ fontSize: 12, color: G.ink, width: 90, flexShrink: 0 }}>{c.label}</span>
                      <div style={{ flex: 1, height: 9, background: G.bg, borderRadius: 5, overflow: "hidden", border: `1px solid ${G.border}` }}>
                        <div style={{ width: `${(c.count / 380) * 100}%`, height: "100%", background: c.color, borderRadius: 5 }} />
                      </div>
                      <span style={{ fontSize: 11, color: G.muted, width: 26, textAlign: "right" }}>{c.count}</span>
                    </div>
                  ))}
                </Section>
              </div>
            </div>
            {/* Activity feed */}
            <div style={card(24)}>
              <Section title="Live Activity Feed">
                {[{ icon: "👤", t: "Meena Kumari registered as Domestic Helper", d: "2 mins ago" }, { icon: "⭐", t: "Ramesh Sharma rated Rekha Devi ★★★★★", d: "14 mins ago" }, { icon: "✅", t: "Suresh Nair's profile approved by admin", d: "1 hr ago" }, { icon: "🏢", t: "Prestige Society registered (240 flats, Bengaluru)", d: "3 hrs ago" }, { icon: "🚩", t: "Suspicious rating flagged on Worker #284 — under review", d: "5 hrs ago" }].map((a, i) => (
                  <div key={i} style={{ display: "flex", gap: 14, padding: "11px 0", borderBottom: `1px solid ${G.border}` }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: G.bg, border: `1px solid ${G.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>{a.icon}</div>
                    <div style={{ flex: 1 }}><div style={{ fontSize: 13, color: G.ink }}>{a.t}</div><div style={{ fontSize: 11, color: G.muted, marginTop: 3 }}>{a.d}</div></div>
                    {a.icon === "🚩" && <Tag label="Review" color={G.red} />}
                  </div>
                ))}
              </Section>
            </div>
          </>
        )}

        {tab === "verifications" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: G.ink }}>Pending Verifications ({activePending.length})</div>
              <div style={{ fontSize: 13, color: G.muted }}>Review submitted documents and approve or reject</div>
            </div>
            {activePending.length === 0
              ? <Empty icon="✅" title="All caught up!" sub="No pending verifications right now." />
              : activePending.map(p => (
                <div key={p.id} style={{ ...card(20), marginBottom: 12, borderLeft: `3px solid ${G.amber}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                      <div style={{ width: 46, height: 46, borderRadius: 11, background: G.amberBg, border: `1px solid ${G.amberBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>👤</div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: G.ink, marginBottom: 5 }}>{p.name}</div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <Tag label={p.role} color={G.indigo} /><Tag label={p.city} color={G.muted} /><Tag label={`Applied: ${p.date}`} color={G.muted} />
                          {p.docs.map(d => <Tag key={d} label={`📄 ${d}`} color={G.blue} />)}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <button style={btnGhost({ padding: "8px 14px", fontSize: 12 })} className="btn-ghost">View Docs</button>
                      <button onClick={() => reject(p.id)} style={{ background: G.redBg, color: G.red, border: `1px solid ${G.redBorder}`, borderRadius: G.r, padding: "8px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Sora, system-ui, sans-serif" }}>Reject</button>
                      <button onClick={() => approve(p.id)} style={btnPrimary({ padding: "8px 18px", fontSize: 13 })} className="btn-primary">✓ Approve</button>
                    </div>
                  </div>
                </div>
              ))}
            {/* Processed */}
            {pending.filter(p => p.status !== "pending").length > 0 && (
              <div style={{ marginTop: 24 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: G.ink, marginBottom: 12 }}>Processed</div>
                {pending.filter(p => p.status !== "pending").map(p => (
                  <div key={p.id} style={{ ...card(14), marginBottom: 8, borderLeft: `3px solid ${p.status === "approved" ? G.green : G.red}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 13, color: G.ink, fontWeight: 500 }}>{p.name} · <span style={{ color: G.muted }}>{p.role} · {p.city}</span></span>
                      <Tag label={p.status === "approved" ? "✓ Approved" : "✗ Rejected"} color={p.status === "approved" ? G.green : G.red} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === "users" && (
          <div style={card(0, { overflow: "hidden" })}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 22px", borderBottom: `1px solid ${G.border}` }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: G.ink }}>All Workers</div>
              <div style={{ display: "flex", gap: 10 }}>
                <input placeholder="Search workers..." style={{ ...inp, width: 200, padding: "8px 12px", fontSize: 13 }} />
                <select style={{ ...inp, width: 140, padding: "8px 10px", fontSize: 13 }}><option>All Roles</option></select>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 80px 90px 120px" }}>
              {["Name", "Role", "City", "Score", "Status", "Actions"].map(h => (
                <div key={h} style={{ background: G.bg, padding: "10px 16px", fontSize: 11, fontWeight: 700, color: G.muted, borderBottom: `1px solid ${G.border}`, letterSpacing: 1, textTransform: "uppercase" }}>{h}</div>
              ))}
              {WORKERS.map((w, i) => {
                const bg = i % 2 === 0 ? G.white : G.bg;
                return [
                  <div key={w.id + "n"} style={{ padding: "14px 16px", borderBottom: `1px solid ${G.border}`, display: "flex", alignItems: "center", gap: 10, background: bg }}>
                    <Avi initials={w.avi} color={w.color} size={30} r={8} />
                    <span style={{ fontSize: 13, color: G.ink, fontWeight: 500 }}>{w.name}</span>
                  </div>,
                  <div key={w.id + "r"} style={{ padding: "14px 16px", borderBottom: `1px solid ${G.border}`, fontSize: 13, color: G.teal, display: "flex", alignItems: "center", background: bg }}>{w.role}</div>,
                  <div key={w.id + "c"} style={{ padding: "14px 16px", borderBottom: `1px solid ${G.border}`, fontSize: 13, color: G.muted, display: "flex", alignItems: "center", background: bg }}>{w.city}</div>,
                  <div key={w.id + "s"} style={{ padding: "14px 16px", borderBottom: `1px solid ${G.border}`, display: "flex", alignItems: "center", gap: 3, background: bg }}><span style={{ fontSize: 12, color: G.gold }}>★</span><span style={{ fontSize: 13, fontWeight: 700, color: G.ink }}>{w.score}</span></div>,
                  <div key={w.id + "st"} style={{ padding: "14px 16px", borderBottom: `1px solid ${G.border}`, display: "flex", alignItems: "center", background: bg }}><Tag label={w.verified ? "Active" : "Pending"} color={w.verified ? G.green : G.amber} /></div>,
                  <div key={w.id + "a"} style={{ padding: "14px 16px", borderBottom: `1px solid ${G.border}`, display: "flex", alignItems: "center", gap: 6, background: bg }}>
                    <button style={{ ...btnGhost({ padding: "4px 10px", fontSize: 11 }), border: "none", background: G.bg, color: G.muted }} className="btn-ghost">View</button>
                    <button style={{ background: G.redBg, color: G.red, border: "none", borderRadius: 6, padding: "4px 10px", fontSize: 11, cursor: "pointer", fontFamily: "Sora, system-ui, sans-serif" }}>Flag</button>
                  </div>,
                ];
              })}
            </div>
          </div>
        )}

        {tab === "reports" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            {[{ title: "Platform Health", rows: [["Total Verified Profiles", "1,247"], ["Average Trust Score", "4.71 / 5.0"], ["Rating Fraud Attempts Blocked", "0"], ["Profile Completion Rate", "78%"]] }, { title: "Growth Metrics", rows: [["New Registrations (Mar)", "195"], ["Month-on-Month Growth", "+9.6%"], ["Active Employers", "892"], ["Jobs Filled This Month", "318"]] }, { title: "Quality Metrics", rows: [["5-Star Ratings", "71%"], ["Avg. Employer Response Time", "< 1 hr"], ["Job Completion Rate", "97.3%"], ["Employer Retention", "83%"]] }, { title: "System Status", rows: [["API Uptime", "99.98%"], ["OTP Delivery Rate", "99.4%"], ["Flagged Reviews", "3"], ["Support Tickets Open", "7"]] }].map((r, i) => (
              <div key={i} style={card(24)}>
                <Section title={r.title}>
                  {r.rows.map(([l, v]) => (
                    <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: `1px solid ${G.border}` }}>
                      <span style={{ fontSize: 13, color: G.muted }}>{l}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: G.ink }}>{v}</span>
                    </div>
                  ))}
                </Section>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState("landing");
  const [user, setUser] = useState(null);
  const [viewId, setViewId] = useState(null);

  const renderPage = () => {
    switch (page) {
      case "landing":           return <Landing setPage={setPage} setUser={setUser} />;
      case "auth":              return <Auth setPage={setPage} setUser={setUser} />;
      case "for-societies":     return <ForSocieties setPage={setPage} setUser={setUser} />;
      case "for-workers":       return <ForWorkers setPage={setPage} />;
      case "search":            return <Search setPage={setPage} setViewId={setViewId} />;
      case "worker-view":       return <WorkerView wId={viewId} setPage={setPage} />;
      case "worker-dashboard":  return <WorkerDash user={user} />;
      case "employer-dashboard":return <EmployerDash user={user} setPage={setPage} />;
      case "society-dashboard": return <SocietyDash user={user} setPage={setPage} />;
      case "admin":             return <Admin />;
      default:                  return <Landing setPage={setPage} setUser={setUser} />;
    }
  };

  return (
    <div style={{ fontFamily: "Sora, system-ui, sans-serif", minHeight: "100vh", background: G.bg }}>
      <FontStyle />
      <Nav page={page} setPage={setPage} user={user} setUser={setUser} />
      {renderPage()}
    </div>
  );
}
