<template>
  <div class="bottle-wave" ref="container" @click="handleClick">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { Water } from 'three/examples/jsm/objects/Water2.js';

export default {
  name: 'BottleWave',
  emits: ['bottle-click'],
  setup(_, { emit }) {
    const container = ref(null);
    const canvas = ref(null);
    
    let scene, camera, renderer, water, bottle, clock, envMap, shadowPlane, seabed;
    let isAnimating = true;
    let resizeObserver = null;
    
    const initThree = async () => {
      // Scene setup
      scene = new THREE.Scene();
      
      // Orthographic camera for 2.5D effect (side view)
      const aspect = container.value.clientWidth / container.value.clientHeight;
      const frustumSize = 4;
      camera = new THREE.OrthographicCamera(
        -frustumSize * aspect / 2,
        frustumSize * aspect / 2,
        frustumSize / 2,
        -frustumSize / 2,
        0.1,
        1000
      );
      
      // Renderer setup
      renderer = new THREE.WebGLRenderer({
        canvas: canvas.value,
        antialias: true
      });
      renderer.setSize(container.value.clientWidth, container.value.clientHeight);
      renderer.setClearColor(0x3e8fd3, 1); // Match the water color
      // Output encoding (sRGB) – property name changed in newer Three versions
      renderer.outputColorSpace = THREE.SRGBColorSpace; // r162+
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      renderer.physicallyCorrectLights = true; // enables physically-based light falloff
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      // HDR environment lighting for photographic realism
      const pmrem = new THREE.PMREMGenerator(renderer);

      // helper to load HDR locally then fallback to PolyHaven if not present
      async function loadEnvironment() {
        // Local first (kept outside module graph)
        let hdrUrl = '/assets/beach.hdr';
        try {
          return await new RGBELoader().loadAsync(hdrUrl);
        } catch (e) {
          console.warn('Local HDR not found, falling back to PolyHaven');
          hdrUrl = 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/studio_small_09_2k.hdr';
          return new RGBELoader().loadAsync(hdrUrl);
        }
      }

      const envMapTex = await loadEnvironment();
      envMap = pmrem.fromEquirectangular(envMapTex).texture;
      scene.environment = envMap;
      scene.background = envMap; 

      envMapTex.dispose();
      pmrem.dispose();
      
      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(2, 4, 2);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 1024;
      directionalLight.shadow.mapSize.height = 1024;
      directionalLight.shadow.bias = -0.0003;
      directionalLight.shadow.normalBias = 0.03;
      scene.add(directionalLight);
      
      shadowPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(frustumSize * aspect * 3.0, frustumSize * 3.0), // Make it much larger
        new THREE.ShadowMaterial({ opacity: 0.3 })
      );
      // Add this right after the shadowPlane is created
      const sandGeometry = new THREE.PlaneGeometry(frustumSize * aspect * 3.0, frustumSize * 3.0, 100, 100); // Make it much larger
      const sandTexture = await new THREE.TextureLoader().loadAsync('/textures/sand.jpg'); // Make sure you have a sand texture
      sandTexture.wrapS = sandTexture.wrapT = THREE.RepeatWrapping;
      sandTexture.repeat.set(50, 50);
      const sandMaterial = new THREE.MeshStandardMaterial({
          map: sandTexture,
          roughness: 0.8,
          envMap: envMap,
          color: 0x9e8c6b, // darker beige so it doesn't bloom through
      });
      seabed = new THREE.Mesh(sandGeometry, sandMaterial);
      seabed.rotation.x = -Math.PI / 2;
      seabed.position.y = -4; // Position it deeper below the water
      scene.add(seabed);
      shadowPlane.receiveShadow = true;
      shadowPlane.rotation.x = -Math.PI/2;
      shadowPlane.position.y = -4.2; // Move shadow plane down with seabed
      scene.add(shadowPlane);
      
      // Water surface using proven PBR Water2 helper
      // Significantly enlarge the water plane so it always covers the viewport
      const waterGeometry = new THREE.PlaneGeometry(
        frustumSize * aspect * 10.0,
        frustumSize * 10.0,
        1,
        1
      );

      const textureLoader = new THREE.TextureLoader();
      const normalMap0 = textureLoader.load('/textures/water/Water_1_M_Normal.jpg');
      normalMap0.wrapS = normalMap0.wrapT = THREE.RepeatWrapping;
      normalMap0.repeat.set(10, 10); // Increase tiling for a more noticeable texture size
      const normalMap1 = textureLoader.load('/textures/water/Water_2_M_Normal.jpg');
      normalMap1.wrapS = normalMap1.wrapT = THREE.RepeatWrapping;
      normalMap1.repeat.set(10, 10);

      water = new Water(waterGeometry, {
        color: '#3e8fd3',          // A deeper, richer blue color
        scale: 2.0,                 // Adjusted scale for slightly larger water texture
        flowDirection: new THREE.Vector2(0.3, -0.2), // A gentle, non-linear flow
        textureWidth: 1024,
        textureHeight: 1024,
        envMap: envMap,
        normalMap0: normalMap0,
        normalMap1: normalMap1,
      });

      // Force water to be opaque and disable Fresnel fade
      water.material.transparent = false;
      water.material.depthWrite = true;
      if (water.material.reflectivity !== undefined) water.material.reflectivity = 0;
      if (water.material.uniforms && water.material.uniforms.reflectivity) {
        water.material.uniforms.reflectivity.value = 0;
      }

      // Add exponential fog for underwater depth effect
      scene.fog = new THREE.FogExp2(0x3e8fd3, 0.055); // color, density

      // Pass environment map to the shader (Water2 ignores unknown ctor keys)
      if (water.material?.uniforms) {
        // Safely set uniforms only if they exist
        if (water.material.uniforms.envMap) {
          water.material.uniforms.envMap.value = envMap;
        }
        if (water.material.uniforms.color) {
          water.material.uniforms.color.value.set(0x3e8fd3);
        }
      }
      
      const tilt = THREE.MathUtils.degToRad(15);
      water.rotation.x = -Math.PI / 2 + tilt;  // lay flat (XZ plane) with tilt
      water.position.y = 0;             // water surface at y = 0
      scene.add(water);
      
      // Apply tilt to seabed and shadow plane too
      seabed.rotation.x = -Math.PI / 2 + tilt;
      shadowPlane.rotation.x = -Math.PI / 2 + tilt;
      
      // Create 3D bottle
      const createBottle = async () => {
        const bottleGroup = new THREE.Group();
        
        // Bottle body
        const bodyGeometry = new THREE.CylinderGeometry(0.15, 0.2, 0.8, 32);
        const glassMaterial = new THREE.MeshPhysicalMaterial({
          transmission : 1.0,
          ior          : 1.46,
          thickness    : 0.25,
          roughness    : 0.04,
          metalness    : 0.0,
          envMap       : envMap,
          envMapIntensity : 1.0,
          clearcoat    : 1.0,
          clearcoatRoughness: 0.02
        });
        const body = new THREE.Mesh(bodyGeometry, glassMaterial);
        body.castShadow = true;
        bottleGroup.add(body);
        
        // Bottle neck
        const neckGeometry = new THREE.CylinderGeometry(0.06, 0.08, 0.3, 16);
        const neck = new THREE.Mesh(neckGeometry, glassMaterial);
        neck.position.y = 0.55;
        neck.castShadow = true;
        bottleGroup.add(neck);
        
        // Cork
        const corkGeometry = new THREE.CylinderGeometry(0.07, 0.07, 0.08, 16);
        // Load cork normal map for additional realism
        const corkNormal = await textureLoader.loadAsync('/tex/corkNormal.jpg').catch(() => null);
        const corkMaterial = new THREE.MeshStandardMaterial({ 
          color: 0x8b6b3e,
          roughness: 0.9,
          normalMap: corkNormal || null
        });
        const cork = new THREE.Mesh(corkGeometry, corkMaterial);
        cork.position.y = 0.74;
        cork.castShadow = true;
        bottleGroup.add(cork);
        
        // Message scroll inside
        const messageGeometry = new THREE.PlaneGeometry(0.2, 0.3);
        const messageMaterial = new THREE.MeshStandardMaterial({
          color: 0xf4e4bc,
          transparent: true,
          opacity: 0.9
        });
        const message = new THREE.Mesh(messageGeometry, messageMaterial);
        message.position.set(0, 0, 0);
        message.rotation.y = Math.PI / 8;
        bottleGroup.add(message);
        
        // Message text lines
        for (let i = 0; i < 3; i++) {
          const lineGeometry = new THREE.PlaneGeometry(0.15, 0.02);
          const lineMaterial = new THREE.MeshStandardMaterial({
            color: 0x666666,
            transparent: true,
            opacity: 0.8
          });
          const line = new THREE.Mesh(lineGeometry, lineMaterial);
          line.position.set(0, 0.05 - i * 0.05, 0.001);
          line.rotation.y = Math.PI / 8;
          bottleGroup.add(line);
        }
        
        return bottleGroup;
      };
      
      // Create and add bottle
      bottle = await createBottle();
      bottle.position.set(0, 0.2, 0);
      bottle.scale.set(0.8, 0.8, 0.8);
      bottle.rotation.x += tilt; // Keep bottle upright relative to tilted world
      scene.add(bottle);
      
      // Camera position for 2.5-D plate effect
      camera.position.set(0, 2, 6); // Raise the camera higher and back further
      camera.lookAt(0, 0, 0); // Make sure it's looking at the center
      
      // Animation clock
      clock = new THREE.Clock();
    };
    
    const animate = () => {
      if (!isAnimating) return;
      
      requestAnimationFrame(animate);
      
      const delta = clock.getDelta();
      const time  = clock.getElapsedTime(); // Three handles elapsed time internally
      
      // Advance Water2 time uniform
      if (water && water.material && water.material.uniforms && water.material.uniforms.time) {
        water.material.uniforms.time.value += delta;
      }
      
      // Make bottle float on water surface
      if (bottle) {
        // Gentler wave calculation
        const waveY = (
          Math.sin(time * 1.8) * 0.15 +
          Math.sin(time * 2.3) * 0.07 +
          Math.cos(time * 1.5) * 0.05
        );

        // Set position to float in the water, preventing sideways drift.
        bottle.position.set(0, waveY + 0.2, 0);
        
        // Gentler rocking motion
        bottle.rotation.z = Math.sin(time * 1.1) * 0.08;
        bottle.rotation.x = Math.cos(time * 0.9) * 0.03;
      }
      
      renderer.render(scene, camera);
    };
    
    const handleResize = () => {
      if (!container.value || !camera || !renderer) return;
      
      const width = container.value.clientWidth;
      const height = container.value.clientHeight;
      const aspect = width / height;
      const frustumSize = 4;
      
      camera.left = -frustumSize * aspect / 2;
      camera.right = frustumSize * aspect / 2;
      camera.top = frustumSize / 2;
      camera.bottom = -frustumSize / 2;
      camera.updateProjectionMatrix();
      
      renderer.setSize(width, height);
      
      if (water && shadowPlane && seabed) {
        // Resize helper planes and water to generous dimensions
        const planeWidth = frustumSize * aspect * 12.0;
        const planeHeight = frustumSize * 12.0;
        const waterWidth = frustumSize * aspect * 10.0;
        const waterHeight = frustumSize * 10.0;
        const tilt = THREE.MathUtils.degToRad(15);

        // Fully remove and dispose previous water before creating a new one
        scene.remove(water);
        water.geometry.dispose();
        water.material.dispose();
        water = null;
        
        const textureLoader = new THREE.TextureLoader();
        const normalMap0 = textureLoader.load('/textures/water/Water_1_M_Normal.jpg');
        normalMap0.wrapS = normalMap0.wrapT = THREE.RepeatWrapping;
        normalMap0.repeat.set(10, 10);
        const normalMap1 = textureLoader.load('/textures/water/Water_2_M_Normal.jpg');
        normalMap1.wrapS = normalMap1.wrapT = THREE.RepeatWrapping;
        normalMap1.repeat.set(10, 10);

        water = new Water(new THREE.PlaneGeometry(waterWidth, waterHeight, 1, 1), {
          color: '#3e8fd3',
          scale: 2.0,
          flowDirection: new THREE.Vector2(0.3, -0.2),
          textureWidth: 1024,
          textureHeight: 1024,
          envMap: envMap,
          normalMap0: normalMap0,
          normalMap1: normalMap1,
        });

        // Force water to be opaque
        water.material.transparent = false;
        water.material.depthWrite = true;
        if (water.material.reflectivity !== undefined) water.material.reflectivity = 0;
        if (water.material.uniforms && water.material.uniforms.reflectivity) {
          water.material.uniforms.reflectivity.value = 0;
        }
        
        // Apply tilt and position
        water.rotation.x = -Math.PI / 2 + tilt;
        water.position.y = 0;
        scene.add(water);

        shadowPlane.geometry.dispose();
        seabed.geometry.dispose();

        shadowPlane.geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
        seabed.geometry = new THREE.PlaneGeometry(planeWidth, planeHeight, 100, 100);
      }
    };
    
    const handleClick = () => {
      if (bottle) {
        const startY = bottle.position.y;
        const jumpHeight = 0.5;
        const startTime = Date.now();
        const duration = 800;
        
        const animateJump = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Parabolic jump motion
          const t = progress;
          const jumpY = startY + jumpHeight * (4 * t * (1 - t));
          bottle.position.y = jumpY;
          
          // Add spin during jump
          bottle.rotation.y = progress * Math.PI * 2;
          
          if (progress < 1) {
            requestAnimationFrame(animateJump);
          }
        };
        
        requestAnimationFrame(animateJump);
      }
      
      emit('bottle-click');
    };
    
    onMounted(() => {
      (async () => {
        await initThree();
        animate();
      })();
      
      // Use ResizeObserver for better resize detection
      if (container.value) {
        resizeObserver = new ResizeObserver(() => {
          handleResize();
        });
        resizeObserver.observe(container.value);
      }
      
      // Fallback to window resize
      window.addEventListener('resize', handleResize);
    });
    
    onBeforeUnmount(() => {
      isAnimating = false;
      
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      
      window.removeEventListener('resize', handleResize);
      
      if (renderer) {
        renderer.dispose();
      }

      if (envMap) {
        envMap.dispose();
      }

      if (water && water.material) {
        // These are render targets and need to be disposed of separately
        water.material.uniforms.normalSampler0.value.dispose();
        water.material.uniforms.normalSampler1.value.dispose();
      }
      
      if (scene) {
        scene.traverse((object) => {
          if (object.geometry) {
            object.geometry.dispose();
          }
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
      }
    });
    
    return {
      container,
      canvas,
      handleClick
    };
  }
};
</script>

<style scoped>
.bottle-wave {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

canvas {
  width: 100%;
  height: 100%;
  flex: 1;
  display: block;
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  canvas {
    animation: none;
  }
}
</style> 