import { u as useDataStore, o as onMounted, e as computed, g as ref, w as watch, c as createElementBlock, a as createVNode, b as unref, t as toDisplayString, F as Fragment, d as createBaseVNode, f as createCommentVNode, r as renderList, h as openBlock, n as normalizeClass, i as createBlock, _ as _sfc_main$2 } from "./index-HcNk-XNx.js";
import { _ as _sfc_main$1 } from "./ObservationModal-BC_QVNYl.js";
const _hoisted_1 = { class: "main-content" };
const _hoisted_2 = {
  key: 0,
  class: "loading-state"
};
const _hoisted_3 = {
  key: 1,
  class: "chart-error"
};
const _hoisted_4 = { style: { "margin-bottom": "0.75rem" } };
const _hoisted_5 = { style: { "color": "#6b7280", "font-size": "0.9rem", "margin": "0" } };
const _hoisted_6 = {
  key: 0,
  class: "filter-panel",
  style: { "position": "static", "border-left": "none", "padding-left": "0", "border-bottom": "1px solid #e5e7eb", "margin-bottom": "1.5rem", "padding-bottom": "1rem", "width": "100%" }
};
const _hoisted_7 = { class: "filter-panel-header" };
const _hoisted_8 = { class: "activity-filter-bar" };
const _hoisted_9 = ["onClick"];
const _hoisted_10 = { class: "apps-layout" };
const _hoisted_11 = { class: "apps-sidebar" };
const _hoisted_12 = ["onClick"];
const _hoisted_13 = { class: "app-detail" };
const _hoisted_14 = { class: "app-detail-name" };
const _hoisted_15 = { class: "app-meta-grid" };
const _hoisted_16 = { class: "app-meta-item" };
const _hoisted_17 = { class: "app-meta-value" };
const _hoisted_18 = { class: "app-meta-item" };
const _hoisted_19 = { class: "app-meta-value" };
const _hoisted_20 = { style: { "color": "#6b7280", "font-size": "0.9rem", "margin-bottom": "1rem" } };
const _hoisted_21 = { class: "obs-gallery" };
const _hoisted_22 = {
  key: 1,
  class: "app-detail-placeholder"
};
const _sfc_main = {
  __name: "ApplicationsView",
  setup(__props) {
    const store = useDataStore();
    onMounted(async () => {
      await store.load();
      if (filteredApps.value.length) selectedApp.value = filteredApps.value[0];
    });
    const selectedApp = ref(null);
    const selectedObs = ref(null);
    const activeGenres = ref(/* @__PURE__ */ new Set());
    const allGenres = computed(() => {
      const genres = /* @__PURE__ */ new Set();
      store.observations.forEach((o) => {
        const g = (o.Genre || "").trim();
        if (g) genres.add(g);
      });
      return [...genres].sort();
    });
    function appGenre(app) {
      const obs = store.observations.find((o) => o.Application === app && o.Genre);
      return ((obs == null ? void 0 : obs.Genre) || "").trim();
    }
    const filteredApps = computed(() => {
      if (activeGenres.value.size === 0) return store.applications;
      return store.applications.filter((app) => activeGenres.value.has(appGenre(app)));
    });
    const appObservations = computed(
      () => selectedApp.value ? store.observationsByApplication(selectedApp.value) : []
    );
    function uniqueMeta(field) {
      return [...new Set(appObservations.value.map((o) => (o[field] || "").trim()).filter(Boolean))].join(", ") || "—";
    }
    function toggleGenre(g) {
      const next = new Set(activeGenres.value);
      if (next.has(g)) next.delete(g);
      else next.add(g);
      activeGenres.value = next;
    }
    function clearGenres() {
      activeGenres.value = /* @__PURE__ */ new Set();
    }
    watch(filteredApps, (apps) => {
      if (!apps.includes(selectedApp.value)) {
        selectedApp.value = apps[0] || null;
      }
    });
    watch(() => store.applications, (apps) => {
      if (apps.length && !selectedApp.value) selectedApp.value = apps[0];
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("main", _hoisted_1, [
        unref(store).loading ? (openBlock(), createElementBlock("div", _hoisted_2, "Loading…")) : unref(store).error ? (openBlock(), createElementBlock("div", _hoisted_3, "Error: " + toDisplayString(unref(store).error), 1)) : (openBlock(), createElementBlock(Fragment, { key: 2 }, [
          createBaseVNode("div", _hoisted_4, [
            _cache[2] || (_cache[2] = createBaseVNode("h2", {
              class: "page-title",
              style: { "margin-bottom": "0" }
            }, "Applications", -1)),
            createBaseVNode("p", _hoisted_5, "Viewing " + toDisplayString(filteredApps.value.length) + " application" + toDisplayString(filteredApps.value.length === 1 ? "" : "s"), 1)
          ]),
          allGenres.value.length ? (openBlock(), createElementBlock("div", _hoisted_6, [
            createBaseVNode("div", _hoisted_7, [
              _cache[3] || (_cache[3] = createBaseVNode("span", { class: "filter-panel-title" }, "Filter by Genre", -1)),
              activeGenres.value.size > 0 ? (openBlock(), createElementBlock("button", {
                key: 0,
                class: "activity-chip-clear",
                onClick: clearGenres
              }, "✕ Clear")) : createCommentVNode("", true)
            ]),
            createBaseVNode("div", _hoisted_8, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(allGenres.value, (g) => {
                return openBlock(), createElementBlock("button", {
                  key: g,
                  class: normalizeClass(["activity-chip", { active: activeGenres.value.has(g) }]),
                  onClick: ($event) => toggleGenre(g)
                }, toDisplayString(g), 11, _hoisted_9);
              }), 128))
            ])
          ])) : createCommentVNode("", true),
          createBaseVNode("div", _hoisted_10, [
            createBaseVNode("aside", _hoisted_11, [
              _cache[4] || (_cache[4] = createBaseVNode("div", { class: "apps-sidebar-title" }, "Applications", -1)),
              (openBlock(true), createElementBlock(Fragment, null, renderList(filteredApps.value, (app) => {
                return openBlock(), createElementBlock("div", {
                  key: app,
                  class: normalizeClass(["app-list-item", { active: selectedApp.value === app }]),
                  onClick: ($event) => selectedApp.value = app
                }, toDisplayString(app), 11, _hoisted_12);
              }), 128))
            ]),
            createBaseVNode("section", _hoisted_13, [
              selectedApp.value ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                createBaseVNode("h2", _hoisted_14, toDisplayString(selectedApp.value), 1),
                createBaseVNode("div", _hoisted_15, [
                  createBaseVNode("div", _hoisted_16, [
                    _cache[5] || (_cache[5] = createBaseVNode("div", { class: "app-meta-label" }, "Genre", -1)),
                    createBaseVNode("div", _hoisted_17, toDisplayString(uniqueMeta("Genre")), 1)
                  ]),
                  createBaseVNode("div", _hoisted_18, [
                    _cache[6] || (_cache[6] = createBaseVNode("div", { class: "app-meta-label" }, "Platforms", -1)),
                    createBaseVNode("div", _hoisted_19, toDisplayString(uniqueMeta("Supported_Platforms")), 1)
                  ])
                ]),
                createBaseVNode("p", _hoisted_20, toDisplayString(appObservations.value.length) + " observation" + toDisplayString(appObservations.value.length === 1 ? "" : "s"), 1),
                createBaseVNode("div", _hoisted_21, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(appObservations.value, (obs) => {
                    return openBlock(), createBlock(_sfc_main$2, {
                      key: obs.Title + obs.Application,
                      observation: obs,
                      clickable: true,
                      onClick: _cache[0] || (_cache[0] = ($event) => selectedObs.value = $event)
                    }, null, 8, ["observation"]);
                  }), 128))
                ])
              ], 64)) : (openBlock(), createElementBlock("div", _hoisted_22, "Select an application to explore"))
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
//# sourceMappingURL=ApplicationsView-Damfyb7g.js.map
