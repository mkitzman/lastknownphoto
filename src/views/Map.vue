<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { Post } from '../data/posts'
import { useFilter } from '../composables/useFilter'
import FilterBar from '../components/FilterBar.vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const router = useRouter()
const mapContainer = ref<HTMLElement | null>(null)
let map: L.Map | null = null
let markerLayer: L.LayerGroup | null = null

const { filteredPosts } = useFilter({ applySort: false })

const markerIcon = L.divIcon({
  className: 'custom-marker',
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" width="22" height="22">
    <circle cx="12" cy="12" r="9" />
    <line x1="12" y1="2" x2="12" y2="6" />
    <line x1="12" y1="18" x2="12" y2="22" />
    <line x1="2" y1="12" x2="6" y2="12" />
    <line x1="18" y1="12" x2="22" y2="12" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </svg>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -14],
})

function buildPopup(post: Post): string {
  const loc = post.location!
  const truncDesc = post.title.length > 120 ? post.title.slice(0, 120) + '...' : post.title
  const fp = post.focalPoint
  const objectPosition = fp ? `${fp.x}% ${fp.y}%` : '50% 50%'
  return `
    <div class="map-popup">
      <img src="${post.imageUrl}" alt="${post.name}" style="object-position: ${objectPosition}" />
      <div class="map-popup-body">
        <h3>${post.name}</h3>
        <p class="map-popup-location">${loc.name}</p>
        <p class="map-popup-desc">${truncDesc}</p>
        <a href="/post/${post.slug}" class="map-popup-link">Read more &rarr;</a>
      </div>
    </div>
  `
}

function renderMarkers() {
  if (!map || !markerLayer) return
  markerLayer.clearLayers()
  for (const post of filteredPosts.value) {
    if (!post.location || !post.location.lat || !post.location.lng) continue
    const marker = L.marker([post.location.lat, post.location.lng], { icon: markerIcon })
      .bindPopup(buildPopup(post), {
        maxWidth: 280,
        minWidth: 240,
        className: 'dark-popup',
      })
    marker.on('popupopen', () => {
      const link = document.querySelector('.map-popup-link') as HTMLElement
      if (link) {
        link.addEventListener('click', (e) => {
          e.preventDefault()
          router.push({ name: 'post', params: { slug: post.slug } })
        })
      }
    })
    markerLayer.addLayer(marker)
  }
}

onMounted(() => {
  if (!mapContainer.value) return

  map = L.map(mapContainer.value, {
    center: [20, 0],
    zoom: 3,
    minZoom: 3,
    maxBoundsViscosity: 1.0,
    maxBounds: [[-85, -180], [85, 180]],
    zoomControl: false,
    attributionControl: false,
  })

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
  }).addTo(map)

  L.control.zoom({ position: 'bottomright' }).addTo(map)
  L.control.attribution({ position: 'bottomleft', prefix: false })
    .addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>')
    .addTo(map)

  markerLayer = L.layerGroup().addTo(map)
  renderMarkers()

  watch(filteredPosts, renderMarkers)
})

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
    markerLayer = null
  }
})
</script>

<template>
  <div class="map-page">
    <FilterBar :show-sort="false" />
    <div ref="mapContainer" class="map-container"></div>
  </div>
</template>

<style scoped>
.map-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 110px);
}

.map-container {
  flex: 1;
  width: 100%;
  min-height: 0;
}
</style>

<style>
/* Custom marker */
.custom-marker {
  background: none;
  border: none;
  color: #e8e1d4;
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.6));
  transition: transform 0.2s;
}

.custom-marker:hover {
  transform: scale(1.2);
}

/* Register popup theme */
.dark-popup .leaflet-popup-content-wrapper {
  background: #1a1612;
  border: 1px solid rgba(232, 225, 212, 0.15);
  border-radius: 0;
  color: #e8e1d4;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
}

.dark-popup .leaflet-popup-tip {
  background: #1a1612;
  border: 1px solid rgba(232, 225, 212, 0.15);
  border-top: none;
  border-right: none;
}

.dark-popup .leaflet-popup-close-button {
  color: rgba(232, 225, 212, 0.5);
  font-size: 18px;
  padding: 6px 8px 0 0;
}

.dark-popup .leaflet-popup-close-button:hover {
  color: #e8e1d4;
}

.dark-popup .leaflet-popup-content {
  margin: 0;
  line-height: 1.5;
  font-family: 'Inter Tight', -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 300;
}

/* Popup card */
.map-popup {
  width: 260px;
}

.map-popup img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  filter: saturate(0.6) contrast(1.02);
}

.map-popup-body {
  padding: 14px 16px 16px;
}

.map-popup h3 {
  font-size: 20px;
  font-weight: 400;
  letter-spacing: -0.4px;
  margin: 0 0 6px;
  color: #e8e1d4;
}

.map-popup-location {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 10px;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: rgba(232, 225, 212, 0.5);
  margin: 0 0 10px;
}

.map-popup-desc {
  font-size: 13px;
  color: rgba(232, 225, 212, 0.75);
  margin: 0 0 12px;
  line-height: 1.55;
  font-weight: 300;
}

.map-popup-link {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: #e8e1d4;
  text-decoration: none;
  cursor: pointer;
  border-bottom: 1px solid rgba(232, 225, 212, 0.25);
  padding-bottom: 2px;
}

.map-popup-link:hover {
  border-bottom-color: #e8e1d4;
}

/* Leaflet overrides for register theme */
.leaflet-control-zoom a {
  background: #1a1612 !important;
  color: rgba(232, 225, 212, 0.5) !important;
  border-color: rgba(232, 225, 212, 0.15) !important;
  border-radius: 0 !important;
}

.leaflet-control-zoom a:hover {
  color: #e8e1d4 !important;
}

.leaflet-control-attribution {
  background: rgba(15, 13, 11, 0.7) !important;
  color: rgba(232, 225, 212, 0.4) !important;
  font-family: 'JetBrains Mono', ui-monospace, monospace !important;
  font-size: 9px !important;
  letter-spacing: 0.5px !important;
}

.leaflet-control-attribution a {
  color: rgba(232, 225, 212, 0.6) !important;
}
</style>
