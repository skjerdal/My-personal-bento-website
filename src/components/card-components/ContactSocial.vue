<template>
  <div class="contact-social">
    
    <div class="social-links">
      <a 
      v-for="(social, index) in contactData.social" 
      :key="index" 
      :href="social.url" 
      target="_blank" 
      rel="noopener noreferrer"
      class="social-link"
      >
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
    </a>
  </div>
  <div class="email-section" @click="handleEmailClick">
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
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
    </button>
  </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { cards } from '../../data/cardContent';

export default {
  name: 'ContactSocial',
  setup() {
    const contactData = ref(cards.find(card => card.id === 'contact').data);
    const copied = ref(false);

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
    
    return { 
      contactData,
      copied,
      copyEmail,
      handleEmailClick
    };
  }
}
</script>

<style lang="scss" scoped>
.contact-social {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: 0.6rem;
  gap: 0.6rem;
  overflow: visible;
  
  .social-links {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.6rem;
    width: 100%;
    min-width: 0;
    
    .social-link {
      display: flex;
      align-items: center;
      padding: 0.6rem;
      background: rgba(0, 0, 0, 0.03);
      border: 1px solid rgba(0, 0, 0, 0.08);
      border-radius: 0.75rem;
      text-decoration: none;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      min-width: 0;
      opacity: 0;
      transform: translateY(10px);
      animation: fadeSlideUp 0.5s ease forwards;
      
      @for $i from 1 through 2 {
        &:nth-child(#{$i}) {
          animation-delay: #{$i * 0.15}s;
        }
      }
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
          45deg,
          rgba(0, 0, 0, 0.02) 0%,
          rgba(0, 0, 0, 0.04) 50%,
          rgba(0, 0, 0, 0.02) 100%
        );
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      &:hover {
        transform: translateY(-2px);
        border-color: rgba(0, 0, 0, 0.12);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        
        &::before {
          opacity: 1;
        }
        
        .social-icon-container {
          transform: scale(1.1);
          background: rgba(0, 0, 0, 0.08);
          
          .social-icon {
            transform: scale(1.1);
            color: rgba(0, 0, 0, 0.8);
          }
        }
      }
      
      .social-icon-container {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: 28px;
        height: 28px;
        background: rgba(0, 0, 0, 0.05);
        border-radius: 8px;
        margin-right: 0.6rem;
        transition: all 0.3s ease;
        
        .social-icon {
          width: 14px;
          height: 14px;
          color: rgba(0, 0, 0, 0.6);
          transition: all 0.3s ease;
          
          &[stroke="currentColor"] {
            transform-origin: center;
            transform: scale(0.9);
          }
        }
      }
      
      .social-name {
        color: rgba(0, 0, 0, 0.7);
        font-size: 0.85rem;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 0;
        flex: 1;
      }
    }
  }

  .email-section {
    display: flex;
    align-items: center;
    padding: 0.6rem;
    background: rgba(0, 0, 0, 0.03);
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 0.75rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: visible;
    min-width: 0;
    cursor: pointer;
    opacity: 0;
    transform: translateY(10px);
    animation: fadeSlideUp 0.5s ease forwards;
    animation-delay: 0.4s;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        45deg,
        rgba(0, 0, 0, 0.02) 0%,
        rgba(0, 0, 0, 0.04) 50%,
        rgba(0, 0, 0, 0.02) 100%
      );
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    &:hover {
      transform: translateY(-2px);
      border-color: rgba(0, 0, 0, 0.12);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      
      &::before {
        opacity: 1;
      }
      
      .icon-container {
        transform: scale(1.1);
        background: rgba(0, 0, 0, 0.08);
        
        .email-icon {
          transform: scale(1.1);
          color: rgba(0, 0, 0, 0.8);
        }
      }

      .copy-button {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    .icon-container {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: 28px;
      height: 28px;
      background: rgba(0, 0, 0, 0.05);
      border-radius: 8px;
      margin-right: 0.6rem;
      transition: all 0.3s ease;
      
      .email-icon {
        width: 14px;
        height: 14px;
        color: rgba(0, 0, 0, 0.6);
        transition: all 0.3s ease;
      }
    }
    
    .email-text {
      color: rgba(0, 0, 0, 0.7);
      font-size: 0.85rem;
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
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      padding: 0;
      background: transparent;
      border: none;
      cursor: pointer;
      opacity: 0;
      transform: translateX(10px);
      transition: all 0.3s ease;
      position: relative;

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

      &:hover .tooltip {
        opacity: 1;
      }

      &.copied {
        .copy-icon {
          color: #10B981;
        }
      }

      .copy-icon {
        width: 14px;
        height: 14px;
        color: rgba(0, 0, 0, 0.5);
        transition: all 0.3s ease;
      }

      &:hover .copy-icon {
        color: rgba(0, 0, 0, 0.8);
      }
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
</style>