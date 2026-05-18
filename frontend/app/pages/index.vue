<template>
  <main
    class="home"
    :class="{ 'home--ui-black': homeUiTextColor === 'black' }"
  >
    <AppHeader 
      :isInfoPage="false"
      :isHomePage="true"
    />
    <section
      v-if="slides.length > 0"
      class="slideshow"
      tabindex="0"
      role="region"
      aria-label="Homepage slideshow"
      @click="handleSlideClick"
      @keydown="handleKeydown"
      @touchstart.passive="onTouchStart"
      @touchend="onTouchEnd"
      @touchcancel="onTouchEnd"
    >
      <div
        ref="slideViewportRef"
        class="slide-viewport"
      >
        <div class="slide-stack">
          <div
            v-for="(slide, i) in slides"
            :key="slide.id || i"
            class="slide-item slide-stack__item"
            :data-slide-index="i"
            :class="[
              slideLayoutClass(slide),
              {
                'slide-stack__item--active': i === currentSlideIndex,
                'slide-stack__item--ui-black': slideUiTextColor(slide) === 'black',
              },
            ]"
          >
            <SharedSanityImage
              v-for="(image, ii) in slide.images"
              :key="image.id"
              :image="image"
              :alt="image.alt || ''"
              class="slide-img"
              :sizes="slideImageSizes(slide)"
              loading="eager"
              :fetch-priority="i === 0 && ii === 0 ? 'high' : 'low'"
            />
          </div>
        </div>
      </div>
    </section>

    <p
      v-if="slides.length > 0"
      class="home-slide-meta"
      aria-live="polite"
      :aria-label="`Slide ${homeSlideCurrent} of ${homeSlideCount}`"
    >
      <span class="home-slide-meta__line">{{ homeSlideCurrent }}</span>
      <span class="home-slide-meta__line">{{ homeSlideCount }}</span>
    </p>

    <!-- Child page overlay (e.g. /about) -->
    <NuxtPage />
  </main>
</template>

<script setup>
definePageMeta({
  pageTransition: pageTransition(),
  middleware: 'transition',
})

const homeQuery = groq`*[_id == "home"][0]{
  slideshow[]{
    uiTextColor,
    insetImage,
    images[] {
      alt,
      caption,
      asset,
      "id": asset._ref,
      "aspectRatio": asset->metadata.dimensions.aspectRatio,
      hotspot { x, y },
    },
  }
}`

const data = await useSanityData({ query: homeQuery })
const sanityStore = useSanityStore()
const mainStore = useMainStore()

usePageHead({
  title: '',
  seo: computed(() => sanityStore.settings?.seo),
})

useHead({
  bodyAttrs: {
    class: {
      'overflow-hidden': true,
    },
  },
})

const homeSlideCount = computed(() => mainStore.homeSlideCount)
const homeSlideCurrent = computed(() =>
  homeSlideCount.value > 0 ? mainStore.homeSlideIndex + 1 : 0,
)

const slides = computed(() => data.value?.slideshow || [])

function clampSlideIndex(index, length) {
  if (length <= 0) return 0
  return Math.max(0, Math.min(index, length - 1))
}

function slideUiTextColor(slide) {
  return slide?.uiTextColor === 'black' ? 'black' : 'white'
}

const homeUiTextColor = computed(() => {
  const slide = slides.value[currentSlideIndex.value]
  return slide ? slideUiTextColor(slide) : 'white'
})

/** Square edge for inset slides: 60% of the shortest viewport edge. */
const INSET_SQUARE_SIZES = 'min(60vw, 60svh)'

/** `sizes` for srcset — matches slide grid CSS (incl. portrait stack for 2–3 images). */
function slideImageSizes(slide) {
  const n = slide?.images?.length ?? 0
  if (n <= 0) return '100vw'
  if (n === 1 && slide?.insetImage) return INSET_SQUARE_SIZES
  if (n === 1) return '100vw'
  if (n < 4) return '(aspect-ratio < 1) 100vw, 50vw'
  if (n < 9) return '50vw'
  if (n === 9) return '33vw'
  return '100vw'
}

function slideLayoutClass(slide) {
  const n = slide?.images?.length ?? 0
  return {
    'one-image': n === 1,
    'one-image--inset': n === 1 && slide?.insetImage === true,
    'two-images': n > 1 && n < 4,
    'four-images': n > 3 && n < 9,
    'nine-images': n === 9,
  }
}

const currentSlideIndex = ref(0)

watchEffect(() => {
  const n = slides.value.length
  if (n === 0) {
    currentSlideIndex.value = 0
    return
  }
  if (currentSlideIndex.value >= n) {
    currentSlideIndex.value = n - 1
  }
})

onBeforeMount(() => {
  const n = slides.value.length
  if (n) {
    currentSlideIndex.value = clampSlideIndex(mainStore.homeSlideIndex, n)
  }
})

onMounted(async () => {
  if (!slides.value.length) return
  await settleSlideLayerImages(currentSlideIndex.value)
})

watch(
  [currentSlideIndex, () => slides.value.length, homeUiTextColor],
  ([index, count, uiColor]) => {
    mainStore.homeSlideIndex = index
    mainStore.homeSlideCount = count
    mainStore.homeUiTextColor = uiColor
  },
  { immediate: true },
)

onUnmounted(() => {
  mainStore.homeSlideCount = 0
  mainStore.homeUiTextColor = 'white'
})

const slideViewportRef = ref(null)
const slideNavLock = ref(false)

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((resolve) => {
      setTimeout(resolve, ms)
    }),
  ])
}

/** Wait until slide layer images have pixels (and decode when supported) to avoid blank swap. */
async function settleSlideLayerImages(index) {
  if (!import.meta.client) return
  await nextTick()
  const root = slideViewportRef.value
  if (!root) return
  const layer = root.querySelector(`[data-slide-index="${index}"]`)
  if (!layer) return
  const imgs = [...layer.querySelectorAll('img.slide-img')]
  if (!imgs.length) return

  const one = (img) => {
    if (img.complete && img.naturalWidth > 0) {
      return (img.decode?.() ?? Promise.resolve()).catch(() => {})
    }
    return new Promise((resolve) => {
      const done = () => {
        ;(img.decode?.() ?? Promise.resolve()).catch(() => {}).finally(resolve)
      }
      img.addEventListener('load', done, { once: true })
      img.addEventListener('error', resolve, { once: true })
    })
  }

  await withTimeout(Promise.all(imgs.map(one)), 10_000)
}

async function goToSlideIndex(next) {
  if (!slides.value.length) return
  const n = slides.value.length
  const i = ((next % n) + n) % n
  if (i === currentSlideIndex.value) return
  if (slideNavLock.value) return
  slideNavLock.value = true
  try {
    await settleSlideLayerImages(i)
    currentSlideIndex.value = i
  } finally {
    slideNavLock.value = false
  }
}

function nextSlide() {
  void goToSlideIndex(currentSlideIndex.value + 1)
}

function previousSlide() {
  void goToSlideIndex(currentSlideIndex.value - 1)
}

let touchStartX = null
let touchStartY = null

const onTouchStart = (event) => {
  const t = event.touches?.[0]
  if (!t) return
  touchStartX = t.clientX
  touchStartY = t.clientY
}

const onTouchEnd = (event) => {
  const t = event.changedTouches?.[0]
  if (!t || touchStartX === null || touchStartY === null) {
    touchStartX = null
    touchStartY = null
    return
  }

  const dx = t.clientX - touchStartX
  const dy = t.clientY - touchStartY

  touchStartX = null
  touchStartY = null

  // Basic swipe: ignore vertical intent + small movements.
  const minSwipePx = 40
  if (Math.abs(dx) < minSwipePx) return
  if (Math.abs(dx) < Math.abs(dy)) return

  // Swipe left => next, swipe right => previous
  if (dx < 0) nextSlide()
  else previousSlide()
}

const handleSlideClick = (event) => {
  const el = event.currentTarget
  const rect = el.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const midpoint = rect.width / 2

  if (clickX < midpoint) previousSlide()
  else nextSlide()
}

const handleKeydown = (event) => {
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    previousSlide()
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    nextSlide()
  }
}
</script>

<style scoped lang="scss">
.home {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
}

.slideshow {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  /* White UI → black surround; black UI → white (matches header / slide meta) */
  background-color: #000;
}

.home--ui-black .slideshow {
  background-color: #fff;
}

.slide-viewport {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

.slide-stack {
  position: relative;
  width: 100%;
  height: 100%;
}

.slide-stack__item {
  position: absolute;
  inset: 0;
  visibility: hidden;
  pointer-events: none;
  z-index: 0;
  background-color: #000;
  transition: none;
}

.slide-stack__item--ui-black {
  background-color: #fff;
}

.slide-stack__item--active {
  visibility: visible;
  pointer-events: auto;
  z-index: 1;
}

.slide-item {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  min-width: 0;
  min-height: 0;
  background-color: inherit;
}

/* Fill slide / grid cells: override intrinsic aspect-ratio from Sanity so object-fit can cover the cell */
.slide-item :deep(img.slide-img) {
  display: block;
  width: 100% !important;
  height: 100% !important;
  min-width: 0;
  min-height: 0;
  object-fit: cover !important;
  aspect-ratio: unset !important;
}

.one-image {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  justify-content: stretch;
  align-content: stretch;
}

/* Single image, inset: square = 60% of shortest screen edge, image contained */
.one-image.one-image--inset {
  place-items: center;

  :deep(img.slide-img) {
    width: min(80vw, 80svh) !important;
    height: min(80vw, 80svh) !important;
    max-width: min(80vw, 80svh);
    max-height: min(80vw, 80svh);
    object-fit: contain !important;
    aspect-ratio: 1 / 1;
    @include tablet-up {
      width: min(60vw, 60svh) !important;
      height: min(60vw, 60svh) !important;
      max-width: min(60vw, 60svh);
      max-height: min(60vw, 60svh);
    }
  }
}

.two-images {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-rows: minmax(0, 1fr);

  /* Portrait (narrower than square): stack vertically */
  @media (aspect-ratio < 1) {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: repeat(2, minmax(0, 1fr));
  }
}

.four-images {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-rows: repeat(2, minmax(0, 1fr));
}

.nine-images {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-template-rows: repeat(3, minmax(0, 1fr));
}

.home-slide-meta {
  position: fixed;
  right: calc(0.5 * var(--lh-rem));
  bottom: calc(0.275 * var(--lh-rem));
  // bottom: 0.5rem;
  z-index: 20;
  margin: 0;
  padding: 0;
  text-align: right;
  line-height: var(--line-height);
  font: inherit;
  letter-spacing: inherit;
  pointer-events: none;
}

.home-slide-meta__line {
  display: block;
}

.home:not(.home--ui-black) .home-slide-meta {
  color: #fff;
}

.home.home--ui-black .home-slide-meta {
  color: #000;
}
</style>
