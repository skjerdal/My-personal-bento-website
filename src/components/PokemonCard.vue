<template>
  <Teleport to="body" :disabled="!isExpanded">
    <div
      ref="cardRef"
      :class="`pokemon-card ${className || ''} ${isHovered ? 'hovered' : ''} ${isInitialized ? 'initialized' : ''} ${isExpanded ? 'is-expanded' : ''} ${isSpinning ? 'is-spinning' : ''} ${isCollapsing ? 'is-collapsing' : ''}`"
      :style="cardStyle"
      @click.stop="handleClick"
    >
    <div class="card-inner">
      <!-- BACK -->
      <div class="card-face card-back">
        <img src="/ok_devs_back_card.png" alt="Card back" class="card-back-image" />
      </div>
      <!-- FRONT -->
      <div class="card-face card-front">
        <div class="card__shine"></div>
        <div class="card__glare"></div>
        <div class="card-content">
          <div class="card-bg-layer" />
          <!-- Card Header -->
          <div class="card-header">
            <div class="name-type-container">
              <h1 class="card-title">{{ title || 'Thomas Skjerdal' }}</h1>
              <span class="evolution">
                <span class="pre-evolution-wrapper">
                  <img src="/profil.jpg" alt="Junior Dev" class="pre-evolution-img" />
                </span>
                Evolves from Junior Dev
              </span>
              <span class="type">Developer</span>
            </div>
            <div class="hp-container">
              <img src="/computertype.png" alt="Computer pokemon type" aria-hidden="true" class="type-icon" />
              <div class="hp">
                <span class="hp-text">HP</span>
                <span class="hp-value">340</span>
              </div>
            </div>
          </div>

          <!-- Card Image -->
          <div class="card-image-container">
            <div class="card-image">
              <img src="/profilbilde.png" alt="Thomas Skjerdal" />
            </div>
          </div>

          <!-- Ability Section -->
          <div class="card-ability">
            <div class="ability-header">
              <span class="ability-badge">Ability</span>
              <span class="ability-name"> Code Surge</span>
            </div>
            <p>Once per turn, draw an extra idea from your inspiration deck.</p>
          </div>

          <!-- Attacks -->
          <div class="card-attacks">
            <div class="attack">
              <div class="attack-header">
                <div class="attack-cost">
                  <img src="/caffeineicon.png" alt="" aria-hidden="true" />
                </div>
                <span class="attack-name">Quick Fix</span>
                <span class="attack-damage">30</span>
              </div>
              <p>Flip a coin. If heads, prevent all effects of an attack during your opponent's next turn.</p>
            </div>
            <div class="attack">
              <div class="attack-header">
                <div class="attack-cost">
                  <img src="/caffeineicon.png" alt="" aria-hidden="true" />
                  <img src="/caffeineicon.png" alt="" aria-hidden="true" />
                  <img src="/caffeineicon.png" alt="" aria-hidden="true" />
                </div>
                <span class="attack-name">Full Deployment</span>
                <span class="attack-damage">90</span>
              </div>
              <p>This attack does 20 more damage for each bug fixed this turn.</p>
            </div>
          </div>

          <!-- Weakness/Resistance/Retreat -->
          <div class="card-weakness">
            <div>
              <span>Weakness</span>
              <span class="weakness-type">Monster Shortage ×2</span>
            </div>
            <div>
              <span>Resistance</span>
              <span class="resistance-type">Deadline Pressure -20</span>
            </div>
            <div>
              <span>Retreat Cost</span>
              <div class="retreat-cost">
                <img src="/caffeineicon.png" alt="" aria-hidden="true" />
                <img src="/caffeineicon.png" alt="" aria-hidden="true" />
              </div>
            </div>
          </div>

          <!-- Card Footer -->
          <div class="card-footer">
            <div class="card-set-row">
              <span class="set-number">001/001</span>
              <div class="rarity-symbol">
                <span class="star">★</span>
              </div>
              <img src="/caffeineicon.png" alt="" aria-hidden="true" class="set-icon" />
            </div>
            <div class="card-info-row">
              <span class="illus">Illus. Thomas Skjerdal</span>
              <span class="copyright">© 2025 T. Skjerdal</span>
            </div>
          </div>
        </div>
      </div>
    </div><!-- end card-inner -->
    </div>
  </Teleport>
  <Teleport v-if="isMounted" to="body">
    <Transition name="card-backdrop">
      <div v-if="isExpanded" class="card-backdrop" @click="collapseCard" />
    </Transition>
  </Teleport>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import './component-style/PokemonCard.scss';

export default {
  inheritAttrs: false,
  emits: ['collapse'],
  props: {
    title: String,
    content: String,
    className: String,
    style: [String, Object],
    componentName: String,
    position: Object,
    forceExpanded: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    const cardRef = ref(null);
    const isHovered = ref(false);
    const isInitialized = ref(false);
    const isMobile = ref(false);
    const isExpanded = ref(false);
    const isSpinning = ref(false);
    const isCollapsing = ref(false);
    const expandScale = ref(1);
    let spinTimeout = null;
    const displayZoom = ref(1);
    const isMounted = ref(false);

    const adjust = (value, fromMin, fromMax, toMin, toMax) => {
      return toMin + (toMax - toMin) * ((value - fromMin) / (fromMax - fromMin));
    };

    const updateCardEffects = (clientX, clientY) => {
      if (!cardRef.value) return;

      const rect = cardRef.value.getBoundingClientRect();
      const xNorm = (clientX - rect.left) / rect.width;
      const yNorm = (clientY - rect.top) / rect.height;

      const pointerX = xNorm * 100;
      const pointerY = yNorm * 100;
      const bgX = adjust(pointerX, 0, 100, 37, 63);
      const bgY = adjust(pointerY, 0, 100, 33, 67);
      const rotateY = (xNorm - 0.5) * -20;
      const rotateX = (yNorm - 0.5) * 20;
      const distance = Math.hypot(xNorm - 0.5, yNorm - 0.5);
      const glareX = (1 - xNorm) * 100;
      const glareY = (1 - yNorm) * 100;
      const glareOpacity = Math.min(distance * 1.5, 1);

      const s = cardRef.value.style;
      s.setProperty('--pointer-x', `${pointerX}%`);
      s.setProperty('--pointer-y', `${pointerY}%`);
      s.setProperty('--background-x', `${bgX}%`);
      s.setProperty('--background-y', `${bgY}%`);
      s.setProperty('--hyp', distance);
      s.setProperty('--glare-x', `${glareX}%`);
      s.setProperty('--glare-y', `${glareY}%`);
      s.setProperty('--glare-opacity', glareOpacity);
      s.setProperty('--rotate-x', `${rotateX}deg`);
      s.setProperty('--rotate-y', `${rotateY}deg`);
    };

    const handleMouseMove = (e) => {
      if (isMobile.value) return;
      updateCardEffects(e.clientX, e.clientY);
    };

    const handleMouseEnter = (e) => {
      if (isMobile.value) return;
      if (cardRef.value) updateCardEffects(e.clientX, e.clientY);
      isHovered.value = true;
    };

    const handleMouseLeave = () => {
      if (isMobile.value) return;
      isHovered.value = false;

      if (!cardRef.value) return;
      const s = cardRef.value.style;

      const parsePercent = (val) => parseFloat(val) || 50;
      const parseNum = (val) => parseFloat(val) || 0;

      const startPointerX = parsePercent(s.getPropertyValue('--pointer-x'));
      const startPointerY = parsePercent(s.getPropertyValue('--pointer-y'));
      const startBgX = parsePercent(s.getPropertyValue('--background-x'));
      const startBgY = parsePercent(s.getPropertyValue('--background-y'));
      const startGlareX = parsePercent(s.getPropertyValue('--glare-x'));
      const startGlareY = parsePercent(s.getPropertyValue('--glare-y'));
      const startHyp = parseNum(s.getPropertyValue('--hyp'));
      const startGlareOpacity = parseNum(s.getPropertyValue('--glare-opacity'));

      const duration = 800;
      const startTime = performance.now();
      const lerp = (from, to, t) => from + (to - from) * t;

      const animate = (now) => {
        if (isHovered.value) return;
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic, matches CSS ease-out

        s.setProperty('--pointer-x', `${lerp(startPointerX, 50, eased)}%`);
        s.setProperty('--pointer-y', `${lerp(startPointerY, 50, eased)}%`);
        s.setProperty('--background-x', `${lerp(startBgX, 50, eased)}%`);
        s.setProperty('--background-y', `${lerp(startBgY, 50, eased)}%`);
        s.setProperty('--glare-x', `${lerp(startGlareX, 50, eased)}%`);
        s.setProperty('--glare-y', `${lerp(startGlareY, 50, eased)}%`);
        s.setProperty('--hyp', lerp(startHyp, 0, eased));
        s.setProperty('--glare-opacity', lerp(startGlareOpacity, 0, eased));

        if (t < 1) requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    };

    const setExpandedInstantly = async () => {
      if (!cardRef.value) return;
      const rect = cardRef.value.getBoundingClientRect();
      const scale = Math.min(
        (window.innerWidth * 0.9) / rect.width,
        (window.innerHeight * 0.9) / rect.height
      );

      displayZoom.value = scale;
      expandScale.value = 1;
      isExpanded.value = true;
      isHovered.value = false;
      isSpinning.value = false;
      isCollapsing.value = false;

      await nextTick();
      if (cardRef.value) {
        cardRef.value.style.setProperty('--expand-offset-x', '0px');
        cardRef.value.style.setProperty('--expand-offset-y', '0px');
        cardRef.value.style.setProperty('--expand-start-scale', '1');
      }
    };

    const expandCard = async () => {
      if (!cardRef.value) return;
      const rect = cardRef.value.getBoundingClientRect();
      const scale = Math.min(
        (window.innerWidth * 0.9) / rect.width,
        (window.innerHeight * 0.9) / rect.height
      );
      const deltaX = (rect.left + rect.width / 2) - window.innerWidth / 2;
      const deltaY = (rect.top + rect.height / 2) - window.innerHeight / 2;

      displayZoom.value = scale;
      expandScale.value = 1;
      isExpanded.value = true;
      isHovered.value = false;

      await nextTick();
      if (cardRef.value) {
        cardRef.value.style.setProperty('--expand-offset-x', `${deltaX / scale}px`);
        cardRef.value.style.setProperty('--expand-offset-y', `${deltaY / scale}px`);
        cardRef.value.style.setProperty('--expand-start-scale', `${1 / scale}`);
      }
      void cardRef.value?.offsetHeight;
      isSpinning.value = true;
      spinTimeout = setTimeout(() => { isSpinning.value = false; }, 1000);
    };

    const collapseCard = () => {
      clearTimeout(spinTimeout);
      if (props.forceExpanded) {
        isSpinning.value = false;
        isCollapsing.value = false;
        isExpanded.value = false;
        displayZoom.value = 1;
        emit('collapse');
        return;
      }

      isSpinning.value = false;
      isCollapsing.value = true;
      setTimeout(() => {
        isCollapsing.value = false;
        isExpanded.value = false;
        displayZoom.value = 1;
        emit('collapse');
      }, 1000);
    };

    const handleClick = () => {
      if (isExpanded.value) collapseCard();
      else expandCard();
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isExpanded.value) collapseCard();
    };

    const handleTouchStart = (e) => {
      if (!isMobile.value) return;
      const touch = e.touches[0];
      updateCardEffects(touch.clientX, touch.clientY);
      isHovered.value = true;
    };

    const handleTouchMove = (e) => {
      if (!isMobile.value) return;
      const touch = e.touches[0];
      updateCardEffects(touch.clientX, touch.clientY);
    };

    const handleTouchEnd = () => {
      if (!isMobile.value) return;
      setTimeout(() => {
        isHovered.value = false;
        setTimeout(() => {
          const s = cardRef.value?.style;
          if (s) {
            s.setProperty('--pointer-x', '50%');
            s.setProperty('--pointer-y', '50%');
            s.setProperty('--background-x', '50%');
            s.setProperty('--background-y', '50%');
            s.setProperty('--rotate-x', '0deg');
            s.setProperty('--rotate-y', '0deg');
            s.setProperty('--hyp', '0');
            s.setProperty('--glare-x', '50%');
            s.setProperty('--glare-y', '50%');
            s.setProperty('--glare-opacity', '0');
          }
        }, 100);
      }, 300);
    };

    onMounted(() => {
      const isMobileDevice =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0;

      isMobile.value = isMobileDevice;
      const card = cardRef.value;

      if (card) {
        if (isMobileDevice) {
          card.addEventListener('touchstart', handleTouchStart, { passive: true });
          card.addEventListener('touchmove', handleTouchMove, { passive: true });
          card.addEventListener('touchend', handleTouchEnd, { passive: true });
        } else {
          card.addEventListener('mousemove', handleMouseMove);
          card.addEventListener('mouseenter', handleMouseEnter);
          card.addEventListener('mouseleave', handleMouseLeave);
        }
        isInitialized.value = true;
      }
      window.addEventListener('keydown', handleKeyDown);
      isMounted.value = true;
      if (props.forceExpanded) {
        nextTick(() => setExpandedInstantly());
      }
    });

    onUnmounted(() => {
      const card = cardRef.value;
      if (card) {
        if (isMobile.value) {
          card.removeEventListener('touchstart', handleTouchStart);
          card.removeEventListener('touchmove', handleTouchMove);
          card.removeEventListener('touchend', handleTouchEnd);
        } else {
          card.removeEventListener('mousemove', handleMouseMove);
          card.removeEventListener('mouseenter', handleMouseEnter);
          card.removeEventListener('mouseleave', handleMouseLeave);
        }
      }
      window.removeEventListener('keydown', handleKeyDown);
    });

    const cardStyle = computed(() => ({
      ...(typeof props.style === 'object' ? props.style : {}),
      '--pointer-x': '50%',
      '--pointer-y': '50%',
      '--background-x': '50%',
      '--background-y': '50%',
      '--card-opacity': (isHovered.value || isExpanded.value) ? 1 : 0,
      '--hyp': 0,
      '--rotate-x': '0deg',
      '--rotate-y': '0deg',
      '--scale-factor': 1,
      '--glare-x': '50%',
      '--glare-y': '50%',
      '--glare-opacity': 0,
      '--expand-scale': expandScale.value,
      '--display-zoom': displayZoom.value,
    }));

    return { cardRef, isHovered, isInitialized, isExpanded, isSpinning, isCollapsing, isMounted, cardStyle, handleClick, collapseCard };
  }
};
</script>
