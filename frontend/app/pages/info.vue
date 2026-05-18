<template>
  <div class="info-page">
    <div
      v-if="data"
      class="info-body"
    >
      <section
        v-if="data.information?.length"
        class="info-block"
      >
        <SharedPortableText :value="data.information" />
      </section>
      <section
        v-if="data.contact?.length"
        class="info-block"
      >
        <SharedPortableText :value="data.contact" />
      </section>
      <p class="info-back-to-top">
        <button
          type="button"
          class="press-release-link"
          @click="scrollToTop"
        >
          {{ backToTopLabel }}
        </button>
      </p>
    </div>

    <p class="info-stamp-wrap">
      <AppStamp />
    </p>

    <footer class="info-footer">
      <p class="info-credits">
        Design:
        <a
          href="https://www.christopherlawson.ltd/"
          target="_blank"
          rel="noopener noreferrer"
        >Christopher Lawson Ltd</a>
      </p>
      <p class="info-credits">
        Development:
        <a
          href="https://www.simonrogers.info/"
          target="_blank"
          rel="noopener noreferrer"
        >Simon Rogers</a>
      </p>
      <p class="info-credits">
        Photography:
        <a
          href="https://hanna-moon.tumblr.com/"
          target="_blank"
          rel="noopener noreferrer"
        >Hanna Moon</a>
      </p>
    </footer>
  </div>
</template>

<script setup>
definePageMeta({
  pageTransition: pageTransition(),
  middleware: 'transition',
})

const { locale, defaultLocale, t } = useI18n()

const infoQuery = groq`*[_id == "information"][0]{
  "information": information[$locale],
  "contact": contact[$locale],
}`

/** Stable locale for GROQ; empty/undefined breaks information[$locale] and drops the whole query. */
const queryParams = reactive({
  locale: locale.value || defaultLocale.value || 'en',
})

watch(locale, () => {
  queryParams.locale = locale.value || defaultLocale.value || 'en'
})

const data = await useSanityData({ query: infoQuery, params: queryParams })
const sanityStore = useSanityStore()

const infoPageTitle = computed(() => {
  const _loc = locale.value
  return t('info.title')
})

usePageHead({
  title: infoPageTitle,
  seo: computed(() => sanityStore.settings?.seo),
})

function scrollToTop() {
  if (!import.meta.client) return
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const backToTopLabel = computed(() => {
  // Tie to locale so copy updates on client i18n switch without remounting the page.
  const _loc = locale.value
  return t('info.backToTop')
})

useHead({
  htmlAttrs: {
    class: computed(() => locale.value === 'ko' ? 'white-background' : ''),
  },
})

</script>

<style lang="scss" scoped>
.info-page {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100svh;
  margin: calc(0.5 * var(--lh-rem));
  margin-top: 0;
  box-sizing: border-box;
}

.info-body {
  flex: 1 1 auto;
  margin-top: calc(2 * var(--lh-em));
}

.info-block + .info-block {
  margin-top: calc(2 * var(--lh-em));
}

.info-back-to-top {
  margin-top: calc(2 * var(--lh-em));
  margin-bottom: 0;
}

.info-stamp-wrap {
  flex-shrink: 0;
  margin: 0;
  margin-top: calc(2 * var(--lh-em));
  text-align: left;

  @include tablet-up {
    position: absolute;
    // right: calc(0.5 * var(--lh-em));
    // bottom: calc(0.5 * var(--lh-em));
    right: 0;
    bottom: 0;
    margin-top: 0;
    text-align: right;
  }
}

.press-release-link {
  color: inherit;
  text-decoration: none;

  @include hover {
    opacity: var(--link-opacity);
  }
}

button.press-release-link {
  font: inherit;
  line-height: inherit;
  letter-spacing: inherit;
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  text-align: inherit;
  display: inline;
}

.info-footer {
  flex-shrink: 0;
  margin-top: calc(2 * var(--lh-rem));
  display: flex;
  flex-direction: column;
  font-size: 0.5rem;
  line-height: var(--line-height);
  @include tablet-up {
    flex-direction: row;
    gap: var(--lh-em);
    font-size: 0.333rem;
  }
}

.info-credits {
  margin: 0;
}

.info-footer a {
  color: inherit;
  text-decoration: none;

  @include hover {
    opacity: var(--link-opacity);
  }
}
</style>
