<template>
  <NuxtLink
    to="/"
    class="app-logo"
  >
    <img
      src="/logo.svg"
      alt="Home"
      class="app-logo-img"
    >
  </NuxtLink>
</template>

<style scoped>
.app-logo {
  position: fixed;
  left: calc(2 * var(--lh-rem));
  top: 50%;
  transform: translateY(-50%);
  display: block;
  line-height: 0;
  z-index: 2;
}

.app-logo-img {
  display: block;
  /* height: calc(3 * var(--lh-rem)); */
  height: auto;
  width: calc(25vw - 4 * var(--lh-rem));
  object-fit: contain;
}
</style>
