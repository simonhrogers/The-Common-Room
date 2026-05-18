import { shouldFadeHomeInfo } from '~/composables/useSiteRoute'

export default defineNuxtRouteMiddleware((to, from) => {
  const store = useMainStore()
  // useI18n() requires component setup — $i18n is available in route middleware
  const { $i18n } = useNuxtApp()
  const defaultLocale = $i18n.defaultLocale
  const locales = $i18n.locales.value

  if (store.internalNavigation) {
    store.internalNavigation = false
  }
  else {
    const isRealNavigation =
      from.path !== to.path && (from.matched?.length ?? 0) > 0
    const fade = isRealNavigation && shouldFadeHomeInfo(
      from.path,
      to.path,
      defaultLocale,
      locales,
    )
    store.pageTransition = fade ? 'fade' : 'none'
  }

  if (from.meta.pageTransition && typeof from.meta.pageTransition !== 'boolean') {
    from.meta.pageTransition.name = store.pageTransition
  }
  if (to.meta.pageTransition && typeof to.meta.pageTransition !== 'boolean') {
    to.meta.pageTransition.name = store.pageTransition
  }
})
