<template>
  <div 
    class="paper-airplane-container"
    @mousedown="startDrag"
    @mousemove="handleMouseMove"
    @mouseup="throwAirplane"
    @mouseleave="throwAirplane"
    ref="container"
  >
    <!-- Slingshot line -->
    <div v-if="isDragging" class="slingshot-line" :style="slingshotLineStyle"></div>
    
    <div 
      class="paper-airplane"
      :class="{ 'dragging': isDragging, 'ready-to-throw': isReadyToThrow }"
      :style="airplaneStyle"
      ref="airplane"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 16" fill="currentColor" class="airplane-icon" :style="airplaneRotationStyle">
        <!-- Paper airplane body -->
        <path d="M2 8 L24 3 L30 8 L24 13 Z" fill="currentColor" opacity="0.9"/>
        <!-- Wing fold lines -->
        <path d="M2 8 L24 8" stroke="currentColor" stroke-width="0.5" opacity="0.6"/>
        <!-- Top wing crease -->
        <path d="M7 8 L24 5" stroke="currentColor" stroke-width="0.3" opacity="0.4"/>
        <!-- Bottom wing crease -->
        <path d="M7 8 L24 11" stroke="currentColor" stroke-width="0.3" opacity="0.4"/>
        <!-- Nose point highlight -->
        <circle cx="29" cy="8" r="1" fill="currentColor" opacity="0.8"/>
      </svg>
      
      <!-- Power indicator -->
      <div v-if="isDragging" class="power-indicator">
        <div class="power-bar" :style="powerBarStyle"></div>
      </div>
    </div>
    
    <!-- Global flight layer airplane using Teleport -->
    <Teleport to=".airplane-sky">
      <div 
        v-if="isFlying"
        class="flying-airplane"
        :style="flyingAirplaneStyle"
      >
        <!-- Trail effect -->
        <div class="airplane-trail" :style="trailStyle"></div>
        
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 16" fill="currentColor" class="airplane-icon">
          <!-- Paper airplane body -->
          <path d="M2 8 L24 3 L30 8 L24 13 Z" fill="currentColor" opacity="0.9"/>
          <!-- Wing fold lines -->
          <path d="M2 8 L24 8" stroke="currentColor" stroke-width="0.5" opacity="0.6"/>
          <!-- Top wing crease -->
          <path d="M7 8 L24 5" stroke="currentColor" stroke-width="0.3" opacity="0.4"/>
          <!-- Bottom wing crease -->
          <path d="M7 8 L24 11" stroke="currentColor" stroke-width="0.3" opacity="0.4"/>
          <!-- Nose point highlight -->
          <circle cx="29" cy="8" r="1" fill="currentColor" opacity="0.8"/>
        </svg>
        
        <!-- Shadow on ground -->
        <div class="airplane-shadow" :style="shadowStyle"></div>
        
        <!-- Dust puff effect -->
        <div v-if="dustPuff.active" class="dust-puff" :style="dustPuffStyle"></div>
      </div>
    </Teleport>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue';

// ===== REAL-WORLD PHYSICS CONSTANTS (SI UNITS) =====
const PIXELS_PER_METER = 100;        // 1 pixel = 1 cm scale
const AIRPLANE_MASS = 0.003;          // 3 grams in kg
const WING_AREA = 0.015;              // 150 cm² in m²
const AIR_DENSITY = 1.225;            // kg/m³ at sea level
const GRAVITY = 9.81;                 // m/s²
const CL_ALPHA = 4.0;                 // lift curve slope (per radian) - lowered
const STALL_ANGLE = Math.PI / 9;      // ±20° stall angle - widened
const CD0 = 0.02;                     // parasite drag coefficient
const K_INDUCED = 0.07;               // induced drag factor
const MOMENT_OF_INERTIA = 5e-5;        // kg⋅m² (feels right for ~20 cm span)
const ROTATIONAL_DAMPING = 0.8;       // per second
const PHYSICS_DT = 1/120;             // 120Hz physics timestep
const GROUND_BOUNCE_COEFF = 0.2;      // bounce damping
const MIN_SPEED_THRESHOLD = 0.15;     // m/s - below this, plane "sleeps"
const WIND_GUST_STRENGTH = 0.2;       // m/s max wind variation - reduced for stability
const THREE_DEG_IN_RAD = Math.PI / 60; // 3 degrees in radians

// Vector utilities - optimized for reuse
class Vec2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  
  static from(x, y) {
    return new Vec2(x, y);
  }
  
  set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }
  
  len() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  
  lenSq() {
    return this.x * this.x + this.y * this.y;
  }
  
  unit() {
    const length = this.len();
    if (length < 1e-10) return new Vec2(1, 0);
    return new Vec2(this.x / length, this.y / length);
  }
  
  perpCCW() {
    return new Vec2(-this.y, this.x);
  }
  
  scale(s) {
    return new Vec2(this.x * s, this.y * s);
  }
  
  add(v) {
    return new Vec2(this.x + v.x, this.y + v.y);
  }
  
  sub(v) {
    return new Vec2(this.x - v.x, this.y - v.y);
  }
  
  neg() {
    return new Vec2(-this.x, -this.y);
  }
  
  dot(v) {
    return this.x * v.x + this.y * v.y;
  }
  
  limit(maxLength) {
    const length = this.len();
    if (length > maxLength) {
      const scale = maxLength / length;
      this.x *= scale;
      this.y *= scale;
    }
    return this;
  }
}

// Helper function to wrap angles to [-π, π]
const wrapPi = (angle) => {
  while (angle > Math.PI) angle -= 2 * Math.PI;
  while (angle < -Math.PI) angle += 2 * Math.PI;
  return angle;
};

// Simple Perlin noise for wind gusts
class SimplexNoise {
  constructor(seed = 1) {
    this.seed = seed;
  }
  
  noise(x, y) {
    // Simple pseudo-random noise - good enough for wind effects
    let n = Math.sin(x * 12.9898 + y * 78.233 + this.seed) * 43758.5453123;
    return 2 * (n - Math.floor(n)) - 1;
  }
}

export default {
  name: 'PaperAirplane',
  setup() {
    const container = ref(null);
    const airplane = ref(null);
    const isDragging = ref(false);
    const isFlying = ref(false);
    const isSleeping = ref(false);
    
    const dragPosition = reactive({ x: 0, y: 0 });
    const mousePos = reactive({ x: 0, y: 0 });
    const lastMousePos = reactive({ x: 0, y: 0 });
    
    // Physics state in SI units (meters, radians, etc.)
    const physics = reactive({
      position: new Vec2(0, 0),     // meters
      velocity: new Vec2(0, 0),     // m/s
      theta: 0,                     // airplane orientation (radians)
      omega: 0,                     // angular velocity (rad/s)
      accumulatedTime: 0,           // for fixed timestep
      lastUpdateTime: 0,
      groundLevel: 0,               // meters from top
      windOffset: new Vec2(0, 0),   // current wind vector
      groundTimer: 0,               // time spent on ground for auto-sleep
    });
    
    const dustPuff = reactive({
      active: false,
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1
    });
    
    const noise = new SimplexNoise(Date.now());
    let animationId = null;
    
    // Scratch vectors for reuse (avoid GC)
    const scratchVecs = {
      vAir: new Vec2(0, 0),
      vHat: new Vec2(0, 0),
      liftDir: new Vec2(0, 0),
      lift: new Vec2(0, 0),
      drag: new Vec2(0, 0),
      weight: new Vec2(0, AIRPLANE_MASS * GRAVITY),
      totalForce: new Vec2(0, 0)
    };
    
    const isReadyToThrow = computed(() => {
      const power = Math.sqrt(dragPosition.x * dragPosition.x + dragPosition.y * dragPosition.y);
      return isDragging.value && power > 10;
    });
    
    // Convert drag distance to launch speed via energy
    const getLaunchSpeed = (dragDistance) => {
      const maxDragPixels = 80;
      const normalizedDrag = Math.min(dragDistance / maxDragPixels, 1);
      // Map to kinetic energy (60% of "deadly fast")
      const energy = normalizedDrag * 0.6;
      // Solve for speed: KE = 1/2 * m * v^2, but use gravity*height equivalent
      return Math.sqrt(2 * energy * GRAVITY * 1); // 1m height worth of energy
    };
    
    const airplaneStyle = computed(() => {
      // Always show the airplane in the container as fully opaque and ready
      const scale = isDragging.value ? 1.2 : 1;
      return {
        opacity: '1',
        transform: `translate(${dragPosition.x}px, ${dragPosition.y}px) scale(${scale})`,
        transition: isDragging.value ? 'none' : 'transform 0.3s ease'
      };
    });
    
    const airplaneRotationStyle = computed(() => {
      if (!isFlying.value) return {};
      
      // Body roll based on angular velocity + pitch angle
      const bank = THREE_DEG_IN_RAD * (physics.omega * 40); // spin → roll
      const theta = physics.theta * (180 / Math.PI); // pitch in degrees
      
      return {
        transform: `rotate(${bank * (180 / Math.PI)}deg) rotate(${theta}deg)`,
        transition: 'transform 0.05s ease'
      };
    });

    const flyingAirplaneStyle = computed(() => {
      if (!isFlying.value) return {};
      
      // Convert physics position (meters) to screen pixels
      const screenX = physics.position.x * PIXELS_PER_METER;
      const screenY = physics.position.y * PIXELS_PER_METER;
      const rotationDeg = physics.theta * (180 / Math.PI);
      
      // Calculate altitude for scaling
      const altitude = Math.max(0, physics.groundLevel - physics.position.y);
      const scale = Math.max(0.3, 1 - altitude * 0.001);
      
      return {
        position: 'fixed',
        left: `${screenX}px`,
        top: `${screenY}px`,
        transform: `rotate(${rotationDeg}deg) scale(${scale})`,
        transition: 'none',
        pointerEvents: 'none',
        zIndex: '1'
      };
    });

    const trailStyle = computed(() => {
      if (!isFlying.value) return {};
      
      const speed = physics.velocity.len();
      const trailLength = Math.min(speed * PIXELS_PER_METER * 0.8, 120);
      const trailOpacity = Math.min(speed * 0.15, 0.7);
      
      return {
        position: 'absolute',
        width: `${trailLength}px`,
        height: '2px',
        background: `linear-gradient(90deg, rgba(0,0,0,${trailOpacity}) 0%, transparent 100%)`,
        left: `-${trailLength}px`,
        top: '50%',
        transform: 'translateY(-50%)',
        transformOrigin: 'right center',
        zIndex: '-1'
      };
    });

    const shadowStyle = computed(() => {
      if (!isFlying.value) return {};
      
      const screenX = physics.position.x * PIXELS_PER_METER;
      const groundScreenY = physics.groundLevel * PIXELS_PER_METER;
      const altitude = Math.max(0, physics.groundLevel - physics.position.y);
      const shadowOpacity = Math.max(0, 0.4 - altitude * 0.01);
      const shadowSize = Math.max(0.3, 1 - altitude * 0.005);
      
      return {
        position: 'fixed',
        left: `${screenX}px`,
        top: `${groundScreenY}px`,
        width: `${32 * shadowSize}px`,
        height: `${32 * shadowSize}px`,
        background: `rgba(0,0,0,${shadowOpacity})`,
        borderRadius: '50%',
        filter: 'blur(4px)',
        transform: 'translate(-50%, -50%)',
        zIndex: '-1'
      };
    });
    
    const dustPuffStyle = computed(() => {
      if (!dustPuff.active) return {};
      
      return {
        position: 'fixed',
        left: `${dustPuff.x}px`,
        top: `${dustPuff.y}px`,
        width: `${20 * dustPuff.scale}px`,
        height: `${20 * dustPuff.scale}px`,
        background: `rgba(139, 69, 19, ${dustPuff.opacity})`,
        borderRadius: '50%',
        filter: 'blur(3px)',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none'
      };
    });

    const powerBarStyle = computed(() => {
      const power = Math.sqrt(dragPosition.x * dragPosition.x + dragPosition.y * dragPosition.y);
      const maxPower = 80;
      const powerPercent = Math.min(power / maxPower, 1);
      
      const hue = (1 - powerPercent) * 120;
      const color = `hsl(${hue}, 70%, 50%)`;
      
      return {
        width: `${powerPercent * 100}%`,
        background: color,
        transition: 'width 0.1s ease'
      };
    });

    const slingshotLineStyle = computed(() => {
      if (!isDragging.value) return {};
      
      const power = Math.sqrt(dragPosition.x * dragPosition.x + dragPosition.y * dragPosition.y);
      const angle = Math.atan2(dragPosition.y, dragPosition.x) * 180 / Math.PI;
      
      // Line color based on power (green to red)
      const maxPower = 80;
      const powerPercent = Math.min(power / maxPower, 1);
      const hue = (1 - powerPercent) * 120;
      const lineColor = `hsl(${hue}, 70%, 50%)`;
      
      // Position the line to start from the airplane's current position
      const containerWidth = container.value?.offsetWidth || 200;
      const containerHeight = container.value?.offsetHeight || 120;
      const startX = 50 + (dragPosition.x / containerWidth * 100);
      const startY = 50 + (dragPosition.y / containerHeight * 100);
      
      return {
        position: 'absolute',
        left: `${startX}%`,
        top: `${startY}%`,
        width: `${power}px`,
        height: '2px',
        background: lineColor,
        transformOrigin: 'left center',
        transform: `rotate(${angle + 180}deg)`, // Reverse direction to show slingshot effect
        opacity: '0.8',
        borderRadius: '1px',
        zIndex: '5'
      };
    });
    
    const getAngleOfAttack = (vAir) => {
      const speed = vAir.len();
      if (speed < 0.1) return 0;
      
      const flightAngle = Math.atan2(vAir.y, vAir.x);
      let alpha = wrapPi(physics.theta - flightAngle);
      
      // Clamp to ±25° to prevent huge lift torque at stall
      return Math.max(-25 * Math.PI/180, Math.min(25 * Math.PI/180, alpha));
    };
    
    const calculateForces = () => {
      // Air-relative velocity (wind subtracts from plane motion)
      scratchVecs.vAir.set(physics.velocity.x - physics.windOffset.x, 
                          physics.velocity.y - physics.windOffset.y);
      const speed = scratchVecs.vAir.len();
      
      if (speed < MIN_SPEED_THRESHOLD) {
        isSleeping.value = true;
        return { force: scratchVecs.totalForce.set(0, 0), moment: 0 };
      }
      
      isSleeping.value = false;
      
      scratchVecs.vHat.set(scratchVecs.vAir.x / speed, scratchVecs.vAir.y / speed);
      scratchVecs.liftDir.set(-scratchVecs.vHat.y, scratchVecs.vHat.x);
      const q = 0.5 * AIR_DENSITY * speed * speed; // dynamic pressure
      
      // Angle of attack and lift coefficient
      const alpha = getAngleOfAttack(scratchVecs.vAir);
      const CL = CL_ALPHA * alpha;
      
      // Drag polar
      const CD = CD0 + K_INDUCED * CL * CL;
      
      // Forces using scratch vectors
      const liftMagnitude = q * WING_AREA * CL;
      scratchVecs.lift.set(scratchVecs.liftDir.x * liftMagnitude, 
                          scratchVecs.liftDir.y * liftMagnitude);
      
      const dragMagnitude = q * WING_AREA * CD;
      scratchVecs.drag.set(-scratchVecs.vHat.x * dragMagnitude, 
                          -scratchVecs.vHat.y * dragMagnitude);
      
      scratchVecs.totalForce.set(scratchVecs.lift.x + scratchVecs.drag.x, 
                                scratchVecs.lift.y + scratchVecs.drag.y + scratchVecs.weight.y);
      
      // Natural pitching moment from lift at aerodynamic center
      const leverX = 0.003; // 4-5 mm aft of CG
      const leverY = 0.001; 
      const moment = scratchVecs.lift.y * leverX - scratchVecs.lift.x * leverY;
      
      return { force: scratchVecs.totalForce, moment: moment };
    };
    
    const updateWind = (time) => {
      // Simple wind gusts using noise - reduced frequency for stability
      const windFreq = 0.0005;
      const windX = noise.noise(time * windFreq, 0) * WIND_GUST_STRENGTH;
      const windY = noise.noise(0, time * windFreq) * WIND_GUST_STRENGTH * 0.5;
      
      physics.windOffset.x = windX;
      physics.windOffset.y = windY;
    };
    
    const stepPhysics = (dt) => {
      if (isSleeping.value && physics.velocity.len() < MIN_SPEED_THRESHOLD) {
        return;
      }
      
      const { force, moment } = calculateForces();
      
      // Linear motion
      const acceleration = force.scale(1 / AIRPLANE_MASS);
      physics.velocity = physics.velocity.add(acceleration.scale(dt));
      physics.position = physics.position.add(physics.velocity.scale(dt));
      
      // Gentle nose-to-flight-path blending (weather-cock effect)
      if (scratchVecs.vAir.len() > 0.5) { // Only when moving reasonably fast
        const followRate = 2; // rad/s
        const desiredTheta = Math.atan2(scratchVecs.vAir.y, scratchVecs.vAir.x);
        const thetaError = wrapPi(desiredTheta - physics.theta);
        physics.omega += thetaError * followRate * dt;
      }
      
      // Rotational motion with linear and quadratic damping
      const aeroDamp = -Math.sign(physics.omega) * physics.omega * physics.omega * 0.00002;
      const angularAccel = (moment + aeroDamp) / MOMENT_OF_INERTIA - physics.omega * ROTATIONAL_DAMPING;
      physics.omega += angularAccel * dt;
      physics.theta += physics.omega * dt;
      
      // Ground interaction
      const groundY = physics.groundLevel;
      const onGround = physics.position.y >= groundY;
      
      if (onGround) {
        physics.position.y = groundY;
        physics.groundTimer += dt;
        
        if (physics.velocity.y > 0) {
          physics.velocity.y = -physics.velocity.y * GROUND_BOUNCE_COEFF;
          createDustPuff();
        }
        
        // Coulomb ground drag instead of simple friction
        if (Math.abs(physics.velocity.x) < 0.3) {
          physics.velocity.x = 0; // Stop if very slow
        } else {
          physics.velocity.x *= 0.95; // Drag each step while on ground
        }
        
        // Auto-sleep when slow and on ground
        if (physics.velocity.len() < MIN_SPEED_THRESHOLD) {
          isSleeping.value = true;
          landAirplane();
          return;
        }
        
        // Auto-sleep after 3s on ground if still creeping
        if (physics.groundTimer > 3.0 && physics.velocity.len() < 0.3) {
          landAirplane();
          return;
        }
      } else {
        physics.groundTimer = 0; // Reset timer when airborne
      }
      
      // Check boundaries
      const margin = 2; // meters
      const screenWidthM = window.innerWidth / PIXELS_PER_METER;
      const screenHeightM = window.innerHeight / PIXELS_PER_METER;
      
      if (physics.position.x < -margin || 
          physics.position.x > screenWidthM + margin ||
          physics.position.y > screenHeightM + margin) {
        landAirplane();
      }
    };
    
    const createDustPuff = () => {
      const screenX = physics.position.x * PIXELS_PER_METER;
      const screenY = physics.groundLevel * PIXELS_PER_METER;
      
      dustPuff.active = true;
      dustPuff.x = screenX;
      dustPuff.y = screenY;
      dustPuff.scale = 1;
      dustPuff.opacity = 0.6;
      
      // Animate dust puff
      const startTime = Date.now();
      const animateDust = () => {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / 1000; // 1 second duration
        
        if (progress >= 1) {
          dustPuff.active = false;
          return;
        }
        
        dustPuff.scale = 1 + progress * 2;
        dustPuff.opacity = 0.6 * (1 - progress);
        
        requestAnimationFrame(animateDust);
      };
      
      requestAnimationFrame(animateDust);
    };
    
    const physicsLoop = (currentTime) => {
      if (!isFlying.value) return;
      
      const frameTime = (currentTime - physics.lastUpdateTime) / 1000;
      physics.lastUpdateTime = currentTime;
      physics.accumulatedTime += frameTime;
      
      // Update wind
      updateWind(currentTime);
      
      // Fixed timestep physics
      while (physics.accumulatedTime >= PHYSICS_DT) {
        stepPhysics(PHYSICS_DT);
        physics.accumulatedTime -= PHYSICS_DT;
      }
      
      // Continue loop
      animationId = requestAnimationFrame(physicsLoop);
    };

    const startDrag = (event) => {
      if (isFlying.value) return;
      
      isDragging.value = true;
      const rect = container.value.getBoundingClientRect();
      
      lastMousePos.x = event.clientX;
      lastMousePos.y = event.clientY;
      
      // Wake up sleeping plane
      isSleeping.value = false;
      
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      
      event.preventDefault();
    };

    const handleMouseMove = (event) => {
      if (!isDragging.value) return;
      
      const rect = container.value.getBoundingClientRect();
      const maxDistance = Math.min(rect.width, rect.height) * 0.4;
      
      let newX = event.clientX - rect.left - rect.width / 2;
      let newY = event.clientY - rect.top - rect.height / 2;
      
      const distance = Math.sqrt(newX * newX + newY * newY);
      if (distance > maxDistance) {
        newX = (newX / distance) * maxDistance;
        newY = (newY / distance) * maxDistance;
      }
      
      dragPosition.x = newX;
      dragPosition.y = newY;
      
      lastMousePos.x = event.clientX;
      lastMousePos.y = event.clientY;
    };

    const handleGlobalMouseMove = (event) => {
      handleMouseMove(event);
    };

    const handleGlobalMouseUp = () => {
      throwAirplane();
    };

    const throwAirplane = async () => {
      if (!isDragging.value) return;
      
      isDragging.value = false;
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      
      const throwPower = Math.sqrt(dragPosition.x * dragPosition.x + dragPosition.y * dragPosition.y);
      
      if (throwPower < 10) {
        returnToCenter();
        return;
      }
      
      isFlying.value = true;
      isSleeping.value = false;
      
      await nextTick();
      
      // Get starting position and convert to meters (account for scroll)
      const rect = airplane.value.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      physics.position.x = (rect.left + rect.width / 2) / PIXELS_PER_METER;
      physics.position.y = (rect.top + scrollY + rect.height / 2) / PIXELS_PER_METER;
      physics.groundLevel = (window.innerHeight - 50) / PIXELS_PER_METER;
      
      // Calculate launch velocity and orientation (opposite direction like a slingshot)
      const launchSpeed = getLaunchSpeed(throwPower);
      const dragAngle = Math.atan2(dragPosition.y, dragPosition.x); // Use local drag offset
      const launchAngle = dragAngle + Math.PI; // Launch in opposite direction (slingshot effect)
      
      physics.velocity.x = Math.cos(launchAngle) * launchSpeed;
      physics.velocity.y = Math.sin(launchAngle) * launchSpeed;
      
      // Cap initial speed to keep plane on-screen
      const velocityVec = new Vec2(physics.velocity.x, physics.velocity.y);
      velocityVec.limit(6); // 6 m/s max
      physics.velocity.x = velocityVec.x;
      physics.velocity.y = velocityVec.y;
      
      physics.theta = launchAngle + THREE_DEG_IN_RAD * 5; // 5° nose-up launch
      physics.omega = 0;
      physics.accumulatedTime = 0;
      physics.groundTimer = 0; // Reset ground timer
      physics.lastUpdateTime = performance.now(); // Zero just once
      
      // Start requestAnimationFrame physics loop
      animationId = requestAnimationFrame(physicsLoop);
      
      // Reset immediately to allow rapid successive throws
      setTimeout(() => {
        returnToCenterFast();
        // Ensure dragging state is fully reset
        isDragging.value = false;
      }, 50);
    };

    const landAirplane = () => {
      isFlying.value = false;
      isSleeping.value = true;
      
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
      
      // No need to reset position here since we do it immediately after throwing
    };

    const returnToCenter = () => {
      const startTime = Date.now();
      const duration = 800;
      const startX = dragPosition.x;
      const startY = dragPosition.y;
      
      const animateReturn = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        dragPosition.x = startX * (1 - easeOut);
        dragPosition.y = startY * (1 - easeOut);
        
        if (progress < 1) {
          requestAnimationFrame(animateReturn);
        } else {
          dragPosition.x = 0;
          dragPosition.y = 0;
          isSleeping.value = false;
        }
      };
      
      requestAnimationFrame(animateReturn);
    };

    const returnToCenterFast = () => {
      const startTime = Date.now();
      const duration = 200; // Much faster return
      const startX = dragPosition.x;
      const startY = dragPosition.y;
      
      const animateReturn = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 2); // Faster easing
        
        dragPosition.x = startX * (1 - easeOut);
        dragPosition.y = startY * (1 - easeOut);
        
        if (progress < 1) {
          requestAnimationFrame(animateReturn);
        } else {
          dragPosition.x = 0;
          dragPosition.y = 0;
          isSleeping.value = false;
        }
      };
      
      requestAnimationFrame(animateReturn);
    };

    onUnmounted(() => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    });

    return {
      container,
      airplane,
      isDragging,
      isFlying,
      isReadyToThrow,
      airplaneStyle,
      airplaneRotationStyle,
      flyingAirplaneStyle,
      trailStyle,
      shadowStyle,
      dustPuffStyle,
      powerBarStyle,
      slingshotLineStyle,
      dustPuff,
      startDrag,
      handleMouseMove,
      throwAirplane,
    };
  }
};
</script>

<style lang="scss" scoped>
.paper-airplane-container {
  position: relative;
  width: 100%;
  flex-grow: 1;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
  border-radius: 0.75rem;
  cursor: grab;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: rgba(0,0,0,0.05);
  }
  
  &:active {
    cursor: grabbing;
  }

  .paper-airplane {
    position: relative;
    width: 32px;
    height: 32px;
    transform-origin: center;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
    
    &.dragging {
      filter: drop-shadow(0 6px 12px rgba(0,0,0,0.3));
      z-index: 10;
    }
    
    &.ready-to-throw {
      filter: drop-shadow(0 8px 16px rgba(0,0,0,0.4));
      
      .airplane-icon {
        color: rgba(0, 100, 200, 0.9);
      }
    }
    
    .airplane-icon {
      width: 100%;
      height: 100%;
      color: rgba(0, 0, 0, 0.8);
      transition: color 0.2s ease;
    }
    
    .power-indicator {
      position: absolute;
      bottom: -15px;
      left: 50%;
      transform: translateX(-50%);
      width: 40px;
      height: 4px;
      border-radius: 2px;
      background: #e0e0e0;
      overflow: hidden;
      
      .power-bar {
        height: 100%;
        border-radius: 2px;
        transition: width 0.1s ease;
      }
    }
  }
  
  &:hover .airplane-icon {
    color: rgba(0,0,0,1);
  }
}

// Global flying airplane styles
.flying-airplane {
  width: 32px;
  height: 32px;
  transform-origin: center;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
  
  .airplane-icon {
    width: 100%;
    height: 100%;
    color: rgba(0, 0, 0, 0.9);
  }
  
  .airplane-trail {
    position: absolute;
    pointer-events: none;
  }
  
  .airplane-shadow {
    position: fixed;
    pointer-events: none;
  }
}

// Responsive adjustments
@media (max-width: 768px) {
  .paper-airplane-container {
    min-height: 100px;
    
    .paper-airplane {
      width: 28px;
      height: 28px;
    }
  }
  
  .flying-airplane {
    width: 28px;
    height: 28px;
  }
}
</style> 