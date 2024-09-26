<template>
  <div class="work-experience">
    <Carousel :items="jobs">
      <template #default="{ item: job }">
        <div class="job-card">
          <h3>{{ job.title }} at {{ job.company }}</h3>
          <p class="period">{{ job.period }}</p>
          <p class="description">{{ job.description }}</p>
        </div>
      </template>
    </Carousel>
  </div>
</template>

<script>
import { ref } from 'vue';
import Carousel from '../Carousel.vue';
import { cards } from '../../data/cardContent';

export default {
  components: {
    Carousel
  },
  setup() {
    const jobs = ref(cards.find(card => card.id === 'work').data);

    return { jobs };
  }
};
</script>

<style lang="scss" scoped>
.work-experience {
  height: 100%;  // Ensure the carousel takes full height of the card

  .job-card {
    padding: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    h3 {
      font-size: 1.2em;
      margin-bottom: 10px;
    }

    .period {
      font-style: italic;
      margin-bottom: 10px;
    }

    .description {
      font-size: 0.9em;
    }
  }
}
</style>