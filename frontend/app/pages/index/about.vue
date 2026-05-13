<template>
  <div class="about-overlay">
    <div class="about-center">
      <main class="about-scroll">
        <section
          v-if="data"
          class="information-grid-container"
        >
          <div class="information-grid">
            <div class="big-info-column">
              <div class="information-text">
                <SharedPortableText
                  v-if="data.information && data.information.length > 0"
                  :value="data.information"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>

    <div class="contact">
      <div
        v-if="data?.address"
        class="address-text"
      >
        <p>{{ data.address }}</p>
      </div>
      <div class="email-text">
        <p>
          <a :href="`mailto:${data?.contact}`">
            {{ data?.contact }}
          </a>
        </p>
      </div>
    </div>

    <LanguageSwitcher />
  </div>
</template>

<script setup>
const { locale } = useI18n()
const sanity = useSanity()

const { data } = await useAsyncData(
  () => `about-${locale.value}`,
  async () => {
    return await sanity.fetch(
      groq`*[_type == "about" && language == $language][0]{ information, contact, address }`,
      { language: locale.value }
    )
  }
)

useHead({
  title: 'About',
})
</script>

<style lang="scss" scoped>
.about-overlay {
  position: fixed;
  inset: 0;
  z-index: 15; /* under header (20), above slideshow */
  background: rgba(0, 0, 0, 1);
  // color: black;
  backdrop-filter: blur(0em);
  overflow: hidden;
  display: flex;
  align-items: center;
}

.about-center {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: calc(2 * var(--lh-rem) + 1rem) calc(1 * var(--lh-rem));
  padding-bottom: calc(4 * var(--lh-rem));
  box-sizing: border-box;
}

.about-scroll {
  width: 100%;
  max-height: 100%;
  overflow: auto;
  box-sizing: border-box;

  -ms-overflow-style: none;
  scrollbar-width: none;
}

.about-scroll::-webkit-scrollbar {
  display: none;
}

.information-text {
  max-width: 26em;
  margin: auto;
  @include tablet-up {
    font-size: 1.5rem;
  }
  @include laptop-up {
    font-size: 2rem;
  }
}

.contact {
  position: fixed;
  left: calc(1 * var(--lh-rem));
  right: calc(1 * var(--lh-em));
  bottom: calc(1 * var(--lh-rem));
  display: flex;
  flex-direction: column;
  gap: calc(0.5 * var(--lh-em));
  text-wrap: balance;
  @include tablet-up {
    flex-direction: row-reverse;
    justify-content: flex-end;
    gap: 1rem;
  }
}

.email-text a {
  color: inherit;
}

.email-text a:hover {
  // text-decoration: underline;
  @include underline;
}
</style>
