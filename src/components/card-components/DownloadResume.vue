<template>
  <div class="download-resume">
    <!-- Three.js 3D Background -->
    <div ref="threeContainer" class="three-container"></div>
    
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
      this.camera.position.set(0, 0, 6); // Closer for better visibility

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
      this.renderer.toneMappingExposure = 1.5; // Increased for visibility on black background
      container.appendChild(this.renderer.domElement);

      // Add strong lighting for visibility on black background
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      this.scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
      directionalLight.position.set(5, 5, 5);
      directionalLight.castShadow = true;
      this.scene.add(directionalLight);

      const pointLight = new THREE.PointLight(0xffffff, 0.8, 10);
      pointLight.position.set(-3, 3, 3);
      this.scene.add(pointLight);

      // Load HDR environment
      const rgbeLoader = new RGBELoader();
      rgbeLoader.load('/assets/beach.hdr', (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        this.scene.environment = texture;
        this.scene.background = null; // Keep transparent
      });

      // Create lanyard and card
      this.createLanyard();
      
      // Start animation
      this.animate();

      // Handle resize
      window.addEventListener('resize', this.onWindowResize);
    },

    createLanyard() {
      this.lanyardGroup = new THREE.Group();
      this.lanyardSegments = [];
      
      // Lanyard properties - made thicker for visibility
      const segmentHeight = 0.15;
      const segmentRadius = 0.04;
      const numSegments = 12;
      const chainColor = new THREE.Color(0xc0c0c0); // Bright silver
      
      // Create lanyard segments (chain links)
      for (let i = 0; i < numSegments; i++) {
        const geometry = new THREE.CylinderGeometry(segmentRadius, segmentRadius, segmentHeight, 8);
        const material = new THREE.MeshStandardMaterial({ 
          color: chainColor,
          metalness: 0.9,
          roughness: 0.1,
          emissive: new THREE.Color(0x202020) // Slight glow
        });
        
        const segment = new THREE.Mesh(geometry, material);
        segment.position.y = -i * segmentHeight * 0.9;
        segment.userData = {
          originalY: -i * segmentHeight * 0.9,
          swayPhase: i * 0.3,
          segmentIndex: i
        };
        
        this.lanyardSegments.push(segment);
        this.lanyardGroup.add(segment);
      }

      // Create the ID card at the end
      this.createIDCard();
      
      // Position lanyard more prominently in view
      this.lanyardGroup.position.set(1.5, 1.5, 0);
      this.scene.add(this.lanyardGroup);

      // Initial bounce animation
      this.startBounceAnimation();
    },

    createIDCard() {
      // Card geometry (rounded rectangle) - made larger for visibility
      const cardWidth = 1.2;
      const cardHeight = 0.75;
      const cardDepth = 0.05;
      
      // Create rounded rectangle shape
      const shape = new THREE.Shape();
      const radius = 0.05;
      const x = -cardWidth / 2;
      const y = -cardHeight / 2;
      const width = cardWidth;
      const height = cardHeight;
      
      shape.moveTo(x, y + radius);
      shape.lineTo(x, y + height - radius);
      shape.quadraticCurveTo(x, y + height, x + radius, y + height);
      shape.lineTo(x + width - radius, y + height);
      shape.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
      shape.lineTo(x + width, y + radius);
      shape.quadraticCurveTo(x + width, y, x + width - radius, y);
      shape.lineTo(x + radius, y);
      shape.quadraticCurveTo(x, y, x, y + radius);

      const extrudeSettings = {
        depth: cardDepth,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 1,
        bevelSize: 0.005,
        bevelThickness: 0.005
      };

      const cardGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      const cardMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.0,
        roughness: 0.2,
        emissive: new THREE.Color(0x111111) // Subtle glow to make it visible
      });

      this.idCard = new THREE.Mesh(cardGeometry, cardMaterial);
      this.idCard.position.y = -this.lanyardSegments.length * 0.135 - 0.3;
      this.idCard.userData = {
        originalY: -this.lanyardSegments.length * 0.135 - 0.3,
        swayPhase: 0
      };

      this.lanyardGroup.add(this.idCard);
    },

    startBounceAnimation() {
      // Initial bounce effect
      const bounceHeight = 1.5;
      const bounceDelay = 500; // ms delay before starting
      
      setTimeout(() => {
        this.lanyardGroup.position.y = 2 + bounceHeight;
        
        // Animate down with bounce
        this.bounceAnimation = {
          startTime: Date.now(),
          duration: 2000,
          startY: 2 + bounceHeight,
          endY: 2
        };
      }, bounceDelay);
    },

    animate() {
      if (!this.renderer) return;
      
      requestAnimationFrame(() => this.animate());
      
      const time = Date.now() * 0.001;
      
      // Handle bounce animation
      if (this.bounceAnimation) {
        const elapsed = Date.now() - this.bounceAnimation.startTime;
        const progress = Math.min(elapsed / this.bounceAnimation.duration, 1);
        
        // Bounce easing
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
        this.lanyardGroup.position.y = this.bounceAnimation.startY + 
          (this.bounceAnimation.endY - this.bounceAnimation.startY) * easedProgress;
        
        if (progress >= 1) {
          this.bounceAnimation = null;
        }
      }
      
      // Gentle swaying animation after bounce
      if (!this.bounceAnimation && this.lanyardSegments) {
        const swayIntensity = 0.1;
        const windEffect = Math.sin(time * 0.5) * 0.05;
        
        this.lanyardSegments.forEach((segment, index) => {
          const phase = segment.userData.swayPhase;
          const sway = Math.sin(time * 1.2 + phase) * swayIntensity * (index / this.lanyardSegments.length);
          segment.position.x = sway + windEffect;
          segment.rotation.z = sway * 0.5;
        });
        
        // Card sway
        if (this.idCard) {
          const cardSway = Math.sin(time * 1.2) * swayIntensity * 1.2 + windEffect;
          this.idCard.position.x = cardSway;
          this.idCard.rotation.z = cardSway * 0.3;
          this.idCard.rotation.x = Math.sin(time * 0.8) * 0.1;
        }
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
              child.material.forEach(material => material.dispose());
            } else {
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
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
    max-width: 250px;
  }
  
  .download-button {
    position: relative;
    display: inline-flex;
    padding: 16px 35px;
    color: rgb(255, 255, 255);
    font-weight: 600;
    font-size: 14px;
    line-height: 100%;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: linear-gradient(182.51deg, rgba(255, 255, 255, 0.02) 27.09%, rgba(90, 90, 90, 0.02) 58.59%, rgba(0, 0, 0, 0.02) 92.75%);
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
      background: rgba(255, 255, 255, 0.1);
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