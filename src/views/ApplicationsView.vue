<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useDataStore } from '../stores/data.js'
import ObservationCard from '../components/ObservationCard.vue'
import ObservationModal from '../components/ObservationModal.vue'

const store = useDataStore()
onMounted(async () => {
  await store.load()
  if (store.applications.length) selectedApp.value = store.applications[0]
})

const selectedApp = ref(null)
const selectedObs = ref(null)

const appObservations = computed(() =>
  selectedApp.value ? store.observationsByApplication(selectedApp.value) : []
)

function uniqueMeta(field) {
  return [...new Set(appObservations.value.map(o => (o[field] || '').trim()).filter(Boolean))].join(', ') || '—'
}

watch(() => store.applications, (apps) => {
  if (apps.length && !selectedApp.value) selectedApp.value = apps[0]
})
</script>

<template>
  <main class="main-content">
    <div v-if="store.loading" class="loading-state">Loading…</div>
    <div v-else-if="store.error" class="chart-error">Error: {{ store.error }}</div>
    <template v-else>
      <div class="page-header">
        <h2 class="page-title">Applications</h2>
      </div>
      <div class="apps-layout">
        <aside class="apps-sidebar">
          <div class="apps-sidebar-title">Applications</div>
          <div
            v-for="app in store.applications"
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
              <div class="app-meta-item">
                <div class="app-meta-label">Cost</div>
                <div class="app-meta-value">{{ uniqueMeta('Cost') }}</div>
              </div>
              <div class="app-meta-item">
                <div class="app-meta-label">Scale of Use</div>
                <div class="app-meta-value">{{ uniqueMeta('Scale_Of_Use') }}</div>
              </div>
            </div>
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
