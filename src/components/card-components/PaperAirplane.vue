<template>
  <div 
    class="paper-airplane-container"
    @mouseenter="startTracking"
    @mouseleave="stopTracking"
    @mousemove="handleMouseMove"
    ref="container"
  >
    <div 
      class="paper-airplane"
      :class="{ 'flying': isFlying, 'tracking': isTracking }"
      :style="airplaneStyle"
      ref="airplane"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="airplane-icon">
        <path d="M21 3L3 10l7 2 2 7 9-9z"/>
        <path d="M12 12l9-9"/>
        <path d="M10 12l-7-2"/>
        <path d="M12 12l-2 7"/>
      </svg>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue';

export default {
  name: 'PaperAirplane',
  setup() {
    const container = ref(null);
    const isTracking = ref(false);
    const isFlying = ref(false);

    const position = reactive({
      x: 0,
      y: 0,
      rotation: 0
    });

    const lastMousePosition = ref({ x: 0, y: 0, time: 0 });
    const flickThreshold = 15; // Velocity threshold for flick (pixels per millisecond)

    const airplaneStyle = computed(() => {
      if (isFlying.value) {
        return {
          transform: `translate(${position.x}px, ${position.y}px) rotate(${position.rotation}deg) scale(0)`,
          transition: 'transform 0.5s cubic-bezier(0.6, -0.28, 0.735, 0.045), opacity 0.5s ease-out',
          opacity: '0',
        };
      }
      return {
        transform: `translate(${position.x}px, ${position.y}px) rotate(${position.rotation}deg)`,
        transition: 'transform 0.1s linear'
      };
    });

    const startTracking = (event) => {
      if (isFlying.value) return;
      isTracking.value = true;
      lastMousePosition.value = { x: event.clientX, y: event.clientY, time: Date.now() };

      const rect = container.value.getBoundingClientRect();
      position.x = event.clientX - rect.left - rect.width / 2;
      position.y = event.clientY - rect.top - rect.height / 2;
    };

    const stopTracking = () => {
      if (isFlying.value) return;
      isTracking.value = false;
      position.x = 0;
      position.y = 0;
      position.rotation = 0;
    };

    const handleMouseMove = (event) => {
      if (!isTracking.value || isFlying.value) return;

      const rect = container.value.getBoundingClientRect();
      const now = Date.now();
      const deltaTime = now - lastMousePosition.value.time;
      
      if (deltaTime === 0) return;

      const mouseX = event.clientX;
      const mouseY = event.clientY;

      const deltaX = mouseX - lastMousePosition.value.x;
      const deltaY = mouseY - lastMousePosition.value.y;

      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const velocity = distance / deltaTime;

      position.x = mouseX - rect.left - rect.width / 2;
      position.y = mouseY - rect.top - rect.height / 2;
      
      if (distance > 1) {
        position.rotation = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
      }
      
      if (velocity > flickThreshold) {
        throwAirplane(deltaX, deltaY);
      }

      lastMousePosition.value = { x: mouseX, y: mouseY, time: now };
    };

    const throwAirplane = (velocityX, velocityY) => {
        isFlying.value = true;
        isTracking.value = false;

        const throwMagnitude = 200;
        const velocityMagnitude = Math.sqrt(velocityX*velocityX + velocityY*velocityY);
        
        if (velocityMagnitude > 0) {
            position.x += (velocityX / velocityMagnitude) * throwMagnitude;
            position.y += (velocityY / velocityMagnitude) * throwMagnitude;
        }

        setTimeout(() => {
            isFlying.value = false;
            stopTracking();
        }, 500);
    };

    return {
      container,
      isTracking,
      isFlying,
      airplaneStyle,
      startTracking,
      stopTracking,
      handleMouseMove,
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
  overflow: hidden;
  border-radius: 0.75rem;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: rgba(0,0,0,0.02);
  }

  .paper-airplane {
    position: absolute;
    width: 32px;
    height: 32px;
    pointer-events: none;
    transform-origin: center;
    filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1));
    z-index: 10;
    
    &.tracking {
      filter: drop-shadow(0 3px 6px rgba(0,0,0,0.2));
    }
    
    .airplane-icon {
      width: 100%;
      height: 100%;
      color: rgba(0, 0, 0, 0.6);
      transition: color 0.2s ease, transform 0.2s ease;
    }
  }
  
  &:hover .airplane-icon {
      color: rgba(0,0,0,0.9);
      transform: scale(1.1);
  }
}
</style> 