<template>
  <div class="main-content">
    <h1 class="page-title">Technique Adoption Landscape</h1>
    <p class="page-description">
      Each circle represents either an application or an interaction technique. Lines connect
      applications to the techniques they use — line thickness shows how many observations share
      that connection. Techniques used by many applications appear as dense hubs, while
      application-specific techniques float at the periphery. This makes visible the paper's
      convergence finding: a small set of techniques have become the universal vocabulary of VR
      interaction.
    </p>

    <div class="viz-card">
      <div class="bipartite-controls">
        <h2 class="viz-card-title">Application ↔ Technique Network</h2>
        <button class="btn btn-outline layout-toggle" @click="toggleLayout">
          {{ isBipartite ? 'Switch to Organic' : 'Switch to Bipartite Layout' }}
        </button>
      </div>

      <div class="legend-row">
        <div class="legend-section">
          <span class="legend-label">Applications (by genre):</span>
          <div class="legend-items">
            <div v-for="(color, genre) in GENRE_COLORS" :key="genre" class="legend-item">
              <span class="legend-dot" :style="{ background: color }"></span>
              <span>{{ genre }}</span>
            </div>
          </div>
        </div>
        <div class="legend-section">
          <span class="legend-label">Techniques (by frequency):</span>
          <div class="legend-items">
            <div class="legend-item">
              <span class="legend-dot" style="background: rgba(205,55,53,0.3)"></span>
              <span>Rare</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot" style="background: rgba(205,55,53,0.65)"></span>
              <span>Common</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot" style="background: rgba(205,55,53,1.0)"></span>
              <span>Frequent</span>
            </div>
          </div>
        </div>
      </div>

      <div ref="svgContainer" class="svg-container">
        <svg ref="svgEl" :width="width" :height="height"></svg>
        <div ref="tooltipEl" class="network-tooltip" v-show="tooltip.visible"
          :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }">
          <div class="tooltip-title">{{ tooltip.title }}</div>
          <div class="tooltip-meta">{{ tooltip.meta }}</div>
          <div class="tooltip-list" v-if="tooltip.list.length">
            <div v-for="item in tooltip.list" :key="item" class="tooltip-list-item">{{ item }}</div>
          </div>
        </div>
      </div>

      <div v-if="store.loading" class="loading-overlay">Loading data…</div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useDataStore } from '../stores/data.js'
import * as d3 from 'd3'

// ── Constants ────────────────────────────────────────────────────────────────

const APP_GENRE = {
  'Beat Saber': 'Game',
  'VTOL VR': 'Simulation',
  'Half Life: Alyx': 'Game',
  'ShapesXR': 'Productivity',
  'Archery Pro': 'Game',
  'Roblox': 'Game',
  'Forever Pets': 'Game',
  'War of Wizards': 'Game',
  'Detective VR Demo': 'Experience',
  'Artemis VR Demo': 'Education',
  'Tennis Esports': 'Game',
  'Ironstrike': 'Game',
  'Gorilla Tag': 'Game',
  'The Underpresents': 'Experience',
  'Human Anatomy': 'Education',
  'Meta Quest 3: Home': 'System',
  'Tilt Brush VR': 'Creativity',
}

const GENRE_COLORS = {
  Game: 'rgba(205,55,53,0.8)',
  Simulation: 'rgba(59,130,246,0.8)',
  Productivity: 'rgba(34,197,94,0.8)',
  Experience: 'rgba(168,85,247,0.8)',
  Education: 'rgba(251,146,60,0.8)',
  System: 'rgba(99,102,241,0.8)',
  Creativity: 'rgba(20,184,166,0.8)',
}

// ── Refs ─────────────────────────────────────────────────────────────────────

const store = useDataStore()
const svgContainer = ref(null)
const svgEl = ref(null)
const tooltipEl = ref(null)

const width = ref(900)
const height = 600
const isBipartite = ref(false)

const tooltip = reactive({
  visible: false,
  x: 0,
  y: 0,
  title: '',
  meta: '',
  list: [],
})

let simulation = null
let svg = null

// ── Build graph ───────────────────────────────────────────────────────────────

function buildGraph(observations) {
  // Count app observations
  const appCount = {}
  const techCount = {}
  const linkCount = {} // key: `${app}||${tech}`

  for (const obs of observations) {
    const app = (obs.Application || '').trim()
    if (!app) continue
    const techRaw = (obs.Interaction_Technique || '').trim()
    if (!techRaw) continue

    const techs = techRaw.split(',').map(t => t.trim()).filter(Boolean)
    appCount[app] = (appCount[app] || 0) + 1

    for (const tech of techs) {
      techCount[tech] = (techCount[tech] || 0) + 1
      const key = `${app}||${tech}`
      linkCount[key] = (linkCount[key] || 0) + 1
    }
  }

  const maxTech = Math.max(...Object.values(techCount), 1)

  // Nodes
  const nodes = []
  const nodeById = {}

  for (const [app, count] of Object.entries(appCount)) {
    const node = {
      id: `app:${app}`,
      type: 'app',
      name: app,
      count,
      r: Math.max(8, Math.sqrt(count) * 5),
      genre: APP_GENRE[app] || 'Game',
    }
    nodes.push(node)
    nodeById[node.id] = node
  }

  for (const [tech, count] of Object.entries(techCount)) {
    const node = {
      id: `tech:${tech}`,
      type: 'technique',
      name: tech,
      count,
      r: Math.max(10, Math.sqrt(count) * 4),
      freq: count / maxTech,
    }
    nodes.push(node)
    nodeById[node.id] = node
  }

  // Links
  const links = []
  for (const [key, count] of Object.entries(linkCount)) {
    const [app, tech] = key.split('||')
    const source = `app:${app}`
    const target = `tech:${tech}`
    if (nodeById[source] && nodeById[target]) {
      links.push({ source, target, count })
    }
  }

  return { nodes, links, nodeById }
}

// ── Color helpers ─────────────────────────────────────────────────────────────

function techColor(freq) {
  // More frequent = darker/more saturated red
  const alpha = 0.25 + freq * 0.75
  return `rgba(205,55,53,${alpha.toFixed(2)})`
}

function linkStrokeWidth(count) {
  return Math.min(6, 1 + (count - 1) * 0.8)
}

// ── D3 Render ─────────────────────────────────────────────────────────────────

function render(nodes, links) {
  const w = width.value
  const h = height

  svg = d3.select(svgEl.value)
  svg.selectAll('*').remove()

  svg.attr('width', w).attr('height', h)

  // Arrow / defs (unused but nice placeholder)
  const defs = svg.append('defs')

  // Zoom layer
  const g = svg.append('g')

  svg.call(
    d3.zoom()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
      })
  )

  // Links
  const link = g.append('g').attr('class', 'links')
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('stroke', '#cd3735')
    .attr('stroke-opacity', 0.5)
    .attr('stroke-width', d => linkStrokeWidth(d.count))

  // App nodes
  const appNodes = nodes.filter(d => d.type === 'app')
  const techNodes = nodes.filter(d => d.type === 'technique')

  // Node groups
  const appGroup = g.append('g').attr('class', 'app-nodes')
    .selectAll('g')
    .data(appNodes)
    .join('g')
    .attr('class', 'node-app')
    .style('cursor', 'grab')
    .call(drag(simulation))
    .on('mouseenter', (event, d) => onHover(event, d, links, nodes))
    .on('mouseleave', () => onLeave(link, appGroup, techGroup))

  appGroup.append('circle')
    .attr('r', d => d.r)
    .attr('fill', d => GENRE_COLORS[d.genre] || GENRE_COLORS.Game)
    .attr('stroke', '#fff')
    .attr('stroke-width', 1.5)

  // App label (on hover only via opacity)
  appGroup.append('text')
    .attr('class', 'app-label')
    .attr('dy', d => -(d.r + 4))
    .attr('text-anchor', 'middle')
    .attr('font-size', '10px')
    .attr('fill', '#333')
    .attr('pointer-events', 'none')
    .attr('opacity', 0)
    .text(d => d.name)

  const techGroup = g.append('g').attr('class', 'tech-nodes')
    .selectAll('g')
    .data(techNodes)
    .join('g')
    .attr('class', 'node-tech')
    .style('cursor', 'grab')
    .call(drag(simulation))
    .on('mouseenter', (event, d) => onHover(event, d, links, nodes))
    .on('mouseleave', () => onLeave(link, appGroup, techGroup))

  techGroup.append('circle')
    .attr('r', d => d.r)
    .attr('fill', d => techColor(d.freq))
    .attr('stroke', '#fff')
    .attr('stroke-width', 1.5)

  // Technique labels always visible
  techGroup.append('text')
    .attr('dy', d => d.r + 12)
    .attr('text-anchor', 'middle')
    .attr('font-size', '9px')
    .attr('fill', '#555')
    .attr('pointer-events', 'none')
    .text(d => d.name)

  // Simulation
  simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).strength(0.4).distance(100))
    .force('charge', d3.forceManyBody().strength(d => d.type === 'technique' ? -400 : -200))
    .force('collision', d3.forceCollide().radius(d => d.r + 10))
    .force('center', d3.forceCenter(w / 2, h / 2))
    .on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)

      appGroup.attr('transform', d => `translate(${d.x},${d.y})`)
      techGroup.attr('transform', d => `translate(${d.x},${d.y})`)
    })

  // Attach drag after simulation created
  appGroup.call(drag(simulation))
  techGroup.call(drag(simulation))

  return { link, appGroup, techGroup }
}

// ── Drag ──────────────────────────────────────────────────────────────────────

function drag(sim) {
  return d3.drag()
    .on('start', (event, d) => {
      if (!event.active) sim && sim.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    })
    .on('drag', (event, d) => {
      d.fx = event.x
      d.fy = event.y
    })
    .on('end', (event, d) => {
      if (!event.active) sim && sim.alphaTarget(0)
      if (!isBipartite.value) {
        d.fx = null
        d.fy = null
      }
    })
}

// ── Hover ─────────────────────────────────────────────────────────────────────

let linkSel, appGroupSel, techGroupSel

function onHover(event, d, links, nodes) {
  if (!linkSel) return

  const connectedIds = new Set()
  const connectedLinks = []

  for (const lk of links) {
    const srcId = lk.source.id || lk.source
    const tgtId = lk.target.id || lk.target
    if (srcId === d.id || tgtId === d.id) {
      connectedLinks.push(lk)
      connectedIds.add(srcId)
      connectedIds.add(tgtId)
    }
  }

  // Dim unrelated
  linkSel.attr('stroke-opacity', lk => {
    const srcId = lk.source.id || lk.source
    const tgtId = lk.target.id || lk.target
    return srcId === d.id || tgtId === d.id ? 0.9 : 0.08
  }).attr('stroke-width', lk => {
    const srcId = lk.source.id || lk.source
    const tgtId = lk.target.id || lk.target
    return srcId === d.id || tgtId === d.id ? linkStrokeWidth(lk.count) + 1 : linkStrokeWidth(lk.count)
  })

  appGroupSel.select('circle').attr('opacity', nd => connectedIds.has(nd.id) || nd.id === d.id ? 1 : 0.2)
  appGroupSel.select('.app-label').attr('opacity', nd => connectedIds.has(nd.id) ? 1 : 0)
  techGroupSel.select('circle').attr('opacity', nd => connectedIds.has(nd.id) || nd.id === d.id ? 1 : 0.2)
  techGroupSel.select('text').attr('opacity', nd => connectedIds.has(nd.id) || nd.id === d.id ? 1 : 0.3)

  // Show hovered app label
  if (d.type === 'app') {
    appGroupSel.filter(nd => nd.id === d.id).select('.app-label').attr('opacity', 1)
  }

  // Tooltip
  const container = svgContainer.value.getBoundingClientRect()
  const ex = event.clientX - container.left
  const ey = event.clientY - container.top

  tooltip.visible = true
  tooltip.x = Math.min(ex + 12, width.value - 200)
  tooltip.y = Math.max(ey - 10, 10)
  tooltip.title = d.name

  if (d.type === 'app') {
    tooltip.meta = `Genre: ${d.genre} · ${d.count} observations`
    tooltip.list = connectedLinks
      .filter(lk => (lk.source.id || lk.source) === d.id || (lk.target.id || lk.target) === d.id)
      .map(lk => {
        const tId = (lk.target.id || lk.target) === d.id ? (lk.source.id || lk.source) : (lk.target.id || lk.target)
        const nd = nodes.find(n => n.id === tId)
        return nd ? `${nd.name} (${lk.count})` : ''
      })
      .filter(Boolean)
  } else {
    tooltip.meta = `${d.count} total observations`
    tooltip.list = connectedLinks
      .map(lk => {
        const aId = (lk.source.id || lk.source) === d.id ? (lk.target.id || lk.target) : (lk.source.id || lk.source)
        const nd = nodes.find(n => n.id === aId)
        return nd ? `${nd.name} (${lk.count})` : ''
      })
      .filter(Boolean)
  }
}

function onLeave(link, appGroup, techGroup) {
  link.attr('stroke-opacity', 0.5).attr('stroke-width', d => linkStrokeWidth(d.count))
  appGroup.select('circle').attr('opacity', 1)
  appGroup.select('.app-label').attr('opacity', 0)
  techGroup.select('circle').attr('opacity', 1)
  techGroup.select('text').attr('opacity', 1)
  tooltip.visible = false
}

// ── Layout toggle ─────────────────────────────────────────────────────────────

let currentNodes = []

function toggleLayout() {
  isBipartite.value = !isBipartite.value
  const w = width.value

  if (isBipartite.value) {
    for (const n of currentNodes) {
      if (n.type === 'app') {
        n.fx = w * 0.25
      } else {
        n.fx = w * 0.75
      }
    }
  } else {
    for (const n of currentNodes) {
      n.fx = null
      n.fy = null
    }
  }

  if (simulation) {
    simulation.alpha(0.5).restart()
  }
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────

onMounted(async () => {
  // Measure container
  if (svgContainer.value) {
    width.value = svgContainer.value.clientWidth || 900
  }

  await store.load()

  const { nodes, links } = buildGraph(store.observations)
  currentNodes = nodes

  const { link, appGroup, techGroup } = render(nodes, links)
  linkSel = link
  appGroupSel = appGroup
  techGroupSel = techGroup
})

onUnmounted(() => {
  if (simulation) simulation.stop()
})
</script>

<style scoped>
.bipartite-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.layout-toggle {
  font-size: 0.8rem;
  padding: 0.4rem 1rem;
  border-radius: 9999px;
  border: 1.5px solid #cd3735;
  color: #cd3735;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.layout-toggle:hover {
  background: #cd3735;
  color: white;
}

.legend-row {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
  font-size: 0.8rem;
  color: #555;
}

.legend-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.legend-label {
  font-weight: 600;
  color: #333;
}

.legend-items {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.legend-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.svg-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fafafa;
}

svg {
  display: block;
  width: 100%;
}

.network-tooltip {
  position: absolute;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  pointer-events: none;
  max-width: 220px;
  z-index: 10;
  font-size: 0.8rem;
}

.tooltip-title {
  font-weight: 700;
  font-size: 0.9rem;
  color: #111;
  margin-bottom: 4px;
}

.tooltip-meta {
  color: #555;
  margin-bottom: 6px;
}

.tooltip-list {
  max-height: 140px;
  overflow-y: auto;
  border-top: 1px solid #f0f0f0;
  padding-top: 4px;
}

.tooltip-list-item {
  color: #444;
  padding: 1px 0;
}

.loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  color: #555;
}
</style>
