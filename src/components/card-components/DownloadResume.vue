<template>
  <div class="download-resume">
    <!-- Three.js 3D Background -->
    <!-- <div ref="threeContainer" class="three-container"></div> -->
    
    <!-- Content Overlay -->
    <div class="content-wrapper">
      <h2 class="section-title">Resume</h2>
      <p class="description">Download my latest resume to learn more about my experience and skills.</p>
      
      <button class="download-button" @click="downloadResume">
        <div class="button-bg"></div>
        <span class="button-text">Download Resume</span>
        <svg class="download-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7,10 12,15 17,10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default {
  name: 'DownloadResume',
  mounted() {
    this.initThreeJS();
  },
  beforeUnmount() {
    this.cleanup();
  },
  methods: {
    downloadResume() {
      // You can replace this with your actual resume file path
      const resumeUrl = '/resume.pdf'; // Place your resume.pdf in the public folder
      
      // Create a temporary link element and trigger download
      const link = document.createElement('a');
      link.href = resumeUrl;
      link.download = 'Thomas_Skjerdal_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

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
      this.camera.position.set(1.5, 0, 5); // Adjusted for a better view of the model

      // Renderer
      this.renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: "high-performance"
      });
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.8; // Slightly increased exposure
      container.appendChild(this.renderer.domElement);

      // Add strong lighting for visibility
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      this.scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
      directionalLight.position.set(5, 5, 5);
      this.scene.add(directionalLight);
      
      const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight2.position.set(-5, -5, -5);
      this.scene.add(directionalLight2);

      // Load HDR environment for reflections
      const rgbeLoader = new RGBELoader();
      rgbeLoader.load('/assets/beach.hdr', (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        this.scene.environment = texture;
        this.scene.background = null; // Keep transparent
      });

      // Load the GLB model
      this.loadLanyardModel();
      
      // Start animation loop
      this.animate();

      // Handle resize
      window.addEventListener('resize', this.onWindowResize);
    },

    loadLanyardModel() {
      const loader = new GLTFLoader();
      loader.load(
        '/assets/kort.glb',
        (gltf) => {
          this.lanyardModel = gltf.scene;
          
          // Center the model at origin
          const box = new THREE.Box3().setFromObject(this.lanyardModel);
          const center = box.getCenter(new THREE.Vector3());
          this.lanyardModel.position.copy(center).multiplyScalar(-1);

          // Scale and position
          const size = box.getSize(new THREE.Vector3()).length();
          const scaleFactor = 3 / size; // try to fit roughly within 3 units
          this.lanyardModel.scale.setScalar(scaleFactor);

          this.scene.add(this.lanyardModel);

          // Add floating objects
          this.createFloatingObjects();

          // Reposition camera to frame the model
          this.camera.position.set(0, 0, 5);
          this.camera.lookAt(0, 0, 0);

          this.startBounceAnimation();
        },
        undefined,
        (error) => {
          console.error('An error happened while loading kort.glb.', error);
        }
      );
    },

    createFloatingObjects() {
      this.floatingObjects = [];
      const geometries = [
        new THREE.IcosahedronGeometry(0.25, 0),
        new THREE.TorusKnotGeometry(0.17, 0.05, 64, 8),
        new THREE.OctahedronGeometry(0.22),
        new THREE.BoxGeometry(0.3, 0.3, 0.3)
      ];
      const palette = [0xff6b6b, 0x6bc5ff, 0xf7d941, 0x9b59b6];
      const orbitRadius = 1.8;
      for (let i = 0; i < 8; i++) {
        const geom = geometries[i % geometries.length];
        const mat = new THREE.MeshStandardMaterial({
          color: palette[i % palette.length],
          roughness: 0.4,
          metalness: 0.3,
          emissive: 0x111111,
          emissiveIntensity: 0.2
        });
        const mesh = new THREE.Mesh(geom, mat);
        const angle = (i / 8) * Math.PI * 2;
        mesh.position.set(Math.cos(angle) * orbitRadius, Math.sin(angle) * 0.5, Math.sin(angle) * orbitRadius);
        mesh.userData = {
          baseAngle: angle,
          speed: 0.3 + Math.random() * 0.4,
          radius: orbitRadius,
          verticalAmplitude: 0.4 + Math.random() * 0.3
        };
        this.scene.add(mesh);
        this.floatingObjects.push(mesh);
      }
    },

    startBounceAnimation() {
      if (!this.lanyardModel) return;

      const bounceHeight = 1.5;
      const bounceDelay = 500;
      const targetY = this.lanyardModel.position.y;
      
      setTimeout(() => {
        this.lanyardModel.position.y = targetY + bounceHeight;
        
        this.bounceAnimation = {
          startTime: Date.now(),
          duration: 2000,
          startY: targetY + bounceHeight,
          endY: targetY
        };
      }, bounceDelay);
    },

    animate() {
      if (!this.renderer) return;
      
      requestAnimationFrame(() => this.animate());
      
      const time = Date.now() * 0.001;
      
      // Handle bounce animation
      if (this.bounceAnimation && this.lanyardModel) {
        const elapsed = Date.now() - this.bounceAnimation.startTime;
        const progress = Math.min(elapsed / this.bounceAnimation.duration, 1);
        
        const easeOutBounce = (t) => {
          if (t < 1 / 2.75) {
            return 7.5625 * t * t;
          } else if (t < 2 / 2.75) {
            return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
          } else if (t < 2.5 / 2.75) {
            return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
          } else {
            return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
          }
        };
        
        const easedProgress = easeOutBounce(progress);
        this.lanyardModel.position.y = this.bounceAnimation.startY + 
          (this.bounceAnimation.endY - this.bounceAnimation.startY) * easedProgress;
        
        if (progress >= 1) {
          this.bounceAnimation = null;
        }
      }
      
      // Gentle swaying animation after bounce
      if (!this.bounceAnimation && this.lanyardModel) {
        const swayIntensity = 0.1;
        this.lanyardModel.rotation.y = Math.sin(time * 0.7) * (swayIntensity * 1.5);
        this.lanyardModel.rotation.z = Math.sin(time * 1.2) * swayIntensity;
        this.lanyardModel.rotation.x = Math.sin(time * 0.8) * swayIntensity * 0.5;
      }

      // Update floating objects
      if (this.floatingObjects) {
        this.floatingObjects.forEach((obj) => {
          const { baseAngle, speed, radius, verticalAmplitude } = obj.userData;
          const t = time * speed + baseAngle;
          obj.position.x = Math.cos(t) * radius;
          obj.position.z = Math.sin(t) * radius;
          obj.position.y = Math.sin(time * speed * 2 + baseAngle) * verticalAmplitude;
          obj.rotation.x += 0.01;
          obj.rotation.y += 0.015;
        });
      }
      
      // Render
      this.renderer.render(this.scene, this.camera);
    },

    onWindowResize() {
      if (!this.camera || !this.renderer || !this.$refs.threeContainer) return;
      
      const container = this.$refs.threeContainer;
      const width = container.clientWidth;
      const height = container.clientHeight;
      
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    },

    cleanup() {
      if (this.renderer) {
        this.renderer.dispose();
        if (this.$refs.threeContainer && this.renderer.domElement) {
          this.$refs.threeContainer.removeChild(this.renderer.domElement);
        }
      }
      
      window.removeEventListener('resize', this.onWindowResize);
      
      // Dispose geometries and materials
      if (this.scene) {
        this.scene.traverse((child) => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(material => {
                // Also dispose textures
                if (material.map) material.map.dispose();
                material.dispose();
              });
            } else {
              if (child.material.map) child.material.map.dispose();
              child.material.dispose();
            }
          }
        });
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.download-resume {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  
  .three-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
    
    canvas {
      width: 100% !important;
      height: 100% !important;
    }
  }
  
  .content-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem;
    flex: 1;
    justify-content: center;
    position: relative;
    z-index: 2;
  }
  
  .section-title {
    font-size: 1.3rem;
    font-weight: 700;
    margin: 0;
    color: inherit;
  }
  
  .description {
    font-size: 0.8rem;
    line-height: 1.4;
    color: rgba(0, 0, 0, 0.8);
    margin: 0;
    max-width: 250px;
  }
  
  .download-button {
    position: relative;
    display: inline-flex;
    padding: 16px 35px;
    color: rgb(0, 0, 0);
    font-weight: 600;
    font-size: 14px;
    line-height: 100%;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: rgba(105, 105, 105, 0.04);
    box-shadow: rgba(0, 0, 0, 0.12) 0px 30.0444px 16.2444px, rgba(0, 0, 0, 0.07) 0px 15.6px 8.2875px, rgba(0, 0, 0, 0.04) 0px 6.35556px 4.15556px;
    will-change: transform;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    --gradientBorder-size: 1px;
    --gradientBorder-gradient: linear-gradient(178.8deg, rgba(255, 255, 255, 0.2464) 10.85%, rgba(20, 20, 20, 0.46) 24.36%, rgba(50, 50, 50, 0.46) 73.67%, rgba(255, 255, 255, 0.46) 90.68%);
    backdrop-filter: blur(10px);
    border-radius: 99px;
    border: none;
    overflow: hidden;
    cursor: pointer;
    user-select: none;
    
    &::before {
      content: "";
      pointer-events: none;
      user-select: none;
      position: absolute;
      top: 0px;
      right: 0px;
      bottom: 0px;
      left: 0px;
      border-radius: inherit;
      padding: var(--gradientBorder-size);
      background: var(--gradientBorder-gradient);
      mask: linear-gradient(black, black) content-box exclude, linear-gradient(black, black);
    }
    
    .button-bg {
      position: absolute;
      inset: 0px;
      border-radius: inherit;
      transition: opacity 0.2s;
      background: rgba(0, 0, 0, 0.1);
      opacity: 0;
      will-change: opacity;
    }
    
    &:hover {
      .button-bg {
        opacity: 1;
      }
      
    }
    
    &:active {
      transform: translateY(0) scale(0.98);
      box-shadow: rgba(0, 0, 0, 0.1) 0px 20px 12px, rgba(0, 0, 0, 0.06) 0px 10px 6px, rgba(0, 0, 0, 0.04) 0px 4px 3px;
    }
    
    .button-text {
      font-weight: 600;
      letter-spacing: -0.01em;
      z-index: 1;
      position: relative;
    }
    
    .download-icon {
      width: 16px;
      height: 16px;
      transition: transform 0.2s ease;
      z-index: 1;
      position: relative;
      opacity: 0.9;
    }
  }
}
</style>