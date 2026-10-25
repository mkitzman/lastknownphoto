<script setup lang="ts">
import { ref, computed } from 'vue'
import { useReveal } from '../../composables/useReveal'

const props = withDefaults(defineProps<{
  data: [string, number][]
  height?: number
  gap?: number
  labels?: 'all' | 'ends'
}>(), { height: 160, gap: 6, labels: 'all' })

const { el, shown } = useReveal()
const hov = ref<[string, number] | null>(null)
const max = computed(() => Math.max(1, ...props.data.map(d => d[1])))
const middle = computed(() => props.data[Math.floor(props.data.length / 2)]?.[0] ?? '')
</script>

<template>
  <div ref="el" class="bars-chart" :class="{ shown }">
    <div class="bars" :style="{ height: `${height}px`, gap: `${gap}px` }" @mouseleave="hov = null">
      <div
        v-for="(d, i) in data"
        :key="d[0]"
        class="col"
        :aria-label="`${d[0]}: ${d[1]}`"
        role="img"
        @mouseenter="hov = d"
      >
        <span
          class="bar"
          :class="{ on: hov === d }"
          :style="{ height: `${Math.max(1.5, (d[1] / max) * 100)}%`, transitionDelay: `${i * 30}ms, 0ms` }"
        />
      </div>
    </div>
    <div v-if="labels === 'all'" class="axis" :style="{ gap: `${gap}px` }" aria-hidden="true">
      <span v-for="d in data" :key="d[0]" class="tick" :class="{ on: hov === d }">{{ hov === d ? d[1] : d[0] }}</span>
    </div>
    <div v-else class="axis ends" aria-hidden="true">
      <span>{{ data[0]?.[0] }}</span>
      <span class="mid" :class="{ on: hov }">{{ hov ? `${hov[0]} · ${hov[1]}` : middle }}</span>
      <span>{{ data[data.length - 1]?.[0] }}</span>
    </div>
  </div>
</template>

<style scoped>
.bars {
  display: flex;
  align-items: flex-end;
  border-bottom: 1px solid rgba(232, 225, 212, 0.2);
}

.col {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: flex-end;
}

.bar {
  width: 100%;
  background: rgba(232, 225, 212, 0.35);
  transform-origin: bottom;
  transform: scaleY(0);
  transition: transform 900ms cubic-bezier(0.2, 0.7, 0.2, 1), background 200ms;
}

.shown .bar {
  transform: scaleY(1);
}

.bar.on {
  background: var(--fg);
}

.axis {
  display: flex;
  margin-top: 10px;
  min-height: 14px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: rgba(232, 225, 212, 0.45);
}

.tick {
  flex: 1;
  text-align: center;
  white-space: nowrap;
}

.ends {
  justify-content: space-between;
}

.ends .mid {
  flex: 1;
  text-align: center;
}

.on {
  color: var(--fg);
}

@media (prefers-reduced-motion: reduce) {
  .bar {
    transform: none;
    transition: background 200ms;
  }
}
</style>
