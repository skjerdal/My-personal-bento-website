<template>
  <div class="about-me">
    <span class="seo-name">Thomas Skjerdal</span>

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

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
  padding: 1.4rem 1.5rem 1.3rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-sizing: border-box;
  font-family: "Geist", system-ui, sans-serif;
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
  width: 64px;
  height: 64px;
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
  font-family: "JetBrains Mono", ui-monospace, monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(22, 32, 51, 0.55);
}

.name {
  margin: 0;
  font-family: "Instrument Serif", Georgia, serif;
  font-size: clamp(2.6rem, 5.5vw, 3.6rem);
  font-weight: 400;
  line-height: 1;
  letter-spacing: -0.01em;
  color: var(--text-primary, #162033);

  em {
    font-style: italic;
    color: #e8830a;
  }
}

.bio {
  margin: 0;
  font-family: "Geist", system-ui, sans-serif;
  font-size: 0.84rem;
  line-height: 1.65;
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
  font-family: "JetBrains Mono", ui-monospace, monospace;
  font-size: 11px;
  color: var(--text-primary, #162033);
}

.status-line {
  display: flex;
  align-items: center;
  gap: 7px;
  font-family: "Geist", system-ui, sans-serif;
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
