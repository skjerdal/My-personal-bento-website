<template>
  <div class="norway-map">
    <div ref="mapContainer" class="map-container"></div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';

const LOCATIONS = [
  {
    name: 'Aurland',
    label: 'Hometown',
    coords: [60.9076, 7.1836],
    mapsUrl: 'https://maps.google.com/?q=Aurland,Norway',
  },
  {
    name: 'Bergen',
    label: 'B.Eng · HVL',
    coords: [60.3913, 5.3221],
    mapsUrl: 'https://maps.google.com/?q=Bergen,Norway',
  },
  {
    name: 'Trondheim',
    label: 'M.Sc · NTNU',
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
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      }).addTo(mapInstance);

      L.control.zoom({ position: 'bottomright' }).addTo(mapInstance);

      L.control.attribution({
        position: 'bottomleft',
        prefix: false,
      }).addAttribution('© <a href="https://www.openstreetmap.org/copyright">OSM</a> © <a href="https://carto.com/attributions">CARTO</a>').addTo(mapInstance);

      const dotIcon = L.divIcon({
        html: `<div style="
          width:12px;height:12px;
          background:#3963ff;
          border-radius:50%;
          border:2.5px solid #fff;
          box-shadow:0 1px 6px rgba(57,99,255,0.55);
        "></div>`,
        className: '',
        iconSize: [12, 12],
        iconAnchor: [6, 6],
        popupAnchor: [0, -12],
      });

      LOCATIONS.forEach(loc => {
        const popupContent = `
          <div style="font-family:system-ui,sans-serif;min-width:120px;">
            <div style="font-weight:700;font-size:13px;color:#162033;margin-bottom:2px;">${loc.name}</div>
            <div style="font-size:11px;color:#66758c;margin-bottom:8px;">${loc.label}</div>
            <a href="${loc.mapsUrl}" target="_blank" rel="noopener noreferrer"
               style="font-size:11px;color:#3963ff;text-decoration:none;font-weight:600;display:inline-flex;align-items:center;gap:3px;">
              Open in Maps&nbsp;↗
            </a>
          </div>`;

        L.marker(loc.coords, { icon: dotIcon })
          .bindPopup(popupContent, { closeButton: false, maxWidth: 180 })
          .addTo(mapInstance);
      });

      const bounds = L.latLngBounds(LOCATIONS.map(l => l.coords));
      mapInstance.fitBounds(bounds, { padding: [44, 44] });

      // Re-render after card fly-in animation settles
      setTimeout(() => mapInstance?.invalidateSize(), 450);
    });

    onUnmounted(() => {
      mapInstance?.remove();
      mapInstance = null;
    });

    return { mapContainer };
  },
};
</script>

<!-- Leaflet base styles (non-scoped so they apply inside the map container) -->
<style src="leaflet/dist/leaflet.css"></style>

<style lang="scss" scoped>
.norway-map {
  height: 100%;
  width: 100%;
  // Expand past the wrapper's right padding to fill the card edge-to-edge
  margin-right: -0.5rem;
  width: calc(100% + 0.5rem);
}

.map-container {
  height: 100%;
  width: 100%;
}

// Adjust Leaflet controls to sit inside rounded card
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
  font-size: 14px;
  color: #162033;
}

:deep(.leaflet-control-attribution) {
  font-size: 8px;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(4px);
  border-radius: 4px 4px 0 0;
  padding: 2px 5px;

  a { color: #66758c; }
}

:deep(.leaflet-popup-content-wrapper) {
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);
  padding: 0;
}

:deep(.leaflet-popup-content) {
  margin: 12px 14px;
}

:deep(.leaflet-popup-tip-container) {
  display: none;
}
</style>
