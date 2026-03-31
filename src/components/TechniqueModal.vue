<script setup>
import ObservationCard from './ObservationCard.vue'

const props = defineProps({
  technique: { type: Object, default: null },
  observations: { type: Array, default: () => [] },
  show: { type: Boolean, default: false },
})

const emit = defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <div v-if="show && technique" class="modal" @click.self="emit('close')">
      <div class="modal-content" style="max-height:80vh; overflow-y:auto;">
        <button class="modal-close" @click="emit('close')">×</button>
        <h2>{{ technique.Interaction_Technique }}</h2>
        <div v-if="observations.length" class="technique-modal-obs">
          <ObservationCard
            v-for="obs in observations"
            :key="obs.Title + obs.Application"
            :observation="obs"
            :clickable="false"
          />
        </div>
        <p v-else style="color:#9ca3af; font-size:0.875rem;">No observations for this technique.</p>
      </div>
    </div>
  </Teleport>
</template>
