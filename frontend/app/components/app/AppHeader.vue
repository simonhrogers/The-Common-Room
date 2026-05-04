<template>
  <header class="bbot-header">
    <div class="bbot-header-inner">
      <nav class="bbot-links">
        <NuxtLink to="/" class="bbot-link">
          Projects
        </NuxtLink>
        <NuxtLink to="/about" class="bbot-link">
          About
        </NuxtLink>
      </nav>
      <NuxtLink to="/" class="bbot-logo">
        Bella Bruton &amp; Ottilie Thompson Ltd.
      </NuxtLink>
    </div>
  </header>
</template>

<script setup>
</script>

<style scoped lang="scss">
.bbot-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  padding: calc(1 * var(--lh-rem)) calc(1 * var(--lh-rem));
  padding-top: 1rem;
  pointer-events: none;
}

.bbot-header-inner {
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: calc(0.5 * var(--lh-em));
  @include tablet-up {
    flex-direction: row;
    justify-content: space-between;
    align-items: baseline;
    gap: 1rem;
  }
}

.bbot-logo {
  text-decoration: none;
  color: inherit;
  text-align: center;
  @include tablet-up {
    text-align: left;
  }
}

.bbot-links {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
  width: 100%;
  @include tablet-up {
    width: auto;
    justify-content: flex-start;
  }
}

.bbot-link {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.bbot-link.router-link-exact-active {
  @include underline;
}

.bbot-link:hover {
  // text-decoration: underline;
  @include underline;
}
</style>
