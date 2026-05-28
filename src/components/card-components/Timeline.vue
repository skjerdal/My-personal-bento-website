<template>
  <div class="timeline-card">
    <div class="layout">
      <aside class="header-col">
        <div>
          <span class="sub">{{ startYear }} &rarr; {{ todayLabel }}</span>
          <h2>{{ journeyLabel }}</h2>
          <p class="desc">{{ descLabel }}</p>
        </div>
        <div class="legend" aria-label="Journey legend">
          <span class="legend-item">
            <span class="swatch education"></span>{{ laneLabel('education') }}
          </span>
          <span class="legend-item">
            <span class="swatch work"></span>{{ laneLabel('work') }}
          </span>
          <span class="legend-item">
            <span class="swatch activities"></span>{{ laneLabel('activities') }}
          </span>
        </div>
      </aside>

      <div class="timeline-col" ref="scrollWrap" :class="{ 'fade-left': showFadeLeft, 'fade-right': showFadeRight }" @scroll.passive="updateFades">
        <svg :viewBox="viewBox" preserveAspectRatio="xMidYMid meet" @click="selected = null">
          <!-- Trunk: solid then dashed past 'now' with arrow -->
          <line
            :x1="trunk.solidStart"
            :y1="trunkY"
            :x2="trunk.solidEnd"
            :y2="trunkY"
            class="j-trunk"
          />
          <line
            :x1="trunk.solidEnd"
            :y1="trunkY"
            :x2="trunk.dashEnd"
            :y2="trunkY"
            class="j-trunk dashed"
          />
          <polygon
            :points="`${trunk.dashEnd},${trunkY - 6} ${trunk.dashEnd + 12},${trunkY} ${trunk.dashEnd},${trunkY + 6}`"
            class="j-arrow activities"
          />

          <!-- Year ticks on trunk -->
          <g v-for="tick in yearTicks" :key="tick.year">
            <line
              :x1="tick.x"
              :y1="trunkY - 5"
              :x2="tick.x"
              :y2="trunkY + 5"
              class="j-tick"
            />
            <circle :cx="tick.x" :cy="trunkY" :r="3" class="j-tick-dot" />
            <text :x="tick.x" :y="trunkY + 24" text-anchor="middle" class="j-year">
              {{ tick.year }}
            </text>
          </g>

          <!-- Education branch (above) -->
          <path
            v-if="eduBranch"
            :d="eduBranch.solidPath"
            class="j-branch education"
            fill="none"
          />
          <path
            v-if="eduBranch"
            :d="eduBranch.dashPath"
            class="j-branch education dashed"
            fill="none"
          />
          <polygon
            v-if="eduBranch"
            :points="`${eduBranch.arrowX},${eduY - 6} ${eduBranch.arrowX + 12},${eduY} ${eduBranch.arrowX},${eduY + 6}`"
            class="j-arrow education"
          />

          <!-- Work branch (below) -->
          <path
            v-if="workBranch"
            :d="workBranch.solidPath"
            class="j-branch work"
            fill="none"
          />
          <path
            v-if="workBranch"
            :d="workBranch.dashPath"
            class="j-branch work dashed"
            fill="none"
          />
          <polygon
            v-if="workBranch"
            :points="`${workBranch.arrowX},${workY - 6} ${workBranch.arrowX + 12},${workY} ${workBranch.arrowX},${workY + 6}`"
            class="j-arrow work"
          />

          <!-- Per-entry connectors + nodes -->
          <g v-for="entry in placedEntries" :key="`conn-${entry.key}`">
            <line
              :x1="entry.nodeX"
              :y1="entry.nodeY"
              :x2="entry.connectX"
              :y2="entry.connectY"
              class="j-connector"
              :class="entry.lane"
            />
            <circle
              :cx="entry.nodeX"
              :cy="entry.nodeY"
              :r="6"
              class="j-node-dot"
              :class="entry.lane"
            />
          </g>

          <!-- Cards via foreignObject so they scale with the SVG -->
          <foreignObject
            v-for="entry in placedEntries"
            :key="`card-${entry.key}`"
            :x="entry.cardX"
            :y="entry.cardY"
            :width="cardW"
            :height="cardH"
          >
            <div
              xmlns="http://www.w3.org/1999/xhtml"
              class="entry-card"
              :class="[entry.lane, { selected: selected === entry.entry, dim: selected && selected !== entry.entry }]"
              @click.stop="select(entry.entry)"
            >
              <div class="logo-wrap" :class="entry.lane">
                <img v-if="entry.logo" :src="entry.logo" :alt="entry.orgShort" />
                <span v-else>{{ entry.orgShort.charAt(0) }}</span>
              </div>
              <div class="info">
                <div class="card-title">{{ entry.titleShort }}</div>
                <div class="card-org" :class="entry.lane">{{ entry.orgShort }}</div>
                <div class="card-date">{{ entry.dateShort }}</div>
              </div>
            </div>
          </foreignObject>
        </svg>
      </div>
    </div>

    <transition name="detail-fade">
      <div v-if="selected" class="detail-panel" @click.stop>
        <button class="close-btn" @click="selected = null" aria-label="Close">x</button>
        <div class="detail-header">
          <img
            v-if="selected.logo"
            :src="selected.logo"
            :alt="selected.org + ' logo'"
            class="detail-logo"
          />
          <div class="detail-text">
            <div class="category-tag" :style="{ color: laneColor(selected.lane) }">
              <span class="cat-dot" :style="{ background: laneColor(selected.lane) }"></span>
              {{ laneLabel(selected.lane) }}
            </div>
            <h3>{{ selected.title }}</h3>
            <div class="org">{{ selected.org }}</div>
            <div class="period">{{ selected.period }}</div>
          </div>
        </div>
        <ul v-if="selected.highlights && selected.highlights.length" class="highlights">
          <li v-for="(highlight, i) in selected.highlights" :key="i">{{ highlight }}</li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
import { computed, ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { currentLang, initLang } from '../../stores/language';
import { translations } from '../../i18n/translations';

const LANE_COLORS = {
  education: '#2e5cf2',
  work: '#e8590c',
  activities: '#8b7e6a',
};

const LANE_LABELS_EN = {
  education: 'Education',
  work: 'Work',
  activities: 'Activities',
};

const LANE_LABELS_NO = {
  education: 'Utdanning',
  work: 'Arbeid',
  activities: 'Aktiviteter',
};

const RENDER_KEYS = new Set([
  'trade-school',
  'hvl',
  'ntnu',
  'skjerdal',
  'norways-best',
  'omega',
  'studvest',
  'teaching-assistant',
]);

const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_NO = ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'];

function entryKey(entry) {
  const haystack = `${entry.lane} ${entry.org} ${entry.title}`.toLowerCase();
  if (haystack.includes('trade school') || haystack.includes('dataelektronikk') || haystack.includes('sogndal')) return 'trade-school';
  if (haystack.includes('computer engineering') || haystack.includes('dataingeni')) return 'hvl';
  if (haystack.includes('artificial intelligence') || haystack.includes('kunstig intelligens')) return 'ntnu';
  if (haystack.includes('skjerdal')) return 'skjerdal';
  if (haystack.includes("norway's best") || haystack.includes('norways best')) return 'norways-best';
  if (haystack.includes('omega') && !/summer|sommer|intern/i.test(haystack)) return 'omega';
  if (haystack.includes('studvest')) return 'studvest';
  if (haystack.includes('teaching assistant') || haystack.includes('studentassistent')) return 'teaching-assistant';
  return haystack.replace(/[^a-z0-9]+/g, '-');
}

function shortOrg(org) {
  const n = org.toLowerCase();
  if (/\bhvl\b/i.test(org) || n.includes('vestlandet')) return 'HVL';
  if (/\bntnu\b/i.test(org) || n.includes('teknisk') || n.includes('norwegian university')) return 'NTNU';
  if (n.includes('omega')) return 'Omega 365';
  if (n.includes('studvest')) return 'Studvest';
  if (n.includes("norway's best")) return "Norway's Best";
  if (n.includes('sogndal')) return 'Sogndal VGS';
  if (n.includes('skjerdal')) return 'Skjerdal';
  return org;
}

function shortTitle(entry, key) {
  if (key === 'hvl') return entry.lane === 'education' ? (currentLangIs('no') ? 'Dataingeniør' : 'Computer Engineering') : entry.title;
  if (key === 'ntnu') return currentLangIs('no') ? 'Kunstig intelligens' : 'Artificial Intelligence';
  if (key === 'norways-best') return currentLangIs('no') ? 'IT-tekniker' : 'IT Technician';
  if (key === 'omega') return currentLangIs('no') ? 'Utvikler' : 'Developer';
  if (key === 'studvest') return currentLangIs('no') ? 'Webutvikler' : 'Web Developer';
  if (key === 'teaching-assistant') return currentLangIs('no') ? 'Studentassistent' : 'Teaching Assistant';
  if (key === 'trade-school') return currentLangIs('no') ? 'Dataelektronikk' : 'Computer Electronics';
  if (key === 'skjerdal') return currentLangIs('no') ? 'Landskapspleie' : 'Landscaping';
  return entry.title;
}

function currentLangIs(code) {
  return currentLang.value === code;
}

function formatStartDate(startDate) {
  if (!startDate) return '';
  const [y, m] = startDate.split('-').map(Number);
  const months = currentLangIs('no') ? MONTHS_NO : MONTHS_EN;
  return `${months[(m || 1) - 1]} ${y}`;
}

function normalizedLogo(logo) {
  if (!logo) return null;
  return logo.startsWith('/') ? logo : `/${logo}`;
}

export default {
  name: 'Timeline',
  setup() {
    initLang();

    const selected = ref(null);
    const scrollWrap = ref(null);
    const showFadeLeft = ref(false);
    const showFadeRight = ref(false);

    // Geometry (constants in viewBox units)
    const startYear = 2016;
    const endYear = 2027;
    const leftPad = 70;
    const rightPad = 40;
    const yearSpan = 155; // px per year in viewBox units
    const vw = leftPad + rightPad + (endYear - startYear) * yearSpan;
    const vh = 560;
    const trunkY = 290;
    const eduY = 200;
    const workY = 380;
    const eduCardY = 30;
    const workCardY = 430;
    const actCardY = 320;
    const cardW = 250;
    const cardH = 80;

    const viewBox = `0 0 ${vw} ${vh}`;

    function xForDate(year, month = 1) {
      return leftPad + (year - startYear + (month - 1) / 12) * yearSpan;
    }

    function xForDateString(dateStr) {
      if (!dateStr) return null;
      const [y, m] = dateStr.split('-').map(Number);
      return xForDate(y, m || 1);
    }

    function laneColor(lane) {
      return LANE_COLORS[lane] || LANE_COLORS.activities;
    }

    function laneLabel(lane) {
      const labels = currentLangIs('no') ? LANE_LABELS_NO : LANE_LABELS_EN;
      return labels[lane] || lane;
    }

    const todayLabel = computed(() => (currentLangIs('no') ? 'I dag' : 'Today'));
    const journeyLabel = computed(() => translations[currentLang.value]?.cardTitles?.timeline || 'Journey');
    const descLabel = computed(() =>
      currentLangIs('no')
        ? 'En tidslinje over utdanning, arbeid og aktiviteter.'
        : 'A timeline of education, work, and activities.'
    );

    function nowX() {
      const now = new Date();
      const yr = now.getFullYear();
      const mo = now.getMonth() + 1;
      return Math.max(leftPad, Math.min(vw - rightPad, xForDate(yr, mo)));
    }

    const rawEntries = computed(() => {
      const t = translations[currentLang.value];
      const sources = [
        { lane: 'education', src: t.education, getOrg: (e) => e.institution, getTitle: (e) => e.degree, getHighlights: (e) => e.achievements },
        { lane: 'work', src: t.work, getOrg: (e) => e.company, getTitle: (e) => e.title, getHighlights: (e) => e.highlights },
        { lane: 'activities', src: t.activities, getOrg: (e) => e.organization, getTitle: (e) => e.title, getHighlights: (e) => e.highlights },
      ];
      const out = [];
      for (const src of sources) {
        for (const e of src.src) {
          if (!e.startDate) continue;
          const key = entryKey({ lane: src.lane, org: src.getOrg(e), title: src.getTitle(e) });
          if (!RENDER_KEYS.has(key)) continue;
          out.push({
            key,
            lane: src.lane,
            org: src.getOrg(e),
            title: src.getTitle(e),
            highlights: src.getHighlights(e) || [],
            period: e.period,
            logo: normalizedLogo(e.logo),
            startDate: e.startDate,
            endDate: e.endDate,
            ongoing: !e.endDate,
          });
        }
      }
      // Merge duplicates that share a key (e.g. two Teaching Assistant periods)
      const sorted = out.sort((a, b) => a.startDate.localeCompare(b.startDate));
      const seen = new Map();
      for (const e of sorted) {
        const existing = seen.get(e.key);
        if (!existing) {
          seen.set(e.key, { ...e });
        } else {
          if (!e.endDate || (existing.endDate && e.endDate > existing.endDate)) {
            existing.endDate = e.endDate;
            existing.ongoing = !e.endDate || existing.ongoing;
          }
        }
      }
      return [...seen.values()].sort((a, b) => a.startDate.localeCompare(b.startDate));
    });

    const placedEntries = computed(() => {
      const laneLastEdge = { education: -Infinity, work: -Infinity, activities: -Infinity };
      const laneLastY = { education: eduCardY, work: workCardY, activities: actCardY };
      const stepOffset = cardH + 14;

      return rawEntries.value.map((entry, i) => {
        const k = entry.key;
        const nodeX = xForDateString(entry.startDate);

        let baseCardY;
        let nodeY;
        if (entry.lane === 'education') {
          nodeY = eduY;
          baseCardY = eduCardY;
        } else if (entry.lane === 'work') {
          nodeY = workY;
          baseCardY = workCardY;
        } else {
          nodeY = trunkY;
          baseCardY = actCardY;
        }

        // Card horizontal placement: center on node, clamp inside viewBox
        let cardX = nodeX - cardW / 2;
        const maxX = vw - rightPad - cardW;
        if (cardX < leftPad - 10) cardX = leftPad - 10;
        if (cardX > maxX) cardX = maxX;

        // Vertical stagger if horizontally overlapping a previous card in the same lane
        let cardY = baseCardY;
        if (cardX < laneLastEdge[entry.lane] + 8) {
          // Stagger: push away from the lane axis
          if (entry.lane === 'education') {
            cardY = laneLastY[entry.lane] - stepOffset;
          } else {
            cardY = laneLastY[entry.lane] + stepOffset;
          }
        }
        laneLastEdge[entry.lane] = cardX + cardW;
        laneLastY[entry.lane] = cardY;

        const connectY = entry.lane === 'education' ? cardY + cardH : cardY;

        const cardCenter = cardX + cardW / 2;
        const connectX = Math.abs(cardCenter - nodeX) < cardW / 2 - 30 ? nodeX : cardCenter;

        return {
          key: `${k}-${i}`,
          entry,
          lane: entry.lane,
          logo: entry.logo,
          orgShort: shortOrg(entry.org),
          titleShort: shortTitle(entry, k),
          dateShort: formatStartDate(entry.startDate),
          nodeX,
          nodeY,
          cardX,
          cardY,
          connectX,
          connectY,
        };
      });
    });

    const yearTicks = computed(() => {
      const ticks = [];
      for (let y = startYear; y <= endYear; y++) {
        ticks.push({ year: y, x: xForDate(y) });
      }
      return ticks;
    });

    const trunk = computed(() => {
      const solidStart = leftPad;
      const solidEnd = nowX();
      const dashEnd = vw - rightPad - 14;
      return { solidStart, solidEnd, dashEnd };
    });

    function buildBranch(lane, branchY) {
      const inLane = placedEntries.value.filter((p) => p.lane === lane);
      if (!inLane.length) return null;
      const sorted = [...inLane].sort((a, b) => a.nodeX - b.nodeX);
      const firstX = sorted[0].nodeX;
      const ongoing = sorted.some((p) => p.entry.ongoing);
      // S-curve from trunk at firstX to branch at firstX
      const curveLen = 36;
      const cx1 = firstX - curveLen / 2;
      const cy1 = trunkY;
      const cx2 = firstX - curveLen / 2;
      const cy2 = branchY;
      const startTrunkX = firstX - curveLen;
      // Solid portion: from trunk through last entry's nodeX
      const lastSolidX = ongoing
        ? sorted.find((p) => p.entry.ongoing).nodeX
        : sorted[sorted.length - 1].nodeX;
      const arrowX = vw - rightPad - 14;
      const solidPath = `M ${startTrunkX},${trunkY} C ${cx1},${cy1} ${cx2},${cy2} ${firstX},${branchY} L ${lastSolidX},${branchY}`;
      const dashPath = `M ${lastSolidX},${branchY} L ${arrowX},${branchY}`;
      return { solidPath, dashPath, arrowX };
    }

    const eduBranch = computed(() => buildBranch('education', eduY));
    const workBranch = computed(() => buildBranch('work', workY));

    function select(entry) {
      selected.value = selected.value === entry ? null : entry;
    }

    function updateFades() {
      const el = scrollWrap.value;
      if (!el) return;
      showFadeLeft.value = el.scrollLeft > 6;
      showFadeRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 6;
    }

    function scrollToRecent() {
      const el = scrollWrap.value;
      if (!el) return;
      el.scrollLeft = el.scrollWidth - el.clientWidth;
    }

    onMounted(() => {
      nextTick(() => {
        scrollToRecent();
        updateFades();
      });
      window.addEventListener('resize', updateFades);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', updateFades);
    });

    return {
      viewBox,
      startYear,
      todayLabel,
      journeyLabel,
      descLabel,
      laneLabel,
      laneColor,
      yearTicks,
      trunk,
      eduBranch,
      workBranch,
      placedEntries,
      trunkY,
      eduY,
      workY,
      cardW,
      cardH,
      selected,
      select,
      scrollWrap,
      showFadeLeft,
      showFadeRight,
      updateFades,
    };
  },
};
</script>

<style lang="scss">
.card.journey-card {
  height: 620px !important;
}

@media (max-width: 900px) {
  .card.journey-card {
    height: auto !important;
    min-height: 720px;
  }
}
</style>

<style lang="scss" scoped>
.timeline-card {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 28px 32px;
  box-sizing: border-box;
  color: var(--text-color, #1a1410);
  overflow: hidden;
}

.layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 24px;
  height: 100%;
  align-items: stretch;
}

.header-col {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 24px;
  padding-top: 6px;
}

.sub {
  display: block;
  margin-bottom: 6px;
  font-family: var(--type-font-label);
  font-size: var(--type-label-size);
  font-weight: var(--type-label-weight);
  letter-spacing: 0.18em;
  line-height: var(--type-label-line);
  text-transform: uppercase;
  color: var(--text-tertiary, #8b7e6a);
}

h2 {
  margin: 0;
  color: var(--text-primary, #1a1410);
  font-family: var(--type-font-heading);
  font-size: clamp(2.4rem, 4vw, 3rem);
  font-style: var(--type-heading-style);
  font-weight: var(--type-card-title-weight);
  line-height: 0.92;
  letter-spacing: 0;
}

.desc {
  margin: 14px 0 0;
  color: var(--text-secondary, #4a3f31);
  font-family: var(--type-font-body);
  font-size: var(--type-small-size, 0.95rem);
  line-height: 1.5;
  max-width: 220px;
}

.legend {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--text-secondary, #4a3f31);
  font-family: var(--type-font-body);
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0;
  text-transform: none;
  white-space: nowrap;
}

.swatch {
  width: 22px;
  height: 3px;
  border-radius: 2px;
}

.swatch.education { background: #2e5cf2; }
.swatch.work { background: #e8590c; }
.swatch.activities { background: #8b7e6a; }

.timeline-col {
  position: relative;
  min-width: 0;
  overflow-x: auto;
  overflow-y: visible;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;

  &::-webkit-scrollbar { display: none; }

  svg {
    display: block;
    width: 100%;
    min-width: 1500px;
    height: auto;
    overflow: visible;
  }

  &.fade-left {
    mask-image: linear-gradient(to right, transparent 0, #000 48px, #000 100%);
    -webkit-mask-image: linear-gradient(to right, transparent 0, #000 48px, #000 100%);
  }
  &.fade-right {
    mask-image: linear-gradient(to right, #000 0, #000 calc(100% - 48px), transparent 100%);
    -webkit-mask-image: linear-gradient(to right, #000 0, #000 calc(100% - 48px), transparent 100%);
  }
  &.fade-left.fade-right {
    mask-image: linear-gradient(to right, transparent 0, #000 48px, #000 calc(100% - 48px), transparent 100%);
    -webkit-mask-image: linear-gradient(to right, transparent 0, #000 48px, #000 calc(100% - 48px), transparent 100%);
  }
}

.j-trunk {
  stroke: #8b7e6a;
  stroke-width: 2;
  stroke-linecap: round;
  &.dashed { stroke-dasharray: 4 6; opacity: 0.6; }
}

.j-tick {
  stroke: rgba(26, 20, 16, 0.25);
  stroke-width: 1;
}

.j-tick-dot {
  fill: #fffaf0;
  stroke: #8b7e6a;
  stroke-width: 1.5;
}

.j-year {
  fill: var(--text-tertiary, #8b7e6a);
  font-family: var(--type-font-label);
  font-size: 12px;
  font-weight: var(--type-label-weight);
  letter-spacing: 0.06em;
}

.j-branch {
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;

  &.education { stroke: #2e5cf2; }
  &.work { stroke: #e8590c; }

  &.dashed { stroke-dasharray: 4 6; opacity: 0.85; }
}

.j-connector {
  stroke-width: 1.5;

  &.education { stroke: #2e5cf2; }
  &.work { stroke: #e8590c; }
  &.activities { stroke: #8b7e6a; }
}

.j-node-dot {
  fill: #fffaf0;
  stroke-width: 2.2;

  &.education { stroke: #2e5cf2; }
  &.work { stroke: #e8590c; }
  &.activities { stroke: #8b7e6a; }
}

.j-arrow {
  &.education { fill: #2e5cf2; }
  &.work { fill: #e8590c; }
  &.activities { fill: #8b7e6a; }
}

// Entry card (rendered in foreignObject)
:deep(.entry-card) {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  height: 100%;
  padding: 10px 14px 10px 10px;
  border: 1px solid rgba(26, 20, 16, 0.08);
  border-radius: 14px;
  background: var(--card-bg, #fffaf0);
  box-shadow: 0 6px 18px rgba(26, 20, 16, 0.08), 0 1px 3px rgba(26, 20, 16, 0.05);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
  font-family: var(--type-font-body);
  color: var(--text-primary, #1a1410);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 22px rgba(26, 20, 16, 0.12), 0 2px 5px rgba(26, 20, 16, 0.06);
  }

  &.selected {
    box-shadow: 0 12px 26px rgba(26, 20, 16, 0.16), 0 0 0 2px rgba(46, 92, 242, 0.25);
  }

  &.dim { opacity: 0.35; }
}

:deep(.entry-card .logo-wrap) {
  flex: 0 0 44px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: white;
  border: 2px solid currentColor;
  overflow: hidden;
  font-size: 14px;
  font-weight: 700;

  &.education { color: #2e5cf2; }
  &.work { color: #e8590c; }
  &.activities { color: #8b7e6a; }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 4px;
    box-sizing: border-box;
  }
}

:deep(.entry-card .info) {
  min-width: 0;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

:deep(.entry-card .card-title) {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary, #1a1410);
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

:deep(.entry-card .card-org) {
  font-size: 0.8rem;
  font-weight: 600;
  line-height: 1.2;

  &.education { color: #2e5cf2; }
  &.work { color: #e8590c; }
  &.activities { color: #8b7e6a; }
}

:deep(.entry-card .card-date) {
  font-size: 0.72rem;
  color: var(--text-tertiary, #8b7e6a);
  letter-spacing: 0.04em;
  line-height: 1.2;
}

// Detail panel
.detail-panel {
  position: absolute;
  inset: auto 20px 20px auto;
  width: min(420px, calc(100% - 40px));
  max-height: 76%;
  overflow: auto;
  padding: 14px 16px 16px;
  border: 1px solid rgba(26, 20, 16, 0.1);
  border-radius: 14px;
  background: var(--detail-bg, rgba(250, 245, 232, 0.96));
  box-shadow: 0 14px 34px rgba(26, 20, 16, 0.16), 0 2px 8px rgba(26, 20, 16, 0.07);
  backdrop-filter: blur(14px);
  z-index: 5;
}

.close-btn {
  position: absolute;
  top: 6px;
  right: 8px;
  padding: 4px 7px;
  border: none;
  background: transparent;
  color: var(--text-tertiary, #8b7e6a);
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;

  &:hover { color: var(--text-primary, #1a1410); }
}

.detail-header {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding-right: 24px;
}

.detail-logo {
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  object-fit: contain;
  padding: 3px;
  border-radius: 7px;
  background: white;
  box-shadow: 0 0 0 2px white, 0 3px 8px rgba(26, 20, 16, 0.18);
}

.detail-text { min-width: 0; }

.category-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 2px;
  font-family: var(--type-font-label);
  font-size: var(--type-label-size);
  font-weight: var(--type-label-weight);
  letter-spacing: var(--type-label-tracking);
  line-height: var(--type-label-line);
  text-transform: uppercase;
}

.cat-dot { width: 7px; height: 7px; border-radius: 50%; }

h3 {
  margin: 0 0 2px;
  color: var(--text-primary, #1a1410);
  font-family: var(--type-font-body);
  font-size: var(--type-small-size);
  font-weight: var(--type-weight-semibold);
  line-height: var(--type-small-line);
}

.org {
  color: var(--text-secondary, #4a3f31);
  font-size: var(--type-caption-size);
  font-weight: var(--type-weight-semibold);
  line-height: var(--type-caption-line);
}

.period {
  margin-top: 1px;
  color: var(--text-tertiary, #8b7e6a);
  font-size: var(--type-caption-size);
  font-style: italic;
}

.highlights {
  margin: 9px 0 0;
  padding-left: 16px;

  li {
    margin-bottom: 4px;
    color: var(--text-secondary, #4a3f31);
    font-size: var(--type-caption-size);
    line-height: var(--type-caption-line);
    &:last-child { margin-bottom: 0; }
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

@media (max-width: 900px) {
  .timeline-card {
    padding: 22px 20px;
  }
  .layout {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .header-col {
    flex-direction: column;
    gap: 14px;
  }
  .desc { max-width: none; }
  .legend { flex-direction: row; flex-wrap: wrap; gap: 14px; }
  .timeline-col svg { min-width: 920px; }
  .detail-panel { inset: auto 12px 12px 12px; width: auto; }
}
</style>
