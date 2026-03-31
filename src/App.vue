<script setup>
import { onMounted } from 'vue'
import AppHeader from './components/AppHeader.vue'
import SubNav from './components/SubNav.vue'
import { useDataStore } from './stores/data.js'

const store = useDataStore()
onMounted(() => store.load())
</script>

<template>
  <AppHeader />
  <SubNav />
  <RouterView />
</template>
