<template>
  <a
    v-if="resolvedHref"
    :href="resolvedHref"
    target="_blank"
    rel="noopener noreferrer"
    class="external-link"
  >
    <slot />
  </a>
  <span v-else class="external-link">
    <slot />
  </span>
</template>

<script setup>
const props = defineProps({
  /**
   * Portable Text marks (SanityContent/@portabletext) typically pass the annotation
   * as `value` (e.g. { href: "https://..." }).
   */
  value: {
    type: Object,
    required: false,
    default: undefined,
  },
  /** Back-compat if something passes a direct href prop. */
  href: {
    type: String,
    required: false,
    default: '',
  },
})

const resolvedHref = computed(() => {
  const direct = String(props.href || '').trim()
  if (direct) return direct
  const fromValue = String(props.value?.href || '').trim()
  return fromValue || ''
})

</script>

<style lang="scss" scoped>

.external-link {
  // @include underline;
  &:hover {
    text-decoration: none;
    opacity: 0.5;
  }
}

</style>