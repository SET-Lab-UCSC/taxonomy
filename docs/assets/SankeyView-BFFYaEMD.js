import { s as select } from "./transform-BznNK3nw.js";
import { S as Sankey, s as sankeyLinkHorizontal } from "./sankeyLinkHorizontal-D6Slmp3Z.js";
import { u as useDataStore, o as onMounted, g as ref, m as onBeforeUnmount, c as createElementBlock, d as createBaseVNode, p as createTextVNode, b as unref, t as toDisplayString, f as createCommentVNode, q as normalizeStyle, h as openBlock } from "./index-HcNk-XNx.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import { i as initRange } from "./init-CTO7spbL.js";
class InternMap extends Map {
  constructor(entries, key = keyof) {
    super();
    Object.defineProperties(this, { _intern: { value: /* @__PURE__ */ new Map() }, _key: { value: key } });
    if (entries != null) for (const [key2, value] of entries) this.set(key2, value);
  }
  get(key) {
    return super.get(intern_get(this, key));
  }
  has(key) {
    return super.has(intern_get(this, key));
  }
  set(key, value) {
    return super.set(intern_set(this, key), value);
  }
  delete(key) {
    return super.delete(intern_delete(this, key));
  }
}
function intern_get({ _intern, _key }, value) {
  const key = _key(value);
  return _intern.has(key) ? _intern.get(key) : value;
}
function intern_set({ _intern, _key }, value) {
  const key = _key(value);
  if (_intern.has(key)) return _intern.get(key);
  _intern.set(key, value);
  return value;
}
function intern_delete({ _intern, _key }, value) {
  const key = _key(value);
  if (_intern.has(key)) {
    value = _intern.get(key);
    _intern.delete(key);
  }
  return value;
}
function keyof(value) {
  return value !== null && typeof value === "object" ? value.valueOf() : value;
}
const implicit = Symbol("implicit");
function ordinal() {
  var index = new InternMap(), domain = [], range = [], unknown = implicit;
  function scale(d) {
    let i = index.get(d);
    if (i === void 0) {
      if (unknown !== implicit) return unknown;
      index.set(d, i = domain.push(d) - 1);
    }
    return range[i % range.length];
  }
  scale.domain = function(_) {
    if (!arguments.length) return domain.slice();
    domain = [], index = new InternMap();
    for (const value of _) {
      if (index.has(value)) continue;
      index.set(value, domain.push(value) - 1);
    }
    return scale;
  };
  scale.range = function(_) {
    return arguments.length ? (range = Array.from(_), scale) : range.slice();
  };
  scale.unknown = function(_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  };
  scale.copy = function() {
    return ordinal(domain, range).unknown(unknown);
  };
  initRange.apply(scale, arguments);
  return scale;
}
const _hoisted_1 = { class: "main-content" };
const _hoisted_2 = {
  key: 0,
  class: "loading-state"
};
const _hoisted_3 = {
  key: 1,
  class: "chart-error"
};
const _hoisted_4 = {
  key: 2,
  class: "viz-card sankey-card"
};
const _hoisted_5 = { class: "tooltip-row" };
const _hoisted_6 = { class: "tooltip-value" };
const _hoisted_7 = { class: "tooltip-row" };
const _hoisted_8 = { class: "tooltip-value" };
const _hoisted_9 = { class: "tooltip-row" };
const _hoisted_10 = { class: "tooltip-value tooltip-count" };
const _sfc_main = {
  __name: "SankeyView",
  setup(__props) {
    const store = useDataStore();
    const svgRef = ref(null);
    const containerRef = ref(null);
    const tooltip = ref({ visible: false, x: 0, y: 0, source: "", target: "", count: 0 });
    let resizeObserver = null;
    const WARM_PALETTE = [
      "#FFCE7B",
      "#F5B84A",
      "#EFA425",
      "#E98708",
      "#E07010",
      "#D85A18",
      "#D04020",
      "#CD3735",
      "#C42E2E",
      "#BC2828",
      "#A82222",
      "#9A1D1D",
      "#8B1818",
      "#7D1414",
      "#6F1010",
      "#620C0C"
    ];
    function buildSankeyData(observations) {
      const actTaskCounts = {};
      const taskTechCounts = {};
      const activityCounts = {};
      const taskCounts = {};
      const techCounts = {};
      observations.forEach((obs) => {
        const activities2 = (obs.Activity || "").split(",").map((s) => s.trim()).filter(Boolean);
        const tasks2 = (obs.Task || "").split(",").map((s) => s.trim()).filter(Boolean);
        const techs2 = (obs.Interaction_Technique || "").split(",").map((s) => s.trim()).filter(Boolean);
        activities2.forEach((a) => {
          activityCounts[a] = (activityCounts[a] || 0) + 1;
        });
        tasks2.forEach((t) => {
          taskCounts[t] = (taskCounts[t] || 0) + 1;
        });
        techs2.forEach((t) => {
          techCounts[t] = (techCounts[t] || 0) + 1;
        });
        activities2.forEach((a) => {
          tasks2.forEach((t) => {
            const key = `${a}|||${t}`;
            actTaskCounts[key] = (actTaskCounts[key] || 0) + 1;
          });
        });
        tasks2.forEach((t) => {
          techs2.forEach((tech) => {
            const key = `${t}|||${tech}`;
            taskTechCounts[key] = (taskTechCounts[key] || 0) + 1;
          });
        });
      });
      const activities = Object.keys(activityCounts).sort((a, b) => activityCounts[b] - activityCounts[a]);
      const tasks = Object.keys(taskCounts).sort((a, b) => taskCounts[b] - taskCounts[a]);
      const techs = Object.keys(techCounts).sort((a, b) => techCounts[b] - techCounts[a]);
      const nodes = [];
      const nodeIndex = {};
      function addNode(name, col) {
        const key = `${col}:${name}`;
        if (!(key in nodeIndex)) {
          nodeIndex[key] = nodes.length;
          nodes.push({ name, col });
        }
        return nodeIndex[key];
      }
      activities.forEach((a) => addNode(a, 0));
      tasks.forEach((t) => addNode(t, 1));
      techs.forEach((t) => addNode(t, 2));
      const links = [];
      Object.entries(actTaskCounts).forEach(([key, value]) => {
        const [src, tgt] = key.split("|||");
        const srcIdx = nodeIndex[`0:${src}`];
        const tgtIdx = nodeIndex[`1:${tgt}`];
        if (srcIdx !== void 0 && tgtIdx !== void 0) {
          links.push({ source: srcIdx, target: tgtIdx, value });
        }
      });
      Object.entries(taskTechCounts).forEach(([key, value]) => {
        const [src, tgt] = key.split("|||");
        const srcIdx = nodeIndex[`1:${src}`];
        const tgtIdx = nodeIndex[`2:${tgt}`];
        if (srcIdx !== void 0 && tgtIdx !== void 0) {
          links.push({ source: srcIdx, target: tgtIdx, value });
        }
      });
      return { nodes, links, activities };
    }
    function renderSankey() {
      if (!svgRef.value || !containerRef.value) return;
      const obs = store.observations;
      if (!obs.length) return;
      const { nodes: rawNodes, links: rawLinks, activities } = buildSankeyData(obs);
      if (!rawNodes.length || !rawLinks.length) return;
      const W = Math.max(containerRef.value.offsetWidth || 900, 700);
      const H = Math.max(W * 0.65, 500);
      const margin = { top: 24, right: 180, bottom: 24, left: 180 };
      const actColorScale = ordinal().domain(activities).range(
        activities.map(
          (_, i) => WARM_PALETTE[Math.round(i / Math.max(activities.length - 1, 1) * (WARM_PALETTE.length - 1))]
        )
      );
      const svg = select(svgRef.value);
      svg.selectAll("*").remove();
      svg.attr("width", W).attr("height", H).attr("viewBox", `0 0 ${W} ${H}`).attr("preserveAspectRatio", "xMidYMid meet").style("max-width", "100%");
      const sankeyLayout = Sankey().nodeId((d) => d.index).nodeWidth(16).nodePadding(10).extent([[margin.left, margin.top], [W - margin.right, H - margin.bottom]]);
      const graph = sankeyLayout({
        nodes: rawNodes.map((d) => ({ ...d })),
        links: rawLinks.map((d) => ({ ...d }))
      });
      function nodeColor(node) {
        if (node.col === 0) return actColorScale(node.name);
        if (node.col === 1) {
          const srcLinks2 = graph.links.filter((l) => l.target.index === node.index);
          if (!srcLinks2.length) return "#aaa";
          srcLinks2.reduce((s, l) => s + l.value, 0);
          const dominant2 = srcLinks2.reduce((a, b) => a.value > b.value ? a : b);
          return dominant2.source.col === 0 ? actColorScale(dominant2.source.name) : nodeColor(dominant2.source);
        }
        const srcLinks = graph.links.filter((l) => l.target.index === node.index);
        if (!srcLinks.length) return "#aaa";
        const dominant = srcLinks.reduce((a, b) => a.value > b.value ? a : b);
        return nodeColor(dominant.source);
      }
      function linkColor(link) {
        const srcNode = link.source;
        const color = srcNode.col === 0 ? actColorScale(srcNode.name) : nodeColor(srcNode);
        return color;
      }
      const g = svg.append("g");
      g.append("g").attr("fill", "none").selectAll("path").data(graph.links).join("path").attr("d", sankeyLinkHorizontal()).attr("stroke", (d) => linkColor(d)).attr("stroke-width", (d) => Math.max(1, d.width)).attr("stroke-opacity", 0.45).attr("class", "sankey-link").on("mousemove", function(event, d) {
        const rect = containerRef.value.getBoundingClientRect();
        tooltip.value = {
          visible: true,
          x: event.clientX - rect.left + 12,
          y: event.clientY - rect.top - 28,
          source: d.source.name,
          target: d.target.name,
          count: d.value
        };
        select(this).attr("stroke-opacity", 0.8);
      }).on("mouseleave", function() {
        tooltip.value.visible = false;
        select(this).attr("stroke-opacity", 0.45);
      });
      g.append("g").selectAll("rect").data(graph.nodes).join("rect").attr("x", (d) => d.x0).attr("y", (d) => d.y0).attr("width", (d) => d.x1 - d.x0).attr("height", (d) => Math.max(1, d.y1 - d.y0)).attr("fill", (d) => nodeColor(d)).attr("opacity", 0.9).attr("rx", 3);
      g.append("g").style("font-family", "'Work Sans', sans-serif").style("font-size", "11px").style("fill", "#374151").selectAll("text").data(graph.nodes).join("text").attr("x", (d) => d.x0 < W / 2 ? d.x1 + 6 : d.x0 - 6).attr("y", (d) => (d.y1 + d.y0) / 2).attr("dy", "0.35em").attr("text-anchor", (d) => d.x0 < W / 2 ? "start" : "end").text((d) => d.name).each(function(d) {
        const available = Math.max(d.y1 - d.y0, 8);
        const self = select(this);
        d.name;
        if (available < 14) {
          self.text("");
        }
      });
      const colLabels = [
        { x: margin.left + 8, label: "Activity" },
        { x: W / 2, label: "Task" },
        { x: W - margin.right - 8, label: "Interaction Technique" }
      ];
      const headerG = svg.append("g").style("font-family", "'Work Sans', sans-serif").style("font-size", "13px").style("font-weight", "600").style("fill", "#CD3735");
      colLabels.forEach(({ x, label }, i) => {
        headerG.append("text").attr("x", i === 2 ? x + 8 : x).attr("y", margin.top - 8).attr("text-anchor", i === 0 ? "start" : i === 2 ? "end" : "middle").text(label);
      });
    }
    onMounted(async () => {
      await store.load();
      renderSankey();
      resizeObserver = new ResizeObserver(() => {
        renderSankey();
      });
      if (containerRef.value) resizeObserver.observe(containerRef.value);
    });
    onBeforeUnmount(() => {
      if (resizeObserver) resizeObserver.disconnect();
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("main", _hoisted_1, [
        _cache[5] || (_cache[5] = createBaseVNode("div", { class: "page-header" }, [
          createBaseVNode("h2", { class: "page-title" }, "Interaction Taxonomy Flow"),
          createBaseVNode("p", { class: "page-description" }, [
            createTextVNode(" This Sankey diagram traces the pipeline from "),
            createBaseVNode("strong", null, "Activity"),
            createTextVNode(" (what users are doing) through "),
            createBaseVNode("strong", null, "Task"),
            createTextVNode(" (the specific action required) to "),
            createBaseVNode("strong", null, "Interaction Technique"),
            createTextVNode(" (how they physically do it). Flow width encodes co-occurrence frequency — fatter bands mean more observations share that pairing. The diagram reveals how different Activities funnel into shared Techniques (convergence), which Tasks are central hubs, and which Techniques form a long tail of rare but purposeful interactions. ")
          ])
        ], -1)),
        unref(store).loading ? (openBlock(), createElementBlock("div", _hoisted_2, "Loading data…")) : unref(store).error ? (openBlock(), createElementBlock("div", _hoisted_3, "Error: " + toDisplayString(unref(store).error), 1)) : (openBlock(), createElementBlock("div", _hoisted_4, [
          _cache[3] || (_cache[3] = createBaseVNode("div", { class: "viz-card-title" }, "Activity → Task → Interaction Technique", -1)),
          createBaseVNode("div", {
            class: "sankey-container",
            ref_key: "containerRef",
            ref: containerRef
          }, [
            (openBlock(), createElementBlock("svg", {
              ref_key: "svgRef",
              ref: svgRef,
              class: "sankey-svg"
            }, null, 512)),
            tooltip.value.visible ? (openBlock(), createElementBlock("div", {
              key: 0,
              class: "sankey-tooltip",
              style: normalizeStyle({ left: tooltip.value.x + "px", top: tooltip.value.y + "px" })
            }, [
              createBaseVNode("div", _hoisted_5, [
                _cache[0] || (_cache[0] = createBaseVNode("span", { class: "tooltip-label" }, "From:", -1)),
                createBaseVNode("span", _hoisted_6, toDisplayString(tooltip.value.source), 1)
              ]),
              createBaseVNode("div", _hoisted_7, [
                _cache[1] || (_cache[1] = createBaseVNode("span", { class: "tooltip-label" }, "To:", -1)),
                createBaseVNode("span", _hoisted_8, toDisplayString(tooltip.value.target), 1)
              ]),
              createBaseVNode("div", _hoisted_9, [
                _cache[2] || (_cache[2] = createBaseVNode("span", { class: "tooltip-label" }, "Count:", -1)),
                createBaseVNode("span", _hoisted_10, toDisplayString(tooltip.value.count), 1)
              ])
            ], 4)) : createCommentVNode("", true)
          ], 512),
          _cache[4] || (_cache[4] = createBaseVNode("p", { class: "sankey-hint" }, "Hover over a flow to see the connection details.", -1))
        ]))
      ]);
    };
  }
};
const SankeyView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-21b434cc"]]);
export {
  SankeyView as default
};
//# sourceMappingURL=SankeyView-BFFYaEMD.js.map
