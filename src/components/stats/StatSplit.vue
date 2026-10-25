<script setup lang="ts">
import { computed } from 'vue'
import { useReveal } from '../../composables/useReveal'

const props = defineProps<{ parts: [string, number][] }>()

const { el, shown } = useReveal()
const total = computed(() => props.parts.reduce((a, p) => a + p[1], 0) || 1)
const visible = computed(() => props.parts.filter(p => p[1] > 0))
</script>

<template>
  <div ref="el" class="split" :class="{ shown }">
    <div class="segments">
      <span
        v-for="(p, i) in visible"
        :key="p[0]"
        class="seg"
        :style="{
          width: `${(p[1] / total) * 100}%`,
          background: `rgba(232, 225, 212, ${0.85 - i * 0.18})`,
          transitionDelay: `${i * 80}ms`,
        }"
      />
    </div>
    <div class="labels">
      <span v-for="p in visible" :key="p[0]" class="label" :style="{ width: `${(p[1] / total) * 100}%` }">
        <template v-if="p[1] / total > 0.14">{{ p[0] }}&nbsp;</template><span class="n">{{ p[1] }}</span>
      </span>
    </div>
  </div>
</template>

<style scoped>
.segments,
.labels {
  display: flex;
  gap: 3px;
}

.segments {
  height: 14px;
}

.seg {
  transform-origin: left;
  transform: scaleX(0);
  transition: transform 900ms cubic-bezier(0.2, 0.7, 0.2, 1);
}

.shown .seg {
  transform: scaleX(1);
}

.labels {
  margin-top: 10px;
}

.label {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: rgba(232, 225, 212, 0.5);
  white-space: nowrap;
  overflow: hidden;
}

.n {
  color: var(--fg);
}

@media (prefers-reduced-motion: reduce) {
  .seg {
    transform: none;
    transition: none;
  }
}
</style>
