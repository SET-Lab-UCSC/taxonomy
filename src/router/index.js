import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/observations', component: () => import('../views/ObservationsView.vue') },
  { path: '/applications', component: () => import('../views/ApplicationsView.vue') },
  { path: '/analyses', component: () => import('../views/AnalysesView.vue') },
  { path: '/viz/sankey', component: () => import('../views/SankeyView.vue') },
  { path: '/viz/embodiment', component: () => import('../views/EmbodimentView.vue') },
  { path: '/viz/chord', component: () => import('../views/ChordView.vue') },
  { path: '/viz/radar', component: () => import('../views/RadarView.vue') },
  { path: '/viz/feedback', component: () => import('../views/FeedbackMatrixView.vue') },
  { path: '/viz/complexity', component: () => import('../views/ComplexityBubbleView.vue') },
  { path: '/viz/network', component: () => import('../views/BipartiteNetworkView.vue') },
]

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
