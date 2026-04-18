import { ref } from 'vue'

export type Lang = 'en' | 'no'

export const currentLang = ref<Lang>('en')

export function initLang() {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('lang') as Lang
    if (stored === 'en' || stored === 'no') {
      currentLang.value = stored
    }
    document.documentElement.lang = currentLang.value === 'no' ? 'nb' : 'en'
  }
}

export function setLang(lang: Lang) {
  currentLang.value = lang
  if (typeof window !== 'undefined') {
    localStorage.setItem('lang', lang)
    document.documentElement.lang = lang === 'no' ? 'nb' : 'en'
  }
}
