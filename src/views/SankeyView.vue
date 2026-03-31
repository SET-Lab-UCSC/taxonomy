<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as d3 from 'd3'
import { sankey, sankeyLinkHorizontal } from 'd3-sankey'
import { useDataStore } from '../stores/data.js'

const store = useDataStore()
const svgRef = ref(null)
const containerRef = ref(null)

// Tooltip state
const tooltip = ref({ visible: false, x: 0, y: 0, source: '', target: '', count: 0 })

let resizeObserver = null

// ── Warm palette spanning #FFCE7B → #E98708 → #CD3735 ─────────────────────
const WARM_PALETTE = [
  '#FFCE7B', '#F5B84A', '#EFA425', '#E98708',
  '#E07010', '#D85A18', '#D04020', '#CD3735',
  '#C42E2E', '#BC2828', '#A82222', '#9A1D1D',
  '#8B1818', '#7D1414', '#6F1010', '#620C0C',
]

function buildSankeyData(observations) {
  // Collect co-occurrences: Activity → Task, Task → Interaction_Technique
  const actTaskCounts = {}
  const taskTechCounts = {}

  const activityCounts = {}
  const taskCounts = {}
  const techCounts = {}

  observations.forEach(obs => {
    const activities = (obs.Activity || '').split(',').map(s => s.trim()).filter(Boolean)
    const tasks = (obs.Task || '').split(',').map(s => s.trim()).filter(Boolean)
    const techs = (obs.Interaction_Technique || '').split(',').map(s => s.trim()).filter(Boolean)

    activities.forEach(a => { activityCounts[a] = (activityCounts[a] || 0) + 1 })
    tasks.forEach(t => { taskCounts[t] = (taskCounts[t] || 0) + 1 })
    techs.forEach(t => { techCounts[t] = (techCounts[t] || 0) + 1 })

    // Activity × Task links
    activities.forEach(a => {
      tasks.forEach(t => {
        const key = `${a}|||${t}`
        actTaskCounts[key] = (actTaskCounts[key] || 0) + 1
      })
    })

    // Task × Technique links
    tasks.forEach(t => {
      techs.forEach(tech => {
        const key = `${t}|||${tech}`
        taskTechCounts[key] = (taskTechCounts[key] || 0) + 1
      })
    })
  })

  // Sort by count descending
  const activities = Object.keys(activityCounts).sort((a, b) => activityCounts[b] - activityCounts[a])
  const tasks = Object.keys(taskCounts).sort((a, b) => taskCounts[b] - taskCounts[a])
  const techs = Object.keys(techCounts).sort((a, b) => techCounts[b] - techCounts[a])

  // Build node list & index map
  const nodes = []
  const nodeIndex = {}

  function addNode(name, col) {
    const key = `${col}:${name}`
    if (!(key in nodeIndex)) {
      nodeIndex[key] = nodes.length
      nodes.push({ name, col })
    }
    return nodeIndex[key]
  }

  activities.forEach(a => addNode(a, 0))
  tasks.forEach(t => addNode(t, 1))
  techs.forEach(t => addNode(t, 2))

  // Build links
  const links = []

  Object.entries(actTaskCounts).forEach(([key, value]) => {
    const [src, tgt] = key.split('|||')
    const srcIdx = nodeIndex[`0:${src}`]
    const tgtIdx = nodeIndex[`1:${tgt}`]
    if (srcIdx !== undefined && tgtIdx !== undefined) {
      links.push({ source: srcIdx, target: tgtIdx, value })
    }
  })

  Object.entries(taskTechCounts).forEach(([key, value]) => {
    const [src, tgt] = key.split('|||')
    const srcIdx = nodeIndex[`1:${src}`]
    const tgtIdx = nodeIndex[`2:${tgt}`]
    if (srcIdx !== undefined && tgtIdx !== undefined) {
      links.push({ source: srcIdx, target: tgtIdx, value })
    }
  })

  return { nodes, links, activities }
}

function renderSankey() {
  if (!svgRef.value || !containerRef.value) return
  const obs = store.observations
  if (!obs.length) return

  const { nodes: rawNodes, links: rawLinks, activities } = buildSankeyData(obs)
  if (!rawNodes.length || !rawLinks.length) return

  // Dimensions
  const W = Math.max(containerRef.value.offsetWidth || 900, 700)
  const H = Math.max(W * 0.65, 500)
  const margin = { top: 24, right: 180, bottom: 24, left: 180 }

  // Color scale for activities
  const actColorScale = d3.scaleOrdinal()
    .domain(activities)
    .range(
      activities.map((_, i) =>
        WARM_PALETTE[Math.round((i / Math.max(activities.length - 1, 1)) * (WARM_PALETTE.length - 1))]
      )
    )

  // Clear existing SVG content
  const svg = d3.select(svgRef.value)
  svg.selectAll('*').remove()
  svg
    .attr('width', W)
    .attr('height', H)
    .attr('viewBox', `0 0 ${W} ${H}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('max-width', '100%')

  // Build sankey layout
  const sankeyLayout = sankey()
    .nodeId(d => d.index)
    .nodeWidth(16)
    .nodePadding(10)
    .extent([[margin.left, margin.top], [W - margin.right, H - margin.bottom]])

  // Deep copy to avoid mutation issues
  const graph = sankeyLayout({
    nodes: rawNodes.map(d => ({ ...d })),
    links: rawLinks.map(d => ({ ...d })),
  })

  // Map activity → color; propagate through links
  function nodeColor(node) {
    if (node.col === 0) return actColorScale(node.name)
    if (node.col === 1) {
      // Blend source activity colors weighted by link value
      const srcLinks = graph.links.filter(l => l.target.index === node.index)
      if (!srcLinks.length) return '#aaa'
      const total = srcLinks.reduce((s, l) => s + l.value, 0)
      // Use the dominant source color
      const dominant = srcLinks.reduce((a, b) => a.value > b.value ? a : b)
      return dominant.source.col === 0
        ? actColorScale(dominant.source.name)
        : nodeColor(dominant.source)
    }
    // col === 2: use dominant Task's color
    const srcLinks = graph.links.filter(l => l.target.index === node.index)
    if (!srcLinks.length) return '#aaa'
    const dominant = srcLinks.reduce((a, b) => a.value > b.value ? a : b)
    return nodeColor(dominant.source)
  }

  function linkColor(link) {
    const srcNode = link.source
    const color = srcNode.col === 0
      ? actColorScale(srcNode.name)
      : nodeColor(srcNode)
    return color
  }

  const g = svg.append('g')

  // Draw links
  g.append('g')
    .attr('fill', 'none')
    .selectAll('path')
    .data(graph.links)
    .join('path')
    .attr('d', sankeyLinkHorizontal())
    .attr('stroke', d => linkColor(d))
    .attr('stroke-width', d => Math.max(1, d.width))
    .attr('stroke-opacity', 0.45)
    .attr('class', 'sankey-link')
    .on('mousemove', function (event, d) {
      const rect = containerRef.value.getBoundingClientRect()
      tooltip.value = {
        visible: true,
        x: event.clientX - rect.left + 12,
        y: event.clientY - rect.top - 28,
        source: d.source.name,
        target: d.target.name,
        count: d.value,
      }
      d3.select(this).attr('stroke-opacity', 0.8)
    })
    .on('mouseleave', function () {
      tooltip.value.visible = false
      d3.select(this).attr('stroke-opacity', 0.45)
    })

  // Draw nodes
  const nodeG = g.append('g')
    .selectAll('rect')
    .data(graph.nodes)
    .join('rect')
    .attr('x', d => d.x0)
    .attr('y', d => d.y0)
    .attr('width', d => d.x1 - d.x0)
    .attr('height', d => Math.max(1, d.y1 - d.y0))
    .attr('fill', d => nodeColor(d))
    .attr('opacity', 0.9)
    .attr('rx', 3)

  // Node labels
  g.append('g')
    .style('font-family', "'Work Sans', sans-serif")
    .style('font-size', '11px')
    .style('fill', '#374151')
    .selectAll('text')
    .data(graph.nodes)
    .join('text')
    .attr('x', d => d.x0 < W / 2 ? d.x1 + 6 : d.x0 - 6)
    .attr('y', d => (d.y1 + d.y0) / 2)
    .attr('dy', '0.35em')
    .attr('text-anchor', d => d.x0 < W / 2 ? 'start' : 'end')
    .text(d => d.name)
    .each(function (d) {
      // Truncate label if node is too small
      const available = Math.max(d.y1 - d.y0, 8)
      const self = d3.select(this)
      let text = d.name
      if (available < 14) {
        self.text('')
      }
    })

  // Column headers
  const colLabels = [
    { x: margin.left + 8, label: 'Activity' },
    { x: W / 2, label: 'Task' },
    { x: W - margin.right - 8, label: 'Interaction Technique' },
  ]
  const headerG = svg.append('g')
    .style('font-family', "'Work Sans', sans-serif")
    .style('font-size', '13px')
    .style('font-weight', '600')
    .style('fill', '#CD3735')

  colLabels.forEach(({ x, label }, i) => {
    headerG.append('text')
      .attr('x', i === 2 ? x + 8 : x)
      .attr('y', margin.top - 8)
      .attr('text-anchor', i === 0 ? 'start' : i === 2 ? 'end' : 'middle')
      .text(label)
  })
}

onMounted(async () => {
  await store.load()
  renderSankey()

  resizeObserver = new ResizeObserver(() => {
    renderSankey()
  })
  if (containerRef.value) resizeObserver.observe(containerRef.value)
})

onBeforeUnmount(() => {
  if (resizeObserver) resizeObserver.disconnect()
})
</script>

<template>
  <main class="main-content">
    <div class="page-header">
      <h2 class="page-title">Interaction Taxonomy Flow</h2>
      <p class="page-description">
        This Sankey diagram traces the pipeline from <strong>Activity</strong> (what users are doing)
        through <strong>Task</strong> (the specific action required) to <strong>Interaction Technique</strong>
        (how they physically do it). Flow width encodes co-occurrence frequency — fatter bands mean more
        observations share that pairing. The diagram reveals how different Activities funnel into shared
        Techniques (convergence), which Tasks are central hubs, and which Techniques form a long tail
        of rare but purposeful interactions.
      </p>
    </div>

    <div v-if="store.loading" class="loading-state">Loading data…</div>
    <div v-else-if="store.error" class="chart-error">Error: {{ store.error }}</div>

    <div v-else class="viz-card sankey-card">
      <div class="viz-card-title">Activity → Task → Interaction Technique</div>

      <div class="sankey-container" ref="containerRef">
        <svg ref="svgRef" class="sankey-svg"></svg>

        <!-- Tooltip -->
        <div
          v-if="tooltip.visible"
          class="sankey-tooltip"
          :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
        >
          <div class="tooltip-row">
            <span class="tooltip-label">From:</span>
            <span class="tooltip-value">{{ tooltip.source }}</span>
          </div>
          <div class="tooltip-row">
            <span class="tooltip-label">To:</span>
            <span class="tooltip-value">{{ tooltip.target }}</span>
          </div>
          <div class="tooltip-row">
            <span class="tooltip-label">Count:</span>
            <span class="tooltip-value tooltip-count">{{ tooltip.count }}</span>
          </div>
        </div>
      </div>

      <p class="sankey-hint">Hover over a flow to see the connection details.</p>
    </div>
  </main>
</template>

<style scoped>
.page-header {
  margin-bottom: 2rem;
}

.sankey-card {
  overflow: visible;
}

.sankey-container {
  position: relative;
  width: 100%;
  min-height: 500px;
}

.sankey-svg {
  display: block;
  width: 100%;
  height: auto;
}

.sankey-hint {
  margin-top: 0.75rem;
  font-size: 0.8rem;
  color: #9ca3af;
  text-align: center;
}

.sankey-tooltip {
  position: absolute;
  background: rgba(0, 0, 0, 0.88);
  color: #fff;
  border: 1px solid #CD3735;
  border-radius: 8px;
  padding: 10px 14px;
  pointer-events: none;
  font-family: 'Work Sans', sans-serif;
  font-size: 0.8rem;
  z-index: 100;
  min-width: 160px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.tooltip-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2px;
}

.tooltip-label {
  color: #9ca3af;
  min-width: 46px;
}

.tooltip-value {
  color: #f3f4f6;
  font-weight: 500;
}

.tooltip-count {
  color: #FFCE7B;
  font-weight: 700;
}

.loading-state {
  text-align: center;
  padding: 4rem;
  color: #6b7280;
  font-size: 1rem;
}

.chart-error {
  color: #CD3735;
  padding: 2rem;
  text-align: center;
}
</style>
