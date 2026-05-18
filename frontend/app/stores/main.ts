import { defineStore } from 'pinia'

export const useMainStore = defineStore('MainStore', {
	state: () => {
		return {
      demonMode: false,
      /** Synced from homepage slideshow for header slide counter */
      homeSlideIndex: 0,
      homeSlideCount: 0,
      /** Active homepage slide UI text: `white` (default) or `black` */
      homeUiTextColor: 'white' as 'white' | 'black',
      /** Active Nuxt page transition name (set by transition middleware). */
      pageTransition: 'none',
      /** When true, next navigation keeps `pageTransition` set before navigate. */
      internalNavigation: false,
		}
	},

	actions: {
		toggleDemonMode() {
			this.demonMode = !this.demonMode
		},
		setPageTransition(transitionName: string) {
			this.pageTransition = transitionName
		},
	},
})
