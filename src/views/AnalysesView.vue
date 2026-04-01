<script setup>
import { ref, onMounted, nextTick } from 'vue'
import * as d3 from 'd3'
import { sankey as d3Sankey, sankeyLinkHorizontal } from 'd3-sankey'
import Chart from 'chart.js/auto'
import { useDataStore } from '../stores/data.js'

const store = useDataStore()

const convergenceCanvas = ref(null)
const freqChart = ref(null)

let convergenceChart = null
let freqChartInstance = null

// ── Chart 1: Convergence (ported from convergence.html) ──────────────────────

function buildTechStats(observations) {
  const freqMap = {}
  const appMap = {}

  observations.forEach(obs => {
    const techRaw = (obs.Interaction_Technique || '').trim()
    if (!techRaw) return
    const app = (obs.Application || '').trim()
    const techs = techRaw.split(',').map(t => t.trim()).filter(Boolean)
    techs.forEach(t => {
      freqMap[t] = (freqMap[t] || 0) + 1
      if (!appMap[t]) appMap[t] = new Set()
      if (app) appMap[t].add(app)
    })
  })

  return Object.entries(freqMap).map(([tech, freq]) => ({
    technique: tech,
    frequency: freq,
    appCount: appMap[tech] ? appMap[tech].size : 0,
    apps: appMap[tech] ? Array.from(appMap[tech]).sort() : [],
  })).sort((a, b) => b.frequency - a.frequency)
}

function scaledRadius(freq, maxFreq) {
  return 6 + Math.round((freq / maxFreq) * 22)
}

function renderConvergenceChart(observations) {
  const stats = buildTechStats(observations)
  const maxFreq = Math.max(...stats.map(s => s.frequency))

  const categories = [
    { label: 'Convergent (4+ apps)', minApps: 4, color: 'rgba(20,184,166,0.75)', border: 'rgba(13,148,136,1)' },
    { label: 'Semi-convergent (2–3 apps)', minApps: 2, maxApps: 3, color: 'rgba(251,146,60,0.75)', border: 'rgba(234,88,12,1)' },
    { label: 'Divergent (1 app)', minApps: 0, maxApps: 1, color: 'rgba(239,68,68,0.75)', border: 'rgba(220,38,38,1)' },
  ]

  const datasets = categories.map(cat => {
    const points = stats
      .filter(s => cat.maxApps !== undefined
        ? s.appCount >= cat.minApps && s.appCount <= cat.maxApps
        : s.appCount >= cat.minApps)
      .map(s => ({
        x: s.appCount,
        y: s.frequency,
        r: scaledRadius(s.frequency, maxFreq),
        technique: s.technique,
        apps: s.apps,
      }))
    return {
      label: cat.label,
      data: points,
      backgroundColor: cat.color,
      borderColor: cat.border,
      borderWidth: 1.5,
    }
  })

  if (convergenceChart) convergenceChart.destroy()
  convergenceChart = new Chart(convergenceCanvas.value, {
    type: 'bubble',
    data: { datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: { font: { family: "'Work Sans', sans-serif", size: 12 } },
        },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.85)',
          padding: 12,
          titleFont: { size: 13, weight: 'bold', family: "'Work Sans', sans-serif" },
          bodyFont: { size: 12, family: "'Work Sans', sans-serif" },
          borderColor: 'rgba(205,55,53,1)',
          borderWidth: 1,
          callbacks: {
            title: (items) => items[0].raw.technique,
            label: (ctx) => {
              const d = ctx.raw
              return [`Observations: ${d.y}`, `Apps (${d.x}): ${d.apps.join(', ') || '—'}`]
            },
          },
        },
      },
      scales: {
        x: {
          title: { display: true, text: 'Number of Applications Using Technique', font: { family: "'Work Sans', sans-serif", size: 12 } },
          ticks: { stepSize: 1, font: { family: "'Work Sans', sans-serif" } },
          min: 0,
        },
        y: {
          title: { display: true, text: 'Total Observations', font: { family: "'Work Sans', sans-serif", size: 12 } },
          ticks: { stepSize: 1, font: { family: "'Work Sans', sans-serif" } },
          beginAtZero: true,
        },
      },
    },
  })
}

// ── Chart 2: Technique Frequency by Genre (ported from technique-frequency.html) ──

const GENRE_MAP = {
  "Beat Saber":                         "Music / Rhythm",
  "Fruit Ninja":                        "Action / Arcade",
  "Archery Pro":                        "Sports",
  "War of Wizards: Apprentice Edition": "Fantasy / Action",
  "Forever Pets":                       "Simulation",
  "Half Life: Alyx":                    "FPS / Action",
  "VTOL VR":                            "Flight Simulator",
  "ShapesXR":                           "Productivity",
  "Meta Quest 3: Home":                 "OS / Platform",
  "Roblox":                             "Platform / Social",
  "Spongebob":                          "Sample",
}

const GENRE_COLORS = {
  "Music / Rhythm":    "rgba(205,55,53,0.82)",
  "Action / Arcade":  "rgba(251,146,60,0.82)",
  "Sports":            "rgba(234,179,8,0.82)",
  "Fantasy / Action":  "rgba(168,85,247,0.82)",
  "Simulation":        "rgba(20,184,166,0.82)",
  "FPS / Action":      "rgba(239,68,68,0.65)",
  "Flight Simulator":  "rgba(59,130,246,0.82)",
  "Productivity":      "rgba(34,197,94,0.82)",
  "OS / Platform":     "rgba(99,102,241,0.82)",
  "Platform / Social": "rgba(236,72,153,0.82)",
  "Sample":            "rgba(156,163,175,0.6)",
  "Other":             "rgba(107,114,128,0.6)",
}

function getGenre(app) {
  return GENRE_MAP[app] || "Other"
}

const isStacked = ref(true)
const matrixData = ref(null)

function buildTechGenreMatrix(observations) {
  const techGenre = {}
  const techTotal = {}
  const genreSet = new Set()

  observations.forEach(obs => {
    const app = (obs.Application || "").trim()
    if (!app) return
    const genre = getGenre(app)

    const taskRaw = (obs.Task || "").trim()
    if (!taskRaw) return
    const tasks = taskRaw.split(',').map(t => t.trim()).filter(Boolean)

    tasks.forEach(task => {
      if (!techGenre[task]) techGenre[task] = {}
      techGenre[task][genre] = (techGenre[task][genre] || 0) + 1
      techTotal[task] = (techTotal[task] || 0) + 1
      genreSet.add(genre)
    })
  })

  const techniques = Object.keys(techTotal).sort((a, b) => techTotal[b] - techTotal[a])
  const genres = Array.from(genreSet).sort()

  return { techGenre, techTotal, techniques, genres }
}

function renderFreqChart(matrix, stacked) {
  if (freqChartInstance) { freqChartInstance.destroy(); freqChartInstance = null }

  const { techGenre, techniques, genres } = matrix

  const datasets = genres.map(genre => ({
    label: genre,
    data: techniques.map(t => techGenre[t]?.[genre] || 0),
    backgroundColor: GENRE_COLORS[genre] || "rgba(107,114,128,0.7)",
    borderWidth: stacked ? 0 : 1,
    borderColor: stacked ? undefined : "rgba(255,255,255,0.5)",
  }))

  freqChartInstance = new Chart(freqChart.value, {
    type: "bar",
    data: { labels: techniques, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          labels: { font: { family: "'Work Sans', sans-serif", size: 11 }, boxWidth: 14, padding: 16 },
        },
        tooltip: {
          backgroundColor: "rgba(0,0,0,0.85)",
          padding: 10,
          titleFont: { family: "'Work Sans', sans-serif", size: 13, weight: "bold" },
          bodyFont: { family: "'Work Sans', sans-serif", size: 12 },
          borderColor: "rgba(205,55,53,1)",
          borderWidth: 1,
          mode: "index",
          callbacks: {
            footer: (items) => {
              const total = items.reduce((s, i) => s + (i.parsed.y || 0), 0)
              return `Total: ${total}`
            },
          },
        },
      },
      scales: {
        x: {
          stacked,
          ticks: {
            font: { family: "'Work Sans', sans-serif", size: 10 },
            maxRotation: 45,
            minRotation: 30,
          },
          title: {
            display: true,
            text: "Task",
            font: { family: "'Work Sans', sans-serif", size: 12 },
          },
        },
        y: {
          stacked,
          beginAtZero: true,
          title: {
            display: true,
            text: "Observation Count",
            font: { family: "'Work Sans', sans-serif", size: 12 },
          },
          ticks: { stepSize: 1, font: { family: "'Work Sans', sans-serif" } },
        },
      },
    },
  })
}

function setStacked(val) {
  isStacked.value = val
  if (matrixData.value) renderFreqChart(matrixData.value, val)
}

function cellBg(count, maxCount) {
  if (!count) return "#ffffff"
  const alpha = 0.1 + (count / maxCount) * 0.8
  return `rgba(205,55,53,${alpha.toFixed(2)})`
}

function cellFg(count, maxCount) {
  return (count / maxCount) > 0.6 ? "#ffffff" : "#374151"
}

function heatmaxCount(matrix) {
  return Math.max(...matrix.techniques.flatMap(t => matrix.genres.map(g => matrix.techGenre[t]?.[g] || 0)))
}

const sankeyContainer = ref(null)

function renderActivityTaskSankey(observations) {
  const el = sankeyContainer.value
  if (!el) return

  const width = el.clientWidth || 800
  const height = 520
  const margin = { top: 20, right: 180, bottom: 20, left: 180 }

  d3.select(el).selectAll('*').remove()
  const svg = d3.select(el)
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  // Fixed activity color palette
  const ACTIVITY_COLORS = {
    'Manipulation':    '#CD3735',
    'Locomotion':      '#E98708',
    'System Control':  '#FFCE7B',
    'Activation':      '#a78bfa',
    'Evading':         '#10b981',
    'Creation':        '#3b82f6',
    'Communication':   '#f472b6',
  }
  const ACTIVITY_COLOR_DEFAULT = '#6b7280'
  const TASK_COLOR = 'rgba(107,114,128,0.75)'

  function activityColor(name) {
    return ACTIVITY_COLORS[name] || ACTIVITY_COLOR_DEFAULT
  }

  // Build link map: Activity → Task pair counts
  const linkMap = {}
  observations.forEach(obs => {
    const activities = (obs.Activity || '').split(',').map(a => a.trim()).filter(Boolean)
    const tasks = (obs.Task || '').split(',').map(t => t.trim()).filter(Boolean)
    activities.forEach(act => {
      tasks.forEach(task => {
        const key = `${act}|||${task}`
        linkMap[key] = (linkMap[key] || 0) + 1
      })
    })
  })

  if (Object.keys(linkMap).length === 0) return

  // Collect unique activity and task names
  const activityNames = new Set()
  const taskNames = new Set()
  Object.keys(linkMap).forEach(k => {
    const [a, t] = k.split('|||')
    activityNames.add(a)
    taskNames.add(t)
  })

  // Build prefixed node keys to guarantee no overlap between sides
  // Even if a name appears in both columns, act:X and task:X are distinct nodes
  const rawNodes = []
  const nodeIndexMap = {}

  activityNames.forEach(name => {
    const key = `act:${name}`
    nodeIndexMap[key] = rawNodes.length
    rawNodes.push({ id: key, label: name, isActivity: true })
  })
  taskNames.forEach(name => {
    const key = `task:${name}`
    nodeIndexMap[key] = rawNodes.length
    rawNodes.push({ id: key, label: name, isActivity: false })
  })

  const rawLinks = Object.entries(linkMap).map(([k, v]) => {
    const [a, t] = k.split('|||')
    return {
      source: nodeIndexMap[`act:${a}`],
      target: nodeIndexMap[`task:${t}`],
      value: v,
      activityName: a
    }
  })

  const { nodes: sNodes, links: sLinks } = d3Sankey()
    .nodeWidth(14)
    .nodePadding(12)
    .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]])(
      {
        nodes: rawNodes.map(d => ({ ...d })),
        links: rawLinks.map(d => ({ ...d }))
      }
    )

  // Links
  svg.append('g').selectAll('path')
    .data(sLinks)
    .join('path')
    .attr('d', sankeyLinkHorizontal())
    .attr('fill', 'none')
    .attr('stroke', d => activityColor(d.activityName))
    .attr('stroke-width', d => Math.max(1, d.width))
    .attr('stroke-opacity', 0.3)
    .append('title')
    .text(d => `${d.source.label} → ${d.target.label}: ${d.value}`)

  // Node rectangles
  const nodeG = svg.append('g').selectAll('g').data(sNodes).join('g')
  nodeG.append('rect')
    .attr('x', d => d.x0)
    .attr('y', d => d.y0)
    .attr('width', d => d.x1 - d.x0)
    .attr('height', d => Math.max(1, d.y1 - d.y0))
    .attr('fill', d => d.isActivity ? activityColor(d.label) : TASK_COLOR)

  // Labels: activity nodes → label LEFT of node; task nodes → label RIGHT of node
  nodeG.append('text')
    .attr('x', d => d.isActivity ? d.x0 - 8 : d.x1 + 8)
    .attr('y', d => (d.y0 + d.y1) / 2)
    .attr('dy', '0.35em')
    .attr('text-anchor', d => d.isActivity ? 'end' : 'start')
    .attr('font-family', "'Work Sans', sans-serif")
    .attr('font-size', 11)
    .attr('fill', '#374151')
    .text(d => d.label)
}

onMounted(async () => {
  await store.load()
  renderConvergenceChart(store.observations)
  matrixData.value = buildTechGenreMatrix(store.observations)
  renderFreqChart(matrixData.value, true)
  await nextTick()
  renderActivityTaskSankey(store.observations)
})
</script>

<template>
  <main class="main-content analyses-content">
    <div v-if="store.loading" class="loading-state">Loading…</div>
    <div v-else-if="store.error" class="chart-error">Error: {{ store.error }}</div>
    <template v-else>
      <div class="page-header">
        <h2 class="page-title">Analyses</h2>
        <p class="page-description">
          Visual analyses of interaction technique patterns across applications and observations.
        </p>
      </div>

      <!-- Chart 1: Convergence & Divergence -->
      <div class="viz-card">
        <div class="viz-card-title">Interaction Technique Convergence</div>
        <p class="page-description" style="margin-bottom:1rem;">
          Each bubble is one interaction technique. Horizontal axis = distinct applications using it;
          vertical axis = total observations. Convergent techniques appear on the right.
        </p>
        <div class="canvas-wrapper-tall">
          <canvas ref="convergenceCanvas"></canvas>
        </div>
        <div class="axis-labels">
          <span>← Divergent (unique to one app)</span>
          <span>Convergent (shared across many apps) →</span>
        </div>
        <div class="viz-legend" style="margin-top:1rem;">
          <div class="viz-legend-item">
            <div class="viz-legend-swatch" style="background:rgba(239,68,68,0.75);"></div>
            <span>Divergent — 1 application</span>
          </div>
          <div class="viz-legend-item">
            <div class="viz-legend-swatch" style="background:rgba(251,146,60,0.75);"></div>
            <span>Semi-convergent — 2–3 applications</span>
          </div>
          <div class="viz-legend-item">
            <div class="viz-legend-swatch" style="background:rgba(20,184,166,0.75);"></div>
            <span>Convergent — 4+ applications</span>
          </div>
        </div>
      </div>

      <!-- Chart 2: Technique Frequency by Genre -->
      <div class="viz-card">
        <div class="viz-card-title">Tasks × Genre</div>
        <p class="page-description" style="margin-bottom:1rem;">
          Task frequency broken down by application genre. Reveals which tasks are cross-genre standards and which are genre-specific.
        </p>

        <div class="canvas-wrapper-tall">
          <canvas ref="freqChart"></canvas>
        </div>
      </div>

      <!-- Genre Breakdown Heatmap removed -->

    </template>
  </main>
</template>
