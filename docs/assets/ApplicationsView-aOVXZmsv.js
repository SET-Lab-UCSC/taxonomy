import { u as useDataStore, o as onMounted, g as ref, w as watch, c as createElementBlock, a as createVNode, b as unref, t as toDisplayString, F as Fragment, d as createBaseVNode, r as renderList, f as computed, h as openBlock, n as normalizeClass, i as createBlock, _ as _sfc_main$2 } from "./index-oTcuwcvi.js";
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
const _hoisted_4 = { class: "apps-layout" };
const _hoisted_5 = { class: "apps-sidebar" };
const _hoisted_6 = ["onClick"];
const _hoisted_7 = { class: "app-detail" };
const _hoisted_8 = { class: "app-detail-name" };
const _hoisted_9 = { class: "app-meta-grid" };
const _hoisted_10 = { class: "app-meta-item" };
const _hoisted_11 = { class: "app-meta-value" };
const _hoisted_12 = { class: "app-meta-item" };
const _hoisted_13 = { class: "app-meta-value" };
const _hoisted_14 = { class: "app-meta-item" };
const _hoisted_15 = { class: "app-meta-value" };
const _hoisted_16 = { class: "app-meta-item" };
const _hoisted_17 = { class: "app-meta-value" };
const _hoisted_18 = { class: "obs-gallery" };
const _hoisted_19 = {
  key: 1,
  class: "app-detail-placeholder"
};
const _sfc_main = {
  __name: "ApplicationsView",
  setup(__props) {
    const store = useDataStore();
    onMounted(async () => {
      await store.load();
      if (store.applications.length) selectedApp.value = store.applications[0];
    });
    const selectedApp = ref(null);
    const selectedObs = ref(null);
    const appObservations = computed(
      () => selectedApp.value ? store.observationsByApplication(selectedApp.value) : []
    );
    function uniqueMeta(field) {
      return [...new Set(appObservations.value.map((o) => (o[field] || "").trim()).filter(Boolean))].join(", ") || "—";
    }
    watch(() => store.applications, (apps) => {
      if (apps.length && !selectedApp.value) selectedApp.value = apps[0];
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("main", _hoisted_1, [
        unref(store).loading ? (openBlock(), createElementBlock("div", _hoisted_2, "Loading…")) : unref(store).error ? (openBlock(), createElementBlock("div", _hoisted_3, "Error: " + toDisplayString(unref(store).error), 1)) : (openBlock(), createElementBlock(Fragment, { key: 2 }, [
          _cache[7] || (_cache[7] = createBaseVNode("div", { class: "page-header" }, [
            createBaseVNode("h2", { class: "page-title" }, "Applications")
          ], -1)),
          createBaseVNode("div", _hoisted_4, [
            createBaseVNode("aside", _hoisted_5, [
              _cache[2] || (_cache[2] = createBaseVNode("div", { class: "apps-sidebar-title" }, "Applications", -1)),
              (openBlock(true), createElementBlock(Fragment, null, renderList(unref(store).applications, (app) => {
                return openBlock(), createElementBlock("div", {
                  key: app,
                  class: normalizeClass(["app-list-item", { active: selectedApp.value === app }]),
                  onClick: ($event) => selectedApp.value = app
                }, toDisplayString(app), 11, _hoisted_6);
              }), 128))
            ]),
            createBaseVNode("section", _hoisted_7, [
              selectedApp.value ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                createBaseVNode("h2", _hoisted_8, toDisplayString(selectedApp.value), 1),
                createBaseVNode("div", _hoisted_9, [
                  createBaseVNode("div", _hoisted_10, [
                    _cache[3] || (_cache[3] = createBaseVNode("div", { class: "app-meta-label" }, "Genre", -1)),
                    createBaseVNode("div", _hoisted_11, toDisplayString(uniqueMeta("Genre")), 1)
                  ]),
                  createBaseVNode("div", _hoisted_12, [
                    _cache[4] || (_cache[4] = createBaseVNode("div", { class: "app-meta-label" }, "Platforms", -1)),
                    createBaseVNode("div", _hoisted_13, toDisplayString(uniqueMeta("Supported_Platforms")), 1)
                  ]),
                  createBaseVNode("div", _hoisted_14, [
                    _cache[5] || (_cache[5] = createBaseVNode("div", { class: "app-meta-label" }, "Cost", -1)),
                    createBaseVNode("div", _hoisted_15, toDisplayString(uniqueMeta("Cost")), 1)
                  ]),
                  createBaseVNode("div", _hoisted_16, [
                    _cache[6] || (_cache[6] = createBaseVNode("div", { class: "app-meta-label" }, "Scale of Use", -1)),
                    createBaseVNode("div", _hoisted_17, toDisplayString(uniqueMeta("Scale_Of_Use")), 1)
                  ])
                ]),
                createBaseVNode("div", _hoisted_18, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(appObservations.value, (obs) => {
                    return openBlock(), createBlock(_sfc_main$2, {
                      key: obs.Title + obs.Application,
                      observation: obs,
                      clickable: true,
                      onClick: _cache[0] || (_cache[0] = ($event) => selectedObs.value = $event)
                    }, null, 8, ["observation"]);
                  }), 128))
                ])
              ], 64)) : (openBlock(), createElementBlock("div", _hoisted_19, "Select an application to explore"))
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
//# sourceMappingURL=ApplicationsView-aOVXZmsv.js.map
