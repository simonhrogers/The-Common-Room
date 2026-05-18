import type { SitemapUrlInput } from '#sitemap/types'

export default defineSitemapEventHandler(async () => {
  return [
    {
      loc: '/',
      alternatives: [
        { hreflang: 'en', href: '/' },
        { hreflang: 'ko', href: '/ko' },
        { hreflang: 'x-default', href: '/' },
      ],
    },
    {
      loc: '/info',
      alternatives: [
        { hreflang: 'en', href: '/info' },
        { hreflang: 'ko', href: '/ko/info' },
        { hreflang: 'x-default', href: '/info' },
      ],
    },
    {
      loc: '/ko',
      alternatives: [
        { hreflang: 'en', href: '/' },
        { hreflang: 'ko', href: '/ko' },
        { hreflang: 'x-default', href: '/' },
      ],
    },
    {
      loc: '/ko/info',
      alternatives: [
        { hreflang: 'en', href: '/info' },
        { hreflang: 'ko', href: '/ko/info' },
        { hreflang: 'x-default', href: '/info' },
      ],
    },
  ] satisfies SitemapUrlInput[]
})
