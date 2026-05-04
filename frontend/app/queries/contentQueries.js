import { 
  contentBlockQuery, 
  imageQuery, 
  minimalImageQuery,
  seoQuery, 
  linkQuery,
} from '@/queries/helperQueries'

// remove siteOptions, siteNav – from boilerplate
// expand slugs to include all slugs
/** Plain GROQ string (no groq tag) so server imports work without Nuxt auto-imports. */
export const headerMenuSanityQuery = `{
  "fashionCollections": *[_type == "fashionCollection"] | order(date desc) {
    title,
    "slug": slug.current
  },
  "campaigns": *[_type == "campaign"] | order(date desc) {
    title,
    "slug": slug.current
  },
  "about": *[_type == "about"] | order(_updatedAt desc) [0] {
    "sections": sections[] {
      "_key": _key,
      title
    }
  }
}`

export const siteQuery = groq`{
  "settings": *[_id == "settings"] [0] {
    ...,
    menuItems[]-> {
      _type,
      "slug": slug.current,
      title
    },
    footer[] {
      ...,
      ${linkQuery}
    },
    "subnavigation": {
      "fashionCollections": *[_type == "fashionCollection"] {
        _id,
        _type,
        title,
        "slug": slug.current,
      },
      "campaigns": *[_type == "campaign"] {
        _id,
        _type,
        title,
        "slug": slug.current,
      },
      "about": *[_type == "about"].sections[] {
        "_id": _key,
        title,
        "slug": _key,
      }
    }
  },
	"slugs": {
		"pages": *[_type == "page"].slug.current,
    "fashionCollections": *[_type == "fashionCollection"].slug.current,
    "campaigns": *[_type == "campaign"].slug.current,
	}
}`

export const homepageQuery = groq`
*[(_type == "home")] | order(_updatedAt desc) [0]{
  ...,
  slideshow[] {
    ...,
    reference-> {
      _id,
      _type,
      title,
      "slug": slug.current,
    },
    "images": images[] {
      ${imageQuery},
    },
  },
}`

export const fashionCollectionsQuery = groq`{
  "collections": *[_type == "fashionCollection"] | order(date desc) {
    _type,
    _id,
    title,
    "slug": slug.current,
    "images": images[] {
      ${minimalImageQuery}
    },
  },
}`

export const fashionCollectionQuery = groq`*[_type == "fashionCollection" && slug.current == $slug] | order(_updatedAt desc) [0] {
  ...,
  "slug": slug.current,
  "images": images[] {
    ${minimalImageQuery},
    caption,
  },
}`

export const campaignsQuery = groq`{
  "campaigns": *[_type == "campaign"] | order(date desc) {
    ...,
    "slug": slug.current,
    "images": images[] {
      ${minimalImageQuery}
    },
  },
}`

export const campaignQuery = groq`*[_type == "campaign" && slug.current == $slug] | order(_updatedAt desc) [0] {
  ...,
  "slug": slug.current,
  "images": images[] {
    ${minimalImageQuery},
    caption,
  },
}`

export const aboutQuery = groq`*[_type == "about"] | order(_updatedAt desc) [0] {
  ...,
  sections[] {
    ...,
    _type == 'textBlock' => {
      ...,
    },
    _type == 'imageBlock' => {
      ...,
      "image": image {
        ${imageQuery},
      },
    },
    _type == 'awardsBlock' => {
      ...,
      allAwards => {
        "awards": *[_type == "award" ] | order(date desc) {
          ...,
        },
      },
      !allAwards => {
        "awards": awards[]-> {
          ...,
        },
      },
    },
    _type == 'pressBlock' => {
      ...,
      allPressItems => {
        "pressItems": *[_type == "pressItem" ] | order(date desc) {
          ...,
        },
      },
      !allPressItems => {
        "pressItems": pressItems[]-> {
          ...,
        },
      },
    },
  },
}`

export const contactQuery = groq`*[_type == "contact"] | order(_updatedAt desc) [0] {
  ...,
}`

export const imprintQuery = groq`*[_type == "imprint"] | order(_updatedAt desc) [0] {
  ...,
}`

export const privacyPolicyQuery = groq`*[_type == "privacyPolicy"] | order(_updatedAt desc) [0] {
  ...,
  sections[] {
    ...,
    _type == 'textBlock' => {
      ...,
    },
    _type == 'imageBlock' => {
      ...,
      "image": image {
        ${imageQuery},
      },
    },
  },
}`
