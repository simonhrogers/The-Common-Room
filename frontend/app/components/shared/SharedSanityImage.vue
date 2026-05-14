<template>
  <img
    ref="imgEl"
    :src="placeholderSrc"
    :srcset="srcset"
    :sizes="sizes"
    :loading="loading"
    :decoding="decoding"
    :fetchpriority="fetchPriority"
    :class="[
      'image',
      shouldFade ? 'should-fade' : null,
      isLoaded ? 'is-loaded' : 'is-loading',
      attrs.class,
    ]"
    :style="[
      {
        aspectRatio: resolvedAspectRatio,
        objectPosition,
        objectFit,
      },
      styleObject,
      attrs.style,
    ]"
    :alt="alt || image?.alt || ''"
    @load="markLoaded"
    @error="markLoaded"
    v-bind="restAttrs"
  />
</template>

<script setup>
import { useSanityImage } from '@/composables/useSanityImage'

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()
const { class: _class, style: _style, ...restAttrs } = attrs

const props = defineProps({
  image: Object,
  aspectRatio: Number,
  styleObject: Object,
  alt: String,
  fit: {
    type: String,
    default: 'cover',
    validator: (v) => ['cover', 'contain'].includes(v),
  },
  sizes: { type: String, default: '100vw' },
  loading: { type: String, default: 'lazy' },
  decoding: { type: String, default: 'async' },
  srcsetPreset: { type: String, default: 'fullWidth' },
  fetchPriority: { type: String, default: undefined },
})

const {
  imgEl,
  isLoaded,
  shouldFade,
  markLoaded,
  resolvedAspectRatio,
  objectFit,
  objectPosition,
  srcset,
  placeholderSrc,
} = useSanityImage(props)
</script>