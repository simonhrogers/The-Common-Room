<template>
  <header class="header">
    <div class="header-inner">
      <NuxtLink to="/" class="logo">
        The Common Room <br>
        <div class="korean">더 커먼룸</div>
        
      </NuxtLink>
      <nav class="links">
        <NuxtLink to="/info" class="link">
          Info
        </NuxtLink>
      </nav>

    </div>
  </header>
</template>

<script setup>
</script>

<style scoped lang="scss">
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  padding: calc(0.5 * var(--lh-rem)) calc(0.5 * var(--lh-rem));
  padding-top: calc(0.5 * var(--lh-rem));
  pointer-events: none;
}

.header-inner {
  pointer-events: auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.5rem;
}

.logo {
  text-decoration: none;
  color: inherit;
}

.links {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: auto;
  justify-content: flex-start;
}

.link {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.link.router-link-exact-active {
  @include underline;
}

.link:hover {
  // text-decoration: underline;
  @include underline;
}
</style>
