<template>
  <div class="main-content">
    <h1 class="page-title">Feedback Modality Coverage</h1>
    <p class="page-description">
      This matrix shows which feedback modalities each application uses across its observations.
      Haptic feedback is nearly universal on Meta Quest hardware; visual highlighting is the most
      common feedforward substitute; and feedforward (anticipatory cues) is dramatically underused
      compared to feedback — revealing a gap in VR interaction design.
    </p>

    <!-- Feedback Heatmap -->
    <div class="viz-card">
      <div class="viz-card-title">Feedback Coverage</div>
      <div class="matrix-wrapper">
        <table class="matrix-table">
          <thead>
            <tr>
              <th class="row-header">Application</th>
              <th v-for="mod in MODALITIES" :key="mod">{{ mod }}</th>
              <th>Total obs</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in feedbackRows" :key="row.app">
              <td class="row-label">{{ row.app }}</td>
              <td
                v-for="mod in MODALITIES"
                :key="mod"
                :style="cellStyle(row.counts[mod], feedbackMaxByModality[mod])"
              >
                {{ row.counts[mod] || '' }}
              </td>
              <td>{{ row.total }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Feedforward Heatmap -->
    <div class="viz-card" style="margin-top: 2rem;">
      <div class="viz-card-title">Feedforward Coverage</div>
      <div class="matrix-wrapper">
        <table class="matrix-table">
          <thead>
            <tr>
              <th class="row-header">Application</th>
              <th v-for="mod in MODALITIES" :key="mod">{{ mod }}</th>
              <th>Total obs</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in feedforwardRows" :key="row.app">
              <td class="row-label">{{ row.app }}</td>
              <td
                v-for="mod in MODALITIES"
                :key="mod"
                :style="cellStyle(row.counts[mod], feedforwardMaxByModality[mod])"
              >
                {{ row.counts[mod] || '' }}
              </td>
              <td>{{ row.total }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useDataStore } from '../stores/data.js'

const store = useDataStore()

onMounted(async () => {
  await store.load()
})

const MODALITIES = ['Haptic', 'Audio', 'Visual', 'UI Change', 'Physics', 'Other']

function classifyToken(token) {
  const t = token.toLowerCase().trim()
  if (!t) return null
  if (/haptic|rumble|vibrat/.test(t)) return 'Haptic'
  if (/audio|sound|music/.test(t)) return 'Audio'
  if (/highlight|visual|color|glow|particle|flash|effect|animation/.test(t)) return 'Visual'
  if (/ui|menu|indicator|light|text|button/.test(t)) return 'UI Change'
  if (/physics|weight|weighted|move|moving/.test(t)) return 'Physics'
  return 'Other'
}

function parseModalities(value) {
  if (!value) return new Set()
  const tokens = value.split(',').map(s => s.trim()).filter(Boolean)
  const result = new Set()
  for (const tok of tokens) {
    const cat = classifyToken(tok)
    if (cat) result.add(cat)
  }
  return result
}

function buildRows(column) {
  const obs = store.observations
  // Group by application
  const appMap = {}
  for (const o of obs) {
    const app = (o.Application || '').trim()
    if (!app) continue
    if (!appMap[app]) appMap[app] = []
    appMap[app].push(o)
  }

  const rows = Object.entries(appMap).map(([app, items]) => {
    const counts = {}
    for (const mod of MODALITIES) counts[mod] = 0
    for (const item of items) {
      const mods = parseModalities(item[column])
      for (const mod of mods) {
        if (counts[mod] !== undefined) counts[mod]++
      }
    }
    return { app, counts, total: items.length }
  })

  // Sort by total desc
  rows.sort((a, b) => b.total - a.total)
  return rows
}

const feedbackRows = computed(() => buildRows('Feedback'))
const feedforwardRows = computed(() => buildRows('Feedforward'))

function maxByModality(rows) {
  const maxes = {}
  for (const mod of MODALITIES) {
    maxes[mod] = Math.max(...rows.map(r => r.counts[mod] || 0), 1)
  }
  return maxes
}

const feedbackMaxByModality = computed(() => maxByModality(feedbackRows.value))
const feedforwardMaxByModality = computed(() => maxByModality(feedforwardRows.value))

function cellStyle(count, maxCount) {
  if (!count) return { backgroundColor: '#fff', color: '#333' }
  const ratio = count / maxCount
  // Scale alpha 0.1 → 0.9
  const alpha = 0.1 + ratio * 0.8
  const textColor = alpha > 0.5 ? '#fff' : '#222'
  return {
    backgroundColor: `rgba(205,55,53,${alpha.toFixed(3)})`,
    color: textColor,
    fontWeight: alpha > 0.5 ? '600' : '400',
  }
}
</script>
