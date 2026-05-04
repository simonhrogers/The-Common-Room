export default defineNuxtPlugin(async () => {
	const sanityStore = useSanityStore()
	const route = useRoute()

	// fetch global page data on start
	await sanityStore.fetchSiteContent()

	// check if preview mode is active and set previewIsActive
	const preview = route.query.preview && route.query.preview === 'true'
	if (preview) {
		sanityStore.previewIsActive = true
	}
})

