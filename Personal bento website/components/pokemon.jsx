/* global React */
const { useState: useStP, useEffect: useEfP, useRef: useRfP } = React;

/* Pokemon card overlay (fullscreen). The pack opens, then fires window 'open-pokemon' event. */

function PokemonOverlay({ onClose }) {
  const ref = useRfP(null);
  const onMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.transform = `rotateY(${x * 18}deg) rotateX(${-y * 18}deg) scale(1.02)`;
  };
  const onLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = "";
  };

  useEfP(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="poke-overlay" onClick={onClose}>
      <button className="poke-close" onClick={onClose}>×</button>
      <div
        className="poke-overlay-card"
        ref={ref}
        onClick={(e) => e.stopPropagation()}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <div className="poke-overlay-inner">
          <div className="poke-overlay-name">
            <h3>Thomas</h3>
            <span className="hp">HP 340</span>
          </div>
          <div className="poke-overlay-img">
            <img src="assets/profil.jpg" alt="Thomas" />
          </div>
          <div className="poke-overlay-stats">
            <div>Type · <span>Developer</span></div>
            <div>Lvl · <span>23</span></div>
            <div>Move · <span>Quick Fix</span></div>
            <div>Move · <span>Full Deploy</span></div>
          </div>
          <div style={{fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--ink-3)", textAlign: "center"}}>
            001/001 · ★ · Illus. T. Skjerdal
          </div>
        </div>
      </div>
    </div>
  );
}

/* The slot in the bento. Three states:
   - "pack"     : 3D booster pack visible
   - "card"     : revealed pokemon card mini sitting in slot
   - "expanded" : full overlay open
*/
function BoosterSlot() {
  const [state, setState] = useStP("pack");
  const [opening, setOpening] = useStP(false);

  useEfP(() => {
    // initialize the booster three.js scene by dispatching event
    window.dispatchEvent(new CustomEvent("init-booster"));
    const onOpened = () => {
      setOpening(true);
      setTimeout(() => { setState("card"); setOpening(false); }, 700);
    };
    window.addEventListener("booster-opened", onOpened);
    return () => window.removeEventListener("booster-opened", onOpened);
  }, []);

  if (state === "pack" || opening) {
    return (
      <div className="card col-1 row-2 booster-card" id="booster-card-host">
        <div className="booster-canvas-wrap" id="booster-canvas-mount"></div>
        <div className="booster-loading" id="booster-loading">Loading…</div>
        <div className="booster-hint" id="booster-hint" style={{display: "none"}}>
          <span className="star">✦</span>
          click to open
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card dark col-1 row-2 poke-slot" onClick={() => setState("expanded")}>
        <div className="poke-card-mini">
          <div className="poke-glare"></div>
          <div className="poke-card-mini-inner">
            <div className="poke-name-row">
              <span className="poke-name">THOMAS</span>
              <span className="poke-hp">HP 340</span>
            </div>
            <div className="poke-img-wrap">
              <img src="assets/profil.jpg" alt="Thomas" />
            </div>
            <div className="poke-foot">001 / 001 · ★</div>
          </div>
        </div>
        <div className="poke-expand-btn">click to expand</div>
      </div>
      {state === "expanded" && <PokemonOverlay onClose={() => setState("card")} />}
    </>
  );
}

window.BoosterSlot = BoosterSlot;
