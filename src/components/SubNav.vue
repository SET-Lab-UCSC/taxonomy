<script setup>
import { ref } from 'vue'

const vizOpen = ref(false)

const vizLinks = [
  { to: '/viz/sankey', label: 'Taxonomy Flow (Sankey)' },
  { to: '/viz/embodiment', label: 'Embodiment Spectrum' },
  { to: '/viz/chord', label: 'Action–Technique Chord' },
  { to: '/viz/radar', label: 'Application Profiles (Radar)' },
  { to: '/viz/feedback', label: 'Feedback Matrix' },
  { to: '/viz/complexity', label: 'Convergence vs. Complexity' },
  { to: '/viz/network', label: 'Technique Adoption Network' },
]
</script>

<template>
  <nav class="sub-nav">
    <div class="sub-nav-links">
      <RouterLink to="/" class="sub-nav-link">Interaction Techniques ›</RouterLink>
      <RouterLink to="/observations" class="sub-nav-link">Observations ›</RouterLink>
      <RouterLink to="/applications" class="sub-nav-link">Applications ›</RouterLink>
      <RouterLink to="/analyses" class="sub-nav-link">Analyses ›</RouterLink>
      <div class="sub-nav-dropdown" @mouseenter="vizOpen = true" @mouseleave="vizOpen = false">
        <span class="sub-nav-link sub-nav-dropdown-trigger">Visualizations ›</span>
        <div v-if="vizOpen" class="sub-nav-dropdown-menu">
          <RouterLink
            v-for="link in vizLinks"
            :key="link.to"
            :to="link.to"
            class="sub-nav-dropdown-item"
            @click="vizOpen = false"
          >{{ link.label }}</RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>
