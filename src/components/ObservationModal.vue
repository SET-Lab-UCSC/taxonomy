<script setup>
const props = defineProps({
  observation: { type: Object, default: null },
  show: { type: Boolean, default: false },
})

const emit = defineEmits(['close'])

const fields = [
  'Title', 'Application', 'Activity', 'Task', 'Action',
  'Feedback', 'Feedforward', 'Handedness', 'Multi_Action',
  'XR', 'Interface_Elements', 'Interaction_Technique',
]
</script>

<template>
  <Teleport to="body">
    <div v-if="show && observation" class="modal" @click.self="emit('close')">
      <div class="modal-content">
        <button class="modal-close" @click="emit('close')">×</button>
        <img
          v-if="observation.URL"
          :src="observation.URL"
          class="obs-modal-image"
          :alt="observation.Title"
        />
        <div v-else class="obs-card-image-placeholder gradient-placeholder" style="border-radius:8px; margin-bottom:1rem;" />
        <div class="obs-modal-meta">
          <div v-for="field in fields" :key="field" class="obs-modal-field">
            <span class="obs-modal-label">{{ field.replace(/_/g, ' ') }}</span>
            <span class="obs-modal-value">{{ observation[field] || '—' }}</span>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
