<template>
  <div class="education">
    <VerticalTimeline :items="educationItems">
      <template #item="{ item: edu, active }">
        <div class="education-item" :class="{ active }">
          <div class="education-header">
            <h3>{{ edu.degree }}</h3>
            <div class="institution">{{ edu.institution }}</div>
          </div>
          <div class="education-meta">
            <div class="period">{{ edu.period }}</div>
          </div>
          <div class="achievements" v-if="active || isMounted && windowWidth > 768">
            <ul>
              <li v-for="(achievement, i) in edu.achievements" :key="i">
                {{ achievement }}
              </li>
            </ul>
          </div>
        </div>
      </template>
    </VerticalTimeline>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import VerticalTimeline from '../VerticalTimeline.vue';
import { cards } from '../../data/cardContent';

export default {
  components: {
    VerticalTimeline
  },
  setup() {
    const educationItems = ref(cards.find(card => card.id === 'education').data);
    const windowWidth = ref(0); // Initialize with a default value
    const isMounted = ref(false); // Track if component is mounted

    // Handle responsive design - only access window when mounted
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        windowWidth.value = window.innerWidth;
      }
    };

    onMounted(() => {
      isMounted.value = true;
      // Set initial width
      if (typeof window !== 'undefined') {
        windowWidth.value = window.innerWidth;
        window.addEventListener('resize', handleResize);
      }
    });

    onUnmounted(() => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    });

    return { 
      educationItems,
      windowWidth,
      isMounted
    };
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
    
    &.active {
      .education-header h3 {
        color: var(--accent-color);
      }
    }
    
    .education-header {
      margin-bottom: 4px;
      
      h3 {
        font-size: 1.1rem;
        margin: 0 0 2px 0;
        color: var(--text-primary);
        transition: color 0.3s ease;
        font-weight: 600;
      }
      
      .institution {
        font-size: 0.95rem;
        font-weight: 500;
        color: var(--text-secondary);
      }
    }
    
    .education-meta {
      margin-bottom: 8px;
      
      .period {
        font-size: 0.8rem;
        font-style: italic;
        color: var(--text-tertiary);
      }
    }
    
    .achievements {
      ul {
        margin: 0;
        padding-left: 16px;
        
        li {
          font-size: 0.85rem;
          margin-bottom: 4px;
          color: var(--text-secondary);
          line-height: 1.3;
          
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }
}

// Responsive design
@media (max-width: 768px) {
  .education {
    .education-item {
      &:not(.active) .achievements {
        display: none;
      }
    }
  }
}
</style>