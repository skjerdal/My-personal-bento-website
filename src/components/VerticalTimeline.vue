<template>
  <div class="vertical-timeline">
    <div class="timeline-scroll-container" ref="scrollContainerRef">
      <div class="timeline">
        <div
          v-for="(item, index) in items"
          :key="index"
          class="timeline-entry"
        >
          <div class="timeline-dot"></div>
          <div class="timeline-line" v-if="index < items.length - 1"></div>
          <div class="timeline-content">
            <slot name="item" :item="item" :index="index"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  name: 'VerticalTimeline',
  props: {
    items: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  setup() {
    const scrollContainerRef = ref(null);
    let startX = 0;
    let startY = 0;
    let lastY = 0;
    let isVertical = null;

    const isHorizontalMode = () => window.innerWidth <= 768;

    const onTouchStart = (e) => {
      if (!isHorizontalMode()) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      lastY = startY;
      isVertical = null;
    };

    const onTouchMove = (e) => {
      if (!isHorizontalMode() || isVertical === false) return;
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;

      if (isVertical === null) {
        const dx = Math.abs(currentX - startX);
        const dy = Math.abs(currentY - startY);
        if (dx === 0 && dy === 0) return;
        isVertical = dy > dx;
      }

      if (isVertical) {
        window.scrollBy({ top: lastY - currentY, behavior: 'instant' });
        lastY = currentY;
      }
    };

    onMounted(() => {
      const el = scrollContainerRef.value;
      if (el) {
        el.addEventListener('touchstart', onTouchStart, { passive: true });
        el.addEventListener('touchmove', onTouchMove, { passive: true });
      }
    });

    onUnmounted(() => {
      const el = scrollContainerRef.value;
      if (el) {
        el.removeEventListener('touchstart', onTouchStart);
        el.removeEventListener('touchmove', onTouchMove);
      }
    });

    return { scrollContainerRef };
  }
};
</script>

<style lang="scss" scoped>
@import '../styles/variables';

$dot-pop-duration: 0.35s;
$line-grow-duration: 0.6s;

.vertical-timeline {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.timeline-scroll-container {
  flex: 1;
  overflow-y: auto;
  position: relative;
  padding: 0 5px 25px 5px;
  scrollbar-width: thin;
  scrollbar-color: rgba($text-color, 0.2) transparent;
  background: rgba(255, 255, 255, 0.02);

  &::before {
    content: '';
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    height: 40px;
    background: linear-gradient(to bottom, 
      rgba(255, 255, 255, 1) 0%, 
      rgba(255, 255, 255, 0.8) 30%,
      rgba(255, 255, 255, 0.4) 70%,
      rgba(255, 255, 255, 0) 100%);
    z-index: 10;
    pointer-events: none;
    margin-bottom: -40px;
  }

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background-color: rgba($text-color, 0.3);
    border-radius: 3px;
    border: 1px solid transparent;
    transition: background-color 0.2s ease;
  }
  &::-webkit-scrollbar-thumb:hover { background-color: rgba($text-color, 0.5); }
}

.timeline { position: relative; padding: 20px 0 0; }

.timeline-entry {
  position: relative;
  padding-left: 40px;
  margin-bottom: 30px;

  &:last-child { margin-bottom: 0; }

  &:hover {
    .timeline-dot {
      transform: scale(1.15);
      opacity: 1;
      box-shadow: 0 0 10px rgba($text-color, 0.3);
    }
    .timeline-line {
      opacity: 0.5;
      background: linear-gradient(to bottom, $text-color 0%, rgba($text-color, 0.2) 100%);
    }
  }
}

.timeline-dot {
  position: absolute;
  left: 10px;
  top: 5px;
  width: 10px;
  height: 10px;
  background-color: $text-color;
  opacity: 0.6;
  border-radius: 50%;
  z-index: 1;
  transition: all 0.3s ease;

  /* pop-in sequence */
  transform: scale(0);
  animation: dotPop $dot-pop-duration ease-out forwards;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 1px solid rgba($text-color, 0.2);
    opacity: 0;
    transition: all 0.3s ease;
  }

  &:hover::before { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
}

.timeline-line {
  position: absolute;
  left: calc(10px + (10px / 2) - (1px / 2));
  top: calc(5px + 10px + 4px);
  width: 1px;
  background-color: $text-color;
  opacity: 0.3;
  z-index: 0;
  bottom: -30px;
  transition: all 0.3s ease;

  /* grow-down sequence */
  transform-origin: top;
  transform: scaleY(0);
  animation: lineGrow $line-grow-duration ease-out forwards;
}

.timeline-content {
  transition: transform 0.3s ease;

  /* reveal with the dot pop */
  opacity: 0;
  transform: translateY(4px);
  animation: contentReveal 0.35s ease-out forwards;

  &:hover { transform: translateX(5px); }
}

/* Per-item sequential delays: dot/content first, then line to next */
@for $i from 1 through 20 {
  .timeline-entry:nth-child(#{$i}) {
    .timeline-dot { animation-delay: (($i - 1) * ($dot-pop-duration + $line-grow-duration)); }
    .timeline-content { animation-delay: (($i - 1) * ($dot-pop-duration + $line-grow-duration)); }
    .timeline-line { animation-delay: (($i - 1) * ($dot-pop-duration + $line-grow-duration) + $dot-pop-duration); }
  }
}

@keyframes dotPop {
  0% { transform: scale(0); opacity: 0; }
  60% { transform: scale(1.3); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes lineGrow {
  0% { transform: scaleY(0); }
  100% { transform: scaleY(1); }
}

@keyframes contentReveal {
  0% { opacity: 0; transform: translateY(6px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* Responsive adjustments — horizontal scroll on mobile */
@media (max-width: 768px) {
  .vertical-timeline { height: auto; }

  .timeline-scroll-container {
    overflow-x: auto;
    overflow-y: hidden;
    touch-action: pan-x;
    padding: 0 10px 12px;

    /* hide vertical top-fade */
    &::before { display: none; }

    /* horizontal scrollbar */
    scrollbar-width: thin;
    &::-webkit-scrollbar { height: 3px; width: auto; }
  }

  .timeline {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    width: max-content;
    padding: 0;

    /* continuous horizontal track line behind all dots */
    &::before {
      content: '';
      position: absolute;
      top: 10px; /* dot top(5px) + dot radius(5px) */
      left: 0;
      right: 0;
      height: 1px;
      background: rgba($text-color, 0.25);
    }
  }

  .timeline-entry {
    display: flex;
    flex-direction: column;
    padding-top: 26px;
    padding-left: 8px;
    padding-right: 8px;
    margin-bottom: 0;
    margin-right: 16px;
    min-width: 160px;
    max-width: 230px;

    &:last-child { margin-right: 0; }

    &:hover .timeline-dot {
      transform: scale(1.15);
      opacity: 1;
      box-shadow: 0 0 10px rgba($text-color, 0.3);
    }
  }

  .timeline-dot {
    /* center horizontally in entry; left: calc(50% - 5px) avoids transform conflict with scale animation */
    top: 5px;
    left: calc(50% - 5px);
    &::before { width: 16px; height: 16px; }
  }

  /* individual lines replaced by the track ::before on .timeline */
  .timeline-line { display: none; }

  .timeline-content {
    &:hover { transform: translateY(-3px); }
  }
}
</style> 