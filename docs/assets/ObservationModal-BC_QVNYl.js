import { i as createBlock, h as openBlock, c as createElementBlock, f as createCommentVNode, d as createBaseVNode, F as Fragment, r as renderList, t as toDisplayString, j as withModifiers, T as Teleport } from "./index-HcNk-XNx.js";
const _hoisted_1 = { class: "modal-content" };
const _hoisted_2 = ["src", "alt"];
const _hoisted_3 = {
  key: 1,
  class: "obs-card-image-placeholder gradient-placeholder",
  style: { "border-radius": "8px", "margin-bottom": "1rem" }
};
const _hoisted_4 = { class: "obs-modal-meta" };
const _hoisted_5 = { class: "obs-modal-label" };
const _hoisted_6 = { class: "obs-modal-value" };
const _sfc_main = {
  __name: "ObservationModal",
  props: {
    observation: { type: Object, default: null },
    show: { type: Boolean, default: false }
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const fields = [
      "Title",
      "Application",
      "Activity",
      "Task",
      "Action",
      "Feedback",
      "Feedforward",
      "Handedness",
      "Multi_Action",
      "Interface_Elements",
      "Interaction_Technique"
    ];
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Teleport, { to: "body" }, [
        __props.show && __props.observation ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: "modal",
          onClick: _cache[1] || (_cache[1] = withModifiers(($event) => emit("close"), ["self"]))
        }, [
          createBaseVNode("div", _hoisted_1, [
            createBaseVNode("button", {
              class: "modal-close",
              onClick: _cache[0] || (_cache[0] = ($event) => emit("close"))
            }, "×"),
            __props.observation.URL ? (openBlock(), createElementBlock("img", {
              key: 0,
              src: __props.observation.URL,
              class: "obs-modal-image",
              alt: __props.observation.Title
            }, null, 8, _hoisted_2)) : (openBlock(), createElementBlock("div", _hoisted_3)),
            createBaseVNode("div", _hoisted_4, [
              (openBlock(), createElementBlock(Fragment, null, renderList(fields, (field) => {
                return createBaseVNode("div", {
                  key: field,
                  class: "obs-modal-field"
                }, [
                  createBaseVNode("span", _hoisted_5, toDisplayString(field.replace(/_/g, " ")), 1),
                  createBaseVNode("span", _hoisted_6, toDisplayString(__props.observation[field] || "—"), 1)
                ]);
              }), 64))
            ])
          ])
        ])) : createCommentVNode("", true)
      ]);
    };
  }
};
export {
  _sfc_main as _
};
//# sourceMappingURL=ObservationModal-BC_QVNYl.js.map
