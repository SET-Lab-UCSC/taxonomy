<script setup>
import { ref, onMounted } from 'vue'
import * as d3 from 'd3'
import { useDataStore } from '../stores/data.js'

const store = useDataStore()
const svgContainer = ref(null)
const tooltip = ref(null)
let selectedIndex = ref(null)

const TOP_ACTIONS = 10
const TOP_TECHNIQUES = 12

function splitTrim(val) {
  return (val || '').split(',').map(s => s.trim()).filter(Boolean)
}

function buildChord(observations) {
  // Count frequencies
  const actionFreq = {}
  const techFreq = {}

  observations.forEach(obs => {
    splitTrim(obs.Action).forEach(a => { actionFreq[a] = (actionFreq[a] || 0) + 1 })
    splitTrim(obs.Interaction_Technique).forEach(t => { techFreq[t] = (techFreq[t] || 0) + 1 })
  })

  // Top N by frequency
  const topActions = Object.entries(actionFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, TOP_ACTIONS)
    .map(([k]) => k)

  const topTechs = Object.entries(techFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, TOP_TECHNIQUES)
    .map(([k]) => k)

  const actionSet = new Set(topActions)
  const techSet = new Set(topTechs)

  // Build co-occurrence matrix: [actions..., techs...]
  const nodes = [...topActions, ...topTechs]
  const n = nodes.length
  const matrix = Array.from({ length: n }, () => new Array(n).fill(0))

  observations.forEach(obs => {
    const actions = splitTrim(obs.Action).filter(a => actionSet.has(a))
    const techs = splitTrim(obs.Interaction_Technique).filter(t => techSet.has(t))
    actions.forEach(a => {
      techs.forEach(t => {
        const ai = topActions.indexOf(a)
        const ti = topActions.length + topTechs.indexOf(t)
        if (ai >= 0 && ti >= 0) {
          matrix[ai][ti] += 1
          matrix[ti][ai] += 1
        }
      })
    })
  })

  return { nodes, matrix, nActions: topActions.length }
}

function renderChord(observations) {
  const container = svgContainer.value
  if (!container) return

  const { nodes, matrix, nActions } = buildChord(observations)
  const n = nodes.length

  const width = 680
  const height = 680
  const outerRadius = 280
  const innerRadius = outerRadius - 24

  // Color scales
  const warmScale = d3.scaleSequential(d3.interpolateOranges).domain([-0.5, nActions - 0.5])
  const coolColors = ['#2196F3','#00BCD4','#009688','#3F51B5','#673AB7','#0097A7','#00ACC1','#26C6DA','#4DB6AC','#7986CB','#5C6BC0','#4FC3F7']
  const nodeColor = (i) => i < nActions
    ? d3.interpolateRgb('#FFCE7B', '#CD3735')(i / (nActions - 1))
    : coolColors[(i - nActions) % coolColors.length]

  const svg = d3.select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .style('max-width', '100%')

  const g = svg.append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`)

  // Chord layout
  const chord = d3.chord()
    .padAngle(0.03)
    .sortSubgroups(d3.descending)

  const chords = chord(matrix)

  const arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)

  const ribbon = d3.ribbon()
    .radius(innerRadius - 2)

  // Groups
  const group = g.append('g')
    .selectAll('g')
    .data(chords.groups)
    .join('g')
    .attr('class', 'chord-group')

  group.append('path')
    .attr('class', 'arc')
    .attr('d', arc)
    .attr('fill', d => nodeColor(d.index))
    .attr('stroke', d => d3.color(nodeColor(d.index)).darker(0.4))
    .style('cursor', 'pointer')
    .on('mouseover', function(event, d) {
      // Dim all chords, highlight this group's
      g.selectAll('.chord path')
        .style('opacity', cd => (cd.source.index === d.index || cd.target.index === d.index) ? 0.85 : 0.08)
      d3.select(this).attr('stroke-width', 2)

      const total = d3.sum(matrix[d.index])
      showTooltip(event, `<strong>${nodes[d.index]}</strong><br/>Total co-occurrences: ${total}`)
    })
    .on('mousemove', (event) => moveTooltip(event))
    .on('mouseout', function() {
      g.selectAll('.chord path').style('opacity', 0.7)
      d3.select(this).attr('stroke-width', null)
      hideTooltip()
    })
    .on('click', function(event, d) {
      if (selectedIndex.value === d.index) {
        selectedIndex.value = null
        g.selectAll('.chord path').style('opacity', 0.7)
      } else {
        selectedIndex.value = d.index
        g.selectAll('.chord path')
          .style('opacity', cd => (cd.source.index === d.index || cd.target.index === d.index) ? 0.9 : 0.05)
      }
    })

  // Tick labels
  group.each(function(d) {
    const angle = (d.startAngle + d.endAngle) / 2
    const rotate = (angle * 180 / Math.PI) - 90
    const labelR = outerRadius + 10
    const x = Math.cos(angle - Math.PI / 2) * labelR
    const y = Math.sin(angle - Math.PI / 2) * labelR
    const anchor = angle > Math.PI ? 'end' : 'start'
    const flipAngle = angle > Math.PI ? rotate + 180 : rotate

    d3.select(this).append('text')
      .attr('transform', `translate(${x}, ${y}) rotate(${flipAngle})`)
      .attr('text-anchor', anchor)
      .attr('alignment-baseline', 'middle')
      .style('font-size', '10px')
      .style('font-family', 'Work Sans, sans-serif')
      .style('fill', '#374151')
      .style('pointer-events', 'none')
      .text(() => {
        const label = nodes[d.index]
        return label.length > 22 ? label.slice(0, 20) + '…' : label
      })
  })

  // Legend dots for type
  group.append('title').text(d => nodes[d.index])

  // Chords
  const chordPaths = g.append('g')
    .attr('class', 'chord')
    .selectAll('path')
    .data(chords)
    .join('path')
    .attr('d', ribbon)
    .attr('fill', d => nodeColor(d.source.index))
    .attr('stroke', d => d3.color(nodeColor(d.source.index)).darker(0.3))
    .style('opacity', 0.7)
    .style('mix-blend-mode', 'multiply')
    .style('cursor', 'pointer')
    .on('mouseover', function(event, d) {
      d3.select(this).style('opacity', 1)
      const count = matrix[d.source.index][d.target.index]
      showTooltip(event, `<strong>${nodes[d.source.index]}</strong> ↔ <strong>${nodes[d.target.index]}</strong><br/>Co-occurrences: ${count}`)
    })
    .on('mousemove', (event) => moveTooltip(event))
    .on('mouseout', function() {
      d3.select(this).style('opacity', 0.7)
      hideTooltip()
    })

  // Legend
  const legend = g.append('g').attr('transform', `translate(${-outerRadius - 10}, ${outerRadius + 20})`)

  legend.append('rect').attr('width', 14).attr('height', 14).attr('fill', '#FFCE7B').attr('rx', 2)
  legend.append('text').attr('x', 18).attr('y', 11).style('font-size', '11px').style('fill', '#374151').text('Action Primitives')

  legend.append('rect').attr('x', 140).attr('width', 14).attr('height', 14).attr('fill', '#2196F3').attr('rx', 2)
  legend.append('text').attr('x', 158).attr('y', 11).style('font-size', '11px').style('fill', '#374151').text('Interaction Techniques')
}

function showTooltip(event, html) {
  const tip = tooltip.value
  if (!tip) return
  tip.innerHTML = html
  tip.style.display = 'block'
  moveTooltip(event)
}

function moveTooltip(event) {
  const tip = tooltip.value
  if (!tip) return
  tip.style.left = (event.pageX + 14) + 'px'
  tip.style.top = (event.pageY - 28) + 'px'
}

function hideTooltip() {
  const tip = tooltip.value
  if (tip) tip.style.display = 'none'
}

onMounted(async () => {
  await store.load()
  renderChord(store.observations)
})
</script>

<template>
  <div class="main-content">
    <h1 class="page-title">Action–Technique Chord Diagram</h1>
    <p class="page-description">
      Each segment of the circle represents either a physical Action primitive (Controller Pose, Trigger,
      Grip, etc.) or an Interaction Technique. Chords connect Actions to the Techniques that use them —
      chord thickness represents observation count. This makes visible which inputs are shared across many
      techniques (indicating standardization) and which belong exclusively to unique techniques (indicating
      design specialization).
    </p>

    <div class="viz-card">
      <h2 class="viz-card-title">Co-occurrence Matrix</h2>
      <p v-if="store.loading" style="text-align:center; color:#6b7280; padding: 2rem;">Loading data…</p>
      <p v-else-if="store.error" style="text-align:center; color:#ef4444; padding: 2rem;">Error: {{ store.error }}</p>
      <div v-else class="chord-wrapper" ref="svgContainer"></div>
    </div>

    <!-- Tooltip (fixed-position, outside card) -->
    <div ref="tooltip" class="chord-tooltip"></div>
  </div>
</template>

<style scoped>
.chord-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 1rem 3rem;
  overflow: visible;
}

.chord-wrapper svg {
  overflow: visible;
}

.chord-tooltip {
  position: fixed;
  display: none;
  background: rgba(17, 24, 39, 0.92);
  color: #f9fafb;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-family: 'Work Sans', sans-serif;
  pointer-events: none;
  z-index: 9999;
  max-width: 240px;
  line-height: 1.5;
  box-shadow: 0 4px 12px rgba(0,0,0,0.25);
}
</style>
