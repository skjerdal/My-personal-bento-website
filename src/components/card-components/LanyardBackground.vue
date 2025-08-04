<template>
  <div ref="threeContainer" class="three-container"></div>
</template>

<script>
import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default {
  name: 'LanyardBackground',
  mounted() {
    this.initThreeJS();
  },
  beforeUnmount() {
    this.cleanup();
  },
  methods: {
    initThreeJS() {
      const container = this.$refs.threeContainer;
      if (!container) return;

      // Scene setup
      this.scene = new THREE.Scene();

      // Camera
      this.camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
      );
      this.camera.position.set(1.5, 0, 5);

      // Renderer
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.8;
      container.appendChild(this.renderer.domElement);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      this.scene.add(ambientLight);
      const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.5);
      dirLight1.position.set(5, 5, 5);
      this.scene.add(dirLight1);
      const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
      dirLight2.position.set(-5, -5, -5);
      this.scene.add(dirLight2);

      // HDR environment
      new RGBELoader().load('/assets/beach.hdr', (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        this.scene.environment = texture;
        this.scene.background = null;
      });

      // Load model & start
      this.loadModel();
      this.animate();
      window.addEventListener('resize', this.onWindowResize);
    },

    loadModel() {
      const loader = new GLTFLoader();
      loader.load(
        '/assets/kort.glb',
        (gltf) => {
          this.model = gltf.scene;

          // Center and scale
          const box = new THREE.Box3().setFromObject(this.model);
          const center = box.getCenter(new THREE.Vector3());
          this.model.position.copy(center).multiplyScalar(-1);
          const size = box.getSize(new THREE.Vector3()).length();
          const scaleFactor = 3 / size;
          this.model.scale.setScalar(scaleFactor);

          this.scene.add(this.model);
          this.createFloatingObjects();
          this.camera.position.set(0, 0, 5);
          this.camera.lookAt(0, 0, 0);
          this.startBounce();
        },
        undefined,
        (e) => console.error('Error loading kort.glb', e)
      );
    },

    createFloatingObjects() {
      this.floating = [];
      const geometries = [
        new THREE.IcosahedronGeometry(0.25, 0),
        new THREE.TorusKnotGeometry(0.17, 0.05, 64, 8),
        new THREE.OctahedronGeometry(0.22),
        new THREE.BoxGeometry(0.3, 0.3, 0.3)
      ];
      const palette = [0xff6b6b, 0x6bc5ff, 0xf7d941, 0x9b59b6];
      const radius = 1.8;
      for (let i = 0; i < 8; i++) {
        const mesh = new THREE.Mesh(
          geometries[i % geometries.length],
          new THREE.MeshStandardMaterial({ color: palette[i % palette.length], roughness: 0.4, metalness: 0.3, emissive: 0x111111, emissiveIntensity: 0.2 })
        );
        const angle = (i / 8) * Math.PI * 2;
        mesh.position.set(Math.cos(angle) * radius, Math.sin(angle) * 0.5, Math.sin(angle) * radius);
        mesh.userData = { angle, speed: 0.3 + Math.random() * 0.4, radius, amp: 0.4 + Math.random() * 0.3 };
        this.scene.add(mesh);
        this.floating.push(mesh);
      }
    },

    startBounce() {
      if (!this.model) return;
      const bounceHeight = 1.5;
      const targetY = this.model.position.y;
      setTimeout(() => {
        this.model.position.y = targetY + bounceHeight;
        this.bounce = { start: Date.now(), duration: 2000, startY: targetY + bounceHeight, endY: targetY };
      }, 500);
    },

    animate() {
      if (!this.renderer) return;
      requestAnimationFrame(this.animate);
      const t = Date.now() * 0.001;

      // bounce
      if (this.bounce && this.model) {
        const elapsed = Date.now() - this.bounce.start;
        const p = Math.min(elapsed / this.bounce.duration, 1);
        const ease = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
        this.model.position.y = this.bounce.startY + (this.bounce.endY - this.bounce.startY) * ease(p);
        if (p >= 1) this.bounce = null;
      }
      if (!this.bounce && this.model) {
        const sway = 0.1;
        this.model.rotation.y = Math.sin(t * 0.7) * sway * 1.5;
        this.model.rotation.z = Math.sin(t * 1.2) * sway;
        this.model.rotation.x = Math.sin(t * 0.8) * sway * 0.5;
      }

      if (this.floating) {
        this.floating.forEach((o) => {
          const { angle, speed, radius, amp } = o.userData;
          const tt = t * speed + angle;
          o.position.x = Math.cos(tt) * radius;
          o.position.z = Math.sin(tt) * radius;
          o.position.y = Math.sin(t * speed * 2 + angle) * amp;
          o.rotation.x += 0.01;
          o.rotation.y += 0.015;
        });
      }

      this.renderer.render(this.scene, this.camera);
    },

    onWindowResize() {
      if (!this.camera || !this.renderer || !this.$refs.threeContainer) return;
      const w = this.$refs.threeContainer.clientWidth;
      const h = this.$refs.threeContainer.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    },

    cleanup() {
      if (this.renderer) {
        this.renderer.dispose();
        if (this.$refs.threeContainer && this.renderer.domElement) {
          this.$refs.threeContainer.removeChild(this.renderer.domElement);
        }
      }
      window.removeEventListener('resize', this.onWindowResize);
      if (this.scene) {
        this.scene.traverse((child) => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            (Array.isArray(child.material) ? child.material : [child.material]).forEach((m) => {
              if (m.map) m.map.dispose();
              m.dispose();
            });
          }
        });
      }
    }
  }
};
</script>

<style scoped>
.three-container {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}
.three-container canvas {
  width: 100% !important;
  height: 100% !important;
}
</style> 