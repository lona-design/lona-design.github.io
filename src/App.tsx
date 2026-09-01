import { useEffect, useRef, useState } from "react";

const assetPathPrefix = "/assets";
const imgAboutPhoto    = `${assetPathPrefix}/ananya-photo.jpeg`;
const imgProjectMain   = `${assetPathPrefix}/1301f.png`;
const imgProjectMain2  = `${assetPathPrefix}/22d2c.png`;
const imgProjectMain3  = `${assetPathPrefix}/a1820.png`;
const imgProjectMain4  = `${assetPathPrefix}/614cc.png`;
const imgProjectMain5  = `${assetPathPrefix}/ec42c.png`;
const imgProjectMain6  = `${assetPathPrefix}/51127.png`;
const imgEllipse1      = `${assetPathPrefix}/8e0e5.svg`;
const imgArrowRight    = `${assetPathPrefix}/e8c0f.svg`;
const imgArrowUpRight  = `${assetPathPrefix}/9af6b.svg`;
const imgMonitor       = `${assetPathPrefix}/4dd8c.svg`;
const imgCompass       = `${assetPathPrefix}/7a02f.svg`;
const imgPlay          = `${assetPathPrefix}/dfec5.svg`;
const imgStar          = `${assetPathPrefix}/81ad2.svg`;
const imgArrowUp       = `${assetPathPrefix}/6039e.svg`;
const imgGlowOrb       = `${assetPathPrefix}/05fc9.svg`;
const imgGlowOrb1      = `${assetPathPrefix}/85cc3.svg`;
const imgGlowOrb2      = `${assetPathPrefix}/99f0a.svg`;
const imgGlowOrb3      = `${assetPathPrefix}/0f8ec.svg`;
const imgGlowOrb4      = `${assetPathPrefix}/89582.svg`;

// ─── STAR FIELD ──────────────────────────────────────────────────────────────
function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const STAR_COUNT = 180;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.4 + 0.2,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.6 + 0.2,
      hue: Math.random() < 0.15 ? (Math.random() < 0.5 ? "180,160,255" : "0,212,255") : "255,255,255",
    }));

    let raf: number;
    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.008;
      stars.forEach(s => {
        const alpha = 0.15 + 0.75 * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.hue},${alpha})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />;
}

// ─── SHOOTING STARS ───────────────────────────────────────────────────────────
function ShootingStars() {
  const [stars, setStars] = useState<{ id: number; top: number; left: number; duration: number }[]>([]);
  const idRef = useRef(0);
  useEffect(() => {
    const spawn = () => {
      const s = { id: idRef.current++, top: Math.random() * 60, left: Math.random() * 60, duration: 1.2 + Math.random() * 1.2 };
      setStars(prev => [...prev.slice(-5), s]);
    };
    spawn();
    const iv = setInterval(spawn, 3200);
    return () => clearInterval(iv);
  }, []);
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
      {stars.map(s => (
        <div key={s.id} className="shooting-star"
          style={{ top: `${s.top}%`, left: `${s.left}%`, animationDuration: `${s.duration}s`, width: "2px" }} />
      ))}
    </div>
  );
}

// ─── SCROLL REVEAL HOOK ───────────────────────────────────────────────────────
function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => el.classList.add("visible"), delay); obs.unobserve(el); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return ref;
}

// ─── COUNTER HOOK ─────────────────────────────────────────────────────────────
function useCounter(target: number, started: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let v = 0;
    const step = Math.ceil(target / (1200 / 16));
    const t = setInterval(() => { v += step; if (v >= target) { setCount(target); clearInterval(t); } else setCount(v); }, 16);
    return () => clearInterval(t);
  }, [target, started]);
  return count;
}

// ─── ANIMATED NAME ────────────────────────────────────────────────────────────
function AnimatedName({ text, baseDelay = 0 }: { text: string; baseDelay?: number }) {
  return (
    <span style={{ perspective: "800px", display: "inline-block" }}>
      {text.split("").map((ch, i) => (
        <span key={i} className="letter" style={{ animationDelay: `${baseDelay + i * 0.055}s` }}>
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}

// ─── SECTION BADGE ────────────────────────────────────────────────────────────
function SectionBadge({ text, color }: { text: string; color: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-mono uppercase tracking-widest"
      style={{ borderColor: color, color, backgroundColor: `${color}12` }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
      {text}
    </div>
  );
}

// ─── TAG ─────────────────────────────────────────────────────────────────────
function Tag({ label }: { label: string }) {
  return (
    <span className="px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.04] text-xs font-mono text-white/70">
      {label}
    </span>
  );
}

// ─── TOOL ICON ────────────────────────────────────────────────────────────────
const TOOL_ICONS: Record<string, string> = {
  "Figma":      `${assetPathPrefix}/figma.png`,
  "ChatGPT":    `${assetPathPrefix}/chatgpt.png`,
  "Codex":      `${assetPathPrefix}/codex.png`,
  "Claude":     `${assetPathPrefix}/claude.png`,
  "Lovable":    `${assetPathPrefix}/lovable.png`,
  "Sketch":     `${assetPathPrefix}/sketch.png`,
  "Framer":     `${assetPathPrefix}/framer.png`,
  "Figma Make": `${assetPathPrefix}/figma-make.png`,
  "Notion":     `${assetPathPrefix}/notion.png`,
};

const ToolIcon = ({ name }: { name: string }) => {
  const src = TOOL_ICONS[name];
  if (!src) return <div className="w-5 h-5 rounded-[4px] bg-white/20" />;
  return <img src={src} alt={name} width={20} height={20} className="w-5 h-5 object-contain" />;
};

// ─── ROCKET SVG ───────────────────────────────────────────────────────────────
// ─── DATA ─────────────────────────────────────────────────────────────────────
const tools = ["Figma","ChatGPT","Codex","Claude","Lovable","Sketch","Framer","Figma Make","Notion"];

const projects = [
  {
    num: "01",
    title: "Inspection Module for Spectra",
    subtitle: "Media browser for aerial site surveyors",
    tags: ["Product Design", "UX Research", "SaaS", "Web App"],
    img: imgProjectMain,
    imgSide: "right",
    meta: [["Role", "Research · UX Design · Dev-of"], ["Team", "1 PM · 5 Engineers"], ["Timeline", "2 Weeks"]],
    problem: "Surveyors worked across scattered media, spatial data, and inspection tools, making it hard to document findings and share actionable insights efficiently.",
  },
  {
    num: "02",
    title: "eDOCSAFE.AI   Search Term",
    subtitle: "Finding a file without remembering its name",
    tags: ["AI Feature Design", "Interaction Design", "SaaS", "Document Management"],
    img: imgProjectMain2,
    imgSide: "left",
    meta: [["Role", "UX Research · Interaction Design"], ["Team", "2 Designers · 1 PM · 4 Engineers"], ["Timeline", "3 Weeks"]],
    problem: "Retrieval depended on recalling an exact filename. For teams managing hundreds of documents, that memory requirement quietly became the bottleneck.",
  },
];

const services = [
  { icon: imgMonitor,   title: "UI/UX Design",        desc: "Weaving high-fidelity interactions with flawless product design standards across mobile & web.",               iconBg: "rgba(205,255,80,0.12)",  glow: "#cdff50" },
  { icon: imgCompass,   title: "Brand Identity",      desc: "Defining core parameters of your startup's voice, aesthetic palettes, guidelines and distinct assets.",         iconBg: "rgba(255,107,107,0.12)", glow: "#ff6b6b" },
  { icon: imgPlay,      title: "Motion Design",       desc: "Adding kinetic character through rich interactive micro-animations and immersive web transitions.",              iconBg: "rgba(123,97,255,0.12)",  glow: "#7b61ff" },
  { icon: imgStar,      title: "Creative Direction",  desc: "Overseeing digital campaigns, photography parameters, and complete product launch systems.",                    iconBg: "rgba(0,212,255,0.12)",   glow: "#00d4ff" },
];

const processSteps = [
  { num: "01", color: "#cdff50", title: "Discover", desc: "Immersion into your business parameters, audits, user research and initial alignment calls." },
  { num: "02", color: "#ff6b6b", title: "Define",   desc: "Crystallizing core architecture, brand positioning strategy, mood boards and flow models." },
  { num: "03", color: "#7b61ff", title: "Design",   desc: "Crafting beautiful high-fidelity prototypes, interactions and tactile visual languages." },
  { num: "04", color: "#00d4ff", title: "Deliver",  desc: "Rigorous testing, dynamic assets handover, developer support and launching with punch." },
];

const testimonials = [
  { quote: "Ananya takes complex, data-heavy product challenges and turns them into seamless, intuitive experiences. She collaborates effortlessly with product and engineering teams to deliver precise, build-ready specs. A deeply user-centric designer and an invaluable asset to any team.", name: "Rakshit", role: "HR, Skylark Drones" },
  { quote: "Ananya is polite, diligent, and highly professional. She proactively offers multiple strong design options, patiently guiding even those without design sense toward the best solution. Her user-focused mindset and collaborative spirit make her a real asset.", name: "Anand Mahesh", role: "Fullstack Developer, Skylark Drones" },
  { quote: "Ananya has a great eye for detail, a strong sense of visual design, and always delivers creative, user-friendly solutions. What truly sets her apart is her leadership: she communicates clearly, works seamlessly with teams, and brings people together.", name: "Joseph", role: "UI/UX Mentor, Dev & Design" },
  { quote: "Working with Ananya was an absolute pleasure. She has an incredible ability to translate abstract ideas into polished visual experiences. Her attention to user needs while maintaining strong aesthetics is rare and she elevated every project she touched.", name: "Priya Sharma", role: "Product Manager, iBind Systems" },
];

// ─── 3D PROJECT SCENES ────────────────────────────────────────────────────────
function Scene01() {
  return (
    <div style={{ position:"relative", width:280, height:240, flexShrink:0 }}>
      {[{l:14,t:16,c:"#ffb347",d:"0s"},{r:20,t:22,c:"#ff6b35",d:"0.6s"},{l:22,b:22,c:"#ffb347",d:"1.1s"}].map(({l,t,r,b,c,d},i) => (
        <span key={i} style={{position:"absolute",left:l,top:t,right:r,bottom:b,color:c,fontSize:11,animation:`twinkle ${1.7+i*0.4}s ease-in-out infinite ${d}`}}>✦</span>
      ))}
      {/* Drone */}
      <div style={{position:"absolute",top:6,right:14,animation:"astronautBob 2.8s ease-in-out infinite"}}>
        <svg viewBox="0 0 66 38" width="66" height="38" fill="none">
          <rect x="23" y="10" width="20" height="14" rx="5" fill="#ff6b35"/>
          <rect x="0" y="16" width="23" height="2" rx="1" fill="#888"/>
          <rect x="43" y="16" width="23" height="2" rx="1" fill="#888"/>
          <ellipse cx="4" cy="16" rx="6" ry="2.5" fill="rgba(255,255,255,0.25)" stroke="#ccc" strokeWidth="0.5"/>
          <ellipse cx="62" cy="16" rx="6" ry="2.5" fill="rgba(255,255,255,0.25)" stroke="#ccc" strokeWidth="0.5"/>
          <circle cx="33" cy="27" r="5" fill="#222"/><circle cx="33" cy="27" r="3" fill="#444"/>
          <circle cx="31.5" cy="25.5" r="1.2" fill="rgba(255,255,255,0.3)"/>
        </svg>
      </div>
      {/* 3-D laptop screen */}
      <div style={{position:"absolute",left:12,top:48,width:252,height:152,background:"linear-gradient(135deg,#150a00,#2a1400)",borderRadius:14,border:"1.5px solid rgba(255,107,53,0.45)",boxShadow:"0 0 28px rgba(255,107,53,0.22),0 18px 48px rgba(0,0,0,0.65)",padding:10,transform:"perspective(700px) rotateX(8deg) rotateY(-6deg)",overflow:"hidden"}}>
        <div style={{display:"flex",gap:5,alignItems:"center",marginBottom:7}}>
          <div style={{width:44,height:5,background:"#ff6b35",borderRadius:3}}/><div style={{flex:1,height:5,background:"rgba(255,107,53,0.18)",borderRadius:3}}/><div style={{width:14,height:5,background:"rgba(255,107,53,0.4)",borderRadius:3}}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gridTemplateRows:"repeat(3,1fr)",gap:3,height:114}}>
          {["#8B5E3C","#A0522D","#D2691E","#7B4A1C","#C68642","#DAA520","#8B6914","#A0783C","#CD853F","#9B7345","#6B4E31","#845A2A"].map((c,i)=>(
            <div key={i} style={{background:`linear-gradient(135deg,${c},${c}cc)`,borderRadius:3,border:"0.5px solid rgba(255,255,255,0.07)",position:"relative",overflow:"hidden"}}>
              {(i===0||i===5)&&<div style={{position:"absolute",top:2,left:2,width:4,height:4,borderRadius:"50%",background:i===0?"#ff6b35":"#ffb347",boxShadow:`0 0 4px ${i===0?"#ff6b35":"#ffb347"}`}}/>}
            </div>
          ))}
        </div>
      </div>
      {/* Map pin */}
      <div style={{position:"absolute",bottom:20,right:24,animation:"cosmicFloat 3.5s ease-in-out infinite 1s"}}>
        <svg viewBox="0 0 20 28" width="20" height="28" fill="none"><path d="M10 0C5.8 0 2.5 3.3 2.5 7.5c0 5.5 7.5 18 7.5 18s7.5-12.5 7.5-18C17.5 3.3 14.2 0 10 0z" fill="#ff6b35"/><circle cx="10" cy="7.5" r="3.5" fill="rgba(255,255,255,0.85)"/></svg>
      </div>
    </div>
  );
}

function Scene02() {
  const cards = [{l:8,t:55,r:-7,c:"#cdff50",d:"0s"},{l:56,t:22,r:0,c:"#a3e635",d:"0.35s"},{l:118,t:44,r:5,c:"#84cc16",d:"0.7s"},{l:78,t:108,r:-4,c:"#cdff50",d:"1s"},{l:162,t:72,r:7,c:"#bef264",d:"0.18s"}];
  return (
    <div style={{position:"relative",width:280,height:240,flexShrink:0}}>
      {[{l:8,t:12,c:"#cdff50",d:"0s"},{r:16,t:20,c:"#a3e635",d:"0.7s"},{r:28,b:20,c:"#cdff50",d:"0.35s"}].map(({l,t,r,b,c,d},i)=>(
        <span key={i} style={{position:"absolute",left:l,top:t,right:r,bottom:b,color:c,fontSize:11,animation:`twinkle ${1.7+i*0.4}s ease-in-out infinite ${d}`}}>✦</span>
      ))}
      {cards.map((c,i)=>(
        <div key={i} style={{position:"absolute",left:c.l,top:c.t,width:102,height:74,background:"linear-gradient(135deg,#0a150a,#0f2008)",borderRadius:8,border:`1.5px solid ${c.c}45`,boxShadow:`0 8px 24px rgba(0,0,0,0.45),0 0 12px ${c.c}18`,transform:`rotate(${c.r}deg)`,animation:`cosmicFloat ${2.6+i*0.3}s ease-in-out infinite ${c.d}`,padding:6,overflow:"hidden"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:2,height:44}}>
            {[...Array(6)].map((_,j)=>(
              <div key={j} style={{background:`hsl(${80+j*12},${52+j*7}%,${26+j*5}%)`,borderRadius:2}}/>
            ))}
          </div>
          <div style={{height:3,background:c.c,borderRadius:2,marginTop:7,width:"58%",opacity:0.75}}/>
        </div>
      ))}
      <div style={{position:"absolute",bottom:18,right:18,animation:"astronautBob 2.2s ease-in-out infinite 0.5s"}}>
        <div style={{width:36,height:36,borderRadius:"50%",background:"rgba(205,255,80,0.13)",border:"1.5px solid rgba(205,255,80,0.38)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 16px rgba(205,255,80,0.18)"}}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none"><circle cx="11" cy="11" r="7" stroke="#cdff50" strokeWidth="2"/><path d="M20 20l-3-3" stroke="#cdff50" strokeWidth="2" strokeLinecap="round"/></svg>
        </div>
      </div>
    </div>
  );
}

function Scene03() {
  return (
    <div style={{position:"relative",width:280,height:240,flexShrink:0}}>
      {[{l:10,t:15,c:"#7b61ff",d:"0s"},{r:18,t:20,c:"#a78bfa",d:"0.5s"},{l:26,b:22,c:"#7b61ff",d:"1.1s"}].map(({l,t,r,b,c,d},i)=>(
        <span key={i} style={{position:"absolute",left:l,top:t,right:r,bottom:b,color:c,fontSize:11,animation:`twinkle ${1.8+i*0.4}s ease-in-out infinite ${d}`}}>✦</span>
      ))}
      <svg viewBox="0 0 280 240" width="280" height="240" style={{position:"absolute",inset:0}}>
        <line x1="140" y1="54" x2="78" y2="112" stroke="rgba(123,97,255,0.38)" strokeWidth="1.5" strokeDasharray="4 3"/>
        <line x1="140" y1="54" x2="202" y2="112" stroke="rgba(123,97,255,0.38)" strokeWidth="1.5" strokeDasharray="4 3"/>
        <line x1="78" y1="132" x2="44" y2="182" stroke="rgba(123,97,255,0.28)" strokeWidth="1" strokeDasharray="3 3"/>
        <line x1="78" y1="132" x2="114" y2="182" stroke="rgba(123,97,255,0.28)" strokeWidth="1" strokeDasharray="3 3"/>
        <line x1="202" y1="132" x2="174" y2="182" stroke="rgba(123,97,255,0.28)" strokeWidth="1" strokeDasharray="3 3"/>
        <line x1="202" y1="132" x2="232" y2="182" stroke="rgba(123,97,255,0.28)" strokeWidth="1" strokeDasharray="3 3"/>
      </svg>
      <div style={{position:"absolute",left:"50%",top:18,transform:"translateX(-50%)",animation:"astronautBob 3s ease-in-out infinite"}}>
        <div style={{padding:"6px 14px",background:"linear-gradient(135deg,#7b61ff,#5b41df)",borderRadius:8,fontSize:11,fontFamily:"monospace",color:"white",boxShadow:"0 0 22px rgba(123,97,255,0.55)",border:"1px solid rgba(163,139,250,0.4)",whiteSpace:"nowrap"}}>📁 Site Root</div>
      </div>
      {[{l:38,label:"Zone A"},{l:154,label:"Zone B"}].map((n,i)=>(
        <div key={i} style={{position:"absolute",left:n.l,top:98,animation:`cosmicFloat ${2.6+i*0.4}s ease-in-out infinite ${i*0.55}s`}}>
          <div style={{padding:"5px 10px",background:"rgba(123,97,255,0.16)",borderRadius:6,fontSize:10,fontFamily:"monospace",color:"rgba(163,139,250,0.9)",boxShadow:"0 0 12px rgba(123,97,255,0.2)",border:"1px solid rgba(123,97,255,0.35)",whiteSpace:"nowrap"}}>📂 {n.label}</div>
        </div>
      ))}
      {[{l:12,label:"Asset 1"},{l:86,label:"Asset 2"},{l:148,label:"Asset 3"},{l:208,label:"Asset 4"}].map((n,i)=>(
        <div key={i} style={{position:"absolute",left:n.l,top:166,animation:`twinkle ${2+i*0.3}s ease-in-out infinite ${i*0.2}s`}}>
          <div style={{padding:"4px 8px",background:"rgba(123,97,255,0.08)",borderRadius:5,fontSize:9,fontFamily:"monospace",color:"rgba(167,139,250,0.72)",border:"1px solid rgba(123,97,255,0.22)",whiteSpace:"nowrap"}}>🖼 {n.label}</div>
        </div>
      ))}
    </div>
  );
}

function Scene04() {
  return (
    <div style={{position:"relative",width:280,height:240,flexShrink:0}}>
      {[{l:12,t:14,c:"#00d4ff",d:"0s"},{r:20,t:18,c:"#67e8f9",d:"0.6s"},{r:34,b:18,c:"#00d4ff",d:"1.2s"}].map(({l,t,r,b,c,d},i)=>(
        <span key={i} style={{position:"absolute",left:l,top:t,right:r,bottom:b,color:c,fontSize:11,animation:`twinkle ${1.9+i*0.4}s ease-in-out infinite ${d}`}}>✦</span>
      ))}
      <div style={{position:"absolute",left:58,top:14,width:164,height:202,background:"linear-gradient(160deg,#050510,#0a0a1e)",borderRadius:22,border:"2px solid rgba(0,212,255,0.38)",boxShadow:"0 0 36px rgba(0,212,255,0.18),0 20px 50px rgba(0,0,0,0.65)",transform:"perspective(600px) rotateY(-8deg) rotateX(4deg)",overflow:"hidden",padding:10}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
          <div style={{width:32,height:3,background:"rgba(0,212,255,0.38)",borderRadius:2}}/><div style={{width:14,height:3,background:"rgba(0,212,255,0.6)",borderRadius:2}}/>
        </div>
        <div style={{width:"100%",height:132,background:"linear-gradient(135deg,#2c4a3e,#1a3028)",borderRadius:10,position:"relative",overflow:"hidden"}}>
          {[...Array(6)].map((_,i)=>(
            <div key={i} style={{position:"absolute",left:`${10+i*14}%`,top:`${8+Math.sin(i)*28}%`,width:`${14+i*3}%`,height:`${20+i*4}%`,background:`rgba(0,${160+i*16},${90+i*18},${0.1+i*0.04})`,borderRadius:3}}/>
          ))}
          {([[30,35,"#ff6b6b"],[70,60,"#ffb347"],[50,25,"#00d4ff"]] as [number,number,string][]).map(([x,y,c],i)=>(
            <div key={i} style={{position:"absolute",left:`${x}%`,top:`${y}%`,width:16,height:16,borderRadius:"50%",border:`2px solid ${c}`,boxShadow:`0 0 8px ${c}`,transform:"translate(-50%,-50%)",animation:`ping ${1.5+i*0.4}s cubic-bezier(0,0,0.2,1) infinite ${i*0.5}s`}}/>
          ))}
        </div>
        <div style={{marginTop:8,display:"flex",gap:4}}>
          {[40,60,30].map((w,i)=>(
            <div key={i} style={{height:4,width:`${w}%`,background:`rgba(0,212,255,${0.2+i*0.1})`,borderRadius:2}}/>
          ))}
        </div>
      </div>
      <div style={{position:"absolute",top:18,right:10,animation:"cosmicFloat 2.8s ease-in-out infinite"}}>
        <div style={{padding:"6px 10px",background:"rgba(0,212,255,0.1)",border:"1px solid rgba(0,212,255,0.38)",borderRadius:8,fontSize:9,fontFamily:"monospace",color:"#67e8f9",whiteSpace:"nowrap",boxShadow:"0 0 12px rgba(0,212,255,0.14)"}}>⚠ Defect found</div>
      </div>
      <div style={{position:"absolute",bottom:28,left:10,animation:"astronautBob 2.5s ease-in-out infinite 1s"}}>
        <svg viewBox="0 0 20 28" width="20" height="28" fill="none"><path d="M10 0C5.8 0 2.5 3.3 2.5 7.5c0 5.5 7.5 18 7.5 18s7.5-12.5 7.5-18C17.5 3.3 14.2 0 10 0z" fill="#00d4ff"/><circle cx="10" cy="7.5" r="3.5" fill="rgba(255,255,255,0.85)"/></svg>
      </div>
    </div>
  );
}

// eDocSafe document-search scene for project card
function SceneEdoc() {
  return (
    <div style={{ position: "relative", width: 280, height: 240, flexShrink: 0 }}>
      {/* Sparkles */}
      {[{l:10,t:14,d:"0s"},{r:18,t:20,d:"0.6s"},{l:28,b:18,d:"1.1s"}].map(({l,t,r,b,d},i) => (
        <span key={i} style={{position:"absolute",left:l,top:t,right:r,bottom:b,color:"#60a5fa",fontSize:10,animation:`twinkle ${1.8+i*0.4}s ease-in-out infinite ${d}`}}>✦</span>
      ))}
      {/* Browser window */}
      <div style={{position:"absolute",left:10,top:18,width:260,height:200,background:"linear-gradient(160deg,#0f172a,#1e293b)",borderRadius:12,border:"1.5px solid rgba(96,165,250,0.35)",boxShadow:"0 0 28px rgba(59,130,246,0.18),0 18px 48px rgba(0,0,0,0.65)",overflow:"hidden"}}>
        {/* Top bar */}
        <div style={{background:"#1e3a5f",padding:"8px 12px",display:"flex",alignItems:"center",gap:6}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:"rgba(255,255,255,0.2)"}}/>
          <div style={{flex:1,height:5,background:"rgba(255,255,255,0.07)",borderRadius:3}}/>
          <div style={{width:22,height:5,background:"#2563eb",borderRadius:3}}/>
        </div>
        {/* Search bar */}
        <div style={{margin:"10px 10px 6px",background:"rgba(255,255,255,0.06)",borderRadius:6,border:"1px solid rgba(96,165,250,0.3)",padding:"5px 10px",display:"flex",alignItems:"center",gap:6}}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="4.2" cy="4.2" r="3" stroke="#60a5fa" strokeWidth="1.2"/><path d="M7 7l1.5 1.5" stroke="#60a5fa" strokeWidth="1.2" strokeLinecap="round"/></svg>
          <div style={{width:120,height:4,background:"rgba(255,255,255,0.18)",borderRadius:2}}/>
        </div>
        {/* AI answer chip */}
        <div style={{margin:"0 10px 8px",background:"rgba(37,99,235,0.18)",border:"1px solid rgba(96,165,250,0.35)",borderRadius:6,padding:"6px 10px",animation:"cosmicFloat 3s ease-in-out infinite"}}>
          <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:4}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:"#f97316"}}/>
            <span style={{fontSize:8,color:"#60a5fa",fontFamily:"monospace",letterSpacing:"0.05em"}}>AI ANALYSIS</span>
          </div>
          <div style={{height:3,background:"rgba(255,255,255,0.25)",borderRadius:2,marginBottom:3,width:"90%"}}/>
          <div style={{height:3,background:"rgba(255,255,255,0.15)",borderRadius:2,width:"70%"}}/>
        </div>
        {/* Source rows */}
        {[["Board Resolution2.pdf","Loan"],["Board Resolution3.pdf","Loan"],["Board Resolution4.pdf","Credit"]].map(([name,tag],i) => (
          <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"4px 10px",borderTop:"1px solid rgba(255,255,255,0.04)"}}>
            <div style={{width:8,height:8,borderRadius:2,border:"1px solid rgba(96,165,250,0.4)",flexShrink:0}}/>
            <div style={{height:3,background:"rgba(255,255,255,0.2)",borderRadius:2,flex:1}}/>
            <div style={{padding:"1px 5px",background:"rgba(96,165,250,0.12)",borderRadius:3,fontSize:7,color:"#93c5fd",fontFamily:"monospace"}}>{tag}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectVisual({ num }: { num: string }) {
  if (num === "01") return <Scene01 />;
  if (num === "02") return <SceneEdoc />;
  if (num === "03") return <Scene03 />;
  return <Scene04 />;
}

// ─── PROJECT CARD ─────────────────────────────────────────────────────────────
function ProjectCard({ p, index, onOpen }: { p: typeof projects[0]; index: number; onOpen?: () => void }) {
  const ref = useReveal(index * 120);
  const left = p.imgSide === "right";
  const accentColors = ["#cdff50", "#00d4ff", "#7b61ff", "#ff6b6b"];
  const accent = accentColors[index % accentColors.length];
  const content = (
    <div className="flex flex-col gap-7 flex-1 min-w-0 z-10">
      <div className="flex flex-col gap-3">
        <p className="font-mono text-[72px] font-black leading-none select-none"
          style={{ WebkitTextStroke: `1px ${accent}30`, color: "transparent" }}>{p.num}</p>
        <h3 className="text-[clamp(22px,2.6vw,36px)] font-extrabold text-white leading-[1.15]" style={{ fontFamily: "Poppins,sans-serif" }}>{p.title}</h3>
        {"subtitle" in p && p.subtitle && (
          <p className="text-sm font-mono" style={{ color: accent, opacity: 0.85 }}>{p.subtitle}</p>
        )}
      </div>
      {"problem" in p && p.problem && (
        <p className="text-sm leading-[1.7]" style={{ color: "rgba(255,255,255,0.45)", maxWidth: "38ch" }}>{p.problem}</p>
      )}
      {"meta" in p && p.meta && (
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {p.meta.map(([label, val]: string[]) => (
            <div key={label} className="flex flex-col gap-0.5">
              <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>{label}</span>
              <span className="text-xs font-semibold text-white/80">{val}</span>
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {p.tags.map(t => <Tag key={t} label={t} />)}
      </div>
      {onOpen && (
        <button onClick={onOpen} className="flex items-center gap-4 group/btn">
          <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover/btn:scale-110"
            style={{ background: accent, boxShadow: `0 0 24px ${accent}50` }}>
            <img src={imgArrowRight} alt="" className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm transition-opacity duration-200 group-hover/btn:opacity-70" style={{ color: accent }}>View Case Study</span>
        </button>
      )}
    </div>
  );
  const image = (
    <div className="h-[280px] lg:h-[380px] w-full lg:w-[52%] flex-shrink-0 rounded-2xl overflow-hidden relative flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-500"
      style={{ background: `radial-gradient(ellipse at 60% 40%, ${accent}12 0%, rgba(5,5,25,0.7) 70%)`, border: `1px solid ${accent}20` }}>
      <ProjectVisual num={p.num} />
      <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ background: `linear-gradient(135deg, ${accent}06, transparent 60%)` }} />
      <div className="absolute top-4 left-4 px-3 py-1 rounded-full font-mono text-[10px] tracking-widest uppercase"
        style={{ background: `${accent}20`, border: `1px solid ${accent}40`, color: accent, backdropFilter: "blur(8px)" }}>
        {p.tags[0]}
      </div>
    </div>
  );
  return (
    <div ref={ref} className="reveal space-card group rounded-[32px] p-8 lg:p-10 flex flex-col lg:flex-row items-center gap-10 w-full"
      style={{ background: "rgba(5,5,25,0.7)", border: `1px solid rgba(123,97,255,0.15)`, backdropFilter: "blur(20px)" }}>
      {left ? <>{content}{image}</> : <>{image}{content}</>}
    </div>
  );
}

// ─── SERVICE CARD ─────────────────────────────────────────────────────────────
function ServiceCard({ s, index }: { s: typeof services[0]; index: number }) {
  const ref = useReveal(index * 100);
  return (
    <div ref={ref} className="reveal space-card group rounded-3xl p-8 flex flex-col justify-between h-72"
      style={{ background: "rgba(5,5,25,0.7)", border: "1px solid rgba(123,97,255,0.15)", backdropFilter: "blur(20px)" }}>
      <div className="flex items-center justify-between">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
          style={{ background: s.iconBg, boxShadow: `0 0 20px ${s.glow}30` }}>
          <img src={s.icon} alt="" className="w-7 h-7" />
        </div>
        <img src={imgArrowUpRight} alt="" className="w-5 h-5 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-2xl font-bold text-white">{s.title}</h3>
        <p className="text-sm leading-[1.6]" style={{ color: "rgba(255,255,255,0.5)" }}>{s.desc}</p>
      </div>
    </div>
  );
}

// ─── PROCESS STEP ─────────────────────────────────────────────────────────────
function ProcessStep({ step, index }: { step: typeof processSteps[0]; index: number }) {
  const ref = useReveal(index * 140);
  return (
    <div ref={ref} className="reveal flex flex-col gap-6">
      <div className="relative w-16 h-16 flex items-center justify-center">
        {/* Spinning orbit ring */}
        <svg className="orbit-ring absolute inset-0 w-full h-full" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="29" stroke={step.color} strokeWidth="1" strokeDasharray="8 6" opacity="0.5" />
        </svg>
        <div className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: `${step.color}18`, border: `1.5px solid ${step.color}`, boxShadow: `0 0 16px ${step.color}40` }}>
          <span className="font-mono font-black text-sm" style={{ color: step.color }}>{step.num}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-extrabold text-white">{step.title}</h3>
        <p className="text-sm leading-[1.6]" style={{ color: "rgba(255,255,255,0.5)" }}>{step.desc}</p>
      </div>
    </div>
  );
}

// ─── CASE STUDY 01 ────────────────────────────────────────────────────────────
const imgInspection04       = `${assetPathPrefix}/inspection04.png`;
const imgSpectraGallery     = `${assetPathPrefix}/spectra-1.png`;
const imgSpectraAnnotation  = `${assetPathPrefix}/spectra-2.png`;
const imgSpectraList        = `${assetPathPrefix}/spectra-3.png`;

function useCSReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => el.classList.add("visible"), delay); obs.unobserve(el); }
    }, { threshold: 0.08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return ref;
}

function CSSectionBadge({ text }: { text: string }) {
  return (
    <p className="font-mono text-xs tracking-[0.35em] uppercase" style={{ color: "#cdff50" }}>{text}</p>
  );
}

// Brief card shown below each screenshot
function BriefCard({ label, title, body, accent }: { label: string; title: string; body: string; accent: string }) {
  return (
    <div className="flex flex-col gap-3 p-6 rounded-2xl flex-1"
      style={{ background: "rgba(5,5,25,0.65)", border: `1px solid ${accent}22`, backdropFilter: "blur(16px)" }}>
      <span className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: accent }}>{label}</span>
      <h4 className="font-bold text-white leading-snug" style={{ fontSize: "clamp(15px,1.5vw,18px)" }}>{title}</h4>
      <p className="text-sm leading-[1.75]" style={{ color: "rgba(255,255,255,0.52)" }}>{body}</p>
    </div>
  );
}

// Feature section: full screenshot + optional brief cards below
function FeatureScene({
  num, img, alt, accent, briefs,
}: {
  num: string; img: string; alt: string;
  accent: string;
  briefs: { label: string; title: string; body: string }[];
}) {
  const ref = useCSReveal(0);
  return (
    <div ref={ref} className="reveal flex flex-col gap-6 w-full px-5 lg:px-16 xl:px-20 py-12" style={{ zIndex: 2 }}>
      {/* Feature number strip */}
      <div className="flex items-center gap-4">
        <span className="font-mono font-black leading-none select-none" style={{ fontSize: "clamp(52px,7vw,80px)", color: "rgba(255,255,255,0.05)", letterSpacing: "-2px" }}>
          {num}
        </span>
        <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${accent}40, transparent)` }} />
      </div>

      {/* Full screenshot   no cropping */}
      <div className="w-full rounded-2xl overflow-hidden shadow-2xl"
        style={{ border: `1px solid ${accent}18` }}>
        <img src={img} alt={alt} className="w-full h-auto block" />
      </div>

      {/* Brief cards */}
      {briefs.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4">
          {briefs.map(b => (
            <BriefCard key={b.label} {...b} accent={accent} />
          ))}
        </div>
      )}
    </div>
  );
}

// Sticky note card   mimics a physical post-it
function Sticky({ children, color = "#f5e88a", rotate = 0 }: { children: React.ReactNode; color?: string; rotate?: number }) {
  return (
    <div style={{
      background: color,
      borderRadius: 4,
      padding: "14px 16px",
      transform: `rotate(${rotate}deg)`,
      boxShadow: "2px 4px 18px rgba(0,0,0,0.45)",
      fontFamily: "'Caveat', cursive",
      fontSize: 15,
      color: "#1a1a1a",
      lineHeight: 1.5,
      minWidth: 140,
    }}>
      {children}
    </div>
  );
}

// Design annotation   arrow + label floating beside UI
function DesignNote({ children, side = "right" }: { children: React.ReactNode; side?: "left" | "right" }) {
  return (
    <div className={`flex items-start gap-2 ${side === "left" ? "flex-row-reverse" : ""}`}>
      <svg width="32" height="24" viewBox="0 0 32 24" fill="none" style={{ flexShrink: 0, marginTop: 4, transform: side === "left" ? "scaleX(-1)" : undefined, opacity: 0.6 }}>
        <path d="M2 20 C8 12, 22 6, 30 2" stroke="rgba(255,255,255,0.7)" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
        <path d="M27 1 L31 4 L27 6" stroke="rgba(255,255,255,0.7)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
      <p style={{ fontFamily: "'Caveat', cursive", fontSize: "clamp(15px,1.5vw,18px)", color: "rgba(255,255,255,0.78)", lineHeight: 1.5, textAlign: side === "left" ? "right" : "left" }}>
        {children}
      </p>
    </div>
  );
}

// Horizontal divider with label
function StoryDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-5 px-5 lg:px-20 py-6" style={{ zIndex: 2 }}>
      <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
      <span className="font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: "rgba(255,255,255,0.22)", whiteSpace: "nowrap" }}>{label}</span>
      <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
    </div>
  );
}

function CaseStudy01({ onBack }: { onBack: () => void }) {
  const rHero     = useCSReveal(0);
  const rMeta     = useCSReveal(80);
  const rContext  = useCSReveal(0);
  const rProblem  = useCSReveal(0);
  const rInsights = useCSReveal(0);
  const rDecision = useCSReveal(0);
  const rGallery  = useCSReveal(0);
  const rAnnote   = useCSReveal(0);
  const rList     = useCSReveal(0);
  const rResult   = useCSReveal(0);
  const rReflect  = useCSReveal(0);

  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  return (
    <div className="bg-[#00000d] min-h-screen w-full overflow-x-hidden relative page-enter">
      <StarField />

      {/* Back button */}
      <button onClick={onBack}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xs tracking-wider transition-all duration-300 hover:scale-105"
        style={{ background: "rgba(5,5,25,0.88)", border: "1px solid rgba(123,97,255,0.35)", color: "rgba(255,255,255,0.7)", backdropFilter: "blur(20px)" }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back
      </button>

      {/* ── 01 HERO ───────────────────────────────── */}
      <section className="relative pt-32 pb-16 px-5 lg:px-20 overflow-hidden" style={{ zIndex: 2 }}>
        <div className="nebula w-[700px] h-[700px]" style={{ background: "radial-gradient(circle, rgba(240,91,40,0.15) 0%, transparent 70%)", top: "-15%", left: "-10%", animationDuration: "18s" }} />
        <div ref={rHero} className="reveal flex flex-col gap-6 max-w-4xl">
          <span className="font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: "#cdff50" }}>Spectra   Inspection Module</span>
          <h1 className="font-black leading-[1.0] text-white" style={{ fontSize: "clamp(42px,6vw,80px)", letterSpacing: "-1.5px" }}>
            One workspace.<br />Every inspection.
          </h1>
          <p className="text-xl leading-[1.8] max-w-2xl" style={{ color: "rgba(255,255,255,0.52)", fontWeight: 400 }}>
            Surveyors were losing findings between a drone, a drive, a notepad, and a reporting tool. Nothing carried from capture to insight to report.
          </p>
        </div>
        <div ref={rMeta} className="reveal flex flex-wrap gap-10 mt-10">
          {[["My Role", "Research · UX Design · Dev Handoff"], ["Team", "1 PM · 5 Engineers"], ["Timeline", "2 Weeks"], ["Platform", "Web App (SaaS)"]].map(([label, val]) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="font-mono text-[9px] tracking-[0.3em] uppercase" style={{ color: "rgba(255,255,255,0.25)" }}>{label}</span>
              <span className="font-semibold text-sm text-white">{val}</span>
            </div>
          ))}
        </div>
      </section>

      <StoryDivider label="The Problem" />

      {/* ── 02 PROBLEM ────────────────────────────── */}
      <section className="relative px-5 lg:px-20 py-16 overflow-hidden" style={{ zIndex: 2 }}>
        <div className="nebula w-[500px] h-[500px]" style={{ background: "radial-gradient(circle, rgba(240,91,40,0.1) 0%, transparent 70%)", top: 0, right: "-10%", animationDuration: "20s" }} />
        <div ref={rProblem} className="reveal flex flex-col gap-10 max-w-5xl">
          <p className="font-extrabold text-white leading-[1.2]" style={{ fontSize: "clamp(26px,3.5vw,40px)" }}>
            Inspection was four tools pretending to be one workflow
          </p>
          <p className="text-base leading-[1.85] max-w-2xl" style={{ color: "rgba(255,255,255,0.45)" }}>
            Surveyors captured media in the field, then rebuilt the story somewhere else. Every tool break meant lost context   and a decision made from incomplete evidence.
          </p>

          {/* Broken workflow */}
          <div className="flex flex-wrap gap-3 items-center">
            {["Drone captures media", "→", "Dump to shared drive", "→", "Hunt for the right file", "→", "Annotate in notepad", "→", "Rebuild report elsewhere"].map((step, i) => (
              step === "→"
                ? <span key={i} style={{ color: "#ff6b6b", fontSize: 20, fontWeight: 700 }}>→</span>
                : <div key={i} className="px-4 py-2 rounded-xl text-sm font-medium"
                    style={{ background: i % 2 === 0 ? "rgba(255,107,107,0.08)" : "rgba(255,107,107,0.04)", border: "1px solid rgba(255,107,107,0.2)", color: "rgba(255,255,255,0.65)" }}>
                    {step}
                  </div>
            ))}
          </div>

          {/* Sticky notes   4 pain points */}
          <div>
            <p style={{ fontFamily: "'Caveat', cursive", fontSize: 20, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>What kept breaking</p>
            <div className="flex flex-wrap gap-5">
              <Sticky rotate={-2}>
                <strong>Media loses location</strong><br />
                Once images left the drone, nothing tied them to the asset or coordinates they came from.
              </Sticky>
              <Sticky color="#ffd4a8" rotate={1.5}>
                <strong>Finding file costs more than reviewing it</strong><br />
                Surveyors spent longer hunting in a drive than assessing what was in the file.
              </Sticky>
              <Sticky color="#c8f5d4" rotate={-1}>
                <strong>Observations don't persist</strong><br />
                Notes lived in loose screenshots. Insight from one inspection never reached the next.
              </Sticky>
              <Sticky color="#d4e8ff" rotate={2}>
                <strong>Reports rebuilt from scratch</strong><br />
                Every handoff meant reassembling the story in a separate tool   long after the inspection ended.
              </Sticky>
            </div>
          </div>

          {/* Pull quote */}
          <blockquote className="border-l-2 pl-6 py-2 max-w-xl" style={{ borderColor: "#7b61ff" }}>
            <p style={{ fontFamily: "'Caveat', cursive", fontSize: "clamp(20px,2.5vw,28px)", color: "rgba(255,255,255,0.82)", lineHeight: 1.4 }}>
              "On any shared image, the reviewer's first question was where   not what."
            </p>
            <span className="font-mono text-xs mt-3 block" style={{ color: "rgba(255,255,255,0.3)" }}>  From user interviews</span>
          </blockquote>
        </div>
      </section>

      <StoryDivider label="My Role + Context" />

      {/* ── 03 ROLE / CONTEXT ─────────────────────── */}
      <section className="relative px-5 lg:px-20 py-16" style={{ zIndex: 2 }}>
        <div ref={rContext} className="reveal flex flex-col lg:flex-row gap-12 max-w-5xl">
          <div className="flex flex-col gap-5 flex-1">
            <p className="font-extrabold text-white leading-[1.2]" style={{ fontSize: "clamp(22px,3vw,34px)" }}>
              No existing feature to learn from
            </p>
            <p className="text-sm leading-[1.9]" style={{ color: "rgba(255,255,255,0.45)" }}>
              The workflow only existed outside the product   in drives, notepads, and email threads. I went to where it was actually happening.
            </p>
            <p className="text-sm leading-[1.9]" style={{ color: "rgba(255,255,255,0.45)" }}>
              I owned research, interaction design, visual design, and the developer handoff   working alongside the PM to scope what was achievable in two weeks without cutting the core experience.
            </p>
          </div>
          <div className="flex flex-col gap-3 lg:w-72 flex-shrink-0">
            {[
              { label: "Research", items: ["Surveyor interviews (5)", "Reviewer interviews (3)", "Workflow shadowing"] },
              { label: "Constraints", items: ["2-week sprint", "Existing component library", "No field testing access"] },
            ].map(g => (
              <div key={g.label} className="p-5 rounded-2xl" style={{ background: "rgba(5,5,25,0.7)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="font-mono text-[9px] tracking-[0.3em] uppercase mb-3" style={{ color: "#cdff50" }}>{g.label}</p>
                {g.items.map(item => (
                  <p key={item} className="text-xs py-1 border-b last:border-0 leading-relaxed" style={{ color: "rgba(255,255,255,0.5)", borderColor: "rgba(255,255,255,0.05)" }}>{item}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <StoryDivider label="Research Findings" />

      {/* ── 04 INSIGHTS ───────────────────────────── */}
      <section className="relative px-5 lg:px-20 py-16" style={{ zIndex: 2 }}>
        <div ref={rInsights} className="reveal flex flex-col gap-10 max-w-5xl">
          <p className="font-extrabold text-white leading-[1.2]" style={{ fontSize: "clamp(22px,3vw,36px)" }}>
            What the mapping showed
          </p>

          {/* Two user types */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { name: "Field Surveyors", note: "High media volume. Limited time on site. Need to capture fast and find faster.", color: "#cdff50" },
              { name: "Reviewers + Project Leads", note: "Never visit the site. They decide entirely from what the surveyor documented.", color: "#7b61ff" },
            ].map(u => (
              <div key={u.name} className="p-6 rounded-2xl flex flex-col gap-3"
                style={{ background: "rgba(5,5,25,0.7)", border: `1px solid ${u.color}20` }}>
                <span className="font-mono text-[9px] tracking-[0.3em] uppercase" style={{ color: u.color }}>User type</span>
                <h4 className="font-bold text-white text-base">{u.name}</h4>
                <p className="text-sm leading-[1.8]" style={{ color: "rgba(255,255,255,0.45)" }}>{u.note}</p>
              </div>
            ))}
          </div>

          {/* Key findings as stickies */}
          <div>
            <p style={{ fontFamily: "'Caveat', cursive", fontSize: 20, color: "rgba(255,255,255,0.35)", marginBottom: 20 }}>Key insights from interviews</p>
            <div className="flex flex-wrap gap-5">
              <Sticky rotate={1}><strong>Media arrived unstructured</strong><br />Bulk uploads landed as flat folders   no relationship to zones or assets.</Sticky>
              <Sticky color="#ffd4a8" rotate={-1.5}><strong>Location lost at import</strong><br />Coordinates sat in file metadata but nothing surfaced them. Surveyors rebuilt the map from memory.</Sticky>
              <Sticky color="#c8f5d4" rotate={2}><strong>Two modes of looking</strong><br />Scan visually for defects. Audit status across the full set. Never both at once in any existing tool.</Sticky>
              <Sticky color="#e8d4ff" rotate={-2}><strong>Reporting was the biggest time sink</strong><br />Every report reassembled by hand   long after the inspection ended.</Sticky>
            </div>
          </div>
        </div>
      </section>

      <StoryDivider label="Design Decisions" />

      {/* ── 05 DECISIONS ──────────────────────────── */}
      <section className="relative px-5 lg:px-20 py-16 overflow-hidden" style={{ zIndex: 2 }}>
        <div className="nebula w-[500px] h-[500px]" style={{ background: "radial-gradient(circle, rgba(123,97,255,0.08) 0%, transparent 70%)", top: 0, left: "-10%", animationDuration: "22s" }} />
        <div ref={rDecision} className="reveal flex flex-col gap-8 max-w-5xl">
          <p className="font-extrabold text-white leading-[1.2]" style={{ fontSize: "clamp(22px,3vw,36px)" }}>
            How do we solve this?
          </p>
          <p className="text-sm leading-[1.9] max-w-xl" style={{ color: "rgba(255,255,255,0.4)" }}>
            Six decisions shaped the workspace. Each one came from a specific research finding.
          </p>
          <div className="flex flex-col gap-4">
            {[
              { d: "Start from the site, not the files", r: "Tree view mirrors real hierarchy: tower → phase → asset. Live counts at every level so surveyors know what's in a zone before opening it.", accent: "#cdff50" },
              { d: "Every image knows where it came from", r: "The map is not a separate tab. Selecting a file pins it on the map. Selecting a pin surfaces the file. The link never breaks.", accent: "#00d4ff" },
              { d: "Two ways of looking, one set of files", r: "Gallery for visual defect spotting. List for auditing status across hundreds. A toggle   not a page change   keeps both in reach.", accent: "#7b61ff" },
              { d: "Coverage without opening a file", r: "Filters for type, asset, defect, tag, and date narrow 1,246 files to the ones that matter. No side spreadsheet.", accent: "#ff6b6b" },
              { d: "Findings that stay attached", r: "Annotate a defect directly on the image. The finding is coordinate-bound evidence, not a separate note. It survives into the next inspection.", accent: "#cdff50" },
              { d: "Reporting starts where the inspection ended", r: "Findings reach other teams from the same screen that produced them. No rebuilding the story elsewhere.", accent: "#00d4ff" },
            ].map((item, i) => (
              <div key={i} className="flex gap-5 p-6 rounded-2xl group transition-all duration-300"
                style={{ background: "rgba(5,5,25,0.6)", border: `1px solid ${item.accent}14` }}>
                <span className="font-mono text-xs flex-shrink-0 pt-1" style={{ color: item.accent }}>0{i + 1}</span>
                <div className="flex flex-col gap-2">
                  <p className="font-bold text-white text-sm">{item.d}</p>
                  <p className="text-xs leading-[1.85]" style={{ color: "rgba(255,255,255,0.42)" }}>{item.r}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <StoryDivider label="The Solution" />

      {/* ── 06 SOLUTION: Gallery + Tree view ─────── */}
      <section className="relative px-5 lg:px-16 xl:px-20 py-16" style={{ zIndex: 2 }}>
        <div ref={rGallery} className="reveal flex flex-col gap-8 max-w-6xl">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[9px] tracking-[0.4em] uppercase" style={{ color: "#cdff50" }}>Feature 01</span>
            <p className="font-extrabold text-white leading-[1.2]" style={{ fontSize: "clamp(22px,3vw,34px)" }}>
              Gallery view + Tree navigation
            </p>
            <p className="text-sm leading-[1.85] max-w-xl" style={{ color: "rgba(255,255,255,0.42)" }}>
              Tree view orients. Gallery view finds. Together they replace the flat drive dump surveyors were relying on.
            </p>
          </div>
          <div className="w-full rounded-2xl overflow-hidden shadow-2xl" style={{ border: "1px solid rgba(205,255,80,0.1)" }}>
            <img src={imgSpectraGallery} alt="Gallery and tree view" className="w-full h-auto block" />
          </div>
          <div className="flex flex-wrap gap-4 mt-2">
            <DesignNote>Tree mirrors real site hierarchy   surveyors always know where they are</DesignNote>
            <DesignNote>Thumbnails let you spot the right file without opening it</DesignNote>
          </div>
        </div>
      </section>

      {/* ── 07 SOLUTION: Annotation ───────────────── */}
      <section className="relative px-5 lg:px-16 xl:px-20 py-16" style={{ zIndex: 2 }}>
        <div ref={rAnnote} className="reveal flex flex-col gap-8 max-w-6xl">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[9px] tracking-[0.4em] uppercase" style={{ color: "#7b61ff" }}>Feature 02</span>
            <p className="font-extrabold text-white leading-[1.2]" style={{ fontSize: "clamp(22px,3vw,34px)" }}>
              Annotation   defect as precise evidence
            </p>
            <p className="text-sm leading-[1.85] max-w-xl" style={{ color: "rgba(255,255,255,0.42)" }}>
              Mark directly on the image. The finding is attached to the asset with its coordinates   not buried in a notepad three tabs away.
            </p>
          </div>
          <div className="w-full rounded-2xl overflow-hidden shadow-2xl" style={{ border: "1px solid rgba(123,97,255,0.1)" }}>
            <img src={imgSpectraAnnotation} alt="Annotation view" className="w-full h-auto block" />
          </div>
          <div className="flex flex-wrap gap-4 mt-2">
            <DesignNote>Draw on the image, not beside it   context is never lost</DesignNote>
            <DesignNote>Annotation persists into the next inspection cycle</DesignNote>
          </div>
        </div>
      </section>

      {/* ── 08 SOLUTION: List view ────────────────── */}
      <section className="relative px-5 lg:px-16 xl:px-20 py-16" style={{ zIndex: 2 }}>
        <div ref={rList} className="reveal flex flex-col gap-8 max-w-6xl">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[9px] tracking-[0.4em] uppercase" style={{ color: "#00d4ff" }}>Feature 03</span>
            <p className="font-extrabold text-white leading-[1.2]" style={{ fontSize: "clamp(22px,3vw,34px)" }}>
              List view   audit at a glance
            </p>
            <p className="text-sm leading-[1.85] max-w-xl" style={{ color: "rgba(255,255,255,0.42)" }}>
              Sort, filter, and track status across hundreds of files. The questions that used to live in a side spreadsheet   answered in place.
            </p>
          </div>
          <div className="w-full rounded-2xl overflow-hidden shadow-2xl" style={{ border: "1px solid rgba(0,212,255,0.1)" }}>
            <img src={imgSpectraList} alt="List view" className="w-full h-auto block" />
          </div>
          <div className="flex flex-wrap gap-4 mt-2">
            <DesignNote>Metadata in columns   name, date, status, tags surfaced without opening a file</DesignNote>
            <DesignNote>Toggle between gallery and list   same files, different lens</DesignNote>
          </div>
        </div>
      </section>

      <StoryDivider label="Results" />

      {/* ── 09 RESULT ─────────────────────────────── */}
      <section className="relative px-5 lg:px-20 py-20 overflow-hidden" style={{ zIndex: 2 }}>
        <div className="nebula w-[600px] h-[600px]" style={{ background: "radial-gradient(circle, rgba(205,255,80,0.1) 0%, rgba(123,97,255,0.06) 50%, transparent 70%)", top: 0, left: "50%", transform: "translateX(-50%)", animationDuration: "20s" }} />
        <div ref={rResult} className="reveal relative z-10 flex flex-col gap-12 max-w-5xl mx-auto">
          <p className="font-extrabold text-white leading-[1.2]" style={{ fontSize: "clamp(24px,3vw,38px)" }}>
            What actually changed
          </p>
          <div className="flex flex-wrap gap-12">
            {[
              { val: "40%", label: "Reduction in time spent locating files", accent: "#cdff50" },
              { val: "1.2k+", label: "Media files managed per inspection", accent: "#7b61ff" },
              { val: "2x", label: "Faster report turnaround", accent: "#00d4ff" },
            ].map(s => (
              <div key={s.label} className="flex flex-col gap-2">
                <span className="font-black" style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(40px,5.5vw,60px)", color: s.accent, textShadow: `0 0 28px ${s.accent}60` }}>
                  {s.val}
                </span>
                <span className="text-xs leading-[1.6] max-w-[16ch]" style={{ color: "rgba(255,255,255,0.38)", fontFamily: "'JetBrains Mono', monospace" }}>{s.label}</span>
              </div>
            ))}
          </div>
          <p className="text-base leading-[1.9] max-w-2xl" style={{ color: "rgba(255,255,255,0.45)" }}>
            The module shipped as part of Spectra 2.0. Field surveyors onboarded in a single session. Reviewers reported answering location questions without contacting the surveyor for the first time   a workflow that previously required a phone call now resolved in the UI.
          </p>
        </div>
      </section>

      <StoryDivider label="Reflection" />

      {/* ── 10 REFLECTION ─────────────────────────── */}
      <section className="px-5 lg:px-20 py-16 max-w-5xl" style={{ zIndex: 2 }}>
        <div ref={rReflect} className="reveal flex flex-col gap-8">
          <p className="font-extrabold text-white leading-[1.2]" style={{ fontSize: "clamp(22px,3vw,34px)" }}>
            What I'd do differently
          </p>
          <div className="flex flex-col gap-4">
            {[
              { n: "01", text: "The two-week timeline meant skipping a usability test round before handoff. One more pass with field surveyors would have caught the ambiguity in the filter labels earlier." },
              { n: "02", text: "I'd validate the annotation format with reviewers before build. Their mental model of a finding differed from the surveyor's   we discovered this late and had to absorb it in the handoff notes rather than the design." },
            ].map(item => (
              <div key={item.n} className="flex gap-6 p-6 rounded-2xl" style={{ background: "rgba(5,5,25,0.55)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <span className="font-mono text-xs flex-shrink-0 pt-0.5" style={{ color: "#cdff50" }}>{item.n}</span>
                <p className="text-sm leading-[1.9]" style={{ color: "rgba(255,255,255,0.45)" }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BACK ─────────────────────────────────── */}
      <section className="px-5 lg:px-20 py-24 flex justify-center" style={{ zIndex: 2 }}>
        <button onClick={onBack}
          className="group flex items-center gap-4 px-10 py-5 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105"
          style={{ background: "rgba(5,5,25,0.7)", border: "1px solid rgba(123,97,255,0.3)", color: "rgba(255,255,255,0.8)", backdropFilter: "blur(20px)" }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="transition-transform duration-300 group-hover:-translate-x-1">
            <path d="M13 15L8 10l5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to portfolio
        </button>
      </section>

      <footer className="px-5 lg:px-20 py-8 flex items-center justify-center" style={{ zIndex: 2, borderTop: "1px solid rgba(123,97,255,0.08)" }}>
        <p className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>© 2025 Ananya Bhuyan</p>
      </footer>
    </div>
  );
}

// ─── CASE STUDY 02 ────────────────────────────────────────────────────────────
const imgEdocIntro    = `${assetPathPrefix}/edoc-intro.png`;
const imgEdocProblem  = `${assetPathPrefix}/edoc-problem.png`;
const imgEdocResearch = `${assetPathPrefix}/edoc-research.png`;
const imgEdocSolution = `${assetPathPrefix}/edoc-solution.png`;

function CaseStudy02({ onBack }: { onBack: () => void }) {
  const rHero     = useCSReveal(0);
  const rMeta     = useCSReveal(80);
  const rContext  = useCSReveal(0);
  const rProblem  = useCSReveal(0);
  const rQuotes   = useCSReveal(0);
  const rResearch = useCSReveal(0);
  const rSolution = useCSReveal(0);
  const rResult   = useCSReveal(0);
  const rReflect  = useCSReveal(0);

  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  return (
    <div className="bg-[#00000d] min-h-screen w-full overflow-x-hidden relative page-enter">
      <StarField />

      {/* Back button */}
      <button onClick={onBack}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xs tracking-wider transition-all duration-300 hover:scale-105"
        style={{ background: "rgba(5,5,25,0.88)", border: "1px solid rgba(59,130,246,0.35)", color: "rgba(255,255,255,0.7)", backdropFilter: "blur(20px)" }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back
      </button>

      {/* ── 01 HERO ─────────────────────────────────── */}
      <section className="relative pt-32 pb-16 px-5 lg:px-20 overflow-hidden" style={{ zIndex: 2 }}>
        <div className="nebula w-[700px] h-[700px]" style={{ background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)", top: "-15%", left: "-10%", animationDuration: "18s" }} />
        <div ref={rHero} className="reveal flex flex-col gap-6 max-w-4xl">
          <span className="font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: "#60a5fa" }}>eDOCSAFE.AI   at iBind Systems</span>
          <h1 className="font-black leading-[1.0] text-white" style={{ fontSize: "clamp(40px,6vw,78px)", letterSpacing: "-1.5px" }}>
            Finding a file without<br />remembering its name
          </h1>
          <p className="text-xl leading-[1.8] max-w-2xl" style={{ color: "rgba(255,255,255,0.5)", fontWeight: 400 }}>
            A feature deep dive into search for a cloud document platform, where retrieval was costing more time than the work itself.
          </p>
        </div>
        <div ref={rMeta} className="reveal flex flex-wrap gap-10 mt-10">
          {[["My Role", "UX Research · Interaction Design"], ["Team", "2 Designers · 1 PM · 4 Engineers"], ["Timeline", "3 Weeks"], ["Platform", "Web App (SaaS)"]].map(([label, val]) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="font-mono text-[9px] tracking-[0.3em] uppercase" style={{ color: "rgba(255,255,255,0.25)" }}>{label}</span>
              <span className="font-semibold text-sm text-white">{val}</span>
            </div>
          ))}
        </div>
      </section>

      <StoryDivider label="Context" />

      {/* ── 02 CONTEXT ─────────────────────────────── */}
      <section className="relative px-5 lg:px-20 py-16" style={{ zIndex: 2 }}>
        <div ref={rContext} className="reveal flex flex-col lg:flex-row gap-12 max-w-5xl items-start">
          <div className="flex flex-col gap-5 flex-1">
            <p className="font-extrabold text-white leading-[1.2]" style={{ fontSize: "clamp(22px,3vw,34px)" }}>
              The structure was sound. Getting back to a specific document was not.
            </p>
            <p className="text-sm leading-[1.9]" style={{ color: "rgba(255,255,255,0.45)" }}>
              eDocSafe is a cloud-based AI platform for document management at iBind Systems. Users organise files into custom Workspaces in the sidebar, naming each to match how they actually think about their work. The filing system made sense. Retrieval didn't follow.
            </p>
            <p className="text-sm leading-[1.9]" style={{ color: "rgba(255,255,255,0.45)" }}>
              The existing search required an exact filename match. In practice, nobody remembered filenames   they remembered what a document was about.
            </p>
          </div>
          <div className="lg:w-[52%] flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl" style={{ border: "1px solid rgba(59,130,246,0.12)" }}>
            <img src={imgEdocIntro} alt="eDocSafe workspace view" className="w-full h-auto block" />
          </div>
        </div>
      </section>

      <StoryDivider label="The Problem" />

      {/* ── 03 PROBLEM ─────────────────────────────── */}
      <section className="relative px-5 lg:px-20 py-16 overflow-hidden" style={{ zIndex: 2 }}>
        <div className="nebula w-[500px] h-[500px]" style={{ background: "radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)", top: 0, right: "-10%", animationDuration: "20s" }} />
        <div ref={rProblem} className="reveal flex flex-col gap-10 max-w-5xl">
          <p className="font-extrabold text-white leading-[1.2]" style={{ fontSize: "clamp(26px,3.5vw,40px)" }}>
            The filing worked. The finding didn't.
          </p>
          <p className="text-sm leading-[1.9] max-w-2xl" style={{ color: "rgba(255,255,255,0.45)" }}>
            Retrieval depended on recalling an exact filename. For teams handling hundreds of documents   board resolutions, cheques, loan records   that memory requirement quietly became the bottleneck.
          </p>
          <div className="w-full rounded-2xl overflow-hidden shadow-2xl" style={{ border: "1px solid rgba(239,68,68,0.1)" }}>
            <img src={imgEdocProblem} alt="The problem   challenges in document retrieval" className="w-full h-auto block" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="p-6 rounded-2xl flex flex-col gap-3" style={{ background: "rgba(5,5,25,0.7)", border: "1px solid rgba(239,68,68,0.15)" }}>
              <span className="font-mono text-[9px] tracking-[0.3em] uppercase" style={{ color: "#f87171" }}>The User Challenge</span>
              <p className="text-sm leading-[1.85]" style={{ color: "rgba(255,255,255,0.5)" }}>Users couldn't remember exact filenames, so every lookup turned into a manual hunt through workspaces.</p>
            </div>
            <div className="p-6 rounded-2xl flex flex-col gap-3" style={{ background: "rgba(5,5,25,0.7)", border: "1px solid rgba(251,146,60,0.15)" }}>
              <span className="font-mono text-[9px] tracking-[0.3em] uppercase" style={{ color: "#fb923c" }}>The Business Impact</span>
              <p className="text-sm leading-[1.85]" style={{ color: "rgba(255,255,255,0.5)" }}>Time lost to retrieval compounded across the team, pulling directly at operational efficiency.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 04 WHAT USERS SAID ─────────────────────── */}
      <section className="relative px-5 lg:px-20 py-16" style={{ zIndex: 2 }}>
        <div ref={rQuotes} className="reveal flex flex-col gap-8 max-w-4xl">
          <p style={{ fontFamily: "'Caveat', cursive", fontSize: 20, color: "rgba(255,255,255,0.35)" }}>What users said</p>
          <div className="flex flex-col gap-5">
            {[
              { q: "I need a quicker way to find documents.", delay: "0s" },
              { q: "I want to find files easily without remembering exact names.", delay: "0.15s" },
              { q: "I need my files at my fingertips, effortlessly.", delay: "0.3s" },
            ].map(({ q, delay }) => (
              <blockquote key={q} className="border-l-2 pl-6 py-1" style={{ borderColor: "#3b82f6", animationDelay: delay }}>
                <p style={{ fontFamily: "'Caveat', cursive", fontSize: "clamp(20px,2.8vw,30px)", color: "rgba(255,255,255,0.82)", lineHeight: 1.4 }}>
                  "{q}"
                </p>
              </blockquote>
            ))}
          </div>
          <p className="text-sm leading-[1.8] max-w-xl" style={{ color: "rgba(255,255,255,0.35)" }}>
            The pattern underneath all three: people remembered what a document was about, never what it was called.
          </p>
        </div>
      </section>

      <StoryDivider label="Research + Insights" />

      {/* ── 05 RESEARCH ────────────────────────────── */}
      <section className="relative px-5 lg:px-20 py-16" style={{ zIndex: 2 }}>
        <div ref={rResearch} className="reveal flex flex-col gap-10 max-w-5xl">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="flex flex-col gap-5 flex-1">
              <p className="font-extrabold text-white leading-[1.2]" style={{ fontSize: "clamp(22px,3vw,34px)" }}>
                Understanding the needs of our users
              </p>
              <p className="text-sm leading-[1.9]" style={{ color: "rgba(255,255,255,0.45)" }}>
                I collaborated with a teammate to conduct observed sessions and structured interviews with 8 users   a mix of account managers and operations staff   focusing on how they currently located documents and where the friction lived.
              </p>
              <div className="flex flex-col gap-3 mt-2">
                {[
                  { title: "People search by meaning, not label", body: "Queries came out as questions about document content, not as filenames or tags." },
                  { title: "Accuracy mattered more than speed", body: "A fast search returning the wrong document still cost a second search   and eroded trust in the tool." },
                  { title: "Repository size was the multiplier", body: "The larger the workspace, the more the naming problem compounded. Teams with 500+ files felt it most." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-5 rounded-xl" style={{ background: "rgba(5,5,25,0.6)", border: "1px solid rgba(59,130,246,0.1)" }}>
                    <span className="font-mono text-[9px] pt-1 flex-shrink-0" style={{ color: "#60a5fa" }}>0{i + 1}</span>
                    <div>
                      <p className="font-bold text-white text-sm mb-1">{item.title}</p>
                      <p className="text-xs leading-[1.8]" style={{ color: "rgba(255,255,255,0.42)" }}>{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-[50%] flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl" style={{ border: "1px solid rgba(59,130,246,0.12)" }}>
              <img src={imgEdocResearch} alt="AI search results interface" className="w-full h-auto block" />
            </div>
          </div>

          {/* Stickies */}
          <div>
            <p style={{ fontFamily: "'Caveat', cursive", fontSize: 20, color: "rgba(255,255,255,0.35)", marginBottom: 20 }}>Key insights</p>
            <div className="flex flex-wrap gap-5">
              <Sticky rotate={-1.5}><strong>Search by meaning</strong><br />Users phrase queries as questions about content, not file labels.</Sticky>
              <Sticky color="#ffd4a8" rotate={2}><strong>Wrong result = two searches</strong><br />Speed without accuracy breaks trust and doubles the work.</Sticky>
              <Sticky color="#c8f5d4" rotate={-2}><strong>Scale amplifies the pain</strong><br />500+ files means the naming problem is felt daily.</Sticky>
              <Sticky color="#d4e8ff" rotate={1}><strong>AI answer, human verify</strong><br />Users want a summary   but they need to see the source.</Sticky>
            </div>
          </div>
        </div>
      </section>

      <StoryDivider label="The Solution" />

      {/* ── 06 SOLUTION ────────────────────────────── */}
      <section className="relative px-5 lg:px-20 py-16 overflow-hidden" style={{ zIndex: 2 }}>
        <div className="nebula w-[500px] h-[500px]" style={{ background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)", top: 0, left: "-10%", animationDuration: "22s" }} />
        <div ref={rSolution} className="reveal flex flex-col gap-10 max-w-5xl">
          <p className="font-extrabold text-white leading-[1.2]" style={{ fontSize: "clamp(22px,3vw,36px)" }}>
            Search that reads the document,<br />not the filename
          </p>
          <p className="text-sm leading-[1.9] max-w-2xl" style={{ color: "rgba(255,255,255,0.42)" }}>
            A search term feature that retrieves files by keyword and returns AI-generated, context-aware answers drawn from the documents themselves   with source files listed beneath, so the user can verify rather than trust blindly.
          </p>
          <div className="w-full rounded-2xl overflow-hidden shadow-2xl" style={{ border: "1px solid rgba(59,130,246,0.12)" }}>
            <img src={imgEdocSolution} alt="Search term feature   AI answer with source documents" className="w-full h-auto block" />
          </div>
          <div className="flex flex-wrap gap-4 mt-2">
            <DesignNote>Ask in plain language   the system answers from document content, not a filename string</DesignNote>
            <DesignNote>Answer first, sources beneath   the finding is always traceable to its evidence</DesignNote>
          </div>
          <div className="flex flex-col gap-4">
            {[
              { d: "Ask in plain language", r: "A user types the question they actually have. The system answers from document content instead of matching a string against a filename.", accent: "#60a5fa" },
              { d: "Answer first, sources beneath", r: "The result summarises what was found, then lists the matching files with tags, date and creator   so the finding is traceable back to its evidence.", accent: "#34d399" },
              { d: "Advanced search stays available", r: "Keyword and filter search remain for users who already know exactly what they're looking for. Neither mode forces the other out.", accent: "#a78bfa" },
            ].map((item, i) => (
              <div key={i} className="flex gap-5 p-6 rounded-2xl" style={{ background: "rgba(5,5,25,0.6)", border: `1px solid ${item.accent}14` }}>
                <span className="font-mono text-xs flex-shrink-0 pt-1" style={{ color: item.accent }}>0{i + 1}</span>
                <div className="flex flex-col gap-2">
                  <p className="font-bold text-white text-sm">{item.d}</p>
                  <p className="text-xs leading-[1.85]" style={{ color: "rgba(255,255,255,0.42)" }}>{item.r}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <StoryDivider label="Results" />

      {/* ── 07 RESULT ──────────────────────────────── */}
      <section className="relative px-5 lg:px-20 py-20 overflow-hidden" style={{ zIndex: 2 }}>
        <div className="nebula w-[600px] h-[600px]" style={{ background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(96,165,250,0.06) 50%, transparent 70%)", top: 0, left: "50%", transform: "translateX(-50%)", animationDuration: "20s" }} />
        <div ref={rResult} className="reveal relative z-10 flex flex-col gap-12 max-w-5xl mx-auto">
          <p className="font-extrabold text-white leading-[1.2]" style={{ fontSize: "clamp(24px,3vw,38px)" }}>
            What actually changed
          </p>
          <div className="flex flex-wrap gap-12">
            {[
              { val: "60%", label: "Reduction in average retrieval time", accent: "#60a5fa" },
              { val: "91%", label: "First-result accuracy in tested sessions", accent: "#34d399" },
              { val: "3x", label: "Search feature adoption within 2 weeks", accent: "#a78bfa" },
            ].map(s => (
              <div key={s.label} className="flex flex-col gap-2">
                <span className="font-black" style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(40px,5.5vw,60px)", color: s.accent, textShadow: `0 0 28px ${s.accent}60` }}>
                  {s.val}
                </span>
                <span className="text-xs leading-[1.6] max-w-[16ch]" style={{ color: "rgba(255,255,255,0.38)", fontFamily: "'JetBrains Mono', monospace" }}>{s.label}</span>
              </div>
            ))}
          </div>
          <p className="text-base leading-[1.9] max-w-2xl" style={{ color: "rgba(255,255,255,0.45)" }}>
            The search term feature shipped as part of the eDocSafe 2.0 update. Users who previously navigated by memory now ask plain-language questions and receive answers with source attribution   reducing the gap between having a question and finding evidence to answer it.
          </p>
        </div>
      </section>

      <StoryDivider label="Reflection" />

      {/* ── 08 REFLECTION ──────────────────────────── */}
      <section className="px-5 lg:px-20 py-16 max-w-5xl" style={{ zIndex: 2 }}>
        <div ref={rReflect} className="reveal flex flex-col gap-8">
          <p className="font-extrabold text-white leading-[1.2]" style={{ fontSize: "clamp(22px,3vw,34px)" }}>
            What I'd do differently
          </p>
          <div className="flex flex-col gap-4">
            {[
              { n: "01", text: "AI answers create a trust problem I didn't test for. I would run a verification study: do users read the sources beneath the summary, or do they accept the AI answer at face value? That answer would change how I weight the source attribution UI." },
              { n: "02", text: "The advanced search fallback was scoped late. Surfacing it earlier in the design process   rather than treating it as a safety net   would have let us make more deliberate decisions about when to nudge users toward semantic search vs letting them stay in keyword mode." },
            ].map(item => (
              <div key={item.n} className="flex gap-6 p-6 rounded-2xl" style={{ background: "rgba(5,5,25,0.55)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <span className="font-mono text-xs flex-shrink-0 pt-0.5" style={{ color: "#60a5fa" }}>{item.n}</span>
                <p className="text-sm leading-[1.9]" style={{ color: "rgba(255,255,255,0.45)" }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BACK ───────────────────────────────────── */}
      <section className="px-5 lg:px-20 py-24 flex justify-center" style={{ zIndex: 2 }}>
        <button onClick={onBack}
          className="group flex items-center gap-4 px-10 py-5 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105"
          style={{ background: "rgba(5,5,25,0.7)", border: "1px solid rgba(59,130,246,0.3)", color: "rgba(255,255,255,0.8)", backdropFilter: "blur(20px)" }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="transition-transform duration-300 group-hover:-translate-x-1">
            <path d="M13 15L8 10l5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to portfolio
        </button>
      </section>

      <footer className="px-5 lg:px-20 py-8 flex items-center justify-center" style={{ zIndex: 2, borderTop: "1px solid rgba(59,130,246,0.08)" }}>
        <p className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>© 2025 Ananya Bhuyan</p>
      </footer>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<"home" | "case-01" | "case-02">("home");
  const goHome = () => { setPage("home"); window.scrollTo({ top: 0 }); };

  if (page === "case-01") return <CaseStudy01 onBack={goHome} />;
  if (page === "case-02") return <CaseStudy02 onBack={goHome} />;

  return <HomePage onCaseStudy01={() => setPage("case-01")} onCaseStudy02={() => setPage("case-02")} />;
}

function HomePage({ onCaseStudy01, onCaseStudy02 }: { onCaseStudy01: () => void; onCaseStudy02: () => void }) {
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  const aboutPhotoRef    = useReveal(0);
  const aboutBadgeRef    = useReveal(80);
  const aboutHeadRef     = useReveal(160);
  const aboutBodyRef     = useReveal(220);
  const workBadgeRef     = useReveal(0);
  const workHeadRef      = useReveal(80);
  const workSubRef       = useReveal(120);
  const svcBadgeRef      = useReveal(0);
  const svcHeadRef       = useReveal(80);
  const procBadgeRef     = useReveal(0);
  const procHeadRef      = useReveal(80);
  const testHeadRef      = useReveal(0);
  const testSubRef       = useReveal(80);
  const ctaBadgeRef      = useReveal(0);
  const ctaHeadRef       = useReveal(100);
  const ctaEmailRef      = useReveal(200);
  const ctaSocialsRef    = useReveal(280);

  const years    = useCounter(3,  statsVisible);
  const projects_n = useCounter(14, statsVisible);
  const clients  = useCounter(20, statsVisible);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStatsVisible(true); obs.unobserve(el); } }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="bg-[#00000d] min-h-screen w-full overflow-x-hidden relative cosmic-grid-bg">
      <StarField />
      <ShootingStars />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-5 lg:px-20 overflow-hidden" style={{ zIndex: 2 }}>
        {/* Nebula blobs */}
        <div className="nebula w-[600px] h-[600px]" style={{ background: "radial-gradient(circle, rgba(123,97,255,0.35) 0%, transparent 70%)", top: "-10%", left: "-5%", animationDuration: "14s" }} />
        <div className="nebula w-[500px] h-[500px]" style={{ background: "radial-gradient(circle, rgba(0,212,255,0.2) 0%, transparent 70%)", top: "20%", right: "-8%", animationDuration: "18s", animationDelay: "-6s" }} />
        <div className="nebula w-[400px] h-[400px]" style={{ background: "radial-gradient(circle, rgba(205,255,80,0.12) 0%, transparent 70%)", bottom: "5%", left: "40%", animationDuration: "22s", animationDelay: "-10s" }} />

        <img src={imgGlowOrb}  alt="" className="absolute w-[500px] pointer-events-none opacity-50" style={{ top: "5%",  left: "-5%"  }} />
        <img src={imgGlowOrb1} alt="" className="absolute w-[480px] pointer-events-none opacity-40" style={{ top: "30%", right: "-8%" }} />

        {/* Hero content */}
        <div className="relative z-10 flex flex-col items-center gap-5 text-center">
          <p className="font-mono text-xs tracking-[0.35em] uppercase animate-fade-in"
            style={{ color: "#cdff50", animationDelay: "0.1s" }}>
            Designing Experiences That Move
          </p>

          <h1 className="font-black"
            style={{
              fontSize: "clamp(52px, 8vw, 84px)",
              fontFamily: "'Orbitron', sans-serif",
              background: "linear-gradient(135deg, #ffffff 0%, #cdff50 25%, #00d4ff 55%, #7b61ff 80%, #ff61d8 100%)",
              backgroundSize: "300% 300%",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "gradientShift 5s 0.2s ease infinite, fadeIn 1s 0.2s ease both",
              filter: "drop-shadow(0 0 36px rgba(123,97,255,0.55))",
              letterSpacing: "-1px",
              lineHeight: 1.05,
            }}>
            Ananya Bhuyan
          </h1>

          {/* Available badge with orbit ring */}
          <div className="relative flex items-center justify-center animate-fade-in" style={{ animationDelay: "0.9s" }}>
            <svg className="orbit-ring absolute w-[140px] h-[140px] opacity-40" viewBox="0 0 140 140" fill="none">
              <circle cx="70" cy="70" r="64" stroke="#cdff50" strokeWidth="1" strokeDasharray="10 8" />
              <circle cx="70" cy="6" r="3" fill="#cdff50" />
            </svg>
            <svg className="orbit-ring-reverse absolute w-[116px] h-[116px] opacity-20" viewBox="0 0 116 116" fill="none">
              <circle cx="58" cy="58" r="52" stroke="#7b61ff" strokeWidth="1" strokeDasharray="5 10" />
            </svg>
            <div className="flex items-center gap-3 px-5 py-3 rounded-full border"
              style={{ borderColor: "rgba(205,255,80,0.4)", background: "rgba(205,255,80,0.06)", backdropFilter: "blur(12px)" }}>
              <span className="relative flex w-2 h-2">
                <span className="ping absolute inline-flex w-full h-full rounded-full" style={{ background: "#cdff50" }} />
                <span className="relative inline-flex w-2 h-2 rounded-full" style={{ background: "#cdff50" }} />
              </span>
              <span className="font-mono text-xs tracking-widest uppercase" style={{ color: "#cdff50" }}>Available For Work</span>
            </div>
          </div>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-8 left-0 right-0 flex items-end justify-between px-5 lg:px-20 animate-fade-in" style={{ zIndex: 10, animationDelay: "1.6s" }}>
          <div className="flex gap-10">
            {[["Based In", "Bengaluru, India"], ["Speciality", "UI/UX Design"]].map(([label, val]) => (
              <div key={label} className="flex flex-col gap-1">
                <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>{label}</span>
                <span className="font-bold text-sm text-white">{val}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2" style={{ color: "rgba(255,255,255,0.5)" }}>
            <span className="font-mono text-xs tracking-wider">Scroll to explore</span>
            <img src={imgGlowOrb} alt="" className="w-4 h-4 opacity-40 cosmic-float" style={{ animationDuration: "2s" }} />
          </div>
        </div>
      </section>

      {/* ── TOOLS TICKER ──────────────────────────────────────────── */}
      <div className="relative overflow-hidden h-14 flex items-center" style={{ zIndex: 2, borderTop: "1px solid rgba(123,97,255,0.15)", borderBottom: "1px solid rgba(123,97,255,0.15)", background: "rgba(5,5,25,0.6)", backdropFilter: "blur(12px)" }}>
        <div className="ticker-track flex items-center gap-4 px-6">
          {[...tools, ...tools].map((name, i) => (
            <div key={`tool-${i}`} className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{ border: "1px solid rgba(123,97,255,0.2)", background: "rgba(123,97,255,0.06)" }}>
              <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center"><ToolIcon name={name} /></div>
              <span className="font-mono text-xs text-white/70 whitespace-nowrap">{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── ABOUT ─────────────────────────────────────────────────── */}
      <section id="about" className="relative px-5 lg:px-20 py-28 flex flex-col lg:flex-row gap-16 items-center overflow-hidden" style={{ zIndex: 2 }}>
        <div className="nebula w-[500px] h-[500px]" style={{ background: "radial-gradient(circle, rgba(0,212,255,0.18) 0%, transparent 70%)", top: "10%", left: "-10%", animationDuration: "20s" }} />

        <div ref={aboutPhotoRef} className="reveal relative w-full lg:w-[420px] xl:w-[500px] flex-shrink-0 rounded-[32px] overflow-hidden aspect-[4/5]">
          <img src={imgAboutPhoto} alt="Ananya Bhuyan" className="w-full h-full object-cover" />
          {/* Cosmic overlay */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(123,97,255,0.15) 0%, transparent 60%, rgba(0,212,255,0.08) 100%)" }} />
          {/* Orbital decoration */}
          <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full border orbit-ring-slow opacity-20"
            style={{ borderColor: "#cdff50", borderStyle: "dashed" }} />
        </div>

        <div className="flex flex-col gap-10 flex-1">
          <div className="flex flex-col gap-5">
            <div ref={aboutBadgeRef} className="reveal"><SectionBadge text="About Me" color="#7b61ff" /></div>
            <h2 ref={aboutHeadRef} className="reveal text-[clamp(32px,4vw,48px)] font-extrabold text-white leading-[1.15]">
              I craft digital experiences<br />that people <span className="cosmic-text">remember.</span>
            </h2>
            <div ref={aboutBodyRef} className="reveal text-lg leading-[1.7]" style={{ color: "rgba(255,255,255,0.5)" }}>
              <p>I'm a Product Designer by day and a curious problem-solver by nature.</p>
              <p className="mt-2">I've spent the last 3+ years designing intuitive, meaningful experiences for startups like Skylark Drones and iBind System Pvt. Ltd.</p>
            </div>
          </div>

          <div ref={statsRef} className="flex gap-10 stagger">
            {[
              { val: years, s: "+", label: "Years Exp",           color: "#cdff50" },
              { val: projects_n, s: "+", label: "Projects Done",  color: "#ff6b6b" },
              { val: clients, s: "+", label: "Happy Clients",     color: "#7b61ff" },
            ].map(st => (
              <div key={st.label} className="flex flex-col gap-1">
                <span className="font-black text-5xl" style={{ fontFamily: "'Orbitron',sans-serif", color: st.color, textShadow: `0 0 20px ${st.color}60` }}>
                  {st.val}{st.s}
                </span>
                <span className="font-mono text-xs tracking-wider uppercase" style={{ color: "rgba(255,255,255,0.45)" }}>{st.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SELECTED WORK ─────────────────────────────────────────── */}
      <section id="work" className="relative px-5 lg:px-20 py-20 flex flex-col gap-12" style={{ zIndex: 2 }}>
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
          <div className="flex flex-col gap-4">
            <div ref={workBadgeRef} className="reveal"><SectionBadge text="Selected Work" color="#cdff50" /></div>
            <h2 ref={workHeadRef} className="reveal text-[clamp(32px,4vw,48px)] font-extrabold text-white">Case Studies / UI UX</h2>
          </div>
          <p ref={workSubRef} className="reveal text-sm lg:w-72 lg:text-right" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'JetBrains Mono',monospace" }}>
            Small implementations that bring big wins :)
          </p>
        </div>
        <div className="flex flex-col gap-8">
          {projects.map((p, i) => (
            <ProjectCard
              key={p.num}
              p={p}
              index={i}
              onOpen={p.num === "01" ? onCaseStudy01 : p.num === "02" ? onCaseStudy02 : undefined}
            />
          ))}
        </div>
      </section>

      {/* ── SERVICES ──────────────────────────────────────────────── */}
      <section id="services" className="relative px-5 lg:px-20 py-20 flex flex-col gap-12 overflow-hidden" style={{ zIndex: 2 }}>
        <div className="nebula w-[600px] h-[600px]" style={{ background: "radial-gradient(circle, rgba(205,255,80,0.1) 0%, transparent 70%)", top: "0", right: "-10%", animationDuration: "16s", animationDelay: "-4s" }} />
        <div className="flex flex-col gap-4 relative z-10">
          <div ref={svcBadgeRef} className="reveal"><SectionBadge text="My Services" color="#ff6b6b" /></div>
          <h2 ref={svcHeadRef} className="reveal text-[clamp(32px,4vw,48px)] font-extrabold text-white">Tailored Creative Solutions</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 relative z-10">
          {services.map((s, i) => <ServiceCard key={s.title} s={s} index={i} />)}
        </div>
      </section>

      {/* ── PROCESS ───────────────────────────────────────────────── */}
      <section className="px-5 lg:px-20 py-20 flex flex-col gap-16 relative" style={{ zIndex: 2 }}>
        <div className="flex flex-col gap-4">
          <div ref={procBadgeRef} className="reveal"><SectionBadge text="The Method" color="#cdff50" /></div>
          <h2 ref={procHeadRef} className="reveal text-[clamp(32px,4vw,48px)] font-extrabold text-white">How We Make It Happen</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {processSteps.map((step, i) => <ProcessStep key={step.num} step={step} index={i} />)}
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────── */}
      <section className="relative py-20 flex flex-col gap-12 items-center overflow-hidden" style={{ zIndex: 2 }}>
        <div className="nebula w-[700px] h-[700px]" style={{ background: "radial-gradient(circle, rgba(123,97,255,0.2) 0%, transparent 65%)", top: "-15%", left: "50%", transform: "translateX(-50%)", animationDuration: "25s" }} />
        <img src={imgGlowOrb3} alt="" className="absolute w-[600px] pointer-events-none opacity-30" style={{ top: "-10%", left: "50%", transform: "translateX(-50%)" }} />

        <div className="flex flex-col gap-3 items-center text-center relative z-10 px-5">
          <h2 ref={testHeadRef} className="reveal font-black text-[clamp(32px,4vw,42px)] text-white" style={{ fontFamily: "'Orbitron',sans-serif" }}>Kind Words</h2>
          <p ref={testSubRef} className="reveal text-base max-w-md" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'JetBrains Mono',monospace", fontSize: "13px" }}>
            What clients and collaborators say
          </p>
        </div>

        <div className="w-full overflow-hidden relative z-10">
          <div className="testimonial-track flex gap-6 px-6">
            {[...testimonials, ...testimonials].map((t, i) => (
              <div key={`testimonial-${i}`} className="flex-shrink-0 w-[min(88vw,560px)] flex flex-col gap-6 p-8 rounded-3xl"
                style={{ background: "rgba(5,5,25,0.75)", border: "1px solid rgba(123,97,255,0.18)", backdropFilter: "blur(20px)" }}>
                <span className="font-black text-[56px] leading-none" style={{ color: "#cdff50", fontFamily: "'Orbitron',sans-serif" }}>"</span>
                <p className="text-sm leading-[1.8] text-center flex-1" style={{ color: "rgba(255,255,255,0.7)" }}>{t.quote}</p>
                <div className="flex flex-col items-center gap-1 text-center pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                  <p className="font-bold text-sm text-white">{t.name}</p>
                  <p className="font-mono text-xs" style={{ color: "#7b61ff" }}>{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ───────────────────────────────────────────────── */}
      <section id="contact" className="relative px-5 lg:px-20 py-32 flex flex-col gap-14 items-center overflow-hidden" style={{ zIndex: 2 }}>
        <div className="nebula w-[700px] h-[700px]" style={{ background: "radial-gradient(circle, rgba(205,255,80,0.12) 0%, rgba(123,97,255,0.12) 50%, transparent 70%)", top: "0", left: "50%", transform: "translateX(-50%)", animationDuration: "20s" }} />
        <img src={imgGlowOrb4} alt="" className="absolute w-[500px] pointer-events-none opacity-40" style={{ top: "10%", left: "50%", transform: "translateX(-50%)" }} />

        <div className="flex flex-col gap-6 items-center text-center relative z-10">
          <div ref={ctaBadgeRef} className="reveal"><SectionBadge text="Start a Conversation" color="#cdff50" /></div>
          <h2 ref={ctaHeadRef} className="reveal font-black text-center leading-[1.05]"
            style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(36px,6vw,72px)", background: "linear-gradient(135deg,#fff 0%,#cdff50 30%,#7b61ff 60%,#00d4ff 100%)", backgroundSize: "200%", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", animation: "gradientShift 5s ease infinite" }}>
            {"LET'S CREATE"}<br />
            <span style={{ color: "#7b61ff", WebkitTextFillColor: "#7b61ff" }}>SOMETHING</span>{" AMAZING"}
          </h2>
        </div>

        <div ref={ctaEmailRef} className="reveal flex flex-col gap-3 items-center text-center relative z-10">
          <a href="mailto:designerananya97@gmail.com"
            className="font-extrabold text-2xl underline underline-offset-4 transition-all duration-300 hover:opacity-70 pulse-glow rounded-xl px-2"
            style={{ color: "#cdff50" }}>
            designerananya97@gmail.com
          </a>
          <p className="font-mono text-xs tracking-wider" style={{ color: "rgba(255,255,255,0.35)" }}>Typically replies within 24 hours</p>
        </div>

        <div ref={ctaSocialsRef} className="reveal flex flex-wrap gap-4 justify-center relative z-10">
          {[
            { name: "Dribbble", url: "https://dribbble.com/designerananya_lona" },
            { name: "LinkedIn", url: "https://www.linkedin.com/in/ananya4/" },
            { name: "Behance",  url: "https://www.behance.net/ananyabhuyan1" },
            { name: "Read.cv",  url: "/assets/Ananya_Bhuyan.pdf" },
          ].map(s => (
            <a key={s.name} href={s.url} target={s.url !== "#" ? "_blank" : undefined} rel="noopener noreferrer"
              className="px-6 py-3 rounded-full font-mono text-sm transition-all duration-300 hover:scale-105"
              style={{ border: "1px solid rgba(123,97,255,0.3)", background: "rgba(123,97,255,0.08)", color: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(205,255,80,0.5)"; (e.currentTarget as HTMLAnchorElement).style.color = "#cdff50"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(123,97,255,0.3)"; (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.8)"; }}>
              {s.name}
            </a>
          ))}
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <footer className="px-5 lg:px-20 py-10 flex items-center justify-between relative" style={{ zIndex: 2, borderTop: "1px solid rgba(123,97,255,0.15)" }}>
        <p className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>© 2025 Ananya Bhuyan. All rights reserved.</p>
        <button onClick={scrollToTop}
          className="flex items-center gap-2 transition-all duration-300 hover:opacity-60 group"
          style={{ color: "rgba(255,255,255,0.5)" }}>
          <span className="font-mono text-xs tracking-wider">BACK TO TOP</span>
          <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:border-[#cdff50] transition-colors"
            style={{ border: "1px solid rgba(255,255,255,0.15)", background: "rgba(5,5,25,0.8)" }}>
            <img src={imgArrowUp} alt="" className="w-3.5 h-3.5" />
          </div>
        </button>
      </footer>
    </div>
  );
}
