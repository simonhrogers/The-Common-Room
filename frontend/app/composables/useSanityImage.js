import { ref, computed, onMounted } from 'vue'
import imageUrlBuilder from '@sanity/image-url'

const srcsetPresets = {
  fullWidth:    [400, 560, 720, 880, 1040, 1280, 1520, 1760, 2080, 2400, 2720, 3000],
  halfWidth:    [320, 420, 520, 640, 760, 880, 1040, 1200, 1440, 1760, 2080, 2400],
  quarterWidth: [240, 320, 400, 480, 560, 640, 760, 880, 1040, 1200, 1400, 1600],
  eigthWidth:   [120, 160, 220, 280, 340, 420, 520, 640, 760, 880, 1000],
}

export function useSanityImage(props) {
  const builder = imageUrlBuilder(useSanity().config)

  const imgEl = ref(null)
  const isLoaded = ref(false)
  const shouldFade = ref(false)

  const markLoaded = () => { isLoaded.value = true }

  onMounted(() => {
    const el = imgEl.value
    if (!el) return
    if (el.complete && el.naturalWidth > 0) {
      isLoaded.value = true
      shouldFade.value = false
    } else {
      shouldFade.value = true
    }
  })

  const resolvedAspectRatio = computed(() => {
    const ar = props.aspectRatio ?? props.image?.aspectRatio
    if (!ar || typeof ar !== 'number') return undefined
    return String(ar)
  })

  const objectFit = computed(() => (props.fit === 'contain' ? 'contain' : 'cover'))

  const imageSourceForBuilder = computed(() => {
    const img = props.image
    if (!img || typeof img !== 'object') return img
    const assetRef = img.asset?._ref || img.asset?._id
    if (assetRef) return img
    if (typeof img.id === 'string' && img.id) return img.id
    return img
  })

  const srcset = computed(() => {
    const widths = srcsetPresets[props.srcsetPreset] ?? srcsetPresets.fullWidth
    const src = imageSourceForBuilder.value
    return widths.map(i => {
      if (props.aspectRatio) {
        return `${builder
          .image(src)
          .ignoreImageParams()
          .width(i)
          .height(Math.floor(i / props.aspectRatio))}&q=80&auto=format&fit=crop&crop=entropy ${i}w`
      }
      return `${builder.image(src).ignoreImageParams().width(i)}&q=80&auto=format ${i}w`
    }).join(', ')
  })

  const placeholderSrc = computed(() =>
    builder.image(imageSourceForBuilder.value).ignoreImageParams().width(12).blur(20)
  )

  const objectPosition = computed(() =>
    props.image?.hotspot
      ? `${props.image.hotspot.x * 100}% ${props.image.hotspot.y * 100}%`
      : '50% 50%'
  )

  return {
    imgEl,
    isLoaded,
    shouldFade,
    markLoaded,
    resolvedAspectRatio,
    objectFit,
    objectPosition,
    srcset,
    placeholderSrc,
  }
}

export default useSanityImage