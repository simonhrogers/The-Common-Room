<template>
  <footer class="app-footer">
    <button
      type="button"
      class="app-footer-subscribe"
      @click="openSubscribe"
    >
      Subscribe
    </button>

    <nav class="app-footer-nav">
      <NuxtLink
        v-for="link in footerLinks"
        :key="link.label"
        :to="link.path"
        class="app-footer-link"
      >
        {{ link.label }}
      </NuxtLink>
      <span class="app-footer-copy">
        © 2026 Bella Bruton & Ottilie Thompson Ltd.
      </span>
    </nav>
  </footer>
</template>

<script setup>
const footerLinks = [
  // { label: 'Shipping', path: '/shipping' },
  // { label: 'Terms and Conditions', path: '/terms-and-conditions' },
  // { label: 'Privacy Policy', path: '/privacy-policy' },
]

const openSubscribe = () => {
  // Delegate to existing Klaviyo modal if present
  const event = new CustomEvent('open-klaviyo-modal')
  window.dispatchEvent(event)
}
</script>

<style scoped>
.app-footer {
  margin: var(--lh-rem);
  margin-top: calc(4 * var(--lh-rem));
  /* border-top: 1px solid #d4d4d8; */
  /* padding: calc(4 * var(--lh-rem)) calc(1.5 * var(--lh-rem)) calc(1.5 * var(--lh-rem)); */
}

.app-footer-subscribe {
  margin-bottom: calc(4 * var(--lh-rem));
  /* padding: 0.25rem 0.75rem; */
  cursor: pointer;
}

.app-footer-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.app-footer-link {
  text-decoration: none;
  color: inherit;
}

.app-footer-link:hover {
  text-decoration: underline;
}

.app-footer-copy {
  white-space: nowrap;
}
</style>
