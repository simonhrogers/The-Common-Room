import { defineField } from "sanity"

export default {
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    // defineField({
    //   name: 'seoTitle',
    //   title: 'Title',
    //   type: 'string',
    //   // add warning about length 
    //   description: 'The title of your website. Displayed in the browser tab, on search engine results etc.'
    // }),
    defineField({
      name: 'seoDescription',
      title: 'Description',
      type: 'text',
      description: 'A brief description of your page. Displayed on search engine results, WhatsApp, and social cards.'
    }),
    defineField({
      name: 'seoImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'Displayed on social cards and search engine results.',
    }),
  ],
}