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
</script>

<style scoped>
.layout-info {
  display: flex;
  flex-direction: column;
  min-height: 100svh;
}
</style>
