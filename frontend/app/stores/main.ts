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
		}
	},

	actions: {
		toggleDemonMode() {
			this.demonMode = !this.demonMode
		},
	},
})
