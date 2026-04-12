<template>
  <div class="pack-scene" :class="`phase-${phase}`">
    <div class="open-flash"></div>

    <div
      ref="packRef"
      class="booster-pack"
      :class="{ 'is-opening': phase === 'opening' }"
      :style="packStyle"
      @click="openPack"
    >
      <!-- Foil rainbow sheen -->
      <div class="pack-foil"></div>
      <!-- Directional light glare -->
      <div class="pack-glare"></div>

      <!-- TOP CRIMP: flat sealed area with hang hole + crimp lines -->
      <div class="pack-top">
        <div class="age-badge">6+</div>
        <div class="rip-line">
          <span class="rip-arrow">&#9664;</span>
          <span class="rip-text">OPEN HERE</span>
          <span class="rip-arrow">&#9654;</span>
        </div>
      </div>

      <!-- MAIN BODY -->
      <div class="pack-body">
        <div class="body-bg"></div>
        <div class="side-band side-band--l"></div>
        <div class="side-band side-band--r"></div>

        <div class="body-content">
          <div class="logo-area">
            <div class="pokemon-logo">Pokémon</div>
            <div class="tcg-band">TRADING CARD GAME</div>
          </div>

          <div class="art-center">
            <div class="energy-orb">
              <div class="orb-ring orb-ring--1"></div>
              <div class="orb-ring orb-ring--2"></div>
              <div class="orb-core"></div>
            </div>
          </div>

          <div class="set-name-area">
            <div class="series-sub">Developer</div>
            <div class="series-main">Series</div>
          </div>
        </div>

        <!-- Emboss: makes card area look raised/bulging -->
        <div class="body-emboss"></div>
      </div>

      <!-- BOTTOM CRIMP: flat sealed area with barcode stripe -->
      <div class="pack-bottom">
        <div class="bottom-info">5 Additional Game Cards</div>
        <div class="bottom-stripe"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import './component-style/BoosterPack.scss';

export default {
  props: {
    title: String,
    content: String,
    className: String,
    style: [String, Object],
    componentName: String,
    position: Object,
  },
  setup() {
    const packRef = ref(null);
    const phase = ref('idle');
    const isMobile = ref(false);

    const updateEffects = (clientX, clientY) => {
      const el = packRef.value;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const xNorm = (clientX - rect.left) / rect.width;
      const yNorm = (clientY - rect.top) / rect.height;

      const rotateY = (xNorm - 0.5) * -22;
      const rotateX = (yNorm - 0.5) * 22;
      const distance = Math.hypot(xNorm - 0.5, yNorm - 0.5);
      const glareX = (1 - xNorm) * 100;
      const glareY = (1 - yNorm) * 100;
      const glareOpacity = Math.min(distance * 1.5, 1);
      const foilAngle = xNorm * 180 + yNorm * 60 + 80;

      const s = el.style;
      s.setProperty('--rotate-x', `${rotateX}deg`);
      s.setProperty('--rotate-y', `${rotateY}deg`);
      s.setProperty('--hyp', distance);
      s.setProperty('--glare-x', `${glareX}%`);
      s.setProperty('--glare-y', `${glareY}%`);
      s.setProperty('--glare-opacity', glareOpacity);
      s.setProperty('--foil-angle', `${foilAngle}deg`);
    };

    const resetEffects = () => {
      const s = packRef.value?.style;
      if (!s) return;
      s.setProperty('--rotate-x', '0deg');
      s.setProperty('--rotate-y', '0deg');
      s.setProperty('--hyp', '0');
      s.setProperty('--glare-opacity', '0');
      s.setProperty('--foil-angle', '115deg');
    };

    const handleMouseMove  = (e) => { if (!isMobile.value) updateEffects(e.clientX, e.clientY); };
    const handleMouseEnter = (e) => { if (isMobile.value) return; updateEffects(e.clientX, e.clientY); };
    const handleMouseLeave = ()  => { if (isMobile.value) return; setTimeout(resetEffects, 100); };
    const handleTouchStart = (e) => { if (!isMobile.value) return; updateEffects(e.touches[0].clientX, e.touches[0].clientY); };
    const handleTouchMove  = (e) => { if (!isMobile.value) return; updateEffects(e.touches[0].clientX, e.touches[0].clientY); };
    const handleTouchEnd   = ()  => { if (!isMobile.value) return; setTimeout(() => setTimeout(resetEffects, 100), 300); };

    onMounted(() => {
      const mobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        'ontouchstart' in window || navigator.maxTouchPoints > 0;
      isMobile.value = mobile;
      const el = packRef.value;
      if (!el) return;
      if (mobile) {
        el.addEventListener('touchstart', handleTouchStart, { passive: true });
        el.addEventListener('touchmove',  handleTouchMove,  { passive: true });
        el.addEventListener('touchend',   handleTouchEnd,   { passive: true });
      } else {
        el.addEventListener('mousemove',  handleMouseMove);
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
      }
    });

    onUnmounted(() => {
      const el = packRef.value;
      if (!el) return;
      if (isMobile.value) {
        el.removeEventListener('touchstart', handleTouchStart);
        el.removeEventListener('touchmove',  handleTouchMove);
        el.removeEventListener('touchend',   handleTouchEnd);
      } else {
        el.removeEventListener('mousemove',  handleMouseMove);
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      }
    });

    const openPack = () => {
      if (phase.value !== 'idle') return;
      phase.value = 'opening';
      setTimeout(() => { phase.value = 'idle'; }, 1200);
    };

    const packStyle = computed(() => ({
      '--hyp': 0,
      '--rotate-x': '0deg',
      '--rotate-y': '0deg',
      '--glare-x': '50%',
      '--glare-y': '50%',
      '--glare-opacity': 0,
      '--foil-angle': '115deg',
    }));

    return { packRef, phase, packStyle, openPack };
  },
};
</script>
