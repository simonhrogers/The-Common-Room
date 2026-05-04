import imageUrlBuilder from '@sanity/image-url'
import { computed, unref } from 'vue'

/*
  Page head helper (title + basic OG image support) mirroring Studio's `usePageHead`.
*/
export default function usePageHead({ title, seo, titleImage } = {}) {
  const builder = imageUrlBuilder(useSanity().config)

  const titleString = unref(title) || ''

  const ogAsset = computed(
    () => seo?.seoImage?.asset ?? titleImage?.asset
  )

  const ogImageUrl = computed(() =>
    ogAsset.value
      ? builder
          .image(ogAsset.value)
          .width(1200)
          .height(630)
          .fit('crop')
          .url()
      : ''
  )

  useHead(() => {
    const pageTitle = titleString || null

    return {
      title: pageTitle,
      meta: [
        { property: 'og:title', content: pageTitle || titleString },
        ...(seo?.seoDescription
          ? [{ name: 'description', content: seo.seoDescription }]
          : []),
        ...(seo?.seoDescription
          ? [{ property: 'og:description', content: seo.seoDescription }]
          : []),
        ...(seo?.metaKeywords?.length
          ? [
              {
                name: 'keywords',
                content: seo.metaKeywords.join(','),
              },
            ]
          : []),
        ...(ogImageUrl.value
          ? [{ property: 'og:image', content: ogImageUrl.value }]
          : []),
      ].filter(Boolean),
    }
  })
}

