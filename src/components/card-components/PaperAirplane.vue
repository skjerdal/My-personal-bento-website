<template>
  <div 
    class="paper-airplane-container"
    @mousedown="startDrag"
    @mousemove="handleMouseMove"
    @mouseup="throwAirplane"
    @mouseleave="throwAirplane"
    ref="container"
  >
    <div 
      class="paper-airplane"
      :class="{ 'dragging': isDragging, 'ready-to-throw': isReadyToThrow }"
      :style="airplaneStyle"
      ref="airplane"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="airplane-icon">
        <path d="M21 3L3 10l7 2 2 7 9-9z"/>
        <path d="M12 12l9-9"/>
        <path d="M10 12l-7-2"/>
        <path d="M12 12l-2 7"/>
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
        
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="airplane-icon">
          <path d="M21 3L3 10l7 2 2 7 9-9z"/>
          <path d="M12 12l9-9"/>
          <path d="M10 12l-7-2"/>
          <path d="M12 12l-2 7"/>
        </svg>
        
        <!-- Shadow on ground -->
        <div class="airplane-shadow" :style="shadowStyle"></div>
      </div>
    </Teleport>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue';

export default {
  name: 'PaperAirplane',
  setup() {
    const container = ref(null);
    const airplane = ref(null);
    const isDragging = ref(false);
    const isFlying = ref(false);
    const animationId = ref(null);
    
    const dragPosition = reactive({ x: 0, y: 0 });
    const dragStart = reactive({ x: 0, y: 0 });
    const mousePos = reactive({ x: 0, y: 0 });
    const lastMousePos = reactive({ x: 0, y: 0 });
    
    const isReadyToThrow = computed(() => {
      const power = Math.sqrt(dragPosition.x * dragPosition.x + dragPosition.y * dragPosition.y);
      return isDragging.value && power > 10;
    });
    
    const flightState = reactive({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      rotation: 0,
      scale: 1
    });

    // --- New, More Realistic Physics Model ---
    // The previous models were flawed. This model is based on more accurate physics principles
    // for unpowered flight, ensuring the plane behaves like a true glider.

    // Gravity: A constant downward acceleration.
    const GRAVITY = 0.08;

    // Drag Coefficient: Drag increases with the SQUARE of velocity, slowing the plane from a fast throw to a gentle glide.
    const DRAG_COEFFICIENT = 0.001;

    // Lift Coefficient: Lift also increases with the SQUARE of velocity, but is tuned to be weaker than gravity.
    const LIFT_COEFFICIENT = 0.0008;

    const airplaneStyle = computed(() => {
      if (isFlying.value) {
        return {
          opacity: '0.3', // Make original airplane semi-transparent when flying
          transform: `translate(${dragPosition.x}px, ${dragPosition.y}px)`,
          transition: 'opacity 0.3s ease'
        };
      }
      
      const scale = isDragging.value ? 1.2 : 1;
      return {
        transform: `translate(${dragPosition.x}px, ${dragPosition.y}px) scale(${scale})`,
        transition: isDragging.value ? 'none' : 'transform 0.3s ease'
      };
    });

    const flyingAirplaneStyle = computed(() => {
      if (!isFlying.value) return {};
      
      return {
        position: 'fixed',
        left: `${flightState.x}px`,
        top: `${flightState.y}px`,
        transform: `rotate(${flightState.rotation}deg) scale(${flightState.scale})`,
        transition: 'none',
        pointerEvents: 'none',
        zIndex: '1'
      };
    });

    const trailStyle = computed(() => {
      if (!isFlying.value) return {};
      
      const speed = Math.sqrt(flightState.vx * flightState.vx + flightState.vy * flightState.vy);
      const trailLength = Math.min(speed * 8, 120);
      const trailOpacity = Math.min(speed * 0.1, 0.6);
      
      return {
        position: 'absolute',
        width: `${trailLength}px`,
        height: '2px',
        background: `linear-gradient(90deg, rgba(0,0,0,${trailOpacity}) 0%, transparent 100%)`,
        left: '-' + trailLength + 'px',
        top: '50%',
        transform: 'translateY(-50%)',
        transformOrigin: 'right center',
        zIndex: '-1'
      };
    });

    const shadowStyle = computed(() => {
      if (!isFlying.value) return {};
      
      const groundY = window.innerHeight - 50; // Assume ground is near bottom
      const shadowDistance = Math.max(0, groundY - flightState.y);
      const shadowOpacity = Math.max(0, 0.3 - shadowDistance * 0.0005);
      const shadowSize = Math.max(0.3, 1 - shadowDistance * 0.001);
      
      return {
        position: 'fixed',
        left: `${flightState.x}px`,
        top: `${groundY}px`,
        width: `${32 * shadowSize}px`,
        height: `${32 * shadowSize}px`,
        background: `rgba(0,0,0,${shadowOpacity})`,
        borderRadius: '50%',
        filter: 'blur(4px)',
        transform: 'translate(-50%, -50%)',
        zIndex: '-1'
      };
    });

    const powerBarStyle = computed(() => {
      const power = Math.sqrt(dragPosition.x * dragPosition.x + dragPosition.y * dragPosition.y);
      const maxPower = 80;
      const powerPercent = Math.min(power / maxPower, 1);
      
      // Color changes from green to yellow to red as power increases
      const hue = (1 - powerPercent) * 120; // 120 is green, 0 is red
      const color = `hsl(${hue}, 70%, 50%)`;
      
      return {
        width: `${powerPercent * 100}%`,
        background: color,
        transition: 'width 0.1s ease'
      };
    });

    const startDrag = (event) => {
      if (isFlying.value) return;
      
      isDragging.value = true;
      const rect = container.value.getBoundingClientRect();
      dragStart.x = event.clientX - rect.left - rect.width / 2;
      dragStart.y = event.clientY - rect.top - rect.height / 2;
      
      lastMousePos.x = event.clientX;
      lastMousePos.y = event.clientY;
      
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
      
      // Limit drag distance
      const distance = Math.sqrt(newX * newX + newY * newY);
      if (distance > maxDistance) {
        newX = (newX / distance) * maxDistance;
        newY = (newY / distance) * maxDistance;
      }
      
      dragPosition.x = newX;
      dragPosition.y = newY;
      
      // Calculate rotation based on drag direction
      const deltaX = event.clientX - lastMousePos.x;
      const deltaY = event.clientY - lastMousePos.y;
      
      if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
        flightState.rotation = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
      }
      
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
      
      // Calculate throw velocity based on drag distance
      const throwPower = Math.sqrt(dragPosition.x * dragPosition.x + dragPosition.y * dragPosition.y);
      const throwMultiplier = Math.min(throwPower * 0.3, 15);
      
      if (throwPower < 10) {
        // Not enough power, return to center
        returnToCenter();
        return;
      }
      
      isFlying.value = true;
      
      await nextTick();
      
      // Get starting position from the airplane in the card
      const rect = airplane.value.getBoundingClientRect();
      flightState.x = rect.left + rect.width / 2;
      flightState.y = rect.top + rect.height / 2;
      
      // Set initial velocity in opposite direction (slingshot effect)
      const angle = flightState.rotation * (Math.PI / 180);
      flightState.vx = -Math.cos(angle) * throwMultiplier;
      flightState.vy = -Math.sin(angle) * throwMultiplier;
      
      // Also adjust rotation to match actual flight direction
      flightState.rotation = Math.atan2(flightState.vy, flightState.vx) * (180 / Math.PI);
      flightState.scale = 1;
      
      // Start physics simulation
      animationId.value = requestAnimationFrame(updateFlight);
    };

    const updateFlight = () => {
      if (!isFlying.value) return;

      const speedSq = flightState.vx * flightState.vx + flightState.vy * flightState.vy;
      const speed = Math.sqrt(speedSq);

      // 1. Gravity
      // A constant downward force is always applied.
      flightState.vy += GRAVITY;

      if (speed > 0.01) {
        // 2. Drag
        // Drag opposes the direction of motion and is proportional to the square of the speed.
        // This is the primary force that slows the plane down from its initial launch speed.
        const dragForce = speedSq * DRAG_COEFFICIENT;
        flightState.vx -= (flightState.vx / speed) * dragForce;
        flightState.vy -= (flightState.vy / speed) * dragForce;

        // 3. Lift
        // Lift acts perpendicular to the direction of motion. For simplicity in this 2D model,
        // we apply it as an upward force proportional to the square of the HORIZONTAL velocity.
        // This makes the plane want to stay level, creating the glide effect.
        const liftForce = flightState.vx * flightState.vx * LIFT_COEFFICIENT;
        flightState.vy -= liftForce;
      }
      
      // 4. Update Position
      flightState.x += flightState.vx;
      flightState.y += flightState.vy;
      
      // 5. Update Visuals
      // The plane's rotation should smoothly follow its direction of travel.
      const targetRotation = Math.atan2(flightState.vy, flightState.vx) * (180 / Math.PI);
      // Add a lerp for smooth rotation
      let delta = targetRotation - flightState.rotation;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      flightState.rotation += delta * 0.1;

      // Scale gives a sense of depth.
      const heightFactor = Math.max(0.7, 1 - (flightState.y / window.innerHeight) * 0.3);
      const speedFactor = Math.max(0.8, 1 - speed * 0.01);
      flightState.scale = heightFactor * speedFactor;
      
      // 6. Check Boundaries
      const margin = 200;
      if (flightState.x < -margin || 
          flightState.x > window.innerWidth + margin ||
          flightState.y > window.innerHeight + margin) {
        landAirplane();
      } else {
        animationId.value = requestAnimationFrame(updateFlight);
      }
    };

    const landAirplane = () => {
      isFlying.value = false;
      if (animationId.value) {
        cancelAnimationFrame(animationId.value);
        animationId.value = null;
      }
      
      // Return to center with a smooth animation after a short delay
      setTimeout(() => {
        returnToCenter();
      }, 500);
    };

    const returnToCenter = () => {
      // Smooth animation back to center
      const startTime = Date.now();
      const duration = 800;
      const startX = dragPosition.x;
      const startY = dragPosition.y;
      const startRotation = flightState.rotation;
      const startScale = flightState.scale;
      
      const animateReturn = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        dragPosition.x = startX * (1 - easeOut);
        dragPosition.y = startY * (1 - easeOut);
        flightState.rotation = startRotation * (1 - easeOut);
        flightState.scale = startScale + (1 - startScale) * easeOut;
        
        if (progress < 1) {
          requestAnimationFrame(animateReturn);
        } else {
          // Ensure values are exactly at rest position
          dragPosition.x = 0;
          dragPosition.y = 0;
          flightState.rotation = 0;
          flightState.scale = 1;
        }
      };
      
      requestAnimationFrame(animateReturn);
    };

    onMounted(() => {
      // Add the flying airplane to the global airplane-sky layer
      const airplaneSky = document.querySelector('.airplane-sky');
      if (airplaneSky) {
        // The flying airplane will be rendered here via portal-like behavior
        // Vue's conditional rendering will handle this
      }
    });

    onUnmounted(() => {
      if (animationId.value) {
        cancelAnimationFrame(animationId.value);
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
      flyingAirplaneStyle,
      trailStyle,
      shadowStyle,
      powerBarStyle,
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