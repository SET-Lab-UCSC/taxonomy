<script setup>
const props = defineProps({
  observation: { type: Object, required: true },
  clickable: { type: Boolean, default: true },
})

const emit = defineEmits(['click'])

function handleClick() {
  if (props.clickable) emit('click', props.observation)
}
</script>

<template>
  <div
    class="obs-card"
    :class="{ small: !clickable }"
    :style="{ cursor: clickable ? 'pointer' : 'default' }"
    @click="handleClick"
  >
    <img
      v-if="observation.URL"
      :src="observation.URL"
      class="obs-card-image"
      :alt="observation.Title"
    />
    <div v-else class="obs-card-image-placeholder gradient-placeholder" />
    <div class="obs-card-info">
      <div class="obs-card-title">{{ observation.Title }}</div>
      <div class="obs-card-app">{{ observation.Application }}</div>
    </div>
  </div>
</template>
