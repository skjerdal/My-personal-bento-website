<template>
  <div class="cardholder-scene" ref="containerRef">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';

const VS = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FS = `
  precision mediump float;
  uniform sampler2D u_diffuse;
  uniform sampler2D u_normal;
  uniform vec2 u_light;
  varying vec2 vUv;

  void main() {
    vec4 diffuse = texture2D(u_diffuse, vUv);
    vec3 n = normalize(texture2D(u_normal, vUv).rgb * 2.0 - 1.0);

    vec3 lightDir = normalize(vec3(u_light, 1.0));
    float diff = max(dot(n, lightDir), 0.0);

    vec3 halfDir = normalize(lightDir + vec3(0.0, 0.0, 1.0));
    float spec = pow(max(dot(n, halfDir), 0.0), 64.0);

    float ambient = 0.88;
    vec3 color = diffuse.rgb * (ambient + diff * 0.22) + spec * 0.25;

    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
  }
`;

export default {
  name: 'CardHolderCard',
  inheritAttrs: false,
  props: {
    title:         String,
    content:       String,
    className:     String,
    style:         [String, Object],
    componentName: String,
    position:      Object,
  },
  setup() {
    const containerRef = ref(null);
    const canvasRef    = ref(null);

    let renderer, scene, camera, mesh, animId;
    let lightUniform = null;

    let targetRotX = 0, targetRotY = 0;
    let currentRotX = 0, currentRotY = 0;
    let targetLX = 0, targetLY = 0;
    let currentLX = 0, currentLY = 0;

    const init = async () => {
      const canvas    = canvasRef.value;
      const container = containerRef.value;
      const w = container.offsetWidth  || 300;
      const h = container.offsetHeight || 240;

      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      scene = new THREE.Scene();

      // Orthographic camera — plane exactly fills the view
      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
      camera.position.z = 1;

      const loader = new THREE.TextureLoader();
      const [diffuseTex, normalTex] = await Promise.all([
        loader.loadAsync('/cardholder.png'),
        loader.loadAsync('/card_holder_nmap.png'),
      ]);

      const lightVec = new THREE.Vector2(0, 0);
      lightUniform = lightVec;

      const material = new THREE.ShaderMaterial({
        uniforms: {
          u_diffuse: { value: diffuseTex },
          u_normal:  { value: normalTex },
          u_light:   { value: lightVec },
        },
        vertexShader:   VS,
        fragmentShader: FS,
      });

      const geometry = new THREE.PlaneGeometry(2, 2);
      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      tick();
    };

    const syncSize = () => {
      if (!renderer || !containerRef.value) return;
      const w = containerRef.value.offsetWidth;
      const h = containerRef.value.offsetHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
    };

    const tick = () => {
      animId = requestAnimationFrame(tick);

      const k = 0.08;
      currentRotX += (targetRotX - currentRotX) * k;
      currentRotY += (targetRotY - currentRotY) * k;
      currentLX   += (targetLX   - currentLX)   * k;
      currentLY   += (targetLY   - currentLY)   * k;

      const el = containerRef.value;
      if (el) {
        el.style.transform =
          `perspective(900px) rotateX(${currentRotX}deg) rotateY(${currentRotY}deg)`;
      }

      if (lightUniform) {
        lightUniform.set(currentLX, currentLY);
      }

      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    };

    const onMove = (e) => {
      const rect = containerRef.value.getBoundingClientRect();
      const x =  (e.clientX - rect.left) / rect.width  - 0.5;
      const y =  (e.clientY - rect.top)  / rect.height - 0.5;
      targetRotY =  x * 8;
      targetRotX = -y * 8;
      targetLX   =  x * 1.6;
      targetLY   = -y * 1.6;
    };

    const onLeave = () => {
      targetRotX = 0; targetRotY = 0;
      targetLX   = 0; targetLY   = 0;
    };

    onMounted(() => {
      init();
      const el = containerRef.value;
      el.addEventListener('mousemove',  onMove);
      el.addEventListener('mouseleave', onLeave);
      window.addEventListener('resize', syncSize);
    });

    onUnmounted(() => {
      cancelAnimationFrame(animId);
      renderer?.dispose();
      const el = containerRef.value;
      el?.removeEventListener('mousemove',  onMove);
      el?.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', syncSize);
    });

    return { containerRef, canvasRef };
  },
};
</script>

<style scoped>
.cardholder-scene {
  width: 100%;
  height: 100%;
  min-height: 240px;
  position: relative;
  will-change: transform;
  border-radius: 10px;
  overflow: hidden;
  cursor: default;
}

.cardholder-scene canvas {
  display: block;
  width: 100% !important;
  height: 100% !important;
}
</style>
