import { u as useDataStore, o as onMounted, c as createElementBlock, d as createBaseVNode, f as createCommentVNode, b as unref, t as toDisplayString, e as computed, F as Fragment, r as renderList, h as openBlock, q as normalizeStyle, p as createTextVNode, n as normalizeClass, g as ref, j as withModifiers } from "./index-BERREmoa.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _hoisted_1 = { class: "main-content radar-content" };
const _hoisted_2 = {
  key: 0,
  class: "loading-state"
};
const _hoisted_3 = {
  key: 1,
  class: "error-state"
};
const _hoisted_4 = {
  key: 0,
  class: "comparison-panel viz-card"
};
const _hoisted_5 = { class: "comparison-header" };
const _hoisted_6 = { class: "comparison-legend" };
const _hoisted_7 = ["onClick"];
const _hoisted_8 = { class: "comparison-radar-wrap" };
const _hoisted_9 = {
  width: 340,
  height: 340,
  class: "comparison-svg"
};
const _hoisted_10 = ["points"];
const _hoisted_11 = ["x2", "y2"];
const _hoisted_12 = ["x", "y"];
const _hoisted_13 = ["points", "fill", "stroke"];
const _hoisted_14 = { class: "radar-grid" };
const _hoisted_15 = ["onMouseenter"];
const _hoisted_16 = { class: "radar-card-header" };
const _hoisted_17 = { class: "viz-card-title radar-app-name" };
const _hoisted_18 = { class: "radar-obs-count" };
const _hoisted_19 = { class: "radar-svg-wrap" };
const _hoisted_20 = {
  width: "160",
  height: "160",
  class: "radar-svg"
};
const _hoisted_21 = ["points"];
const _hoisted_22 = ["x2", "y2"];
const _hoisted_23 = ["id"];
const _hoisted_24 = ["points", "fill"];
const _hoisted_25 = {
  key: 0,
  class: "radar-metrics"
};
const _hoisted_26 = { class: "metric-label" };
const _hoisted_27 = { class: "metric-bar-wrap" };
const _hoisted_28 = { class: "metric-val" };
const _hoisted_29 = ["onClick", "title"];
const _hoisted_30 = {
  key: 3,
  class: "empty-state"
};
const _sfc_main = {
  __name: "RadarView",
  setup(__props) {
    const store = useDataStore();
    onMounted(async () => {
      await store.load();
    });
    function countParts(str) {
      if (!str || !str.trim()) return 0;
      return str.split(",").map((s) => s.trim()).filter(Boolean).length;
    }
    function isNonEmpty(str) {
      return !!(str && str.trim());
    }
    const appRawMetrics = computed(() => {
      const obs = store.observations;
      if (!obs || obs.length === 0) return {};
      const byApp = {};
      obs.forEach((o) => {
        const app = (o.Application || "").trim();
        if (!app) return;
        if (!byApp[app]) byApp[app] = [];
        byApp[app].push(o);
      });
      const result = {};
      Object.entries(byApp).forEach(([app, rows]) => {
        if (rows.length < 3) return;
        const uniqueTasks = new Set(rows.map((r) => (r.Task || "").trim()).filter(Boolean)).size;
        const actionComplexity = rows.reduce((sum, r) => sum + countParts(r.Action), 0) / rows.length;
        const feedbackRichness = rows.reduce((sum, r) => sum + countParts(r.Feedback), 0) / rows.length;
        const feedforwardCoverage = rows.filter((r) => isNonEmpty(r.Feedforward)).length / rows.length;
        const bimanualRate = rows.filter((r) => (r.Handedness || "").includes("Both")).length / rows.length;
        const multiActionRate = rows.filter((r) => isNonEmpty(r.Multi_Action)).length / rows.length;
        result[app] = {
          app,
          count: rows.length,
          raw: [uniqueTasks, actionComplexity, feedbackRichness, feedforwardCoverage, bimanualRate, multiActionRate]
        };
      });
      return result;
    });
    const appMetrics = computed(() => {
      const entries = Object.values(appRawMetrics.value);
      if (entries.length === 0) return [];
      const dims = 6;
      const mins = Array(dims).fill(Infinity);
      const maxs = Array(dims).fill(-Infinity);
      entries.forEach(({ raw }) => {
        raw.forEach((v, i) => {
          if (v < mins[i]) mins[i] = v;
          if (v > maxs[i]) maxs[i] = v;
        });
      });
      return entries.map(({ app, count, raw }) => {
        const normalized = raw.map((v, i) => {
          const range = maxs[i] - mins[i];
          return range === 0 ? 0.5 : (v - mins[i]) / range;
        });
        return { app, count, normalized, raw };
      }).sort((a, b) => b.count - a.count);
    });
    const comparisonApps = ref(/* @__PURE__ */ new Set());
    function toggleComparison(app) {
      const next = new Set(comparisonApps.value);
      if (next.has(app)) next.delete(app);
      else next.add(app);
      comparisonApps.value = next;
    }
    const comparisonData = computed(() => {
      return appMetrics.value.filter((m) => comparisonApps.value.has(m.app));
    });
    const AXES = [
      "Task Diversity",
      "Action Complexity",
      "Feedback Richness",
      "Feedforward Coverage",
      "Bimanual Rate",
      "Multi-Action Rate"
    ];
    const N = AXES.length;
    const ANGLES = AXES.map((_, i) => Math.PI * 2 * i / N - Math.PI / 2);
    function polarToXY(angle, r, cx, cy) {
      return {
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle)
      };
    }
    function polygonPoints(values, maxR, cx, cy) {
      return values.map((v, i) => {
        const pt = polarToXY(ANGLES[i], v * maxR, cx, cy);
        return `${pt.x},${pt.y}`;
      }).join(" ");
    }
    function gridPoints(level, maxR, cx, cy) {
      return ANGLES.map((a) => {
        const pt = polarToXY(a, level / 5 * maxR, cx, cy);
        return `${pt.x},${pt.y}`;
      }).join(" ");
    }
    function axisEnd(i, maxR, cx, cy) {
      return polarToXY(ANGLES[i], maxR, cx, cy);
    }
    function labelPos(i, maxR, cx, cy) {
      return polarToXY(ANGLES[i], maxR + 14, cx, cy);
    }
    const hoveredApp = ref(null);
    const METRIC_LABELS = [
      "Task Diversity",
      "Action Complexity",
      "Feedback Richness",
      "Feedforward",
      "Bimanual",
      "Multi-Action"
    ];
    const COMPARISON_COLORS = [
      { fill: "rgba(205, 55, 53, 0.35)", stroke: "#CD3735" },
      { fill: "rgba(233, 135, 8, 0.35)", stroke: "#E98708" },
      { fill: "rgba(255, 206, 123, 0.35)", stroke: "#FFCE7B" },
      { fill: "rgba(99, 102, 241, 0.35)", stroke: "#6366F1" },
      { fill: "rgba(20, 184, 166, 0.35)", stroke: "#14B8A6" },
      { fill: "rgba(236, 72, 153, 0.35)", stroke: "#EC4899" }
    ];
    function comparisonColor(app) {
      const idx = appMetrics.value.findIndex((m) => m.app === app);
      return COMPARISON_COLORS[idx % COMPARISON_COLORS.length];
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        _cache[4] || (_cache[4] = createBaseVNode("div", { class: "page-header-section" }, [
          createBaseVNode("h1", { class: "page-title" }, "Application Interaction Profiles"),
          createBaseVNode("p", { class: "page-description" }, " Each application gets a hexagonal radar profile showing its character across six interaction dimensions. Applications with richer, more complex profiles exploit more of VR's embodied affordances; those clustered toward the center rely on a narrow repertoire of standardized techniques. Compare how simulation games differ from productivity apps. ")
        ], -1)),
        unref(store).loading ? (openBlock(), createElementBlock("div", _hoisted_2, "Loading data…")) : unref(store).error ? (openBlock(), createElementBlock("div", _hoisted_3, "Error: " + toDisplayString(unref(store).error), 1)) : appMetrics.value.length > 0 ? (openBlock(), createElementBlock(Fragment, { key: 2 }, [
          comparisonData.value.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_4, [
            createBaseVNode("div", _hoisted_5, [
              _cache[2] || (_cache[2] = createBaseVNode("h2", { class: "viz-card-title" }, "Comparison View", -1)),
              createBaseVNode("div", _hoisted_6, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(comparisonData.value, (m) => {
                  return openBlock(), createElementBlock("span", {
                    key: m.app,
                    class: "legend-item",
                    style: normalizeStyle({ borderColor: comparisonColor(m.app).stroke }),
                    onClick: ($event) => toggleComparison(m.app)
                  }, [
                    createBaseVNode("span", {
                      class: "legend-dot",
                      style: normalizeStyle({ background: comparisonColor(m.app).stroke })
                    }, null, 4),
                    createTextVNode(" " + toDisplayString(m.app) + " ", 1),
                    _cache[1] || (_cache[1] = createBaseVNode("span", { class: "legend-remove" }, "✕", -1))
                  ], 12, _hoisted_7);
                }), 128))
              ])
            ]),
            createBaseVNode("div", _hoisted_8, [
              (openBlock(), createElementBlock("svg", _hoisted_9, [
                (openBlock(), createElementBlock(Fragment, null, renderList([1, 2, 3, 4, 5], (level) => {
                  return createBaseVNode("g", { key: level }, [
                    createBaseVNode("polygon", {
                      points: gridPoints(level, 130, 170, 170),
                      fill: "none",
                      stroke: "#e5e7eb",
                      "stroke-width": "1"
                    }, null, 8, _hoisted_10)
                  ]);
                }), 64)),
                (openBlock(), createElementBlock(Fragment, null, renderList(AXES, (label, i) => {
                  return createBaseVNode("g", {
                    key: "cax" + i
                  }, [
                    createBaseVNode("line", {
                      x1: 170,
                      y1: 170,
                      x2: axisEnd(i, 130, 170, 170).x,
                      y2: axisEnd(i, 130, 170, 170).y,
                      stroke: "#d1d5db",
                      "stroke-width": "1"
                    }, null, 8, _hoisted_11),
                    createBaseVNode("text", {
                      x: labelPos(i, 130, 170, 170).x,
                      y: labelPos(i, 130, 170, 170).y,
                      "text-anchor": "middle",
                      "dominant-baseline": "middle",
                      "font-size": "9",
                      fill: "#6b7280",
                      class: "axis-label"
                    }, toDisplayString(label), 9, _hoisted_12)
                  ]);
                }), 64)),
                (openBlock(true), createElementBlock(Fragment, null, renderList(comparisonData.value, (m, idx) => {
                  return openBlock(), createElementBlock("g", {
                    key: "cpoly" + m.app
                  }, [
                    createBaseVNode("polygon", {
                      points: polygonPoints(m.normalized, 130, 170, 170),
                      fill: comparisonColor(m.app).fill,
                      stroke: comparisonColor(m.app).stroke,
                      "stroke-width": "2",
                      "stroke-linejoin": "round"
                    }, null, 8, _hoisted_13)
                  ]);
                }), 128))
              ]))
            ])
          ])) : createCommentVNode("", true),
          createBaseVNode("div", _hoisted_14, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(appMetrics.value, (m) => {
              return openBlock(), createElementBlock("div", {
                key: m.app,
                class: normalizeClass(["viz-card radar-card", { hovered: hoveredApp.value === m.app, "in-comparison": comparisonApps.value.has(m.app) }]),
                onMouseenter: ($event) => hoveredApp.value = m.app,
                onMouseleave: _cache[0] || (_cache[0] = ($event) => hoveredApp.value = null)
              }, [
                createBaseVNode("div", _hoisted_16, [
                  createBaseVNode("div", _hoisted_17, toDisplayString(m.app), 1),
                  createBaseVNode("div", _hoisted_18, toDisplayString(m.count) + " observations", 1)
                ]),
                createBaseVNode("div", _hoisted_19, [
                  (openBlock(), createElementBlock("svg", _hoisted_20, [
                    (openBlock(), createElementBlock(Fragment, null, renderList([1, 2, 3, 4, 5], (level) => {
                      return createBaseVNode("g", { key: level }, [
                        createBaseVNode("polygon", {
                          points: gridPoints(level, 62, 80, 80),
                          fill: "none",
                          stroke: "#e5e7eb",
                          "stroke-width": "0.75"
                        }, null, 8, _hoisted_21)
                      ]);
                    }), 64)),
                    (openBlock(), createElementBlock(Fragment, null, renderList(AXES, (label, i) => {
                      return createBaseVNode("g", {
                        key: "ax" + i
                      }, [
                        createBaseVNode("line", {
                          x1: 80,
                          y1: 80,
                          x2: axisEnd(i, 62, 80, 80).x,
                          y2: axisEnd(i, 62, 80, 80).y,
                          stroke: "#e5e7eb",
                          "stroke-width": "0.75"
                        }, null, 8, _hoisted_22)
                      ]);
                    }), 64)),
                    createBaseVNode("defs", null, [
                      createBaseVNode("radialGradient", {
                        id: "rg-" + m.app.replace(/\s+/g, "_"),
                        cx: "50%",
                        cy: "50%",
                        r: "50%"
                      }, [..._cache[3] || (_cache[3] = [
                        createBaseVNode("stop", {
                          offset: "0%",
                          "stop-color": "#FFCE7B",
                          "stop-opacity": "0.8"
                        }, null, -1),
                        createBaseVNode("stop", {
                          offset: "100%",
                          "stop-color": "#CD3735",
                          "stop-opacity": "0.7"
                        }, null, -1)
                      ])], 8, _hoisted_23)
                    ]),
                    createBaseVNode("polygon", {
                      points: polygonPoints(m.normalized, 62, 80, 80),
                      fill: "url(#rg-" + m.app.replace(/\s+/g, "_") + ")",
                      stroke: "#E98708",
                      "stroke-width": "1.5",
                      "stroke-linejoin": "round"
                    }, null, 8, _hoisted_24)
                  ]))
                ]),
                hoveredApp.value === m.app ? (openBlock(), createElementBlock("div", _hoisted_25, [
                  (openBlock(), createElementBlock(Fragment, null, renderList(METRIC_LABELS, (label, i) => {
                    return createBaseVNode("div", {
                      class: "radar-metric-row",
                      key: label
                    }, [
                      createBaseVNode("span", _hoisted_26, toDisplayString(label), 1),
                      createBaseVNode("div", _hoisted_27, [
                        createBaseVNode("div", {
                          class: "metric-bar",
                          style: normalizeStyle({ width: (m.normalized[i] * 100).toFixed(1) + "%" })
                        }, null, 4)
                      ]),
                      createBaseVNode("span", _hoisted_28, toDisplayString((m.normalized[i] * 100).toFixed(0)), 1)
                    ]);
                  }), 64))
                ])) : createCommentVNode("", true),
                createBaseVNode("button", {
                  class: normalizeClass(["compare-btn", { active: comparisonApps.value.has(m.app) }]),
                  onClick: withModifiers(($event) => toggleComparison(m.app), ["stop"]),
                  title: comparisonApps.value.has(m.app) ? "Remove from comparison" : "Add to comparison"
                }, toDisplayString(comparisonApps.value.has(m.app) ? "− Compare" : "+ Compare"), 11, _hoisted_29)
              ], 42, _hoisted_15);
            }), 128))
          ])
        ], 64)) : !unref(store).loading ? (openBlock(), createElementBlock("div", _hoisted_30, "No data available.")) : createCommentVNode("", true)
      ]);
    };
  }
};
const RadarView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3f64b18f"]]);
export {
  RadarView as default
};
//# sourceMappingURL=RadarView-CG54UNqE.js.map
