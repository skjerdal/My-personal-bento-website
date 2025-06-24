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
  max-height: 400px; /* Or your desired max height */
  display: flex;
  flex-direction: column;
}

.timeline-scroll-container {
  flex: 1; /* Takes available height from .vertical-timeline */
  overflow-y: auto;
  position: relative; /* For potential future use and consistent behavior */
  padding: 0 5px; /* Horizontal padding for content within scrollable area */

  /* Minimalistic scrollbar styling */
  scrollbar-width: thin; /* For Firefox */
  scrollbar-color: rgba($text-color, 0.2) transparent; /* thumb track */

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba($text-color, 0.3);
    border-radius: 3px;
    border: 1px solid transparent; /* Ensure no weird borders */
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba($text-color, 0.5);
  }
}

.timeline {
  position: relative;
  padding: 20px 0; /* Vertical padding for items */
  /* width: 90%; remove this, now 100% of scroll container */
  /* margin: 0 auto; remove this */
}

.timeline-entry {
  position: relative;
  padding-left: 40px; /* Space for dot and line */
  margin-bottom: 20px; /* Space between entries */

  &:last-child {
    margin-bottom: 0;
  }
}

.timeline-dot {
  position: absolute;
  left: 10px;
  top: 5px; /* Aligns dot near the top of the entry content */
  width: 8px;
  height: 8px;
  background-color: $text-color; /* Use theme color */
  opacity: 0.6; /* Subtle visibility */
  border-radius: 50%;
  z-index: 1;
}

.timeline-line {
  position: absolute;
  left: calc(10px + (8px / 2) - (1px / 2)); /* Center with dot: dot.left + (dot.width/2) - (line.width/2) */
  top: calc(5px + 8px + 4px); /* Start below dot: dot.top + dot.height + small_gap */
  width: 1px;
  background-color: $text-color; /* Use theme color */
  opacity: 0.3; /* More subtle visibility for the line */
  z-index: 0;
  bottom: -20px; /* Extends into the margin-bottom of the entry (which is 20px) */
}

.timeline-content {
  /* No specific background, shadow, or border for minimalism */
  /* Padding should be handled by the slotted content or within .timeline-entry if needed */
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .timeline {
    width: 95%;
  }

  .timeline-entry {
    padding-left: 30px;
    margin-bottom: 15px;
  }

  .timeline-dot {
    left: 5px;
  }

  .timeline-line {
    left: calc(5px + (8px / 2) - (1px / 2));
    top: calc(5px + 8px + 4px);
    bottom: -15px; /* Adjusted for new margin-bottom on mobile */
  }
}
</style> 