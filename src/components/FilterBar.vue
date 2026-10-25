<script setup lang="ts">
import { computed } from 'vue'
import { useFilter, SORT_ORDER, SORT_LABELS, type SortMode } from '../composables/useFilter'
import FilterDropdown from './FilterDropdown.vue'

withDefaults(defineProps<{ showSort?: boolean }>(), { showSort: true })

const {
  selectedDecade,
  selectedTag,
  sortMode,
  selectDecade,
  selectTag,
  selectSort,
  decadeOptions,
  tagOptions,
} = useFilter()

const decadeItems = computed(() => [
  { value: '', label: 'All decades' },
  ...decadeOptions.value.map(d => ({ value: d.decade, label: d.decade })),
])
const tagItems = computed(() => [
  { value: '', label: 'All tags' },
  ...tagOptions.value.map(t => ({ value: t.tag, label: t.tag })),
])
const sortItems = SORT_ORDER.map(s => ({ value: s, label: SORT_LABELS[s] }))
</script>

<template>
  <div class="filter-bar">
    <FilterDropdown
      label="Filter"
      :value="selectedDecade ?? ''"
      :options="decadeItems"
      @change="v => selectDecade(v || null)"
    />
    <FilterDropdown
      :value="selectedTag ?? ''"
      :options="tagItems"
      @change="v => selectTag(v || null)"
    />
    <div class="spacer" />
    <FilterDropdown
      v-if="showSort"
      label="Sort"
      align="right"
      :value="sortMode"
      :options="sortItems"
      @change="v => selectSort(v as SortMode)"
    />
  </div>
</template>

<style scoped>
.filter-bar {
  position: relative;
  z-index: 10;
  display: flex;
  gap: 40px;
  align-items: center;
  min-height: 50px;
  padding: 0 56px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  background: var(--ink-800);
}

.spacer {
  flex: 1;
}

@media (max-width: 1100px) {
  .filter-bar {
    padding: 0 40px;
    gap: 28px;
  }
}

@media (max-width: 640px) {
  .filter-bar {
    padding: 8px 24px;
    gap: 20px;
    flex-wrap: wrap;
  }
  .spacer {
    display: none;
  }
}
</style>
