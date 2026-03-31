<template>
  <div class="main-content">
    <h1 class="page-title">Convergence vs. Embodiment Complexity</h1>
    <p class="page-description">
      Each bubble represents one interaction technique. The horizontal axis shows how widely it has
      converged across applications; the vertical axis shows how physically complex it is (number of
      distinct input primitives required). Bubble size = total observation count. This visualization
      makes visible the paper's core claim: converged mainstream techniques (bottom-right) are
      systematically simpler, while embodied edge-case techniques (top-left) remain
      application-specific.
    </p>

    <div class="viz-card">
      <h2 class="viz-card-title">Bubble Chart</h2>

      <!-- Legend -->
      <div class="legend">
        <div v-for="(color, activity) in activityColors" :key="activity" class="legend-item">
          <span class="legend-dot" :style="{ background: color }"></span>
          <span>{{ activity }}</span>
        </div>
      </div>

      <div class="chart-wrap">
        <canvas ref="canvasRef"></canvas>
      </div>

      <p v-if="store.loading" class="status-msg">Loading data…</p>
      <p v-if="store.error" class="status-msg error">{{ store.error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Chart } from 'chart.js/auto'
import { useDataStore } from '../stores/data.js'

const store = useDataStore()
const canvasRef = ref(null)
let chartInstance = null

const activityColors = {
  'System Control': 'rgba(99,102,241,0.75)',
  Manipulation: 'rgba(20,184,166,0.75)',
  Locomotion: 'rgba(251,146,60,0.75)',
  Activation: 'rgba(205,55,53,0.75)',
  Other: 'rgba(107,114,128,0.75)',
}

function getActivityColor(activity) {
  return activityColors[activity] || activityColors['Other']
}

function computeMetrics(observations) {
  const map = new Map()

  for (const obs of observations) {
    const techniques = (obs.Interaction_Technique || '')
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)

    const actionCount = (obs.Action || '')
      .split(',')
      .map(a => a.trim())
      .filter(Boolean).length

    const app = (obs.Application || '').trim()
    const activity = (obs.Activity || '').trim()

    for (const tech of techniques) {
      if (!map.has(tech)) {
        map.set(tech, { apps: new Set(), obsCount: 0, actionComplexities: [], activities: {} })
      }
      const entry = map.get(tech)
      if (app) entry.apps.add(app)
      entry.obsCount++
      entry.actionComplexities.push(actionCount || 1)
      if (activity) {
        entry.activities[activity] = (entry.activities[activity] || 0) + 1
      }
    }
  }

  const results = []
  for (const [tech, data] of map.entries()) {
    const appCount = data.apps.size
    const obsCount = data.obsCount
    const meanActionComplexity =
      data.actionComplexities.reduce((a, b) => a + b, 0) / (data.actionComplexities.length || 1)

    let primaryActivity = 'Other'
    let maxCount = 0
    for (const [act, cnt] of Object.entries(data.activities)) {
      if (cnt > maxCount) {
        maxCount = cnt
        primaryActivity = act
      }
    }

    results.push({
      tech,
      appCount,
      obsCount,
      meanActionComplexity: Math.round(meanActionComplexity * 100) / 100,
      primaryActivity,
      apps: Array.from(data.apps),
    })
  }

  return results
}

function buildChart(metrics) {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }

  const obsCounts = metrics.map(m => m.obsCount)
  const minObs = Math.min(...obsCounts)
  const maxObs = Math.max(...obsCounts)
  const minR = 8
  const maxR = 30

  function scaleR(obs) {
    if (maxObs === minObs) return (minR + maxR) / 2
    return minR + ((obs - minObs) / (maxObs - minObs)) * (maxR - minR)
  }

  // Group by primaryActivity for dataset coloring
  const byActivity = {}
  for (const m of metrics) {
    const act = m.primaryActivity in activityColors ? m.primaryActivity : 'Other'
    if (!byActivity[act]) byActivity[act] = []
    byActivity[act].push(m)
  }

  const datasets = Object.entries(byActivity).map(([activity, items]) => ({
    label: activity,
    data: items.map(m => ({
      x: m.appCount,
      y: m.meanActionComplexity,
      r: scaleR(m.obsCount),
      _meta: m,
    })),
    backgroundColor: getActivityColor(activity),
    borderColor: getActivityColor(activity).replace('0.75', '1'),
    borderWidth: 1,
  }))

  chartInstance = new Chart(canvasRef.value, {
    type: 'bubble',
    data: { datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label(ctx) {
              const m = ctx.raw._meta
              const appList =
                m.apps.length > 5
                  ? m.apps.slice(0, 5).join(', ') + ` +${m.apps.length - 5} more`
                  : m.apps.join(', ')
              return [
                `Technique: ${m.tech}`,
                `Applications: ${m.appCount}`,
                `Mean Action Complexity: ${m.meanActionComplexity}`,
                `Total Observations: ${m.obsCount}`,
                `Apps: ${appList}`,
              ]
            },
            title() {
              return ''
            },
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Applications Using Technique',
            font: { size: 13 },
          },
          min: 0,
          ticks: { stepSize: 1 },
        },
        y: {
          title: {
            display: true,
            text: 'Mean Action Complexity',
            font: { size: 13 },
          },
          min: 0,
        },
      },
    },
  })
}

onMounted(async () => {
  await store.load()
  const metrics = computeMetrics(store.observations)
  buildChart(metrics)
})

onBeforeUnmount(() => {
  if (chartInstance) chartInstance.destroy()
})
</script>

<style scoped>
.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 24px;
  margin-bottom: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
}

.legend-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  flex-shrink: 0;
}

.chart-wrap {
  position: relative;
  height: 520px;
}

.status-msg {
  text-align: center;
  color: #6b7280;
  margin-top: 12px;
}

.status-msg.error {
  color: #ef4444;
}
</style>
