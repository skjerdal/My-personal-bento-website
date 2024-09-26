<template>
  <div class="education">
    <Carousel :items="educationItems" :autoSlideInterval="6000">
      <template #default="{ item: edu, index }">
        <div class="education-card">
          <h3>{{ edu.degree }}</h3>
          <p class="institution">{{ edu.institution }}</p>
          <p class="period">{{ edu.period }}</p>
          <ul class="achievements">
            <li v-for="(achievement, i) in edu.achievements" :key="i">
              {{ achievement }}
            </li>
          </ul>
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
    const educationItems = ref(cards.find(card => card.id === 'education').data);

    return { educationItems };
  }
};
</script>

<style lang="scss" scoped>
.education {
  height: 100%;  // Ensure the carousel takes full height of the card

  .education-card {
    padding: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: left;

    h3 {
      font-size: 1.2em;
      margin-bottom: 10px;
      color: #f0f0f0;
    }

    .institution {
      font-weight: bold;
      margin-bottom: 5px;
      color: #d0d0d0;
    }

    .period {
      font-style: italic;
      margin-bottom: 10px;
      color: #b0b0b0;
    }

    .achievements {
      list-style-type: disc;
      padding-left: 20px;
      
      li {
        margin-bottom: 5px;
        color: #c0c0c0;
      }
    }
  }
}
</style>