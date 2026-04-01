<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useDataStore } from '../stores/data.js'
import ObservationCard from '../components/ObservationCard.vue'
import ObservationModal from '../components/ObservationModal.vue'

const store = useDataStore()
onMounted(async () => {
  await store.load()
  if (filteredApps.value.length) selectedApp.value = filteredApps.value[0]
})

const selectedApp = ref(null)
const selectedObs = ref(null)
const activeGenres = ref(new Set())

// All unique genres across observations
const allGenres = computed(() => {
  const genres = new Set()
  store.observations.forEach(o => {
    const g = (o.Genre || '').trim()
    if (g) genres.add(g)
  })
  return [...genres].sort()
})

// Genre for a given app (first non-empty value)
function appGenre(app) {
  const obs = store.observations.find(o => o.Application === app && o.Genre)
  return (obs?.Genre || '').trim()
}

// Apps filtered by active genre chips
const filteredApps = computed(() => {
  if (activeGenres.value.size === 0) return store.applications
  return store.applications.filter(app => activeGenres.value.has(appGenre(app)))
})

const appObservations = computed(() =>
  selectedApp.value ? store.observationsByApplication(selectedApp.value) : []
)

function uniqueMeta(field) {
  return [...new Set(appObservations.value.map(o => (o[field] || '').trim()).filter(Boolean))].join(', ') || '—'
}

function toggleGenre(g) {
  const next = new Set(activeGenres.value)
  if (next.has(g)) next.delete(g)
  else next.add(g)
  activeGenres.value = next
}

function clearGenres() {
  activeGenres.value = new Set()
}

// Auto-select first app when filter changes
watch(filteredApps, (apps) => {
  if (!apps.includes(selectedApp.value)) {
    selectedApp.value = apps[0] || null
  }
})

watch(() => store.applications, (apps) => {
  if (apps.length && !selectedApp.value) selectedApp.value = apps[0]
})
</script>

<template>
  <main class="main-content">
    <div v-if="store.loading" class="loading-state">Loading…</div>
    <div v-else-if="store.error" class="chart-error">Error: {{ store.error }}</div>
    <template v-else>
      <div style="margin-bottom:0.75rem;">
        <h2 class="page-title" style="margin-bottom:0;">Applications</h2>
        <p style="color:#6b7280; font-size:0.9rem; margin:0;">Viewing {{ filteredApps.length }} application{{ filteredApps.length === 1 ? '' : 's' }}</p>
      </div>

      <!-- Genre filter -->
      <div v-if="allGenres.length" class="filter-panel" style="position:static; border-left:none; padding-left:0; border-bottom:1px solid #e5e7eb; margin-bottom:1.5rem; padding-bottom:1rem; width:100%;">
        <div class="filter-panel-header">
          <span class="filter-panel-title">Filter by Genre</span>
          <button v-if="activeGenres.size > 0" class="activity-chip-clear" @click="clearGenres">✕ Clear</button>
        </div>
        <div class="activity-filter-bar">
          <button
            v-for="g in allGenres"
            :key="g"
            class="activity-chip"
            :class="{ active: activeGenres.has(g) }"
            @click="toggleGenre(g)"
          >{{ g }}</button>
        </div>
      </div>

      <div class="apps-layout">
        <aside class="apps-sidebar">
          <div class="apps-sidebar-title">Applications</div>
          <div
            v-for="app in filteredApps"
            :key="app"
            class="app-list-item"
            :class="{ active: selectedApp === app }"
            @click="selectedApp = app"
          >
            {{ app }}
          </div>
        </aside>
        <section class="app-detail">
          <template v-if="selectedApp">
            <h2 class="app-detail-name">{{ selectedApp }}</h2>
            <div class="app-meta-grid">
              <div class="app-meta-item">
                <div class="app-meta-label">Genre</div>
                <div class="app-meta-value">{{ uniqueMeta('Genre') }}</div>
              </div>
              <div class="app-meta-item">
                <div class="app-meta-label">Platforms</div>
                <div class="app-meta-value">{{ uniqueMeta('Supported_Platforms') }}</div>
              </div>
            </div>
            <p style="color:#6b7280; font-size:0.9rem; margin-bottom:1rem;">
              {{ appObservations.length }} observation{{ appObservations.length === 1 ? '' : 's' }}
            </p>
            <div class="obs-gallery">
              <ObservationCard
                v-for="obs in appObservations"
                :key="obs.Title + obs.Application"
                :observation="obs"
                :clickable="true"
                @click="selectedObs = $event"
              />
            </div>
          </template>
          <div v-else class="app-detail-placeholder">Select an application to explore</div>
        </section>
      </div>
    </template>
    <ObservationModal
      :observation="selectedObs"
      :show="!!selectedObs"
      @close="selectedObs = null"
    />
  </main>
</template>
