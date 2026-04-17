<template>
  <div class="activities">
    <VerticalTimeline :items="activityItems">
      <template #item="{ item: activity, active }">
        <div class="activity-item" :class="{ active }">
          <div class="activity-header">
            <h3>{{ activity.title }}</h3>
            <div class="organization">
              <img
                v-if="activity.logo"
                :src="activity.logo"
                :alt="activity.organization + ' logo'"
                class="organization-logo"
              />
              <span>{{ activity.organization }}</span>
            </div>
          </div>
          <div class="activity-meta">
            <div class="period">{{ activity.period }}</div>
          </div>
          <div class="activity-description">
            <ul v-if="activity.highlights?.length" class="activity-highlights">
              <li v-for="(highlight, index) in activity.highlights" :key="index">
                {{ highlight }}
              </li>
            </ul>
            <p v-else>{{ activity.description }}</p>
          </div>
        </div>
      </template>
    </VerticalTimeline>
  </div>
</template>

<script>
import { ref } from 'vue';
import VerticalTimeline from '../VerticalTimeline.vue';
import { cards } from '../../data/cardContent';

export default {
  components: {
    VerticalTimeline
  },
  setup() {
    const activityItems = ref(cards.find(card => card.id === 'activities')?.data || []);

    return { activityItems };
  }
};
</script>

<style lang="scss" scoped>
@import '../../styles/color-theme.scss';

.activities {
  height: 100%;

  .activity-item {
    display: flex;
    flex-direction: column;
    transition: all 0.3s ease;

    &.active {
      .activity-header h3 {
        color: var(--accent-color);
      }
    }

    .activity-header {
      margin-bottom: 4px;

      h3 {
        font-size: 1rem;
        margin: 0 0 2px 0;
        color: var(--text-primary);
        transition: color 0.3s ease;
        font-weight: 600;
      }

      .organization {
        font-size: 0.95rem;
        font-weight: 500;
        color: var(--text-secondary);
        display: flex;
        align-items: center;
        gap: 8px;

        .organization-logo {
          width: 20px;
          height: 20px;
          object-fit: contain;
          border-radius: 4px;
        }
      }
    }

    .activity-meta {
      margin-bottom: 8px;

      .period {
        font-size: 0.8rem;
        font-style: italic;
        color: var(--text-tertiary);
      }
    }

    .activity-description {
      p {
        margin: 0;
        font-size: 0.85rem;
        line-height: 1.4;
        color: var(--text-secondary);
      }

      .activity-highlights {
        margin: 0;
        padding-left: 1rem;

        li {
          font-size: 0.82rem;
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
