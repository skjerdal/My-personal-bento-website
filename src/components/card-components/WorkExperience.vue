<template>
  <div class="work-experience">
    <VerticalTimeline :items="jobs">
      <template #item="{ item: job, active }">
        <div class="job-item" :class="{ active }">
          <div class="job-header">
            <h3>{{ job.title }}</h3>
            <div class="company">{{ job.company }}</div>
          </div>
          <div class="job-meta">
            <div class="period">{{ job.period }}</div>
          </div>
          <div class="job-description">
            <p>{{ job.description }}</p>
          </div>
        </div>
      </template>
    </VerticalTimeline>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import VerticalTimeline from '../VerticalTimeline.vue';
import { cards } from '../../data/cardContent';

export default {
  components: {
    VerticalTimeline
  },
  setup() {
    // Get data in a way that works with SSR
    const jobs = ref(cards.find(card => card.id === 'work')?.data || []);

    return { jobs };
  }
};
</script>

<style lang="scss" scoped>
@import '../../styles/color-theme.scss';

.work-experience {
  height: 100%;

  .job-item {
    display: flex;
    flex-direction: column;
    transition: all 0.3s ease;
    
    &.active {
      .job-header h3 {
        color: var(--accent-color);
      }
    }
    
    .job-header {
      margin-bottom: 4px;
      
      h3 {
        font-size: 1.1rem;
        margin: 0 0 2px 0;
        color: var(--text-primary);
        transition: color 0.3s ease;
        font-weight: 600;
      }
      
      .company {
        font-size: 0.95rem;
        font-weight: 500;
        color: var(--text-secondary);
      }
    }
    
    .job-meta {
      margin-bottom: 8px;
      
      .period {
        font-size: 0.8rem;
        font-style: italic;
        color: var(--text-tertiary);
      }
    }
    
    .job-description {
      p {
        margin: 0;
        font-size: 0.85rem;
        line-height: 1.4;
        color: var(--text-secondary);
      }
    }
  }
}
</style>