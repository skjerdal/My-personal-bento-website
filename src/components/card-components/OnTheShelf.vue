<template>
  <section class="shelf-card" aria-labelledby="shelf-title">
    <div class="shelf-head">
      <div>
        <span class="eyebrow">Currently into</span>
        <h2 id="shelf-title">On the shelf</h2>
      </div>
      <span class="count">04 picks</span>
    </div>

    <div class="display-cabinet">
      <div class="cabinet-back" aria-hidden="true"></div>
      <div class="objects">
        <article
          v-for="item in items"
          :key="item.label"
          class="object"
          :class="[`object--${item.kind}`, { featured: item.featured }]"
          :style="{ '--tilt': item.tilt, '--lift': item.lift }"
        >
          <div class="object-shadow" aria-hidden="true"></div>
          <div v-if="item.kind === 'album'" class="album-cover">
            <div class="record" aria-hidden="true"></div>
            <img :src="item.image" :alt="item.alt" />
          </div>
          <div v-else class="media-cover">
            <img :src="item.image" :alt="item.alt" />
          </div>
          <div class="caption">
            <strong>{{ item.label }}</strong>
            <span>{{ item.type }}</span>
          </div>
        </article>
      </div>
      <div class="shelf-top" aria-hidden="true"></div>
      <div class="shelf-lip" aria-hidden="true"></div>
    </div>
  </section>
</template>

<script>
const items = [
  {
    label: 'Arrival',
    type: 'Film',
    image: '/favorites/arrival.jpg',
    alt: 'Arrival poster',
    kind: 'media',
    tilt: '-4deg',
    lift: '2px',
  },
  {
    label: 'Andor',
    type: 'Series',
    image: '/favorites/andor.avif',
    alt: 'Andor poster',
    kind: 'media',
    featured: true,
    tilt: '2deg',
    lift: '-4px',
  },
  {
    label: 'New Vegas',
    type: 'Game',
    image: '/favorites/falloutnv.jpg',
    alt: 'Fallout: New Vegas cover',
    kind: 'media',
    tilt: '-1deg',
    lift: '4px',
  },
  {
    label: 'Album',
    type: 'Music',
    image: '/favorites/album.jpeg',
    alt: 'Album cover',
    kind: 'album',
    tilt: '4deg',
    lift: '0px',
  },
];

export default {
  name: 'OnTheShelf',
  setup() {
    return { items };
  },
};
</script>

<style lang="scss" scoped>
.shelf-card {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 20px 22px 0;
  box-sizing: border-box;
  overflow: hidden;
  color: var(--text-color, #1a1410);
  background:
    radial-gradient(90% 70% at 50% 0%, rgba(255, 255, 255, 0.55), transparent 62%),
    linear-gradient(180deg, #f5ecd8 0%, #eadabb 100%);
}

.shelf-head {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.eyebrow,
.count,
.caption span {
  font-family: var(--type-font-label);
  font-size: var(--type-label-size);
  font-weight: var(--type-label-weight);
  letter-spacing: 0.16em;
  line-height: var(--type-label-line);
  text-transform: uppercase;
}

.eyebrow {
  display: block;
  margin-bottom: 5px;
  color: var(--text-tertiary, #8b7e6a);
}

.count {
  margin-top: 4px;
  color: rgba(26, 20, 16, 0.44);
  white-space: nowrap;
}

h2 {
  margin: 0;
  color: var(--text-primary, #1a1410);
  font-family: var(--type-font-heading);
  font-size: clamp(2rem, 3vw, 2.35rem);
  font-style: var(--type-heading-style);
  font-weight: var(--type-card-title-weight);
  line-height: 0.92;
  letter-spacing: 0;
}

.display-cabinet {
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
  margin: 14px -6px 0;
  perspective: 900px;
}

.cabinet-back {
  position: absolute;
  inset: 6px 8px 44px;
  border: 1px solid rgba(110, 73, 35, 0.14);
  border-radius: 18px 18px 8px 8px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.34), rgba(255, 255, 255, 0.06)),
    radial-gradient(80% 70% at 50% 100%, rgba(110, 73, 35, 0.16), transparent 65%),
    #efe2c5;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.75),
    inset 0 -26px 38px rgba(98, 62, 30, 0.08);
}

.objects {
  position: absolute;
  right: 18px;
  bottom: 58px;
  left: 18px;
  z-index: 3;
  display: grid;
  grid-template-columns: 0.82fr 0.92fr 0.82fr 1.05fr;
  align-items: end;
  gap: clamp(10px, 2vw, 20px);
}

.object {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translateY(var(--lift)) rotate(var(--tilt));
  transform-origin: center bottom;
  transition: transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1);

  &:hover {
    z-index: 5;
    transform: translateY(calc(var(--lift) - 8px)) rotate(0deg);
  }
}

.object-shadow {
  position: absolute;
  right: 2px;
  bottom: 34px;
  left: 2px;
  height: 16px;
  border-radius: 50%;
  background: radial-gradient(ellipse at center, rgba(26, 20, 16, 0.26), rgba(26, 20, 16, 0.1) 46%, transparent 72%);
  filter: blur(4px);
  transform: scaleX(0.92);
}

.media-cover,
.album-cover {
  position: relative;
  z-index: 2;
  overflow: hidden;
  background: #1a1410;
  box-shadow:
    0 14px 22px -16px rgba(26, 20, 16, 0.48),
    0 2px 3px rgba(26, 20, 16, 0.14);

  img {
    width: 100%;
    height: 100%;
    border-radius: 0;
    object-fit: cover;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      linear-gradient(110deg, rgba(255, 255, 255, 0.34) 0%, transparent 24%, transparent 72%, rgba(255, 255, 255, 0.1) 100%),
      linear-gradient(90deg, rgba(0, 0, 0, 0.2), transparent 13%, transparent 88%, rgba(0, 0, 0, 0.28));
    opacity: 0.76;
  }
}

.media-cover {
  width: clamp(66px, 7.1vw, 82px);
  aspect-ratio: 0.66;
  border-radius: 3px 7px 7px 3px;

  &::before {
    content: "";
    position: absolute;
    inset: 0 auto 0 0;
    z-index: 2;
    width: 7px;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.2), rgba(0, 0, 0, 0.42));
  }
}

.featured .media-cover {
  width: clamp(72px, 7.7vw, 90px);
}

.album-cover {
  width: clamp(86px, 9.4vw, 116px);
  aspect-ratio: 1;
  padding: 4px;
  border-radius: 4px;
  overflow: visible;
  background: rgba(255, 255, 255, 0.34);
  box-shadow:
    0 16px 24px -16px rgba(26, 20, 16, 0.5),
    inset 0 0 0 1px rgba(255, 255, 255, 0.62),
    0 0 0 1px rgba(26, 20, 16, 0.18);

  img {
    position: relative;
    z-index: 2;
    border-radius: 2px;
  }

  &::after {
    inset: 4px;
    z-index: 3;
    border-radius: 2px;
  }
}

.record {
  position: absolute;
  top: 8px;
  right: -44%;
  z-index: 1;
  width: 86%;
  aspect-ratio: 1;
  border-radius: 50%;
  background:
    radial-gradient(circle, #d66b2a 0 12%, #19130f 13% 19%, transparent 20%),
    repeating-radial-gradient(circle, #17120f 0 3px, #28201b 3px 5px);
  box-shadow: 0 8px 14px rgba(26, 20, 16, 0.24);
}

.caption {
  position: relative;
  z-index: 4;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  width: 100%;
  margin-top: 11px;
  color: var(--text-primary, #1a1410);
  text-align: center;
  transform: rotate(calc(var(--tilt) * -1));

  strong {
    max-width: 110px;
    overflow: hidden;
    font-size: 12px;
    font-weight: var(--type-weight-semibold);
    line-height: 1.1;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span {
    color: rgba(26, 20, 16, 0.48);
    font-size: 8px;
    letter-spacing: 0.12em;
  }
}

.shelf-top {
  position: absolute;
  right: 8px;
  bottom: 37px;
  left: 8px;
  z-index: 2;
  height: 18px;
  border-radius: 7px 7px 2px 2px;
  background:
    linear-gradient(90deg, rgba(255, 232, 190, 0.25), transparent 22%, rgba(62, 34, 18, 0.12) 58%, transparent),
    linear-gradient(180deg, #c59058 0%, #9f6a37 100%);
  box-shadow:
    inset 0 2px 0 rgba(255, 229, 188, 0.48),
    inset 0 -3px 6px rgba(70, 37, 18, 0.22),
    0 8px 18px rgba(26, 20, 16, 0.16);
}

.shelf-lip {
  position: absolute;
  right: 2px;
  bottom: 17px;
  left: 2px;
  z-index: 1;
  height: 23px;
  border-radius: 0 0 10px 10px;
  background:
    linear-gradient(180deg, #7b4d29 0%, #5f351c 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 225, 185, 0.22),
    inset 0 -5px 9px rgba(35, 17, 8, 0.26);
}

@media (max-width: 700px) {
  .shelf-card {
    padding: 18px 16px 0;
  }

  .count {
    display: none;
  }

  .display-cabinet {
    margin-inline: -4px;
  }

  .objects {
    right: 12px;
    left: 12px;
    gap: 8px;
  }

  .caption strong {
    max-width: 76px;
    font-size: 10px;
  }

  .caption span {
    display: none;
  }
}
</style>
