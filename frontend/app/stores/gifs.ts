import { defineStore } from 'pinia'

export type GifSpawn = {
  id: string
  src: any
  x: number
  y: number
  createdAt: number
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n))

const shuffleInPlace = <T,>(arr: T[]) => {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = arr[i]!
    arr[i] = arr[j]!
    arr[j] = tmp
  }
  return arr
}

const shuffleCopy = <T,>(arr: T[]) => shuffleInPlace([...arr])

export const useGifsStore = defineStore('GifsStore', {
  state: () => ({
    enabled: false,
    clearing: false,

    spawnIntervalMs: 1_000,
    clearIntervalMs: 50,

    spawns: [] as GifSpawn[],
    gifPickOrder: [] as any[],

    spawnTimer: 0 as unknown as number,
    clearTimer: 0 as unknown as number,
  }),
  actions: {
    stopSpawnTimer() {
      if (this.spawnTimer) {
        clearInterval(this.spawnTimer)
        this.spawnTimer = 0 as unknown as number
      }
    },
    stopClearTimer() {
      if (this.clearTimer) {
        clearInterval(this.clearTimer)
        this.clearTimer = 0 as unknown as number
      }
    },
    resetPickOrder(gifs: any[]) {
      this.gifPickOrder = shuffleCopy(gifs)
    },
    nextGif(gifs: any[]) {
      if (!Array.isArray(gifs) || gifs.length === 0) return null
      if (!this.gifPickOrder.length) this.resetPickOrder(gifs)
      return this.gifPickOrder.pop() ?? null
    },
    spawnOne(gifs: any[]) {
      const pick = this.nextGif(gifs)
      if (!pick) return

      const now = Date.now()
      const id = `${now}-${Math.random().toString(16).slice(2)}`

      const pad = 0.04
      const x = clamp01(pad + Math.random() * (1 - 2 * pad))
      const y = clamp01(pad + Math.random() * (1 - 2 * pad))

      this.spawns.push({ id, src: pick, x, y, createdAt: now })

      // Keep it lightweight
      if (this.spawns.length > 25) this.spawns.splice(0, this.spawns.length - 25)
    },
    startIdle(gifs: any[]) {
      if (!import.meta.client) return
      if (!Array.isArray(gifs) || gifs.length === 0) return

      this.stopClearTimer()
      this.clearing = false

      this.enabled = true
      this.resetPickOrder(gifs)

      this.stopSpawnTimer()
      this.spawnTimer = window.setInterval(() => {
        this.spawnOne(gifs)
      }, this.spawnIntervalMs) as unknown as number
    },
    stopAndClear() {
      if (!import.meta.client) return

      this.enabled = false
      this.stopSpawnTimer()

      // Don't restart the clear interval on every mousemove/keydown.
      // Interaction should not interrupt the current 100ms cadence.
      if (this.clearing) return

      if (!this.spawns.length) {
        this.clearing = false
        this.stopClearTimer()
        return
      }

      this.clearing = true
      this.stopClearTimer()

      this.clearTimer = window.setInterval(() => {
        // Clear in a predictable 1-2-3... order (oldest to newest)
        if (!this.spawns.length) {
          this.stopClearTimer()
          this.clearing = false
          return
        }

        this.spawns.shift()
        if (!this.spawns.length) {
          this.stopClearTimer()
          this.clearing = false
        }
      }, this.clearIntervalMs) as unknown as number
    },
    dispose() {
      this.stopSpawnTimer()
      this.stopClearTimer()
      this.enabled = false
      this.clearing = false
      this.spawns = []
      this.gifPickOrder = []
    },
  },
})
