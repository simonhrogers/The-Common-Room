import { pathIsHome, pathIsInfo } from '~/composables/useSiteRoute'

/** Reset home slide on entry unless the user is going back from info (browser history). */
export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()
  let isPop = false

  window.addEventListener('popstate', () => {
    isPop = true
  })

  router.afterEach((to, from) => {
    const i18n = nuxtApp.$i18n
    const defaultLocale = i18n.defaultLocale
    const locales = i18n.locales.value
    const store = useMainStore()

    if (!pathIsHome(to.path, defaultLocale, locales)) return

    const backFromInfo = isPop && pathIsInfo(from.path, defaultLocale, locales)
    if (!backFromInfo) {
      store.homeSlideIndex = 0
    }
    isPop = false
  })
})
