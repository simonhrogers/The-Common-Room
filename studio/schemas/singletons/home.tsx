import { HomeIcon } from "../../components/Icons"
import { ImageIcon } from "@sanity/icons"
import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'home',
  title: 'Home',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'slideshow',
      title: 'Slideshow',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          icon: ImageIcon,
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
              description: 'Describe the image for accessibility.',
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
          ],
          preview: {
            select: {
              caption: 'caption',
              alt: 'alt',
              filename: 'asset.originalFilename',
              media: 'asset',
            },
            prepare(selection) {
              const caption = (selection?.caption || '').trim()
              const alt = (selection?.alt || '').trim()
              const filename = (selection?.filename || '').trim()

              return {
                title: caption || alt || filename || 'Image',
                subtitle: caption ? (alt || filename || '') : (alt ? (filename || '') : ''),
                media: selection?.media,
              }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Home"
      }
    },
  },
})
