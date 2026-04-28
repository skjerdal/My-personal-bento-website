<template>
  <div class="education">
    <VerticalTimeline :items="educationItems">
      <template #item="{ item: edu, index }">
        <div class="education-item">
          <div class="education-header">
            <h3>{{ edu.degree }}</h3>
            <div class="institution">
              <img v-if="edu.logo" :src="edu.logo" :alt="edu.institution + ' logo'" class="institution-logo"/>
              <span>{{ edu.institution }}</span>
            </div>
          </div>
          <div class="education-meta">
            <div class="period">{{ edu.period }}</div>
          </div>
          <div class="achievements" v-if="edu.achievements?.length">
            <p class="hook-text">{{ edu.achievements[0] }}</p>
            <transition name="expand">
              <ul v-if="expandedItems[index]">
                <li v-for="(achievement, i) in edu.achievements.slice(1)" :key="i">
                  {{ achievement }}
                </li>
              </ul>
            </transition>
            <button v-if="edu.achievements.length > 1" class="read-more-btn" @click="toggleItem(index)">
              {{ expandedItems[index] ? t.showLess : t.readMore }}
              <span class="arrow" :class="{ rotated: expandedItems[index] }">↓</span>
            </button>
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
    const educationItems = computed(() => translations[currentLang.value].education);
    const t = computed(() => ({
      readMore: translations[currentLang.value].readMore,
      showLess: translations[currentLang.value].showLess,
    }));
    const expandedItems = reactive({});

    const toggleItem = (index) => {
      expandedItems[index] = !expandedItems[index];
    };

    return { educationItems, t, expandedItems, toggleItem };
  }
};
</script>

<style lang="scss" scoped>
@import '../../styles/color-theme.scss';

.education {
  height: 100%;

  .education-item {
    display: flex;
    flex-direction: column;
    transition: all 0.3s ease;

    .education-header {
      margin-bottom: 4px;

      h3 {
        font-size: 1rem;
        margin: 0 0 2px 0;
        color: var(--text-primary);
        transition: color 0.3s ease;
        font-weight: 600;
      }

      .institution {
        font-size: 0.95rem;
        font-weight: 500;
        color: var(--text-secondary);
        display: flex;
        align-items: center;
        gap: 8px;

        .institution-logo {
          width: 20px;
          height: 20px;
          object-fit: contain;
          border-radius: 4px;
        }
      }
    }

    .education-meta {
      margin-bottom: 6px;

      .period {
        font-size: 0.8rem;
        font-style: italic;
        color: var(--text-tertiary);
      }
    }

    .achievements {
      .hook-text {
        margin: 0 0 4px;
        font-size: 0.85rem;
        line-height: 1.35;
        color: var(--text-secondary);
      }

      ul {
        margin: 4px 0 0;
        padding-left: 16px;

        li {
          font-size: 0.85rem;
          margin-bottom: 4px;
          color: var(--text-secondary);
          line-height: 1.3;

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
