<template>
  <header
    class="header"
    :class="{
      'header--home': isHomePage,
      'header--home-ui-black': isHomePage && homeUiTextColor === 'black',
      'header--info': isInfoPage,
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
        더 커먼룸
      </NuxtLink>
      <NuxtLink
        v-if="isHomePage"
        :to="localePath('/info')"
        class="home-header-info"
      >
        Info
      </NuxtLink>
    </div>
  </header>
</template>

<script setup>
const mainStore = useMainStore()
const { locale, locales, defaultLocale } = useI18n()
const homeUiTextColor = computed(() => mainStore.homeUiTextColor)
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()

const props = defineProps({
  isInfoPage: {
    type: Boolean,
    default: false,
  },
  isHomePage: {
    type: Boolean,
    default: false,
  },
})

</script>

<style scoped lang="scss">
.header {
  position: relative;
  z-index: 20;
  pointer-events: none;
}

/* Homepage only: overlay slideshow */
.header--home {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
}

/* Homepage white UI (default): faint dark halos over bright image areas */
.header--home:not(.header--home-ui-black) .logo,
.header--home:not(.header--home-ui-black) .home-header-info {
  color: #fff;
  // text-shadow:
  //   0 0.5px 0 rgba(0, 0, 0, 0.03),
  //   0 1px 2px rgba(0, 0, 0, 0.02),
  //   0 0 14px rgba(0, 0, 0, 0.01);
}

/* Homepage black UI: type + light halos over dark image areas */
.header--home.header--home-ui-black .logo,
.header--home.header--home-ui-black .home-header-info {
  color: #000;
  // text-shadow:
  //   0 0.5px 0 rgba(255, 255, 255, 0.03),
  //   0 1px 2px rgba(255, 255, 255, 0.02),
  //   0 0 14px rgba(255, 255, 255, 0.01);
}

/* Homepage: ultra-soft vignette wash behind the title row (diffuse, barely there) */
.header--home .header-inner {
  position: relative;
  isolation: isolate;

  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    pointer-events: none;
    /* Oversized box so blurred edges never clip */
    top: -60%;
    left: -25%;
    right: -25%;
    bottom: -140%;
    transform: translateZ(0);
    background: radial-gradient(
      ellipse 130% 85% at 50% 0%,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0) 38%,
      rgba(0, 0, 0, 0.012) 62%,
      rgba(0, 0, 0, 0.022) 82%,
      rgba(0, 0, 0, 0.03) 100%
    );
    filter: blur(32px);
    opacity: 0.9;
  }
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
  line-height: var(--line-height);

  .korean {
    line-height: var(--line-height);
  }
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
  opacity: var(--link-opacity);

  &.link--locale-active,
  &:hover {
    opacity: 1;
  }
}

/* Logo + Info: dim on hover unless that link is the current page */
.header-inner > .logo:hover {
  opacity: var(--link-opacity);
}

.header-inner > .logo.router-link-exact-active:hover {
  opacity: 1;
}

.header-inner > .home-header-info:hover {
  opacity: var(--link-opacity);
}

.home-header-info {
  text-decoration: none;
  color: inherit;
  font: inherit;
  line-height: var(--line-height);
  letter-spacing: inherit;
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
