import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/observations', component: () => import('../views/ObservationsView.vue') },
  { path: '/applications', component: () => import('../views/ApplicationsView.vue') },
  { path: '/analyses', component: () => import('../views/AnalysesView.vue') },
]

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
