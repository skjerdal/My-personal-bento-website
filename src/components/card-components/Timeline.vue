<template>
  <div class="timeline-card" ref="rootEl">
    <div class="svg-wrap">
      <svg
        :viewBox="viewBox"
        preserveAspectRatio="xMidYMid meet"
        @click="selected = null"
      >
        <line
          :x1="trunk.x1"
          :y1="trunk.y1"
          :x2="trunk.x2"
          :y2="trunk.y2"
          class="trunk"
        />
        <path
          v-for="b in branches"
          :key="b.key"
          :d="b.d"
          :stroke="b.color"
          class="branch"
          :class="{ ongoing: b.ongoing, dim: selected && b.entry !== selected }"
        />
        <g
          v-for="d in dots"
          :key="d.key"
          class="dot-group"
          :class="{
            selected: selected === d.entry,
            dim: selected && selected !== d.entry,
          }"
          @click.stop="select(d.entry)"
        >
          <circle :cx="d.cx" :cy="d.cy" r="6" class="dot-bg" />
          <circle :cx="d.cx" :cy="d.cy" r="3.6" :fill="d.color" class="dot-fg" />
          <circle :cx="d.cx" :cy="d.cy" r="14" class="dot-hit" />
        </g>
        <text
          v-for="yl in yearLabels"
          :key="yl.label + '-' + yl.x + '-' + yl.y"
          :x="yl.x"
          :y="yl.y"
          class="year-label"
          :text-anchor="yl.anchor"
        >{{ yl.label }}</text>
      </svg>
    </div>
    <transition name="detail-fade">
      <div v-if="selected" class="detail-panel" @click.stop>
        <button class="close-btn" @click="selected = null" aria-label="Close">×</button>
        <div class="detail-header">
          <img
            v-if="selected.logo"
            :src="selected.logo"
            :alt="selected.org + ' logo'"
            class="detail-logo"
          />
          <div class="detail-text">
            <div class="category-tag" :style="{ color: selected.color }">
              <span class="cat-dot" :style="{ background: selected.color }"></span>
              {{ categoryLabel(selected.lane) }}
            </div>
            <h3>{{ selected.title }}</h3>
            <div class="org">{{ selected.org }}</div>
            <div class="period">{{ selected.period }}</div>
          </div>
        </div>
        <ul v-if="selected.highlights && selected.highlights.length" class="highlights">
          <li v-for="(h, i) in selected.highlights" :key="i">{{ h }}</li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { currentLang, initLang } from '../../stores/language';
import { translations } from '../../i18n/translations';

const PALETTE = [
  '#ef6c2a', '#7e3ff2', '#2eb6c5', '#e64980', '#22c55e',
  '#3b82f6', '#f59e0b', '#a855f7', '#06b6d4', '#f43f5e',
];

function dateToBucket(s) {
  if (!s) return null;
  const [y, m] = s.split('-').map(Number);
  return y * 2 + (m <= 6 ? 0 : 1);
}
function bucketToYear(b) { return Math.floor(b / 2); }
function nowBucket() {
  const d = new Date();
  return d.getFullYear() * 2 + (d.getMonth() < 6 ? 0 : 1);
}

export default {
  setup() {
    initLang();
    const isVertical = ref(false);
    const selected = ref(null);
    const rootEl = ref(null);
    let mql = null;
    const handle = (e) => { isVertical.value = e.matches; };

    onMounted(() => {
      mql = window.matchMedia('(max-width: 700px)');
      isVertical.value = mql.matches;
      if (mql.addEventListener) mql.addEventListener('change', handle);
      else mql.addListener(handle);
    });
    onBeforeUnmount(() => {
      if (!mql) return;
      if (mql.removeEventListener) mql.removeEventListener('change', handle);
      else mql.removeListener(handle);
    });

    function categoryLabel(lane) {
      const t = translations[currentLang.value].cardTitles;
      return t[lane] || lane;
    }

    const rawEntries = computed(() => {
      const t = translations[currentLang.value];
      const out = [];
      const sources = [
        {
          lane: 'education',
          src: t.education,
          getOrg: (e) => e.institution,
          getTitle: (e) => e.degree,
          getHighlights: (e) => e.achievements,
        },
        {
          lane: 'work',
          src: t.work,
          getOrg: (e) => e.company,
          getTitle: (e) => e.title,
          getHighlights: (e) => e.highlights,
        },
        {
          lane: 'activities',
          src: t.activities,
          getOrg: (e) => e.organization,
          getTitle: (e) => e.title,
          getHighlights: (e) => e.highlights,
        },
      ];
      for (const s of sources) {
        for (const e of s.src) {
          if (!e.startDate) continue;
          const sb = dateToBucket(e.startDate);
          const ongoing = !e.endDate;
          const eb = ongoing ? nowBucket() : dateToBucket(e.endDate);
          out.push({
            lane: s.lane,
            org: s.getOrg(e),
            title: s.getTitle(e),
            highlights: s.getHighlights(e) || [],
            period: e.period,
            logo: e.logo,
            startBucket: sb,
            endBucket: Math.max(sb, eb),
            ongoing,
          });
        }
      }
      return out;
    });

    // Sort entries by start (then by length desc to give longer-running things lower rows)
    // and assign row + parent + color.
    const layout = computed(() => {
      const sorted = [...rawEntries.value].sort((a, b) => {
        if (a.startBucket !== b.startBucket) return a.startBucket - b.startBucket;
        return b.endBucket - a.endBucket;
      });

      const slots = []; // each: endBucket of branch occupying it
      const placed = [];

      for (let i = 0; i < sorted.length; i++) {
        const e = { ...sorted[i] };

        // find available slot whose previous occupant ended before this starts
        let row = -1;
        for (let r = 0; r < slots.length; r++) {
          if (slots[r] < e.startBucket) { row = r; break; }
        }
        if (row === -1) {
          row = slots.length;
          slots.push(-Infinity);
        }
        e.row = row;
        slots[row] = e.endBucket;

        // parent = most-recently-started entry still active at e.startBucket
        let parent = null;
        for (let j = 0; j < placed.length; j++) {
          const p = placed[j];
          if (p.startBucket < e.startBucket && p.endBucket >= e.startBucket) {
            if (!parent || p.startBucket > parent.startBucket) parent = p;
          }
        }
        e.parentRow = parent ? parent.row : -1; // -1 = main
        e.color = PALETTE[i % PALETTE.length];
        placed.push(e);
      }

      return { entries: placed, numRows: slots.length };
    });

    const range = computed(() => {
      const all = layout.value.entries;
      if (all.length === 0) return { min: 0, max: 1 };
      let min = Infinity, max = -Infinity;
      for (const e of all) {
        if (e.startBucket < min) min = e.startBucket;
        if (e.endBucket > max) max = e.endBucket;
      }
      max = Math.max(max, nowBucket());
      return { min, max };
    });

    const geom = computed(() => {
      const numTicks = range.value.max - range.value.min + 1;
      const numRows = layout.value.numRows;
      if (isVertical.value) {
        const vw = 280;
        const leftPad = 36, rightPad = 14, topPad = 26, bottomPad = 26;
        const usable = 640 - topPad - bottomPad;
        const tickStep = usable / Math.max(numTicks - 1, 1);
        const vh = topPad + bottomPad + tickStep * (numTicks - 1);
        const mainS = leftPad + 6;
        const trackW = vw - mainS - rightPad - 8;
        const rowStep = numRows > 0 ? trackW / (numRows + 0.5) : trackW;
        const rowS = (i) => mainS + 18 + i * rowStep;
        return { vw, vh, leftPad, rightPad, topPad, bottomPad, tickStep, mainS, rowS, isV: true };
      } else {
        const baseVh = 280;
        const leftPad = 38, rightPad = 30, topPad = 28, bottomPad = 36;
        const rowStep = 36;
        const vh = Math.max(baseVh, topPad + 24 + numRows * rowStep + bottomPad);
        const usable = 1000 - leftPad - rightPad;
        const tickStep = usable / Math.max(numTicks - 1, 1);
        const vw = leftPad + rightPad + tickStep * (numTicks - 1);
        const mainS = topPad + 6;
        const rowS = (i) => mainS + 22 + i * rowStep;
        return { vw, vh, leftPad, rightPad, topPad, bottomPad, tickStep, mainS, rowS, isV: false };
      }
    });

    const viewBox = computed(() => `0 0 ${geom.value.vw} ${geom.value.vh}`);

    function primaryFor(bucket) {
      const g = geom.value;
      const idx = bucket - range.value.min;
      return (g.isV ? g.topPad : g.leftPad) + idx * g.tickStep;
    }
    function pt(p, s) {
      return geom.value.isV ? { x: s, y: p } : { x: p, y: s };
    }

    const trunk = computed(() => {
      const g = geom.value;
      const startP = g.isV ? g.topPad : g.leftPad;
      const endP = startP + g.tickStep * (range.value.max - range.value.min);
      const a = pt(startP, g.mainS);
      const b = pt(endP, g.mainS);
      return { x1: a.x, y1: a.y, x2: b.x, y2: b.y };
    });

    const branches = computed(() => {
      const g = geom.value;
      const result = [];
      const list = layout.value.entries;
      for (let i = 0; i < list.length; i++) {
        const e = list[i];
        const sP = primaryFor(e.startBucket);
        const eP = primaryFor(e.endBucket);
        const ownS = g.rowS(e.row);
        const parentS = e.parentRow === -1 ? g.mainS : g.rowS(e.parentRow);
        const dist = Math.abs(ownS - parentS);
        const curve = Math.max(4, Math.min(g.tickStep * 0.5, dist * 0.6));

        // curve happens BEFORE sP, ending at (sP, ownS); branch is straight sP→eP;
        // merge curve happens AFTER eP, starting at (eP, ownS) ending at (eP+curve, parentS).
        const p0 = pt(sP - curve, parentS);
        const c1a = pt(sP, parentS);
        const c1b = pt(sP - curve, ownS);
        const p1 = pt(sP, ownS);
        const p2 = pt(eP, ownS);
        const c2a = pt(eP + curve, ownS);
        const c2b = pt(eP, parentS);
        const p3 = pt(eP + curve, parentS);

        let d = `M ${p0.x},${p0.y} C ${c1a.x},${c1a.y} ${c1b.x},${c1b.y} ${p1.x},${p1.y}`;
        if (eP > sP) d += ` L ${p2.x},${p2.y}`;
        if (!e.ongoing) {
          d += ` C ${c2a.x},${c2a.y} ${c2b.x},${c2b.y} ${p3.x},${p3.y}`;
        }
        result.push({ key: i, d, color: e.color, ongoing: e.ongoing, entry: e });
      }
      return result;
    });

    const dots = computed(() => {
      const g = geom.value;
      const out = [];
      const list = layout.value.entries;
      for (let i = 0; i < list.length; i++) {
        const e = list[i];
        const ownS = g.rowS(e.row);
        for (let b = e.startBucket; b <= e.endBucket; b++) {
          const p = primaryFor(b);
          const c = pt(p, ownS);
          out.push({ key: `${i}-${b}`, cx: c.x, cy: c.y, color: e.color, entry: e });
        }
      }
      return out;
    });

    const yearLabels = computed(() => {
      const g = geom.value;
      const min = range.value.min, max = range.value.max;
      const out = [];
      for (let b = min; b <= max; b++) {
        if (b % 2 !== 0) continue;
        const p = primaryFor(b);
        if (g.isV) {
          const c = pt(p, g.mainS);
          out.push({ label: bucketToYear(b), x: c.x - 8, y: c.y + 4, anchor: 'end' });
        } else {
          const c = pt(p, g.mainS);
          out.push({ label: bucketToYear(b), x: c.x, y: c.y - 10, anchor: 'middle' });
        }
      }
      return out;
    });

    function select(entry) {
      selected.value = selected.value === entry ? null : entry;
    }

    return {
      viewBox, trunk, branches, dots, yearLabels,
      selected, select, rootEl, categoryLabel,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '../../styles/color-theme.scss';

.timeline-card {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 4px 8px 6px;
  box-sizing: border-box;
  color: var(--text-color, inherit);
}

.svg-wrap {
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 100%;
    height: 100%;
    max-height: 100%;
    display: block;
    overflow: visible;
  }
}

.trunk {
  stroke: var(--text-tertiary, rgba(120, 120, 130, 0.55));
  stroke-width: 2;
  stroke-linecap: round;
  opacity: 0.55;
}

.branch {
  fill: none;
  stroke-width: 2.6;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: opacity 0.2s ease;

  &.dim { opacity: 0.22; }
}

.dot-group {
  cursor: pointer;
  transition: opacity 0.2s ease;

  .dot-bg {
    fill: var(--card-bg-fill, #fefdf8);
    transition: r 0.15s ease;
  }
  .dot-fg {
    transition: r 0.15s ease;
  }
  .dot-hit {
    fill: transparent;
    pointer-events: all;
  }
  &:hover .dot-fg,
  &.selected .dot-fg { r: 5; }
  &:hover .dot-bg,
  &.selected .dot-bg { r: 8.5; }
  &.dim { opacity: 0.3; }
}

.year-label {
  font-size: 11px;
  font-family: var(--font-sans);
  font-weight: 500;
  fill: var(--text-tertiary, #6b7280);
}

.detail-panel {
  position: absolute;
  inset: auto 10px 10px 10px;
  max-height: 75%;
  background: var(--detail-bg, rgba(255, 255, 255, 0.97));
  border-radius: 14px;
  padding: 12px 14px 14px;
  box-shadow:
    0 14px 34px rgba(0, 0, 0, 0.16),
    0 2px 8px rgba(0, 0, 0, 0.07);
  overflow: auto;
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.65);

  .close-btn {
    position: absolute;
    top: 4px;
    right: 8px;
    background: none;
    border: none;
    font-size: 1.5rem;
    line-height: 1;
    cursor: pointer;
    color: var(--text-tertiary);
    padding: 4px 6px;
    &:hover { color: var(--text-primary); }
  }

  .detail-header {
    display: flex;
    align-items: flex-start;
    gap: 10px;

    .detail-logo {
      width: 38px;
      height: 38px;
      object-fit: contain;
      border-radius: 7px;
      background: white;
      padding: 3px;
      box-shadow: 0 0 0 2px white, 0 3px 8px rgba(0, 0, 0, 0.18);
      flex-shrink: 0;
    }
    .detail-text {
      min-width: 0;

      .category-tag {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-size: 0.65rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        margin-bottom: 2px;

        .cat-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }
      }
      h3 {
        margin: 0 0 2px;
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--text-primary);
        line-height: 1.2;
        padding-right: 24px;
      }
      .org {
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--text-secondary);
        line-height: 1.2;
      }
      .period {
        font-size: 0.75rem;
        color: var(--text-tertiary);
        font-style: italic;
        margin-top: 1px;
      }
    }
  }

  .highlights {
    margin: 8px 0 0;
    padding-left: 16px;
    li {
      font-size: 0.8rem;
      line-height: 1.35;
      color: var(--text-secondary);
      margin-bottom: 4px;
      &:last-child { margin-bottom: 0; }
    }
  }
}

.detail-fade-enter-active,
.detail-fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.detail-fade-enter-from,
.detail-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
