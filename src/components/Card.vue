<template>
  <div class="card" :style="cardStyle">
    <h2 v-if="componentName !== 'PokemonCard'">{{ title }}</h2>
    <component :is="resolvedComponent" v-if="resolvedComponent && componentName !== 'PokemonCard'" />
    <p v-else-if="componentName !== 'PokemonCard'">{{ text }}</p>
    <slot></slot>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue';

export default {
  props: {
    title: String,
    text: String,
    componentName: String,
    position: Object
  },
  data() {
    return {
      resolvedComponent: null
    }
  },
  computed: {
    cardStyle() {
      if (!this.position) return {};
      return {
        gridRow: `${this.position.row}`,
        gridColumn: `${this.position.col} / span ${this.position.span || 1}`
      };
    }
  },
  mounted() {
    if (this.componentName && this.componentName !== 'PokemonCard') {
      this.resolvedComponent = defineAsyncComponent(() => 
        import(`./card-components/${this.componentName}.vue`)
          .catch(error => {
            console.error('Failed to load component:', error);
            return { template: '<p>Error loading component</p>' };
          })
      );
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/variables';
@import '../styles/mixins';

.card {
  background-color: $card-background;
  border-radius: 1rem;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  @include respond-to(medium) {
    grid-column: span 1 !important;
  }
}
</style>