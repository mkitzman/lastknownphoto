<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useFilter, SORT_LABELS, SORT_ARROWS, type FilterMode } from '../composables/useFilter'

withDefaults(defineProps<{ showSort?: boolean }>(), { showSort: true })

const {
  filterMode,
  selectedDecade,
  selectedTag,
  sortMode,
  setMode,
  selectDecade,
  selectTag,
  cycleSort,
  decadeOptions,
  tagOptions,
} = useFilter()

const filterOptionsEl = ref<HTMLDivElement | null>(null)

function onWheel(e: WheelEvent) {
  const el = filterOptionsEl.value
  if (!el) return
  if (el.scrollWidth <= el.clientWidth) return
  if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
  e.preventDefault()
  el.scrollLeft += e.deltaY
}

onMounted(() => {
  filterOptionsEl.value?.addEventListener('wheel', onWheel, { passive: false })
})
onBeforeUnmount(() => {
  filterOptionsEl.value?.removeEventListener('wheel', onWheel)
})
</script>

<template>
  <div class="filter-bar">
    <div class="filter-mode">
      <span class="filter-prefix">Filter by</span>
      <div class="filter-select-wrapper">
        <select
          class="filter-select"
          :value="filterMode"
          @change="(e) => setMode((e.target as HTMLSelectElement).value as FilterMode)"
          aria-label="Choose filter mode"
        >
          <option value="decade">Decade</option>
          <option value="tag">Tag</option>
        </select>
        <svg class="filter-chevron" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </div>
    <div class="filter-options" ref="filterOptionsEl">
      <button
        class="filter-chip"
        :class="{ active: filterMode === 'decade' ? !selectedDecade : !selectedTag }"
        @click="filterMode === 'decade' ? selectDecade(null) : selectTag(null)"
      >All</button>
      <template v-if="filterMode === 'decade'">
        <button
          v-for="{ decade, count } in decadeOptions"
          :key="decade"
          class="filter-chip"
          :class="{ active: selectedDecade === decade }"
          @click="selectDecade(decade)"
        >{{ decade }} <span class="chip-count">{{ count }}</span></button>
      </template>
      <template v-else>
        <button
          v-for="{ tag, count } in tagOptions"
          :key="tag"
          class="filter-chip"
          :class="{ active: selectedTag === tag }"
          @click="selectTag(tag)"
        >{{ tag }} <span class="chip-count">{{ count }}</span></button>
      </template>
    </div>
    <button v-if="showSort" class="sort-label" @click="cycleSort" title="Cycle sort order">
      Sort {{ SORT_LABELS[sortMode].toLowerCase() }} {{ SORT_ARROWS[sortMode] }}
    </button>
  </div>
</template>

<style scoped>
.filter-bar {
  display: flex;
  gap: 32px;
  align-items: center;
  padding: 24px 56px;
  border-bottom: 1px solid var(--hairline-soft);
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  background: var(--ink-800);
}

.filter-mode {
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0.5;
}

.filter-prefix {
  color: var(--fg);
}

.filter-select-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.filter-select {
  appearance: none;
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--fg);
  color: var(--fg);
  padding: 2px 18px 2px 0;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  cursor: pointer;
  outline: none;
}

.filter-chevron {
  position: absolute;
  right: 2px;
  pointer-events: none;
  color: var(--fg);
}

.filter-options {
  display: flex;
  gap: 2px;
  flex: 1 1 0;
  min-width: 0;
  flex-wrap: nowrap;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scrollbar-width: none;
  -ms-overflow-style: none;
  mask-image: linear-gradient(to right, transparent, #000 16px, #000 calc(100% - 16px), transparent);
}

.filter-options::-webkit-scrollbar {
  display: none;
}

.filter-chip {
  background: transparent;
  border: none;
  padding: 4px 10px;
  color: var(--fg-dim);
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  letter-spacing: inherit;
  text-transform: inherit;
  border-bottom: 1px solid transparent;
  transition: color 0.2s, border-color 0.2s;
  white-space: nowrap;
  flex-shrink: 0;
}

.filter-chip:hover {
  color: var(--fg);
}

.filter-chip.active {
  color: var(--fg);
  border-bottom-color: var(--fg);
}

.chip-count {
  opacity: 0.45;
  margin-left: 2px;
}

.sort-label {
  background: none;
  border: none;
  color: var(--fg-dim);
  font-family: inherit;
  font-size: inherit;
  letter-spacing: inherit;
  text-transform: inherit;
  white-space: nowrap;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
}

.sort-label:hover {
  color: var(--fg);
}

@media (max-width: 1100px) {
  .filter-bar {
    padding: 20px 40px;
    flex-wrap: wrap;
    gap: 16px;
  }
  .sort-label {
    display: none;
  }
}

@media (max-width: 640px) {
  .filter-bar {
    padding: 16px 24px;
  }
}
</style>
