import { HomeIcon } from "../../components/Icons"
import { ImageIcon } from "@sanity/icons"
import { defineArrayMember, defineField, defineType } from 'sanity'

/** Preview `select` returns arrays as plain objects with numeric keys in Studio v3+ */
function previewListLength(value: unknown): number {
  if (Array.isArray(value)) return value.length
  if (value && typeof value === 'object') return Object.keys(value as object).length
  return 0
}

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
          name: 'slideWithImages',
          title: 'Slide',
          type: 'object',
          icon: ImageIcon,
          preview: {
            select: {
              firstImage: 'images.0',
              originalFilename: 'images.0.asset.originalFilename',
              images: 'images',
            },
            prepare({ firstImage, originalFilename, images }) {
              const count = previewListLength(images)
              const name =
                typeof originalFilename === 'string' && originalFilename.trim()
                  ? originalFilename.trim()
                  : 'Slide'

              return {
                title: name,
                subtitle:
                  count === 0
                    ? 'No images'
                    : `${count} image${count === 1 ? '' : 's'}`,
                media: firstImage,
              }
            },
          },
          fields: [
            defineField({
              name: 'images',
              title: 'Images',
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
                  options: {
                    hotspot: true,
                  },
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
              validation: (rule) => rule.required().min(1).max(9),
            }),
          ],
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
