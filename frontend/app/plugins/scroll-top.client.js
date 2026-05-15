/** Info is scrollable; home is fixed — always reset window scroll on navigation. */
export default defineNuxtPlugin(() => {
  const router = useRouter()

  router.afterEach(() => {
    if (!import.meta.client) return
    window.scrollTo(0, 0)
  })
})
