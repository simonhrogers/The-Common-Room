<template>
  <img
    class="app-stamp"
    src="/stamp.svg"
    alt=""
    role="presentation"
    decoding="async"
  />
</template>

<style scoped lang="scss">
.app-stamp {
  width: calc(2 * var(--lh-em));
  height: calc(2 * var(--lh-em));
  display: inline-block;
  vertical-align: bottom;
  object-fit: contain;
  animation: slow-spin 30s linear infinite;
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
