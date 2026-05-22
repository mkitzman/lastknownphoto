import { ref } from 'vue'

const SITE_TITLE = 'Last Known Photo'

export const pageAnnouncement = ref('')

let isInitialNav = true

export function setPageMeta(label: string | null) {
  if (label) {
    document.title = `${label} · ${SITE_TITLE}`
    if (!isInitialNav) pageAnnouncement.value = `Navigated to ${label}`
  } else {
    document.title = SITE_TITLE
  }
  isInitialNav = false
}
