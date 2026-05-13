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
      loc: '/about',
      alternatives: [
        { hreflang: 'en', href: '/about' },
        { hreflang: 'ko', href: '/ko/about' },
        { hreflang: 'x-default', href: '/about' },
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
      loc: '/ko/about',
      alternatives: [
        { hreflang: 'en', href: '/about' },
        { hreflang: 'ko', href: '/ko/about' },
        { hreflang: 'x-default', href: '/about' },
      ],
    },
  ] satisfies SitemapUrlInput[]
})
