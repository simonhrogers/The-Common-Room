import { defineStore } from 'pinia'

export const useMainStore = defineStore('MainStore', {
	state: () => {
		return {
      demonMode: false,
		}
	},

	actions: {
		toggleDemonMode() {
			this.demonMode = !this.demonMode
		},
	},
})
