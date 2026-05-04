import type { SitemapUrlInput } from '#sitemap/types'

/**
 * Generates sitemap URLs for the web app.
 * @returns An array of sitemap URL objects
 * @see https://nuxt.com/modules/sitemap
 */
export default defineSitemapEventHandler(async () => {
  return [
    { loc: '/', lastmod: new Date(Date.now()) },
    { loc: '/about', lastmod: new Date(Date.now()) },
  ] satisfies SitemapUrlInput[]
})
