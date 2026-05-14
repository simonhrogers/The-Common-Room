<template>
  <div
    class="layout-info"
    :class="{ 'layout-info--ko': locale === 'ko' }"
  >
    <slot />
  </div>
</template>

<script setup>
const { locale } = useI18n()

/** Light document surface for Korean info (overscroll / margins); pairs with .layout-info--ko */
useHead(() => ({
  htmlAttrs: {
    class: { 'info-surface--ko': locale.value === 'ko' },
  },
  bodyAttrs: {
    class: { 'info-surface--ko': locale.value === 'ko' },
  },
}))
</script>

<style scoped>
/* Header is in-flow on info; only a small top pad so content clears the logo row */
.layout-info {
  display: flex;
  flex-direction: column;
}

.layout-info--ko {
  background-color: #fff;
  color: #000;
}
</style>

<style lang="scss">
/* Document + root: overrides global html { background: black } for Korean info */
html.info-surface--ko,
html.info-surface--ko body,
html.info-surface--ko #__nuxt,
html.info-surface--ko #app {
  background-color: #fff;
  color: #000;
}

/* Global ::selection on dark site; light surface for Korean info */
.layout-info--ko *::selection,
html.info-surface--ko ::selection {
  background: rgba(0, 0, 0, 0.88);
  color: #fff;
}
</style>
