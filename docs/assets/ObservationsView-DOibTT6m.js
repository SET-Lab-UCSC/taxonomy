import { u as useDataStore, o as onMounted, c as createElementBlock, a as createVNode, b as unref, t as toDisplayString, F as Fragment, d as createBaseVNode, e as createCommentVNode, f as createTextVNode, w as withDirectives, v as vModelSelect, r as ref, g as renderList, h as computed, i as openBlock, j as createBlock, _ as _sfc_main$2 } from "./index-5b4tOJXx.js";
import { _ as _sfc_main$1 } from "./ObservationModal-CIOn42JA.js";
const _hoisted_1 = { class: "main-content" };
const _hoisted_2 = {
  key: 0,
  class: "loading-state"
};
const _hoisted_3 = {
  key: 1,
  class: "chart-error"
};
const _hoisted_4 = { class: "filter-bar" };
const _hoisted_5 = ["value"];
const _hoisted_6 = ["value"];
const _hoisted_7 = ["value"];
const _hoisted_8 = ["value"];
const _hoisted_9 = { class: "obs-gallery" };
const _hoisted_10 = {
  key: 0,
  style: { "color": "#9ca3af" }
};
const _sfc_main = {
  __name: "ObservationsView",
  setup(__props) {
    const store = useDataStore();
    onMounted(() => store.load());
    const filterApp = ref("");
    const filterTechnique = ref("");
    const filterGenre = ref("");
    const filterYear = ref("");
    const uniqueValues = (field) => computed(() => {
      const vals = store.observations.map((o) => (o[field] || "").trim()).filter(Boolean);
      return [...new Set(vals)].sort();
    });
    const apps = uniqueValues("Application");
    const techniques = uniqueValues("Interaction_Technique");
    const genres = uniqueValues("Genre");
    const years = uniqueValues("Year");
    const filtered = computed(() => {
      return store.observations.filter((o) => {
        if (filterApp.value && (o.Application || "").trim() !== filterApp.value) return false;
        if (filterTechnique.value) {
          const techs = (o.Interaction_Technique || "").split(",").map((t) => t.trim());
          if (!techs.includes(filterTechnique.value)) return false;
        }
        if (filterGenre.value && (o.Genre || "").trim() !== filterGenre.value) return false;
        if (filterYear.value && (o.Year || "").trim() !== filterYear.value) return false;
        return true;
      });
    });
    const selectedObs = ref(null);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("main", _hoisted_1, [
        unref(store).loading ? (openBlock(), createElementBlock("div", _hoisted_2, "Loading…")) : unref(store).error ? (openBlock(), createElementBlock("div", _hoisted_3, "Error: " + toDisplayString(unref(store).error), 1)) : (openBlock(), createElementBlock(Fragment, { key: 2 }, [
          _cache[14] || (_cache[14] = createBaseVNode("div", { class: "page-header" }, [
            createBaseVNode("h2", { class: "page-title" }, "Observations")
          ], -1)),
          createBaseVNode("div", _hoisted_4, [
            createBaseVNode("label", null, [
              _cache[7] || (_cache[7] = createTextVNode("Application ", -1)),
              withDirectives(createBaseVNode("select", {
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => filterApp.value = $event)
              }, [
                _cache[6] || (_cache[6] = createBaseVNode("option", { value: "" }, "All", -1)),
                (openBlock(true), createElementBlock(Fragment, null, renderList(unref(apps), (v) => {
                  return openBlock(), createElementBlock("option", {
                    key: v,
                    value: v
                  }, toDisplayString(v), 9, _hoisted_5);
                }), 128))
              ], 512), [
                [vModelSelect, filterApp.value]
              ])
            ]),
            createBaseVNode("label", null, [
              _cache[9] || (_cache[9] = createTextVNode("Technique ", -1)),
              withDirectives(createBaseVNode("select", {
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => filterTechnique.value = $event)
              }, [
                _cache[8] || (_cache[8] = createBaseVNode("option", { value: "" }, "All", -1)),
                (openBlock(true), createElementBlock(Fragment, null, renderList(unref(techniques), (v) => {
                  return openBlock(), createElementBlock("option", {
                    key: v,
                    value: v
                  }, toDisplayString(v), 9, _hoisted_6);
                }), 128))
              ], 512), [
                [vModelSelect, filterTechnique.value]
              ])
            ]),
            createBaseVNode("label", null, [
              _cache[11] || (_cache[11] = createTextVNode("Genre ", -1)),
              withDirectives(createBaseVNode("select", {
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => filterGenre.value = $event)
              }, [
                _cache[10] || (_cache[10] = createBaseVNode("option", { value: "" }, "All", -1)),
                (openBlock(true), createElementBlock(Fragment, null, renderList(unref(genres), (v) => {
                  return openBlock(), createElementBlock("option", {
                    key: v,
                    value: v
                  }, toDisplayString(v), 9, _hoisted_7);
                }), 128))
              ], 512), [
                [vModelSelect, filterGenre.value]
              ])
            ]),
            createBaseVNode("label", null, [
              _cache[13] || (_cache[13] = createTextVNode("Year ", -1)),
              withDirectives(createBaseVNode("select", {
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => filterYear.value = $event)
              }, [
                _cache[12] || (_cache[12] = createBaseVNode("option", { value: "" }, "All", -1)),
                (openBlock(true), createElementBlock(Fragment, null, renderList(unref(years), (v) => {
                  return openBlock(), createElementBlock("option", {
                    key: v,
                    value: v
                  }, toDisplayString(v), 9, _hoisted_8);
                }), 128))
              ], 512), [
                [vModelSelect, filterYear.value]
              ])
            ])
          ]),
          createBaseVNode("div", _hoisted_9, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(filtered.value, (obs) => {
              return openBlock(), createBlock(_sfc_main$2, {
                key: obs.Title + obs.Application,
                observation: obs,
                clickable: true,
                onClick: _cache[4] || (_cache[4] = ($event) => selectedObs.value = $event)
              }, null, 8, ["observation"]);
            }), 128))
          ]),
          filtered.value.length === 0 ? (openBlock(), createElementBlock("p", _hoisted_10, "No observations match your filters.")) : createCommentVNode("", true)
        ], 64)),
        createVNode(_sfc_main$1, {
          observation: selectedObs.value,
          show: !!selectedObs.value,
          onClose: _cache[5] || (_cache[5] = ($event) => selectedObs.value = null)
        }, null, 8, ["observation", "show"])
      ]);
    };
  }
};
export {
  _sfc_main as default
};
//# sourceMappingURL=ObservationsView-DOibTT6m.js.map
