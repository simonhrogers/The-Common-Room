import { FontaineTransform } from 'fontaine'
import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  compatibilityDate: '2026-03-20',

  router: {
    middleware: ['transition'],
    options: {
    },
  },

  routeRules: {
    '/': { isr: 1800 },
    '/info': { isr: 1800 },
    '/ko': { isr: 1800 },
    '/ko/info': { isr: 1800 },
  },

  modules: [
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/sanity',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    '@nuxt/icon',
    '@nuxt/fonts',
    '@nuxt/eslint',
    '@nuxthub/core',
    'nuxt-svgo-loader',
  ],

  site: {
    url: 'https://www.thecommonroom.world',
    name: 'The Common Room',
  },

  sitemap: {
    sources: [
      '/api/sitemap',
    ],
  },

  robots: {
    disallow: ['/account', '/account/*'],
    sitemap: 'https://www.thecommonroom.world/sitemap.xml',
  },

  icon: {
    clientBundle: {
      scan: true,
      sizeLimitKb: 256,
    },
  },

  fonts: {
    defaults: {
      weights: [600],
      styles: ['normal'],
      subsets: ['latin'],
    },
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },

  css: [
    '@/assets/styles/app.scss',
    '@/assets/styles/fontaine.css',
  ],

  postcss: {
    plugins: {
      '@csstools/postcss-global-data': {
        files: ['app/assets/styles/2-basics/_breakpoints.scss'],
      },
      'postcss-custom-media': {},
      'postcss-nested': {},
    },
  },

  svgoLoader: {
    
  },

  components: [
    {
      path: '@/components',
      pathPrefix: false,
    },
  ],

  nitro: {
    // Avoid fs payload cache in dev (parent + child routes → file/dir clash under .nuxt/cache).
    // On track to be resolved in Nuxt 5.0.0
    devStorage: { cache: { driver: 'memory' } },
  },

  vite: {
    plugins: [ 
      // Fontaine a bit off faff, not sure it’s fully needed within my setup
      // Doesn’t work with widths anyway so will be a jump between condensed.
      // I am preloading the fonts in app.vue so should be nice and quick anyway
      FontaineTransform.vite({
        fallbacks: {
          Univers: ['Helvetica Neue', 'Arial'],
          Diatype: ['Helvetica Neue', 'Arial'],
        },
        resolvePath: id =>
          `file://${fileURLToPath(new URL(`./public${id}`, import.meta.url))}`,
      }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/styles/mixins.scss" as *;',
        },
      },
    },
    optimizeDeps: {
      include: [
        '@sanity/image-url',
        '@sanity/client',
        'lazysizes',
        'lazysizes/plugins/parent-fit/ls.parent-fit',
      ]
    }
  },

  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'en',
    locales: [
      { code: 'en', language: 'en-GB', name: 'English', file: 'en.json' },
      { code: 'ko', language: 'ko-KR', name: '한국어', file: 'ko.json' },
    ],
    restructureDir: 'app',
    langDir: 'locales',
    detectBrowserLanguage: false,
    baseUrl: 'https://www.thecommonroom.world',
    bundle: {
      optimizeTranslationDirective: false,
    },
    experimental: {
      typedOptionsAndMessages: 'default',
    },
  },

  sanity: {
    projectId: process.env.NUXT_SANITY_PROJECT_ID,
    dataset: process.env.NUXT_SANITY_DATASET,
    apiVersion: process.env.NUXT_SANITY_API_VERSION || '2026-02-04',
    useCdn: true,
    additionalClients: {
      preview: {
        useCdn: false,
        withCredentials: true,
      },
    },
    visualEditing: undefined,
  },
})
