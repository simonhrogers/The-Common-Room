/** Path helpers — stable during i18n navigations (avoid localePath timing flashes). */

export function pathIsInfo(path, defaultLocale, localeCodes) {
  const p = path.replace(/\/+$/, '') || '/'
  if (p === '/info') return true
  for (const l of localeCodes) {
    const code = l.code
    if (!code || code === defaultLocale) continue
    if (p === `/${code}/info`) return true
  }
  return false
}

export function pathIsHome(path, defaultLocale, localeCodes) {
  const p = path.replace(/\/+$/, '') || '/'
  if (p === '/') return true
  for (const l of localeCodes) {
    const code = l.code
    if (!code || code === defaultLocale) continue
    if (p === `/${code}`) return true
  }
  return false
}

export function useSiteRoute() {
  const route = useRoute()
  const { locales, defaultLocale, locale } = useI18n()

  const isInfoPage = computed(() =>
    pathIsInfo(route.path, defaultLocale.value, locales.value),
  )

  const isHomePage = computed(() =>
    pathIsHome(route.path, defaultLocale.value, locales.value),
  )

  const isInfoKoSurface = computed(
    () => isInfoPage.value && locale.value === 'ko',
  )

  return {
    route,
    isInfoPage,
    isHomePage,
    isInfoKoSurface,
  }
}
