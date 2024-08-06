<template>
  <div class="card" :class="{ 'card-large': large }">
    <h2>{{ title }}</h2>
    <component :is="resolveComponent(componentName)" v-if="componentName" />
    <p v-else>{{ text }}</p>
    <slot></slot>
  </div>
</template>

<script>
import { defineAsyncComponent, h } from 'vue';

export default {
  props: {
    title: String,
    text: String,
    large: Boolean,
    componentName: String
  },
  methods: {
    resolveComponent(name) {
      const componentMap = {
        AboutMe: () => import('./card-components/AboutMe.vue'),
        WorkExperience: () => import('./card-components/WorkExperience.vue'),
        Education: () => import('./card-components/Education.vue'),
        OtherLarge: () => import('./card-components/OtherLarge.vue'),
        ContactSocial: () => import('./card-components/ContactSocial.vue'),
        CurrentStatus: () => import('./card-components/CurrentStatus.vue'),
        DownloadResume: () => import('./card-components/DownloadResume.vue'),
        ExtraCard: () => import('./card-components/ExtraCard.vue')
      };

      return defineAsyncComponent(componentMap[name] || (() => h('div', 'Component not found')));
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/variables';
@import '../styles/mixins';

.card {
  background-color: rgba(26, 25, 29, 0.5);
  border-radius: 1rem;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  height: 100%;
}

.card-large {
  grid-column: span 2;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

@media (max-width: 900px) {
  .card-large {
    grid-column: span 1;
  }
}
</style>