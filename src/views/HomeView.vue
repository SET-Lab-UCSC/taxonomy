<script setup>
import { ref, onMounted } from 'vue'
import { useDataStore } from '../stores/data.js'
import TechniqueCard from '../components/TechniqueCard.vue'
import TechniqueModal from '../components/TechniqueModal.vue'

const store = useDataStore()

const selectedTechnique = ref(null)
const selectedObservations = ref([])

onMounted(() => store.load())

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
      <div class="page-header">
        <h2 class="page-title">Interaction Techniques</h2>
        <p class="page-description">
          Browse the catalogue of spatial interaction techniques documented in the Spatial Interaction Vault.
          Click a card to explore observations.
        </p>
      </div>
      <div class="technique-gallery">
        <TechniqueCard
          v-for="tech in store.techniques"
          :key="tech.Interaction_Technique"
          :technique="tech"
          :exemplar="store.exemplarForTechnique(tech.Interaction_Technique)"
          @click="openTechnique"
        />
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
