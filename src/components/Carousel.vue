<template>
  <div 
    class="carousel" 
    ref="carouselRef"
    @touchstart="startDrag"
    @touchmove="onDrag"
    @touchend="endDrag"
    @mousedown="startDrag"
    @mousemove="onDrag"
    @mouseup="endDrag"
    @mouseleave="endDrag"
  >
    <div class="carousel-inner" :style="innerStyle">
      <div class="carousel-item" v-for="(item, index) in wrappedItems" :key="index">
        <slot :item="item.original" :index="item.index"></slot>
      </div>
    </div>
    <button @click="userPrevSlide" class="carousel-control prev" aria-label="Previous slide">&lt;</button>
    <button @click="userNextSlide" class="carousel-control next" aria-label="Next slide">&gt;</button>
    <div class="dot-indicator">
      <button
        v-for="(_, index) in items"
        :key="index"
        :class="{'active': index === currentIndex}"
        class="carousel-indicator"
        @click="userGoToSlide(index)"
        :aria-label="`Go to slide ${index + 1}`"
      ></button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

export default {
  props: {
    items: {
      type: Array,
      required: true
    },
    autoSlideInterval: {
      type: Number,
      default: 5000
    }
  },
  setup(props) {
    const carouselRef = ref(null);
    const currentIndex = ref(0);
    const isDragging = ref(false);
    const startPos = ref(0);
    const currentTranslate = ref(0);
    const prevTranslate = ref(0);
    const autoSlideTimer = ref(null);
    const userInteracted = ref(false);

    const wrappedItems = computed(() => [
      { original: props.items[props.items.length - 1], index: props.items.length - 1 },
      ...props.items.map((item, index) => ({ original: item, index })),
      { original: props.items[0], index: 0 }
    ]);

    const innerStyle = computed(() => ({
      transform: `translateX(${currentTranslate.value}px)`,
      transition: isDragging.value ? 'none' : 'transform 0.3s ease-out'
    }));

    const getSlideWidth = () => carouselRef.value ? carouselRef.value.offsetWidth : 0;

    const setPositionByIndex = (index) => {
      currentTranslate.value = (index + 1) * -getSlideWidth();
      prevTranslate.value = currentTranslate.value;
    };

    const nextSlide = () => {
      currentIndex.value = (currentIndex.value + 1) % props.items.length;
    };

    const prevSlide = () => {
      currentIndex.value = (currentIndex.value - 1 + props.items.length) % props.items.length;
    };

    const goToSlide = (index) => {
      currentIndex.value = index;
      setPositionByIndex(index);
    };

    // User-triggered slide changes
    const userNextSlide = () => {
      userInteracted.value = true;
      stopAutoSlide();
      nextSlide();
    };

    const userPrevSlide = () => {
      userInteracted.value = true;
      stopAutoSlide();
      prevSlide();
    };

    const userGoToSlide = (index) => {
      userInteracted.value = true;
      stopAutoSlide();
      goToSlide(index);
    };

    const startDrag = (event) => {
      userInteracted.value = true;
      stopAutoSlide();
      startPos.value = event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
      isDragging.value = true;
      carouselRef.value.style.cursor = 'grabbing';
    };

    const onDrag = (event) => {
      if (isDragging.value) {
        const currentPosition = event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
        const diff = currentPosition - startPos.value;
        currentTranslate.value = prevTranslate.value + diff;
      }
    };

    const endDrag = () => {
      isDragging.value = false;
      carouselRef.value.style.cursor = 'grab';
      
      const movedBy = currentTranslate.value - prevTranslate.value;
      const slideWidth = getSlideWidth();
      
      if (Math.abs(movedBy) > slideWidth / 4) {
        if (movedBy > 0) {
          prevSlide();
        } else {
          nextSlide();
        }
      } else {
        goToSlide(currentIndex.value);
      }
    };

    const startAutoSlide = () => {
      stopAutoSlide();
      autoSlideTimer.value = setInterval(() => {
        if (!userInteracted.value) {
          nextSlide();
        } else {
          stopAutoSlide();
        }
      }, props.autoSlideInterval);
    };

    const stopAutoSlide = () => {
      if (autoSlideTimer.value) {
        clearInterval(autoSlideTimer.value);
        autoSlideTimer.value = null;
      }
    };

    const handleTransitionEnd = () => {
      if (currentIndex.value === props.items.length) {
        currentIndex.value = 0;
        setPositionByIndex(currentIndex.value);
      } else if (currentIndex.value === -1) {
        currentIndex.value = props.items.length - 1;
        setPositionByIndex(currentIndex.value);
      }
    };

    watch(currentIndex, (newIndex) => {
      setPositionByIndex(newIndex);
    });

    onMounted(() => {
      setPositionByIndex(currentIndex.value);
      startAutoSlide();
      window.addEventListener('resize', () => setPositionByIndex(currentIndex.value));
      if (carouselRef.value) {
        carouselRef.value.querySelector('.carousel-inner').addEventListener('transitionend', handleTransitionEnd);
      }
    });

    onUnmounted(() => {
      stopAutoSlide();
      window.removeEventListener('resize', () => setPositionByIndex(currentIndex.value));
      if (carouselRef.value) {
        carouselRef.value.querySelector('.carousel-inner').removeEventListener('transitionend', handleTransitionEnd);
      }
    });

    return {
      carouselRef,
      currentIndex,
      wrappedItems,
      innerStyle,
      userNextSlide,
      userPrevSlide,
      userGoToSlide,
      startDrag,
      onDrag,
      endDrag
    };
  }
};
</script>

<style lang="scss" scoped>
.carousel {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  cursor: grab;

  .carousel-inner {
    display: flex;
    height: 100%;
    will-change: transform;
  }

  .carousel-item {
    flex: 0 0 100%;
    width: 100%;
  }

  .carousel-control {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0,0,0,0.5);
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
    z-index: 10;

    &.prev { left: 10px; }
    &.next { right: 10px; }
  }

  .dot-indicator {
    position: absolute;
    bottom: 10px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
  }

  .carousel-indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.5);
    border: none;
    margin: 0 5px;
    padding: 0;
    cursor: pointer;

    &.active {
      background-color: white;
      transform: scale(1.2);
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.8);
    }

    &:focus {
      outline: 2px solid white;
      outline-offset: 2px;
    }
  }
}
</style>