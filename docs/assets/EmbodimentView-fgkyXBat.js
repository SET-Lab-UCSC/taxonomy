import { u as useDataStore, o as onMounted, g as ref, m as onBeforeUnmount, c as createElementBlock, d as createBaseVNode, f as createCommentVNode, q as normalizeStyle, t as toDisplayString, F as Fragment, r as renderList, b as unref, h as openBlock, p as createTextVNode } from "./index-BERREmoa.js";
const _hoisted_1 = { class: "main-content" };
const _hoisted_2 = {
  class: "viz-card",
  style: { "margin-top": "2rem", "position": "relative" }
};
const _hoisted_3 = { style: { "font-weight": "700", "margin-bottom": "4px" } };
const _hoisted_4 = { style: { "color": "#d1d5db" } };
const _hoisted_5 = { style: { "color": "#9ca3af", "font-size": "12px", "margin-top": "4px" } };
const _hoisted_6 = { style: { "margin-top": "8px", "border-top": "1px solid #374151", "padding-top": "6px", "font-size": "12px", "color": "#d1d5db" } };
const _hoisted_7 = { style: { "font-weight": "700", "color": "#f97316", "margin-top": "4px" } };
const _hoisted_8 = {
  class: "viz-card",
  style: { "margin-top": "1.5rem" }
};
const _hoisted_9 = { style: { "display": "flex", "flex-wrap": "wrap", "gap": "0.5rem 1.5rem", "margin-top": "0.75rem" } };
const _hoisted_10 = {
  key: 0,
  style: { "padding": "2rem", "text-align": "center", "color": "#6b7280" }
};
const _hoisted_11 = {
  key: 1,
  style: { "padding": "2rem", "text-align": "center", "color": "#ef4444" }
};
const _sfc_main = {
  __name: "EmbodimentView",
  setup(__props) {
    const store = useDataStore();
    const svgContainer = ref(null);
    const tooltipData = ref(null);
    const tooltipX = ref(0);
    const tooltipY = ref(0);
    function computeScore(obs) {
      const actionRaw = (obs.Action || "").trim();
      const actions = actionRaw ? actionRaw.split(",").map((s) => s.trim()).filter(Boolean) : [];
      const actionScore = actions.length;
      const handedness = (obs.Handedness || "").trim().toLowerCase();
      let handednessBonus = 0;
      if (handedness.includes("both")) handednessBonus = 2;
      else if (handedness.includes("dominant") || handedness.includes("non-dominant")) handednessBonus = 1;
      const multiAction = (obs.Multi_Action || "").trim();
      const multiActionBonus = multiAction ? 2 : 0;
      return {
        actionScore,
        handednessBonus,
        multiActionBonus,
        total: actionScore + handednessBonus + multiActionBonus,
        actions
      };
    }
    const PALETTE = [
      "#e6194b",
      "#3cb44b",
      "#4363d8",
      "#f58231",
      "#911eb4",
      "#42d4f4",
      "#f032e6",
      "#bfef45",
      "#fabed4",
      "#469990",
      "#dcbeff",
      "#9a6324",
      "#fffac8",
      "#800000",
      "#aaffc3",
      "#808000",
      "#ffd8b1",
      "#000075",
      "#a9a9a9",
      "#000000"
    ];
    let appColorMap = {};
    function getAppColor(app) {
      return appColorMap[app] || "#999";
    }
    function seededRandom(seed) {
      let s = seed;
      return () => {
        s = (s * 16807 + 0) % 2147483647;
        return (s - 1) / 2147483646;
      };
    }
    function render() {
      if (!svgContainer.value) return;
      const container = svgContainer.value;
      container.innerHTML = "";
      const observations = store.observations;
      if (!observations.length) return;
      const scored = observations.map((obs, i) => ({
        obs,
        ...computeScore(obs),
        idx: i
      }));
      const apps = [...new Set(observations.map((o) => (o.Application || "").trim()).filter(Boolean))].sort();
      appColorMap = {};
      apps.forEach((app, i) => {
        appColorMap[app] = PALETTE[i % PALETTE.length];
      });
      const maxScore = Math.max(...scored.map((s) => s.total), 1);
      const margin = { top: 30, right: 40, bottom: 60, left: 60 };
      const width = container.clientWidth || 900;
      const svgWidth = width;
      const svgHeight = 340;
      const innerW = svgWidth - margin.left - margin.right;
      const innerH = svgHeight - margin.top - margin.bottom;
      const R = 6;
      const JITTER_H = innerH * 0.8;
      const xScale = (v) => v / maxScore * innerW;
      const byScore = {};
      scored.forEach((d) => {
        const k = d.total;
        if (!byScore[k]) byScore[k] = [];
        byScore[k].push(d);
      });
      const rng = seededRandom(42);
      scored.forEach((d) => {
        const group = byScore[d.total];
        const idx = group.indexOf(d);
        const count = group.length;
        const cols = Math.ceil(Math.sqrt(count * 2));
        const row = Math.floor(idx / cols);
        const col = idx % cols;
        const cellW = R * 2 + 2;
        const cellH = R * 2 + 2;
        const startX = -(Math.min(count, cols) * cellW) / 2;
        const startY = -(Math.ceil(count / cols) * cellH) / 2;
        if (count <= 8) {
          d.jx = (rng() - 0.5) * 10;
          d.jy = (rng() - 0.5) * JITTER_H;
        } else {
          d.jx = startX + col * cellW + cellW / 2;
          d.jy = startY + row * cellH + cellH / 2;
        }
      });
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", svgWidth);
      svg.setAttribute("height", svgHeight);
      svg.style.display = "block";
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("transform", `translate(${margin.left},${margin.top})`);
      svg.appendChild(g);
      for (let v = 0; v <= maxScore; v++) {
        const x = xScale(v);
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", x);
        line.setAttribute("x2", x);
        line.setAttribute("y1", 0);
        line.setAttribute("y2", innerH);
        line.setAttribute("stroke", "#e5e7eb");
        line.setAttribute("stroke-width", "1");
        g.appendChild(line);
        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("x", x);
        label.setAttribute("y", innerH + 20);
        label.setAttribute("text-anchor", "middle");
        label.setAttribute("font-size", "12");
        label.setAttribute("fill", "#6b7280");
        label.textContent = v;
        g.appendChild(label);
      }
      const axisLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
      axisLine.setAttribute("x1", 0);
      axisLine.setAttribute("x2", innerW);
      axisLine.setAttribute("y1", innerH);
      axisLine.setAttribute("y2", innerH);
      axisLine.setAttribute("stroke", "#9ca3af");
      axisLine.setAttribute("stroke-width", "1.5");
      g.appendChild(axisLine);
      const axisLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
      axisLabel.setAttribute("x", innerW / 2);
      axisLabel.setAttribute("y", innerH + 48);
      axisLabel.setAttribute("text-anchor", "middle");
      axisLabel.setAttribute("font-size", "13");
      axisLabel.setAttribute("fill", "#374151");
      axisLabel.setAttribute("font-weight", "600");
      axisLabel.textContent = "← Minimal Embodiment   Embodiment Score   Maximal Embodiment →";
      g.appendChild(axisLabel);
      const cy = innerH / 2;
      scored.forEach((d) => {
        const cx = xScale(d.total) + d.jx;
        const dotCy = cy + d.jy;
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", cx);
        circle.setAttribute("cy", dotCy);
        circle.setAttribute("r", R);
        circle.setAttribute("fill", getAppColor((d.obs.Application || "").trim()));
        circle.setAttribute("fill-opacity", "0.8");
        circle.setAttribute("stroke", "white");
        circle.setAttribute("stroke-width", "1");
        circle.style.cursor = "pointer";
        circle.style.transition = "r 0.1s, fill-opacity 0.1s";
        circle.addEventListener("mouseenter", (e) => {
          circle.setAttribute("r", R + 3);
          circle.setAttribute("fill-opacity", "1");
          tooltipData.value = d;
          const rect = svgContainer.value.getBoundingClientRect();
          tooltipX.value = e.clientX - rect.left + 12;
          tooltipY.value = e.clientY - rect.top - 10;
        });
        circle.addEventListener("mousemove", (e) => {
          const rect = svgContainer.value.getBoundingClientRect();
          tooltipX.value = e.clientX - rect.left + 12;
          tooltipY.value = e.clientY - rect.top - 10;
        });
        circle.addEventListener("mouseleave", () => {
          circle.setAttribute("r", R);
          circle.setAttribute("fill-opacity", "0.8");
          tooltipData.value = null;
        });
        g.appendChild(circle);
      });
      container.appendChild(svg);
    }
    let resizeObserver = null;
    onMounted(async () => {
      await store.load();
      render();
      resizeObserver = new ResizeObserver(() => render());
      if (svgContainer.value) resizeObserver.observe(svgContainer.value);
    });
    onBeforeUnmount(() => {
      if (resizeObserver) resizeObserver.disconnect();
    });
    function legendEntries() {
      const apps = [...new Set(store.observations.map((o) => (o.Application || "").trim()).filter(Boolean))].sort();
      return apps.map((app) => ({ app, color: appColorMap[app] || "#999" }));
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        _cache[3] || (_cache[3] = createBaseVNode("h1", { class: "page-title" }, "Embodiment Spectrum", -1)),
        _cache[4] || (_cache[4] = createBaseVNode("p", { class: "page-description" }, " This chart plots every observation from minimal physical complexity (single button press) to maximum (full-body bimanual multi-action sequences). It makes visible the paper's claim that mainstream VR has converged on low-embodiment interactions, while edge-case applications push the frontier of embodied interaction design. ", -1)),
        createBaseVNode("div", _hoisted_2, [
          _cache[0] || (_cache[0] = createBaseVNode("h2", { class: "viz-card-title" }, "Embodiment Score Distribution", -1)),
          _cache[1] || (_cache[1] = createBaseVNode("p", { style: { "font-size": "0.85rem", "color": "#6b7280", "margin-bottom": "1rem" } }, " Score = Actions + Handedness bonus (Both=2, One hand=1) + Multi-action bonus (2 if present) ", -1)),
          createBaseVNode("div", {
            ref_key: "svgContainer",
            ref: svgContainer,
            style: { "width": "100%", "overflow": "hidden", "position": "relative" }
          }, null, 512),
          tooltipData.value ? (openBlock(), createElementBlock("div", {
            key: 0,
            style: normalizeStyle({
              position: "absolute",
              left: tooltipX.value + "px",
              top: tooltipY.value + "px",
              background: "rgba(17,24,39,0.95)",
              color: "white",
              padding: "10px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              pointerEvents: "none",
              maxWidth: "260px",
              zIndex: 100,
              boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
              lineHeight: "1.6"
            })
          }, [
            createBaseVNode("div", _hoisted_3, toDisplayString(tooltipData.value.obs.Title), 1),
            createBaseVNode("div", _hoisted_4, toDisplayString(tooltipData.value.obs.Application), 1),
            createBaseVNode("div", _hoisted_5, toDisplayString(tooltipData.value.obs.Interaction_Technique), 1),
            createBaseVNode("div", _hoisted_6, [
              createBaseVNode("div", null, "Actions: " + toDisplayString(tooltipData.value.actionScore) + " (" + toDisplayString(tooltipData.value.actions.join(", ") || "—") + ")", 1),
              createBaseVNode("div", null, "Handedness bonus: " + toDisplayString(tooltipData.value.handednessBonus) + " (" + toDisplayString(tooltipData.value.obs.Handedness || "—") + ")", 1),
              createBaseVNode("div", null, "Multi-action bonus: " + toDisplayString(tooltipData.value.multiActionBonus) + " (" + toDisplayString(tooltipData.value.obs.Multi_Action || "none") + ")", 1),
              createBaseVNode("div", _hoisted_7, "Total score: " + toDisplayString(tooltipData.value.total), 1)
            ])
          ], 4)) : createCommentVNode("", true)
        ]),
        createBaseVNode("div", _hoisted_8, [
          _cache[2] || (_cache[2] = createBaseVNode("h2", { class: "viz-card-title" }, "Applications", -1)),
          createBaseVNode("div", _hoisted_9, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(legendEntries(), (entry) => {
              return openBlock(), createElementBlock("div", {
                key: entry.app,
                style: { "display": "flex", "align-items": "center", "gap": "6px", "font-size": "13px", "color": "#374151" }
              }, [
                createBaseVNode("span", {
                  style: normalizeStyle({ display: "inline-block", width: "12px", height: "12px", borderRadius: "50%", background: entry.color, flexShrink: 0 })
                }, null, 4),
                createTextVNode(" " + toDisplayString(entry.app), 1)
              ]);
            }), 128))
          ])
        ]),
        unref(store).loading ? (openBlock(), createElementBlock("div", _hoisted_10, " Loading observations… ")) : createCommentVNode("", true),
        unref(store).error ? (openBlock(), createElementBlock("div", _hoisted_11, " Error: " + toDisplayString(unref(store).error), 1)) : createCommentVNode("", true)
      ]);
    };
  }
};
export {
  _sfc_main as default
};
//# sourceMappingURL=EmbodimentView-fgkyXBat.js.map
