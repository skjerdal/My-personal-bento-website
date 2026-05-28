<template>
  <div class="projects">
    <header class="header">
      <h2 class="title">Projects</h2>
      <span class="count">{{ projects.length }} SIDE THINGS</span>
    </header>

    <ul class="list">
      <li
        v-for="p in projects"
        :key="p.name"
        class="item"
        :class="{ clickable: true }"
        @click="open(p)"
        role="button"
        tabindex="0"
        @keydown.enter.space.prevent="open(p)"
        :aria-label="`View details for ${p.name}`"
      >
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
        <span class="arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </span>
      </li>
    </ul>

    <Teleport v-if="isMounted" to="body">
      <Transition name="modal">
        <div v-if="selected" class="modal-backdrop" @click.self="close" @keydown.esc="close">
          <div class="modal" role="dialog" :aria-label="selected.name">
            <button class="modal-close" @click="close" aria-label="Close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>

            <div class="modal-header">
              <div class="modal-icon-wrap" :style="{ background: selected.iconBg }">
                <span class="icon-inner" v-html="selected.icon"></span>
              </div>
              <div>
                <h3 class="modal-title">{{ selected.name }}</h3>
                <div class="modal-tags">
                  <span class="tag" v-for="tag in selected.tags" :key="tag">{{ tag }}</span>
                </div>
              </div>
            </div>

            <p class="modal-desc">{{ selected.detail?.longDescription || selected.description }}</p>

            <div v-if="selected.detail?.highlights?.length" class="modal-section">
              <h4 class="modal-section-title">Highlights</h4>
              <ul class="modal-highlights">
                <li v-for="h in selected.detail.highlights" :key="h">{{ h }}</li>
              </ul>
            </div>

            <div v-if="selected.detail?.stack?.length" class="modal-section">
              <h4 class="modal-section-title">Tech Stack</h4>
              <div class="modal-stack">
                <span class="stack-chip" v-for="s in selected.detail.stack" :key="s">{{ s }}</span>
              </div>
            </div>

            <div v-if="selected.detail?.url" class="modal-footer">
              <a :href="selected.detail.url" target="_blank" rel="noopener" class="modal-link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                </svg>
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'Projects',
  setup() {
    const isMounted = ref(false);
    const selected = ref(null);

    onMounted(() => { isMounted.value = true; });

    function open(p) { selected.value = p; }
    function close() { selected.value = null; }

    const projects = [
      {
        name: 'Transformer QA',
        tags: ['ML', 'TENSORFLOW'],
        description: 'Transformer encoder for extractive question answering, built from scratch on SQuAD.',
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
        iconBg: 'linear-gradient(135deg, #ffd166 0%, #f4a21e 100%)',
        detail: {
          longDescription: 'A custom transformer encoder built from scratch with TensorFlow/Keras to solve extractive question answering on the SQuAD dataset. The model identifies answer spans within context paragraphs by predicting start and end token indices. Includes 25+ documented training experiments with hyperparameter tuning and comparisons against pre-trained baselines.',
          highlights: [
            'Implemented multi-head attention, positional encoding, and transformer blocks from scratch',
            'Trained on SQuAD — baseline models achieved ~63% EM and ~69% F1-score',
            'Integrated Hugging Face tokenizers and datasets library for preprocessing',
            'Tracked all experiments with Weights & Biases',
          ],
          stack: ['Python', 'TensorFlow', 'Keras', 'Hugging Face', 'Weights & Biases'],
          url: 'https://github.com/skjerdal/Transformerbased_QA',
        },
      },
      {
        name: 'Quizzy',
        tags: ['WEB', 'VUE'],
        description: 'A quiz app with realtime multiplayer and a custom question editor.',
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>',
        iconBg: 'linear-gradient(135deg, #ffb347 0%, #ff7c2a 100%)',
        detail: {
          longDescription: 'A realtime multiplayer quiz application where players join rooms and compete live. Features a custom question editor for creating and managing question banks.',
          highlights: [
            'Realtime multiplayer with live score updates',
            'Custom question editor with multiple question types',
          ],
          stack: ['Vue 3', 'Node.js'],
          url: null,
        },
      },
      {
        name: 'CS:GO Skin Tracker',
        tags: ['DATA', 'PYTHON'],
        description: 'Tool for tracking Counter-Strike skin price trends across markets.',
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
        iconBg: 'linear-gradient(135deg, #ff6b6b 0%, #e8350a 100%)',
        detail: {
          longDescription: 'A data tool that scrapes and tracks Counter-Strike skin prices across multiple markets, visualizing price trends over time to identify trading opportunities.',
          highlights: [
            'Tracks price history across Steam Market and third-party platforms',
            'Visualizes trends to identify buy/sell windows',
          ],
          stack: ['Python', 'BeautifulSoup', 'Pandas', 'Matplotlib'],
          url: null,
        },
      },
    ];

    return { projects, selected, isMounted, open, close };
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
  font-family: var(--type-font-body);
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
  font-family: var(--type-font-heading);
  font-size: var(--type-card-title-size);
  font-style: var(--type-heading-style);
  font-weight: var(--type-card-title-weight);
  letter-spacing: 0;
  line-height: var(--type-card-title-line);
  color: var(--text-primary, #162033);
}

.count {
  font-family: var(--type-font-label);
  font-size: var(--type-label-size);
  font-weight: var(--type-label-weight);
  letter-spacing: var(--type-label-tracking);
  line-height: var(--type-label-line);
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
  cursor: pointer;

  &:hover {
    background: rgba(22, 32, 51, 0.06);
    transform: translateY(-1px);

    .arrow {
      color: #e8830a;
      background: rgba(232, 131, 10, 0.1);
    }
  }

  &:focus-visible {
    outline: 2px solid #e8830a;
    outline-offset: 2px;
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
  font-family: var(--type-font-body);
  font-size: var(--type-small-size);
  font-weight: var(--type-weight-semibold);
  color: var(--text-primary, #162033);
  letter-spacing: 0;
  line-height: var(--type-small-line);
}

.tag {
  font-family: var(--type-font-label);
  font-size: calc(var(--type-label-size) * 0.95);
  letter-spacing: 0.08em;
  line-height: var(--type-label-line);
  padding: 2px 7px;
  border-radius: 999px;
  background: rgba(232, 131, 10, 0.12);
  color: #c46d05;
  border: 1px solid rgba(232, 131, 10, 0.2);
}

.desc {
  margin: 0;
  font-size: var(--type-caption-size);
  line-height: var(--type-caption-line);
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
  transition: color 0.2s, background 0.2s;

  svg {
    width: 14px;
    height: 14px;
  }
}

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(10, 16, 30, 0.55);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.modal {
  position: relative;
  background: linear-gradient(155deg, #f8f3ea 0%, #f9fbff 58%, #eef4ff 100%);
  border: 1px solid rgba(255, 255, 255, 0.82);
  border-radius: 24px;
  box-shadow: 0 32px 64px rgba(15, 23, 42, 0.2), 0 4px 12px rgba(15, 23, 42, 0.08);
  padding: 2rem;
  max-width: 480px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  font-family: var(--type-font-body);
  color: #162033;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(22, 32, 51, 0.07);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(22, 32, 51, 0.5);
  transition: background 0.2s, color 0.2s;

  svg { width: 14px; height: 14px; }

  &:hover {
    background: rgba(22, 32, 51, 0.12);
    color: #162033;
  }
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-right: 2rem;
}

.modal-icon-wrap {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);

  .icon-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;

    :deep(svg) {
      width: 24px;
      height: 24px;
    }
  }
}

.modal-title {
  margin: 0 0 6px;
  font-family: var(--type-font-heading);
  font-size: var(--type-card-title-size);
  font-style: var(--type-heading-style);
  font-weight: var(--type-card-title-weight);
  letter-spacing: 0;
  line-height: var(--type-card-title-line);
}

.modal-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.modal-desc {
  margin: 0;
  font-size: var(--type-body-size);
  line-height: var(--type-body-line);
  color: rgba(22, 32, 51, 0.7);
}

.modal-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.modal-section-title {
  margin: 0;
  font-family: var(--type-font-label);
  font-size: var(--type-label-size);
  font-weight: var(--type-label-weight);
  letter-spacing: var(--type-label-tracking);
  line-height: var(--type-label-line);
  text-transform: uppercase;
  color: rgba(22, 32, 51, 0.45);
}

.modal-highlights {
  margin: 0;
  padding: 0 0 0 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 4px;

  li {
    font-size: var(--type-small-size);
    line-height: var(--type-small-line);
    color: rgba(22, 32, 51, 0.75);
  }
}

.modal-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.stack-chip {
  font-family: var(--type-font-label);
  font-size: var(--type-label-size);
  line-height: var(--type-label-line);
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(22, 32, 51, 0.06);
  border: 1px solid rgba(22, 32, 51, 0.1);
  color: rgba(22, 32, 51, 0.7);
}

.modal-footer {
  padding-top: 0.25rem;
  border-top: 1px solid rgba(22, 32, 51, 0.07);
}

.modal-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: var(--type-small-size);
  font-weight: var(--type-weight-semibold);
  line-height: var(--type-small-line);
  color: #162033;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 10px;
  background: rgba(22, 32, 51, 0.06);
  border: 1px solid rgba(22, 32, 51, 0.1);
  transition: background 0.2s, color 0.2s;

  svg { width: 15px; height: 15px; flex-shrink: 0; }

  &:hover {
    background: #162033;
    color: #fff;
    border-color: #162033;
  }
}

/* Transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;

  .modal {
    transition: opacity 0.2s ease, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .modal {
    opacity: 0;
    transform: scale(0.94) translateY(8px);
  }
}
</style>
