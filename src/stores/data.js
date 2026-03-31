import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Papa from 'papaparse'

async function fetchCsv(fileName) {
  const basePath = import.meta.env.BASE_URL || '/'
  const paths = [`./${fileName}`, `${basePath}${fileName}`, `/${fileName}`]
  for (const path of paths) {
    try {
      const res = await fetch(path)
      if (res.ok) {
        const text = await res.text()
        const parsed = Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          // Normalize headers: trim whitespace + map new column names to canonical ones
          transformHeader: h => {
            h = h.trim()
            const map = {
              'Title (internal)': 'Title',
              '∫Handedness': 'Handedness',
              'Multi-action': 'Multi_Action',
              'Interface_Element': 'Interface_Elements',
            }
            return map[h] || h
          },
        })
        return parsed.data
      }
    } catch (_) {
      continue
    }
  }
  throw new Error(`Could not load ${fileName}`)
}

export const useDataStore = defineStore('data', () => {
  const observations = ref([])
  const loading = ref(false)
  const error = ref(null)
  let loaded = false

  async function load() {
    if (loaded) return
    loading.value = true
    error.value = null
    try {
      observations.value = await fetchCsv('Taxonomy Observations - Observations.csv')
      loaded = true
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const techniques = computed(() => {
    const allTechniques = new Set()
    observations.value.forEach(o => {
      (o.Interaction_Technique || '')
        .split(',')
        .map(t => t.trim())
        .filter(Boolean)
        .forEach(t => allTechniques.add(t))
    })
    return Array.from(allTechniques)
      .sort()
      .map(name => ({ Interaction_Technique: name }))
  })

  const applications = computed(() => {
    const names = observations.value.map(o => (o.Application || '').trim()).filter(Boolean)
    return [...new Set(names)].sort()
  })

  function observationsByTechnique(name) {
    return observations.value.filter(o =>
      (o.Interaction_Technique || '')
        .split(',')
        .map(t => t.trim())
        .includes(name)
    )
  }

  function observationsByApplication(name) {
    return observations.value.filter(o => (o.Application || '').trim() === name)
  }

  function exemplarForTechnique(name) {
    const matches = observationsByTechnique(name)
    if (!matches.length) return null
    return matches[Math.floor(Math.random() * matches.length)]
  }

  return {
    techniques,
    observations,
    applications,
    loading,
    error,
    load,
    observationsByTechnique,
    observationsByApplication,
    exemplarForTechnique,
  }
})
