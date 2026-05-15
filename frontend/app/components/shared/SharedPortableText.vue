<template>
  <div 
    class="portable-text"
    :class="[wrapperClasses, { 'content-editable': contentEditable }]"
    :contentEditable="contentEditable"
    spellcheck="false"
  >
    <SanityContent 
      :value="value"
      :components="serializers"
    />
  </div>
</template>

<script setup>
import { resolveComponent } from 'vue'

const props = defineProps({
  value: {
    type: Array,
    required: true,
  },
  wrapperClasses: {
    type: String,
    default: '',
  },
  contentEditable: {
    type: Boolean,
    default: false,
  },
})

const serializers = {
  types: {
    // This is how to access a component registered by `@nuxt/components`
    // image: resolveComponent('SharedPortableTextSanityImageWrapper'),
  },
  marks: {
    // You can also just pass a string for a custom serializer if it's an HTML element
    link: resolveComponent('SharedPortableTextExternalLink'),
  }
}

const { value } = toRefs(props)

// console.log(value.value)

</script>

<style lang="scss">
.portable-text {
  width: fit-content;
  line-height: var(--line-height);
  white-space: pre-line;
  // @include text-width;
  &.stealth-links {
    a {
      color: inherit;
      text-decoration: none;
      &:hover {
        // @include underline;
      }
    }
  }
  &.content-editable {
    &:focus {
      outline: none;
    }
    p, ul, ol {
      & + p, & + ul, & + ol {
        margin-top: 0;
      }
    }
  }
  &.centered {
    margin-left: auto;
    margin-right: auto;
  }
  &.caption {
    font-size: 0.8em;
    margin: calc(0.5 * var(--lh-em)) var(--lh-em);
  }
  &.inline, &.full-width {
    h1, h2, h3, h4, h5, h6,
    p, ul, ol, blockquote, pre,
    figure, table, hr, .portable-text-sanity-image-wrapper {
      max-width: 100%;
    }
  }
  h1, h2, h3, h4, h5, h6,
  p, ul, ol, blockquote, pre,
  figure, table, hr, .portable-text-sanity-image-wrapper {
    // margin-left: auto;
    // margin-right: auto;
    @include text-width;
  }
  h4, h5, h6 {
    margin-top: calc(2 * var(--lh-em));
    margin-bottom: var(--lh-em);
    &:first-child {
      margin-top: 0;
    }
  }
  h4 {
    font-size: 1em;
    text-wrap: balance;
  }
  p,
  li {
    line-height: var(--line-height);
  }

  p, ul, ol {
    & + p, & + ul, & + ol {
      margin-top: var(--lh-em);
    }
  }
  ul {
    padding-left: calc(0.75 * var(--lh-em));
    li {
      list-style: none;
      position: relative;
      &::before {
        content: '•';
        position: absolute;
        left: calc(-0.75 * var(--lh-em));
        // transform: scale(0.75) translateX(calc(0.45 * var(--lh-em)));
      }
    }
  }
}
</style>