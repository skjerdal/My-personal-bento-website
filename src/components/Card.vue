<template>
  <div class="card" :class="className" :data-span="position?.span || 1">
    <h2 v-if="componentName !== 'PokemonCard'">{{ title }}</h2>
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
  props: {
    title: String,
    content: String,
    componentName: String,
    position: Object,
    className: String,
    style: [String, Object]
  },
  setup(props) {
    const isMounted = ref(false);

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

    onMounted(() => {
      isMounted.value = true;
    });

    return {
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
  background-color: var(--card-bg, $card-background);
  border-radius: 2.4rem;
  padding: 1.8rem;
  height: calc(433px - 1.5rem);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(var(--text-primary, 255, 255, 255), 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1), 0 2px 5px rgba(0, 0, 0, 0.07);
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1);
    border-color: rgba(var(--text-primary, 255, 255, 255), 0.2);
  }

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    line-height: 1.2;
    overflow-wrap: break-word;
    word-break: break-word;
    max-height: 3.6em;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
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