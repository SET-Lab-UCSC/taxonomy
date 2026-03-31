<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  observation: { type: Object, required: true },
  clickable: { type: Boolean, default: true },
  pauseGif: { type: Boolean, default: false },
})

const emit = defineEmits(['click'])
const canvasRef = ref(null)

function handleClick() {
  if (props.clickable) emit('click', props.observation)
}

function drawToCanvas() {
  if (!props.pauseGif || !props.observation.URL || !canvasRef.value) return
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.onload = () => {
    const canvas = canvasRef.value
    if (!canvas) return
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    canvas.getContext('2d').drawImage(img, 0, 0)
  }
  img.src = props.observation.URL
}

onMounted(drawToCanvas)
watch(() => props.observation.URL, drawToCanvas)
</script>

<template>
  <div
    class="obs-card"
    :class="{ small: !clickable }"
    :style="{ cursor: clickable ? 'pointer' : 'default' }"
    @click="handleClick"
  >
    <!-- Paused: draw first frame to canvas -->
    <canvas
      v-if="pauseGif && observation.URL"
      ref="canvasRef"
      class="obs-card-image"
    />
    <!-- Animated or no-pause -->
    <img
      v-else-if="observation.URL"
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
