<template>
  <div class="projects">
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

    <header class="header">
      <h2 class="title">Projects</h2>
      <span class="count">{{ projects.length }} SIDE THINGS</span>
    </header>

    <ul class="list">
      <li v-for="p in projects" :key="p.name" class="item">
        <div class="icon-wrap" :style="{ background: p.iconBg }">
          <span class="icon-inner" v-html="p.icon"></span>
        </div>
        <div class="info">
          <div class="name-row">
            <span class="name">{{ p.name }}</span>
            <span class="tag" v-for="tag in p.tags" :key="tag">{{ tag }}</span>
          </div>
          <p class="desc">{{ p.description }}</p>
        </div>
        <a v-if="p.url" :href="p.url" target="_blank" rel="noopener" class="arrow" :aria-label="`View ${p.name}`">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
        <span v-else class="arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Projects',
  setup() {
    const projects = [
      {
        name: 'Quizzy',
        tags: ['WEB', 'VUE'],
        description: 'A quiz app with realtime multiplayer and a custom question editor.',
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>',
        iconBg: 'linear-gradient(135deg, #ffb347 0%, #ff7c2a 100%)',
        url: null,
      },
      {
        name: 'TinyTransformer',
        tags: ['ML', 'PYTORCH'],
        description: 'A transformer language model built from scratch, from attention to training loop.',
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
        iconBg: 'linear-gradient(135deg, #ffd166 0%, #f4a21e 100%)',
        url: null,
      },
      {
        name: 'CS:GO Skin Tracker',
        tags: ['DATA', 'PYTHON'],
        description: 'Tool for tracking Counter-Strike skin price trends across markets.',
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
        iconBg: 'linear-gradient(135deg, #ff6b6b 0%, #e8350a 100%)',
        url: null,
      },
    ];
    return { projects };
  }
}
</script>

<style lang="scss" scoped>
.projects {
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

.header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
}

.title {
  margin: 0;
  font-family: "Instrument Serif", Georgia, serif;
  font-size: 1.75rem;
  font-weight: 400;
  line-height: 1;
  color: var(--text-primary, #162033);
}

.count {
  font-family: "JetBrains Mono", ui-monospace, monospace;
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(22, 32, 51, 0.45);
  white-space: nowrap;
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 16px;
  background: rgba(22, 32, 51, 0.035);
  border: 1px solid rgba(22, 32, 51, 0.07);
  transition: background 0.2s, transform 0.2s;
  cursor: default;

  &:hover {
    background: rgba(22, 32, 51, 0.06);
    transform: translateY(-1px);
  }
}

.icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  .icon-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;

    :deep(svg) {
      width: 20px;
      height: 20px;
    }
  }
}

.info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.name {
  font-family: "Geist", system-ui, sans-serif;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-primary, #162033);
  letter-spacing: -0.01em;
}

.tag {
  font-family: "JetBrains Mono", ui-monospace, monospace;
  font-size: 9.5px;
  letter-spacing: 0.08em;
  padding: 2px 7px;
  border-radius: 999px;
  background: rgba(232, 131, 10, 0.12);
  color: #c46d05;
  border: 1px solid rgba(232, 131, 10, 0.2);
}

.desc {
  margin: 0;
  font-size: 0.75rem;
  line-height: 1.5;
  color: rgba(22, 32, 51, 0.55);
}

.arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  color: rgba(22, 32, 51, 0.3);
  text-decoration: none;
  transition: color 0.2s, background 0.2s;

  svg {
    width: 14px;
    height: 14px;
  }

  &:hover {
    color: #e8830a;
    background: rgba(232, 131, 10, 0.1);
  }
}
</style>
