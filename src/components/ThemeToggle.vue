<template>
  <div class="theme-toggle">
    <div class="toggle-switch" @click="toggleTheme" :class="{ 'dark-mode': currentTheme === 'dark' }">
      <div class="toggle-icon light-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
      </div>
      <div class="toggle-icon dark-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
      </div>
      <div class="toggle-circle"></div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const currentTheme = ref('light');
    
    // Toggle between light and dark themes
    const toggleTheme = () => {
      const newTheme = currentTheme.value === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
    };
    
    // Set theme by adding appropriate class to document body
    const setTheme = (themeName) => {
      if (typeof document === 'undefined') return;
      
      // Remove all theme classes
      document.body.classList.remove('theme-dark', 'theme-light');
      
      // Add new theme class
      document.body.classList.add(`theme-${themeName}`);
      
      // Save preference to localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('preferred-theme', themeName);
      }
      
      currentTheme.value = themeName;
    };
    
    // Load saved theme on mount
    onMounted(() => {
      if (typeof localStorage !== 'undefined' && typeof document !== 'undefined') {
        const savedTheme = localStorage.getItem('preferred-theme');
        if (savedTheme) {
          setTheme(savedTheme);
        } else {
          // Set light theme as default
          setTheme('light');
        }
      }
    });
    
    return {
      currentTheme,
      setTheme,
      toggleTheme
    };
  }
};
</script>

<style lang="scss" scoped>
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-switch {
  position: relative;
  width: 50px;
  height: 24px;
  background-color: rgba(230, 230, 230, 0.7);
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4px);
  transition: all 0.3s ease;
  border: 1px solid rgba(200, 200, 200, 0.5);
  
  &.dark-mode {
    background-color: rgba(50, 50, 60, 0.8);
    border-color: rgba(70, 70, 80, 0.5);
  }
  
  .toggle-icon {
    z-index: 1;
    color: #333;
    height: 16px;
    width: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &.dark-icon {
      color: #fff;
    }
  }
  
  .toggle-circle {
    position: absolute;
    left: 3px;
    top: 3px;
    width: 18px;
    height: 18px;
    background-color: white;
    border-radius: 50%;
    transition: transform 0.3s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }
  
  &.dark-mode .toggle-circle {
    transform: translateX(26px);
    background-color: #32343a;
  }
}
</style> 