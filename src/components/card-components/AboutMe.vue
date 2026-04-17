<template>
  <div class="about-me">
    <span class="seo-name">Thomas Skjerdal</span>

    <div class="ambient ambient-top" aria-hidden="true"></div>
    <div class="ambient ambient-bottom" aria-hidden="true"></div>

    <div class="quote-mark" aria-hidden="true">"</div>

    <div class="copy">
      <p class="para para-1">
        I'm from a small town, I like fishing, and I get most of my project
        ideas at times when I should <em>definitely</em> be asleep.
      </p>
      <p class="para para-2">
        My brain is basically an idea generator with no off switch. The
        downside is that I usually move on to the next "even better" idea
        before finishing the last one.
      </p>
      <p class="para para-3 punchline">
        Which makes this website kind of special. It's actual proof that,
        occasionally, I manage to finish something.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutMe',
}
</script>

<style lang="scss" scoped>
.about-me {
  height: 100%;
  width: 100%;
  padding: 0.75rem 1.1rem 1rem 0.75rem;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  color: var(--text-primary, #162033);
  isolation: isolate;
}

.seo-name {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

.ambient {
  position: absolute;
  border-radius: 999px;
  pointer-events: none;
  z-index: 0;
  opacity: 0.75;
  filter: blur(12px);
}

.ambient-top {
  width: 9rem;
  height: 9rem;
  top: -3rem;
  right: -1.85rem;
  background:
    radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0) 52%),
    radial-gradient(circle at 62% 62%, rgba(57, 99, 255, 0.24), rgba(57, 99, 255, 0) 66%);
}

.ambient-bottom {
  width: 7rem;
  height: 7rem;
  bottom: 1.1rem;
  left: -2.8rem;
  background: radial-gradient(circle at center, rgba(99, 181, 255, 0.18), rgba(99, 181, 255, 0) 70%);
}

.quote-mark,
.copy {
  position: relative;
  z-index: 1;
}

.quote-mark {
  font-size: 4.5rem;
  line-height: 0.82;
  font-family: Georgia, serif;
  color: var(--text-secondary, #3963ff);
  opacity: 0;
  margin: 0 0 -1.35rem -0.15rem;
  user-select: none;
  text-shadow: 0 10px 24px rgba(57, 99, 255, 0.12);
  animation: fadeIn 0.45s ease-out 0.05s forwards;
}

.copy {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  flex: 1;
  justify-content: center;
}

.para {
  margin: 0;
  color: rgba(22, 32, 51, 0.88);
  opacity: 0;
  font-size: 0.8rem;
  line-height: 1.5;
  letter-spacing: -0.01em;
  text-wrap: pretty;

  em {
    font-style: normal;
    font-weight: 700;
    color: var(--text-secondary, #3963ff);
  }

  &.para-1 { animation: flyInUp 0.5s ease-out 0.12s forwards; }
  &.para-2 { animation: flyInUp 0.5s ease-out 0.24s forwards; }
  &.para-3 { animation: flyInUp 0.5s ease-out 0.36s forwards; }
}

.punchline {
  margin-top: 0.05rem;
  padding: 0.7rem 0.8rem;
  border-radius: 16px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0.44)),
    linear-gradient(135deg, rgba(57, 99, 255, 0.08), rgba(57, 99, 255, 0));
  border: 1px solid rgba(255, 255, 255, 0.78);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    0 10px 24px rgba(15, 23, 42, 0.06);
  font-weight: 600;
  font-size: 0.76rem;
  line-height: 1.42;
  color: var(--text-primary, #162033);
}

@keyframes flyInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 0.22;
    transform: translateY(0);
  }
}
</style>
