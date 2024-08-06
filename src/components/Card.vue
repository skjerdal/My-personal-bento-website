<template>
  <div class="card" :class="{ 'card-large': large }">
    <h2>{{ title }}</h2>
    <p>{{ text }}</p>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    text: String,
    large: Boolean
  }
}
</script>

<style scoped>
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

p {
  font-size: 1rem;
}

@media (max-width: 768px) {
  .card-large {
    grid-column: span 1;
  }
}
</style>