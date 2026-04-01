import { s as select } from "./transform-BznNK3nw.js";
import { S as Sankey, s as sankeyLinkHorizontal } from "./sankeyLinkHorizontal-D6Slmp3Z.js";
import { C as Chart } from "./auto-ByddkvQv.js";
import { u as useDataStore, o as onMounted, g as ref, k as nextTick, c as createElementBlock, b as unref, t as toDisplayString, F as Fragment, d as createBaseVNode, l as createStaticVNode, h as openBlock } from "./index-BERREmoa.js";
const _hoisted_1 = { class: "main-content analyses-content" };
const _hoisted_2 = {
  key: 0,
  class: "loading-state"
};
const _hoisted_3 = {
  key: 1,
  class: "chart-error"
};
const _hoisted_4 = { class: "viz-card" };
const _hoisted_5 = { class: "canvas-wrapper-tall" };
const _hoisted_6 = { class: "viz-card" };
const _hoisted_7 = { class: "canvas-wrapper-tall" };
const _sfc_main = {
  __name: "AnalysesView",
  setup(__props) {
    const store = useDataStore();
    const convergenceCanvas = ref(null);
    const freqChart = ref(null);
    let convergenceChart = null;
    let freqChartInstance = null;
    function buildTechStats(observations) {
      const freqMap = {};
      const appMap = {};
      observations.forEach((obs) => {
        const techRaw = (obs.Interaction_Technique || "").trim();
        if (!techRaw) return;
        const app = (obs.Application || "").trim();
        const techs = techRaw.split(",").map((t) => t.trim()).filter(Boolean);
        techs.forEach((t) => {
          freqMap[t] = (freqMap[t] || 0) + 1;
          if (!appMap[t]) appMap[t] = /* @__PURE__ */ new Set();
          if (app) appMap[t].add(app);
        });
      });
      return Object.entries(freqMap).map(([tech, freq]) => ({
        technique: tech,
        frequency: freq,
        appCount: appMap[tech] ? appMap[tech].size : 0,
        apps: appMap[tech] ? Array.from(appMap[tech]).sort() : []
      })).sort((a, b) => b.frequency - a.frequency);
    }
    function scaledRadius(freq, maxFreq) {
      return 6 + Math.round(freq / maxFreq * 22);
    }
    function renderConvergenceChart(observations) {
      const stats = buildTechStats(observations);
      const maxFreq = Math.max(...stats.map((s) => s.frequency));
      const categories = [
        { label: "Convergent (4+ apps)", minApps: 4, color: "rgba(20,184,166,0.75)", border: "rgba(13,148,136,1)" },
        { label: "Semi-convergent (2–3 apps)", minApps: 2, maxApps: 3, color: "rgba(251,146,60,0.75)", border: "rgba(234,88,12,1)" },
        { label: "Divergent (1 app)", minApps: 0, maxApps: 1, color: "rgba(239,68,68,0.75)", border: "rgba(220,38,38,1)" }
      ];
      const datasets = categories.map((cat) => {
        const points = stats.filter((s) => cat.maxApps !== void 0 ? s.appCount >= cat.minApps && s.appCount <= cat.maxApps : s.appCount >= cat.minApps).map((s) => ({
          x: s.appCount,
          y: s.frequency,
          r: scaledRadius(s.frequency, maxFreq),
          technique: s.technique,
          apps: s.apps
        }));
        return {
          label: cat.label,
          data: points,
          backgroundColor: cat.color,
          borderColor: cat.border,
          borderWidth: 1.5
        };
      });
      if (convergenceChart) convergenceChart.destroy();
      convergenceChart = new Chart(convergenceCanvas.value, {
        type: "bubble",
        data: { datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: "top",
              labels: { font: { family: "'Work Sans', sans-serif", size: 12 } }
            },
            tooltip: {
              backgroundColor: "rgba(0,0,0,0.85)",
              padding: 12,
              titleFont: { size: 13, weight: "bold", family: "'Work Sans', sans-serif" },
              bodyFont: { size: 12, family: "'Work Sans', sans-serif" },
              borderColor: "rgba(205,55,53,1)",
              borderWidth: 1,
              callbacks: {
                title: (items) => items[0].raw.technique,
                label: (ctx) => {
                  const d = ctx.raw;
                  return [`Observations: ${d.y}`, `Apps (${d.x}): ${d.apps.join(", ") || "—"}`];
                }
              }
            }
          },
          scales: {
            x: {
              title: { display: true, text: "Number of Applications Using Technique", font: { family: "'Work Sans', sans-serif", size: 12 } },
              ticks: { stepSize: 1, font: { family: "'Work Sans', sans-serif" } },
              min: 0
            },
            y: {
              title: { display: true, text: "Total Observations", font: { family: "'Work Sans', sans-serif", size: 12 } },
              ticks: { stepSize: 1, font: { family: "'Work Sans', sans-serif" } },
              beginAtZero: true
            }
          }
        }
      });
    }
    const GENRE_MAP = {
      "Beat Saber": "Music / Rhythm",
      "Fruit Ninja": "Action / Arcade",
      "Archery Pro": "Sports",
      "War of Wizards: Apprentice Edition": "Fantasy / Action",
      "Forever Pets": "Simulation",
      "Half Life: Alyx": "FPS / Action",
      "VTOL VR": "Flight Simulator",
      "ShapesXR": "Productivity",
      "Meta Quest 3: Home": "OS / Platform",
      "Roblox": "Platform / Social",
      "Spongebob": "Sample"
    };
    const GENRE_COLORS = {
      "Music / Rhythm": "rgba(205,55,53,0.82)",
      "Action / Arcade": "rgba(251,146,60,0.82)",
      "Sports": "rgba(234,179,8,0.82)",
      "Fantasy / Action": "rgba(168,85,247,0.82)",
      "Simulation": "rgba(20,184,166,0.82)",
      "FPS / Action": "rgba(239,68,68,0.65)",
      "Flight Simulator": "rgba(59,130,246,0.82)",
      "Productivity": "rgba(34,197,94,0.82)",
      "OS / Platform": "rgba(99,102,241,0.82)",
      "Platform / Social": "rgba(236,72,153,0.82)",
      "Sample": "rgba(156,163,175,0.6)",
      "Other": "rgba(107,114,128,0.6)"
    };
    function getGenre(app) {
      return GENRE_MAP[app] || "Other";
    }
    const matrixData = ref(null);
    function buildTechGenreMatrix(observations) {
      const techGenre = {};
      const techTotal = {};
      const genreSet = /* @__PURE__ */ new Set();
      observations.forEach((obs) => {
        const app = (obs.Application || "").trim();
        if (!app) return;
        const genre = getGenre(app);
        const taskRaw = (obs.Task || "").trim();
        if (!taskRaw) return;
        const tasks = taskRaw.split(",").map((t) => t.trim()).filter(Boolean);
        tasks.forEach((task) => {
          if (!techGenre[task]) techGenre[task] = {};
          techGenre[task][genre] = (techGenre[task][genre] || 0) + 1;
          techTotal[task] = (techTotal[task] || 0) + 1;
          genreSet.add(genre);
        });
      });
      const techniques = Object.keys(techTotal).sort((a, b) => techTotal[b] - techTotal[a]);
      const genres = Array.from(genreSet).sort();
      return { techGenre, techTotal, techniques, genres };
    }
    function renderFreqChart(matrix, stacked) {
      if (freqChartInstance) {
        freqChartInstance.destroy();
        freqChartInstance = null;
      }
      const { techGenre, techniques, genres } = matrix;
      const datasets = genres.map((genre) => ({
        label: genre,
        data: techniques.map((t) => {
          var _a;
          return ((_a = techGenre[t]) == null ? void 0 : _a[genre]) || 0;
        }),
        backgroundColor: GENRE_COLORS[genre] || "rgba(107,114,128,0.7)",
        borderWidth: 0,
        borderColor: void 0
      }));
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
              labels: { font: { family: "'Work Sans', sans-serif", size: 11 }, boxWidth: 14, padding: 16 }
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
                  const total = items.reduce((s, i) => s + (i.parsed.y || 0), 0);
                  return `Total: ${total}`;
                }
              }
            }
          },
          scales: {
            x: {
              stacked,
              ticks: {
                font: { family: "'Work Sans', sans-serif", size: 10 },
                maxRotation: 45,
                minRotation: 30
              },
              title: {
                display: true,
                text: "Task",
                font: { family: "'Work Sans', sans-serif", size: 12 }
              }
            },
            y: {
              stacked,
              beginAtZero: true,
              title: {
                display: true,
                text: "Observation Count",
                font: { family: "'Work Sans', sans-serif", size: 12 }
              },
              ticks: { stepSize: 1, font: { family: "'Work Sans', sans-serif" } }
            }
          }
        }
      });
    }
    const sankeyContainer = ref(null);
    function renderActivityTaskSankey(observations) {
      const el = sankeyContainer.value;
      if (!el) return;
      const width = el.clientWidth || 800;
      const height = 520;
      const margin = { top: 20, right: 180, bottom: 20, left: 180 };
      select(el).selectAll("*").remove();
      const svg = select(el).append("svg").attr("width", width).attr("height", height);
      const ACTIVITY_COLORS = {
        "Manipulation": "#CD3735",
        "Locomotion": "#E98708",
        "System Control": "#FFCE7B",
        "Activation": "#a78bfa",
        "Evading": "#10b981",
        "Creation": "#3b82f6",
        "Communication": "#f472b6"
      };
      const ACTIVITY_COLOR_DEFAULT = "#6b7280";
      const TASK_COLOR = "rgba(107,114,128,0.75)";
      function activityColor(name) {
        return ACTIVITY_COLORS[name] || ACTIVITY_COLOR_DEFAULT;
      }
      const linkMap = {};
      observations.forEach((obs) => {
        const activities = (obs.Activity || "").split(",").map((a) => a.trim()).filter(Boolean);
        const tasks = (obs.Task || "").split(",").map((t) => t.trim()).filter(Boolean);
        activities.forEach((act) => {
          tasks.forEach((task) => {
            const key = `${act}|||${task}`;
            linkMap[key] = (linkMap[key] || 0) + 1;
          });
        });
      });
      if (Object.keys(linkMap).length === 0) return;
      const activityNames = /* @__PURE__ */ new Set();
      const taskNames = /* @__PURE__ */ new Set();
      Object.keys(linkMap).forEach((k) => {
        const [a, t] = k.split("|||");
        activityNames.add(a);
        taskNames.add(t);
      });
      const rawNodes = [];
      const nodeIndexMap = {};
      activityNames.forEach((name) => {
        const key = `act:${name}`;
        nodeIndexMap[key] = rawNodes.length;
        rawNodes.push({ id: key, label: name, isActivity: true });
      });
      taskNames.forEach((name) => {
        const key = `task:${name}`;
        nodeIndexMap[key] = rawNodes.length;
        rawNodes.push({ id: key, label: name, isActivity: false });
      });
      const rawLinks = Object.entries(linkMap).map(([k, v]) => {
        const [a, t] = k.split("|||");
        return {
          source: nodeIndexMap[`act:${a}`],
          target: nodeIndexMap[`task:${t}`],
          value: v,
          activityName: a
        };
      });
      const { nodes: sNodes, links: sLinks } = Sankey().nodeWidth(14).nodePadding(12).extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]])(
        {
          nodes: rawNodes.map((d) => ({ ...d })),
          links: rawLinks.map((d) => ({ ...d }))
        }
      );
      svg.append("g").selectAll("path").data(sLinks).join("path").attr("d", sankeyLinkHorizontal()).attr("fill", "none").attr("stroke", (d) => activityColor(d.activityName)).attr("stroke-width", (d) => Math.max(1, d.width)).attr("stroke-opacity", 0.3).append("title").text((d) => `${d.source.label} → ${d.target.label}: ${d.value}`);
      const nodeG = svg.append("g").selectAll("g").data(sNodes).join("g");
      nodeG.append("rect").attr("x", (d) => d.x0).attr("y", (d) => d.y0).attr("width", (d) => d.x1 - d.x0).attr("height", (d) => Math.max(1, d.y1 - d.y0)).attr("fill", (d) => d.isActivity ? activityColor(d.label) : TASK_COLOR);
      nodeG.append("text").attr("x", (d) => d.isActivity ? d.x0 - 8 : d.x1 + 8).attr("y", (d) => (d.y0 + d.y1) / 2).attr("dy", "0.35em").attr("text-anchor", (d) => d.isActivity ? "end" : "start").attr("font-family", "'Work Sans', sans-serif").attr("font-size", 11).attr("fill", "#374151").text((d) => d.label);
    }
    onMounted(async () => {
      await store.load();
      renderConvergenceChart(store.observations);
      matrixData.value = buildTechGenreMatrix(store.observations);
      renderFreqChart(matrixData.value, true);
      await nextTick();
      renderActivityTaskSankey(store.observations);
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("main", _hoisted_1, [
        unref(store).loading ? (openBlock(), createElementBlock("div", _hoisted_2, "Loading…")) : unref(store).error ? (openBlock(), createElementBlock("div", _hoisted_3, "Error: " + toDisplayString(unref(store).error), 1)) : (openBlock(), createElementBlock(Fragment, { key: 2 }, [
          _cache[5] || (_cache[5] = createBaseVNode("div", { class: "page-header" }, [
            createBaseVNode("h2", { class: "page-title" }, "Analyses"),
            createBaseVNode("p", { class: "page-description" }, " Visual analyses of interaction technique patterns across applications and observations. ")
          ], -1)),
          createBaseVNode("div", _hoisted_4, [
            _cache[0] || (_cache[0] = createBaseVNode("div", { class: "viz-card-title" }, "Interaction Technique Convergence", -1)),
            _cache[1] || (_cache[1] = createBaseVNode("p", {
              class: "page-description",
              style: { "margin-bottom": "1rem" }
            }, " Each bubble is one interaction technique. Horizontal axis = distinct applications using it; vertical axis = total observations. Convergent techniques appear on the right. ", -1)),
            createBaseVNode("div", _hoisted_5, [
              createBaseVNode("canvas", {
                ref_key: "convergenceCanvas",
                ref: convergenceCanvas
              }, null, 512)
            ]),
            _cache[2] || (_cache[2] = createStaticVNode('<div class="axis-labels"><span>← Divergent (unique to one app)</span><span>Convergent (shared across many apps) →</span></div><div class="viz-legend" style="margin-top:1rem;"><div class="viz-legend-item"><div class="viz-legend-swatch" style="background:rgba(239,68,68,0.75);"></div><span>Divergent — 1 application</span></div><div class="viz-legend-item"><div class="viz-legend-swatch" style="background:rgba(251,146,60,0.75);"></div><span>Semi-convergent — 2–3 applications</span></div><div class="viz-legend-item"><div class="viz-legend-swatch" style="background:rgba(20,184,166,0.75);"></div><span>Convergent — 4+ applications</span></div></div>', 2))
          ]),
          createBaseVNode("div", _hoisted_6, [
            _cache[3] || (_cache[3] = createBaseVNode("div", { class: "viz-card-title" }, "Tasks × Genre", -1)),
            _cache[4] || (_cache[4] = createBaseVNode("p", {
              class: "page-description",
              style: { "margin-bottom": "1rem" }
            }, " Task frequency broken down by application genre. Reveals which tasks are cross-genre standards and which are genre-specific. ", -1)),
            createBaseVNode("div", _hoisted_7, [
              createBaseVNode("canvas", {
                ref_key: "freqChart",
                ref: freqChart
              }, null, 512)
            ])
          ])
        ], 64))
      ]);
    };
  }
};
export {
  _sfc_main as default
};
//# sourceMappingURL=AnalysesView-CiRLE8y1.js.map
