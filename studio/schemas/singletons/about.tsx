import { AboutIcon } from "../../components/Icons"
import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'about',
  title: 'About',
  type: 'document',
  icon: AboutIcon,
  fields: [
    defineField({
      name: 'information',
      title: 'Information',
      type: 'blockContentSimple',
    }),
    defineField({
      name: 'contact',
      title: 'Contact email',
      type: 'string',
    }),
    // address
    defineField({
      name: 'address',
      title: 'Address',
      type: 'string',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'About'
      }
    }
  }
}) 