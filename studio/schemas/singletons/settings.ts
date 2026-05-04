import { SettingsIcon } from "../../components/Icons"
import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  icon: SettingsIcon,
  // Uncomment below to have edits publish automatically as you type
  // liveEdit: true,
  fields: [
    defineField({
      name: 'gifs',
      title: 'GIFs',
      description: 'GIF images used for the on-site Easter egg overlay.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: false, accept: 'image/gif' },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({
          name: 'seoTitle',
          title: 'Title',
          type: 'string',
          // add warning about length 
          description: 'The title of your website. Displayed in the browser tab, on search engine results etc.'
        }),
        defineField({
          name: 'seoDescription',
          title: 'Description',
          type: 'text',
          description: 'A brief description of your website. Displayed on search engine results, WhatsApp, and social cards.'
        }),
        defineField({
          name: 'seoImage',
          title: 'Open Graph Image',
          type: 'image',
          description: 'Displayed on social cards and search engine results.',
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Settings',
      }
    },
  },
})
