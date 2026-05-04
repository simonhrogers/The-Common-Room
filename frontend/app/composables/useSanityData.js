import { ref } from 'vue'

export default async function useSanityData({ query, params }) {
  const { data } = await useSanityQuery(query, params)

  // Temporary workaround for @nuxtjs/sanity visual-editing response shape: payload is nested under `.data`.
  // Must return a real Ref (like useSanityQuery’s `data`), not a plain `{ value: doc }`, or templates that
  // use `doc.field` break: Vue unwraps Refs in templates but not arbitrary `{ value }` objects.
  
  if (data.value && data.value.data) {
    return ref(data.value.data)
  }

  return data
}

