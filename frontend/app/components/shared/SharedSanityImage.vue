<template>
  <div 
    :class="`image-wrapper ${imageWrapperClasses}`"
    :style="{
      paddingTop: aspectRatio ? `${1 / aspectRatio * 100}%` : `${1 / image.aspectRatio * 100}%`
    }"
  >
    <img
      ref="imgRef"
      :src="loadingImageUrl"
      :data-srcset="srcset"
      :data-aspectratio="image.aspectRatio"
      data-sizes="auto"
      :class="['image', 'lazyload', 'lazyfade', { lazypreload: lazyPreload }]"
      :style="{
        objectPosition: image.hotspot ? `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%` : '50% 50%',
        ...styleObject
      }"
      :alt="alt || image?.alt || ''"
    />
  </div>
</template>

<script setup>
import imageUrlBuilder from "@sanity/image-url"
const builder = imageUrlBuilder(useSanity().config)

const props = defineProps({
  image: Object,
  aspectRatio: Number,
  styleObject: Object,
  imageWrapperClasses: String,
  alt: String,
  /** When true, adds lazysizes `lazypreload` so this image is requested immediately (e.g. first hero slide). */
  lazyPreload: {
    type: Boolean,
    default: false,
  },
})
const { image, aspectRatio, imageWrapperClasses } = toRefs(props)

// ---- lazysizes: delay init until after hydration ----
if (process.client) {
  window.lazySizesConfig = window.lazySizesConfig || {}
  window.lazySizesConfig.init = false
}

const imgRef = ref(null)

onMounted(async () => {
  // Import AFTER we’ve told it not to init
  await import('lazysizes')
  await import('lazysizes/plugins/parent-fit/ls.parent-fit')
  await nextTick()
  window.lazySizes.init()
})

/** When the Sanity image changes in place (e.g. slideshow slide), re-run lazysizes so we don’t flash a remount. */
const imageIdentity = computed(
  () => props.image?.asset?._ref ?? props.image?.id ?? ''
)

watch(
  imageIdentity,
  async (id, prevId) => {
    if (!import.meta.client || !id || id === prevId) return
    await nextTick()
    const el = imgRef.value
    if (!el || !window.lazySizes?.loader?.unveil) return
    el.classList.remove('lazyloaded', 'lazyloading')
    el.classList.add('lazyload')
    window.lazySizes.loader.unveil(el)
  },
  { flush: 'post' }
)
// -----------------------------------------------------

const srcset = computed(() => {
  let s = ''
  for (let i = 300; i <= 2400; i += 100) {
    if (aspectRatio && aspectRatio.value) {
      s += `${builder.image(props.image).ignoreImageParams().width(i).height(Math.floor(i / aspectRatio.value))}&q=80&auto=format&fit=crop&crop=entropy ${i}w, `
    } else {
      s += `${builder.image(props.image).ignoreImageParams().width(i)}&q=80&auto=format ${i}w, `
    }
  }
  return s.slice(0, -2)
})

const loadingImageUrl = computed(() =>
  builder.image(props.image).ignoreImageParams().width(6).blur(15)
)
</script>

<style lang="scss" scoped>
  .image-wrapper {
    width: 100%;
    height: 0;
    transform: translateZ(0);
    &.cover {
      height: 100%;
      padding-top: unset !important;
    }
    &.contain {
      height: 100%;
      padding-top: unset !important;
      .image {
        object-fit: contain;
      }
    }
    &.contain-slideshow {
      height: calc(100% - 2 * var(--lh-em) - 4 * var(--margin-em));
      padding-top: unset !important;
      .image {
        object-fit: contain;
      }
    }
    &.square-contain {
      padding-top: 100% !important;
      .image {
        object-fit: contain;
      }
    }
    &.containToAspectRatio {
      .image {
        object-fit: contain;
      }
    }
    &.border {
      background-color: var(--background-color);
      .image {
        padding: var(--border-width);
        filter: grayscale(1);
        mix-blend-mode: multiply;
      }
    }
    .image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
</style>