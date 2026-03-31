import { s as select } from "./transform-BznNK3nw.js";
import { u as useDataStore, o as onMounted, g as ref, m as onBeforeUnmount, c as createElementBlock, d as createBaseVNode, p as createTextVNode, b as unref, t as toDisplayString, f as createCommentVNode, l as normalizeStyle, h as openBlock } from "./index-MAtazTRy.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import { i as initRange } from "./init-CTO7spbL.js";
class InternMap extends Map {
  constructor(entries, key = keyof) {
    super();
    Object.defineProperties(this, { _intern: { value: /* @__PURE__ */ new Map() }, _key: { value: key } });
    if (entries != null) for (const [key2, value2] of entries) this.set(key2, value2);
  }
  get(key) {
    return super.get(intern_get(this, key));
  }
  has(key) {
    return super.has(intern_get(this, key));
  }
  set(key, value2) {
    return super.set(intern_set(this, key), value2);
  }
  delete(key) {
    return super.delete(intern_delete(this, key));
  }
}
function intern_get({ _intern, _key }, value2) {
  const key = _key(value2);
  return _intern.has(key) ? _intern.get(key) : value2;
}
function intern_set({ _intern, _key }, value2) {
  const key = _key(value2);
  if (_intern.has(key)) return _intern.get(key);
  _intern.set(key, value2);
  return value2;
}
function intern_delete({ _intern, _key }, value2) {
  const key = _key(value2);
  if (_intern.has(key)) {
    value2 = _intern.get(key);
    _intern.delete(key);
  }
  return value2;
}
function keyof(value2) {
  return value2 !== null && typeof value2 === "object" ? value2.valueOf() : value2;
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
    for (const value2 of _) {
      if (index.has(value2)) continue;
      index.set(value2, domain.push(value2) - 1);
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
function max(values, valueof) {
  let max2;
  if (valueof === void 0) {
    for (const value2 of values) {
      if (value2 != null && (max2 < value2 || max2 === void 0 && value2 >= value2)) {
        max2 = value2;
      }
    }
  } else {
    let index = -1;
    for (let value2 of values) {
      if ((value2 = valueof(value2, ++index, values)) != null && (max2 < value2 || max2 === void 0 && value2 >= value2)) {
        max2 = value2;
      }
    }
  }
  return max2;
}
function min(values, valueof) {
  let min2;
  if (valueof === void 0) {
    for (const value2 of values) {
      if (value2 != null && (min2 > value2 || min2 === void 0 && value2 >= value2)) {
        min2 = value2;
      }
    }
  } else {
    let index = -1;
    for (let value2 of values) {
      if ((value2 = valueof(value2, ++index, values)) != null && (min2 > value2 || min2 === void 0 && value2 >= value2)) {
        min2 = value2;
      }
    }
  }
  return min2;
}
function sum(values, valueof) {
  let sum2 = 0;
  if (valueof === void 0) {
    for (let value2 of values) {
      if (value2 = +value2) {
        sum2 += value2;
      }
    }
  } else {
    let index = -1;
    for (let value2 of values) {
      if (value2 = +valueof(value2, ++index, values)) {
        sum2 += value2;
      }
    }
  }
  return sum2;
}
function justify(node, n) {
  return node.sourceLinks.length ? node.depth : n - 1;
}
function constant$1(x2) {
  return function() {
    return x2;
  };
}
function ascendingSourceBreadth(a, b) {
  return ascendingBreadth(a.source, b.source) || a.index - b.index;
}
function ascendingTargetBreadth(a, b) {
  return ascendingBreadth(a.target, b.target) || a.index - b.index;
}
function ascendingBreadth(a, b) {
  return a.y0 - b.y0;
}
function value(d) {
  return d.value;
}
function defaultId(d) {
  return d.index;
}
function defaultNodes(graph) {
  return graph.nodes;
}
function defaultLinks(graph) {
  return graph.links;
}
function find(nodeById, id) {
  const node = nodeById.get(id);
  if (!node) throw new Error("missing: " + id);
  return node;
}
function computeLinkBreadths({ nodes }) {
  for (const node of nodes) {
    let y0 = node.y0;
    let y1 = y0;
    for (const link2 of node.sourceLinks) {
      link2.y0 = y0 + link2.width / 2;
      y0 += link2.width;
    }
    for (const link2 of node.targetLinks) {
      link2.y1 = y1 + link2.width / 2;
      y1 += link2.width;
    }
  }
}
function Sankey() {
  let x0 = 0, y0 = 0, x1 = 1, y1 = 1;
  let dx = 24;
  let dy = 8, py;
  let id = defaultId;
  let align = justify;
  let sort;
  let linkSort;
  let nodes = defaultNodes;
  let links = defaultLinks;
  let iterations = 6;
  function sankey() {
    const graph = { nodes: nodes.apply(null, arguments), links: links.apply(null, arguments) };
    computeNodeLinks(graph);
    computeNodeValues(graph);
    computeNodeDepths(graph);
    computeNodeHeights(graph);
    computeNodeBreadths(graph);
    computeLinkBreadths(graph);
    return graph;
  }
  sankey.update = function(graph) {
    computeLinkBreadths(graph);
    return graph;
  };
  sankey.nodeId = function(_) {
    return arguments.length ? (id = typeof _ === "function" ? _ : constant$1(_), sankey) : id;
  };
  sankey.nodeAlign = function(_) {
    return arguments.length ? (align = typeof _ === "function" ? _ : constant$1(_), sankey) : align;
  };
  sankey.nodeSort = function(_) {
    return arguments.length ? (sort = _, sankey) : sort;
  };
  sankey.nodeWidth = function(_) {
    return arguments.length ? (dx = +_, sankey) : dx;
  };
  sankey.nodePadding = function(_) {
    return arguments.length ? (dy = py = +_, sankey) : dy;
  };
  sankey.nodes = function(_) {
    return arguments.length ? (nodes = typeof _ === "function" ? _ : constant$1(_), sankey) : nodes;
  };
  sankey.links = function(_) {
    return arguments.length ? (links = typeof _ === "function" ? _ : constant$1(_), sankey) : links;
  };
  sankey.linkSort = function(_) {
    return arguments.length ? (linkSort = _, sankey) : linkSort;
  };
  sankey.size = function(_) {
    return arguments.length ? (x0 = y0 = 0, x1 = +_[0], y1 = +_[1], sankey) : [x1 - x0, y1 - y0];
  };
  sankey.extent = function(_) {
    return arguments.length ? (x0 = +_[0][0], x1 = +_[1][0], y0 = +_[0][1], y1 = +_[1][1], sankey) : [[x0, y0], [x1, y1]];
  };
  sankey.iterations = function(_) {
    return arguments.length ? (iterations = +_, sankey) : iterations;
  };
  function computeNodeLinks({ nodes: nodes2, links: links2 }) {
    for (const [i, node] of nodes2.entries()) {
      node.index = i;
      node.sourceLinks = [];
      node.targetLinks = [];
    }
    const nodeById = new Map(nodes2.map((d, i) => [id(d, i, nodes2), d]));
    for (const [i, link2] of links2.entries()) {
      link2.index = i;
      let { source, target } = link2;
      if (typeof source !== "object") source = link2.source = find(nodeById, source);
      if (typeof target !== "object") target = link2.target = find(nodeById, target);
      source.sourceLinks.push(link2);
      target.targetLinks.push(link2);
    }
    if (linkSort != null) {
      for (const { sourceLinks, targetLinks } of nodes2) {
        sourceLinks.sort(linkSort);
        targetLinks.sort(linkSort);
      }
    }
  }
  function computeNodeValues({ nodes: nodes2 }) {
    for (const node of nodes2) {
      node.value = node.fixedValue === void 0 ? Math.max(sum(node.sourceLinks, value), sum(node.targetLinks, value)) : node.fixedValue;
    }
  }
  function computeNodeDepths({ nodes: nodes2 }) {
    const n = nodes2.length;
    let current = new Set(nodes2);
    let next = /* @__PURE__ */ new Set();
    let x2 = 0;
    while (current.size) {
      for (const node of current) {
        node.depth = x2;
        for (const { target } of node.sourceLinks) {
          next.add(target);
        }
      }
      if (++x2 > n) throw new Error("circular link");
      current = next;
      next = /* @__PURE__ */ new Set();
    }
  }
  function computeNodeHeights({ nodes: nodes2 }) {
    const n = nodes2.length;
    let current = new Set(nodes2);
    let next = /* @__PURE__ */ new Set();
    let x2 = 0;
    while (current.size) {
      for (const node of current) {
        node.height = x2;
        for (const { source } of node.targetLinks) {
          next.add(source);
        }
      }
      if (++x2 > n) throw new Error("circular link");
      current = next;
      next = /* @__PURE__ */ new Set();
    }
  }
  function computeNodeLayers({ nodes: nodes2 }) {
    const x2 = max(nodes2, (d) => d.depth) + 1;
    const kx = (x1 - x0 - dx) / (x2 - 1);
    const columns = new Array(x2);
    for (const node of nodes2) {
      const i = Math.max(0, Math.min(x2 - 1, Math.floor(align.call(null, node, x2))));
      node.layer = i;
      node.x0 = x0 + i * kx;
      node.x1 = node.x0 + dx;
      if (columns[i]) columns[i].push(node);
      else columns[i] = [node];
    }
    if (sort) for (const column of columns) {
      column.sort(sort);
    }
    return columns;
  }
  function initializeNodeBreadths(columns) {
    const ky = min(columns, (c) => (y1 - y0 - (c.length - 1) * py) / sum(c, value));
    for (const nodes2 of columns) {
      let y2 = y0;
      for (const node of nodes2) {
        node.y0 = y2;
        node.y1 = y2 + node.value * ky;
        y2 = node.y1 + py;
        for (const link2 of node.sourceLinks) {
          link2.width = link2.value * ky;
        }
      }
      y2 = (y1 - y2 + py) / (nodes2.length + 1);
      for (let i = 0; i < nodes2.length; ++i) {
        const node = nodes2[i];
        node.y0 += y2 * (i + 1);
        node.y1 += y2 * (i + 1);
      }
      reorderLinks(nodes2);
    }
  }
  function computeNodeBreadths(graph) {
    const columns = computeNodeLayers(graph);
    py = Math.min(dy, (y1 - y0) / (max(columns, (c) => c.length) - 1));
    initializeNodeBreadths(columns);
    for (let i = 0; i < iterations; ++i) {
      const alpha = Math.pow(0.99, i);
      const beta = Math.max(1 - alpha, (i + 1) / iterations);
      relaxRightToLeft(columns, alpha, beta);
      relaxLeftToRight(columns, alpha, beta);
    }
  }
  function relaxLeftToRight(columns, alpha, beta) {
    for (let i = 1, n = columns.length; i < n; ++i) {
      const column = columns[i];
      for (const target of column) {
        let y2 = 0;
        let w = 0;
        for (const { source, value: value2 } of target.targetLinks) {
          let v = value2 * (target.layer - source.layer);
          y2 += targetTop(source, target) * v;
          w += v;
        }
        if (!(w > 0)) continue;
        let dy2 = (y2 / w - target.y0) * alpha;
        target.y0 += dy2;
        target.y1 += dy2;
        reorderNodeLinks(target);
      }
      if (sort === void 0) column.sort(ascendingBreadth);
      resolveCollisions(column, beta);
    }
  }
  function relaxRightToLeft(columns, alpha, beta) {
    for (let n = columns.length, i = n - 2; i >= 0; --i) {
      const column = columns[i];
      for (const source of column) {
        let y2 = 0;
        let w = 0;
        for (const { target, value: value2 } of source.sourceLinks) {
          let v = value2 * (target.layer - source.layer);
          y2 += sourceTop(source, target) * v;
          w += v;
        }
        if (!(w > 0)) continue;
        let dy2 = (y2 / w - source.y0) * alpha;
        source.y0 += dy2;
        source.y1 += dy2;
        reorderNodeLinks(source);
      }
      if (sort === void 0) column.sort(ascendingBreadth);
      resolveCollisions(column, beta);
    }
  }
  function resolveCollisions(nodes2, alpha) {
    const i = nodes2.length >> 1;
    const subject = nodes2[i];
    resolveCollisionsBottomToTop(nodes2, subject.y0 - py, i - 1, alpha);
    resolveCollisionsTopToBottom(nodes2, subject.y1 + py, i + 1, alpha);
    resolveCollisionsBottomToTop(nodes2, y1, nodes2.length - 1, alpha);
    resolveCollisionsTopToBottom(nodes2, y0, 0, alpha);
  }
  function resolveCollisionsTopToBottom(nodes2, y2, i, alpha) {
    for (; i < nodes2.length; ++i) {
      const node = nodes2[i];
      const dy2 = (y2 - node.y0) * alpha;
      if (dy2 > 1e-6) node.y0 += dy2, node.y1 += dy2;
      y2 = node.y1 + py;
    }
  }
  function resolveCollisionsBottomToTop(nodes2, y2, i, alpha) {
    for (; i >= 0; --i) {
      const node = nodes2[i];
      const dy2 = (node.y1 - y2) * alpha;
      if (dy2 > 1e-6) node.y0 -= dy2, node.y1 -= dy2;
      y2 = node.y0 - py;
    }
  }
  function reorderNodeLinks({ sourceLinks, targetLinks }) {
    if (linkSort === void 0) {
      for (const { source: { sourceLinks: sourceLinks2 } } of targetLinks) {
        sourceLinks2.sort(ascendingTargetBreadth);
      }
      for (const { target: { targetLinks: targetLinks2 } } of sourceLinks) {
        targetLinks2.sort(ascendingSourceBreadth);
      }
    }
  }
  function reorderLinks(nodes2) {
    if (linkSort === void 0) {
      for (const { sourceLinks, targetLinks } of nodes2) {
        sourceLinks.sort(ascendingTargetBreadth);
        targetLinks.sort(ascendingSourceBreadth);
      }
    }
  }
  function targetTop(source, target) {
    let y2 = source.y0 - (source.sourceLinks.length - 1) * py / 2;
    for (const { target: node, width } of source.sourceLinks) {
      if (node === target) break;
      y2 += width + py;
    }
    for (const { source: node, width } of target.targetLinks) {
      if (node === source) break;
      y2 -= width;
    }
    return y2;
  }
  function sourceTop(source, target) {
    let y2 = target.y0 - (target.targetLinks.length - 1) * py / 2;
    for (const { source: node, width } of target.targetLinks) {
      if (node === source) break;
      y2 += width + py;
    }
    for (const { target: node, width } of source.sourceLinks) {
      if (node === target) break;
      y2 -= width;
    }
    return y2;
  }
  return sankey;
}
var pi = Math.PI, tau = 2 * pi, epsilon = 1e-6, tauEpsilon = tau - epsilon;
function Path() {
  this._x0 = this._y0 = // start of current subpath
  this._x1 = this._y1 = null;
  this._ = "";
}
function path() {
  return new Path();
}
Path.prototype = path.prototype = {
  constructor: Path,
  moveTo: function(x2, y2) {
    this._ += "M" + (this._x0 = this._x1 = +x2) + "," + (this._y0 = this._y1 = +y2);
  },
  closePath: function() {
    if (this._x1 !== null) {
      this._x1 = this._x0, this._y1 = this._y0;
      this._ += "Z";
    }
  },
  lineTo: function(x2, y2) {
    this._ += "L" + (this._x1 = +x2) + "," + (this._y1 = +y2);
  },
  quadraticCurveTo: function(x1, y1, x2, y2) {
    this._ += "Q" + +x1 + "," + +y1 + "," + (this._x1 = +x2) + "," + (this._y1 = +y2);
  },
  bezierCurveTo: function(x1, y1, x2, y2, x3, y3) {
    this._ += "C" + +x1 + "," + +y1 + "," + +x2 + "," + +y2 + "," + (this._x1 = +x3) + "," + (this._y1 = +y3);
  },
  arcTo: function(x1, y1, x2, y2, r) {
    x1 = +x1, y1 = +y1, x2 = +x2, y2 = +y2, r = +r;
    var x0 = this._x1, y0 = this._y1, x21 = x2 - x1, y21 = y2 - y1, x01 = x0 - x1, y01 = y0 - y1, l01_2 = x01 * x01 + y01 * y01;
    if (r < 0) throw new Error("negative radius: " + r);
    if (this._x1 === null) {
      this._ += "M" + (this._x1 = x1) + "," + (this._y1 = y1);
    } else if (!(l01_2 > epsilon)) ;
    else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon) || !r) {
      this._ += "L" + (this._x1 = x1) + "," + (this._y1 = y1);
    } else {
      var x20 = x2 - x0, y20 = y2 - y0, l21_2 = x21 * x21 + y21 * y21, l20_2 = x20 * x20 + y20 * y20, l21 = Math.sqrt(l21_2), l01 = Math.sqrt(l01_2), l = r * Math.tan((pi - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2), t01 = l / l01, t21 = l / l21;
      if (Math.abs(t01 - 1) > epsilon) {
        this._ += "L" + (x1 + t01 * x01) + "," + (y1 + t01 * y01);
      }
      this._ += "A" + r + "," + r + ",0,0," + +(y01 * x20 > x01 * y20) + "," + (this._x1 = x1 + t21 * x21) + "," + (this._y1 = y1 + t21 * y21);
    }
  },
  arc: function(x2, y2, r, a0, a1, ccw) {
    x2 = +x2, y2 = +y2, r = +r, ccw = !!ccw;
    var dx = r * Math.cos(a0), dy = r * Math.sin(a0), x0 = x2 + dx, y0 = y2 + dy, cw = 1 ^ ccw, da = ccw ? a0 - a1 : a1 - a0;
    if (r < 0) throw new Error("negative radius: " + r);
    if (this._x1 === null) {
      this._ += "M" + x0 + "," + y0;
    } else if (Math.abs(this._x1 - x0) > epsilon || Math.abs(this._y1 - y0) > epsilon) {
      this._ += "L" + x0 + "," + y0;
    }
    if (!r) return;
    if (da < 0) da = da % tau + tau;
    if (da > tauEpsilon) {
      this._ += "A" + r + "," + r + ",0,1," + cw + "," + (x2 - dx) + "," + (y2 - dy) + "A" + r + "," + r + ",0,1," + cw + "," + (this._x1 = x0) + "," + (this._y1 = y0);
    } else if (da > epsilon) {
      this._ += "A" + r + "," + r + ",0," + +(da >= pi) + "," + cw + "," + (this._x1 = x2 + r * Math.cos(a1)) + "," + (this._y1 = y2 + r * Math.sin(a1));
    }
  },
  rect: function(x2, y2, w, h) {
    this._ += "M" + (this._x0 = this._x1 = +x2) + "," + (this._y0 = this._y1 = +y2) + "h" + +w + "v" + +h + "h" + -w + "Z";
  },
  toString: function() {
    return this._;
  }
};
function constant(x2) {
  return function constant2() {
    return x2;
  };
}
function x(p) {
  return p[0];
}
function y(p) {
  return p[1];
}
var slice = Array.prototype.slice;
function linkSource(d) {
  return d.source;
}
function linkTarget(d) {
  return d.target;
}
function link(curve) {
  var source = linkSource, target = linkTarget, x$1 = x, y$1 = y, context = null;
  function link2() {
    var buffer, argv = slice.call(arguments), s = source.apply(this, argv), t = target.apply(this, argv);
    if (!context) context = buffer = path();
    curve(context, +x$1.apply(this, (argv[0] = s, argv)), +y$1.apply(this, argv), +x$1.apply(this, (argv[0] = t, argv)), +y$1.apply(this, argv));
    if (buffer) return context = null, buffer + "" || null;
  }
  link2.source = function(_) {
    return arguments.length ? (source = _, link2) : source;
  };
  link2.target = function(_) {
    return arguments.length ? (target = _, link2) : target;
  };
  link2.x = function(_) {
    return arguments.length ? (x$1 = typeof _ === "function" ? _ : constant(+_), link2) : x$1;
  };
  link2.y = function(_) {
    return arguments.length ? (y$1 = typeof _ === "function" ? _ : constant(+_), link2) : y$1;
  };
  link2.context = function(_) {
    return arguments.length ? (context = _ == null ? null : _, link2) : context;
  };
  return link2;
}
function curveHorizontal(context, x0, y0, x1, y1) {
  context.moveTo(x0, y0);
  context.bezierCurveTo(x0 = (x0 + x1) / 2, y0, x0, y1, x1, y1);
}
function linkHorizontal() {
  return link(curveHorizontal);
}
function horizontalSource(d) {
  return [d.source.x1, d.y0];
}
function horizontalTarget(d) {
  return [d.target.x0, d.y1];
}
function sankeyLinkHorizontal() {
  return linkHorizontal().source(horizontalSource).target(horizontalTarget);
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
      Object.entries(actTaskCounts).forEach(([key, value2]) => {
        const [src, tgt] = key.split("|||");
        const srcIdx = nodeIndex[`0:${src}`];
        const tgtIdx = nodeIndex[`1:${tgt}`];
        if (srcIdx !== void 0 && tgtIdx !== void 0) {
          links.push({ source: srcIdx, target: tgtIdx, value: value2 });
        }
      });
      Object.entries(taskTechCounts).forEach(([key, value2]) => {
        const [src, tgt] = key.split("|||");
        const srcIdx = nodeIndex[`1:${src}`];
        const tgtIdx = nodeIndex[`2:${tgt}`];
        if (srcIdx !== void 0 && tgtIdx !== void 0) {
          links.push({ source: srcIdx, target: tgtIdx, value: value2 });
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
      function linkColor(link2) {
        const srcNode = link2.source;
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
      colLabels.forEach(({ x: x2, label }, i) => {
        headerG.append("text").attr("x", i === 2 ? x2 + 8 : x2).attr("y", margin.top - 8).attr("text-anchor", i === 0 ? "start" : i === 2 ? "end" : "middle").text(label);
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
//# sourceMappingURL=SankeyView-C1zNDneC.js.map
