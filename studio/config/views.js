import { Iframe } from 'sanity-plugin-iframe-pane'

/*
list of schema types supporting preview
*/
export const previewSchemaTypes = [
  'home',
  'project',
  'about',
  'contact',
  'privacyPolicy',
  'imprint',
]

/*
default document node:
add preview view if part of list
*/
export const defaultDocumentNode = (S, { schemaType }) => {
	const frontendUrl = import.meta.env.SANITY_STUDIO_FRONTEND_URL

	if (previewSchemaTypes.includes(schemaType)) {
		return S.document().views([
			S.view.form(),
			S.view
				.component(Iframe)
				.title('Preview')
				.options({
					url: (doc) => resolveProductionUrl({ doc, context: S.context, frontendUrl }),
					defaultSize: 'desktop',
					reload: {
						button: true,
					},
					attributes: {
						allow: 'fullscreen',
					},
				}),
		])
	}
}

/*
general function to add preview pane
*/
export const addPreviewPane = (S) => {
  const frontendUrl = import.meta.env.SANITY_STUDIO_FRONTEND_URL

  return S.view
    .component(Iframe)
    .title('Preview')
    .options({
      url: (doc) => resolveProductionUrl({ doc, context: S.context, frontendUrl }),
      defaultSize: 'desktop',
      reload: {
        button: true,
      },
      attributes: {
        allow: 'fullscreen',
      },
    });
}

/*
resolve production url
*/
export const resolveProductionUrl = async ({ doc, context, frontendUrl }) => {
	const { getClient } = context

	if (!doc) {
		doc = context.document
	}

	if (previewSchemaTypes.includes(doc._type)) {
		const client = await getClient({ apiVersion: '2022-05-04' })
		const slug = await client.fetch(`*[_id == $id][0].slug.current`, { id: doc._id })

		// Build preview url
		const url = new URL(frontendUrl)

		// Switch for resolving doc type urls
		switch (doc._type) {
			case 'home':
				url.pathname = `/`
				break
			case 'page':
				url.pathname = `/${slug}`
				break
      case 'project':
        url.pathname = `/projects/${slug}`
        break
      case 'about':
        url.pathname = doc.language === 'ko' ? `/ko/about` : `/about`
        break
      case 'contact':
        url.pathname = `/contact`
        break
      case 'privacyPolicy':
        url.pathname = `/privacy-policy`
        break
      case 'imprint':
        url.pathname = `/imprint`
        break
			default:
				break
		}

		// Add preview url params
		url.searchParams.set('preview', 'true')

		return url.toString()
	}

	return ''
}
