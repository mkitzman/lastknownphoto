<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { posts } from '../data/posts'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const router = useRouter()
const mapContainer = ref<HTMLElement | null>(null)
let map: L.Map | null = null

const postsWithLocation = posts.filter(p => p.location && p.location.lat && p.location.lng)

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

  // Dark tile layer to match site theme
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
  }).addTo(map)

  // Add zoom control to bottom-right
  L.control.zoom({ position: 'bottomright' }).addTo(map)

  // Add attribution to bottom-left
  L.control.attribution({ position: 'bottomleft', prefix: false })
    .addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>')
    .addTo(map)

  // Custom marker icon
  const markerIcon = L.divIcon({
    className: 'custom-marker',
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
      <circle cx="12" cy="12" r="10" />
      <path d="M14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16L3.95 6.06M14.31 16H2.83M16.62 12l-5.74 9.94" />
    </svg>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  })

  for (const post of postsWithLocation) {
    const loc = post.location!
    const truncDesc = post.title.length > 120 ? post.title.slice(0, 120) + '...' : post.title

    const popupContent = `
      <div class="map-popup">
        <img src="${post.imageUrl}" alt="${post.name}" />
        <div class="map-popup-body">
          <h3>${post.name}</h3>
          <p class="map-popup-location">${loc.name}</p>
          <p class="map-popup-desc">${truncDesc}</p>
          <a href="/post/${post.slug}" class="map-popup-link">Read more &rarr;</a>
        </div>
      </div>
    `

    const marker = L.marker([loc.lat, loc.lng], { icon: markerIcon })
      .bindPopup(popupContent, {
        maxWidth: 280,
        minWidth: 240,
        className: 'dark-popup',
      })
      .addTo(map)

    // Navigate via Vue Router on link click instead of full page load
    marker.on('popupopen', () => {
      const link = document.querySelector('.map-popup-link') as HTMLElement
      if (link) {
        link.addEventListener('click', (e) => {
          e.preventDefault()
          router.push({ name: 'post', params: { slug: post.slug } })
        })
      }
    })
  }
})

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<template>
  <div class="map-page">
    <div ref="mapContainer" class="map-container"></div>
  </div>
</template>

<style scoped>
.map-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 65px);
}

.map-container {
  flex: 1;
  width: 100%;
}
</style>

<style>
/* Custom marker */
.custom-marker {
  background: none;
  border: none;
  color: var(--accent, #c8a87c);
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.5));
  transition: transform 0.2s;
}

.custom-marker:hover {
  transform: scale(1.3);
}

/* Dark popup theme */
.dark-popup .leaflet-popup-content-wrapper {
  background: #141414;
  border: 1px solid #333;
  border-radius: 8px;
  color: #e8e8e8;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.dark-popup .leaflet-popup-tip {
  background: #141414;
  border: 1px solid #333;
  border-top: none;
  border-right: none;
}

.dark-popup .leaflet-popup-close-button {
  color: #888;
  font-size: 18px;
  padding: 6px 8px 0 0;
}

.dark-popup .leaflet-popup-close-button:hover {
  color: #e8e8e8;
}

.dark-popup .leaflet-popup-content {
  margin: 0;
  line-height: 1.5;
}

/* Popup card */
.map-popup {
  width: 260px;
}

.map-popup img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 6px 6px 0 0;
  filter: grayscale(100%) contrast(1.05);
}

.map-popup-body {
  padding: 0.75rem;
}

.map-popup h3 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
  color: #e8e8e8;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.map-popup-location {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #7a7a7a;
  margin: 0 0 0.5rem;
}

.map-popup-desc {
  font-size: 0.8rem;
  color: #888;
  margin: 0 0 0.75rem;
  line-height: 1.5;
}

.map-popup-link {
  font-size: 0.8rem;
  color: #c8a87c;
  text-decoration: none;
  cursor: pointer;
}

.map-popup-link:hover {
  color: #e8e8e8;
}

/* Leaflet overrides for dark theme */
.leaflet-control-zoom a {
  background: #141414 !important;
  color: #888 !important;
  border-color: #333 !important;
}

.leaflet-control-zoom a:hover {
  color: #e8e8e8 !important;
}

.leaflet-control-attribution {
  background: rgba(10, 10, 10, 0.7) !important;
  color: #666 !important;
  font-size: 0.65rem !important;
}

.leaflet-control-attribution a {
  color: #888 !important;
}
</style>
