<template>
  <div class="current-status">
    <!-- Header section -->
    <div class="header-section">
      <h1 class="status-title">Current Status</h1>
      <div class="divider"></div>
    </div>

    <div class="status-header animate-item" style="animation-delay: 0.2s;">
      <div class="status-indicator">
        <div class="status-dot"></div>
        <span class="status-text">Active</span>
      </div>
    </div>
    
    <div class="status-content">
      <div class="info-section animate-item" style="animation-delay: 0.3s;">
        <a 
          href="https://www.ntnu.no/studier/midt" 
          target="_blank" 
          rel="noopener noreferrer"
          class="info-card clickable-card"
        >
          <div class="card-icon">🎓</div>
          <div class="card-content">
            <div class="card-title">MSc Student in AI</div>
            <div class="card-subtitle">NTNU</div>
          </div>
        </a>
        <a 
          href="https://omega365.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          class="info-card clickable-card"
        >
          <div class="card-icon">💼</div>
          <div class="card-content">
            <div class="card-title">Part-time Developer</div>
            <div class="card-subtitle">Omega 365 Solutions</div>
          </div>
        </a>
      </div>
      
      <div class="focus-section animate-item" style="animation-delay: 0.5s;">
        <h4>Current Focus</h4>
        <div class="focus-tags">
          <span class="pill focus-pill pill-animate" style="animation-delay: 0.6s;">ML & AI</span>
          <span class="pill focus-pill pill-animate" style="animation-delay: 0.7s;">Software Engineering</span>
          <span class="pill focus-pill pill-animate" style="animation-delay: 0.8s;">SQL</span>
          <span class="pill focus-pill pill-animate" style="animation-delay: 0.9s;">Vue.js</span>
        </div>
      </div>
      
      <div class="status-footer animate-item" style="animation-delay: 1.1s;">
        <div class="location">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="location-icon">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          Trondheim, Norway
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CurrentStatus'
}
</script>

<style lang="scss" scoped>
@import '../../styles/color-theme.scss';

.current-status {
  height: 100%;
  width: 100%;
  padding: 0.8rem 0 0.6rem 0.6rem;
  margin-right: -0.5rem;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  gap: 0.6rem;
  
  .header-section {
    text-align: center;
    opacity: 0;
    animation: flyInUp 0.6s ease-out forwards;
    animation-delay: 0.1s;
    
    .status-title {
      font-size: 1.4rem;
      font-weight: 600;
      margin: 0;
      line-height: 1.2;
      padding: 0.2rem 0 0.8rem 0;
      color: var(--text-primary, #ffffff);
      letter-spacing: -0.02em;
    }
    
    .divider {
        margin-top: -5px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
  }
  
  .status-header {
    margin-bottom: 0.5rem;
    
    .status-indicator {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      
      .status-dot {
        width: 6px;
        height: 6px;
        background-color: #00ff88;
        border-radius: 50%;
        animation: pulse 2s infinite;
      }
      
      .status-text {
        font-size: 0.7rem;
        font-weight: 500;
        color: #00ff88;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }
  }
  
  .status-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    width: 100%;
    box-sizing: border-box;
  }
  
  .info-section {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    
    .info-card {
      position: relative;
      display: flex;
      align-items: center;
      gap: 0.8rem;
      padding: 0.8rem;
      border-radius: 12px;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 2.2);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 0 15px rgba(0, 0, 0, 0.05);
      text-decoration: none;
      color: inherit;
      
      &.clickable-card {
        cursor: pointer;
        
        &:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 20px rgba(0, 0, 0, 0.2), 0 0 35px rgba(0, 0, 0, 0.1);
        }
        
        &:active {
          transform: translateY(-1px);
        }
      }
      
      // Glass filter layer
      &::before {
        content: '';
        position: absolute;
        inset: 0;
        z-index: 0;
        backdrop-filter: blur(10px);
        background: rgba(255, 255, 255, 0.08);
      }
      
      // Glass specular highlight layer  
      &::after {
        content: '';
        position: absolute;
        inset: 0;
        z-index: 1;
        border-radius: inherit;
        box-shadow: inset 1px 1px 0 rgba(255, 255, 255, 0.3),
                    inset 0 0 8px rgba(255, 255, 255, 0.1);
        pointer-events: none;
      }
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15), 0 0 25px rgba(0, 0, 0, 0.08);
        
        &::before {
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(12px);
        }
        
        &::after {
          box-shadow: inset 1px 1px 0 rgba(255, 255, 255, 0.4),
                      inset 0 0 12px rgba(255, 255, 255, 0.15);
        }
      }
      
      .card-icon {
        font-size: 1.2rem;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        position: relative;
        z-index: 2;
      }
      
      .card-content {
        display: flex;
        flex-direction: column;
        gap: 0.1rem;
        flex: 1;
        min-width: 0;
        position: relative;
        z-index: 2;
        
        .card-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary, #ffffff);
          line-height: 1.2;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }
        
        .card-subtitle {
          font-size: 0.75rem;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.2;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }
      }
    }
  }
  
  .focus-section {
    display: flex;
    flex-direction: column;
    
    h4 {
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--text-primary, #ffffff);
      margin: 0 0 0.6rem 0;
      opacity: 0.9;
      letter-spacing: 0.02em;
    }
    
    .focus-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      align-content: flex-start;
    }
  }
  
  .pill {
    padding: 0.25rem 0.7rem;
    border-radius: 20px;
    font-size: 0.7rem;
    font-weight: 600;
    white-space: nowrap;
    border: 1.5px solid;
    transition: all 0.2s ease;
    
    &.focus-pill {
      background: rgba(127, 169, 248, 0.15);
      color: #7fa9f8;
      border-color: rgba(127, 169, 248, 0.4);
      
      &:hover {
        background: rgba(127, 169, 248, 0.25);
        border-color: rgba(127, 169, 248, 0.6);
      }
    }
  }
  
  .status-footer {
    margin-top: auto;
    padding-top: 0.6rem;
    
    .location {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.7);
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      
      .location-icon {
        width: 12px;
        height: 12px;
        flex-shrink: 0;
      }
    }
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
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

@keyframes pillPop {
  0% {
    transform: scale(0.8) translateY(10px);
    opacity: 0;
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

.animate-item {
  opacity: 0;
  animation: flyInLeft 0.6s ease-out forwards;
}

.pill-animate {
  opacity: 0;
  animation: pillPop 0.4s ease-out forwards;
}
</style>