<template>
  <div class="project-showcase">
    <div class="showcase-header">
      <div class="scroll-indicator">
        <span>Scroll →</span>
      </div>
    </div>
    <div class="project-scroll" ref="scrollContainer">
      <div 
        v-for="(project, index) in projects" 
        :key="project.id" 
        class="project-card"
        :class="`project-${index + 1}`"
      >
        <div class="project-header">
          <div class="project-number">0{{ index + 1 }}</div>
          <div class="project-status" :class="project.status">{{ project.status }}</div>
        </div>
        
        <h3 class="project-title">{{ project.title }}</h3>
        <p class="project-description">{{ project.description }}</p>
        
        <div class="project-tech">
          <div class="tech-grid">
            <span 
              v-for="tech in project.technologies" 
              :key="tech" 
              class="tech-tag"
            >
              {{ tech }}
            </span>
          </div>
        </div>
        
        <div class="project-footer">
          <div class="project-metrics">
            <div class="metric">
              <span class="metric-value">{{ project.year }}</span>
              <span class="metric-label">Year</span>
            </div>
            <div class="metric" v-if="project.duration">
              <span class="metric-value">{{ project.duration }}</span>
              <span class="metric-label">Duration</span>
            </div>
          </div>
          
          <div class="project-links">
            <a 
              v-if="project.demoUrl" 
              :href="project.demoUrl" 
              target="_blank" 
              rel="noopener noreferrer"
              class="project-link demo"
            >
              <span>Live</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 11L11 1M11 1H1M11 1V11" stroke="currentColor" stroke-width="1.5"/>
              </svg>
            </a>
            <a 
              v-if="project.githubUrl" 
              :href="project.githubUrl" 
              target="_blank" 
              rel="noopener noreferrer"
              class="project-link github"
            >
              <span>Code</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 11L11 1M11 1H1M11 1V11" stroke="currentColor" stroke-width="1.5"/>
              </svg>
            </a>
          </div>
        </div>
        
        <div class="project-bg-pattern"></div>
      </div>
    </div>
    
    <div class="scroll-controls">
      <button @click="scrollLeft" class="scroll-btn">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="2"/>
        </svg>
      </button>
      <button @click="scrollRight" class="scroll-btn">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="2"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExtraCard',
  data() {
    return {
      projects: [
        {
          id: 1,
          title: 'E-Commerce Platform',
          description: 'Full-stack e-commerce solution with real-time inventory, payment processing, and admin dashboard.',
          technologies: ['Vue.js', 'Node.js', 'MongoDB', 'Stripe'],
          status: 'live',
          year: '2024',
          duration: '3mo',
          demoUrl: 'https://demo1.example.com',
          githubUrl: 'https://github.com/username/ecommerce'
        },
        {
          id: 2,
          title: 'AI Chat Assistant',
          description: 'Intelligent chatbot with natural language processing and context awareness for customer support.',
          technologies: ['React', 'Python', 'OpenAI', 'FastAPI'],
          status: 'development',
          year: '2024',
          duration: '2mo',
          demoUrl: 'https://demo2.example.com',
          githubUrl: 'https://github.com/username/ai-chat'
        },
        {
          id: 3,
          title: 'Task Management App',
          description: 'Collaborative project management tool with real-time updates, team collaboration, and analytics.',
          technologies: ['Angular', 'NestJS', 'PostgreSQL', 'Socket.io'],
          status: 'completed',
          year: '2023',
          duration: '4mo',
          demoUrl: 'https://demo3.example.com',
          githubUrl: 'https://github.com/username/task-manager'
        },
        {
          id: 4,
          title: 'Data Visualization Dashboard',
          description: 'Interactive dashboard for analyzing business metrics with real-time charts and custom reports.',
          technologies: ['D3.js', 'Express', 'Redis', 'Chart.js'],
          status: 'live',
          year: '2023',
          duration: '2mo',
          demoUrl: 'https://demo4.example.com',
          githubUrl: 'https://github.com/username/dashboard'
        }
      ]
    }
  },
  methods: {
    scrollLeft() {
      const container = this.$refs.scrollContainer;
      container.scrollBy({
        left: -280,
        behavior: 'smooth'
      });
    },
    scrollRight() {
      const container = this.$refs.scrollContainer;
      container.scrollBy({
        left: 280,
        behavior: 'smooth'
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.project-showcase {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%);
  position: relative;
  overflow: hidden;
}

.showcase-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-color);
    background: linear-gradient(45deg, var(--text-color), var(--accent-color));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}

.scroll-indicator {
  font-size: 0.8rem;
  color: var(--text-color-secondary);
  opacity: 0.7;
  animation: pulse 2s infinite;
}

.project-scroll {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  overflow-y: hidden;
  flex: 1;
  padding: 0.5rem 0;
  scroll-behavior: smooth;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.project-card {
  flex: 0 0 260px;
  height: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  position: relative;
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  
  &:hover {
    transform: translateY(-8px) scale(1.02);
    border-color: var(--accent-color);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    
    .project-bg-pattern {
      opacity: 0.1;
      transform: scale(1.1) rotate(5deg);
    }
  }
  
  // Responsive sizing
  @media (max-width: 768px) {
    flex: 0 0 220px;
    padding: 1.2rem;
  }
  
  @media (max-width: 480px) {
    flex: 0 0 200px;
    padding: 1rem;
  }
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.project-number {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--accent-color);
  opacity: 0.8;
}

.project-status {
  font-size: 0.7rem;
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
  
  &.live {
    background: rgba(34, 197, 94, 0.2);
    color: #22c55e;
    border: 1px solid rgba(34, 197, 94, 0.3);
  }
  
  &.development {
    background: rgba(249, 115, 22, 0.2);
    color: #f97316;
    border: 1px solid rgba(249, 115, 22, 0.3);
  }
  
  &.completed {
    background: rgba(99, 102, 241, 0.2);
    color: #6366f1;
    border: 1px solid rgba(99, 102, 241, 0.3);
  }
}

.project-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.8rem;
  color: var(--text-color);
  line-height: 1.3;
}

.project-description {
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--text-color-secondary);
  margin-bottom: 1.2rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-tech {
  margin-bottom: 1.5rem;
}

.tech-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.tech-tag {
  font-size: 0.7rem;
  padding: 0.3rem 0.6rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-color);
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--accent-color);
    color: white;
    transform: translateY(-1px);
  }
}

.project-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.project-metrics {
  display: flex;
  gap: 1rem;
}

.metric {
  display: flex;
  flex-direction: column;
  
  .metric-value {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-color);
  }
  
  .metric-label {
    font-size: 0.7rem;
    color: var(--text-color-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
}

.project-links {
  display: flex;
  gap: 0.8rem;
}

.project-link {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: var(--accent-color);
  text-decoration: none;
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--accent-color);
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--accent-color);
    color: white;
    transform: translateY(-2px);
  }
  
  svg {
    transition: transform 0.2s ease;
  }
  
  &:hover svg {
    transform: translate(2px, -2px);
  }
}

.project-bg-pattern {
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, var(--accent-color) 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.03;
  transition: all 0.5s ease;
  pointer-events: none;
}

.scroll-controls {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.scroll-btn {
  width: 40px;
  height: 40px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-color);
  
  &:hover {
    background: var(--accent-color);
    border-color: var(--accent-color);
    transform: scale(1.1);
  }
}

@keyframes pulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

// Responsive adjustments for different card spans
@media (max-width: 1200px) {
  .project-card {
    flex: 0 0 240px;
  }
}

@media (max-width: 900px) {
  .project-card {
    flex: 0 0 220px;
  }
  
  .showcase-header h2 {
    font-size: 1.3rem;
  }
}

@media (max-width: 600px) {
  .project-showcase {
    padding: 1rem;
  }
  
  .project-card {
    flex: 0 0 200px;
  }
  
  .showcase-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
}
</style>