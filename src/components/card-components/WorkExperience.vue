<template>
  <div class="work-experience">
    <VerticalTimeline :items="jobs">
      <template #item="{ item: job, index }">
        <div class="job-item">
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
            <template v-if="job.highlights?.length">
              <p class="hook-text">{{ job.highlights[0] }}</p>
              <transition name="expand">
                <ul v-if="expandedItems[index]" class="job-highlights">
                  <li v-for="(highlight, i) in job.highlights.slice(1)" :key="i">
                    {{ highlight }}
                  </li>
                </ul>
              </transition>
              <button v-if="job.highlights.length > 1" class="read-more-btn" @click="toggleItem(index)">
                {{ expandedItems[index] ? t.showLess : t.readMore }}
                <span class="arrow" :class="{ rotated: expandedItems[index] }">↓</span>
              </button>
            </template>
            <p v-else>{{ job.description }}</p>
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
    const jobs = computed(() => translations[currentLang.value].work);
    const t = computed(() => ({
      readMore: translations[currentLang.value].readMore,
      showLess: translations[currentLang.value].showLess,
    }));
    const expandedItems = reactive({});

    const toggleItem = (index) => {
      expandedItems[index] = !expandedItems[index];
    };

    return { jobs, t, expandedItems, toggleItem };
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
          width: 26px;
          height: 26px;
          object-fit: contain;
          border-radius: 6px;
          background: white;
          padding: 2px;
          box-shadow:
            0 0 0 2px white,
            0 3px 8px rgba(0, 0, 0, 0.2);
          transform: rotate(-4deg);
          flex-shrink: 0;
        }
      }
    }

    .job-meta {
      margin-bottom: 6px;

      .period {
        font-size: 0.8rem;
        font-style: italic;
        color: var(--text-tertiary);
      }
    }

    .job-description {
      .hook-text {
        margin: 0 0 4px;
        font-size: 0.83rem;
        line-height: 1.35;
        color: var(--text-secondary);
      }

      .job-highlights {
        margin: 4px 0 0;
        padding-left: 1rem;

        li {
          font-size: 0.83rem;
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
