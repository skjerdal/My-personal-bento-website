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
      // Skip loading the lanyard model - just create paper airplanes
      this.createFloatingObjects();
      this.camera.position.set(0, 0, 5);
      this.camera.lookAt(0, 0, 0);
      this.startNaturalFlight();
    },

    createFloatingObjects() {
      this.floating = [];
      
      // Load paper airplane model instead of geometric shapes
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
          const scaleFactor = 0.5 / size; // Make them slightly bigger
          paperAirplane.scale.setScalar(scaleFactor);
          
          // Create multiple paper airplanes with varied starting positions
          const numAirplanes = 8;
          
          for (let i = 0; i < numAirplanes; i++) {
            const airplaneClone = paperAirplane.clone();
            
            // Spread them out in 3D space more naturally
            const angle = (i / numAirplanes) * Math.PI * 2;
            const radiusVariation = 1.5 + Math.random() * 1.5; // 1.5 to 3.0 units
            const heightVariation = (Math.random() - 0.5) * 2; // -1 to 1 units
            
            airplaneClone.position.set(
              Math.cos(angle) * radiusVariation, 
              heightVariation, 
              Math.sin(angle) * radiusVariation
            );
            
            // Orient them to face their flight direction initially
            airplaneClone.rotation.y = angle + Math.PI / 2;
            airplaneClone.rotation.x = (Math.random() - 0.5) * 0.3; // Slight pitch variation
            airplaneClone.rotation.z = (Math.random() - 0.5) * 0.2; // Slight roll variation
            
            airplaneClone.userData = { 
              baseAngle: angle,
              speed: 0.4 + Math.random() * 0.6, // Varied speeds for natural movement
              radius: radiusVariation,
              heightOffset: heightVariation,
              verticalSpeed: (Math.random() - 0.5) * 0.3, // Up/down movement
              pitchOffset: Math.random() * Math.PI * 2, // For banking motion
              rollPhase: Math.random() * Math.PI * 2, // For roll oscillation
              glidePhase: Math.random() * Math.PI * 2, // For gliding motion
            };
            
            this.scene.add(airplaneClone);
            this.floating.push(airplaneClone);
          }
        },
        undefined,
        (error) => {
          console.error('Error loading paper airplane model:', error);
          // Fallback to a simple paper airplane shape if model fails to load
          this.createFallbackAirplanes();
        }
      );
    },
    
    createFallbackAirplanes() {
      // Fallback: create simple geometric paper airplane shapes
      this.floating = [];
      const numAirplanes = 8;
      
      for (let i = 0; i < numAirplanes; i++) {
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
        
        const angle = (i / numAirplanes) * Math.PI * 2;
        const radiusVariation = 1.5 + Math.random() * 1.5;
        const heightVariation = (Math.random() - 0.5) * 2;
        
        airplaneGroup.position.set(
          Math.cos(angle) * radiusVariation, 
          heightVariation, 
          Math.sin(angle) * radiusVariation
        );
        
        // Orient them naturally
        airplaneGroup.rotation.y = angle + Math.PI / 2;
        airplaneGroup.rotation.x = (Math.random() - 0.5) * 0.3;
        airplaneGroup.rotation.z = (Math.random() - 0.5) * 0.2;
        
        airplaneGroup.userData = { 
          baseAngle: angle,
          speed: 0.4 + Math.random() * 0.6,
          radius: radiusVariation,
          heightOffset: heightVariation,
          verticalSpeed: (Math.random() - 0.5) * 0.3,
          pitchOffset: Math.random() * Math.PI * 2,
          rollPhase: Math.random() * Math.PI * 2,
          glidePhase: Math.random() * Math.PI * 2,
        };
        
        this.scene.add(airplaneGroup);
        this.floating.push(airplaneGroup);
      }
    },

    startNaturalFlight() {
      // Start the natural flight animation instead of bounce
      this.startTime = Date.now();
    },

    animate() {
      if (!this.renderer) return;
      
      const currentTime = Date.now();
      const elapsed = (currentTime - (this.startTime || currentTime)) * 0.001; // seconds
      
      // Animate paper airplanes with natural flight patterns
      if (this.floating && this.floating.length > 0) {
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
          airplane.position.set(
            Math.cos(currentAngle) * radiusVariation,
            heightGlide,
            Math.sin(currentAngle) * radiusVariation
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
          
          // Add some gentle bobbing and weaving
          const weaveX = Math.sin(elapsed * 1.1 + data.pitchOffset) * 0.1;
          const weaveZ = Math.cos(elapsed * 0.9 + data.rollPhase) * 0.1;
          airplane.position.x += weaveX;
          airplane.position.z += weaveZ;
        });
      }
      
      // Gentle camera movement for dynamic feel
      const cameraTime = elapsed * 0.2;
      this.camera.position.x = Math.sin(cameraTime) * 0.3;
      this.camera.position.y = Math.cos(cameraTime * 0.7) * 0.2;
      this.camera.lookAt(0, 0, 0);
      
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(() => this.animate());
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