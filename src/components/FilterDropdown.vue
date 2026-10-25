<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = withDefaults(defineProps<{
  label?: string
  value: string
  options: { value: string; label: string }[]
  align?: 'left' | 'right'
}>(), { align: 'left' })

const emit = defineEmits<{ change: [value: string] }>()

const open = ref(false)
const root = ref<HTMLDivElement | null>(null)

function choose(value: string) {
  emit('change', value)
  open.value = false
}

function onDocClick(e: MouseEvent) {
  if (open.value && root.value && !root.value.contains(e.target as Node)) open.value = false
}
function onKeydown(e: KeyboardEvent) {
  if (open.value && e.key === 'Escape') open.value = false
}

onMounted(() => {
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKeydown)
})

const currentLabel = () => props.options.find(o => o.value === props.value)?.label ?? props.value
</script>

<template>
  <div class="dropdown" ref="root">
    <button
      class="trigger"
      type="button"
      :aria-expanded="open"
      aria-haspopup="listbox"
      @click="open = !open"
    >
      <span v-if="label" class="trigger-label">{{ label }}</span>
      <span class="trigger-value">{{ currentLabel() }}</span>
      <svg class="chevron" :class="{ open }" width="8" height="5" viewBox="0 0 8 5" aria-hidden="true">
        <path d="M0 0l4 4 4-4" fill="none" stroke="currentColor" />
      </svg>
    </button>
    <ul v-if="open" class="menu" :class="align" role="listbox">
      <li v-for="o in options" :key="o.value" role="option" :aria-selected="o.value === value">
        <button type="button" class="item" :class="{ selected: o.value === value }" @click="choose(o.value)">
          <span>{{ o.label }}</span>
          <span v-if="o.value === value" aria-hidden="true">✓</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.dropdown {
  position: relative;
}

.trigger {
  background: transparent;
  border: none;
  padding: 6px 0;
  color: var(--fg);
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  letter-spacing: inherit;
  text-transform: inherit;
  display: flex;
  gap: 10px;
  align-items: center;
}

.trigger-label {
  opacity: 0.45;
}

.trigger-value {
  border-bottom: 1px solid rgba(232, 225, 212, 0.35);
  padding-bottom: 2px;
  white-space: nowrap;
}

.chevron {
  opacity: 0.6;
  transition: transform 200ms;
}

.chevron.open {
  transform: rotate(180deg);
}

.menu {
  list-style: none;
  position: absolute;
  top: 100%;
  margin-top: 8px;
  min-width: 180px;
  max-height: 60vh;
  overflow-y: auto;
  background: #231e19;
  border: 1px solid rgba(232, 225, 212, 0.15);
  padding: 6px 0;
  z-index: 40;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
}

.menu.left {
  left: 0;
}

.menu.right {
  right: 0;
}

.item {
  width: 100%;
  background: none;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  color: rgba(232, 225, 212, 0.55);
  font-family: inherit;
  font-size: inherit;
  letter-spacing: inherit;
  text-transform: inherit;
  text-align: left;
  display: flex;
  justify-content: space-between;
  gap: 24px;
  white-space: nowrap;
}

.item:hover,
.item.selected {
  color: var(--fg);
}
</style>
