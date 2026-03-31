import { u as useDataStore, o as onMounted, c as createElementBlock, a as createVNode, b as unref, t as toDisplayString, F as Fragment, d as createBaseVNode, e as createCommentVNode, r as renderList, f as computed, g as ref, h as openBlock, i as createBlock, _ as _sfc_main$2, n as normalizeClass } from "./index-oTcuwcvi.js";
import { _ as _sfc_main$1 } from "./ObservationModal-BirppGVs.js";
const _hoisted_1 = { class: "main-content" };
const _hoisted_2 = {
  key: 0,
  class: "loading-state"
};
const _hoisted_3 = {
  key: 1,
  class: "chart-error"
};
const _hoisted_4 = { class: "home-layout" };
const _hoisted_5 = { class: "technique-gallery-wrapper" };
const _hoisted_6 = { class: "obs-gallery" };
const _hoisted_7 = {
  key: 0,
  style: { "color": "#9ca3af", "margin-top": "2rem" }
};
const _hoisted_8 = { class: "filter-panel" };
const _hoisted_9 = { class: "filter-panel-header" };
const _hoisted_10 = { class: "activity-filter-section" };
const _hoisted_11 = { class: "activity-filter-bar" };
const _hoisted_12 = ["onClick"];
const _hoisted_13 = { class: "activity-filter-section" };
const _hoisted_14 = { class: "activity-filter-bar" };
const _hoisted_15 = ["onClick"];
const _hoisted_16 = { class: "activity-filter-section" };
const _hoisted_17 = { class: "activity-filter-bar" };
const _hoisted_18 = ["onClick"];
const _hoisted_19 = { class: "activity-filter-section" };
const _hoisted_20 = { class: "activity-filter-bar" };
const _hoisted_21 = ["onClick"];
const _hoisted_22 = { class: "activity-filter-section" };
const _hoisted_23 = { class: "activity-filter-bar" };
const _hoisted_24 = ["onClick"];
const _hoisted_25 = { class: "activity-filter-section" };
const _hoisted_26 = { class: "activity-filter-bar" };
const _hoisted_27 = ["onClick"];
const _sfc_main = {
  __name: "ObservationsView",
  setup(__props) {
    const store = useDataStore();
    onMounted(() => store.load());
    const activeFilters = ref({
      Application: /* @__PURE__ */ new Set(),
      Interaction_Technique: /* @__PURE__ */ new Set(),
      Activity: /* @__PURE__ */ new Set(),
      Task: /* @__PURE__ */ new Set(),
      Handedness: /* @__PURE__ */ new Set(),
      Multi_Action: /* @__PURE__ */ new Set()
    });
    function uniqueChipValues(field) {
      return computed(() => {
        const vals = /* @__PURE__ */ new Set();
        store.observations.forEach((o) => {
          (o[field] || "").split(",").map((v) => v.trim()).filter(Boolean).forEach((v) => vals.add(v));
        });
        return [...vals].sort();
      });
    }
    const allApps = uniqueChipValues("Application");
    const allTechniques = uniqueChipValues("Interaction_Technique");
    const allActivities = uniqueChipValues("Activity");
    const allTasks = uniqueChipValues("Task");
    const allHandedness = uniqueChipValues("Handedness");
    const allMultiAction = uniqueChipValues("Multi_Action");
    const anyActive = computed(() => Object.values(activeFilters.value).some((s) => s.size > 0));
    const filtered = computed(() => {
      if (!anyActive.value) return store.observations;
      return store.observations.filter((o) => {
        return Object.entries(activeFilters.value).every(([field, selected]) => {
          if (selected.size === 0) return true;
          const vals = (o[field] || "").split(",").map((v) => v.trim());
          return vals.some((v) => selected.has(v));
        });
      });
    });
    function toggle(field, value) {
      const next = new Set(activeFilters.value[field]);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      activeFilters.value[field] = next;
    }
    function clearAll() {
      Object.keys(activeFilters.value).forEach((k) => {
        activeFilters.value[k] = /* @__PURE__ */ new Set();
      });
    }
    const selectedObs = ref(null);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("main", _hoisted_1, [
        unref(store).loading ? (openBlock(), createElementBlock("div", _hoisted_2, "Loading…")) : unref(store).error ? (openBlock(), createElementBlock("div", _hoisted_3, "Error: " + toDisplayString(unref(store).error), 1)) : (openBlock(), createElementBlock(Fragment, { key: 2 }, [
          _cache[9] || (_cache[9] = createBaseVNode("div", { class: "page-header" }, [
            createBaseVNode("h2", { class: "page-title" }, "Observations")
          ], -1)),
          createBaseVNode("div", _hoisted_4, [
            createBaseVNode("div", _hoisted_5, [
              createBaseVNode("div", _hoisted_6, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(filtered.value, (obs) => {
                  return openBlock(), createBlock(_sfc_main$2, {
                    key: obs.Title + obs.Application,
                    observation: obs,
                    clickable: true,
                    "pause-gif": true,
                    onClick: _cache[0] || (_cache[0] = ($event) => selectedObs.value = $event)
                  }, null, 8, ["observation"]);
                }), 128))
              ]),
              filtered.value.length === 0 ? (openBlock(), createElementBlock("p", _hoisted_7, "No observations match your filters.")) : createCommentVNode("", true)
            ]),
            createBaseVNode("aside", _hoisted_8, [
              createBaseVNode("div", _hoisted_9, [
                _cache[2] || (_cache[2] = createBaseVNode("span", { class: "filter-panel-title" }, "Filter Observations", -1)),
                anyActive.value ? (openBlock(), createElementBlock("button", {
                  key: 0,
                  class: "activity-chip-clear",
                  onClick: clearAll
                }, "✕ Clear all")) : createCommentVNode("", true)
              ]),
              createBaseVNode("div", _hoisted_10, [
                _cache[3] || (_cache[3] = createBaseVNode("div", { class: "activity-filter-label" }, "Application", -1)),
                createBaseVNode("div", _hoisted_11, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(unref(allApps), (v) => {
                    return openBlock(), createElementBlock("button", {
                      key: v,
                      class: normalizeClass(["activity-chip", { active: activeFilters.value.Application.has(v) }]),
                      onClick: ($event) => toggle("Application", v)
                    }, toDisplayString(v), 11, _hoisted_12);
                  }), 128))
                ])
              ]),
              createBaseVNode("div", _hoisted_13, [
                _cache[4] || (_cache[4] = createBaseVNode("div", { class: "activity-filter-label" }, "Interaction Technique", -1)),
                createBaseVNode("div", _hoisted_14, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(unref(allTechniques), (v) => {
                    return openBlock(), createElementBlock("button", {
                      key: v,
                      class: normalizeClass(["activity-chip", { active: activeFilters.value.Interaction_Technique.has(v) }]),
                      onClick: ($event) => toggle("Interaction_Technique", v)
                    }, toDisplayString(v), 11, _hoisted_15);
                  }), 128))
                ])
              ]),
              createBaseVNode("div", _hoisted_16, [
                _cache[5] || (_cache[5] = createBaseVNode("div", { class: "activity-filter-label" }, "Activity", -1)),
                createBaseVNode("div", _hoisted_17, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(unref(allActivities), (v) => {
                    return openBlock(), createElementBlock("button", {
                      key: v,
                      class: normalizeClass(["activity-chip", { active: activeFilters.value.Activity.has(v) }]),
                      onClick: ($event) => toggle("Activity", v)
                    }, toDisplayString(v), 11, _hoisted_18);
                  }), 128))
                ])
              ]),
              createBaseVNode("div", _hoisted_19, [
                _cache[6] || (_cache[6] = createBaseVNode("div", { class: "activity-filter-label" }, "Task", -1)),
                createBaseVNode("div", _hoisted_20, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(unref(allTasks), (v) => {
                    return openBlock(), createElementBlock("button", {
                      key: v,
                      class: normalizeClass(["activity-chip", { active: activeFilters.value.Task.has(v) }]),
                      onClick: ($event) => toggle("Task", v)
                    }, toDisplayString(v), 11, _hoisted_21);
                  }), 128))
                ])
              ]),
              createBaseVNode("div", _hoisted_22, [
                _cache[7] || (_cache[7] = createBaseVNode("div", { class: "activity-filter-label" }, "Handedness", -1)),
                createBaseVNode("div", _hoisted_23, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(unref(allHandedness), (v) => {
                    return openBlock(), createElementBlock("button", {
                      key: v,
                      class: normalizeClass(["activity-chip", { active: activeFilters.value.Handedness.has(v) }]),
                      onClick: ($event) => toggle("Handedness", v)
                    }, toDisplayString(v), 11, _hoisted_24);
                  }), 128))
                ])
              ]),
              createBaseVNode("div", _hoisted_25, [
                _cache[8] || (_cache[8] = createBaseVNode("div", { class: "activity-filter-label" }, "Multi-action", -1)),
                createBaseVNode("div", _hoisted_26, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(unref(allMultiAction), (v) => {
                    return openBlock(), createElementBlock("button", {
                      key: v,
                      class: normalizeClass(["activity-chip", { active: activeFilters.value.Multi_Action.has(v) }]),
                      onClick: ($event) => toggle("Multi_Action", v)
                    }, toDisplayString(v), 11, _hoisted_27);
                  }), 128))
                ])
              ])
            ])
          ])
        ], 64)),
        createVNode(_sfc_main$1, {
          observation: selectedObs.value,
          show: !!selectedObs.value,
          onClose: _cache[1] || (_cache[1] = ($event) => selectedObs.value = null)
        }, null, 8, ["observation", "show"])
      ]);
    };
  }
};
export {
  _sfc_main as default
};
//# sourceMappingURL=ObservationsView-BGoi3reh.js.map
