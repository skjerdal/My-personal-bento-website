/* global React */
const { useState: useStateP } = React;

const PROJECTS = [
  {
    name: "Quizzy",
    stack: "Web · Vue",
    desc: "A quiz app with realtime multiplayer and a custom question editor.",
    color: "linear-gradient(135deg, #ff8a3d, #ff6a2a)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
    ),
  },
  {
    name: "TinyTransformer",
    stack: "ML · PyTorch",
    desc: "A transformer language model built from scratch — attention, embeddings, training loop, all by hand.",
    color: "linear-gradient(135deg, #ffcb6b, #ff8a3d)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4"/><path d="M12 18v4"/><path d="m4.93 4.93 2.83 2.83"/><path d="m16.24 16.24 2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="m4.93 19.07 2.83-2.83"/><path d="m16.24 7.76 2.83-2.83"/><circle cx="12" cy="12" r="3"/></svg>
    ),
  },
  {
    name: "CS:GO Skin Tracker",
    stack: "Data · Python",
    desc: "Tool for tracking Counter-Strike skin price trends across markets, with alerts and history.",
    color: "linear-gradient(135deg, #ff7a6a, #ff6a2a)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m14.5 17.5 3-3"/><path d="M2 21l3-3 9.5-9.5L19 13l-9.5 9.5L6 26l-4-4 4-1z"/><path d="M14.5 4.5 19 9"/></svg>
    ),
  },
];

function ProjectsCard() {
  const [active, setActive] = useStateP(null);
  return (
    <div className="card dark col-2 row-2 projects">
      <div className="projects-header">
        <h3>Projects</h3>
        <span className="eyebrow">{PROJECTS.length} side things</span>
      </div>
      <div className="projects-list">
        {PROJECTS.map((p, i) => (
          <div
            className="project-row"
            key={i}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
          >
            <div className="project-icon" style={{background: p.color}}>{p.icon}</div>
            <div className="project-info">
              <div className="project-name">
                {p.name}
                <span className="stack">{p.stack}</span>
              </div>
              <div className="project-desc">{p.desc}</div>
            </div>
            <div className="project-arrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

window.ProjectsCard = ProjectsCard;
