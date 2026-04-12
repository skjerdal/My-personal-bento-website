<template>
  <div
    ref="cardRef"
    :class="`pokemon-card ${className || ''} ${isHovered ? 'hovered' : ''} ${isInitialized ? 'initialized' : ''}`"
    :style="cardStyle"
  >
    <div class="card-inner">
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
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import './component-style/PokemonCard.scss';

export default {
  props: {
    title: String,
    content: String,
    className: String,
    style: [String, Object],
    componentName: String,
    position: Object,
  },
  setup(props) {
    const cardRef = ref(null);
    const isHovered = ref(false);
    const isInitialized = ref(false);
    const isMobile = ref(false);

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
      s.setProperty('--rotate-x', `${rotateX}deg`);
      s.setProperty('--rotate-y', `${rotateY}deg`);
      s.setProperty('--hyp', distance);
      s.setProperty('--glare-x', `${glareX}%`);
      s.setProperty('--glare-y', `${glareY}%`);
      s.setProperty('--glare-opacity', glareOpacity);
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
      setTimeout(() => {
        const s = cardRef.value?.style;
        if (s && !isHovered.value) {
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
    });

    const cardStyle = computed(() => ({
      ...(typeof props.style === 'object' ? props.style : {}),
      '--pointer-x': '50%',
      '--pointer-y': '50%',
      '--background-x': '50%',
      '--background-y': '50%',
      '--card-opacity': isHovered.value ? 1 : 0,
      '--hyp': 0,
      '--rotate-x': '0deg',
      '--rotate-y': '0deg',
      '--scale-factor': 1,
      '--glare-x': '50%',
      '--glare-y': '50%',
      '--glare-opacity': 0,
    }));

    return { cardRef, isHovered, isInitialized, cardStyle };
  }
};
</script>
