import { u as useDataStore, o as onMounted, c as createElementBlock, d as createBaseVNode, F as Fragment, r as renderList, e as computed, h as openBlock, t as toDisplayString, q as normalizeStyle } from "./index-BERREmoa.js";
const _hoisted_1 = { class: "main-content" };
const _hoisted_2 = { class: "viz-card" };
const _hoisted_3 = { class: "matrix-wrapper" };
const _hoisted_4 = { class: "matrix-table" };
const _hoisted_5 = { class: "row-label" };
const _hoisted_6 = {
  class: "viz-card",
  style: { "margin-top": "2rem" }
};
const _hoisted_7 = { class: "matrix-wrapper" };
const _hoisted_8 = { class: "matrix-table" };
const _hoisted_9 = { class: "row-label" };
const _sfc_main = {
  __name: "FeedbackMatrixView",
  setup(__props) {
    const store = useDataStore();
    onMounted(async () => {
      await store.load();
    });
    const MODALITIES = ["Haptic", "Audio", "Visual", "UI Change", "Physics", "Other"];
    function classifyToken(token) {
      const t = token.toLowerCase().trim();
      if (!t) return null;
      if (/haptic|rumble|vibrat/.test(t)) return "Haptic";
      if (/audio|sound|music/.test(t)) return "Audio";
      if (/highlight|visual|color|glow|particle|flash|effect|animation/.test(t)) return "Visual";
      if (/ui|menu|indicator|light|text|button/.test(t)) return "UI Change";
      if (/physics|weight|weighted|move|moving/.test(t)) return "Physics";
      return "Other";
    }
    function parseModalities(value) {
      if (!value) return /* @__PURE__ */ new Set();
      const tokens = value.split(",").map((s) => s.trim()).filter(Boolean);
      const result = /* @__PURE__ */ new Set();
      for (const tok of tokens) {
        const cat = classifyToken(tok);
        if (cat) result.add(cat);
      }
      return result;
    }
    function buildRows(column) {
      const obs = store.observations;
      const appMap = {};
      for (const o of obs) {
        const app = (o.Application || "").trim();
        if (!app) continue;
        if (!appMap[app]) appMap[app] = [];
        appMap[app].push(o);
      }
      const rows = Object.entries(appMap).map(([app, items]) => {
        const counts = {};
        for (const mod of MODALITIES) counts[mod] = 0;
        for (const item of items) {
          const mods = parseModalities(item[column]);
          for (const mod of mods) {
            if (counts[mod] !== void 0) counts[mod]++;
          }
        }
        return { app, counts, total: items.length };
      });
      rows.sort((a, b) => b.total - a.total);
      return rows;
    }
    const feedbackRows = computed(() => buildRows("Feedback"));
    const feedforwardRows = computed(() => buildRows("Feedforward"));
    function maxByModality(rows) {
      const maxes = {};
      for (const mod of MODALITIES) {
        maxes[mod] = Math.max(...rows.map((r) => r.counts[mod] || 0), 1);
      }
      return maxes;
    }
    const feedbackMaxByModality = computed(() => maxByModality(feedbackRows.value));
    const feedforwardMaxByModality = computed(() => maxByModality(feedforwardRows.value));
    function cellStyle(count, maxCount) {
      if (!count) return { backgroundColor: "#fff", color: "#333" };
      const ratio = count / maxCount;
      const alpha = 0.1 + ratio * 0.8;
      const textColor = alpha > 0.5 ? "#fff" : "#222";
      return {
        backgroundColor: `rgba(205,55,53,${alpha.toFixed(3)})`,
        color: textColor,
        fontWeight: alpha > 0.5 ? "600" : "400"
      };
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        _cache[6] || (_cache[6] = createBaseVNode("h1", { class: "page-title" }, "Feedback Modality Coverage", -1)),
        _cache[7] || (_cache[7] = createBaseVNode("p", { class: "page-description" }, " This matrix shows which feedback modalities each application uses across its observations. Haptic feedback is nearly universal on Meta Quest hardware; visual highlighting is the most common feedforward substitute; and feedforward (anticipatory cues) is dramatically underused compared to feedback — revealing a gap in VR interaction design. ", -1)),
        createBaseVNode("div", _hoisted_2, [
          _cache[2] || (_cache[2] = createBaseVNode("div", { class: "viz-card-title" }, "Feedback Coverage", -1)),
          createBaseVNode("div", _hoisted_3, [
            createBaseVNode("table", _hoisted_4, [
              createBaseVNode("thead", null, [
                createBaseVNode("tr", null, [
                  _cache[0] || (_cache[0] = createBaseVNode("th", { class: "row-header" }, "Application", -1)),
                  (openBlock(), createElementBlock(Fragment, null, renderList(MODALITIES, (mod) => {
                    return createBaseVNode("th", { key: mod }, toDisplayString(mod), 1);
                  }), 64)),
                  _cache[1] || (_cache[1] = createBaseVNode("th", null, "Total obs", -1))
                ])
              ]),
              createBaseVNode("tbody", null, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(feedbackRows.value, (row) => {
                  return openBlock(), createElementBlock("tr", {
                    key: row.app
                  }, [
                    createBaseVNode("td", _hoisted_5, toDisplayString(row.app), 1),
                    (openBlock(), createElementBlock(Fragment, null, renderList(MODALITIES, (mod) => {
                      return createBaseVNode("td", {
                        key: mod,
                        style: normalizeStyle(cellStyle(row.counts[mod], feedbackMaxByModality.value[mod]))
                      }, toDisplayString(row.counts[mod] || ""), 5);
                    }), 64)),
                    createBaseVNode("td", null, toDisplayString(row.total), 1)
                  ]);
                }), 128))
              ])
            ])
          ])
        ]),
        createBaseVNode("div", _hoisted_6, [
          _cache[5] || (_cache[5] = createBaseVNode("div", { class: "viz-card-title" }, "Feedforward Coverage", -1)),
          createBaseVNode("div", _hoisted_7, [
            createBaseVNode("table", _hoisted_8, [
              createBaseVNode("thead", null, [
                createBaseVNode("tr", null, [
                  _cache[3] || (_cache[3] = createBaseVNode("th", { class: "row-header" }, "Application", -1)),
                  (openBlock(), createElementBlock(Fragment, null, renderList(MODALITIES, (mod) => {
                    return createBaseVNode("th", { key: mod }, toDisplayString(mod), 1);
                  }), 64)),
                  _cache[4] || (_cache[4] = createBaseVNode("th", null, "Total obs", -1))
                ])
              ]),
              createBaseVNode("tbody", null, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(feedforwardRows.value, (row) => {
                  return openBlock(), createElementBlock("tr", {
                    key: row.app
                  }, [
                    createBaseVNode("td", _hoisted_9, toDisplayString(row.app), 1),
                    (openBlock(), createElementBlock(Fragment, null, renderList(MODALITIES, (mod) => {
                      return createBaseVNode("td", {
                        key: mod,
                        style: normalizeStyle(cellStyle(row.counts[mod], feedforwardMaxByModality.value[mod]))
                      }, toDisplayString(row.counts[mod] || ""), 5);
                    }), 64)),
                    createBaseVNode("td", null, toDisplayString(row.total), 1)
                  ]);
                }), 128))
              ])
            ])
          ])
        ])
      ]);
    };
  }
};
export {
  _sfc_main as default
};
//# sourceMappingURL=FeedbackMatrixView-D1HQ3m1A.js.map
