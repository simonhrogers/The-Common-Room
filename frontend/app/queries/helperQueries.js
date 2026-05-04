export const linkQuery = `
	_type == "internalLink" => {
		"linkType": "internalLink",
		"title": coalesce( title,
			linkTarget->title
		),
		"route": select(
			linkTarget->_type == "pageHome" => "index",
			linkTarget->_type == "pageProjects" => "projects",
			linkTarget->_type == "page" => "slug",
			linkTarget->_type == "project" => "projects-slug",
			"index"
		),
		"slug": linkTarget->slug.current
	},
	_type == "link" => {
		...,
		"linkType": "externalLink",
		"title": coalesce(title, href)
	}
`

export const imageQuery = `
  _type,
  alt,
  caption,
  body,
  asset,
  "id": asset._ref,
  "preview": asset->metadata.lqip,
  "aspectRatio": asset->metadata.dimensions.aspectRatio,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  hotspot { x, y }
`

// `id` only (no `asset` object) saves a few bytes per image; components resolve it for @sanity/image-url.
export const minimalImageQuery = `
  _type,
  "id": asset._ref,
  alt,
  "aspectRatio": asset->metadata.dimensions.aspectRatio
`

export const contentBlockQuery = `
  ...,
	_type == "block" => {
		...
	},
  _type == 'image' => {
    "image": {${imageQuery}},
  },
	markDefs[]{
		...,
		_type == "download" => {"url": file.asset->url},
		${linkQuery}
	}
`

export const seoQuery = `
	seo {
		...,
		ogImage{asset->}
	}
`