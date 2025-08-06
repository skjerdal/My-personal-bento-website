<template>
  <div class="contact-social">
    
    <!-- 3D background extracted from DownloadResume -->
    <LanyardBackground />

    <!-- Contact header moved inside component -->
    <div class="header-section">
      <h1 class="contact-title">Contact</h1>
      <div class="divider"></div>
    </div>

    <div class="buttons-container">
      <div class="social-links animate-item" style="animation-delay: 0.1s;">
        <a 
        v-for="(social, index) in contactData.social" 
        :key="index" 
        :href="social.url" 
        target="_blank" 
        rel="noopener noreferrer"
        class="social-link"
        :style="`animation-delay: ${0.2 + index * 0.1}s;`"
        >
        <div class="social-link__inner">
          <div class="social-icon-container">
            <!-- LinkedIn Icon -->
            <svg v-if="social.icon === 'linkedin'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="social-icon">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
            
            <!-- GitHub Icon -->
            <svg v-if="social.icon === 'github'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="social-icon">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
          </div>
          <span class="social-name">{{ social.name }}</span>
        </div>
              </a>
      </div>
      <div class="email-section animate-item" style="animation-delay: 0.4s;" @click="handleEmailClick" @mousedown="handleEmailMouseDown" @mouseup="handleEmailMouseUp" @mouseleave="handleEmailMouseUp" :class="{ 'is-pressed': emailPressed }">
        <div class="email-section__inner">
          <div class="icon-container">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="email-icon">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </div>
          <span class="email-text">{{ contactData.email }}</span>
          <button class="copy-button" @click.stop="copyEmail" :class="{ 'copied': copied }">
            <span class="tooltip">{{ copied ? 'Copied!' : 'Copy' }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="copy-icon">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Small note at the bottom -->
      <div class="contact-note">
        <span>Always happy to chat</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { cards } from '../../data/cardContent';
import LanyardBackground from './LanyardBackground.vue';
import PaperAirplane from './PaperAirplane.vue';

export default {
  name: 'ContactSocial',
  components: { PaperAirplane, LanyardBackground },
  setup() {
    const contactData = ref(cards.find(card => card.id === 'contact').data);
    const copied = ref(false);
    const emailPressed = ref(false);

    const copyEmail = async () => {
      try {
        await navigator.clipboard.writeText(contactData.value.email);
        copied.value = true;
        setTimeout(() => {
          copied.value = false;
        }, 2000);
      } catch (err) {
        console.error('Failed to copy email:', err);
      }
    };

    const handleEmailClick = (event) => {
      // Don't trigger if clicking the copy button
      if (event.target.closest('.copy-button')) return;
      window.location.href = `mailto:${contactData.value.email}`;
    };

    const handleEmailMouseDown = (event) => {
      // Don't trigger press animation if clicking the copy button
      if (event.target.closest('.copy-button')) return;
      emailPressed.value = true;
    };

    const handleEmailMouseUp = () => {
      emailPressed.value = false;
    };

    const handleBottleClick = () => {
      // Copy email when bottle is clicked
      copyEmail();
    };
    
    return { 
      contactData,
      copied,
      emailPressed,
      copyEmail,
      handleEmailClick,
      handleEmailMouseDown,
      handleEmailMouseUp,
      handleBottleClick
    };
  }
}
</script>

<style lang="scss" scoped>
.contact-social {
  position: relative; // ensure 3D background positions correctly
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: 0 0 0.6rem 0.6rem;
  margin-right: -0.5rem;
  gap: 0.6rem;
  overflow: visible;
  
  // Ensure we inherit CSS variables from parent card
  color: var(--text-primary, #ffffff);

  .header-section {
    position: relative;
    z-index: 10;
    text-align: center;
    opacity: 0;
    animation: flyInUp 0.6s ease-out forwards;
    animation-delay: 0.1s;
    margin-top: 0.5rem;
    
    .contact-title {
      font-size: 1.4rem;
      font-weight: 600;
      margin: 0;
      line-height: 1.2;
      padding: 0.2rem 0 0.8rem 0;
      color: var(--text-primary, #ffffff);
      letter-spacing: -0.02em;
    }
    
    .divider {
      width: 60%;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      margin: 0 auto 0.8rem auto;
      opacity: 0.6;
    }
  }
  
  // Make sure content sits above the 3D canvas
  .social-links { 
    z-index: 10; 
    position: relative;
    
    .social-link {
      position: relative;
      z-index: 1; // Lower z-index to avoid stacking context issues
    }
  }
  .email-section { 
    z-index: 10; 
    position: relative;
  }

  .buttons-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    gap: 0.6rem;
    position: relative;
    z-index: 5;
    margin-top: -1.7rem;
  }

    .social-links {
    display: flex;
    gap: 0.6rem;
    width: 100%;
    min-width: 0;
    
    .social-link {
      user-select: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      height: 45px;
      font-size: 13px;
      line-height: 28px;
      letter-spacing: -0.01em;
      text-align: center;
      color: var(--text-primary, #ffffff);
      backdrop-filter: blur(8px) saturate(180%);
      -webkit-backdrop-filter: blur(8px) saturate(180%);
      --gradientBorder-size: 1px;
      --gradientBorder-gradient: linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.2) 26%, rgba(255, 255, 255, 0.1) 63%, rgba(255, 255, 255, 0.4) 100%);
      border-radius: 50px;
      transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
      background: rgba(255, 255, 255, 0.08);
      text-decoration: none;
      overflow: visible;
      min-width: 0;
      flex: 1;
      opacity: 0;
      animation: flyInUp 0.6s ease-out forwards;
      
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
      
      &:hover {
        backdrop-filter: blur(12px) saturate(200%);
        -webkit-backdrop-filter: blur(12px) saturate(200%);
        background: rgba(255, 255, 255, 0.12);
        
        .social-icon-container {
          transform: scale(1.05);
          background: rgba(255, 255, 255, 0.15);
          
          .social-icon {
            color: var(--text-primary, #ffffff);
            opacity: 0.9;
          }
        }
      }

      &:active {
        transform: scale(0.95);
      }
      
      @for $i from 1 through 2 {
        &:nth-child(#{$i}) .social-link__inner {
          animation-delay: #{$i * 0.15}s;
        }
      }
      
      .social-link__inner {
        display: flex;
        align-items: center;
        width: 100%;
        height: 100%;
        gap: 8px;
        padding: 2px 14px;
        opacity: 0;
        transform: translateY(10px);
        animation: fadeSlideUp 0.5s ease forwards;
        
        .social-icon-container {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 24px;
          height: 24px;
          background: rgba(128, 128, 128, 0.05);
          border-radius: 6px;
          margin-right: 0.4rem;
          transition: all 0.3s ease;
          
          .social-icon {
            width: 12px;
            height: 12px;
            color: var(--text-secondary, rgba(255, 255, 255, 0.8));
            transition: all 0.3s ease;
            
            &[stroke="currentColor"] {
              transform-origin: center;
              transform: scale(0.9);
            }
          }
        }
        
        .social-name {
          color: var(--text-secondary, rgba(255, 255, 255, 0.8));
          font-size: 0.8rem;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          min-width: 0;
          flex: 1;
        }
      }
    }
  }

  .email-section {
    user-select: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    height: 45px;
    font-size: 13px;
    line-height: 28px;
    letter-spacing: -0.01em;
    text-align: center;
        color: var(--text-primary, #ffffff);
    position: relative;
    z-index: 15;
  backdrop-filter: blur(8px) saturate(180%);
  -webkit-backdrop-filter: blur(8px) saturate(180%);
  box-shadow: 
    rgba(255, 255, 255, 0.1) 0px 1px 0px inset,
    rgba(0, 0, 0, 0.1) 0px 78px 51px 0px, 
    rgba(0, 0, 0, 0.07) 0px 50px 30px 0px, 
    rgba(0, 0, 0, 0.06) 0px 30px 16px 0px, 
    rgba(0, 0, 0, 0.04) 0px 16px 8px, 
    rgba(0, 0, 0, 0.04) 0px 6px 4px, 
    rgba(0, 0, 0, 0.02) 0px 2px 2px;
    --gradientBorder-size: 1px;
    --gradientBorder-gradient: linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.2) 26%, rgba(255, 255, 255, 0.1) 63%, rgba(255, 255, 255, 0.4) 100%);
    border-radius: 50px;
    transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
    background: rgba(255, 255, 255, 0.08);
    overflow: visible;
    min-width: 0;
    
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
    
    &:hover {
      backdrop-filter: blur(12px) saturate(200%);
      -webkit-backdrop-filter: blur(12px) saturate(200%);
      background: rgba(255, 255, 255, 0.12);
      box-shadow: 
        rgba(255, 255, 255, 0.15) 0px 1px 0px inset,
        rgba(0, 0, 0, 0.15) 0px 78px 51px 0px, 
        rgba(0, 0, 0, 0.1) 0px 50px 30px 0px, 
        rgba(0, 0, 0, 0.08) 0px 30px 16px 0px, 
        rgba(0, 0, 0, 0.06) 0px 16px 8px, 
        rgba(0, 0, 0, 0.06) 0px 6px 4px, 
        rgba(0, 0, 0, 0.04) 0px 2px 2px;
        
      .email-section__inner {
        .icon-container {
          transform: scale(1.05);
          background: rgba(255, 255, 255, 0.15);
          
          .email-icon {
            color: var(--text-primary, #ffffff);
            opacity: 0.9;
          }
        }

        .copy-button {
          opacity: 1;
          transform: translateX(0);
        }
      }
    }

    &.is-pressed {
      transform: scale(0.95);
      box-shadow: none;
    }
    
    .email-section__inner {
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;
      gap: 8px;
      padding: 2px 14px;
      opacity: 0;
      transform: translateY(10px);
      animation: fadeSlideUp 0.5s ease forwards;
      animation-delay: 0.4s;
      
      .icon-container {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: 24px;
        height: 24px;
        background: rgba(128, 128, 128, 0.05);
        border-radius: 6px;
        margin-right: 0.4rem;
        transition: all 0.3s ease;
        
        .email-icon {
          width: 12px;
          height: 12px;
          color: var(--text-secondary, rgba(255, 255, 255, 0.8));
          transition: all 0.3s ease;
        }
      }
      
      .email-text {
        color: var(--text-secondary, rgba(255, 255, 255, 0.8));
        font-size: 0.8rem;
        font-weight: 500;
        transition: color 0.3s ease;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 0;
        flex: 1;
      }

      .copy-button {
        flex-shrink: 0;
        user-select: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        padding: 0;
        background: rgba(105, 105, 105, 0.06);
        border: none;
        border-radius: 50px;
        opacity: 0;
        transform: translateX(10px);
        transition: all 0.3s ease;
        position: relative;
        backdrop-filter: blur(1px);
        box-shadow: rgba(0, 0, 0, 0.06) 0px 2px 4px, rgba(0, 0, 0, 0.04) 0px 1px 2px;
        --gradientBorder-size: 1px;
        --gradientBorder-gradient: linear-gradient(to bottom, rgba(255, 255, 255, 0.8), #999 30%, #bbb 70%, #fff 100%);

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

        .tooltip {
          position: absolute;
          top: -8px;
          left: 50%;
          transform: translateX(-50%) translateY(-100%);
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 0.3rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: all 0.2s ease;
          
          &::after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 50%;
            transform: translateX(-50%);
            border-left: 4px solid transparent;
            border-right: 4px solid transparent;
            border-top: 4px solid rgba(0, 0, 0, 0.8);
          }
        }

        &:hover {
          .tooltip {
            opacity: 1;
          }

          .copy-icon {
            color: var(--text-primary, #ffffff);
            opacity: 0.9;
          }
        }

        &:active {
          transform: scale(0.95);
          box-shadow: none;
        }

        &.copied {
          .copy-icon {
            color: #10B981;
          }
        }

        .copy-icon {
          width: 12px;
          height: 12px;
          color: var(--text-tertiary, rgba(255, 255, 255, 0.6));
          transition: all 0.3s ease;
        }
      }
    }
  }

  .contact-note {
    text-align: center;
    margin-top: 0.8rem;
    position: relative;
    z-index: 10;
    opacity: 0;
    animation: flyInUp 0.6s ease-out forwards;
    animation-delay: 0.6s;
    
    span {
      font-size: 0.75rem;
      color: var(--text-tertiary, rgba(255, 255, 255, 0.5));
      font-weight: 100;
      letter-spacing: 0.02em;
      font-style: italic;
    }
  }
}

@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
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
  animation: flyInLeft 0.6s ease-out forwards;
}
</style>