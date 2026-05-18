<template>
  <button
    type="button"
    class="app-stamp"
    :class="{ 'app-stamp--demon': mainStore.demonMode }"
    aria-label="Toggle demon mode"
    @click="mainStore.toggleDemonMode()"
  >
    <StampIcon
      class="app-stamp__icon"
      aria-hidden="true"
    />
  </button>
</template>

<script setup>
import StampIcon from '@/assets/svg/stamp.svg?component'
import { useMainStore } from '@/stores/main'

const mainStore = useMainStore()
</script>

<style scoped lang="scss">
.app-stamp {
  width: calc(2 * var(--lh-em));
  height: calc(2 * var(--lh-em));
  padding: 0;
  margin: 0;
  border: none;
  background: none;
  display: inline-block;
  vertical-align: bottom;
  cursor: pointer;
  color: #ff0000;
  animation: slow-spin 30s linear infinite;
}

/* Demon: white on dark surface, black on KO/light (`white-background` on html). */
.app-stamp--demon {
  color: #fff;
}

html.white-background .app-stamp--demon,
html.info-surface--ko .app-stamp--demon {
  color: #000;
}

.app-stamp__icon {
  display: block;
  width: 100%;
  height: 100%;
}

.app-stamp__icon :deep(path) {
  fill: currentColor;
}

@keyframes slow-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
