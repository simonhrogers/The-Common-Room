<template>
  <div class="layout-info">
    <slot />
  </div>
</template>

<style scoped>
.layout-info {
  display: flex;
  flex-direction: column;
  min-height: 100svh;
}
</style>
