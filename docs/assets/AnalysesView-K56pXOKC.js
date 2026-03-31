import { C as Chart } from "./auto-ByddkvQv.js";
import { u as useDataStore, o as onMounted, g as ref, c as createElementBlock, b as unref, t as toDisplayString, F as Fragment, d as createBaseVNode, e as createCommentVNode, k as createStaticVNode, n as normalizeClass, r as renderList, h as openBlock, l as normalizeStyle } from "./index-oTcuwcvi.js";
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
const _hoisted_7 = { class: "toggle-group" };
const _hoisted_8 = { class: "canvas-wrapper-tall" };
const _hoisted_9 = {
  key: 0,
  class: "viz-card"
};
const _hoisted_10 = { class: "matrix-wrapper" };
const _hoisted_11 = { class: "matrix-table" };
const _hoisted_12 = { class: "row-label" };
const _hoisted_13 = ["title"];
const _hoisted_14 = { style: { "font-weight": "700", "color": "#CD3735" } };
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
    const isStacked = ref(true);
    const matrixData = ref(null);
    function buildTechGenreMatrix(observations) {
      const techGenre = {};
      const techTotal = {};
      const genreSet = /* @__PURE__ */ new Set();
      observations.forEach((obs) => {
        const app = (obs.Application || "").trim();
        if (!app) return;
        const genre = getGenre(app);
        const techRaw = (obs.Interaction_Technique || "").trim();
        if (!techRaw) return;
        const techs = techRaw.split(",").map((t) => t.trim()).filter(Boolean);
        techs.forEach((tech) => {
          if (!techGenre[tech]) techGenre[tech] = {};
          techGenre[tech][genre] = (techGenre[tech][genre] || 0) + 1;
          techTotal[tech] = (techTotal[tech] || 0) + 1;
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
        borderWidth: stacked ? 0 : 1,
        borderColor: stacked ? void 0 : "rgba(255,255,255,0.5)"
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
    function setStacked(val) {
      isStacked.value = val;
      if (matrixData.value) renderFreqChart(matrixData.value, val);
    }
    function cellBg(count, maxCount) {
      if (!count) return "#ffffff";
      const alpha = 0.1 + count / maxCount * 0.8;
      return `rgba(205,55,53,${alpha.toFixed(2)})`;
    }
    function cellFg(count, maxCount) {
      return count / maxCount > 0.6 ? "#ffffff" : "#374151";
    }
    function heatmaxCount(matrix) {
      return Math.max(...matrix.techniques.flatMap((t) => matrix.genres.map((g) => {
        var _a;
        return ((_a = matrix.techGenre[t]) == null ? void 0 : _a[g]) || 0;
      })));
    }
    onMounted(async () => {
      await store.load();
      renderConvergenceChart(store.observations);
      matrixData.value = buildTechGenreMatrix(store.observations);
      renderFreqChart(matrixData.value, isStacked.value);
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("main", _hoisted_1, [
        unref(store).loading ? (openBlock(), createElementBlock("div", _hoisted_2, "Loading…")) : unref(store).error ? (openBlock(), createElementBlock("div", _hoisted_3, "Error: " + toDisplayString(unref(store).error), 1)) : (openBlock(), createElementBlock(Fragment, { key: 2 }, [
          _cache[11] || (_cache[11] = createBaseVNode("div", { class: "page-header" }, [
            createBaseVNode("h2", { class: "page-title" }, "Analyses"),
            createBaseVNode("p", { class: "page-description" }, " Visual analyses of interaction technique patterns across applications and observations. ")
          ], -1)),
          createBaseVNode("div", _hoisted_4, [
            _cache[2] || (_cache[2] = createBaseVNode("div", { class: "viz-card-title" }, "Interaction Technique Convergence", -1)),
            _cache[3] || (_cache[3] = createBaseVNode("p", {
              class: "page-description",
              style: { "margin-bottom": "1rem" }
            }, " Each bubble is one interaction technique. Horizontal axis = distinct applications using it; vertical axis = total observations. Convergent techniques appear on the right. ", -1)),
            createBaseVNode("div", _hoisted_5, [
              createBaseVNode("canvas", {
                ref_key: "convergenceCanvas",
                ref: convergenceCanvas
              }, null, 512)
            ]),
            _cache[4] || (_cache[4] = createStaticVNode('<div class="axis-labels"><span>← Divergent (unique to one app)</span><span>Convergent (shared across many apps) →</span></div><div class="viz-legend" style="margin-top:1rem;"><div class="viz-legend-item"><div class="viz-legend-swatch" style="background:rgba(239,68,68,0.75);"></div><span>Divergent — 1 application</span></div><div class="viz-legend-item"><div class="viz-legend-swatch" style="background:rgba(251,146,60,0.75);"></div><span>Semi-convergent — 2–3 applications</span></div><div class="viz-legend-item"><div class="viz-legend-swatch" style="background:rgba(20,184,166,0.75);"></div><span>Convergent — 4+ applications</span></div></div>', 2))
          ]),
          createBaseVNode("div", _hoisted_6, [
            _cache[5] || (_cache[5] = createBaseVNode("div", { class: "viz-card-title" }, "Interaction Techniques × Genre", -1)),
            _cache[6] || (_cache[6] = createBaseVNode("p", {
              class: "page-description",
              style: { "margin-bottom": "1rem" }
            }, " A stacked bar chart showing how often each interaction technique appears, broken down by application genre. Each bar represents one technique sorted by total observation count (left = most frequent). Stack segments show which genres contribute to that technique's usage — revealing which techniques are genre-specific versus cross-genre. Toggle between stacked and grouped views. ", -1)),
            createBaseVNode("div", _hoisted_7, [
              createBaseVNode("button", {
                class: normalizeClass(["toggle-btn", { active: isStacked.value }]),
                onClick: _cache[0] || (_cache[0] = ($event) => setStacked(true))
              }, "Stacked", 2),
              createBaseVNode("button", {
                class: normalizeClass(["toggle-btn", { active: !isStacked.value }]),
                onClick: _cache[1] || (_cache[1] = ($event) => setStacked(false))
              }, "Grouped", 2)
            ]),
            createBaseVNode("div", _hoisted_8, [
              createBaseVNode("canvas", {
                ref_key: "freqChart",
                ref: freqChart
              }, null, 512)
            ])
          ]),
          matrixData.value ? (openBlock(), createElementBlock("div", _hoisted_9, [
            _cache[9] || (_cache[9] = createBaseVNode("div", { class: "viz-card-title" }, "Genre Breakdown per Technique", -1)),
            createBaseVNode("div", _hoisted_10, [
              createBaseVNode("table", _hoisted_11, [
                createBaseVNode("thead", null, [
                  createBaseVNode("tr", null, [
                    _cache[7] || (_cache[7] = createBaseVNode("th", { class: "row-header" }, "Technique", -1)),
                    (openBlock(true), createElementBlock(Fragment, null, renderList(matrixData.value.genres, (genre) => {
                      return openBlock(), createElementBlock("th", { key: genre }, toDisplayString(genre), 1);
                    }), 128)),
                    _cache[8] || (_cache[8] = createBaseVNode("th", { style: { "font-weight": "700" } }, "Total", -1))
                  ])
                ]),
                createBaseVNode("tbody", null, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(matrixData.value.techniques, (tech) => {
                    return openBlock(), createElementBlock("tr", { key: tech }, [
                      createBaseVNode("td", _hoisted_12, toDisplayString(tech), 1),
                      (openBlock(true), createElementBlock(Fragment, null, renderList(matrixData.value.genres, (genre) => {
                        var _a, _b, _c, _d;
                        return openBlock(), createElementBlock("td", {
                          key: genre,
                          style: normalizeStyle({
                            backgroundColor: cellBg(((_a = matrixData.value.techGenre[tech]) == null ? void 0 : _a[genre]) || 0, heatmaxCount(matrixData.value)),
                            color: cellFg(((_b = matrixData.value.techGenre[tech]) == null ? void 0 : _b[genre]) || 0, heatmaxCount(matrixData.value))
                          }),
                          title: `${tech} × ${genre}: ${((_c = matrixData.value.techGenre[tech]) == null ? void 0 : _c[genre]) || 0}`
                        }, toDisplayString((((_d = matrixData.value.techGenre[tech]) == null ? void 0 : _d[genre]) || 0) > 0 ? matrixData.value.techGenre[tech][genre] : ""), 13, _hoisted_13);
                      }), 128)),
                      createBaseVNode("td", _hoisted_14, toDisplayString(matrixData.value.techTotal[tech]), 1)
                    ]);
                  }), 128))
                ])
              ])
            ]),
            _cache[10] || (_cache[10] = createBaseVNode("div", { class: "color-scale-bar" }, [
              createBaseVNode("span", null, "Fewer"),
              createBaseVNode("div", { class: "color-scale-gradient" }),
              createBaseVNode("span", null, "More")
            ], -1))
          ])) : createCommentVNode("", true)
        ], 64))
      ]);
    };
  }
};
export {
  _sfc_main as default
};
//# sourceMappingURL=AnalysesView-K56pXOKC.js.map
