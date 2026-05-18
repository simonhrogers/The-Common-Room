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

/** KO info surface from URL prefix — locale.value can lag behind route on En/Ko navigation. */
export function pathIsInfoKo(path, defaultLocale, localeCodes) {
  if (!pathIsInfo(path, defaultLocale, localeCodes)) return false
  const p = path.replace(/\/+$/, '') || '/'
  if (p === '/info') return false
  for (const l of localeCodes) {
    const code = l.code
    if (!code || code === defaultLocale) continue
    if (p === `/${code}/info`) return true
  }
  return false
}

/** Fade when navigating between homepage and info (either direction). */
export function shouldFadeHomeInfo(fromPath, toPath, defaultLocale, localeCodes) {
  const fromHome = pathIsHome(fromPath, defaultLocale, localeCodes)
  const fromInfo = pathIsInfo(fromPath, defaultLocale, localeCodes)
  const toHome = pathIsHome(toPath, defaultLocale, localeCodes)
  const toInfo = pathIsInfo(toPath, defaultLocale, localeCodes)
  return (fromHome && toInfo) || (fromInfo && toHome)
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

  const isInfoKoSurface = computed(() =>
    pathIsInfoKo(route.path, defaultLocale.value, locales.value),
  )

  return {
    route,
    isInfoPage,
    isHomePage,
    isInfoKoSurface,
  }
}
