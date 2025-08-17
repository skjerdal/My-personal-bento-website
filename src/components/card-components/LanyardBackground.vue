<template>
  <div ref="threeContainer" class="three-container"></div>
</template>

<script>
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default {
  name: 'LanyardBackground',
  mounted() {
    // Bind methods used as callbacks to preserve `this`
    this.animate = this.animate.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.onVisibilityChange = this.onVisibilityChange.bind(this);

    // Initial flags
    this.isInView = true;
    this.isAnimating = false;
    this.rafId = null;
    this.lastRenderTime = 0;
    this.maxFPS = 30; // Cap FPS to reduce thermal load
    this.frameDuration = 1000 / this.maxFPS;

    this.setupVisibilityHandlers();
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
      this.renderer = new THREE.WebGLRenderer({ 
        antialias: false, 
        alpha: true, 
        powerPreference: 'low-power',
        precision: 'mediump'
      });
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      // Lower pixel ratio to reduce GPU load on high-DPI displays
      const targetDpr = Math.min(window.devicePixelRatio || 1, 1.25);
      this.renderer.setPixelRatio(targetDpr);
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      container.appendChild(this.renderer.domElement);

      // Lighting - simplified to just ambient light for paper airplanes
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
      this.scene.add(ambientLight);

      // Choose airplane count based on device hints
      this.numAirplanes = this.calculateAirplaneCount();

      // Load model & start
      this.loadModel();
      this.startNaturalFlight();

      window.addEventListener('resize', this.onWindowResize);
      // Start loop only when visible and in view
      this.startLoop();
    },

    // Reduce instance count on mobile/high-DPI or with reduced motion preference
    calculateAirplaneCount() {
      const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isMobile = /Mobi|Android/i.test(navigator.userAgent);
      const highDPI = (window.devicePixelRatio || 1) > 1.5;
      if (prefersReducedMotion) return 3;
      let count = 8;
      if (isMobile) count -= 3;
      if (highDPI) count -= 1;
      return Math.max(4, count);
    },

    setupVisibilityHandlers() {
      // Pause when tab hidden
      document.addEventListener('visibilitychange', this.onVisibilityChange);
      // Pause when component not in viewport
      if ('IntersectionObserver' in window) {
        this.intersectionObserver = new IntersectionObserver(this.handleIntersection.bind(this), {
          root: null,
          threshold: 0.05,
        });
        if (this.$refs.threeContainer) {
          this.intersectionObserver.observe(this.$refs.threeContainer);
        }
      }
    },

    onVisibilityChange() {
      if (document.hidden) {
        this.stopLoop();
      } else if (this.isInView) {
        this.startLoop();
      }
    },

    handleIntersection(entries) {
      const entry = entries[0];
      const nowInView = !!entry && entry.isIntersecting;
      this.isInView = nowInView;
      if (nowInView && !document.hidden) {
        this.startLoop();
      } else {
        this.stopLoop();
      }
    },

    startLoop() {
      if (this.isAnimating) return;
      this.isAnimating = true;
      this.lastRenderTime = 0;
      this.startTime = performance.now();
      this.rafId = requestAnimationFrame(this.animate);
    },

    stopLoop() {
      this.isAnimating = false;
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    },

    loadModel() {
      // Skip loading the lanyard model - just create paper airplanes
      this.createFloatingObjects();
      this.camera.position.set(0, 0, 5);
      this.camera.lookAt(0, 0, 0);
    },

    createFloatingObjects() {
      this.floating = [];
      // this.numAirplanes is set in initThreeJS via calculateAirplaneCount()
      
      // Load paper airplane model and create instanced mesh
      const loader = new GLTFLoader();
      loader.load(
        '/assets/paper_airplane.glb',
        (gltf) => {
          const paperAirplane = gltf.scene;
          
          // Center and scale the paper airplane
          const box = new THREE.Box3().setFromObject(paperAirplane);
          const center = box.getCenter(new THREE.Vector3());
          paperAirplane.position.copy(center).multiplyScalar(-1);
          const size = box.getSize(new THREE.Vector3()).length();
          const scaleFactor = 0.5 / size;
          paperAirplane.scale.setScalar(scaleFactor);
          
          // Get the geometry and material from the loaded model
          let geometry, material;
          paperAirplane.traverse((child) => {
            if (child.isMesh) {
              geometry = child.geometry;
              material = child.material;
            }
          });
          
          if (geometry && material) {
            // Create instanced mesh for better performance
            this.instancedMesh = new THREE.InstancedMesh(geometry, material, this.numAirplanes);
            this.scene.add(this.instancedMesh);
            
            // Create airplane data and set initial transforms
            const matrix = new THREE.Matrix4();
            const position = new THREE.Vector3();
            const rotation = new THREE.Euler();
            const scale = new THREE.Vector3(1, 1, 1);
            
            for (let i = 0; i < this.numAirplanes; i++) {
              // Spread them out in 3D space more naturally
              const angle = (i / this.numAirplanes) * Math.PI * 2;
              const radiusVariation = 1.5 + Math.random() * 1.5;
              const heightVariation = (Math.random() - 0.5) * 2;
              
              position.set(
                Math.cos(angle) * radiusVariation, 
                heightVariation, 
                Math.sin(angle) * radiusVariation
              );
              
              // Orient them to face their flight direction initially
              rotation.set(
                (Math.random() - 0.5) * 0.3, // Slight pitch variation
                angle + Math.PI / 2,         // Face direction
                (Math.random() - 0.5) * 0.2  // Slight roll variation
              );
              
              // Set the matrix for this instance
              matrix.compose(position, new THREE.Quaternion().setFromEuler(rotation), scale);
              this.instancedMesh.setMatrixAt(i, matrix);
              
              // Store airplane data for animation
              this.floating.push({
                baseAngle: angle,
                speed: 0.4 + Math.random() * 0.6,
                radius: radiusVariation,
                heightOffset: heightVariation,
                verticalSpeed: (Math.random() - 0.5) * 0.3,
                pitchOffset: Math.random() * Math.PI * 2,
                rollPhase: Math.random() * Math.PI * 2,
                glidePhase: Math.random() * Math.PI * 2,
              });
            }
            
            // Update the instance matrix
            this.instancedMesh.instanceMatrix.needsUpdate = true;
          }
        },
        undefined,
        (error) => {
          console.error('Error loading paper airplane model:', error);
          // Fallback to geometric shapes if model fails to load
          this.createFallbackAirplanes();
        }
      );
    },
    
    createFallbackAirplanes() {
      // Fallback: create simple geometric paper airplane shapes using InstancedMesh
      this.floating = [];
      // this.numAirplanes is set in initThreeJS via calculateAirplaneCount()
      
      // Create a simple paper airplane shape using basic geometry
      const airplaneGroup = new THREE.Group();
      
      // Main body (triangle)
      const bodyGeometry = new THREE.ConeGeometry(0.05, 0.4, 3);
      const bodyMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff, 
        roughness: 0.8, 
        metalness: 0.1 
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.rotation.z = Math.PI / 2; // Point forward
      airplaneGroup.add(body);
      
      // Wings
      const wingGeometry = new THREE.PlaneGeometry(0.35, 0.15);
      const wingMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xf0f0f0, 
        side: THREE.DoubleSide,
        roughness: 0.9,
        metalness: 0.0
      });
      const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
      leftWing.position.set(0, 0.08, 0);
      leftWing.rotation.z = Math.PI / 6;
      airplaneGroup.add(leftWing);
      
      const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
      rightWing.position.set(0, -0.08, 0);
      rightWing.rotation.z = -Math.PI / 6;
      airplaneGroup.add(rightWing);
      
      // For fallback, we'll use individual objects since merging geometries is complex
      // This is only used if the GLTF model fails to load
      for (let i = 0; i < this.numAirplanes; i++) {
        const airplaneClone = airplaneGroup.clone();
        
        const angle = (i / this.numAirplanes) * Math.PI * 2;
        const radiusVariation = 1.5 + Math.random() * 1.5;
        const heightVariation = (Math.random() - 0.5) * 2;
        
        airplaneClone.position.set(
          Math.cos(angle) * radiusVariation, 
          heightVariation, 
          Math.sin(angle) * radiusVariation
        );
        
        // Orient them naturally
        airplaneClone.rotation.y = angle + Math.PI / 2;
        airplaneClone.rotation.x = (Math.random() - 0.5) * 0.3;
        airplaneClone.rotation.z = (Math.random() - 0.5) * 0.2;
        
        airplaneClone.userData = { 
          baseAngle: angle,
          speed: 0.4 + Math.random() * 0.6,
          radius: radiusVariation,
          heightOffset: heightVariation,
          verticalSpeed: (Math.random() - 0.5) * 0.3,
          pitchOffset: Math.random() * Math.PI * 2,
          rollPhase: Math.random() * Math.PI * 2,
          glidePhase: Math.random() * Math.PI * 2,
        };
        
        this.scene.add(airplaneClone);
        this.floating.push(airplaneClone);
      }
    },

    startNaturalFlight() {
      // Start the natural flight animation instead of bounce
      this.startTime = performance.now();
    },

    animate(timestamp) {
      if (!this.renderer || !this.isAnimating) return;

      // Throttle to maxFPS
      if (!this.lastRenderTime) this.lastRenderTime = timestamp;
      const deltaMs = timestamp - this.lastRenderTime;
      if (deltaMs < this.frameDuration) {
        this.rafId = requestAnimationFrame(this.animate);
        return;
      }

      const elapsed = (timestamp - (this.startTime || timestamp)) * 0.001; // seconds
      
      // Animate paper airplanes with natural flight patterns
      if (this.floating && this.floating.length > 0) {
        if (this.instancedMesh) {
          // Use InstancedMesh for better performance
          const matrix = new THREE.Matrix4();
          const position = new THREE.Vector3();
          const rotation = new THREE.Euler();
          const quaternion = new THREE.Quaternion();
          const scale = new THREE.Vector3(1, 1, 1);
          
          this.floating.forEach((data, i) => {
            // Primary orbital motion with speed variation
            const currentAngle = data.baseAngle + elapsed * data.speed;
            
            // Add figure-8 and gliding patterns
            const glideTime = elapsed * 0.3 + data.glidePhase;
            const bankingTime = elapsed * 0.8 + data.pitchOffset;
            
            // Natural gliding motion - varies radius and height over time
            const radiusVariation = data.radius + Math.sin(glideTime) * 0.5;
            const heightGlide = data.heightOffset + Math.sin(glideTime * 0.7) * 0.8 + data.verticalSpeed * elapsed * 0.1;
            
            // Position with natural variations
            const weaveX = Math.sin(elapsed * 1.1 + data.pitchOffset) * 0.1;
            const weaveZ = Math.cos(elapsed * 0.9 + data.rollPhase) * 0.1;
            
            position.set(
              Math.cos(currentAngle) * radiusVariation + weaveX,
              heightGlide,
              Math.sin(currentAngle) * radiusVariation + weaveZ
            );
            
            // Natural orientation - airplane banks into turns and pitches with movement
            const velocityAngle = currentAngle + Math.PI / 2; // Direction of movement
            const bankingAngle = Math.sin(bankingTime) * 0.3; // Banking left/right
            const pitchAngle = Math.sin(glideTime * 1.2) * 0.2; // Gentle pitch oscillation
            const rollAngle = Math.sin(elapsed * 0.6 + data.rollPhase) * 0.15; // Subtle roll
            
            // Apply rotations for natural flight
            rotation.set(
              pitchAngle, // Pitch up/down naturally
              velocityAngle, // Face direction of travel
              bankingAngle + rollAngle // Bank into turns + subtle roll
            );
            
            // Update the instance matrix
            quaternion.setFromEuler(rotation);
            matrix.compose(position, quaternion, scale);
            this.instancedMesh.setMatrixAt(i, matrix);
          });
          
          // Mark the instance matrix as needing update
          this.instancedMesh.instanceMatrix.needsUpdate = true;
        } else {
          // Fallback: animate individual objects (for createFallbackAirplanes)
          this.floating.forEach((airplane) => {
            const data = airplane.userData;
            
            // Primary orbital motion with speed variation
            const currentAngle = data.baseAngle + elapsed * data.speed;
            
            // Add figure-8 and gliding patterns
            const glideTime = elapsed * 0.3 + data.glidePhase;
            const bankingTime = elapsed * 0.8 + data.pitchOffset;
            
            // Natural gliding motion - varies radius and height over time
            const radiusVariation = data.radius + Math.sin(glideTime) * 0.5;
            const heightGlide = data.heightOffset + Math.sin(glideTime * 0.7) * 0.8 + data.verticalSpeed * elapsed * 0.1;
            
            // Position with natural variations
            const weaveX = Math.sin(elapsed * 1.1 + data.pitchOffset) * 0.1;
            const weaveZ = Math.cos(elapsed * 0.9 + data.rollPhase) * 0.1;
            
            airplane.position.set(
              Math.cos(currentAngle) * radiusVariation + weaveX,
              heightGlide,
              Math.sin(currentAngle) * radiusVariation + weaveZ
            );
            
            // Natural orientation - airplane banks into turns and pitches with movement
            const velocityAngle = currentAngle + Math.PI / 2; // Direction of movement
            const bankingAngle = Math.sin(bankingTime) * 0.3; // Banking left/right
            const pitchAngle = Math.sin(glideTime * 1.2) * 0.2; // Gentle pitch oscillation
            const rollAngle = Math.sin(elapsed * 0.6 + data.rollPhase) * 0.15; // Subtle roll
            
            // Apply rotations for natural flight
            airplane.rotation.y = velocityAngle; // Face direction of travel
            airplane.rotation.x = pitchAngle; // Pitch up/down naturally
            airplane.rotation.z = bankingAngle + rollAngle; // Bank into turns + subtle roll
          });
        }
      }
      
      this.renderer.render(this.scene, this.camera);
      this.lastRenderTime = timestamp;
      if (this.isAnimating) {
        this.rafId = requestAnimationFrame(this.animate);
      }
    },

    onWindowResize() {
      if (!this.camera || !this.renderer || !this.$refs.threeContainer) return;
      const w = this.$refs.threeContainer.clientWidth;
      const h = this.$refs.threeContainer.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
      const targetDpr = Math.min(window.devicePixelRatio || 1, 1.25);
      this.renderer.setPixelRatio(targetDpr);
    },

    cleanup() {
      // Stop RAF and observers/listeners first
      this.stopLoop();
      document.removeEventListener('visibilitychange', this.onVisibilityChange);
      if (this.intersectionObserver) {
        try { this.intersectionObserver.disconnect(); } catch (_) {}
        this.intersectionObserver = null;
      }

      if (this.renderer) {
        // Force WebGL context loss for better cleanup
        this.renderer.forceContextLoss();
        this.renderer.dispose();
        if (this.$refs.threeContainer && this.renderer.domElement) {
          this.$refs.threeContainer.removeChild(this.renderer.domElement);
        }
        this.renderer.domElement = null;
        this.renderer = null;
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
        this.scene = null;
      }
      this.camera = null;
      this.floating = null;
    }
  }
};
</script>

<style scoped>
.three-container {
  position: absolute;
  top: 0;
  left: 0;
  right: -0.5rem;
  bottom: 0;
  width: calc(100% + 0.5rem);
  height: 100%;
  z-index: 0;
  pointer-events: none;
}
.three-container canvas {
  width: 100% !important;
  height: 100% !important;
}
</style> 