<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useReveal } from '../../composables/useReveal'
import { intervals, shortest, formatHours } from '../../data/stats'

const props = withDefaults(defineProps<{ compact?: boolean }>(), { compact: false })

const { el, shown } = useReveal()

const LO = Math.log10(0.1)
const HI = Math.log10(60000)
const x = (h: number) => ((Math.log10(Math.min(60000, Math.max(0.1, h))) - LO) / (HI - LO)) * 100

const longestThree = [...intervals].sort((a, b) => b.hours - a.hours).slice(0, 3).map(i => i.post.id)
const named = new Set([shortest?.post.id, ...longestThree])

// Named outliers get fixed rows so their labels never collide: longest at top, then bottom, then middle
const NAMED_ROWS = [24, 100, 62]
const namedY = new Map<string, number>([
  ...longestThree.map((id, i) => [id, NAMED_ROWS[i]] as [string, number]),
  ...(shortest ? [[shortest.post.id, 62] as [string, number]] : []),
])

// Same-day records with day-level dates only, placed at midday since the hour is unknown
const dots = intervals.map((iv, i) => ({
  ...iv,
  plotHours: iv.timeUnknown ? 12 : iv.hours,
  named: named.has(iv.post.id),
  y: namedY.get(iv.post.id) ?? 18 + ((i * 7919) % 100) * 0.84,
}))

const ticks = computed<[number, string][]>(() =>
  props.compact
    ? [[24, '1 day'], [720, '1 month'], [8760, '1 year']]
    : [[1, '1 hour'], [24, '1 day'], [168, '1 week'], [720, '1 month'], [8760, '1 year']]
)

type Dot = (typeof dots)[number]
const hov = ref<Dot | null>(null)
const plot = ref<HTMLDivElement | null>(null)
const router = useRouter()

// Dots are too dense to be separate tap targets, so the plot is one target that picks the nearest dot
const PICK_RADIUS = 28
function nearest(e: MouseEvent): Dot | null {
  const box = plot.value?.getBoundingClientRect()
  if (!box) return null
  const px = e.clientX - box.left
  const py = e.clientY - box.top
  let best: Dot | null = null
  let bestDist = PICK_RADIUS
  for (const d of dots) {
    const dist = Math.hypot((x(d.plotHours) / 100) * box.width - px, d.y - py)
    if (dist < bestDist) {
      best = d
      bestDist = dist
    }
  }
  return best
}

function onMove(e: MouseEvent) {
  hov.value = nearest(e)
}

function onClick(e: MouseEvent) {
  const d = nearest(e)
  if (!d) return
  // On touch, the first tap reads the dot and a second tap on it opens the record
  if ((e as PointerEvent).pointerType === 'touch' && hov.value !== d) {
    hov.value = d
    return
  }
  router.push(`/post/${d.post.slug}`)
}

const describe = (d: Dot) => (d.timeUnknown ? 'Same day, hour unknown' : `${formatHours(d.hours)} before death`)
const listed = [...dots].sort((a, b) => a.plotHours - b.plotHours)

const caption = computed(() => {
  const h = hov.value
  if (!h) return 'Hover over a dot to see who it is'
  return `${h.post.name} · ${describe(h)}`
})
</script>

<template>
  <div ref="el" class="strip" :class="{ shown, hovering: hov }">
    <div
      ref="plot"
      class="plot"
      :class="{ pointing: hov }"
      role="img"
      :aria-label="`Dot chart of the time between photo and death for ${dots.length} records, on a log scale from under an hour to several years. The full list follows the chart.`"
      @mousemove="onMove"
      @mouseleave="hov = null"
      @click="onClick"
    >
      <div v-for="[h] in ticks" :key="h" class="guide" :style="{ left: `${x(h)}%` }" />
      <span
        v-for="(d, i) in dots"
        :key="d.post.id"
        class="hit"
        :class="{ on: hov === d, named: d.named }"
        :style="{ left: `${x(d.plotHours)}%`, top: `${d.y}px`, zIndex: hov === d ? 3 : 1 }"
        aria-hidden="true"
      >
        <span class="dot" :style="{ transitionDelay: `${i * 12}ms, ${i * 12}ms, 0ms` }" />
        <span
          v-if="d.named && !hov && !compact"
          class="name"
          :class="{ above: d.y > 80, right: d.plotHours > 2000 }"
        >{{ d.post.name }}</span>
      </span>
    </div>
    <div class="axis">
      <span v-for="[h, l] in ticks" :key="h" class="tick" :style="{ left: `${x(h)}%` }">{{ l }}</span>
    </div>
    <div class="caption" :class="{ on: hov }" aria-hidden="true">{{ caption }}</div>
    <details class="list">
      <summary>Show all {{ dots.length }} as a list</summary>
      <ol>
        <li v-for="d in listed" :key="d.post.id">
          <RouterLink :to="`/post/${d.post.slug}`">{{ d.post.name }}</RouterLink>
          <span class="list-when">{{ describe(d) }}</span>
        </li>
      </ol>
    </details>
  </div>
</template>

<style scoped>
.plot {
  position: relative;
  height: 120px;
}

.plot.pointing {
  cursor: pointer;
}

.guide {
  position: absolute;
  top: 0;
  bottom: 0;
  border-left: 1px dashed rgba(232, 225, 212, 0.12);
}

.hit {
  position: absolute;
  pointer-events: none;
  width: 14px;
  height: 14px;
  margin: -7px 0 0 -7px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(232, 225, 212, 0.45);
  opacity: 0;
  transform: scale(0);
  transition: opacity 600ms cubic-bezier(0.2, 0.7, 0.2, 1), transform 600ms cubic-bezier(0.2, 0.7, 0.2, 1), background 200ms;
}

.shown .dot {
  opacity: 1;
  transform: scale(1);
}

.named .dot {
  width: 8px;
  height: 8px;
  background: var(--fg);
}

.hit.on .dot {
  background: var(--fg);
}

.name {
  position: absolute;
  top: 16px;
  left: 0;
  white-space: nowrap;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: rgba(232, 225, 212, 0.7);
  pointer-events: none;
}

.name.above {
  top: auto;
  bottom: 16px;
}

.name.right {
  left: auto;
  right: 0;
}

.axis {
  position: relative;
  height: 24px;
  margin-top: 6px;
  border-top: 1px solid rgba(232, 225, 212, 0.2);
}

.tick {
  position: absolute;
  top: 10px;
  transform: translateX(-50%);
  white-space: nowrap;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--fg-label);
}

.caption {
  margin-top: 22px;
  min-height: 20px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: var(--fg-label);
}

.caption.on {
  color: var(--fg);
}

.list {
  margin-top: 18px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
}

.list summary {
  cursor: pointer;
  color: var(--link);
  width: fit-content;
  padding: 6px 0;
}

.list summary:hover,
.list[open] summary {
  color: var(--fg);
}

.list ol {
  list-style: none;
  margin-top: 16px;
  columns: 3 260px;
  column-gap: 40px;
}

.list li {
  break-inside: avoid;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 5px 0;
  border-bottom: 1px solid var(--hairline-soft);
}

.list a {
  color: var(--link);
}

.list a:hover {
  color: var(--fg);
}

.list-when {
  color: var(--fg-label);
  white-space: nowrap;
}

@media (prefers-reduced-motion: reduce) {
  .dot {
    opacity: 1;
    transform: none;
    transition: background 200ms;
  }
}
</style>
