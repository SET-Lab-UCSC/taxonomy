import { C as Chart } from "./auto-ByddkvQv.js";
import { u as useDataStore, o as onMounted, m as onBeforeUnmount, c as createElementBlock, d as createBaseVNode, e as createCommentVNode, F as Fragment, r as renderList, g as ref, b as unref, t as toDisplayString, h as openBlock, l as normalizeStyle } from "./index-oTcuwcvi.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _hoisted_1 = { class: "main-content" };
const _hoisted_2 = { class: "viz-card" };
const _hoisted_3 = { class: "legend" };
const _hoisted_4 = { class: "chart-wrap" };
const _hoisted_5 = {
  key: 0,
  class: "status-msg"
};
const _hoisted_6 = {
  key: 1,
  class: "status-msg error"
};
const _sfc_main = {
  __name: "ComplexityBubbleView",
  setup(__props) {
    const store = useDataStore();
    const canvasRef = ref(null);
    let chartInstance = null;
    const activityColors = {
      "System Control": "rgba(99,102,241,0.75)",
      Manipulation: "rgba(20,184,166,0.75)",
      Locomotion: "rgba(251,146,60,0.75)",
      Activation: "rgba(205,55,53,0.75)",
      Other: "rgba(107,114,128,0.75)"
    };
    function getActivityColor(activity) {
      return activityColors[activity] || activityColors["Other"];
    }
    function computeMetrics(observations) {
      const map = /* @__PURE__ */ new Map();
      for (const obs of observations) {
        const techniques = (obs.Interaction_Technique || "").split(",").map((t) => t.trim()).filter(Boolean);
        const actionCount = (obs.Action || "").split(",").map((a) => a.trim()).filter(Boolean).length;
        const app = (obs.Application || "").trim();
        const activity = (obs.Activity || "").trim();
        for (const tech of techniques) {
          if (!map.has(tech)) {
            map.set(tech, { apps: /* @__PURE__ */ new Set(), obsCount: 0, actionComplexities: [], activities: {} });
          }
          const entry = map.get(tech);
          if (app) entry.apps.add(app);
          entry.obsCount++;
          entry.actionComplexities.push(actionCount || 1);
          if (activity) {
            entry.activities[activity] = (entry.activities[activity] || 0) + 1;
          }
        }
      }
      const results = [];
      for (const [tech, data] of map.entries()) {
        const appCount = data.apps.size;
        const obsCount = data.obsCount;
        const meanActionComplexity = data.actionComplexities.reduce((a, b) => a + b, 0) / (data.actionComplexities.length || 1);
        let primaryActivity = "Other";
        let maxCount = 0;
        for (const [act, cnt] of Object.entries(data.activities)) {
          if (cnt > maxCount) {
            maxCount = cnt;
            primaryActivity = act;
          }
        }
        results.push({
          tech,
          appCount,
          obsCount,
          meanActionComplexity: Math.round(meanActionComplexity * 100) / 100,
          primaryActivity,
          apps: Array.from(data.apps)
        });
      }
      return results;
    }
    function buildChart(metrics) {
      if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
      }
      const obsCounts = metrics.map((m) => m.obsCount);
      const minObs = Math.min(...obsCounts);
      const maxObs = Math.max(...obsCounts);
      const minR = 8;
      const maxR = 30;
      function scaleR(obs) {
        if (maxObs === minObs) return (minR + maxR) / 2;
        return minR + (obs - minObs) / (maxObs - minObs) * (maxR - minR);
      }
      const byActivity = {};
      for (const m of metrics) {
        const act = m.primaryActivity in activityColors ? m.primaryActivity : "Other";
        if (!byActivity[act]) byActivity[act] = [];
        byActivity[act].push(m);
      }
      const datasets = Object.entries(byActivity).map(([activity, items]) => ({
        label: activity,
        data: items.map((m) => ({
          x: m.appCount,
          y: m.meanActionComplexity,
          r: scaleR(m.obsCount),
          _meta: m
        })),
        backgroundColor: getActivityColor(activity),
        borderColor: getActivityColor(activity).replace("0.75", "1"),
        borderWidth: 1
      }));
      chartInstance = new Chart(canvasRef.value, {
        type: "bubble",
        data: { datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label(ctx) {
                  const m = ctx.raw._meta;
                  const appList = m.apps.length > 5 ? m.apps.slice(0, 5).join(", ") + ` +${m.apps.length - 5} more` : m.apps.join(", ");
                  return [
                    `Technique: ${m.tech}`,
                    `Applications: ${m.appCount}`,
                    `Mean Action Complexity: ${m.meanActionComplexity}`,
                    `Total Observations: ${m.obsCount}`,
                    `Apps: ${appList}`
                  ];
                },
                title() {
                  return "";
                }
              }
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Applications Using Technique",
                font: { size: 13 }
              },
              min: 0,
              ticks: { stepSize: 1 }
            },
            y: {
              title: {
                display: true,
                text: "Mean Action Complexity",
                font: { size: 13 }
              },
              min: 0
            }
          }
        }
      });
    }
    onMounted(async () => {
      await store.load();
      const metrics = computeMetrics(store.observations);
      buildChart(metrics);
    });
    onBeforeUnmount(() => {
      if (chartInstance) chartInstance.destroy();
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        _cache[1] || (_cache[1] = createBaseVNode("h1", { class: "page-title" }, "Convergence vs. Embodiment Complexity", -1)),
        _cache[2] || (_cache[2] = createBaseVNode("p", { class: "page-description" }, " Each bubble represents one interaction technique. The horizontal axis shows how widely it has converged across applications; the vertical axis shows how physically complex it is (number of distinct input primitives required). Bubble size = total observation count. This visualization makes visible the paper's core claim: converged mainstream techniques (bottom-right) are systematically simpler, while embodied edge-case techniques (top-left) remain application-specific. ", -1)),
        createBaseVNode("div", _hoisted_2, [
          _cache[0] || (_cache[0] = createBaseVNode("h2", { class: "viz-card-title" }, "Bubble Chart", -1)),
          createBaseVNode("div", _hoisted_3, [
            (openBlock(), createElementBlock(Fragment, null, renderList(activityColors, (color, activity) => {
              return createBaseVNode("div", {
                key: activity,
                class: "legend-item"
              }, [
                createBaseVNode("span", {
                  class: "legend-dot",
                  style: normalizeStyle({ background: color })
                }, null, 4),
                createBaseVNode("span", null, toDisplayString(activity), 1)
              ]);
            }), 64))
          ]),
          createBaseVNode("div", _hoisted_4, [
            createBaseVNode("canvas", {
              ref_key: "canvasRef",
              ref: canvasRef
            }, null, 512)
          ]),
          unref(store).loading ? (openBlock(), createElementBlock("p", _hoisted_5, "Loading data…")) : createCommentVNode("", true),
          unref(store).error ? (openBlock(), createElementBlock("p", _hoisted_6, toDisplayString(unref(store).error), 1)) : createCommentVNode("", true)
        ])
      ]);
    };
  }
};
const ComplexityBubbleView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3eeaf4e9"]]);
export {
  ComplexityBubbleView as default
};
//# sourceMappingURL=ComplexityBubbleView-BILMNIT5.js.map
