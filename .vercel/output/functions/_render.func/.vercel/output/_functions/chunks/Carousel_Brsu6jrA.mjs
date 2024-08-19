import { ref, computed, watch, onMounted, onUnmounted, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderList, ssrRenderSlot, ssrRenderClass, ssrRenderAttr } from 'vue/server-renderer';
/* empty css                         */
import { _ as _export_sfc } from './index_FZzI_6SI.mjs';

const _sfc_main = {
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

function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${
    ssrRenderAttrs(mergeProps({
      class: "carousel",
      ref: "carouselRef"
    }, _attrs))
  } data-v-2da0e6cf><div class="carousel-inner" style="${
    ssrRenderStyle($setup.innerStyle)
  }" data-v-2da0e6cf><!--[-->`);
  ssrRenderList($setup.wrappedItems, (item, index) => {
    _push(`<div class="carousel-item" data-v-2da0e6cf>`);
    ssrRenderSlot(_ctx.$slots, "default", {
      item: item.original,
      index: item.index
    }, null, _push, _parent);
    _push(`</div>`);
  });
  _push(`<!--]--></div><button class="carousel-control prev" aria-label="Previous slide" data-v-2da0e6cf>&lt;</button><button class="carousel-control next" aria-label="Next slide" data-v-2da0e6cf>&gt;</button><div class="dot-indicator" data-v-2da0e6cf><!--[-->`);
  ssrRenderList($props.items, (_, index) => {
    _push(`<button class="${
      ssrRenderClass([{'active': index === $setup.currentIndex}, "carousel-indicator"])
    }"${
      ssrRenderAttr("aria-label", `Go to slide ${index + 1}`)
    } data-v-2da0e6cf></button>`);
  });
  _push(`<!--]--></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext()
  ;(ssrContext.modules || (ssrContext.modules = new Set())).add("src/components/Carousel.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined
};
const Carousel = /*#__PURE__*/_export_sfc(_sfc_main, [['ssrRender',_sfc_ssrRender],['__scopeId',"data-v-2da0e6cf"]]);

export { Carousel as C };
