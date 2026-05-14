<template>
  <main class="home">
    <section
      v-if="slides.length > 0 && currentSlide"
      class="slideshow"
      tabindex="0"
      role="region"
      aria-label="Homepage slideshow test (translateX)"
      @click="handleSlideClick"
      @keydown="handleKeydown"
      @touchstart.passive="onTouchStart"
      @touchend="onTouchEnd"
      @touchcancel="onTouchEnd"
    >
      <div class="slide-viewport">
        <div
          class="slide-track"
          :style="trackStyle"
        >
          <div
            v-for="(slide, i) in slides"
            :key="slide.id || i"
            class="slide-item"
            :class="slideLayoutClass(slide)"
          >
            <SharedSanityImage
              v-for="(image, ii) in slide.images"
              :key="image.id"
              :image="image"
              :alt="image.alt || ''"
              class="slide-img"
              :sizes="slideImageSizes(slide.images?.length ?? 0)"
              :loading="i === 0 ? 'eager' : 'lazy'"
              :fetch-priority="i === 0 && ii === 0 ? 'high' : 'low'"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Off-viewport clones so lazy-loaded srcsets start fetching for other slides -->
    <div
      class="slide-preloads"
      aria-hidden="true"
    >
      <div
        v-for="(slide, si) in slides"
        :key="'preload-' + (slide.id ?? si)"
        class="slide-item slide-preloads__item"
        :class="slideLayoutClass(slide)"
      >
        <SharedSanityImage
          v-for="image in slide.images"
          :key="'preload-' + (slide.id ?? si) + '-' + image.id"
          :image="image"
          alt=""
          class="slide-img"
          :sizes="slideImageSizes(slide.images?.length ?? 0)"
          loading="lazy"
          fetch-priority="low"
        />
      </div>
    </div>

    <!-- Child page overlay (e.g. /about) -->
    <NuxtPage />
  </main>
</template>

<script setup>
useHead({
  bodyAttrs: {
    class: 'overflow-hidden',
  },
})

const homeQuery = groq`*[_id == "home"][0]{
  slideshow[]{
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

const HOME_SLIDE_INDEX_KEY = 'tcr:homeSlideIndex'

const slides = computed(() => data.value?.slideshow || [])

/** `sizes` for srcset — matches slide grid CSS (incl. portrait stack for 2–3 images). */
function slideImageSizes(imageCount) {
  const n = Number(imageCount) || 0
  if (n <= 0) return '100vw'
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
    'two-images': n > 1 && n < 4,
    'four-images': n > 3 && n < 9,
    'nine-images': n === 9,
  }
}

function readStoredSlideIndex(length) {
  if (!import.meta.client || length <= 0) return 0
  const raw = sessionStorage.getItem(HOME_SLIDE_INDEX_KEY)
  if (raw == null) return 0
  const parsed = Number.parseInt(raw, 10)
  if (!Number.isFinite(parsed)) return 0
  return Math.max(0, Math.min(parsed, length - 1))
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

onMounted(() => {
  const n = slides.value.length
  if (!n) return
  currentSlideIndex.value = readStoredSlideIndex(n)
})

watch(currentSlideIndex, (i) => {
  if (!import.meta.client) return
  if (!slides.value.length) return
  sessionStorage.setItem(HOME_SLIDE_INDEX_KEY, String(i))
})

const currentSlide = computed(() => slides.value[currentSlideIndex.value] || null)

const len = computed(() => slides.value.length)

/** Track is n × viewport wide; translateX % is relative to track, so −(index/n)×100% = one slide width per step. */
const trackTransform = computed(() => {
  const n = len.value
  if (!n) return 'translateX(0)'
  const pct = -(currentSlideIndex.value / n) * 100
  return `translateX(${pct}%)`
})

const slideBasisPercent = computed(() => {
  const n = len.value
  if (!n) return 100
  return 100 / n
})

const trackStyle = computed(() => ({
  width: `${len.value * 100}%`,
  transform: trackTransform.value,
}))

const nextSlide = () => {
  if (!slides.value.length) return
  currentSlideIndex.value = (currentSlideIndex.value + 1) % slides.value.length
}

const previousSlide = () => {
  if (!slides.value.length) return
  currentSlideIndex.value = (currentSlideIndex.value - 1 + slides.value.length) % slides.value.length
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
}

.slide-viewport {
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

.slide-track {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  height: 100%;
}

.slide-item {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  min-width: 0;
  min-height: 0;
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

/* Hidden duplicate slides: sit just below the viewport so lazy images still enter range */
.slide-preloads {
  position: fixed;
  left: 0;
  top: 100vh;
  display: flex;
  flex-direction: column;
  width: 100vw;
  opacity: 0;
  pointer-events: none;
  z-index: -1;
}

.slide-preloads__item {
  flex: 0 0 100vh;
  width: 100vw;
  min-height: 0;
  box-sizing: border-box;
}
</style>
