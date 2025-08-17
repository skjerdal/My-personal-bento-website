<template>
  <div 
    ref="cardElement"
    class="card clickable-card" 
    :class="[
      { 'pokemon-card-host': componentName === 'PokemonCard' }, 
      className,
      customStyle?.cssClasses || []
    ]" 
    :style="computedStyle"
    :data-span="position?.span || 1"
  >
    <!-- Inject custom CSS if provided -->
    <component 
      v-if="customStyle?.customCSS" 
      :is="'style'" 
      v-html="customStyle.customCSS"
    />
    
    <h1 v-if="componentName !== 'PokemonCard' && title && title.trim()" class="card-title">
      <span>{{ title }}</span>
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

export default {
  components: {},
  props: {
    title: String,
    content: String,
    componentName: String,
    position: Object,
    className: String,
    style: [String, Object],
    videoPath: String,
    customStyle: Object // Add customStyle prop
  },
  setup(props) {
    const isMounted = ref(false);
    const cardElement = ref(null);

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
      // Parse existing style prop
      const baseStyle = typeof props.style === 'string' ? 
        props.style.split(';').reduce((acc, style) => {
          const [key, value] = style.split(':');
          if (key && value) {
            acc[key.trim()] = value.trim();
          }
          return acc;
        }, {}) : props.style || {};

      // Add CSS variables from customStyle
      const cssVariables = props.customStyle?.cssVariables || {};
      
      return {
        ...baseStyle,
        ...cssVariables
      };
    });

    onMounted(() => {
      isMounted.value = true;
    });

    return {
      cardElement,
      resolvedComponent,
      computedStyle,
      isMounted
    };
  }
}
</script>
<style lang="scss" scoped>
@import '../styles/variables';
@import '../styles/mixins';

.card {
  background: var(--card-bg, $card-background);
  color: var(--text-color, inherit);
  border-radius: 19px;
  padding: var(--card-padding, 0);
  height: calc(433px - 1.5rem);
  backdrop-filter: var(--backdrop-filter, blur(10px));
  border: var(--card-border, none);
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: var(--box-shadow, 0 8px 20px rgba(0, 0, 0, 0.1), 0 2px 5px rgba(0, 0, 0, 0.07));
  z-index: 10; // Ensure cards are above the airplane flight layer
  
  // &.clickable-card {
  //   cursor: pointer;
  //   transition: transform 0.2s ease, box-shadow 0.2s ease;
    
  //   &:hover {
  //     transform: translateY(-2px);
  //     box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1);
  //   }
  // }
  
  // &.pokemon-card-host {
  //   background-color: transparent;
  //   box-shadow: none;
  //   &::before {
  //     display: none;
  //   }
  // }

  /* Metallic border disabled
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 2.4rem;
    padding: 2px;
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
  */

  .card-title {
    font-size: 1.4rem;
    margin: 0.8rem 0.5rem 0.5rem;
    margin-bottom: 0;
    line-height: 1.2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 0.2rem 1rem 0 1rem;
    color: inherit;

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
    padding: 0 0.5rem 0 0rem;
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
    color: inherit;
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