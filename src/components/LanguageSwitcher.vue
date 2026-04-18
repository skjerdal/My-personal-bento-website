<template>
  <button
    class="lang-flag-btn"
    @click="toggle"
    :aria-label="lang === 'en' ? 'Bytt til norsk' : 'Switch to English'"
    :title="lang === 'en' ? 'Bytt til norsk' : 'Switch to English'"
  >
    <!-- UK flag -->
    <svg v-if="lang === 'en'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" class="flag">
      <rect width="60" height="30" fill="#012169"/>
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="white" stroke-width="6"/>
      <path d="M0,0 L60,30" stroke="#C8102E" stroke-width="4"/>
      <path d="M60,0 L0,30" stroke="#C8102E" stroke-width="4"/>
      <path d="M30,0 V30 M0,15 H60" stroke="white" stroke-width="10"/>
      <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" stroke-width="6"/>
    </svg>
    <!-- Norway flag -->
    <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 16" class="flag">
      <rect width="22" height="16" fill="#EF2B2D"/>
      <rect x="6" width="4" height="16" fill="white"/>
      <rect y="6" width="22" height="4" fill="white"/>
      <rect x="7" width="2" height="16" fill="#002868"/>
      <rect y="7" width="22" height="2" fill="#002868"/>
    </svg>
  </button>
</template>

<script>
import { computed } from 'vue'
import { currentLang, setLang, initLang } from '../stores/language'

export default {
  name: 'LanguageSwitcher',
  setup() {
    initLang()
    const lang = computed(() => currentLang.value)

    function toggle() {
      setLang(lang.value === 'en' ? 'no' : 'en')
    }

    return { lang, toggle }
  }
}
</script>

<style scoped>
.lang-flag-btn {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  padding: 0;
  overflow: hidden;
}

.flag {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: block;
}

.lang-flag-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.lang-flag-btn:active {
  transform: scale(0.95);
}

:global(.theme-dark) .lang-flag-btn {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.12);
}
</style>
