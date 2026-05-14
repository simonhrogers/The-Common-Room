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
}
</style>
