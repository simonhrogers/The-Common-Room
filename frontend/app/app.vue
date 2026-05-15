<template>
  <AppHeader />
  <!-- Main -->
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const sanityStore = useSanityStore()
const mainStore = useMainStore()
const route = useRoute()
const config = useRuntimeConfig()
const { locale, defaultLocale } = useI18n()
const localeHead = useLocaleHead({ seo: true })
const settings = computed(() => sanityStore.settings as any)
const gifSources = computed(() => settings.value?.gifs || [])

import imageUrlBuilder from "@sanity/image-url"
const builder = imageUrlBuilder((useSanity() as any).config as any)

/** Matches `sanity-plugin-internationalized-array` rows (`language`) and legacy `_key`. */
const getI18nValue = (
  arr: Array<{ _key?: string; language?: string; value?: string }> | string | undefined,
  lang: string,
): string => {
  if (!arr) return ''
  if (typeof arr === 'string') return arr
  if (!Array.isArray(arr) || !arr.length) return ''
  const code = (lang || defaultLocale.value || 'en').toString()
  const def = (defaultLocale.value || 'en').toString()
  const matches = (row: { _key?: string; language?: string; value?: string }, c: string) =>
    row && (row.language === c || row._key === c)
  return (
    arr.find((t) => matches(t, code))?.value
    ?? arr.find((t) => matches(t, def))?.value
    ?? arr.find((t) => matches(t, 'en'))?.value
    ?? arr[0]?.value
    ?? ''
  )
}

const siteTitle = computed(() =>
  getI18nValue(settings.value?.seo?.seoTitle, locale.value) || 'The Common Room'
)

const siteDescription = computed(() =>
  getI18nValue(settings.value?.seo?.seoDescription, locale.value)
)

const seoImageUrl = computed(() =>
  settings.value?.seo?.seoImage
    ? builder.image(settings.value.seo.seoImage).width(1200).height(627).fit('crop').url()
    : ''
)

// Emit hreflang alternates and html lang attribute
useHead(localeHead)

useHead(() => ({
  titleTemplate: (title) => (title ? `${title} | ${siteTitle.value}` : siteTitle.value),
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=5' },
    {
      key: 'theme-color',
      name: 'theme-color',
      content: mainStore.demonMode ? 'rgb(255, 0, 0)' : '#FFFFFF',
    },
    { property: 'og:title', content: siteTitle.value },
    { property: 'og:site_name', content: siteTitle.value },
    { property: 'og:url', content: `${config.public.BASE_URL}${route.fullPath}` },
    { name: 'description', content: siteDescription.value },
    { property: 'og:description', content: siteDescription.value },
    settings.value?.seo?.metaKeywords?.length
      ? { name: 'keywords', content: settings.value.seo.metaKeywords.join(',') }
      : null,
    seoImageUrl.value ? { property: 'og:image', content: seoImageUrl.value } : null,
    seoImageUrl.value ? { property: 'og:image:width', content: '1200' } : null,
    seoImageUrl.value
      ? {
          property: 'og:image:height',
          content: Math.floor(1200 / (settings.value?.seo?.seoImage?.metadata?.dimensions?.aspectRatio ?? 1.5)).toString(),
        }
      : null,
    { property: 'og:image:type', content: settings.value?.seo?.seoImage?.asset?.mimeType ?? '' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: siteTitle.value },
    { name: 'twitter:description', content: siteDescription.value },
    seoImageUrl.value ? { name: 'twitter:image', content: seoImageUrl.value } : null,
  ].filter(Boolean),
  link: [
    {
      rel: 'preload',
      href: '/fonts/UniversPro67-BoldCondensed.woff2',
      as: 'font',
      type: 'font/woff2',
      crossorigin: ''
    },
    {
      rel: 'preload',
      href: '/fonts/ABCDiatypeHangul-Bold.woff2',
      as: 'font',
      type: 'font/woff2',
      crossorigin: ''
    },
  ],
}))

</script>
