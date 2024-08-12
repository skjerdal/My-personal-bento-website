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

export default {
  components: {
    Carousel
  },
  setup() {
    const jobs = ref([
      {
        company: 'Company A',
        title: '1',
        period: 'Jan 2020 - Present',
        description: 'Developed and maintained web applications using Vue.js and Node.js.'
      },
      {
        company: 'Company B',
        title: '2',
        period: 'Jun 2018 - Dec 2019',
        description: 'Assisted in the development of mobile apps using React Native and Firebase.'
      },
      // Add more job entries as needed
    ]);

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