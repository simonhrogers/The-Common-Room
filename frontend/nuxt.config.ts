// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-03-20',
  
  routeRules: {
    '/': { isr: 1800 }, // revalidate every 30 minutes
    '/about': { isr: 1800 }, // revalidate every 30 minutes
  },

  modules: [
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
    url: 'https://www.bbot.studio',
    name: 'Bella Bruton & Ottilie Thompson Ltd.',
  },

  sitemap: {
    sources: [
      '/api/sitemap',
    ],
  },

  robots: {
    disallow: ['/account', '/account/*'],
    sitemap: 'https://www.commission.nyc/sitemap.xml',
  },

  icon: {
    clientBundle: {
      scan: true,
      sizeLimitKb: 256,
    },
  },

  fonts: {
    defaults: {
      weights: [400, 500],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
    },
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },

  css: [
    '@/assets/styles/app.scss'
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
