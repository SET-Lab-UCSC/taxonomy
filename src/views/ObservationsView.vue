<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDataStore } from '../stores/data.js'
import ObservationCard from '../components/ObservationCard.vue'
import ObservationModal from '../components/ObservationModal.vue'

const store = useDataStore()
onMounted(() => store.load())

const filterApp = ref('')
const filterTechnique = ref('')
const filterGenre = ref('')
const filterYear = ref('')

const uniqueValues = (field) =>
  computed(() => {
    const vals = store.observations
      .map(o => (o[field] || '').trim())
      .filter(Boolean)
    return [...new Set(vals)].sort()
  })

const apps = uniqueValues('Application')
const techniques = uniqueValues('Interaction_Technique')
const genres = uniqueValues('Genre')
const years = uniqueValues('Year')

const filtered = computed(() => {
  return store.observations.filter(o => {
    if (filterApp.value && (o.Application || '').trim() !== filterApp.value) return false
    if (filterTechnique.value) {
      const techs = (o.Interaction_Technique || '').split(',').map(t => t.trim())
      if (!techs.includes(filterTechnique.value)) return false
    }
    if (filterGenre.value && (o.Genre || '').trim() !== filterGenre.value) return false
    if (filterYear.value && (o.Year || '').trim() !== filterYear.value) return false
    return true
  })
})

const selectedObs = ref(null)
</script>

<template>
  <main class="main-content">
    <div v-if="store.loading" class="loading-state">Loading…</div>
    <div v-else-if="store.error" class="chart-error">Error: {{ store.error }}</div>
    <template v-else>
      <div class="page-header">
        <h2 class="page-title">Observations</h2>
      </div>
      <div class="filter-bar">
        <label>Application
          <select v-model="filterApp">
            <option value="">All</option>
            <option v-for="v in apps" :key="v" :value="v">{{ v }}</option>
          </select>
        </label>
        <label>Technique
          <select v-model="filterTechnique">
            <option value="">All</option>
            <option v-for="v in techniques" :key="v" :value="v">{{ v }}</option>
          </select>
        </label>
        <label>Genre
          <select v-model="filterGenre">
            <option value="">All</option>
            <option v-for="v in genres" :key="v" :value="v">{{ v }}</option>
          </select>
        </label>
        <label>Year
          <select v-model="filterYear">
            <option value="">All</option>
            <option v-for="v in years" :key="v" :value="v">{{ v }}</option>
          </select>
        </label>
      </div>
      <div class="obs-gallery">
        <ObservationCard
          v-for="obs in filtered"
          :key="obs.Title + obs.Application"
          :observation="obs"
          :clickable="true"
          @click="selectedObs = $event"
        />
      </div>
      <p v-if="filtered.length === 0" style="color:#9ca3af;">No observations match your filters.</p>
    </template>
    <ObservationModal
      :observation="selectedObs"
      :show="!!selectedObs"
      @close="selectedObs = null"
    />
  </main>
</template>
