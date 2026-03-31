<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDataStore } from '../stores/data.js'

const store = useDataStore()

onMounted(async () => {
  await store.load()
})

// ── Metric helpers ────────────────────────────────────────────────────────────

function countParts(str) {
  if (!str || !str.trim()) return 0
  return str.split(',').map(s => s.trim()).filter(Boolean).length
}

function isNonEmpty(str) {
  return !!(str && str.trim())
}

// ── Raw per-app metrics ────────────────────────────────────────────────────────

const appRawMetrics = computed(() => {
  const obs = store.observations
  if (!obs || obs.length === 0) return {}

  const byApp = {}
  obs.forEach(o => {
    const app = (o.Application || '').trim()
    if (!app) return
    if (!byApp[app]) byApp[app] = []
    byApp[app].push(o)
  })

  const result = {}
  Object.entries(byApp).forEach(([app, rows]) => {
    if (rows.length < 3) return // only apps with 3+ observations

    const uniqueTasks = new Set(rows.map(r => (r.Task || '').trim()).filter(Boolean)).size
    const actionComplexity = rows.reduce((sum, r) => sum + countParts(r.Action), 0) / rows.length
    const feedbackRichness = rows.reduce((sum, r) => sum + countParts(r.Feedback), 0) / rows.length
    const feedforwardCoverage = rows.filter(r => isNonEmpty(r.Feedforward)).length / rows.length
    const bimanualRate = rows.filter(r => (r.Handedness || '').includes('Both')).length / rows.length
    const multiActionRate = rows.filter(r => isNonEmpty(r.Multi_Action)).length / rows.length

    result[app] = {
      app,
      count: rows.length,
      raw: [uniqueTasks, actionComplexity, feedbackRichness, feedforwardCoverage, bimanualRate, multiActionRate],
    }
  })
  return result
})

// ── Normalize 0–1 across apps ─────────────────────────────────────────────────

const appMetrics = computed(() => {
  const entries = Object.values(appRawMetrics.value)
  if (entries.length === 0) return []

  const dims = 6
  const mins = Array(dims).fill(Infinity)
  const maxs = Array(dims).fill(-Infinity)

  entries.forEach(({ raw }) => {
    raw.forEach((v, i) => {
      if (v < mins[i]) mins[i] = v
      if (v > maxs[i]) maxs[i] = v
    })
  })

  return entries.map(({ app, count, raw }) => {
    const normalized = raw.map((v, i) => {
      const range = maxs[i] - mins[i]
      return range === 0 ? 0.5 : (v - mins[i]) / range
    })
    return { app, count, normalized, raw }
  }).sort((a, b) => b.count - a.count)
})

// ── Comparison radar state ─────────────────────────────────────────────────────

const comparisonApps = ref(new Set())

function toggleComparison(app) {
  const next = new Set(comparisonApps.value)
  if (next.has(app)) next.delete(app)
  else next.add(app)
  comparisonApps.value = next
}

const comparisonData = computed(() => {
  return appMetrics.value.filter(m => comparisonApps.value.has(m.app))
})

// ── SVG radar math ────────────────────────────────────────────────────────────

const AXES = [
  'Task Diversity',
  'Action Complexity',
  'Feedback Richness',
  'Feedforward Coverage',
  'Bimanual Rate',
  'Multi-Action Rate',
]

const N = AXES.length
const ANGLES = AXES.map((_, i) => (Math.PI * 2 * i) / N - Math.PI / 2)

function polarToXY(angle, r, cx, cy) {
  return {
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
  }
}

function polygonPoints(values, maxR, cx, cy) {
  return values
    .map((v, i) => {
      const pt = polarToXY(ANGLES[i], v * maxR, cx, cy)
      return `${pt.x},${pt.y}`
    })
    .join(' ')
}

function gridPoints(level, maxR, cx, cy) {
  return ANGLES.map(a => {
    const pt = polarToXY(a, (level / 5) * maxR, cx, cy)
    return `${pt.x},${pt.y}`
  }).join(' ')
}

function axisEnd(i, maxR, cx, cy) {
  return polarToXY(ANGLES[i], maxR, cx, cy)
}

function labelPos(i, maxR, cx, cy) {
  return polarToXY(ANGLES[i], maxR + 14, cx, cy)
}

// ── Hover state ───────────────────────────────────────────────────────────────

const hoveredApp = ref(null)

const METRIC_LABELS = [
  'Task Diversity',
  'Action Complexity',
  'Feedback Richness',
  'Feedforward',
  'Bimanual',
  'Multi-Action',
]

const RAW_LABELS = [
  'unique tasks',
  'actions/obs',
  'feedbacks/obs',
  '% with feedforward',
  '% bimanual',
  '% multi-action',
]

// Comparison radar colors palette
const COMPARISON_COLORS = [
  { fill: 'rgba(205, 55, 53, 0.35)', stroke: '#CD3735' },
  { fill: 'rgba(233, 135, 8, 0.35)', stroke: '#E98708' },
  { fill: 'rgba(255, 206, 123, 0.35)', stroke: '#FFCE7B' },
  { fill: 'rgba(99, 102, 241, 0.35)', stroke: '#6366F1' },
  { fill: 'rgba(20, 184, 166, 0.35)', stroke: '#14B8A6' },
  { fill: 'rgba(236, 72, 153, 0.35)', stroke: '#EC4899' },
]

function comparisonColor(app) {
  const idx = appMetrics.value.findIndex(m => m.app === app)
  return COMPARISON_COLORS[idx % COMPARISON_COLORS.length]
}
</script>

<template>
  <div class="main-content radar-content">
    <!-- Page header -->
    <div class="page-header-section">
      <h1 class="page-title">Application Interaction Profiles</h1>
      <p class="page-description">
        Each application gets a hexagonal radar profile showing its character across six interaction dimensions.
        Applications with richer, more complex profiles exploit more of VR's embodied affordances; those clustered
        toward the center rely on a narrow repertoire of standardized techniques. Compare how simulation games differ
        from productivity apps.
      </p>
    </div>

    <div v-if="store.loading" class="loading-state">Loading data…</div>
    <div v-else-if="store.error" class="error-state">Error: {{ store.error }}</div>

    <template v-else-if="appMetrics.length > 0">

      <!-- ── Comparison radar panel ──────────────────────────────────────────── -->
      <div class="comparison-panel viz-card" v-if="comparisonData.length > 0">
        <div class="comparison-header">
          <h2 class="viz-card-title">Comparison View</h2>
          <div class="comparison-legend">
            <span
              v-for="m in comparisonData"
              :key="m.app"
              class="legend-item"
              :style="{ borderColor: comparisonColor(m.app).stroke }"
              @click="toggleComparison(m.app)"
            >
              <span class="legend-dot" :style="{ background: comparisonColor(m.app).stroke }"></span>
              {{ m.app }}
              <span class="legend-remove">✕</span>
            </span>
          </div>
        </div>
        <div class="comparison-radar-wrap">
          <svg :width="340" :height="340" class="comparison-svg">
            <!-- grid -->
            <g v-for="level in [1,2,3,4,5]" :key="level">
              <polygon
                :points="gridPoints(level, 130, 170, 170)"
                fill="none"
                stroke="#e5e7eb"
                stroke-width="1"
              />
            </g>
            <!-- axes -->
            <g v-for="(label, i) in AXES" :key="'cax' + i">
              <line
                :x1="170" :y1="170"
                :x2="axisEnd(i, 130, 170, 170).x"
                :y2="axisEnd(i, 130, 170, 170).y"
                stroke="#d1d5db" stroke-width="1"
              />
              <text
                :x="labelPos(i, 130, 170, 170).x"
                :y="labelPos(i, 130, 170, 170).y"
                text-anchor="middle"
                dominant-baseline="middle"
                font-size="9"
                fill="#6b7280"
                class="axis-label"
              >{{ label }}</text>
            </g>
            <!-- per-app polygons -->
            <g v-for="(m, idx) in comparisonData" :key="'cpoly' + m.app">
              <polygon
                :points="polygonPoints(m.normalized, 130, 170, 170)"
                :fill="comparisonColor(m.app).fill"
                :stroke="comparisonColor(m.app).stroke"
                stroke-width="2"
                stroke-linejoin="round"
              />
            </g>
          </svg>
        </div>
      </div>

      <!-- ── Small multiples grid ───────────────────────────────────────────── -->
      <div class="radar-grid">
        <div
          v-for="m in appMetrics"
          :key="m.app"
          class="viz-card radar-card"
          :class="{ hovered: hoveredApp === m.app, 'in-comparison': comparisonApps.has(m.app) }"
          @mouseenter="hoveredApp = m.app"
          @mouseleave="hoveredApp = null"
        >
          <div class="radar-card-header">
            <div class="viz-card-title radar-app-name">{{ m.app }}</div>
            <div class="radar-obs-count">{{ m.count }} observations</div>
          </div>

          <!-- SVG radar -->
          <div class="radar-svg-wrap">
            <svg width="160" height="160" class="radar-svg">
              <!-- grid rings -->
              <g v-for="level in [1,2,3,4,5]" :key="level">
                <polygon
                  :points="gridPoints(level, 62, 80, 80)"
                  fill="none"
                  stroke="#e5e7eb"
                  stroke-width="0.75"
                />
              </g>
              <!-- axes -->
              <g v-for="(label, i) in AXES" :key="'ax' + i">
                <line
                  :x1="80" :y1="80"
                  :x2="axisEnd(i, 62, 80, 80).x"
                  :y2="axisEnd(i, 62, 80, 80).y"
                  stroke="#e5e7eb" stroke-width="0.75"
                />
              </g>
              <!-- filled polygon -->
              <defs>
                <radialGradient :id="'rg-' + m.app.replace(/\s+/g, '_')" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#FFCE7B" stop-opacity="0.8"/>
                  <stop offset="100%" stop-color="#CD3735" stop-opacity="0.7"/>
                </radialGradient>
              </defs>
              <polygon
                :points="polygonPoints(m.normalized, 62, 80, 80)"
                :fill="'url(#rg-' + m.app.replace(/\s+/g, '_') + ')'"
                stroke="#E98708"
                stroke-width="1.5"
                stroke-linejoin="round"
              />
            </svg>
          </div>

          <!-- Hover metric breakdown -->
          <div class="radar-metrics" v-if="hoveredApp === m.app">
            <div class="radar-metric-row" v-for="(label, i) in METRIC_LABELS" :key="label">
              <span class="metric-label">{{ label }}</span>
              <div class="metric-bar-wrap">
                <div class="metric-bar" :style="{ width: (m.normalized[i] * 100).toFixed(1) + '%' }"></div>
              </div>
              <span class="metric-val">{{ (m.normalized[i] * 100).toFixed(0) }}</span>
            </div>
          </div>

          <!-- Compare toggle -->
          <button
            class="compare-btn"
            :class="{ active: comparisonApps.has(m.app) }"
            @click.stop="toggleComparison(m.app)"
            :title="comparisonApps.has(m.app) ? 'Remove from comparison' : 'Add to comparison'"
          >
            {{ comparisonApps.has(m.app) ? '− Compare' : '+ Compare' }}
          </button>
        </div>
      </div>

    </template>

    <div v-else-if="!store.loading" class="empty-state">No data available.</div>
  </div>
</template>

<style scoped>
.radar-content {
  padding: 2rem 3rem;
}

.page-header-section {
  margin-bottom: 2.5rem;
  max-width: 800px;
}

.loading-state,
.error-state,
.empty-state {
  padding: 3rem;
  text-align: center;
  color: #6b7280;
  font-size: 1rem;
}

/* ── Comparison panel ── */
.comparison-panel {
  margin-bottom: 2.5rem;
  padding: 1.5rem;
}

.comparison-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.comparison-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  border: 2px solid;
  border-radius: 999px;
  cursor: pointer;
  color: #374151;
  transition: opacity 0.15s;
}

.legend-item:hover {
  opacity: 0.7;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
}

.legend-remove {
  font-size: 0.6rem;
  color: #9ca3af;
  margin-left: 0.2rem;
}

.comparison-radar-wrap {
  display: flex;
  justify-content: center;
}

.comparison-svg {
  overflow: visible;
}

/* ── Radar grid ── */
.radar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.25rem;
}

.radar-card {
  padding: 1rem;
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.radar-card.hovered {
  box-shadow: 0 8px 24px rgba(205, 55, 53, 0.18);
  transform: translateY(-2px);
  z-index: 2;
}

.radar-card.in-comparison {
  outline: 2px solid #E98708;
}

.radar-card-header {
  width: 100%;
  margin-bottom: 0.5rem;
  text-align: center;
}

.radar-app-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.2;
  word-break: break-word;
}

.radar-obs-count {
  font-size: 0.7rem;
  color: #9ca3af;
  margin-top: 0.15rem;
}

.radar-svg-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}

.radar-svg {
  overflow: visible;
}

/* ── Hover metrics ── */
.radar-metrics {
  width: 100%;
  margin-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.radar-metric-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.68rem;
}

.metric-label {
  width: 80px;
  flex-shrink: 0;
  color: #6b7280;
  text-align: right;
}

.metric-bar-wrap {
  flex: 1;
  height: 5px;
  background: #f3f4f6;
  border-radius: 9999px;
  overflow: hidden;
}

.metric-bar {
  height: 100%;
  background: linear-gradient(90deg, #FFCE7B, #CD3735);
  border-radius: 9999px;
  transition: width 0.3s;
}

.metric-val {
  width: 24px;
  text-align: right;
  color: #374151;
  font-weight: 600;
  font-size: 0.68rem;
}

/* ── Compare button ── */
.compare-btn {
  margin-top: 0.6rem;
  font-size: 0.7rem;
  padding: 0.2rem 0.7rem;
  border-radius: 999px;
  border: 1.5px solid #d1d5db;
  background: white;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.15s;
}

.compare-btn:hover {
  border-color: #E98708;
  color: #E98708;
}

.compare-btn.active {
  background: #E98708;
  border-color: #E98708;
  color: white;
}

/* ── Axis labels on small radars (shown on hover) ── */
.axis-label {
  font-family: 'Work Sans', sans-serif;
}

@media (max-width: 768px) {
  .radar-content {
    padding: 1.5rem 1.25rem;
  }
  .radar-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
}
</style>
