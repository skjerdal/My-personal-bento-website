<template>
    <div 
      ref="cardRef"
      :class="['pokemon-card', className, { 'is-interacting': isInteracting }]"
      :style="cardStyle"
      @mousemove="handleMouseMove"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <div class="card__translater">
        <div class="card__rotator">
          <div class="card__shine" :style="shineStyle"></div>
          <div class="card__front">
            <div class="card-content">
              <div class="card-header">
                <h2>{{ title }}</h2>
                <span class="type">{{ componentName }}</span>
              </div>
              <div class="card-image">
                <img :src="profileImage || '/Default_pfp.png'" alt="Profile" />
              </div>
              <div class="card-body">
                <p>{{ content }}</p>
              </div>
              <div class="card-stats">
                <div class="stat" v-for="(stat, index) in stats" :key="index">
                  <component :is="iconComponents[stat.icon]" :size="20" />
                  <span>{{ stat.name }}: {{ stat.value }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import { Camera, Code, Database } from 'lucide-vue-next';
  
  export default {
    name: 'PokemonCard',
    props: {
      title: String,
      content: String,
      componentName: String,
      className: String,
      style: [String, Object],
      profileImage: String,
      position: Object,
      stats: {
        type: Array,
        default: () => [
          { icon: 'Camera', name: 'Front-end', value: 90 },
          { icon: 'Database', name: 'Back-end', value: 85 },
          { icon: 'Code', name: 'Algorithms', value: 80 }
        ]
      }
    },
    setup(props) {
      const cardRef = ref(null);
      const isInteracting = ref(false);
      const mousePosition = ref({ x: 0.5, y: 0.5 });
  
      const iconComponents = {
        Camera,
        Code,
        Database
      };
  
      const handleMouseMove = (event) => {
        if (!cardRef.value) return;
        const rect = cardRef.value.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        mousePosition.value = { x, y };
      };
  
      const handleMouseEnter = () => isInteracting.value = true;
      const handleMouseLeave = () => {
        isInteracting.value = false;
        mousePosition.value = { x: 0.5, y: 0.5 };
      };
  
      const cardStyle = computed(() => {
        const baseStyle = typeof props.style === 'string'
          ? props.style.split(';').reduce((acc, style) => {
              const [key, value] = style.split(':');
              if (key && value) {
                acc[key.trim()] = value.trim();
              }
              return acc;
            }, {})
          : props.style || {};
  
        return {
          ...baseStyle,
          '--mx': `${mousePosition.value.x * 100}%`,
          '--my': `${mousePosition.value.y * 100}%`,
          '--tx': `${(mousePosition.value.x - 0.5) * 4}px`,
          '--ty': `${(mousePosition.value.y - 0.5) * 6}px`,
          '--rx': `${(mousePosition.value.y - 0.5) * 10}deg`,
          '--ry': `${(mousePosition.value.x - 0.5) * -10}deg`,
          '--pos': `${mousePosition.value.x * 100}% ${mousePosition.value.y * 100}%`,
          '--posx': `${mousePosition.value.x * 100}%`,
          '--posy': `${mousePosition.value.y * 100}%`,
          '--hyp': Math.sqrt(
            Math.pow(mousePosition.value.x - 0.5, 2) +
            Math.pow(mousePosition.value.y - 0.5, 2)
          ) * 2,
        };
      });
  
      const shineStyle = computed(() => ({
        opacity: isInteracting.value ? 1 : 0,
      }));
  
      return {
        cardRef,
        isInteracting,
        cardStyle,
        shineStyle,
        handleMouseMove,
        handleMouseEnter,
        handleMouseLeave,
        iconComponents
      };
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .pokemon-card {
    --card-width: 100%;
    --card-height: 100%;
    --card-radius: 4.55% / 3.5%;
    
    position: relative;
    width: var(--card-width);
    height: var(--card-height);
    border-radius: var(--card-radius);
    transform: scale(1);
    transition: transform 0.3s ease;
  
    &.is-interacting {
      z-index: 2;
      transform: scale(1.05);
    }
  
    .card__translater {
      width: 100%;
      height: 100%;
      position: relative;
      transform: translate3d(var(--tx), var(--ty), 0) scale(1);
    }
  
    .card__rotator {
      width: 100%;
      height: 100%;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: var(--card-radius);
      background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
      transition: box-shadow 0.3s ease;
      transform: rotateY(var(--ry)) rotateX(var(--rx));
      transform-style: preserve-3d;
  
      .is-interacting & {
        box-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
      }
    }
  
    .card__shine {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: var(--card-radius);
      background-image: 
        url('/illusion.png'),
        radial-gradient(farthest-corner circle at var(--mx) var(--my),
          rgba(255,255,255,0.8) 10%,
          rgba(255,255,255,0.65) 20%,
          rgba(255,255,255,0) 90%);
      background-position: center;
      background-size: cover, 200% 200%;
      background-blend-mode: color-dodge;
      opacity: 0;
      transition: opacity 0.3s ease;
  
      mask-image: url('/illusion-mask.png');
      mask-size: cover;
  
      .is-interacting & {
        opacity: calc(var(--hyp) * 0.7 + 0.3);
      }
    }
  
    .card__front {
      position: relative;
      width: 100%;
      height: 100%;
      border-radius: var(--card-radius);
      overflow: hidden;
    }
  
    .card-content {
      position: relative;
      z-index: 1;
      padding: 20px;
      color: #ffffff;
    }
  
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
  
      h2 {
        font-size: 1.5em;
        margin: 0;
      }
  
      .type {
        background-color: rgba(74, 144, 226, 0.7);
        padding: 3px 8px;
        border-radius: 12px;
        font-size: 0.8em;
      }
    }
  
    .card-image {
      text-align: center;
      margin-bottom: 15px;
  
      img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        border: 3px solid rgba(74, 144, 226, 0.7);
      }
    }
  
    .card-body {
      margin-bottom: 15px;
    }
  
    .card-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
  
    .stat {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 0.9em;
    }
  }
  </style>