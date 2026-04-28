<template>
  <div class="activities">
    <VerticalTimeline :items="activityItems">
      <template #item="{ item: activity, index }">
        <div class="activity-item">
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
            <template v-if="activity.highlights?.length">
              <p class="hook-text">{{ activity.highlights[0] }}</p>
              <transition name="expand">
                <ul v-if="expandedItems[index]" class="activity-highlights">
                  <li v-for="(highlight, i) in activity.highlights.slice(1)" :key="i">
                    {{ highlight }}
                  </li>
                </ul>
              </transition>
              <button v-if="activity.highlights.length > 1" class="read-more-btn" @click="toggleItem(index)">
                {{ expandedItems[index] ? t.showLess : t.readMore }}
                <span class="arrow" :class="{ rotated: expandedItems[index] }">↓</span>
              </button>
            </template>
            <p v-else>{{ activity.description }}</p>
          </div>
        </div>
      </template>
    </VerticalTimeline>
  </div>
</template>

<script>
import { computed, reactive } from 'vue';
import VerticalTimeline from '../VerticalTimeline.vue';
import { currentLang, initLang } from '../../stores/language';
import { translations } from '../../i18n/translations';

export default {
  components: {
    VerticalTimeline
  },
  setup() {
    initLang();
    const activityItems = computed(() => translations[currentLang.value].activities);
    const t = computed(() => ({
      readMore: translations[currentLang.value].readMore,
      showLess: translations[currentLang.value].showLess,
    }));
    const expandedItems = reactive({});

    const toggleItem = (index) => {
      expandedItems[index] = !expandedItems[index];
    };

    return { activityItems, t, expandedItems, toggleItem };
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
      margin-bottom: 6px;

      .period {
        font-size: 0.8rem;
        font-style: italic;
        color: var(--text-tertiary);
      }
    }

    .activity-description {
      .hook-text {
        margin: 0 0 4px;
        font-size: 0.82rem;
        line-height: 1.35;
        color: var(--text-secondary);
      }

      .activity-highlights {
        margin: 4px 0 0;
        padding-left: 1rem;

        li {
          font-size: 0.82rem;
          line-height: 1.35;
          color: var(--text-secondary);
          margin-bottom: 0.28rem;

          &:last-child { margin-bottom: 0; }
        }
      }

      .read-more-btn {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        margin-top: 5px;
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
        font-size: 0.75rem;
        color: var(--text-tertiary);
        transition: color 0.2s ease;

        &:hover { color: var(--text-primary); }

        .arrow {
          display: inline-block;
          transition: transform 0.25s ease;
          &.rotated { transform: rotate(180deg); }
        }
      }
    }
  }
}

.expand-enter-active,
.expand-leave-active {
  transition: opacity 0.25s ease, max-height 0.3s ease;
  max-height: 200px;
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
