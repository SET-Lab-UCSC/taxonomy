<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDataStore } from '../stores/data.js'
import TechniqueCard from '../components/TechniqueCard.vue'
import TechniqueModal from '../components/TechniqueModal.vue'

const store = useDataStore()

const selectedTechnique = ref(null)
const selectedObservations = ref([])

const activeFilters = ref({
  Activity: new Set(),
  Task: new Set(),
  Action: new Set(),
  Handedness: new Set(),
  Multi_Action: new Set(),
})

onMounted(() => store.load())

function uniqueValues(field) {
  const vals = new Set()
  store.observations.forEach(o => {
    (o[field] || '').split(',').map(v => v.trim()).filter(Boolean).forEach(v => vals.add(v))
  })
  return [...vals].sort()
}

const allActivities  = computed(() => uniqueValues('Activity'))
const allTasks       = computed(() => uniqueValues('Task'))
const allActions     = computed(() => uniqueValues('Action'))
const allHandedness  = computed(() => uniqueValues('Handedness'))
const allMultiAction = computed(() => uniqueValues('Multi_Action'))

const anyActive = computed(() => Object.values(activeFilters.value).some(s => s.size > 0))

const filteredTechniques = computed(() => {
  if (!anyActive.value) return store.techniques
  return store.techniques.filter(tech => {
    const obs = store.observationsByTechnique(tech.Interaction_Technique)
    return obs.some(o => {
      return Object.entries(activeFilters.value).every(([field, selected]) => {
        if (selected.size === 0) return true
        const vals = (o[field] || '').split(',').map(v => v.trim())
        return vals.some(v => selected.has(v))
      })
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

function openTechnique(technique) {
  selectedTechnique.value = technique
  selectedObservations.value = store.observationsByTechnique(technique.Interaction_Technique)
}

function closeModal() {
  selectedTechnique.value = null
  selectedObservations.value = []
}
</script>

<template>
  <main class="main-content">
    <div v-if="store.loading" class="loading-state">Loading…</div>
    <div v-else-if="store.error" class="chart-error">Error: {{ store.error }}</div>
    <template v-else>
      <div class="page-header" style="margin-bottom:1rem;">
        <h2 class="page-title">Interaction Techniques</h2>
      </div>

      <div class="home-layout">
        <!-- Gallery -->
        <div class="technique-gallery-wrapper">
          <div class="technique-gallery">
            <TechniqueCard
              v-for="tech in filteredTechniques"
              :key="tech.Interaction_Technique"
              :technique="tech"
              :exemplar="store.exemplarForTechnique(tech.Interaction_Technique)"
              @click="openTechnique"
            />
          </div>
        </div>

        <!-- Filter panel -->
        <aside class="filter-panel">
          <div class="filter-panel-header">
            <span class="filter-panel-title">Filter Techniques</span>
            <button v-if="anyActive" class="activity-chip-clear" @click="clearAll">✕ Clear all</button>
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
            <div class="activity-filter-label">Action</div>
            <div class="activity-filter-bar">
              <button v-for="v in allActions" :key="v"
                class="activity-chip" :class="{ active: activeFilters.Action.has(v) }"
                @click="toggle('Action', v)">{{ v }}</button>
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
    <TechniqueModal
      :technique="selectedTechnique"
      :observations="selectedObservations"
      :show="!!selectedTechnique"
      @close="closeModal"
    />
  </main>
</template>
