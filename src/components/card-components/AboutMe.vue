<template>
  <div class="about-me">
    <span class="seo-name">Thomas Skjerdal</span>

    <div class="name-section">
      <img class="avatar" src="/profilbilde.png" alt="Thomas Skjerdal" />
      <p class="eyebrow">{{ t.eyebrow }}</p>
      <h1 class="name">Thomas <em>Skjerdal</em></h1>
    </div>

    <p class="bio" v-html="t.bio"></p>

    <div class="tags">
      <span class="tag" v-for="tag in tags" :key="tag">{{ tag }}</span>
    </div>

    <div class="status-line">
      <span class="status-dot" aria-hidden="true"></span>
      <span>{{ t.status }}</span>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { currentLang, initLang } from '../../stores/language';
import { translations } from '../../i18n/translations';

export default {
  name: 'AboutMe',
  setup() {
    initLang();
    const t = computed(() => translations[currentLang.value].aboutMe);
    const tags = ['Vue · TypeScript · Python', 'AI / ML', 'Full-stack'];
    return { t, tags };
  }
}
</script>

<style lang="scss" scoped>
.about-me {
  height: 100%;
  width: 100%;
  padding: 1.35rem 1.25rem 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  box-sizing: border-box;
  font-family: var(--font-sans);
  color: var(--text-primary, #162033);
}

.seo-name {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

.name-section {
  display: block;
}

.avatar {
  float: right;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 0 0.5rem 1rem;
  border: 2px solid rgba(255, 255, 255, 0.9);
  box-shadow:
    0 0 0 4px rgba(232, 131, 10, 0.15),
    0 0 18px rgba(232, 131, 10, 0.35),
    0 0 40px rgba(232, 131, 10, 0.18),
    0 4px 12px rgba(0, 0, 0, 0.12);
}

.eyebrow {
  margin: 0 0 0.3rem;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(22, 32, 51, 0.55);
}

.name {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(2.15rem, 4vw, 2.75rem);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.02em;
  color: var(--text-primary, #162033);

  em {
    font-style: normal;
    color: #e8830a;
  }
}

.bio {
  margin: 0;
  font-family: var(--font-sans);
  font-size: 0.8rem;
  line-height: 1.55;
  color: var(--text-primary, #162033);
  opacity: 0.82;
  text-wrap: pretty;
  flex: 1;
  clear: both;

  :deep(strong) {
    font-weight: 500;
    opacity: 1;
    color: var(--text-primary, #162033);
  }
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  padding: 5px 11px;
  border-radius: 999px;
  border: 1px solid rgba(22, 32, 51, 0.18);
  background: rgba(22, 32, 51, 0.04);
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-primary, #162033);
}

.status-line {
  display: flex;
  align-items: center;
  gap: 7px;
  font-family: var(--font-sans);
  font-size: 0.72rem;
  color: rgba(22, 32, 51, 0.55);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f59e0b;
  flex-shrink: 0;
  box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.25);
  animation: pulse 2.4s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.25); }
  50%       { box-shadow: 0 0 0 5px rgba(245, 158, 11, 0.1); }
}
</style>
