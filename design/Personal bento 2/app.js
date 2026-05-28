/* ============================================================
   App script — interactivity for the bento.
   - Leaflet map with numbered pins + dashed route
   - Projects: click-to-expand
   - Tweaks panel: accent color
   ============================================================ */

/* ---------- LEAFLET MAP ---------- */
(function initMap() {
  if (typeof L === 'undefined') return;
  const el = document.getElementById('map');
  if (!el) return;

  const map = L.map(el, {
    zoomControl: false,
    scrollWheelZoom: false,
    attributionControl: false,
    dragging: true,
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(map);

  const LOCATIONS = [
    { num: 1, name: 'Aurland',   label: 'Hometown',     coords: [60.9076, 7.1836] },
    { num: 2, name: 'Bergen',    label: 'B.Eng · HVL',  coords: [60.3913, 5.3221] },
    { num: 3, name: 'Trondheim', label: 'M.Sc · NTNU',  coords: [63.4305, 10.3951], active: true },
  ];

  // dashed route line connecting cities in order
  L.polyline(LOCATIONS.map(l => l.coords), {
    color: '#e8590c',
    weight: 2,
    opacity: 0.85,
    dashArray: '4 6',
    lineJoin: 'round',
    lineCap: 'round',
  }).addTo(map);

  LOCATIONS.forEach(loc => {
    const icon = L.divIcon({
      html: `<div class="map-pin ${loc.active ? 'active' : ''}">${loc.num}</div>`,
      className: '',
      iconSize: [26, 26],
      iconAnchor: [13, 13],
      popupAnchor: [0, -13],
    });

    const popup = `
      <div class="pop-title">${loc.name}</div>
      <div class="pop-sub">${loc.label}</div>
      <a class="pop-link" href="https://maps.google.com/?q=${encodeURIComponent(loc.name + ',Norway')}" target="_blank" rel="noopener">Open in Maps ↗</a>
    `;

    L.marker(loc.coords, { icon })
      .addTo(map)
      .bindPopup(popup, { closeButton: false, maxWidth: 200 });
  });

  const bounds = L.latLngBounds(LOCATIONS.map(l => l.coords));
  map.fitBounds(bounds, { padding: [50, 50] });
  setTimeout(() => map.invalidateSize(), 250);
  window.addEventListener('resize', () => map.invalidateSize());
})();


/* ---------- PROJECTS EXPAND ---------- */
(function initProjects() {
  const list = document.getElementById('projList');
  if (!list) return;

  list.addEventListener('click', e => {
    const proj = e.target.closest('.proj');
    if (!proj) return;
    // don't toggle if user clicked a link/button inside the expansion
    if (e.target.closest('a, button')) return;
    const wasOpen = proj.classList.contains('open');
    list.querySelectorAll('.proj.open').forEach(p => p.classList.remove('open'));
    if (!wasOpen) proj.classList.add('open');
  });
})();


/* ---------- NOW: progress to degree (auto-calc) ---------- */
(function initNow() {
  const start = new Date('2025-08-01');
  const end   = new Date('2027-06-30');
  const now   = new Date();
  const total = end - start;
  const pct = Math.max(0, Math.min(100, Math.round(((now - start) / total) * 100)));
  const fill = document.getElementById('nowFill');
  const pctEl = document.getElementById('nowPct');
  if (fill)  fill.style.width = pct + '%';
  if (pctEl) pctEl.textContent = pct + '%';
})();


/* ---------- EMAIL COPY ---------- */
(function initEmail() {
  const btn = document.getElementById('emailBtn');
  const label = document.getElementById('emailLabel');
  if (!btn || !label) return;
  const email = 'thomas@skjerdal.me';
  btn.addEventListener('click', e => {
    if (!navigator.clipboard) return;
    e.preventDefault();
    navigator.clipboard.writeText(email).then(() => {
      const orig = label.textContent;
      label.textContent = 'Copied!';
      setTimeout(() => { label.textContent = orig; }, 1600);
    });
  });
})();


/* ---------- TWEAKS PANEL ---------- */
/* Lives in this file (no React) — implements the host edit-mode protocol. */
(function initTweaks() {
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "accent": "#e8590c"
  }/*EDITMODE-END*/;

  // load any persisted state from localStorage (in case host isn't editing)
  let state;
  try { state = JSON.parse(localStorage.getItem('tweaks') || 'null') || {...TWEAK_DEFAULTS}; }
  catch { state = {...TWEAK_DEFAULTS}; }

  applyTweaks(state);

  // ------ panel UI (created on demand) ------
  let panel = null;
  function createPanel() {
    panel = document.createElement('div');
    panel.id = 'tweaks-panel';
    panel.innerHTML = `
      <style>
        #tweaks-panel {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 260px;
          background: #faf5e8;
          border: 1px solid rgba(26,20,16,0.12);
          border-radius: 16px;
          padding: 14px 16px 16px;
          font-family: var(--f-sans);
          color: var(--ink);
          box-shadow: 0 10px 30px -10px rgba(26,20,16,0.3), 0 30px 80px -30px rgba(26,20,16,0.4);
          z-index: 9999;
          animation: rise 0.3s ease both;
        }
        #tweaks-panel .head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        #tweaks-panel h3 { margin: 0; font-family: var(--f-display); font-style: italic; font-size: 20px; font-weight: 400; }
        #tweaks-panel button.close {
          width: 24px; height: 24px; border-radius: 50%;
          background: rgba(26,20,16,0.06); border: 0; cursor: pointer;
          color: var(--ink-soft); font-size: 16px; line-height: 1;
        }
        #tweaks-panel .row { display: flex; flex-direction: column; gap: 6px; margin-top: 8px; }
        #tweaks-panel label.lbl {
          font-family: var(--f-mono); font-size: 9.5px; letter-spacing: 0.14em;
          text-transform: uppercase; color: var(--ink-faint);
        }
        #tweaks-panel .swatches { display: flex; gap: 8px; }
        #tweaks-panel .sw {
          width: 30px; height: 30px; border-radius: 50%; cursor: pointer;
          border: 2px solid transparent;
          transition: transform 0.2s, border-color 0.2s;
          box-shadow: 0 0 0 1px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.3);
        }
        #tweaks-panel .sw:hover { transform: scale(1.1); }
        #tweaks-panel .sw.active { border-color: var(--ink); transform: scale(1.1); }
        #tweaks-panel .note {
          margin: 12px 0 0;
          font-size: 11px;
          color: var(--ink-faint);
          line-height: 1.4;
        }
      </style>
      <div class="head">
        <h3>Tweaks</h3>
        <button class="close" aria-label="Close">×</button>
      </div>
      <div class="row">
        <label class="lbl">Accent color</label>
        <div class="swatches">
          <span class="sw" data-c="#e8590c" style="background:#e8590c"></span>
          <span class="sw" data-c="#c2410c" style="background:#c2410c"></span>
          <span class="sw" data-c="#2e5cf2" style="background:#2e5cf2"></span>
          <span class="sw" data-c="#15a352" style="background:#15a352"></span>
          <span class="sw" data-c="#a855f7" style="background:#a855f7"></span>
          <span class="sw" data-c="#1a1410" style="background:#1a1410"></span>
        </div>
      </div>
      <p class="note">Pick the warm-light that runs through the site.</p>
    `;
    document.body.appendChild(panel);

    panel.querySelector('.close').addEventListener('click', deactivate);
    panel.querySelectorAll('.sw').forEach(sw => {
      sw.addEventListener('click', () => {
        const c = sw.dataset.c;
        state.accent = c;
        applyTweaks(state);
        markActive();
        persist();
      });
    });
    markActive();
  }
  function markActive() {
    if (!panel) return;
    panel.querySelectorAll('.sw').forEach(sw => {
      sw.classList.toggle('active', sw.dataset.c === state.accent);
    });
  }
  function activate() {
    if (!panel) createPanel();
    panel.style.display = '';
  }
  function deactivate() {
    if (panel) panel.style.display = 'none';
    try { window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*'); } catch {}
  }

  // Listen first, then announce
  window.addEventListener('message', e => {
    if (!e.data) return;
    if (e.data.type === '__activate_edit_mode')   activate();
    if (e.data.type === '__deactivate_edit_mode') deactivate();
  });
  try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch {}

  function persist() {
    try { localStorage.setItem('tweaks', JSON.stringify(state)); } catch {}
    try {
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { accent: state.accent } }, '*');
    } catch {}
  }

  function applyTweaks(s) {
    const root = document.documentElement;
    if (s.accent) {
      root.style.setProperty('--rust', s.accent);
      // derive deep variant (10% darker via mix-blend trick — use a static map for known colors)
      const deepMap = {
        '#e8590c': '#c2410c',
        '#c2410c': '#8a2c08',
        '#2e5cf2': '#1e3a8a',
        '#15a352': '#0d6b35',
        '#a855f7': '#6b21a8',
        '#1a1410': '#000000',
      };
      root.style.setProperty('--rust-deep', deepMap[s.accent] || s.accent);
      // soft tint: convert hex to rgba with low alpha
      root.style.setProperty('--rust-soft', hexA(s.accent, 0.12));
      root.style.setProperty('--rust-tint', hexA(s.accent, 0.15));
    }
  }
  function hexA(hex, a) {
    const m = hex.replace('#', '');
    const r = parseInt(m.slice(0,2), 16);
    const g = parseInt(m.slice(2,4), 16);
    const b = parseInt(m.slice(4,6), 16);
    return `rgba(${r},${g},${b},${a})`;
  }
})();
