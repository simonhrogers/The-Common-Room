import imageUrlBuilder from '@sanity/image-url'
import { computed, unref } from 'vue'

function getI18nValue(arr, lang, fallback = 'en') {
  if (!arr) return ''
  if (typeof arr === 'string') return arr
  if (!Array.isArray(arr) || !arr.length) return ''
  const code = (lang || fallback || 'en').toString()
  const def = (fallback || 'en').toString()
  const matches = (row, c) => row && (row.language === c || row._key === c)
  return (
    arr.find((t) => matches(t, code))?.value
    ?? arr.find((t) => matches(t, def))?.value
    ?? arr.find((t) => matches(t, 'en'))?.value
    ?? arr[0]?.value
    ?? ''
  )
}

export default function usePageHead({ title, seo, titleImage } = {}) {
  const sanityStore = useSanityStore()
  const { locale, defaultLocale } = useI18n()
  const builder = imageUrlBuilder(useSanity().config)

  const titleString = computed(() => unref(title) || '')

  const resolvedSeo = computed(() => unref(seo) ?? sanityStore.settings?.seo ?? {})

  const siteTitle = computed(
    () =>
      getI18nValue(resolvedSeo.value?.seoTitle, locale.value, defaultLocale.value)
      || 'The Common Room',
  )

  const longTitle = computed(() => {
    const t = titleString.value
    if (!t || t === siteTitle.value) return siteTitle.value
    return `${t} | ${siteTitle.value}`
  })

  const seoDescription = computed(() =>
    getI18nValue(
      resolvedSeo.value?.seoDescription,
      locale.value,
      defaultLocale.value,
    ),
  )

  const ogAsset = computed(
    () =>
      resolvedSeo.value?.seoImage?.asset
      ?? titleImage?.asset
      ?? sanityStore.settings?.seo?.seoImage?.asset,
  )

  const ogImageUrl = computed(() =>
    ogAsset.value
      ? builder.image(ogAsset.value).width(1200).height(630).fit('crop').url()
      : '',
  )

  useHead(() => {
    const pageTitle =
      titleString.value && titleString.value !== siteTitle.value
        ? titleString.value
        : null

    return {
      title: pageTitle,
      meta: [
        { key: 'og:title', property: 'og:title', content: longTitle.value },
        seoDescription.value
          ? { key: 'description', name: 'description', content: seoDescription.value }
          : null,
        seoDescription.value
          ? { key: 'og:description', property: 'og:description', content: seoDescription.value }
          : null,
        resolvedSeo.value?.metaKeywords?.length
          ? { key: 'keywords', name: 'keywords', content: resolvedSeo.value.metaKeywords.join(',') }
          : null,
        ogImageUrl.value
          ? { key: 'og:image', property: 'og:image', content: ogImageUrl.value }
          : null,
        ogImageUrl.value
          ? { key: 'og:image:width', property: 'og:image:width', content: '1200' }
          : null,
        ogImageUrl.value
          ? { key: 'og:image:height', property: 'og:image:height', content: '630' }
          : null,
        ogImageUrl.value
          ? {
              key: 'og:image:type',
              property: 'og:image:type',
              content: ogAsset.value?.mimeType ?? '',
            }
          : null,
        { key: 'twitter:title', name: 'twitter:title', content: longTitle.value },
        seoDescription.value
          ? { key: 'twitter:description', name: 'twitter:description', content: seoDescription.value }
          : null,
        ogImageUrl.value
          ? { key: 'twitter:image', name: 'twitter:image', content: ogImageUrl.value }
          : null,
      ].filter(Boolean),
    }
  })
}
