<template>
  <div
    v-if="visible"
    class="gif-sprinkles"
    aria-hidden="true"
  >
    <SharedSanityImage
      v-for="g in spawns"
      :key="g.id"
      :image="g.src"
      :alt="''"
      class="gif-sprinkles__gif"
      imageWrapperClasses=""
      :style="{
        left: `${g.x * 100}%`,
        top: `${g.y * 100}%`,
      }"
    />
  </div>
</template>

<script setup lang="ts">
const gifsStore = useGifsStore()

const spawns = computed(() => gifsStore.spawns)
const visible = computed(() => gifsStore.enabled || gifsStore.clearing || spawns.value.length > 0)
</script>

<style scoped>
.gif-sprinkles {
  position: fixed;
  inset: 0;
  z-index: 5;
  pointer-events: none;
}

.gif-sprinkles__gif {
  position: absolute;
  width: 2em;
  height: 2em;
  transform: translate(-50%, -50%);
}

.gif-sprinkles__gif :deep(.image-wrapper) {
  width: 100%;
  height: 100%;
  padding-top: 0 !important;
}

.gif-sprinkles__gif :deep(img.image) {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
