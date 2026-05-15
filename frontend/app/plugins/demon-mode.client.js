import { useMainStore } from '@/stores/main'

const DEMON_RED = 'rgb(255, 0, 0)'
const ATTR_BG = 'data-demon-bg'
const ATTR_FG = 'data-demon-fg'

function isWhite(cssColor) {
  if (!cssColor || cssColor === 'transparent' || cssColor === 'rgba(0, 0, 0, 0)') {
    return false
  }
  const s = cssColor.replace(/\s/g, '').toLowerCase()
  if (s === 'white' || s === '#fff' || s === '#ffffff') return true
  const m = s.match(/^rgba?\((\d+),(\d+),(\d+)/)
  if (!m) return false
  const r = Number(m[1])
  const g = Number(m[2])
  const b = Number(m[3])
  return r >= 250 && g >= 250 && b >= 250
}

function applyDemonSwaps(enabled) {
  const nodes = document.querySelectorAll('*')
  for (const el of nodes) {
    if (enabled) {
      const cs = getComputedStyle(el)
      if (isWhite(cs.backgroundColor) && !el.hasAttribute(ATTR_BG)) {
        el.setAttribute(ATTR_BG, el.style.backgroundColor || '')
        el.style.backgroundColor = DEMON_RED
      }
      if (isWhite(cs.color) && !el.hasAttribute(ATTR_FG)) {
        el.setAttribute(ATTR_FG, el.style.color || '')
        el.style.color = DEMON_RED
      }
    } else {
      if (el.hasAttribute(ATTR_BG)) {
        const prev = el.getAttribute(ATTR_BG)
        if (prev) el.style.backgroundColor = prev
        else el.style.removeProperty('background-color')
        el.removeAttribute(ATTR_BG)
      }
      if (el.hasAttribute(ATTR_FG)) {
        const prev = el.getAttribute(ATTR_FG)
        if (prev) el.style.color = prev
        else el.style.removeProperty('color')
        el.removeAttribute(ATTR_FG)
      }
    }
  }
}

function syncDemonModeClass(enabled) {
  document.documentElement.classList.toggle('demon-mode', enabled)
}

export default defineNuxtPlugin(() => {
  const mainStore = useMainStore()
  const router = useRouter()

  const run = () => {
    syncDemonModeClass(mainStore.demonMode)
    requestAnimationFrame(() => applyDemonSwaps(mainStore.demonMode))
  }

  run()

  watch(() => mainStore.demonMode, run)

  router.afterEach(() => {
    if (mainStore.demonMode) run()
  })
})
