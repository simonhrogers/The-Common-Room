import { defineStore } from 'pinia'
import { siteQuery } from '@/queries/contentQueries'

export const useSanityStore = defineStore('SanityStore', {
	state: () => {
		return {
      settings: {},
      footer: {},
			slugs: {},
			previewIsActive: false,
		}
	},

	actions: {
		async fetchSiteContent() {
			const { data } = await useSanityQuery(siteQuery)

      let payload = data.value
      // TEMP FIX: bug with @nuxtjs/sanity response shape (visual-editing, v2.2.0): payload is nested under `.data`.
      if (payload && payload.data) {
        payload = payload.data
      }

      this.settings = payload?.settings || {}
      this.footer = payload?.settings?.footer || {}
			this.slugs = payload?.slugs || {}
		},
	},
})
