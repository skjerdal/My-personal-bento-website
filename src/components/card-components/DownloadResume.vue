<template>
  <div class="download-resume">
    <!-- Content Overlay -->
    <div class="content-wrapper">
      <h2 class="section-title animate-item" style="animation-delay: 0.1s;">Resume</h2>
      <p class="description animate-item" style="animation-delay: 0.2s;">Download my latest resume to learn more about my experience and skills.</p>
      
      <button class="download-button animate-item" style="animation-delay: 0.3s;" @click="downloadResume">
        <div class="button-bg"></div>
        <span class="button-text">Download Resume</span>
        <svg class="download-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7,10 12,15 17,10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
      </button>
    </div>
    
    <!-- Dot Pattern at Bottom -->
    <div class="dot-pattern"></div>
  </div>
</template>

<script>
export default {
  name: 'DownloadResume',
  methods: {
    downloadResume() {
      // You can replace this with your actual resume file path
      const resumeUrl = '/resume.pdf'; // Place your resume.pdf in the public folder
      
      // Create a temporary link element and trigger download
      const link = document.createElement('a');
      link.href = resumeUrl;
      link.download = 'Thomas_Skjerdal_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
</script>

<style lang="scss" scoped>
.download-resume {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: 0 0 0.6rem 0.6rem;
  margin-right: -0.5rem;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  
  .content-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem;
    flex: 1;
    justify-content: flex-start;
    padding-top: 4rem;
    position: relative;
    z-index: 2;
  }
  
  .section-title {
    font-size: 1.4rem;
    font-weight: 700;
    margin: 0;
    color: inherit;
  }
  
  .description {
    font-size: 0.8rem;
    line-height: 1.4;
    color: rgba(0, 0, 0, 0.8);
    margin: 0;
    max-width: 250px;
  }
  
  .download-button {
    position: relative;
    display: inline-flex;
    padding: 16px 35px;
    color: rgb(0, 0, 0);
    font-weight: 600;
    font-size: 14px;
    line-height: 100%;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: rgba(105, 105, 105, 0.04);
    box-shadow: rgba(0, 0, 0, 0.12) 0px 30.0444px 16.2444px, rgba(0, 0, 0, 0.07) 0px 15.6px 8.2875px, rgba(0, 0, 0, 0.04) 0px 6.35556px 4.15556px;
    will-change: transform;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    --gradientBorder-size: 1px;
    --gradientBorder-gradient: linear-gradient(178.8deg, rgba(255, 255, 255, 0.2464) 10.85%, rgba(20, 20, 20, 0.46) 24.36%, rgba(50, 50, 50, 0.46) 73.67%, rgba(255, 255, 255, 0.46) 90.68%);
    backdrop-filter: blur(10px);
    border-radius: 99px;
    border: none;
    overflow: hidden;
    cursor: pointer;
    user-select: none;
    
    &::before {
      content: "";
      pointer-events: none;
      user-select: none;
      position: absolute;
      top: 0px;
      right: 0px;
      bottom: 0px;
      left: 0px;
      border-radius: inherit;
      padding: var(--gradientBorder-size);
      background: var(--gradientBorder-gradient);
      mask: linear-gradient(black, black) content-box exclude, linear-gradient(black, black);
    }
    
    &:active {
      transform: translateY(2px) scale(0.96) !important;
      box-shadow: none !important;
    }
    
    .button-text {
      font-weight: 600;
      letter-spacing: -0.01em;
      z-index: 1;
      position: relative;
    }
    
    .download-icon {
      width: 16px;
      height: 16px;
      transition: transform 0.2s ease;
      z-index: 1;
      position: relative;
      opacity: 0.9;
    }
  }
  
  .dot-pattern {
    position: absolute;
    bottom: 0;
    left: 0;
    right: -8px;
    height: 170px;
    background-image: radial-gradient(circle, rgba(255, 102, 0, 0.329) 1px, transparent 1px);
    background-size: 8px 8px;
    background-position: 0 0, 4px 4px;
    opacity: 0.6;
    z-index: 1;
    mask: radial-gradient(ellipse at center bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.8) 30%, rgba(0, 0, 0, 0.3) 60%, rgba(0, 0, 0, 0) 100%);
    -webkit-mask: radial-gradient(ellipse at center bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.8) 30%, rgba(0, 0, 0, 0.3) 60%, rgba(0, 0, 0, 0) 100%);
  }
}

@keyframes flyInUp {
  0% {
    transform: translateY(20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes flyInLeft {
  0% {
    transform: translateX(-30px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-item {
  opacity: 0;
  animation: flyInUp 0.6s ease-out forwards;
}
</style>