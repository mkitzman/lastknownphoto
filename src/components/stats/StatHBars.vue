<script setup lang="ts">
import { ref, computed } from 'vue'
import { useReveal } from '../../composables/useReveal'

const props = withDefaults(defineProps<{
  data: [string, number][]
  labelWidth?: number
}>(), { labelWidth: 100 })

const { el, shown } = useReveal()
const hov = ref<string | null>(null)
const max = computed(() => Math.max(1, ...props.data.map(d => d[1])))
</script>

<template>
  <div
    ref="el"
    class="hbars"
    :class="{ shown, hovering: hov }"
    :style="{ gridTemplateColumns: `${labelWidth}px 1fr 32px` }"
    @mouseleave="hov = null"
  >
    <template v-for="(d, i) in data" :key="d[0]">
      <span class="label" :class="{ on: hov === d[0] }" @mouseenter="hov = d[0]">{{ d[0] }}</span>
      <div class="track" @mouseenter="hov = d[0]">
        <span
          class="bar"
          :class="{ on: hov === d[0] }"
          :style="{ width: `${(d[1] / max) * 100}%`, transitionDelay: `${i * 40}ms, 0ms` }"
        />
      </div>
      <span class="count">{{ d[1] }}</span>
    </template>
  </div>
</template>

<style scoped>
.hbars {
  display: grid;
  row-gap: 10px;
  column-gap: 16px;
  align-items: center;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

.label {
  color: rgba(232, 225, 212, 0.7);
  transition: color 200ms;
}

.hovering .label:not(.on) {
  color: var(--fg-label);
}

.track {
  height: 10px;
}

.bar {
  display: block;
  height: 100%;
  background: rgba(232, 225, 212, 0.35);
  transform-origin: left;
  transform: scaleX(0);
  transition: transform 900ms cubic-bezier(0.2, 0.7, 0.2, 1), background 200ms;
}

.shown .bar {
  transform: scaleX(1);
}

.bar.on {
  background: var(--fg);
}

.count {
  color: var(--fg-label);
  text-align: right;
}

@media (prefers-reduced-motion: reduce) {
  .bar {
    transform: none;
    transition: background 200ms;
  }
}
</style>
