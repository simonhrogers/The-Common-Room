<template>
  <main
    role="main"
    class="layout-default"
  >
    <slot />
  </main>
</template>

<style scoped>
.layout-default {
  display: flex;
  flex-direction: column;
  min-height: 100svh;
  padding-top: calc(2 * var(--lh-rem) + 1rem);
}
</style>
