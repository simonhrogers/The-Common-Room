import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { colorInput } from '@sanity/color-input'
import { visionTool } from '@sanity/vision'
import { media } from 'sanity-plugin-media'
import { documentInternationalization } from '@sanity/document-internationalization'
import { internationalizedArray } from 'sanity-plugin-internationalized-array'
// import { muxInput } from 'sanity-plugin-mux-input'
import { defaultDocumentNode } from './config/views'
import { resolveProductionUrl } from './config/views'
import { initialValueTemplates } from './config/initialValueTemplates'
import { pageStructure } from './config/pageStructure'
import { singletonPlugin } from './config/singleton'

// Singletons
import about from '@/schemas/singletons/about'
import home from '@/schemas/singletons/home'
import settings from '@/schemas/singletons/settings'

// Objects
import blockContent from '@/schemas/objects/blockContent'
import blockContentSimple from '@/schemas/objects/blockContentSimple'
import seo from '@/schemas/objects/seo'

const I18N_LANGUAGES = [
  { id: 'en', title: 'English' },
  { id: 'ko', title: '한국어' },
]

export default defineConfig({
	name: 'default',
	title: 'The Common Room',
	projectId: process.env.SANITY_STUDIO_PROJECT_ID,
	dataset: process.env.SANITY_STUDIO_DATASET,
	plugins: [
    structureTool({
      structure: pageStructure(
        [
          { ...home, type: 'singleton' },
          { ...about, type: 'singleton' },
          { type: 'divider' },
          { ...settings, type: 'singleton' },
        ]
      ),
      defaultDocumentNode,
    }),
    singletonPlugin([home.name, settings.name, 'media.tag']),
    internationalizedArray({
      languages: I18N_LANGUAGES,
      defaultLanguages: ['en'],
      fieldTypes: ['string', 'text'],
    }),
    documentInternationalization({
      supportedLanguages: I18N_LANGUAGES,
      schemaTypes: ['about'],
    }),
    colorInput(),
		// muxInput({ mp4_support: 'standard' }),
		media(),
    visionTool(),
		// ...(isDev ? [visionTool()] : []),
	],
	schema: {
		types: [
      // Singletons
      home,
      about,
      settings,
      blockContent,
      blockContentSimple,
      seo,
    ],
		templates: (prev) => initialValueTemplates(prev),
	},

	document: {
		productionUrl: async (prev, context) =>
			resolveProductionUrl({
				context,
				frontendUrl: import.meta.env.SANITY_STUDIO_FRONTEND_URL,
			}),
	},
})
