<template>
  <div class="contact-social">
    <div class="email-section">
      <div class="icon-container">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="email-icon">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
          <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
      </div>
      <a :href="`mailto:${contactData.email}`" class="email-link">{{ contactData.email }}</a>
    </div>
    
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
  </div>
</template>

<script>
import { ref } from 'vue';
import { cards } from '../../data/cardContent';

export default {
  name: 'ContactSocial',
  setup() {
    const contactData = ref(cards.find(card => card.id === 'contact').data);
    
    return { contactData };
  }
}
</script>

<style lang="scss" scoped>
.contact-social {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  padding: 1rem;
  
  .email-section {
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 1rem;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }
    
    .icon-container {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      margin-right: 1rem;
      
      .email-icon {
        width: 20px;
        height: 20px;
        color: #f0f0f0;
      }
    }
    
    .email-link {
      color: #f0f0f0;
      text-decoration: none;
      font-size: 1rem;
      transition: color 0.3s ease;
      
      &:hover {
        color: #ffffff;
      }
    }
  }
  
  .social-links {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    
    .social-link {
      display: flex;
      align-items: center;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 1rem;
      text-decoration: none;
      transition: all 0.3s ease;
      
      &:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: translateY(-2px);
      }
      
      .social-icon-container {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        margin-right: 1rem;
        
        .social-icon {
          width: 20px;
          height: 20px;
          color: #f0f0f0;
        }
      }
      
      .social-name {
        color: #f0f0f0;
        font-size: 1rem;
      }
    }
  }
}
</style>