<script setup>
import { computed } from 'vue'

const props = defineProps({
  technique: { type: Object, required: true },
  exemplar: { type: Object, default: null },
})

const emit = defineEmits(['click'])

const imageSrc = computed(() => props.technique.Thumbnail || props.exemplar?.URL || null)
</script>

<template>
  <div class="technique-card" @click="emit('click', technique)">
    <img
      v-if="imageSrc"
      :src="imageSrc"
      class="technique-card-thumb"
      :alt="technique.Interaction_Technique"
    />
    <div v-else class="technique-card-placeholder gradient-placeholder" />
    <div class="technique-card-name">{{ technique.Interaction_Technique }}</div>
  </div>
</template>
