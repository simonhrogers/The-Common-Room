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
    >
      <div class="bbot-slide-viewport">
        <div
          class="bbot-slide-track"
          :style="trackStyle"
        >
          <div
            v-for="item in renderedSlides"
            :key="item.position"
            class="bbot-slide-item"
          >
            <SharedSanityImage
              :image="item.slide"
              :alt="item.slide.alt || ''"
              imageWrapperClasses="contain"
              class="bbot-slide-img"
              :lazy-preload="item.position === 0"
            />
          </div>
        </div>
      </div>

      <div class="bbot-caption">
        <div class="bbot-counter" aria-hidden="true">
          {{ currentRealIndex + 1 }} / {{ slides.length }}
        </div>
        <div
          v-if="currentSlide.caption"
          class="bbot-caption-text"
        >
          {{ currentSlide.caption }}
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
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
const len = computed(() => slides.value.length)

const mod = (n, m) => ((n % m) + m) % m

// virtual position in an infinite sequence
const currentPosition = ref(0)

// start with 5 rendered positions: -2, -1, 0, 1, 2
const renderedStart = ref(-2)
const renderedEnd = ref(2)

// keep a small buffer beyond current position so we append/prepend
// before the user "hits the edge"
const BUFFER = 2

watchEffect(() => {
  if (!len.value) {
    currentPosition.value = 0
    renderedStart.value = -2
    renderedEnd.value = 2
    return
  }

  // ensure current position always sits inside rendered range
  if (currentPosition.value - BUFFER < renderedStart.value) {
    renderedStart.value = currentPosition.value - BUFFER
  }

  if (currentPosition.value + BUFFER > renderedEnd.value) {
    renderedEnd.value = currentPosition.value + BUFFER
  }
})

const renderedSlides = computed(() => {
  if (!len.value) return []

  const items = []
  for (let position = renderedStart.value; position <= renderedEnd.value; position++) {
    items.push({
      position,
      realIndex: mod(position, len.value),
      slide: slides.value[mod(position, len.value)],
    })
  }
  return items
})

const currentRealIndex = computed(() => {
  if (!len.value) return 0
  return mod(currentPosition.value, len.value)
})

const currentSlide = computed(() => {
  if (!len.value) return null
  return slides.value[currentRealIndex.value] || null
})

// translate relative to rendered track, not the full slide list
const trackTransform = computed(() => {
  const offsetWithinRendered = currentPosition.value - renderedStart.value
  return `translateX(-${offsetWithinRendered * 100}%)`
})

const trackStyle = computed(() => ({
  width: `${renderedSlides.value.length * 100}%`,
  transform: trackTransform.value,
}))

const nextSlide = () => {
  if (!len.value) return
  currentPosition.value += 1
}

const previousSlide = () => {
  if (!len.value) return
  currentPosition.value -= 1
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
  padding: calc(2 * var(--lh-rem) + 1rem);
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
}

.bbot-caption {
  position: absolute;
  left: calc(1 * var(--lh-rem));
  bottom: calc(1 * var(--lh-rem));
  z-index: 2;
  pointer-events: none;
  display: flex;
  gap: 1rem;
  align-items: flex-end;
}

.bbot-caption-text {
  text-align: right;
}

.bbot-counter {
  font-variant-numeric: tabular-nums;
}
</style>
