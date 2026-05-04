<template>
  <main class="bbot-home">
    <section
      v-if="slides.length > 0 && currentSlide"
      class="bbot-slideshow"
      tabindex="0"
      role="region"
      aria-label="Homepage slideshow test (translateX)"
      @click="handleSlideClick"
      @keydown="handleKeydown"
      @touchstart.passive="onTouchStart"
      @touchend="onTouchEnd"
      @touchcancel="onTouchEnd"
    >
      <div class="bbot-slide-viewport">
        <div
          class="bbot-slide-track"
          :style="trackStyle"
        >
          <div
            v-for="(slide, i) in slides"
            :key="slide.id || i"
            class="bbot-slide-item"
            :style="{ flex: `0 0 ${slideBasisPercent}%` }"
          >
            <SharedSanityImage
              :image="slide"
              :alt="slide.alt || ''"
              imageWrapperClasses="contain"
              class="bbot-slide-img"
              :lazy-preload="i === 0"
            />
          </div>
        </div>
      </div>

      <div class="bbot-caption">
        <div class="bbot-counter" aria-hidden="true">
          {{ currentSlideIndex + 1 }} / {{ slides.length }}
        </div>
        <div
          v-if="currentSlide.caption"
          class="bbot-caption-text"
        >
          {{ currentSlide.caption }}
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
    alt,
    caption,
    asset,
    "id": asset._ref,
    "aspectRatio": asset->metadata.dimensions.aspectRatio,
    hotspot { x, y }
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
.bbot-home {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}

.bbot-slideshow {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bbot-slide-viewport {
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

.bbot-slide-track {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  height: 100%;
  // transition: transform 0.35s ease;
  will-change: transform;
}

.bbot-slide-item {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: calc(2 * var(--lh-rem) + 1rem) var(--lh-rem);
  @include tablet-up {
    padding: calc(2 * var(--lh-rem) + 1rem);
  }
}

.bbot-caption {
  position: absolute;
  left: calc(1 * var(--lh-rem));
  right: calc(1 * var(--lh-rem));
  bottom: calc(1 * var(--lh-rem));
  z-index: 2;
  pointer-events: none;
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  flex-wrap: nowrap;
}

.bbot-caption-text {
  min-width: 0;
  flex: 1 1 auto;
  max-width: 100%;
  text-align: left;
  overflow-wrap: anywhere;
}

.bbot-counter {
  font-variant-numeric: tabular-nums;
  flex: 0 0 auto;
  white-space: nowrap;
  align-self: flex-end;
}
</style>
