<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFilter, decadeCounts } from '../composables/useFilter'

const { selectedDecade, selectDecade } = useFilter()

const hovered = ref<{ decade: string; count: number } | null>(null)
const max = Math.max(1, ...decadeCounts.map(d => d.count))
const first = decadeCounts[0]?.decade ?? ''
const middle = decadeCounts[Math.floor(decadeCounts.length / 2)]?.decade ?? ''
const last = decadeCounts[decadeCounts.length - 1]?.decade ?? ''

const middleLabel = computed(() =>
  hovered.value ? `${hovered.value.decade} · ${hovered.value.count} records` : middle
)

function toggle(decade: string) {
  selectDecade(selectedDecade.value === decade ? null : decade)
}
</script>

<template>
  <div class="histogram">
    <div class="bars" @mouseleave="hovered = null">
      <button
        v-for="d in decadeCounts"
        :key="d.decade"
        type="button"
        class="col"
        :class="{ active: hovered?.decade === d.decade || selectedDecade === d.decade }"
        :aria-label="`${d.decade}: ${d.count} records`"
        :aria-pressed="selectedDecade === d.decade"
        @mouseenter="hovered = d"
        @focus="hovered = d"
        @blur="hovered = null"
        @click="toggle(d.decade)"
      >
        <span class="bar" :style="{ height: `${Math.max(2, (d.count / max) * 100)}%` }" />
      </button>
    </div>
    <div class="axis" aria-hidden="true">
      <span>{{ first }}</span><span>{{ middleLabel }}</span><span>{{ last }}</span>
    </div>
  </div>
</template>

<style scoped>
.histogram {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.bars {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: flex-end;
  gap: 6px;
  border-bottom: 1px solid rgba(232, 225, 212, 0.2);
}

.col {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: flex-end;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.bar {
  width: 100%;
  background: rgba(232, 225, 212, 0.35);
  transition: background 200ms;
}

.col.active .bar {
  background: var(--fg);
}

.axis {
  margin-top: 26px;
  line-height: 14px;
  display: flex;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  opacity: 0.45;
  white-space: nowrap;
}
</style>
