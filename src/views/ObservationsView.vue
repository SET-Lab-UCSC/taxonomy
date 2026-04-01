<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDataStore } from '../stores/data.js'
import ObservationCard from '../components/ObservationCard.vue'
import ObservationModal from '../components/ObservationModal.vue'

const store = useDataStore()
onMounted(() => store.load())

const activeFilters = ref({
  Interaction_Technique: new Set(),
  Activity: new Set(),
  Task: new Set(),
  Handedness: new Set(),
  Multi_Action: new Set(),
})

function uniqueChipValues(field) {
  return computed(() => {
    const vals = new Set()
    store.observations.forEach(o => {
      (o[field] || '').split(',').map(v => v.trim()).filter(Boolean).forEach(v => vals.add(v))
    })
    return [...vals].sort()
  })
}

const allTechniques  = uniqueChipValues('Interaction_Technique')
const allActivities  = uniqueChipValues('Activity')
const allTasks       = uniqueChipValues('Task')
const allHandedness  = uniqueChipValues('Handedness')
const allMultiAction = uniqueChipValues('Multi_Action')

const anyActive = computed(() => Object.values(activeFilters.value).some(s => s.size > 0))

const filtered = computed(() => {
  if (!anyActive.value) return store.observations
  return store.observations.filter(o => {
    return Object.entries(activeFilters.value).every(([field, selected]) => {
      if (selected.size === 0) return true
      const vals = (o[field] || '').split(',').map(v => v.trim())
      return vals.some(v => selected.has(v))
    })
  })
})

function toggle(field, value) {
  const next = new Set(activeFilters.value[field])
  if (next.has(value)) next.delete(value)
  else next.add(value)
  activeFilters.value[field] = next
}

function clearAll() {
  Object.keys(activeFilters.value).forEach(k => {
    activeFilters.value[k] = new Set()
  })
}

const selectedObs = ref(null)
</script>

<template>
  <main class="main-content">
    <div v-if="store.loading" class="loading-state">Loading…</div>
    <div v-else-if="store.error" class="chart-error">Error: {{ store.error }}</div>
    <template v-else>
      <div class="page-header">
        <h2 class="page-title">Observations</h2>
        <p class="page-description">Viewing {{ filtered.length }} observation{{ filtered.length === 1 ? '' : 's' }}</p>
      </div>

      <div class="home-layout">
        <!-- Gallery -->
        <div class="technique-gallery-wrapper">
          <div class="obs-gallery">
            <ObservationCard
              v-for="obs in filtered"
              :key="obs.Title + obs.Application"
              :observation="obs"
              :clickable="true"
              :pause-gif="true"
              @click="selectedObs = $event"
            />
          </div>
          <p v-if="filtered.length === 0" style="color:#9ca3af; margin-top:2rem;">No observations match your filters.</p>
        </div>

        <!-- Filter panel -->
        <aside class="filter-panel">
          <div class="filter-panel-header">
            <span class="filter-panel-title">Filter Observations</span>
            <button v-if="anyActive" class="activity-chip-clear" @click="clearAll">✕ Clear all</button>
          </div>

          <div class="activity-filter-section">
            <div class="activity-filter-label">Interaction Technique</div>
            <div class="activity-filter-bar">
              <button v-for="v in allTechniques" :key="v"
                class="activity-chip" :class="{ active: activeFilters.Interaction_Technique.has(v) }"
                @click="toggle('Interaction_Technique', v)">{{ v }}</button>
            </div>
          </div>

          <div class="activity-filter-section">
            <div class="activity-filter-label">Activity</div>
            <div class="activity-filter-bar">
              <button v-for="v in allActivities" :key="v"
                class="activity-chip" :class="{ active: activeFilters.Activity.has(v) }"
                @click="toggle('Activity', v)">{{ v }}</button>
            </div>
          </div>

          <div class="activity-filter-section">
            <div class="activity-filter-label">Task</div>
            <div class="activity-filter-bar">
              <button v-for="v in allTasks" :key="v"
                class="activity-chip" :class="{ active: activeFilters.Task.has(v) }"
                @click="toggle('Task', v)">{{ v }}</button>
            </div>
          </div>

          <div class="activity-filter-section">
            <div class="activity-filter-label">Handedness</div>
            <div class="activity-filter-bar">
              <button v-for="v in allHandedness" :key="v"
                class="activity-chip" :class="{ active: activeFilters.Handedness.has(v) }"
                @click="toggle('Handedness', v)">{{ v }}</button>
            </div>
          </div>

          <div class="activity-filter-section">
            <div class="activity-filter-label">Multi-action</div>
            <div class="activity-filter-bar">
              <button v-for="v in allMultiAction" :key="v"
                class="activity-chip" :class="{ active: activeFilters.Multi_Action.has(v) }"
                @click="toggle('Multi_Action', v)">{{ v }}</button>
            </div>
          </div>
        </aside>
      </div>
    </template>
    <ObservationModal
      :observation="selectedObs"
      :show="!!selectedObs"
      @close="selectedObs = null"
    />
  </main>
</template>
