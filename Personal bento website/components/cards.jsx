/* global React */
const { useState, useEffect, useRef } = React;

/* ============ HERO ============ */
function HeroCard() {
  return (
    <div className="card dark col-2 row-2 hero">
      <div className="hero-top">
        <div>
          <div className="eyebrow">— Hello, I&rsquo;m</div>
          <h1>Thomas <em>Skjerdal</em></h1>
          <p className="hero-sub">
            Developer from a small town in Norway. Currently chasing a
            <strong> Master&rsquo;s in AI</strong> at NTNU while shipping production
            code at Omega 365. I get most of my ideas at hours I should be asleep.
          </p>
        </div>
        <div className="hero-photo" style={{backgroundImage: "url(assets/profil.jpg)"}}></div>
      </div>
      <div className="hero-bottom">
        <div className="hero-tags">
          <span className="tag">Vue · TypeScript · Python</span>
          <span className="tag">AI / ML</span>
          <span className="tag">Full-stack</span>
        </div>
        <div className="hero-now">
          <span className="hero-now-dot"></span>
          <span>Building &amp; learning · Bergen</span>
        </div>
      </div>
    </div>
  );
}

/* ============ STATS / EMBER FEATURE CARD ============ */
function StatsCard() {
  return (
    <div className="card ember col-1 row-1 stats-card">
      <div className="stats-tag">Now</div>
      <div>
        <div className="stats-num">M.Sc.</div>
        <div className="stats-label" style={{color: "rgba(255,255,255,0.85)"}}>
          AI specialization<br/>NTNU · 2025–27
        </div>
      </div>
    </div>
  );
}

/* ============ TIMELINE: Work ============ */
function WorkCard() {
  const items = [
    { org: "Omega 365 Solutions", role: "Developer (Part-time)", period: "Sep 2024 — Now", logo: "assets/omega365.png" },
    { org: "Omega 365 Solutions", role: "Summer Intern", period: "Jun — Aug 2024", logo: "assets/omega365.png" },
    { org: "Norway's Best", role: "IT Technician (Apprentice)", period: "2019 — 2023", logo: "assets/norways-best.jpg" },
    { org: "Skjerdal Landskapspleie", role: "Seasonal Gardener", period: "Summers 2016 — 18", logo: null },
  ];
  return (
    <div className="card cream col-2 row-2 timeline">
      <div className="timeline-head">
        <h3>Work</h3>
        <span className="eyebrow">{items.length} roles</span>
      </div>
      <div className="timeline-list">
        {items.map((it, i) => (
          <div className="tl-row" key={i}>
            <div className="tl-logo">
              {it.logo
                ? <img src={it.logo} alt="" />
                : <span style={{fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)"}}>SL</span>}
            </div>
            <div className="tl-body">
              <div className="tl-title">{it.role}</div>
              <div className="tl-meta">
                <span className="org">{it.org}</span>
                <span>· {it.period}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============ TIMELINE: Education ============ */
function EducationCard() {
  const items = [
    { org: "NTNU — Trondheim", role: "M.Sc. Computer Science · AI", period: "2025 — 2027 (expected)", logo: "assets/ntnu.png" },
    { org: "HVL — Bergen", role: "B.Eng. Computer Engineering", period: "2022 — 2025", logo: "assets/hvl.png" },
    { org: "Sogndal VGS", role: "Computer Electronics + Apprenticeship", period: "2016 — 2021", logo: null },
  ];
  return (
    <div className="card dark col-2 row-2 timeline">
      <div className="timeline-head">
        <h3>Education</h3>
        <span className="eyebrow">9 yrs of school</span>
      </div>
      <div className="timeline-list">
        {items.map((it, i) => (
          <div className="tl-row" key={i}>
            <div className="tl-logo">
              {it.logo
                ? <img src={it.logo} alt="" />
                : <span style={{fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-3)"}}>VGS</span>}
            </div>
            <div className="tl-body">
              <div className="tl-title">{it.role}</div>
              <div className="tl-meta">
                <span className="org">{it.org}</span>
                <span>· {it.period}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============ ACTIVITIES (compact) ============ */
function ActivitiesCard() {
  const items = [
    { role: "TA · DAT108 Programming", org: "HVL", logo: "assets/hvl.png" },
    { role: "TA · DAT107 Databases", org: "HVL", logo: "assets/hvl.png" },
    { role: "Web Developer", org: "Studvest", logo: "assets/studvest.jpg" },
  ];
  return (
    <div className="card dark col-2 row-2 activities">
      <h3>Side<br/>quests</h3>
      <div className="activities-list">
        {items.map((it, i) => (
          <div className="activity-row" key={i}>
            <div className="tl-logo"><img src={it.logo} alt="" /></div>
            <div>
              <div className="role">{it.role}</div>
              <div className="org">{it.org}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============ CONTACT / RESUME ============ */
function ContactCard() {
  const [copied, setCopied] = useState(false);
  const copyEmail = (e) => {
    e.preventDefault();
    navigator.clipboard?.writeText("thomas@skjerdal.me");
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div className="card ember col-4 row-1 contact-card">
      <div className="orbits"><div></div><div></div><div></div><div className="spark"></div></div>
      <div style={{position: "relative", zIndex: 2}}>
        <div className="eyebrow">Get in touch</div>
        <div className="contact-title">Let&rsquo;s build something.</div>
      </div>
      <div className="contact-actions" style={{position: "relative", zIndex: 2, flexDirection: "row", flexWrap: "wrap"}}>
        <a className="contact-btn" href="mailto:thomas@skjerdal.me" onClick={copyEmail}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          {copied ? "Copied!" : "thomas@skjerdal.me"}
        </a>
        <a className="contact-btn" href="https://github.com/skjerdal" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
          GitHub
        </a>
        <a className="contact-btn" href="https://linkedin.com/in/thomas-skjerdal-8ba458283" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
          LinkedIn
        </a>
        <a className="contact-btn primary" href="resume.pdf" download>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Resume
        </a>
      </div>
    </div>
  );
}

/* ============ STACK ============ */
function StackCard() {
  const stacks = ["Vue", "TypeScript", "React", "Python", "PyTorch", "SQL", "Java", "Three.js", "Node", "C#"];
  return (
    <div className="card dark col-1 row-1 stack-card">
      <div>
        <div className="eyebrow">Tools of the trade</div>
        <h3>Stack</h3>
      </div>
      <div className="stack-grid">
        {stacks.map(s => <span className="stack-pill" key={s}>{s}</span>)}
      </div>
    </div>
  );
}

window.HeroCard = HeroCard;
window.StatsCard = StatsCard;
window.WorkCard = WorkCard;
window.EducationCard = EducationCard;
window.ActivitiesCard = ActivitiesCard;
window.ContactCard = ContactCard;
window.StackCard = StackCard;
