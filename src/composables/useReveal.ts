import { ref, onMounted, onBeforeUnmount } from 'vue'

/** True once the element has scrolled 20% into view. Starts true when the user prefers reduced motion. */
export function useReveal() {
  const el = ref<HTMLElement | null>(null)
  const shown = ref(false)
  let io: IntersectionObserver | null = null

  onMounted(() => {
    if (!el.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      shown.value = true
      return
    }
    io = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) {
        shown.value = true
        io?.disconnect()
      }
    }, { threshold: 0.2 })
    io.observe(el.value)
  })
  onBeforeUnmount(() => io?.disconnect())

  return { el, shown }
}
