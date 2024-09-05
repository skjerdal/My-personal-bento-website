<template>
  <div class="card" :class="className" :data-span="position?.span || 1">
    <h2 v-if="componentName !== 'PokemonCard'">{{ title }}</h2>
    <component :is="resolvedComponent" v-if="resolvedComponent && componentName !== 'PokemonCard'" />
    <p v-else-if="componentName !== 'PokemonCard'">{{ content }}</p>
    <slot></slot>
  </div>
</template>

<script>
import { defineAsyncComponent, computed } from 'vue';

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
    const resolvedComponent = computed(() => {
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

    return {
      resolvedComponent,
      computedStyle
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
  padding: 1.5rem;
  height: calc(433px - 1.5rem);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
}
</style>