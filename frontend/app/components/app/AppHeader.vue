<template>
  <header
    class="header"
    :class="{
      'header--info': isInfoPage,
      'header--info-ko': isInfoPage && localeIsKo,
    }"
  >
    <!-- Info: locale stays fixed; home keeps single fixed bar -->
    <div
      v-if="isInfoPage"
      class="header-locale-fixed"
      aria-label="Language"
    >
      <nav class="links">
        <NuxtLink
          v-for="l in locales"
          :key="l.code"
          :to="switchLocalePath(l.code)"
          class="link"
          :class="{ 'link--locale-active': l.code === locale }"
        >
          {{ l.code === 'en' ? 'En' : 'Ko' }}
        </NuxtLink>
      </nav>
    </div>

    <div class="header-inner">
      <NuxtLink
        :to="localePath('/')"
        class="logo"
      >
        The Common Room <br>
        <div class="korean">
          더 커먼룸
        </div>
      </NuxtLink>
      <nav
        v-if="!isInfoPage"
        class="links"
      >
        <NuxtLink
          :to="localePath('/info')"
          class="link"
        >
          Info
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup>
const route = useRoute()
const { locales, defaultLocale, locale } = useI18n()
const localeIsKo = computed(() => locale.value === 'ko')
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()

/**
 * Path-based so it stays true during i18n locale navigations.
 * `route.path === localePath('/info')` can briefly be false while locale updates, which flashes "Info".
 */
function pathIsInfo(path, defaultLocale, localeCodes) {
  const p = path.replace(/\/+$/, '') || '/'
  if (p === '/info') return true
  for (const l of localeCodes) {
    const code = l.code
    if (!code || code === defaultLocale) continue
    if (p === `/${code}/info`) return true
  }
  return false
}

const isInfoPage = computed(() =>
  pathIsInfo(route.path, defaultLocale.value, locales.value),
)
</script>

<style scoped lang="scss">
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  pointer-events: none;
}

.header--info {
  position: static;
  padding: 0;
  pointer-events: none;
}

.header-inner {
  pointer-events: auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.5rem;
  padding: calc(0.5 * var(--lh-rem)) calc(0.5 * var(--lh-rem));
  padding-bottom: 0;
}

.header--info .header-inner {
  justify-content: flex-start;
}

.header-locale-fixed {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 21;
  padding: calc(0.5 * var(--lh-rem)) calc(0.5 * var(--lh-rem));
  padding-top: calc(0.5 * var(--lh-rem));
  pointer-events: auto;
}

.logo {
  text-decoration: none;
  color: inherit;
}

.links {
  display: flex;
  align-items: center;
  gap: calc(0.5 * var(--lh-rem));
  width: auto;
  justify-content: flex-start;
}

.link {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

/* Locale (En / Ko): active full strength; inactive 50%; inactive → full on hover */
.header-locale-fixed .link {
  opacity: 0.5;

  &.link--locale-active,
  &:hover {
    opacity: 1;
  }
}

/* Logo + Info: dim on hover unless that link is the current page */
.header-inner > .logo:hover {
  opacity: 0.5;
}

.header-inner > .logo.router-link-exact-active:hover {
  opacity: 1;
}

.header-inner .links .link:hover {
  opacity: 0.5;
}

.header-inner .links .link.router-link-exact-active:hover {
  opacity: 1;
}

/* Korean info: match white surface + black type (header sits outside NuxtLayout) */
// .header--info-ko {
//   background-color: #fff;
//   color: #000;
// }

// .header--info-ko *::selection {
//   background: red;
//   color: black;
// }
</style>
