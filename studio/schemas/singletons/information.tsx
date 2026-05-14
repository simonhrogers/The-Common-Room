import { AboutIcon } from "../../components/Icons"
import { defineField, defineType } from 'sanity'

const localeBlockContent = (name: string, title: string) => defineField({
  name,
  title,
  type: 'object',
  fields: [
    defineField({ name: 'en', title: 'English', type: 'blockContentSimple' }),
    defineField({ name: 'ko', title: '한국어', type: 'blockContentSimple' }),
  ],
})

export default defineType({
  name: 'information',
  title: 'Information',
  type: 'document',
  icon: AboutIcon,
  fields: [
    localeBlockContent('information', 'Information'),
    localeBlockContent('contact', 'Contact'),
    defineField({
      name: 'pressRelease',
      title: 'Press Release',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Title',
          type: 'internationalizedArrayString',
        }),
        defineField({
          name: 'file',
          title: 'PDF',
          type: 'object',
          fields: [
            defineField({ name: 'en', title: 'English PDF', type: 'file', options: { accept: 'application/pdf' } }),
            defineField({ name: 'ko', title: '한국어 PDF', type: 'file', options: { accept: 'application/pdf' } }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Information' }
    }
  }
})
