<script setup>
import { useRouter } from "vue-router"
const router = useRouter()
</script>
<template>
  <header class="header">
    <h1 class="site-title font-display gradient-text" @click="router.push('/')">
      Spatial Interaction Vault
    </h1>
    <div class="header-buttons">
      <button class="btn btn-outline"><b>Submit an observation</b></button>
      <button class="btn btn-primary"><b>About</b></button>
    </div>
  </header>
</template>
