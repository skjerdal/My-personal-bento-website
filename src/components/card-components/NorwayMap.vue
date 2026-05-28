<template>
  <div class="norway-map">
    <div class="map-head">
      <h3>Norway</h3>
      <span>N 60.39 E 5.32</span>
    </div>

    <div class="map-wrap">
      <div ref="mapContainer" class="map-container"></div>
      <div class="map-overlay" aria-label="Location legend">
        <div class="map-legend">
          <div v-for="(loc, index) in locations" :key="loc.name" class="leg-row">
            <div class="leg-num" :class="{ active: index === locations.length - 1 }">
              {{ index + 1 }}
            </div>
            <strong>{{ loc.name }}</strong>
            <span>{{ loc.shortLabel }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';

const LOCATIONS = [
  {
    name: 'Aurland',
    label: 'Hometown',
    shortLabel: 'Home',
    coords: [60.9076, 7.1836],
    mapsUrl: 'https://maps.google.com/?q=Aurland,Norway',
  },
  {
    name: 'Bergen',
    label: 'B.Eng / HVL',
    shortLabel: 'B.Eng',
    coords: [60.3913, 5.3221],
    mapsUrl: 'https://maps.google.com/?q=Bergen,Norway',
  },
  {
    name: 'Trondheim',
    label: 'M.Sc / NTNU',
    shortLabel: 'M.Sc',
    coords: [63.4305, 10.3951],
    mapsUrl: 'https://maps.google.com/?q=Trondheim,Norway',
  },
];

export default {
  name: 'NorwayMap',
  setup() {
    const mapContainer = ref(null);
    let mapInstance = null;

    onMounted(async () => {
      const { default: L } = await import('leaflet');

      mapInstance = L.map(mapContainer.value, {
        zoomControl: false,
        scrollWheelZoom: false,
        attributionControl: false,
        dragging: true,
        tap: true,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      }).addTo(mapInstance);

      L.control.zoom({ position: 'bottomright' }).addTo(mapInstance);

      L.control
        .attribution({
          position: 'bottomleft',
          prefix: false,
        })
        .addAttribution(
          '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        )
        .addTo(mapInstance);

      const route = L.polyline(LOCATIONS.map((location) => location.coords), {
        color: '#d06a2a',
        weight: 2,
        opacity: 0.72,
        dashArray: '4 7',
        lineCap: 'round',
      }).addTo(mapInstance);

      const createPinIcon = (number, isActive) =>
        L.divIcon({
          html: `<div class="map-pin ${isActive ? 'active' : ''}">${number}</div>`,
          className: 'map-pin-shell',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
          popupAnchor: [0, -16],
        });

      LOCATIONS.forEach((loc, index) => {
        const popupContent = `
          <div class="map-pop">
            <div class="pop-title">${loc.name}</div>
            <div class="pop-sub">${loc.label}</div>
            <a href="${loc.mapsUrl}" target="_blank" rel="noopener noreferrer" class="pop-link">
              Open in Maps
            </a>
          </div>`;

        L.marker(loc.coords, {
          icon: createPinIcon(index + 1, index === LOCATIONS.length - 1),
        })
          .bindPopup(popupContent, { closeButton: false, maxWidth: 190 })
          .addTo(mapInstance);
      });

      mapInstance.fitBounds(route.getBounds(), { padding: [26, 34] });

      // Re-render after card fly-in animation settles.
      setTimeout(() => mapInstance?.invalidateSize(), 450);
    });

    onUnmounted(() => {
      mapInstance?.remove();
      mapInstance = null;
    });

    return { mapContainer, locations: LOCATIONS };
  },
};
</script>

<!-- Leaflet base styles (non-scoped so they apply inside the map container) -->
<style src="leaflet/dist/leaflet.css"></style>

<style lang="scss" scoped>
.norway-map {
  height: 100%;
  margin-right: -0.5rem;
  width: calc(100% + 0.5rem);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 22px;
  background: #faf5e8;
  color: #1a1410;
}

.map-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  flex: 0 0 auto;
  padding: 16px 18px 10px;
  border-bottom: 1px solid rgba(26, 20, 16, 0.1);
}

.map-head h3 {
  margin: 0;
  color: #1a1410;
  font-family: var(--type-font-heading, "Instrument Serif", Georgia, serif);
  font-size: 22px;
  font-style: italic;
  font-weight: 400;
  line-height: 1;
}

.map-head span {
  color: #8b7e6a;
  font-family: var(--type-font-label, "JetBrains Mono", Consolas, monospace);
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  white-space: nowrap;
}

.map-wrap {
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
}

.map-container {
  height: 100%;
  width: 100%;
  background: #dce2e2;
}

.map-overlay {
  position: absolute;
  inset: auto 12px 12px;
  z-index: 600;
  pointer-events: none;
}

.map-legend {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  padding: 8px 10px;
  border: 1px solid rgba(26, 20, 16, 0.1);
  border-radius: 10px;
  background: rgba(250, 245, 232, 0.92);
  backdrop-filter: blur(8px);
  box-shadow: 0 12px 30px -22px rgba(26, 20, 16, 0.5);
}

.leg-row {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.leg-num {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  background: #1a1410;
  color: #faf5e8;
  font-family: var(--type-font-label, "JetBrains Mono", Consolas, monospace);
  font-size: 9px;
  font-weight: 600;
}

.leg-num.active {
  background: #e8590c;
}

.leg-row strong {
  color: #1a1410;
  font-size: 12px;
  font-weight: 500;
}

.leg-row span {
  margin-left: auto;
  color: #8b7e6a;
  font-family: var(--type-font-label, "JetBrains Mono", Consolas, monospace);
  font-size: 9px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  white-space: nowrap;
}

:deep(.leaflet-container) {
  font-family: var(--type-font-body, "Geist", system-ui, sans-serif);
  background: #dce2e2;
}

:deep(.leaflet-tile-pane) {
  filter: saturate(0.56) contrast(0.96) brightness(1.03);
}

:deep(.leaflet-bottom.leaflet-right) {
  margin-bottom: 6px;
  margin-right: 6px;
}

:deep(.leaflet-bottom.leaflet-left) {
  margin-bottom: 4px;
  margin-left: 6px;
}

:deep(.leaflet-control-zoom a) {
  width: 24px;
  height: 24px;
  line-height: 24px;
  color: #1a1410;
  font-size: 14px;
}

:deep(.leaflet-control-attribution) {
  padding: 2px 5px;
  border-radius: 4px 4px 0 0;
  background: rgba(250, 245, 232, 0.75);
  backdrop-filter: blur(4px);
  font-size: 8px;

  a {
    color: #8b7e6a;
  }
}

:deep(.map-pin-shell) {
  background: transparent;
  border: 0;
}

:deep(.map-pin) {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #faf5e8;
  background: #1a1410;
  color: #faf5e8;
  box-shadow: 0 4px 10px rgba(26, 20, 16, 0.35);
  font-family: var(--type-font-label, "JetBrains Mono", Consolas, monospace);
  font-size: 11px;
  font-weight: 600;
}

:deep(.map-pin.active) {
  background: #e8590c;
}

:deep(.leaflet-popup-content-wrapper) {
  padding: 0;
  border: 1px solid rgba(26, 20, 16, 0.18);
  border-radius: 12px;
  background: #faf5e8;
  box-shadow: 0 14px 34px -8px rgba(26, 20, 16, 0.22);
}

:deep(.leaflet-popup-content) {
  margin: 12px 14px;
}

:deep(.map-pop) {
  min-width: 130px;
}

:deep(.pop-title) {
  margin-bottom: 2px;
  color: #1a1410;
  font-size: 13px;
  font-weight: 600;
}

:deep(.pop-sub) {
  margin-bottom: 8px;
  color: #8b7e6a;
  font-family: var(--type-font-label, "JetBrains Mono", Consolas, monospace);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

:deep(.pop-link) {
  display: inline-flex;
  color: #e8590c;
  font-family: var(--type-font-label, "JetBrains Mono", Consolas, monospace);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-decoration: none;
  text-transform: uppercase;
}

:deep(.leaflet-popup-tip-container) {
  display: none;
}
</style>
