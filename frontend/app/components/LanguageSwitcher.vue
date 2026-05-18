<script setup>
const { locale, locales, t } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const availableLocales = computed(() =>
  locales.value.filter(l => l.code !== locale.value)
)
</script>

<template>
  <nav :aria-label="t('languageSwitcher.label')" class="language-switcher">
    <NuxtLink
      v-for="l in availableLocales"
      :key="l.code"
      :to="switchLocalePath(l.code)"
      :hreflang="l.code"
    >
      {{ t(`languageSwitcher.${l.code}`) }}
    </NuxtLink>
  </nav>
</template>

<style lang="scss" scoped>
.language-switcher {
  position: fixed;
  top: calc(1 * var(--lh-rem));
  right: calc(1 * var(--lh-rem));
  z-index: 25;
  display: flex;
  gap: 0.5rem;
}

.language-switcher a {
  color: inherit;
  text-decoration: none;

  @include hover {
    text-decoration: underline;
  }
}
</style>
