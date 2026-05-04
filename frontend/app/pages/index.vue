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
            :class="{ 
              'one-image': slide.images?.length === 1,
              'two-images': slide.images?.length > 1 && slide.images?.length < 4,
              'four-images': slide.images?.length > 3 && slide.images?.length < 9,
              'nine-images': slide.images?.length === 9,
            }"
          >
            <SharedSanityImage
              v-for="image in slide.images"
              :key="image.id"
              :image="image"
              :alt="image.alt || ''"
              imageWrapperClasses="cover"
              class="slide-img"
              :lazy-preload="i === 0"
            />
          </div>
        </div>
      </div>
    </section>

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

const slides = computed(() => data.value?.slideshow || [])
const currentSlideIndex = ref(0)

watchEffect(() => {
  if (slides.value.length === 0) currentSlideIndex.value = 0
  if (currentSlideIndex.value >= slides.value.length) currentSlideIndex.value = 0
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
  // transition: transform 0.35s ease;
  will-change: transform;
}

.slide-item {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.one-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.two-images {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.four-images {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
}

.nine-images {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
}
</style>
