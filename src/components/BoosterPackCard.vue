<template>
  <Teleport to="body" :disabled="!isExpanded">
    <div
      v-if="!hasOpened"
      class="pack-scene"
      :class="{ expanded: isExpanded, 'is-shaking': isShakingCSS, 'is-revealing-pokemon': packOpen, 'is-expanding': isExpanding, 'is-collapsing': isCollapsing }"
      ref="containerRef"
    >
      <!-- THREE.js canvas -->
      <canvas
        ref="canvasRef"
        :style="{ opacity: canvasOpacity, transition: 'opacity 0.35s ease' }"
      ></canvas>

      <!-- Opening energy burst -->
      <div class="open-flash" :class="{ 'open-flash--active': flashActive }"></div>
      <div class="open-burst-ring" :class="{ 'open-burst-ring--active': flashActive }"></div>

      <!-- Star particles burst -->
      <div class="particles-layer" aria-hidden="true">
        <span
          v-for="p in activeParticles"
          :key="p.id"
          class="star-particle"
          :style="p.style"
        >{{ p.char }}</span>
      </div>

      <!-- "Click to open" hint -->
      <transition name="hint-fade">
        <div v-if="isExpanded && !packOpen && !isOpening" class="open-hint">
          <span class="hint-shimmer">✦</span>
          click to open
        </div>
      </transition>

      <button v-if="isExpanded && !packOpen" class="close-btn" @click.stop="collapse">&times;</button>
    </div>
  </Teleport>

  <!-- Backdrop -->
  <Teleport v-if="isMounted" to="body">
    <Transition name="pack-backdrop">
      <div v-if="isExpanded && !packOpen && !isCollapsing" class="pack-backdrop" @click.stop="collapse" />
    </Transition>
  </Teleport>

  <!-- PokemonCard: force-expanded during reveal, normal after -->
  <PokemonCard
    v-if="packOpen || hasOpened"
    :force-expanded="packOpen && !hasOpened"
    @collapse="onPokemonCollapse"
  />
</template>

<script>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import PokemonCard from './PokemonCard.vue';

export default {
  inheritAttrs: false,
  components: { PokemonCard },
  props: {
    title:         String,
    content:       String,
    className:     String,
    style:         [String, Object],
    componentName: String,
    position:      Object,
  },
  setup() {
    // ── Reactive state ────────────────────────────────────────────────────────
    const containerRef    = ref(null);
    const canvasRef       = ref(null);
    const isExpanded      = ref(false);
    const isExpanding     = ref(false);
    const isCollapsing    = ref(false);
    const isMounted       = ref(false);
    const packOpen        = ref(false);
    const isOpening       = ref(false);
    const isShakingCSS    = ref(false);
    const flashActive     = ref(false);
    const canvasOpacity   = ref(1);
    const activeParticles = ref([]);
    const hasOpened       = ref(false);

    // ── THREE.js internal vars ────────────────────────────────────────────────
    const BASE_ROT_X = 90, BASE_ROT_Y = 90, BASE_ROT_Z = 0;
    const deg = (d) => d * (Math.PI / 180);

    let renderer, scene, camera, animFrameId;
    let model = null;
    let modelScale = 1;

    let targetRotX = 0, targetRotY = 0;
    let currentRotX = 0, currentRotY = 0;
    let isShaking3D = false;
    let shakeStartTime = 0;

    // ── Init THREE ────────────────────────────────────────────────────────────
    const COLLAPSED_CANVAS_BLEED = 24;
    const COLLAPSED_MODEL_FIT = 0.82;
    const EXPANDED_MODEL_FIT = 0.92;

    const getCanvasBleed = () => (isExpanded.value ? 0 : COLLAPSED_CANVAS_BLEED);
    const getModelFit = () => (isExpanded.value ? EXPANDED_MODEL_FIT : COLLAPSED_MODEL_FIT);

    const getRendererDimensions = () => {
      const c = containerRef.value;
      if (!c) return { width: 0, height: 0 };
      const b = getCanvasBleed() * 2;
      return { width: c.offsetWidth + b, height: c.offsetHeight + b };
    };

    const updateModelLayout = () => {
      if (!model || !camera) return;

      model.rotation.set(deg(BASE_ROT_X), deg(BASE_ROT_Y), deg(BASE_ROT_Z));
      model.position.set(0, 0, 0);
      model.scale.setScalar(1);
      model.updateMatrixWorld(true);

      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const fovRad = camera.fov * (Math.PI / 180);
      const frustumHeight = 2 * Math.tan(fovRad / 2) * camera.position.z;
      const frustumWidth = frustumHeight * camera.aspect;
      const fit = getModelFit();
      const scale = Math.min(
        (frustumHeight * fit) / size.y,
        (frustumWidth * fit) / size.x
      );

      modelScale = scale;
      model.scale.setScalar(scale);
      model.position.copy(center).multiplyScalar(-scale);
    };

    const init = () => {
      const canvas = canvasRef.value;
      const { width, height } = getRendererDimensions();

      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping      = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.4;
      renderer.shadowMap.enabled   = true;

      scene = new THREE.Scene();

      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      pmrem.dispose();

      camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
      camera.position.z = 4.5;

      scene.add(new THREE.AmbientLight(0xffffff, 0.6));
      const key = new THREE.DirectionalLight(0xffffff, 3.0);
      key.position.set(2, 4, 5);
      scene.add(key);
      const fill = new THREE.DirectionalLight(0x8899ff, 1.0);
      fill.position.set(-4, 1, 2);
      scene.add(fill);
      const rim = new THREE.DirectionalLight(0xffffff, 0.8);
      rim.position.set(0, -3, -4);
      scene.add(rim);

      const loader = new GLTFLoader();
      loader.load('/assets/trading_card_pack.glb', (gltf) => {
        model = gltf.scene;
        scene.add(model);
        updateModelLayout();
      });

      const animate = (time) => {
        animFrameId = requestAnimationFrame(animate);

        if (isShaking3D) {
          const t = (time - shakeStartTime) / 600;
          if (t < 1) {
            const shake = Math.sin(t * Math.PI * 6) * 0.14 * (1 - t);
            if (model) model.rotation.y = deg(BASE_ROT_Y) + currentRotY + shake;
          } else {
            isShaking3D = false;
          }
        } else {
          currentRotX += (targetRotX - currentRotX) * 0.07;
          currentRotY += (targetRotY - currentRotY) * 0.07;
          if (model) {
            model.rotation.x = deg(BASE_ROT_X) + currentRotX;
            model.rotation.y = deg(BASE_ROT_Y) + currentRotY;
            model.rotation.z = deg(BASE_ROT_Z);
          }
        }

        renderer.render(scene, camera);
      };
      animate(0);
    };

    // ── Mouse tilt ────────────────────────────────────────────────────────────
    const handleMouseMove = (e) => {
      if (packOpen.value || isOpening.value) return;
      const rect  = containerRef.value.getBoundingClientRect();
      const xNorm = (e.clientX - rect.left) / rect.width  - 0.5;
      const yNorm = (e.clientY - rect.top)  / rect.height - 0.5;
      targetRotY = xNorm * deg(20);
      targetRotX = yNorm * -deg(20);
    };

    const handleMouseLeave = () => {
      targetRotX = 0;
      targetRotY = 0;
    };

    // ── Particles ─────────────────────────────────────────────────────────────
    const PARTICLE_CHARS  = ['✦', '★', '✸', '·', '✦', '✦', '★'];
    const PARTICLE_COLORS = ['#ffcb05', '#ffffff', '#80e0ff', '#ff80aa', '#a0ff80', '#c0a0ff', '#ffaa44'];

    function spawnParticles() {
      const count = 48;
      const particles = [];

      for (let i = 0; i < count; i++) {
        const angle  = Math.random() * Math.PI * 2;
        const dist   = 90 + Math.random() * 280;
        const tx     = Math.cos(angle) * dist;
        const ty     = Math.sin(angle) * dist;
        const size   = 10 + Math.random() * 16;
        const color  = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
        const delay  = (Math.random() * 0.25).toFixed(3);
        const dur    = (0.55 + Math.random() * 0.45).toFixed(3);
        const char   = PARTICLE_CHARS[Math.floor(Math.random() * PARTICLE_CHARS.length)];

        particles.push({
          id: i,
          char,
          style: {
            '--tx':    `${tx}px`,
            '--ty':    `${ty}px`,
            color,
            fontSize:  `${size}px`,
            animationDuration:  `${dur}s`,
            animationDelay:     `${delay}s`,
          },
        });
      }

      activeParticles.value = particles;
      setTimeout(() => { activeParticles.value = []; }, 1400);
    }

    // ── Open sequence ─────────────────────────────────────────────────────────
    const openPack = () => {
      if (packOpen.value || isOpening.value || !model) return;
      isOpening.value = true;

      // 1. Shake (CSS + 3D model)
      isShakingCSS.value = true;
      isShaking3D        = true;
      shakeStartTime     = performance.now();
      setTimeout(() => { isShakingCSS.value = false; }, 650);

      // 2. Flash + particles + fade canvas
      setTimeout(() => {
        flashActive.value = true;
        spawnParticles();
        canvasOpacity.value = 0;
        setTimeout(() => { flashActive.value = false; }, 320);
      }, 480);

      // 3. Reveal PokemonCard — drop pack overlay z-index so card appears on top
      setTimeout(() => {
        packOpen.value = true;
        // Collapse the pack overlay after PokemonCard has expanded
        setTimeout(() => {
          isExpanded.value = false;
        }, 450);
      }, 780);

      setTimeout(() => { isOpening.value = false; }, 2000);
    };

    const onPokemonCollapse = () => {
      hasOpened.value  = true;
      packOpen.value   = false;
      isExpanded.value = false;
    };

    // ── Resize ────────────────────────────────────────────────────────────────
    const handleResize = () => {
      if (!containerRef.value || !renderer) return;
      const { width, height } = getRendererDimensions();
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      updateModelLayout();
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isExpanded.value) collapse();
    };

    // ── Expand / collapse ─────────────────────────────────────────────────────
    const expand = (e) => {
      if (!containerRef.value) return;
      const rect = containerRef.value.getBoundingClientRect();
      const expandedSize = Math.min(window.innerWidth * 0.9, window.innerHeight * 0.9);
      const startScale = rect.width / expandedSize;
      const deltaX = (rect.left + rect.width / 2) - window.innerWidth / 2;
      const deltaY = (rect.top + rect.height / 2) - window.innerHeight / 2;

      const el = containerRef.value;
      el.style.setProperty('--expand-offset-x', `${deltaX}px`);
      el.style.setProperty('--expand-offset-y', `${deltaY}px`);
      el.style.setProperty('--expand-start-scale', `${startScale}`);
      el.style.setProperty('--expand-size', `${expandedSize}px`);

      isExpanded.value  = true;
      isExpanding.value = true;
      isShaking3D       = true;
      shakeStartTime    = e.timeStamp;

      nextTick(() => {
        handleResize();
        setTimeout(() => { isExpanding.value = false; }, 600);
      });
    };

    const collapse = () => {
      if (isCollapsing.value) return;
      isCollapsing.value = true;
      isShaking3D        = false;
      isShakingCSS.value = false;
      targetRotX = 0;
      targetRotY = 0;

      setTimeout(() => {
        isCollapsing.value    = false;
        isExpanded.value      = false;
        packOpen.value        = false;
        isOpening.value       = false;
        flashActive.value     = false;
        canvasOpacity.value   = 1;
        activeParticles.value = [];
        if (model) {
          model.visible = true;
          model.scale.setScalar(modelScale);
        }
        nextTick(() => handleResize());
      }, 500);
    };

    const handleClick = (e) => {
      if (!isExpanded.value) { expand(e); return; }
      if (!packOpen.value && !isOpening.value) openPack();
    };

    // ── Lifecycle ─────────────────────────────────────────────────────────────
    onMounted(() => {
      isMounted.value = true;
      init();
      const el = containerRef.value;
      el.addEventListener('mousemove',  handleMouseMove);
      el.addEventListener('mouseleave', handleMouseLeave);
      el.addEventListener('click',      handleClick);
      window.addEventListener('resize',  handleResize);
      window.addEventListener('keydown', handleKeyDown);
    });

    onUnmounted(() => {
      cancelAnimationFrame(animFrameId);
      renderer?.dispose();
      const el = containerRef.value;
      el?.removeEventListener('mousemove',  handleMouseMove);
      el?.removeEventListener('mouseleave', handleMouseLeave);
      el?.removeEventListener('click',      handleClick);
      window.removeEventListener('resize',  handleResize);
      window.removeEventListener('keydown', handleKeyDown);
    });

    return {
      containerRef, canvasRef,
      isExpanded, isExpanding, isCollapsing, isMounted,
      packOpen, isOpening, isShakingCSS,
      flashActive, canvasOpacity, activeParticles,
      hasOpened, collapse, onPokemonCollapse,
    };
  },
};
</script>

<style scoped>
/* ── Scene wrapper ──────────────────────────────────────────────────────────── */
.pack-scene {
  --pack-canvas-bleed: 24px;
  position: relative;
  width: 100%;
  height: calc(433px - 1.5rem);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: none;
  overflow: visible;
}

.pack-scene.expanded {
  --pack-canvas-bleed: 0px;
  position: fixed;
  top: 50%;
  left: 50%;
  width: var(--expand-size, min(90vw, 90vh));
  height: var(--expand-size, min(90vw, 90vh));
  transform: translate(-50%, -50%);
  z-index: 9999;
  cursor: default;
  border-radius: 16px;
  overflow: hidden;
}

.pack-scene.expanded.is-expanding {
  animation: pack-expand-in 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.pack-scene.expanded.is-collapsing {
  animation: pack-collapse-out 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  pointer-events: none;
}

@keyframes pack-expand-in {
  from {
    transform: translate(calc(-50% + var(--expand-offset-x, 0px)), calc(-50% + var(--expand-offset-y, 0px))) scale(var(--expand-start-scale, 1));
    opacity: 0.5;
  }
  to {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
}

@keyframes pack-collapse-out {
  from {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  to {
    transform: translate(calc(-50% + var(--expand-offset-x, 0px)), calc(-50% + var(--expand-offset-y, 0px))) scale(var(--expand-start-scale, 1));
    opacity: 0;
  }
}

.pack-backdrop {
  position: fixed;
  inset: 0;
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  z-index: 9998;
  cursor: zoom-out;
}

.pack-backdrop-enter-active,
.pack-backdrop-leave-active {
  transition: backdrop-filter 0.7s ease, -webkit-backdrop-filter 0.7s ease;
  pointer-events: none;
}

.pack-backdrop-enter-from,
.pack-backdrop-leave-to {
  backdrop-filter: blur(0px);
  -webkit-backdrop-filter: blur(0px);
}

.pack-scene.expanded.is-revealing-pokemon {
  z-index: 10001;
  pointer-events: none;
}

canvas {
  display: block;
  position: absolute;
  inset: calc(var(--pack-canvas-bleed) * -1);
  width: calc(100% + (var(--pack-canvas-bleed) * 2)) !important;
  height: calc(100% + (var(--pack-canvas-bleed) * 2)) !important;
}

.pack-scene.expanded canvas {
  inset: 0;
  width: 100% !important;
  height: 100% !important;
}

/* ── Screen shake ───────────────────────────────────────────────────────────── */
@keyframes screen-shake {
  0%,  100% { transform: translate(-50%, -50%) translate(0, 0) rotate(0deg); }
  10%        { transform: translate(-50%, -50%) translate(-7px, -4px) rotate(-0.6deg); }
  20%        { transform: translate(-50%, -50%) translate(7px, 4px) rotate(0.6deg); }
  30%        { transform: translate(-50%, -50%) translate(-6px, 5px) rotate(-0.4deg); }
  40%        { transform: translate(-50%, -50%) translate(6px, -5px) rotate(0.4deg); }
  50%        { transform: translate(-50%, -50%) translate(-4px, 3px) rotate(-0.2deg); }
  60%        { transform: translate(-50%, -50%) translate(4px, -3px) rotate(0.2deg); }
  75%        { transform: translate(-50%, -50%) translate(-2px, 1px) rotate(-0.1deg); }
  88%        { transform: translate(-50%, -50%) translate(2px, -1px) rotate(0.1deg); }
}

.pack-scene.expanded.is-shaking {
  animation: screen-shake 0.65s ease-out forwards;
}

/* ── Flash overlay ──────────────────────────────────────────────────────────── */
.open-flash {
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
  z-index: 200;
  border-radius: inherit;
  background:
    radial-gradient(circle at 50% 50%,
      rgba(255, 252, 214, 0.95) 0%,
      rgba(255, 225, 120, 0.78) 14%,
      rgba(132, 224, 255, 0.34) 32%,
      rgba(255, 255, 255, 0.12) 46%,
      rgba(255, 255, 255, 0) 68%
    );
  mix-blend-mode: screen;
  filter: blur(8px) saturate(1.1);
  transform: scale(0.78);
  transition: opacity 0.08s ease;
}
.open-flash--active {
  animation: flash-burst 0.46s cubic-bezier(0.2, 0.7, 0.2, 1) forwards;
}

.open-burst-ring {
  position: absolute;
  inset: 18%;
  border-radius: 999px;
  border: 2px solid rgba(255, 241, 178, 0.85);
  box-shadow:
    0 0 24px rgba(255, 226, 122, 0.55),
    inset 0 0 24px rgba(255, 255, 255, 0.18);
  opacity: 0;
  pointer-events: none;
  z-index: 190;
  transform: scale(0.45);
}

.open-burst-ring--active {
  animation: burst-ring 0.52s cubic-bezier(0.12, 0.7, 0.2, 1) forwards;
}
@keyframes flash-burst {
  0% {
    opacity: 0;
    transform: scale(0.78);
  }
  30% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1.22);
  }
}

@keyframes burst-ring {
  0% {
    opacity: 0;
    transform: scale(0.45);
  }
  22% {
    opacity: 0.9;
  }
  100% {
    opacity: 0;
    transform: scale(1.4);
  }
}

/* ── Particles ──────────────────────────────────────────────────────────────── */
.particles-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 150;
  display: flex;
  align-items: center;
  justify-content: center;
}

.star-particle {
  position: absolute;
  line-height: 1;
  animation: particle-shoot linear forwards;
  will-change: transform, opacity;
  text-shadow:
    0 0 10px currentColor,
    0 0 22px currentColor;
  filter: saturate(1.15);
}

@keyframes particle-shoot {
  from {
    transform: translate(-50%, -50%) translate(0, 0) scale(0.45) rotate(0deg);
    opacity: 1;
  }
  30% {
    transform: translate(-50%, -50%) translate(calc(var(--tx) * 0.28), calc(var(--ty) * 0.28)) scale(1.08) rotate(90deg);
    opacity: 1;
  }
  80% { opacity: 0.7; }
  to {
    transform: translate(-50%, -50%) translate(var(--tx), var(--ty)) scale(0.12) rotate(200deg);
    opacity: 0;
  }
}

/* ── "Click to open" hint ───────────────────────────────────────────────────── */
.open-hint {
  position: absolute;
  bottom: 14%;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.72);
  font-size: 13px;
  letter-spacing: 2px;
  text-transform: uppercase;
  pointer-events: none;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  z-index: 100;
}

.hint-shimmer {
  display: inline-block;
  color: #ffcb05;
  animation: shimmer-pulse 1.8s ease-in-out infinite;
  font-size: 15px;
  filter: drop-shadow(0 0 6px #ffcb0588);
}

@keyframes shimmer-pulse {
  0%, 100% { opacity: 0.6; transform: scale(1);    }
  50%       { opacity: 1;   transform: scale(1.25); }
}

.hint-fade-enter-active,
.hint-fade-leave-active { transition: opacity 0.3s; }
.hint-fade-enter-from,
.hint-fade-leave-to     { opacity: 0; }

/* ── Close button ───────────────────────────────────────────────────────────── */
.close-btn {
  position: absolute;
  top: 20px;
  right: 24px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #fff;
  font-size: 18px;
  line-height: 1;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  z-index: 10000;
}
.close-btn:hover {
  background: rgba(255, 255, 255, 0.25);
}
</style>
