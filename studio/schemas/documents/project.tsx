import { ProjectIcon } from '../../components/Icons'
import { defineArrayMember, defineField, defineType } from 'sanity'
import { toPlainText } from '@portabletext/react'

export default defineType({
  name: 'project',
  title: 'Project',
  titlePlural: 'Projects',
  type: 'document',
  icon: ProjectIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required()
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: (rule) => rule.required()
    }),

    // date 
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      options: {
        dateFormat: 'DD/MM/YYYY',
      },
      validation: (rule) => rule.required(),
      description: 'Not currently used, but will become necessary for sorting projects in the future. Could be displayed on the frontend now.'
    }),

    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
        }),
      ],
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'blocks',
      title: 'Images',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          name: 'image',
          title: 'Image',
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
            }),
          ],
          options: {
            hotspot: true,
          },
        }),
      ]
    }),

    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent'
    }),

    // sector 
    defineField({
      name: 'sector',
      title: 'Sectors',
      type: 'array',
      of: [{ 
        type: 'reference', 
        to: [{ type: 'projectSector' }] 
      }],
      validation: (rule) => rule.required(),
    }),

    // location
    defineField({
      name: 'location',
      title: 'Location',
      type: 'reference',
      to: [{ type: 'projectLocation' }],
      validation: (rule) => rule.required(),
    }),

    // collaborators
    defineField({
      name: 'collaborators',
      title: 'Collaborators',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'collaborator' }] }],
    }),

    // awards
    defineField({
      name: 'awards',
      title: 'Awards',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'award' }] }],
    }),

    // selected press
    defineField({
      name: 'selectedPress',
      title: 'Selected Press',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'pressItem' }] }],
    }),

    // photographers
    defineField({
      name: 'photographers',
      title: 'Photographers',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'collaborator' }] }],
    }),

    // seo
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
      media: 'coverImage'
    },
    prepare({ title, slug, media }) {
      return {
        title,
        subtitle: slug,
        media
      }
    },
  }
}) 