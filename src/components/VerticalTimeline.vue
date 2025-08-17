<template>
  <div class="vertical-timeline">
    <div class="timeline-scroll-container">
      <div class="timeline">
        <div
          v-for="(item, index) in items"
          :key="index"
          class="timeline-entry"
        >
          <div class="timeline-dot"></div>
          <div class="timeline-line" v-if="index < items.length - 1"></div>
          <div class="timeline-content">
            <slot name="item" :item="item"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
    return {};
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

/* Responsive adjustments */
@media (max-width: 768px) {
  .timeline { width: 95%; }
  .timeline-entry { padding-left: 30px; margin-bottom: 25px; }
  .timeline-dot { left: 5px; 
    &::before { width: 16px; height: 16px; }
  }
  .timeline-line { left: calc(5px + (10px / 2) - (1px / 2)); top: calc(5px + 10px + 4px); bottom: -25px; }
}
</style> 