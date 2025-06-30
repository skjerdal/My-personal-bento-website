<template>
  <div 
    class="card" 
    :class="className" 
    :data-span="position?.span || 1"
    @mouseenter="handleCardMouseEnter"
    @mouseleave="handleCardMouseLeave"
  >
    <h1 v-if="componentName !== 'PokemonCard'" class="card-title">
      <span>{{ title }}</span>
      <VideoHover class="video-hover"
        v-if="videoPath" 
        :videoPath="videoPath" 
        :isCardHovered="isCardHovered"
      />
      <img v-else src="/testbilde.jpg" alt="Placeholder image" class="video-hover-placeholder" />
    </h1>
    <div class="dynamic-component-wrapper" v-if="isMounted && resolvedComponent && componentName !== 'PokemonCard'">
      <component 
        :is="resolvedComponent" 
      />
    </div>
    <p v-else-if="componentName !== 'PokemonCard'" class="card-content">{{ content }}</p>
    <slot></slot>
  </div>
</template>

<script>
import { defineAsyncComponent, computed, ref, onMounted } from 'vue';
import VideoHover from './VideoHover.vue';

export default {
  components: {
    VideoHover
  },
  props: {
    title: String,
    content: String,
    componentName: String,
    position: Object,
    className: String,
    style: [String, Object],
    videoPath: String
  },
  setup(props) {
    const isMounted = ref(false);
    const isCardHovered = ref(false);

    const resolvedComponent = computed(() => {
      if (!isMounted.value) return null;
      if (props.componentName && props.componentName !== 'PokemonCard') {
        return defineAsyncComponent(() => 
          import(`./card-components/${props.componentName}.vue`)
            .catch(error => {
              console.error('Failed to load component:', error);
              return { template: '<p>Error loading component</p>' };
            })
        );
      }
      return null;
    });

    const computedStyle = computed(() => {
      const baseStyle = typeof props.style === 'string' ? 
        props.style.split(';').reduce((acc, style) => {
          const [key, value] = style.split(':');
          if (key && value) {
            acc[key.trim()] = value.trim();
          }
          return acc;
        }, {}) : props.style || {};

      return {
        ...baseStyle,
      };
    });

    const handleCardMouseEnter = () => {
      isCardHovered.value = true;
    };

    const handleCardMouseLeave = () => {
      isCardHovered.value = false;
    };

    onMounted(() => {
      isMounted.value = true;
    });

    return {
      resolvedComponent,
      computedStyle,
      isMounted,
      isCardHovered,
      handleCardMouseEnter,
      handleCardMouseLeave
    };
  }
}
</script>
<style lang="scss" scoped>
@import '../styles/variables';
@import '../styles/mixins';

.card {
  background-color: $card-background;
  border-radius: 2.4rem;
  padding: 0;
  height: calc(433px - 1.5rem);
  backdrop-filter: blur(10px);
  border: none;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1), 0 2px 5px rgba(0, 0, 0, 0.07);
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 2.4rem;
    padding: 1px;
    background: linear-gradient(
      180deg, 
      #ffffff 0%,      // Top highlight
      #d6d6d6 25%,     // Side shadow
      #b0b0b0 75%,     // Side shadow
      #ffffff 100%     // Bottom highlight
    );
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    pointer-events: none;
  }
  
  .video-hover-placeholder {
    width: 90px;
    height: 90px;
    border-radius: 6px;
    object-fit: cover;
    background-color: var(--card-background-hover);
  }

  .card-title {
    font-size: 1.2rem;
    margin-top: 0;
    margin-bottom: 0;
    line-height: 1.2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 0.2rem 1rem 0 1rem;

    span {
      overflow-wrap: break-word;
      word-break: break-word;
      max-height: 3.6em;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }

  .dynamic-component-wrapper {
    flex-grow: 1;
    overflow: hidden;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }

  :deep(.dynamic-component-wrapper > *) {
    height: 100%;
    width: 100%;
  }

  .card-content {
    font-size: 1rem;
    line-height: 1.4;
    flex-grow: 1;
    overflow: auto;
    margin-bottom: 1rem;
    display: -webkit-box;
    -webkit-line-clamp: 8;
    -webkit-box-orient: vertical;
    overflow: hidden;
    // padding: 0 1rem;
  }

  :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: 1.2rem;
    object-fit: cover;
  }

  :deep(.content-wrapper) {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }

}
</style>