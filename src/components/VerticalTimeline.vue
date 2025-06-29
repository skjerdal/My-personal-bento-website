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
    // No setup logic needed for a simple presentational component.
    // Props are automatically passed to the template.
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import '../styles/variables';

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
  padding: 0 5px;
  scrollbar-width: thin;
  scrollbar-color: rgba($text-color, 0.2) transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba($text-color, 0.3);
    border-radius: 3px;
    border: 1px solid transparent;
    transition: background-color 0.2s ease;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba($text-color, 0.5);
  }
}

.timeline {
  position: relative;
  padding: 20px 0 0;
}

.timeline-entry {
  position: relative;
  padding-left: 40px;
  margin-bottom: 30px;
  opacity: 0;
  transform: translateX(-10px);
  animation: fadeSlideIn 0.5s ease forwards;
  
  @for $i from 1 through 10 {
    &:nth-child(#{$i}) {
      animation-delay: #{$i * 0.1}s;
    }
  }

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    .timeline-dot {
      transform: scale(1.3);
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

  &:hover::before {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.2);
  }
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
}

.timeline-content {
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateX(5px);
  }
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .timeline {
    width: 95%;
  }

  .timeline-entry {
    padding-left: 30px;
    margin-bottom: 25px;
  }

  .timeline-dot {
    left: 5px;
    
    &::before {
      width: 16px;
      height: 16px;
    }
  }

  .timeline-line {
    left: calc(5px + (10px / 2) - (1px / 2));
    top: calc(5px + 10px + 4px);
    bottom: -25px;
  }
}
</style> 