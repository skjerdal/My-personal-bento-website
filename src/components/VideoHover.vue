<template>
  <div class="video-icon-container">
    <video
      ref="videoRef"
      :src="videoPath"
      class="video-icon"
      :class="{ 'video-playing': isPlaying }"
      muted
      preload="metadata"
      playsinline
      @loadeddata="handleVideoLoaded"
      @error="handleVideoError"
      @ended="handleVideoEnded"
    >
      Your browser does not support the video tag.
    </video>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue';

export default {
  props: {
    videoPath: {
      type: String,
      required: true
    },
    isCardHovered: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const videoRef = ref(null);
    const isPlaying = ref(false);
    const shouldStopAfterLoop = ref(false);

    const startVideo = () => {
      if (videoRef.value) {
        videoRef.value.play().then(() => {
          isPlaying.value = true;
          shouldStopAfterLoop.value = false;
        }).catch(error => {
          console.warn('Video play failed:', error);
        });
      }
    };

    const handleVideoEnded = () => {
      if (shouldStopAfterLoop.value) {
        isPlaying.value = false;
        shouldStopAfterLoop.value = false;
      } else if (props.isCardHovered) {
        // If card is still hovered, restart the video
        videoRef.value.currentTime = 0;
        videoRef.value.play();
      }
    };

    const handleVideoLoaded = () => {
      console.log('Video loaded successfully:', props.videoPath);
    };

    const handleVideoError = (error) => {
      console.error('Video error:', error);
    };

    // Watch for card hover state changes
    watch(() => props.isCardHovered, (newHovered) => {
      if (newHovered) {
        startVideo();
      } else {
        // Mark to stop after current loop completes
        shouldStopAfterLoop.value = true;
      }
    });

    onMounted(() => {
      // Ensure video is muted for autoplay policies
      if (videoRef.value) {
        videoRef.value.muted = true;
      }
    });

    onUnmounted(() => {
      if (videoRef.value) {
        videoRef.value.pause();
        videoRef.value.src = '';
      }
    });

    return {
      videoRef,
      isPlaying,
      handleVideoLoaded,
      handleVideoError,
      handleVideoEnded
    };
  }
};
</script>

<style lang="scss" scoped>
@import '../styles/variables';
@import '../styles/mixins';

.video-icon-container {
  display: inline-block;
  margin-left: 8px;
  vertical-align: middle;
}

.video-icon {
  width: 90px;
  height: 90px;
  border-radius: 6px;
  object-fit: contain;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  
  &.video-playing {
    opacity: 1;
  }
  
  &:hover {
    opacity: 1;
  }
}
</style> 