<template>
  <div class="work-experience">
    <VerticalTimeline :items="jobs">
      <template #item="{ item: job, active }">
        <div class="job-item" :class="{ active }">
          <div class="job-header">
            <h3>{{ job.title }}</h3>
            <div class="company">
              <img v-if="job.logo" :src="job.logo" :alt="job.company + ' logo'" class="company-logo"/>
              <span>{{ job.company }}</span>
            </div>
          </div>
          <div class="job-meta">
            <div class="period">{{ job.period }}</div>
          </div>
          <div class="job-description">
            <ul v-if="job.highlights?.length" class="job-highlights">
              <li v-for="(highlight, index) in job.highlights" :key="index">
                {{ highlight }}
              </li>
            </ul>
            <p v-else>{{ job.description }}</p>
          </div>
        </div>
      </template>
    </VerticalTimeline>
  </div>
</template>

<script>
import { computed } from 'vue';
import VerticalTimeline from '../VerticalTimeline.vue';
import { currentLang, initLang } from '../../stores/language';
import { translations } from '../../i18n/translations';

export default {
  components: {
    VerticalTimeline
  },
  setup() {
    initLang();
    const jobs = computed(() => translations[currentLang.value].work);
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
        font-size: 1rem;
        margin: 0 0 2px 0;
        color: var(--text-primary);
        transition: color 0.3s ease;
        font-weight: 600;
      }
      
      .company {
        font-size: 0.95rem;
        font-weight: 500;
        color: var(--text-secondary);
        display: flex;
        align-items: center;
        gap: 8px;

        .company-logo {
          width: 20px;
          height: 20px;
          object-fit: contain;
          border-radius: 4px;
        }
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

      .job-highlights {
        margin: 0;
        padding-left: 1rem;

        li {
          font-size: 0.83rem;
          line-height: 1.35;
          color: var(--text-secondary);
          margin-bottom: 0.28rem;

          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }
}
</style>
