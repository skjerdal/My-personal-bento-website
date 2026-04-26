# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Commands

```bash
npm run dev       # Start development server
npm run build     # Build for production (outputs to .vercel/output)
npm run preview   # Preview production build locally
```

No test or lint commands are configured.

## Architecture

Personal portfolio site at [skjerdal.me](https://skjerdal.me). Built with **Astro 5** (SSR via Vercel serverless adapter), **Vue 3** and **React 18** as UI frameworks, and **SCSS + Tailwind** for styling. Three.js is used for 3D effects.

### Data flow

All card content is defined in a single source of truth: [src/data/cardContent.ts](src/data/cardContent.ts). This exports a `Card[]` array where each entry specifies:
- Grid span (1–3 columns), responsive overrides
- Component name to render (resolved dynamically)
- Per-card CSS variable overrides and custom CSS strings
- Component-specific data passed as props
- Optional video path for hover effects

`src/pages/index.astro` iterates that array and renders a `CardWrapper.astro` per card. `CardWrapper` handles grid positioning and routes to either a **unique card** (e.g. `PokemonCard.vue`, `BoosterPackCard.vue`) or the generic `Card.vue` dynamic loader, which resolves and renders the named component from `src/components/card-components/`.

### Component hierarchy

```
index.astro
└── CardWrapper.astro
    ├── PokemonCard.vue        (unique — expandable Pokémon-style about card)
    ├── BoosterPackCard.vue    (unique — booster pack animation)
    └── Card.vue               (dynamic loader for all template cards)
        └── card-components/
            ├── WorkExperience.vue
            ├── Education.vue
            ├── ContactSocial.vue
            ├── CurrentStatus.vue
            ├── DownloadResume.vue
            └── LanyardBackground.vue
```

`VerticalTimeline.vue` is a shared sub-component used by both `WorkExperience` and `Education`.

### Grid system

CSS Grid with `auto-flow-dense`. Cards default to a 4-column layout and collapse through 3 → 2 → 1 column breakpoints defined in [src/styles/_variables.scss](src/styles/_variables.scss). Each card's `span` and `spanSmall`/`spanMedium` fields in `cardContent.ts` control column widths per breakpoint.

### Styling

- Global styles: [src/styles/global.scss](src/styles/global.scss), [src/styles/main.scss](src/styles/main.scss)
- Per-component SCSS files live in [src/components/component-style/](src/components/component-style/)
- Responsive mixins: `@include respond-to('sm' | 'md' | 'lg')`
- Per-card theming is done via CSS variable overrides injected inline from `cardContent.ts`

### PokemonCard expand mechanism

`PokemonCard.vue` supports click-to-expand via `<Teleport to="body">` to escape the parent `Card.vue`'s `overflow: hidden` and `backdrop-filter` stacking context. Key implementation details:

- **`zoom` not `scale` for display sizing**: The expanded card uses `zoom: var(--display-zoom)` for the actual size increase, with `transform: scale(0→1)` only for the open/close animation. Using `transform: scale()` alone caused child GPU layers (card-face, shine, glare) to be rasterized at the original small size and then upscaled — visibly pixelated. `zoom` is a layout-level resize so all child layers rasterize at the full display size.
- **`v-if="isMounted"` on the backdrop Teleport**: The always-enabled backdrop `<Teleport to="body">` must be gated with `v-if="isMounted"` (where `isMounted` is set in `onMounted`). Without this, Astro's SSR renders teleport markers that don't match the client DOM, causing a full hydration failure and blank page.
- **`inheritAttrs: false`**: Required because the component renders multiple root Teleport nodes (fragment), so Vue can't auto-inherit Astro's scoped CSS attribute.

### Adding a new card

1. **Template card**: Add an entry to `cardContent.ts` with `componentName` pointing to a new Vue component in `src/components/card-components/`. No routing changes needed.
2. **Unique card**: Add `isUnique: true` and a `uniqueComponent` name to the card entry, then handle that name in `CardWrapper.astro`.

---

## Coding Guidelines

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.
