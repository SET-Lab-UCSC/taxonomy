<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useDataStore } from '../stores/data.js'

const store = useDataStore()
const svgContainer = ref(null)
const tooltip = ref(null)
const tooltipData = ref(null)
const tooltipX = ref(0)
const tooltipY = ref(0)

// ── Embodiment Score ────────────────────────────────────────────────────────

function computeScore(obs) {
  const actionRaw = (obs.Action || '').trim()
  const actions = actionRaw ? actionRaw.split(',').map(s => s.trim()).filter(Boolean) : []
  const actionScore = actions.length

  const handedness = (obs.Handedness || '').trim().toLowerCase()
  let handednessBonus = 0
  if (handedness.includes('both')) handednessBonus = 2
  else if (handedness.includes('dominant') || handedness.includes('non-dominant')) handednessBonus = 1

  const multiAction = (obs.Multi_Action || '').trim()
  const multiActionBonus = multiAction ? 2 : 0

  return {
    actionScore,
    handednessBonus,
    multiActionBonus,
    total: actionScore + handednessBonus + multiActionBonus,
    actions,
  }
}

// ── Color scale for Applications ────────────────────────────────────────────

const PALETTE = [
  '#e6194b','#3cb44b','#4363d8','#f58231','#911eb4',
  '#42d4f4','#f032e6','#bfef45','#fabed4','#469990',
  '#dcbeff','#9a6324','#fffac8','#800000','#aaffc3',
  '#808000','#ffd8b1','#000075','#a9a9a9','#000000',
]

let appColorMap = {}

function getAppColor(app) {
  return appColorMap[app] || '#999'
}

// ── Jitter ──────────────────────────────────────────────────────────────────

function seededRandom(seed) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

// ── Render ──────────────────────────────────────────────────────────────────

function render() {
  if (!svgContainer.value) return
  const container = svgContainer.value
  container.innerHTML = ''

  const observations = store.observations
  if (!observations.length) return

  // Compute scores
  const scored = observations.map((obs, i) => ({
    obs,
    ...computeScore(obs),
    idx: i,
  }))

  // Build app color map
  const apps = [...new Set(observations.map(o => (o.Application || '').trim()).filter(Boolean))].sort()
  appColorMap = {}
  apps.forEach((app, i) => { appColorMap[app] = PALETTE[i % PALETTE.length] })

  const maxScore = Math.max(...scored.map(s => s.total), 1)

  // Layout
  const margin = { top: 30, right: 40, bottom: 60, left: 60 }
  const width = container.clientWidth || 900
  const svgWidth = width
  const svgHeight = 340
  const innerW = svgWidth - margin.left - margin.right
  const innerH = svgHeight - margin.top - margin.bottom

  const R = 6
  const JITTER_H = innerH * 0.8

  // X scale: linear 0 → maxScore
  const xScale = (v) => (v / maxScore) * innerW

  // Group by score for jitter
  const byScore = {}
  scored.forEach(d => {
    const k = d.total
    if (!byScore[k]) byScore[k] = []
    byScore[k].push(d)
  })

  // Assign jittered Y positions
  const rng = seededRandom(42)
  scored.forEach(d => {
    const group = byScore[d.total]
    const idx = group.indexOf(d)
    const count = group.length
    // Pack vertically: stack in rows if many
    const cols = Math.ceil(Math.sqrt(count * 2))
    const row = Math.floor(idx / cols)
    const col = idx % cols
    const cellW = (R * 2 + 2)
    const cellH = (R * 2 + 2)
    const startX = -(Math.min(count, cols) * cellW) / 2
    const startY = -(Math.ceil(count / cols) * cellH) / 2

    // fallback to pure jitter if group is small
    if (count <= 8) {
      d.jx = (rng() - 0.5) * 10
      d.jy = (rng() - 0.5) * JITTER_H
    } else {
      d.jx = startX + col * cellW + cellW / 2
      d.jy = startY + row * cellH + cellH / 2
    }
  })

  // SVG
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', svgWidth)
  svg.setAttribute('height', svgHeight)
  svg.style.display = 'block'

  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  g.setAttribute('transform', `translate(${margin.left},${margin.top})`)
  svg.appendChild(g)

  // Gridlines + X axis ticks
  for (let v = 0; v <= maxScore; v++) {
    const x = xScale(v)

    // gridline
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    line.setAttribute('x1', x)
    line.setAttribute('x2', x)
    line.setAttribute('y1', 0)
    line.setAttribute('y2', innerH)
    line.setAttribute('stroke', '#e5e7eb')
    line.setAttribute('stroke-width', '1')
    g.appendChild(line)

    // tick label
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    label.setAttribute('x', x)
    label.setAttribute('y', innerH + 20)
    label.setAttribute('text-anchor', 'middle')
    label.setAttribute('font-size', '12')
    label.setAttribute('fill', '#6b7280')
    label.textContent = v
    g.appendChild(label)
  }

  // X axis line
  const axisLine = document.createElementNS('http://www.w3.org/2000/svg', 'line')
  axisLine.setAttribute('x1', 0)
  axisLine.setAttribute('x2', innerW)
  axisLine.setAttribute('y1', innerH)
  axisLine.setAttribute('y2', innerH)
  axisLine.setAttribute('stroke', '#9ca3af')
  axisLine.setAttribute('stroke-width', '1.5')
  g.appendChild(axisLine)

  // X axis label
  const axisLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text')
  axisLabel.setAttribute('x', innerW / 2)
  axisLabel.setAttribute('y', innerH + 48)
  axisLabel.setAttribute('text-anchor', 'middle')
  axisLabel.setAttribute('font-size', '13')
  axisLabel.setAttribute('fill', '#374151')
  axisLabel.setAttribute('font-weight', '600')
  axisLabel.textContent = '← Minimal Embodiment   Embodiment Score   Maximal Embodiment →'
  g.appendChild(axisLabel)

  // Dots
  const cy = innerH / 2
  scored.forEach((d) => {
    const cx = xScale(d.total) + d.jx
    const dotCy = cy + d.jy

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    circle.setAttribute('cx', cx)
    circle.setAttribute('cy', dotCy)
    circle.setAttribute('r', R)
    circle.setAttribute('fill', getAppColor((d.obs.Application || '').trim()))
    circle.setAttribute('fill-opacity', '0.8')
    circle.setAttribute('stroke', 'white')
    circle.setAttribute('stroke-width', '1')
    circle.style.cursor = 'pointer'
    circle.style.transition = 'r 0.1s, fill-opacity 0.1s'

    circle.addEventListener('mouseenter', (e) => {
      circle.setAttribute('r', R + 3)
      circle.setAttribute('fill-opacity', '1')
      tooltipData.value = d
      const rect = svgContainer.value.getBoundingClientRect()
      tooltipX.value = e.clientX - rect.left + 12
      tooltipY.value = e.clientY - rect.top - 10
    })
    circle.addEventListener('mousemove', (e) => {
      const rect = svgContainer.value.getBoundingClientRect()
      tooltipX.value = e.clientX - rect.left + 12
      tooltipY.value = e.clientY - rect.top - 10
    })
    circle.addEventListener('mouseleave', () => {
      circle.setAttribute('r', R)
      circle.setAttribute('fill-opacity', '0.8')
      tooltipData.value = null
    })

    g.appendChild(circle)
  })

  container.appendChild(svg)
}

// ── Lifecycle ────────────────────────────────────────────────────────────────

let resizeObserver = null

onMounted(async () => {
  await store.load()
  render()
  resizeObserver = new ResizeObserver(() => render())
  if (svgContainer.value) resizeObserver.observe(svgContainer.value)
})

onBeforeUnmount(() => {
  if (resizeObserver) resizeObserver.disconnect()
})

// ── Legend ───────────────────────────────────────────────────────────────────

function legendEntries() {
  const apps = [...new Set(store.observations.map(o => (o.Application || '').trim()).filter(Boolean))].sort()
  return apps.map(app => ({ app, color: appColorMap[app] || '#999' }))
}
</script>

<template>
  <div class="main-content">
    <h1 class="page-title">Embodiment Spectrum</h1>
    <p class="page-description">
      This chart plots every observation from minimal physical complexity (single button press)
      to maximum (full-body bimanual multi-action sequences). It makes visible the paper's claim
      that mainstream VR has converged on low-embodiment interactions, while edge-case applications
      push the frontier of embodied interaction design.
    </p>

    <div class="viz-card" style="margin-top: 2rem; position: relative;">
      <h2 class="viz-card-title">Embodiment Score Distribution</h2>
      <p style="font-size:0.85rem; color:#6b7280; margin-bottom:1rem;">
        Score = Actions + Handedness bonus (Both=2, One hand=1) + Multi-action bonus (2 if present)
      </p>

      <div ref="svgContainer" style="width:100%; overflow:hidden; position:relative;"></div>

      <!-- Tooltip -->
      <div
        v-if="tooltipData"
        :style="{
          position: 'absolute',
          left: tooltipX + 'px',
          top: tooltipY + 'px',
          background: 'rgba(17,24,39,0.95)',
          color: 'white',
          padding: '10px 14px',
          borderRadius: '8px',
          fontSize: '13px',
          pointerEvents: 'none',
          maxWidth: '260px',
          zIndex: 100,
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          lineHeight: '1.6',
        }"
      >
        <div style="font-weight:700; margin-bottom:4px;">{{ tooltipData.obs.Title }}</div>
        <div style="color:#d1d5db;">{{ tooltipData.obs.Application }}</div>
        <div style="color:#9ca3af; font-size:12px; margin-top:4px;">
          {{ tooltipData.obs.Interaction_Technique }}
        </div>
        <div style="margin-top:8px; border-top:1px solid #374151; padding-top:6px; font-size:12px; color:#d1d5db;">
          <div>Actions: {{ tooltipData.actionScore }} ({{ tooltipData.actions.join(', ') || '—' }})</div>
          <div>Handedness bonus: {{ tooltipData.handednessBonus }} ({{ tooltipData.obs.Handedness || '—' }})</div>
          <div>Multi-action bonus: {{ tooltipData.multiActionBonus }} ({{ tooltipData.obs.Multi_Action || 'none' }})</div>
          <div style="font-weight:700; color:#f97316; margin-top:4px;">Total score: {{ tooltipData.total }}</div>
        </div>
      </div>
    </div>

    <!-- Legend -->
    <div class="viz-card" style="margin-top:1.5rem;">
      <h2 class="viz-card-title">Applications</h2>
      <div style="display:flex; flex-wrap:wrap; gap:0.5rem 1.5rem; margin-top:0.75rem;">
        <div
          v-for="entry in legendEntries()"
          :key="entry.app"
          style="display:flex; align-items:center; gap:6px; font-size:13px; color:#374151;"
        >
          <span :style="{ display:'inline-block', width:'12px', height:'12px', borderRadius:'50%', background: entry.color, flexShrink:0 }"></span>
          {{ entry.app }}
        </div>
      </div>
    </div>

    <!-- Loading / Error -->
    <div v-if="store.loading" style="padding:2rem; text-align:center; color:#6b7280;">
      Loading observations…
    </div>
    <div v-if="store.error" style="padding:2rem; text-align:center; color:#ef4444;">
      Error: {{ store.error }}
    </div>
  </div>
</template>
