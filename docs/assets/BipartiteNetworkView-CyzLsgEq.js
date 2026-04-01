import { u as useDataStore, o as onMounted, g as ref, s as onUnmounted, c as createElementBlock, d as createBaseVNode, f as createCommentVNode, t as toDisplayString, l as createStaticVNode, F as Fragment, r as renderList, v as withDirectives, x as vShow, y as reactive, q as normalizeStyle, b as unref, h as openBlock } from "./index-BERREmoa.js";
import { s as select, e as dispatch, t as timer, f as identity, T as Transform, g as interrupt } from "./transform-BznNK3nw.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
function sourceEvent(event) {
  let sourceEvent2;
  while (sourceEvent2 = event.sourceEvent) event = sourceEvent2;
  return event;
}
function pointer(event, node) {
  event = sourceEvent(event);
  if (node === void 0) node = event.currentTarget;
  if (node) {
    var svg = node.ownerSVGElement || node;
    if (svg.createSVGPoint) {
      var point = svg.createSVGPoint();
      point.x = event.clientX, point.y = event.clientY;
      point = point.matrixTransform(node.getScreenCTM().inverse());
      return [point.x, point.y];
    }
    if (node.getBoundingClientRect) {
      var rect = node.getBoundingClientRect();
      return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
    }
  }
  return [event.pageX, event.pageY];
}
const nonpassive = { passive: false };
const nonpassivecapture = { capture: true, passive: false };
function nopropagation$1(event) {
  event.stopImmediatePropagation();
}
function noevent$1(event) {
  event.preventDefault();
  event.stopImmediatePropagation();
}
function dragDisable(view) {
  var root = view.document.documentElement, selection = select(view).on("dragstart.drag", noevent$1, nonpassivecapture);
  if ("onselectstart" in root) {
    selection.on("selectstart.drag", noevent$1, nonpassivecapture);
  } else {
    root.__noselect = root.style.MozUserSelect;
    root.style.MozUserSelect = "none";
  }
}
function yesdrag(view, noclick) {
  var root = view.document.documentElement, selection = select(view).on("dragstart.drag", null);
  if (noclick) {
    selection.on("click.drag", noevent$1, nonpassivecapture);
    setTimeout(function() {
      selection.on("click.drag", null);
    }, 0);
  }
  if ("onselectstart" in root) {
    selection.on("selectstart.drag", null);
  } else {
    root.style.MozUserSelect = root.__noselect;
    delete root.__noselect;
  }
}
const constant$2 = (x2) => () => x2;
function DragEvent(type, {
  sourceEvent: sourceEvent2,
  subject,
  target,
  identifier,
  active,
  x: x2,
  y: y2,
  dx,
  dy,
  dispatch: dispatch2
}) {
  Object.defineProperties(this, {
    type: { value: type, enumerable: true, configurable: true },
    sourceEvent: { value: sourceEvent2, enumerable: true, configurable: true },
    subject: { value: subject, enumerable: true, configurable: true },
    target: { value: target, enumerable: true, configurable: true },
    identifier: { value: identifier, enumerable: true, configurable: true },
    active: { value: active, enumerable: true, configurable: true },
    x: { value: x2, enumerable: true, configurable: true },
    y: { value: y2, enumerable: true, configurable: true },
    dx: { value: dx, enumerable: true, configurable: true },
    dy: { value: dy, enumerable: true, configurable: true },
    _: { value: dispatch2 }
  });
}
DragEvent.prototype.on = function() {
  var value = this._.on.apply(this._, arguments);
  return value === this._ ? this : value;
};
function defaultFilter$1(event) {
  return !event.ctrlKey && !event.button;
}
function defaultContainer() {
  return this.parentNode;
}
function defaultSubject(event, d) {
  return d == null ? { x: event.x, y: event.y } : d;
}
function defaultTouchable$1() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function drag() {
  var filter = defaultFilter$1, container = defaultContainer, subject = defaultSubject, touchable = defaultTouchable$1, gestures = {}, listeners = dispatch("start", "drag", "end"), active = 0, mousedownx, mousedowny, mousemoving, touchending, clickDistance2 = 0;
  function drag2(selection) {
    selection.on("mousedown.drag", mousedowned).filter(touchable).on("touchstart.drag", touchstarted).on("touchmove.drag", touchmoved, nonpassive).on("touchend.drag touchcancel.drag", touchended).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function mousedowned(event, d) {
    if (touchending || !filter.call(this, event, d)) return;
    var gesture = beforestart(this, container.call(this, event, d), event, d, "mouse");
    if (!gesture) return;
    select(event.view).on("mousemove.drag", mousemoved, nonpassivecapture).on("mouseup.drag", mouseupped, nonpassivecapture);
    dragDisable(event.view);
    nopropagation$1(event);
    mousemoving = false;
    mousedownx = event.clientX;
    mousedowny = event.clientY;
    gesture("start", event);
  }
  function mousemoved(event) {
    noevent$1(event);
    if (!mousemoving) {
      var dx = event.clientX - mousedownx, dy = event.clientY - mousedowny;
      mousemoving = dx * dx + dy * dy > clickDistance2;
    }
    gestures.mouse("drag", event);
  }
  function mouseupped(event) {
    select(event.view).on("mousemove.drag mouseup.drag", null);
    yesdrag(event.view, mousemoving);
    noevent$1(event);
    gestures.mouse("end", event);
  }
  function touchstarted(event, d) {
    if (!filter.call(this, event, d)) return;
    var touches = event.changedTouches, c2 = container.call(this, event, d), n = touches.length, i, gesture;
    for (i = 0; i < n; ++i) {
      if (gesture = beforestart(this, c2, event, d, touches[i].identifier, touches[i])) {
        nopropagation$1(event);
        gesture("start", event, touches[i]);
      }
    }
  }
  function touchmoved(event) {
    var touches = event.changedTouches, n = touches.length, i, gesture;
    for (i = 0; i < n; ++i) {
      if (gesture = gestures[touches[i].identifier]) {
        noevent$1(event);
        gesture("drag", event, touches[i]);
      }
    }
  }
  function touchended(event) {
    var touches = event.changedTouches, n = touches.length, i, gesture;
    if (touchending) clearTimeout(touchending);
    touchending = setTimeout(function() {
      touchending = null;
    }, 500);
    for (i = 0; i < n; ++i) {
      if (gesture = gestures[touches[i].identifier]) {
        nopropagation$1(event);
        gesture("end", event, touches[i]);
      }
    }
  }
  function beforestart(that, container2, event, d, identifier, touch) {
    var dispatch2 = listeners.copy(), p = pointer(touch || event, container2), dx, dy, s;
    if ((s = subject.call(that, new DragEvent("beforestart", {
      sourceEvent: event,
      target: drag2,
      identifier,
      active,
      x: p[0],
      y: p[1],
      dx: 0,
      dy: 0,
      dispatch: dispatch2
    }), d)) == null) return;
    dx = s.x - p[0] || 0;
    dy = s.y - p[1] || 0;
    return function gesture(type, event2, touch2) {
      var p0 = p, n;
      switch (type) {
        case "start":
          gestures[identifier] = gesture, n = active++;
          break;
        case "end":
          delete gestures[identifier], --active;
        case "drag":
          p = pointer(touch2 || event2, container2), n = active;
          break;
      }
      dispatch2.call(
        type,
        that,
        new DragEvent(type, {
          sourceEvent: event2,
          subject: s,
          target: drag2,
          identifier,
          active: n,
          x: p[0] + dx,
          y: p[1] + dy,
          dx: p[0] - p0[0],
          dy: p[1] - p0[1],
          dispatch: dispatch2
        }),
        d
      );
    };
  }
  drag2.filter = function(_) {
    return arguments.length ? (filter = typeof _ === "function" ? _ : constant$2(!!_), drag2) : filter;
  };
  drag2.container = function(_) {
    return arguments.length ? (container = typeof _ === "function" ? _ : constant$2(_), drag2) : container;
  };
  drag2.subject = function(_) {
    return arguments.length ? (subject = typeof _ === "function" ? _ : constant$2(_), drag2) : subject;
  };
  drag2.touchable = function(_) {
    return arguments.length ? (touchable = typeof _ === "function" ? _ : constant$2(!!_), drag2) : touchable;
  };
  drag2.on = function() {
    var value = listeners.on.apply(listeners, arguments);
    return value === listeners ? drag2 : value;
  };
  drag2.clickDistance = function(_) {
    return arguments.length ? (clickDistance2 = (_ = +_) * _, drag2) : Math.sqrt(clickDistance2);
  };
  return drag2;
}
var epsilon2 = 1e-12;
function cosh(x2) {
  return ((x2 = Math.exp(x2)) + 1 / x2) / 2;
}
function sinh(x2) {
  return ((x2 = Math.exp(x2)) - 1 / x2) / 2;
}
function tanh(x2) {
  return ((x2 = Math.exp(2 * x2)) - 1) / (x2 + 1);
}
const interpolateZoom = function zoomRho(rho, rho2, rho4) {
  function zoom2(p0, p1) {
    var ux0 = p0[0], uy0 = p0[1], w0 = p0[2], ux1 = p1[0], uy1 = p1[1], w1 = p1[2], dx = ux1 - ux0, dy = uy1 - uy0, d2 = dx * dx + dy * dy, i, S;
    if (d2 < epsilon2) {
      S = Math.log(w1 / w0) / rho;
      i = function(t) {
        return [
          ux0 + t * dx,
          uy0 + t * dy,
          w0 * Math.exp(rho * t * S)
        ];
      };
    } else {
      var d1 = Math.sqrt(d2), b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1), b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1), r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0), r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
      S = (r1 - r0) / rho;
      i = function(t) {
        var s = t * S, coshr0 = cosh(r0), u = w0 / (rho2 * d1) * (coshr0 * tanh(rho * s + r0) - sinh(r0));
        return [
          ux0 + u * dx,
          uy0 + u * dy,
          w0 * coshr0 / cosh(rho * s + r0)
        ];
      };
    }
    i.duration = S * 1e3 * rho / Math.SQRT2;
    return i;
  }
  zoom2.rho = function(_) {
    var _1 = Math.max(1e-3, +_), _2 = _1 * _1, _4 = _2 * _2;
    return zoomRho(_1, _2, _4);
  };
  return zoom2;
}(Math.SQRT2, 2, 4);
function center(x2, y2) {
  var nodes, strength = 1;
  if (x2 == null) x2 = 0;
  if (y2 == null) y2 = 0;
  function force() {
    var i, n = nodes.length, node, sx = 0, sy = 0;
    for (i = 0; i < n; ++i) {
      node = nodes[i], sx += node.x, sy += node.y;
    }
    for (sx = (sx / n - x2) * strength, sy = (sy / n - y2) * strength, i = 0; i < n; ++i) {
      node = nodes[i], node.x -= sx, node.y -= sy;
    }
  }
  force.initialize = function(_) {
    nodes = _;
  };
  force.x = function(_) {
    return arguments.length ? (x2 = +_, force) : x2;
  };
  force.y = function(_) {
    return arguments.length ? (y2 = +_, force) : y2;
  };
  force.strength = function(_) {
    return arguments.length ? (strength = +_, force) : strength;
  };
  return force;
}
function tree_add(d) {
  const x2 = +this._x.call(null, d), y2 = +this._y.call(null, d);
  return add(this.cover(x2, y2), x2, y2, d);
}
function add(tree, x2, y2, d) {
  if (isNaN(x2) || isNaN(y2)) return tree;
  var parent, node = tree._root, leaf = { data: d }, x0 = tree._x0, y0 = tree._y0, x1 = tree._x1, y1 = tree._y1, xm, ym, xp, yp, right, bottom, i, j;
  if (!node) return tree._root = leaf, tree;
  while (node.length) {
    if (right = x2 >= (xm = (x0 + x1) / 2)) x0 = xm;
    else x1 = xm;
    if (bottom = y2 >= (ym = (y0 + y1) / 2)) y0 = ym;
    else y1 = ym;
    if (parent = node, !(node = node[i = bottom << 1 | right])) return parent[i] = leaf, tree;
  }
  xp = +tree._x.call(null, node.data);
  yp = +tree._y.call(null, node.data);
  if (x2 === xp && y2 === yp) return leaf.next = node, parent ? parent[i] = leaf : tree._root = leaf, tree;
  do {
    parent = parent ? parent[i] = new Array(4) : tree._root = new Array(4);
    if (right = x2 >= (xm = (x0 + x1) / 2)) x0 = xm;
    else x1 = xm;
    if (bottom = y2 >= (ym = (y0 + y1) / 2)) y0 = ym;
    else y1 = ym;
  } while ((i = bottom << 1 | right) === (j = (yp >= ym) << 1 | xp >= xm));
  return parent[j] = node, parent[i] = leaf, tree;
}
function addAll(data) {
  var d, i, n = data.length, x2, y2, xz = new Array(n), yz = new Array(n), x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (i = 0; i < n; ++i) {
    if (isNaN(x2 = +this._x.call(null, d = data[i])) || isNaN(y2 = +this._y.call(null, d))) continue;
    xz[i] = x2;
    yz[i] = y2;
    if (x2 < x0) x0 = x2;
    if (x2 > x1) x1 = x2;
    if (y2 < y0) y0 = y2;
    if (y2 > y1) y1 = y2;
  }
  if (x0 > x1 || y0 > y1) return this;
  this.cover(x0, y0).cover(x1, y1);
  for (i = 0; i < n; ++i) {
    add(this, xz[i], yz[i], data[i]);
  }
  return this;
}
function tree_cover(x2, y2) {
  if (isNaN(x2 = +x2) || isNaN(y2 = +y2)) return this;
  var x0 = this._x0, y0 = this._y0, x1 = this._x1, y1 = this._y1;
  if (isNaN(x0)) {
    x1 = (x0 = Math.floor(x2)) + 1;
    y1 = (y0 = Math.floor(y2)) + 1;
  } else {
    var z = x1 - x0 || 1, node = this._root, parent, i;
    while (x0 > x2 || x2 >= x1 || y0 > y2 || y2 >= y1) {
      i = (y2 < y0) << 1 | x2 < x0;
      parent = new Array(4), parent[i] = node, node = parent, z *= 2;
      switch (i) {
        case 0:
          x1 = x0 + z, y1 = y0 + z;
          break;
        case 1:
          x0 = x1 - z, y1 = y0 + z;
          break;
        case 2:
          x1 = x0 + z, y0 = y1 - z;
          break;
        case 3:
          x0 = x1 - z, y0 = y1 - z;
          break;
      }
    }
    if (this._root && this._root.length) this._root = node;
  }
  this._x0 = x0;
  this._y0 = y0;
  this._x1 = x1;
  this._y1 = y1;
  return this;
}
function tree_data() {
  var data = [];
  this.visit(function(node) {
    if (!node.length) do
      data.push(node.data);
    while (node = node.next);
  });
  return data;
}
function tree_extent(_) {
  return arguments.length ? this.cover(+_[0][0], +_[0][1]).cover(+_[1][0], +_[1][1]) : isNaN(this._x0) ? void 0 : [[this._x0, this._y0], [this._x1, this._y1]];
}
function Quad(node, x0, y0, x1, y1) {
  this.node = node;
  this.x0 = x0;
  this.y0 = y0;
  this.x1 = x1;
  this.y1 = y1;
}
function tree_find(x2, y2, radius) {
  var data, x0 = this._x0, y0 = this._y0, x1, y1, x22, y22, x3 = this._x1, y3 = this._y1, quads = [], node = this._root, q, i;
  if (node) quads.push(new Quad(node, x0, y0, x3, y3));
  if (radius == null) radius = Infinity;
  else {
    x0 = x2 - radius, y0 = y2 - radius;
    x3 = x2 + radius, y3 = y2 + radius;
    radius *= radius;
  }
  while (q = quads.pop()) {
    if (!(node = q.node) || (x1 = q.x0) > x3 || (y1 = q.y0) > y3 || (x22 = q.x1) < x0 || (y22 = q.y1) < y0) continue;
    if (node.length) {
      var xm = (x1 + x22) / 2, ym = (y1 + y22) / 2;
      quads.push(
        new Quad(node[3], xm, ym, x22, y22),
        new Quad(node[2], x1, ym, xm, y22),
        new Quad(node[1], xm, y1, x22, ym),
        new Quad(node[0], x1, y1, xm, ym)
      );
      if (i = (y2 >= ym) << 1 | x2 >= xm) {
        q = quads[quads.length - 1];
        quads[quads.length - 1] = quads[quads.length - 1 - i];
        quads[quads.length - 1 - i] = q;
      }
    } else {
      var dx = x2 - +this._x.call(null, node.data), dy = y2 - +this._y.call(null, node.data), d2 = dx * dx + dy * dy;
      if (d2 < radius) {
        var d = Math.sqrt(radius = d2);
        x0 = x2 - d, y0 = y2 - d;
        x3 = x2 + d, y3 = y2 + d;
        data = node.data;
      }
    }
  }
  return data;
}
function tree_remove(d) {
  if (isNaN(x2 = +this._x.call(null, d)) || isNaN(y2 = +this._y.call(null, d))) return this;
  var parent, node = this._root, retainer, previous, next, x0 = this._x0, y0 = this._y0, x1 = this._x1, y1 = this._y1, x2, y2, xm, ym, right, bottom, i, j;
  if (!node) return this;
  if (node.length) while (true) {
    if (right = x2 >= (xm = (x0 + x1) / 2)) x0 = xm;
    else x1 = xm;
    if (bottom = y2 >= (ym = (y0 + y1) / 2)) y0 = ym;
    else y1 = ym;
    if (!(parent = node, node = node[i = bottom << 1 | right])) return this;
    if (!node.length) break;
    if (parent[i + 1 & 3] || parent[i + 2 & 3] || parent[i + 3 & 3]) retainer = parent, j = i;
  }
  while (node.data !== d) if (!(previous = node, node = node.next)) return this;
  if (next = node.next) delete node.next;
  if (previous) return next ? previous.next = next : delete previous.next, this;
  if (!parent) return this._root = next, this;
  next ? parent[i] = next : delete parent[i];
  if ((node = parent[0] || parent[1] || parent[2] || parent[3]) && node === (parent[3] || parent[2] || parent[1] || parent[0]) && !node.length) {
    if (retainer) retainer[j] = node;
    else this._root = node;
  }
  return this;
}
function removeAll(data) {
  for (var i = 0, n = data.length; i < n; ++i) this.remove(data[i]);
  return this;
}
function tree_root() {
  return this._root;
}
function tree_size() {
  var size = 0;
  this.visit(function(node) {
    if (!node.length) do
      ++size;
    while (node = node.next);
  });
  return size;
}
function tree_visit(callback) {
  var quads = [], q, node = this._root, child, x0, y0, x1, y1;
  if (node) quads.push(new Quad(node, this._x0, this._y0, this._x1, this._y1));
  while (q = quads.pop()) {
    if (!callback(node = q.node, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1) && node.length) {
      var xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
      if (child = node[3]) quads.push(new Quad(child, xm, ym, x1, y1));
      if (child = node[2]) quads.push(new Quad(child, x0, ym, xm, y1));
      if (child = node[1]) quads.push(new Quad(child, xm, y0, x1, ym));
      if (child = node[0]) quads.push(new Quad(child, x0, y0, xm, ym));
    }
  }
  return this;
}
function tree_visitAfter(callback) {
  var quads = [], next = [], q;
  if (this._root) quads.push(new Quad(this._root, this._x0, this._y0, this._x1, this._y1));
  while (q = quads.pop()) {
    var node = q.node;
    if (node.length) {
      var child, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1, xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
      if (child = node[0]) quads.push(new Quad(child, x0, y0, xm, ym));
      if (child = node[1]) quads.push(new Quad(child, xm, y0, x1, ym));
      if (child = node[2]) quads.push(new Quad(child, x0, ym, xm, y1));
      if (child = node[3]) quads.push(new Quad(child, xm, ym, x1, y1));
    }
    next.push(q);
  }
  while (q = next.pop()) {
    callback(q.node, q.x0, q.y0, q.x1, q.y1);
  }
  return this;
}
function defaultX(d) {
  return d[0];
}
function tree_x(_) {
  return arguments.length ? (this._x = _, this) : this._x;
}
function defaultY(d) {
  return d[1];
}
function tree_y(_) {
  return arguments.length ? (this._y = _, this) : this._y;
}
function quadtree(nodes, x2, y2) {
  var tree = new Quadtree(x2 == null ? defaultX : x2, y2 == null ? defaultY : y2, NaN, NaN, NaN, NaN);
  return nodes == null ? tree : tree.addAll(nodes);
}
function Quadtree(x2, y2, x0, y0, x1, y1) {
  this._x = x2;
  this._y = y2;
  this._x0 = x0;
  this._y0 = y0;
  this._x1 = x1;
  this._y1 = y1;
  this._root = void 0;
}
function leaf_copy(leaf) {
  var copy = { data: leaf.data }, next = copy;
  while (leaf = leaf.next) next = next.next = { data: leaf.data };
  return copy;
}
var treeProto = quadtree.prototype = Quadtree.prototype;
treeProto.copy = function() {
  var copy = new Quadtree(this._x, this._y, this._x0, this._y0, this._x1, this._y1), node = this._root, nodes, child;
  if (!node) return copy;
  if (!node.length) return copy._root = leaf_copy(node), copy;
  nodes = [{ source: node, target: copy._root = new Array(4) }];
  while (node = nodes.pop()) {
    for (var i = 0; i < 4; ++i) {
      if (child = node.source[i]) {
        if (child.length) nodes.push({ source: child, target: node.target[i] = new Array(4) });
        else node.target[i] = leaf_copy(child);
      }
    }
  }
  return copy;
};
treeProto.add = tree_add;
treeProto.addAll = addAll;
treeProto.cover = tree_cover;
treeProto.data = tree_data;
treeProto.extent = tree_extent;
treeProto.find = tree_find;
treeProto.remove = tree_remove;
treeProto.removeAll = removeAll;
treeProto.root = tree_root;
treeProto.size = tree_size;
treeProto.visit = tree_visit;
treeProto.visitAfter = tree_visitAfter;
treeProto.x = tree_x;
treeProto.y = tree_y;
function constant$1(x2) {
  return function() {
    return x2;
  };
}
function jiggle(random) {
  return (random() - 0.5) * 1e-6;
}
function x$1(d) {
  return d.x + d.vx;
}
function y$1(d) {
  return d.y + d.vy;
}
function collide(radius) {
  var nodes, radii, random, strength = 1, iterations = 1;
  if (typeof radius !== "function") radius = constant$1(radius == null ? 1 : +radius);
  function force() {
    var i, n = nodes.length, tree, node, xi, yi, ri, ri2;
    for (var k = 0; k < iterations; ++k) {
      tree = quadtree(nodes, x$1, y$1).visitAfter(prepare);
      for (i = 0; i < n; ++i) {
        node = nodes[i];
        ri = radii[node.index], ri2 = ri * ri;
        xi = node.x + node.vx;
        yi = node.y + node.vy;
        tree.visit(apply);
      }
    }
    function apply(quad, x0, y0, x1, y1) {
      var data = quad.data, rj = quad.r, r = ri + rj;
      if (data) {
        if (data.index > node.index) {
          var x2 = xi - data.x - data.vx, y2 = yi - data.y - data.vy, l = x2 * x2 + y2 * y2;
          if (l < r * r) {
            if (x2 === 0) x2 = jiggle(random), l += x2 * x2;
            if (y2 === 0) y2 = jiggle(random), l += y2 * y2;
            l = (r - (l = Math.sqrt(l))) / l * strength;
            node.vx += (x2 *= l) * (r = (rj *= rj) / (ri2 + rj));
            node.vy += (y2 *= l) * r;
            data.vx -= x2 * (r = 1 - r);
            data.vy -= y2 * r;
          }
        }
        return;
      }
      return x0 > xi + r || x1 < xi - r || y0 > yi + r || y1 < yi - r;
    }
  }
  function prepare(quad) {
    if (quad.data) return quad.r = radii[quad.data.index];
    for (var i = quad.r = 0; i < 4; ++i) {
      if (quad[i] && quad[i].r > quad.r) {
        quad.r = quad[i].r;
      }
    }
  }
  function initialize() {
    if (!nodes) return;
    var i, n = nodes.length, node;
    radii = new Array(n);
    for (i = 0; i < n; ++i) node = nodes[i], radii[node.index] = +radius(node, i, nodes);
  }
  force.initialize = function(_nodes, _random) {
    nodes = _nodes;
    random = _random;
    initialize();
  };
  force.iterations = function(_) {
    return arguments.length ? (iterations = +_, force) : iterations;
  };
  force.strength = function(_) {
    return arguments.length ? (strength = +_, force) : strength;
  };
  force.radius = function(_) {
    return arguments.length ? (radius = typeof _ === "function" ? _ : constant$1(+_), initialize(), force) : radius;
  };
  return force;
}
function index(d) {
  return d.index;
}
function find(nodeById, nodeId) {
  var node = nodeById.get(nodeId);
  if (!node) throw new Error("node not found: " + nodeId);
  return node;
}
function link(links) {
  var id = index, strength = defaultStrength, strengths, distance = constant$1(30), distances, nodes, count, bias, random, iterations = 1;
  if (links == null) links = [];
  function defaultStrength(link2) {
    return 1 / Math.min(count[link2.source.index], count[link2.target.index]);
  }
  function force(alpha) {
    for (var k = 0, n = links.length; k < iterations; ++k) {
      for (var i = 0, link2, source, target, x2, y2, l, b; i < n; ++i) {
        link2 = links[i], source = link2.source, target = link2.target;
        x2 = target.x + target.vx - source.x - source.vx || jiggle(random);
        y2 = target.y + target.vy - source.y - source.vy || jiggle(random);
        l = Math.sqrt(x2 * x2 + y2 * y2);
        l = (l - distances[i]) / l * alpha * strengths[i];
        x2 *= l, y2 *= l;
        target.vx -= x2 * (b = bias[i]);
        target.vy -= y2 * b;
        source.vx += x2 * (b = 1 - b);
        source.vy += y2 * b;
      }
    }
  }
  function initialize() {
    if (!nodes) return;
    var i, n = nodes.length, m2 = links.length, nodeById = new Map(nodes.map((d, i2) => [id(d, i2, nodes), d])), link2;
    for (i = 0, count = new Array(n); i < m2; ++i) {
      link2 = links[i], link2.index = i;
      if (typeof link2.source !== "object") link2.source = find(nodeById, link2.source);
      if (typeof link2.target !== "object") link2.target = find(nodeById, link2.target);
      count[link2.source.index] = (count[link2.source.index] || 0) + 1;
      count[link2.target.index] = (count[link2.target.index] || 0) + 1;
    }
    for (i = 0, bias = new Array(m2); i < m2; ++i) {
      link2 = links[i], bias[i] = count[link2.source.index] / (count[link2.source.index] + count[link2.target.index]);
    }
    strengths = new Array(m2), initializeStrength();
    distances = new Array(m2), initializeDistance();
  }
  function initializeStrength() {
    if (!nodes) return;
    for (var i = 0, n = links.length; i < n; ++i) {
      strengths[i] = +strength(links[i], i, links);
    }
  }
  function initializeDistance() {
    if (!nodes) return;
    for (var i = 0, n = links.length; i < n; ++i) {
      distances[i] = +distance(links[i], i, links);
    }
  }
  force.initialize = function(_nodes, _random) {
    nodes = _nodes;
    random = _random;
    initialize();
  };
  force.links = function(_) {
    return arguments.length ? (links = _, initialize(), force) : links;
  };
  force.id = function(_) {
    return arguments.length ? (id = _, force) : id;
  };
  force.iterations = function(_) {
    return arguments.length ? (iterations = +_, force) : iterations;
  };
  force.strength = function(_) {
    return arguments.length ? (strength = typeof _ === "function" ? _ : constant$1(+_), initializeStrength(), force) : strength;
  };
  force.distance = function(_) {
    return arguments.length ? (distance = typeof _ === "function" ? _ : constant$1(+_), initializeDistance(), force) : distance;
  };
  return force;
}
const a = 1664525;
const c = 1013904223;
const m = 4294967296;
function lcg() {
  let s = 1;
  return () => (s = (a * s + c) % m) / m;
}
function x(d) {
  return d.x;
}
function y(d) {
  return d.y;
}
var initialRadius = 10, initialAngle = Math.PI * (3 - Math.sqrt(5));
function simulation(nodes) {
  var simulation2, alpha = 1, alphaMin = 1e-3, alphaDecay = 1 - Math.pow(alphaMin, 1 / 300), alphaTarget = 0, velocityDecay = 0.6, forces = /* @__PURE__ */ new Map(), stepper = timer(step), event = dispatch("tick", "end"), random = lcg();
  if (nodes == null) nodes = [];
  function step() {
    tick();
    event.call("tick", simulation2);
    if (alpha < alphaMin) {
      stepper.stop();
      event.call("end", simulation2);
    }
  }
  function tick(iterations) {
    var i, n = nodes.length, node;
    if (iterations === void 0) iterations = 1;
    for (var k = 0; k < iterations; ++k) {
      alpha += (alphaTarget - alpha) * alphaDecay;
      forces.forEach(function(force) {
        force(alpha);
      });
      for (i = 0; i < n; ++i) {
        node = nodes[i];
        if (node.fx == null) node.x += node.vx *= velocityDecay;
        else node.x = node.fx, node.vx = 0;
        if (node.fy == null) node.y += node.vy *= velocityDecay;
        else node.y = node.fy, node.vy = 0;
      }
    }
    return simulation2;
  }
  function initializeNodes() {
    for (var i = 0, n = nodes.length, node; i < n; ++i) {
      node = nodes[i], node.index = i;
      if (node.fx != null) node.x = node.fx;
      if (node.fy != null) node.y = node.fy;
      if (isNaN(node.x) || isNaN(node.y)) {
        var radius = initialRadius * Math.sqrt(0.5 + i), angle = i * initialAngle;
        node.x = radius * Math.cos(angle);
        node.y = radius * Math.sin(angle);
      }
      if (isNaN(node.vx) || isNaN(node.vy)) {
        node.vx = node.vy = 0;
      }
    }
  }
  function initializeForce(force) {
    if (force.initialize) force.initialize(nodes, random);
    return force;
  }
  initializeNodes();
  return simulation2 = {
    tick,
    restart: function() {
      return stepper.restart(step), simulation2;
    },
    stop: function() {
      return stepper.stop(), simulation2;
    },
    nodes: function(_) {
      return arguments.length ? (nodes = _, initializeNodes(), forces.forEach(initializeForce), simulation2) : nodes;
    },
    alpha: function(_) {
      return arguments.length ? (alpha = +_, simulation2) : alpha;
    },
    alphaMin: function(_) {
      return arguments.length ? (alphaMin = +_, simulation2) : alphaMin;
    },
    alphaDecay: function(_) {
      return arguments.length ? (alphaDecay = +_, simulation2) : +alphaDecay;
    },
    alphaTarget: function(_) {
      return arguments.length ? (alphaTarget = +_, simulation2) : alphaTarget;
    },
    velocityDecay: function(_) {
      return arguments.length ? (velocityDecay = 1 - _, simulation2) : 1 - velocityDecay;
    },
    randomSource: function(_) {
      return arguments.length ? (random = _, forces.forEach(initializeForce), simulation2) : random;
    },
    force: function(name, _) {
      return arguments.length > 1 ? (_ == null ? forces.delete(name) : forces.set(name, initializeForce(_)), simulation2) : forces.get(name);
    },
    find: function(x2, y2, radius) {
      var i = 0, n = nodes.length, dx, dy, d2, node, closest;
      if (radius == null) radius = Infinity;
      else radius *= radius;
      for (i = 0; i < n; ++i) {
        node = nodes[i];
        dx = x2 - node.x;
        dy = y2 - node.y;
        d2 = dx * dx + dy * dy;
        if (d2 < radius) closest = node, radius = d2;
      }
      return closest;
    },
    on: function(name, _) {
      return arguments.length > 1 ? (event.on(name, _), simulation2) : event.on(name);
    }
  };
}
function manyBody() {
  var nodes, node, random, alpha, strength = constant$1(-30), strengths, distanceMin2 = 1, distanceMax2 = Infinity, theta2 = 0.81;
  function force(_) {
    var i, n = nodes.length, tree = quadtree(nodes, x, y).visitAfter(accumulate);
    for (alpha = _, i = 0; i < n; ++i) node = nodes[i], tree.visit(apply);
  }
  function initialize() {
    if (!nodes) return;
    var i, n = nodes.length, node2;
    strengths = new Array(n);
    for (i = 0; i < n; ++i) node2 = nodes[i], strengths[node2.index] = +strength(node2, i, nodes);
  }
  function accumulate(quad) {
    var strength2 = 0, q, c2, weight = 0, x2, y2, i;
    if (quad.length) {
      for (x2 = y2 = i = 0; i < 4; ++i) {
        if ((q = quad[i]) && (c2 = Math.abs(q.value))) {
          strength2 += q.value, weight += c2, x2 += c2 * q.x, y2 += c2 * q.y;
        }
      }
      quad.x = x2 / weight;
      quad.y = y2 / weight;
    } else {
      q = quad;
      q.x = q.data.x;
      q.y = q.data.y;
      do
        strength2 += strengths[q.data.index];
      while (q = q.next);
    }
    quad.value = strength2;
  }
  function apply(quad, x1, _, x2) {
    if (!quad.value) return true;
    var x3 = quad.x - node.x, y2 = quad.y - node.y, w = x2 - x1, l = x3 * x3 + y2 * y2;
    if (w * w / theta2 < l) {
      if (l < distanceMax2) {
        if (x3 === 0) x3 = jiggle(random), l += x3 * x3;
        if (y2 === 0) y2 = jiggle(random), l += y2 * y2;
        if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);
        node.vx += x3 * quad.value * alpha / l;
        node.vy += y2 * quad.value * alpha / l;
      }
      return true;
    } else if (quad.length || l >= distanceMax2) return;
    if (quad.data !== node || quad.next) {
      if (x3 === 0) x3 = jiggle(random), l += x3 * x3;
      if (y2 === 0) y2 = jiggle(random), l += y2 * y2;
      if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);
    }
    do
      if (quad.data !== node) {
        w = strengths[quad.data.index] * alpha / l;
        node.vx += x3 * w;
        node.vy += y2 * w;
      }
    while (quad = quad.next);
  }
  force.initialize = function(_nodes, _random) {
    nodes = _nodes;
    random = _random;
    initialize();
  };
  force.strength = function(_) {
    return arguments.length ? (strength = typeof _ === "function" ? _ : constant$1(+_), initialize(), force) : strength;
  };
  force.distanceMin = function(_) {
    return arguments.length ? (distanceMin2 = _ * _, force) : Math.sqrt(distanceMin2);
  };
  force.distanceMax = function(_) {
    return arguments.length ? (distanceMax2 = _ * _, force) : Math.sqrt(distanceMax2);
  };
  force.theta = function(_) {
    return arguments.length ? (theta2 = _ * _, force) : Math.sqrt(theta2);
  };
  return force;
}
const constant = (x2) => () => x2;
function ZoomEvent(type, {
  sourceEvent: sourceEvent2,
  target,
  transform,
  dispatch: dispatch2
}) {
  Object.defineProperties(this, {
    type: { value: type, enumerable: true, configurable: true },
    sourceEvent: { value: sourceEvent2, enumerable: true, configurable: true },
    target: { value: target, enumerable: true, configurable: true },
    transform: { value: transform, enumerable: true, configurable: true },
    _: { value: dispatch2 }
  });
}
function nopropagation(event) {
  event.stopImmediatePropagation();
}
function noevent(event) {
  event.preventDefault();
  event.stopImmediatePropagation();
}
function defaultFilter(event) {
  return (!event.ctrlKey || event.type === "wheel") && !event.button;
}
function defaultExtent() {
  var e = this;
  if (e instanceof SVGElement) {
    e = e.ownerSVGElement || e;
    if (e.hasAttribute("viewBox")) {
      e = e.viewBox.baseVal;
      return [[e.x, e.y], [e.x + e.width, e.y + e.height]];
    }
    return [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]];
  }
  return [[0, 0], [e.clientWidth, e.clientHeight]];
}
function defaultTransform() {
  return this.__zoom || identity;
}
function defaultWheelDelta(event) {
  return -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 2e-3) * (event.ctrlKey ? 10 : 1);
}
function defaultTouchable() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function defaultConstrain(transform, extent, translateExtent) {
  var dx0 = transform.invertX(extent[0][0]) - translateExtent[0][0], dx1 = transform.invertX(extent[1][0]) - translateExtent[1][0], dy0 = transform.invertY(extent[0][1]) - translateExtent[0][1], dy1 = transform.invertY(extent[1][1]) - translateExtent[1][1];
  return transform.translate(
    dx1 > dx0 ? (dx0 + dx1) / 2 : Math.min(0, dx0) || Math.max(0, dx1),
    dy1 > dy0 ? (dy0 + dy1) / 2 : Math.min(0, dy0) || Math.max(0, dy1)
  );
}
function zoom() {
  var filter = defaultFilter, extent = defaultExtent, constrain = defaultConstrain, wheelDelta = defaultWheelDelta, touchable = defaultTouchable, scaleExtent = [0, Infinity], translateExtent = [[-Infinity, -Infinity], [Infinity, Infinity]], duration = 250, interpolate = interpolateZoom, listeners = dispatch("start", "zoom", "end"), touchstarting, touchfirst, touchending, touchDelay = 500, wheelDelay = 150, clickDistance2 = 0, tapDistance = 10;
  function zoom2(selection) {
    selection.property("__zoom", defaultTransform).on("wheel.zoom", wheeled, { passive: false }).on("mousedown.zoom", mousedowned).on("dblclick.zoom", dblclicked).filter(touchable).on("touchstart.zoom", touchstarted).on("touchmove.zoom", touchmoved).on("touchend.zoom touchcancel.zoom", touchended).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  zoom2.transform = function(collection, transform, point, event) {
    var selection = collection.selection ? collection.selection() : collection;
    selection.property("__zoom", defaultTransform);
    if (collection !== selection) {
      schedule(collection, transform, point, event);
    } else {
      selection.interrupt().each(function() {
        gesture(this, arguments).event(event).start().zoom(null, typeof transform === "function" ? transform.apply(this, arguments) : transform).end();
      });
    }
  };
  zoom2.scaleBy = function(selection, k, p, event) {
    zoom2.scaleTo(selection, function() {
      var k0 = this.__zoom.k, k1 = typeof k === "function" ? k.apply(this, arguments) : k;
      return k0 * k1;
    }, p, event);
  };
  zoom2.scaleTo = function(selection, k, p, event) {
    zoom2.transform(selection, function() {
      var e = extent.apply(this, arguments), t0 = this.__zoom, p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p, p1 = t0.invert(p0), k1 = typeof k === "function" ? k.apply(this, arguments) : k;
      return constrain(translate(scale(t0, k1), p0, p1), e, translateExtent);
    }, p, event);
  };
  zoom2.translateBy = function(selection, x2, y2, event) {
    zoom2.transform(selection, function() {
      return constrain(this.__zoom.translate(
        typeof x2 === "function" ? x2.apply(this, arguments) : x2,
        typeof y2 === "function" ? y2.apply(this, arguments) : y2
      ), extent.apply(this, arguments), translateExtent);
    }, null, event);
  };
  zoom2.translateTo = function(selection, x2, y2, p, event) {
    zoom2.transform(selection, function() {
      var e = extent.apply(this, arguments), t = this.__zoom, p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p;
      return constrain(identity.translate(p0[0], p0[1]).scale(t.k).translate(
        typeof x2 === "function" ? -x2.apply(this, arguments) : -x2,
        typeof y2 === "function" ? -y2.apply(this, arguments) : -y2
      ), e, translateExtent);
    }, p, event);
  };
  function scale(transform, k) {
    k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], k));
    return k === transform.k ? transform : new Transform(k, transform.x, transform.y);
  }
  function translate(transform, p0, p1) {
    var x2 = p0[0] - p1[0] * transform.k, y2 = p0[1] - p1[1] * transform.k;
    return x2 === transform.x && y2 === transform.y ? transform : new Transform(transform.k, x2, y2);
  }
  function centroid(extent2) {
    return [(+extent2[0][0] + +extent2[1][0]) / 2, (+extent2[0][1] + +extent2[1][1]) / 2];
  }
  function schedule(transition, transform, point, event) {
    transition.on("start.zoom", function() {
      gesture(this, arguments).event(event).start();
    }).on("interrupt.zoom end.zoom", function() {
      gesture(this, arguments).event(event).end();
    }).tween("zoom", function() {
      var that = this, args = arguments, g = gesture(that, args).event(event), e = extent.apply(that, args), p = point == null ? centroid(e) : typeof point === "function" ? point.apply(that, args) : point, w = Math.max(e[1][0] - e[0][0], e[1][1] - e[0][1]), a2 = that.__zoom, b = typeof transform === "function" ? transform.apply(that, args) : transform, i = interpolate(a2.invert(p).concat(w / a2.k), b.invert(p).concat(w / b.k));
      return function(t) {
        if (t === 1) t = b;
        else {
          var l = i(t), k = w / l[2];
          t = new Transform(k, p[0] - l[0] * k, p[1] - l[1] * k);
        }
        g.zoom(null, t);
      };
    });
  }
  function gesture(that, args, clean) {
    return !clean && that.__zooming || new Gesture(that, args);
  }
  function Gesture(that, args) {
    this.that = that;
    this.args = args;
    this.active = 0;
    this.sourceEvent = null;
    this.extent = extent.apply(that, args);
    this.taps = 0;
  }
  Gesture.prototype = {
    event: function(event) {
      if (event) this.sourceEvent = event;
      return this;
    },
    start: function() {
      if (++this.active === 1) {
        this.that.__zooming = this;
        this.emit("start");
      }
      return this;
    },
    zoom: function(key, transform) {
      if (this.mouse && key !== "mouse") this.mouse[1] = transform.invert(this.mouse[0]);
      if (this.touch0 && key !== "touch") this.touch0[1] = transform.invert(this.touch0[0]);
      if (this.touch1 && key !== "touch") this.touch1[1] = transform.invert(this.touch1[0]);
      this.that.__zoom = transform;
      this.emit("zoom");
      return this;
    },
    end: function() {
      if (--this.active === 0) {
        delete this.that.__zooming;
        this.emit("end");
      }
      return this;
    },
    emit: function(type) {
      var d = select(this.that).datum();
      listeners.call(
        type,
        this.that,
        new ZoomEvent(type, {
          sourceEvent: this.sourceEvent,
          target: zoom2,
          transform: this.that.__zoom,
          dispatch: listeners
        }),
        d
      );
    }
  };
  function wheeled(event, ...args) {
    if (!filter.apply(this, arguments)) return;
    var g = gesture(this, args).event(event), t = this.__zoom, k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], t.k * Math.pow(2, wheelDelta.apply(this, arguments)))), p = pointer(event);
    if (g.wheel) {
      if (g.mouse[0][0] !== p[0] || g.mouse[0][1] !== p[1]) {
        g.mouse[1] = t.invert(g.mouse[0] = p);
      }
      clearTimeout(g.wheel);
    } else if (t.k === k) return;
    else {
      g.mouse = [p, t.invert(p)];
      interrupt(this);
      g.start();
    }
    noevent(event);
    g.wheel = setTimeout(wheelidled, wheelDelay);
    g.zoom("mouse", constrain(translate(scale(t, k), g.mouse[0], g.mouse[1]), g.extent, translateExtent));
    function wheelidled() {
      g.wheel = null;
      g.end();
    }
  }
  function mousedowned(event, ...args) {
    if (touchending || !filter.apply(this, arguments)) return;
    var currentTarget = event.currentTarget, g = gesture(this, args, true).event(event), v = select(event.view).on("mousemove.zoom", mousemoved, true).on("mouseup.zoom", mouseupped, true), p = pointer(event, currentTarget), x0 = event.clientX, y0 = event.clientY;
    dragDisable(event.view);
    nopropagation(event);
    g.mouse = [p, this.__zoom.invert(p)];
    interrupt(this);
    g.start();
    function mousemoved(event2) {
      noevent(event2);
      if (!g.moved) {
        var dx = event2.clientX - x0, dy = event2.clientY - y0;
        g.moved = dx * dx + dy * dy > clickDistance2;
      }
      g.event(event2).zoom("mouse", constrain(translate(g.that.__zoom, g.mouse[0] = pointer(event2, currentTarget), g.mouse[1]), g.extent, translateExtent));
    }
    function mouseupped(event2) {
      v.on("mousemove.zoom mouseup.zoom", null);
      yesdrag(event2.view, g.moved);
      noevent(event2);
      g.event(event2).end();
    }
  }
  function dblclicked(event, ...args) {
    if (!filter.apply(this, arguments)) return;
    var t0 = this.__zoom, p0 = pointer(event.changedTouches ? event.changedTouches[0] : event, this), p1 = t0.invert(p0), k1 = t0.k * (event.shiftKey ? 0.5 : 2), t1 = constrain(translate(scale(t0, k1), p0, p1), extent.apply(this, args), translateExtent);
    noevent(event);
    if (duration > 0) select(this).transition().duration(duration).call(schedule, t1, p0, event);
    else select(this).call(zoom2.transform, t1, p0, event);
  }
  function touchstarted(event, ...args) {
    if (!filter.apply(this, arguments)) return;
    var touches = event.touches, n = touches.length, g = gesture(this, args, event.changedTouches.length === n).event(event), started, i, t, p;
    nopropagation(event);
    for (i = 0; i < n; ++i) {
      t = touches[i], p = pointer(t, this);
      p = [p, this.__zoom.invert(p), t.identifier];
      if (!g.touch0) g.touch0 = p, started = true, g.taps = 1 + !!touchstarting;
      else if (!g.touch1 && g.touch0[2] !== p[2]) g.touch1 = p, g.taps = 0;
    }
    if (touchstarting) touchstarting = clearTimeout(touchstarting);
    if (started) {
      if (g.taps < 2) touchfirst = p[0], touchstarting = setTimeout(function() {
        touchstarting = null;
      }, touchDelay);
      interrupt(this);
      g.start();
    }
  }
  function touchmoved(event, ...args) {
    if (!this.__zooming) return;
    var g = gesture(this, args).event(event), touches = event.changedTouches, n = touches.length, i, t, p, l;
    noevent(event);
    for (i = 0; i < n; ++i) {
      t = touches[i], p = pointer(t, this);
      if (g.touch0 && g.touch0[2] === t.identifier) g.touch0[0] = p;
      else if (g.touch1 && g.touch1[2] === t.identifier) g.touch1[0] = p;
    }
    t = g.that.__zoom;
    if (g.touch1) {
      var p0 = g.touch0[0], l0 = g.touch0[1], p1 = g.touch1[0], l1 = g.touch1[1], dp = (dp = p1[0] - p0[0]) * dp + (dp = p1[1] - p0[1]) * dp, dl = (dl = l1[0] - l0[0]) * dl + (dl = l1[1] - l0[1]) * dl;
      t = scale(t, Math.sqrt(dp / dl));
      p = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
      l = [(l0[0] + l1[0]) / 2, (l0[1] + l1[1]) / 2];
    } else if (g.touch0) p = g.touch0[0], l = g.touch0[1];
    else return;
    g.zoom("touch", constrain(translate(t, p, l), g.extent, translateExtent));
  }
  function touchended(event, ...args) {
    if (!this.__zooming) return;
    var g = gesture(this, args).event(event), touches = event.changedTouches, n = touches.length, i, t;
    nopropagation(event);
    if (touchending) clearTimeout(touchending);
    touchending = setTimeout(function() {
      touchending = null;
    }, touchDelay);
    for (i = 0; i < n; ++i) {
      t = touches[i];
      if (g.touch0 && g.touch0[2] === t.identifier) delete g.touch0;
      else if (g.touch1 && g.touch1[2] === t.identifier) delete g.touch1;
    }
    if (g.touch1 && !g.touch0) g.touch0 = g.touch1, delete g.touch1;
    if (g.touch0) g.touch0[1] = this.__zoom.invert(g.touch0[0]);
    else {
      g.end();
      if (g.taps === 2) {
        t = pointer(t, this);
        if (Math.hypot(touchfirst[0] - t[0], touchfirst[1] - t[1]) < tapDistance) {
          var p = select(this).on("dblclick.zoom");
          if (p) p.apply(this, arguments);
        }
      }
    }
  }
  zoom2.wheelDelta = function(_) {
    return arguments.length ? (wheelDelta = typeof _ === "function" ? _ : constant(+_), zoom2) : wheelDelta;
  };
  zoom2.filter = function(_) {
    return arguments.length ? (filter = typeof _ === "function" ? _ : constant(!!_), zoom2) : filter;
  };
  zoom2.touchable = function(_) {
    return arguments.length ? (touchable = typeof _ === "function" ? _ : constant(!!_), zoom2) : touchable;
  };
  zoom2.extent = function(_) {
    return arguments.length ? (extent = typeof _ === "function" ? _ : constant([[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]]), zoom2) : extent;
  };
  zoom2.scaleExtent = function(_) {
    return arguments.length ? (scaleExtent[0] = +_[0], scaleExtent[1] = +_[1], zoom2) : [scaleExtent[0], scaleExtent[1]];
  };
  zoom2.translateExtent = function(_) {
    return arguments.length ? (translateExtent[0][0] = +_[0][0], translateExtent[1][0] = +_[1][0], translateExtent[0][1] = +_[0][1], translateExtent[1][1] = +_[1][1], zoom2) : [[translateExtent[0][0], translateExtent[0][1]], [translateExtent[1][0], translateExtent[1][1]]];
  };
  zoom2.constrain = function(_) {
    return arguments.length ? (constrain = _, zoom2) : constrain;
  };
  zoom2.duration = function(_) {
    return arguments.length ? (duration = +_, zoom2) : duration;
  };
  zoom2.interpolate = function(_) {
    return arguments.length ? (interpolate = _, zoom2) : interpolate;
  };
  zoom2.on = function() {
    var value = listeners.on.apply(listeners, arguments);
    return value === listeners ? zoom2 : value;
  };
  zoom2.clickDistance = function(_) {
    return arguments.length ? (clickDistance2 = (_ = +_) * _, zoom2) : Math.sqrt(clickDistance2);
  };
  zoom2.tapDistance = function(_) {
    return arguments.length ? (tapDistance = +_, zoom2) : tapDistance;
  };
  return zoom2;
}
const _hoisted_1 = { class: "main-content" };
const _hoisted_2 = { class: "viz-card" };
const _hoisted_3 = { class: "bipartite-controls" };
const _hoisted_4 = { class: "legend-row" };
const _hoisted_5 = { class: "legend-section" };
const _hoisted_6 = { class: "legend-items" };
const _hoisted_7 = ["width"];
const _hoisted_8 = { class: "tooltip-title" };
const _hoisted_9 = { class: "tooltip-meta" };
const _hoisted_10 = {
  key: 0,
  class: "tooltip-list"
};
const _hoisted_11 = {
  key: 0,
  class: "loading-overlay"
};
const height = 600;
const _sfc_main = {
  __name: "BipartiteNetworkView",
  setup(__props) {
    const APP_GENRE = {
      "Beat Saber": "Game",
      "VTOL VR": "Simulation",
      "Half Life: Alyx": "Game",
      "ShapesXR": "Productivity",
      "Archery Pro": "Game",
      "Roblox": "Game",
      "Forever Pets": "Game",
      "War of Wizards": "Game",
      "Detective VR Demo": "Experience",
      "Artemis VR Demo": "Education",
      "Tennis Esports": "Game",
      "Ironstrike": "Game",
      "Gorilla Tag": "Game",
      "The Underpresents": "Experience",
      "Human Anatomy": "Education",
      "Meta Quest 3: Home": "System",
      "Tilt Brush VR": "Creativity"
    };
    const GENRE_COLORS = {
      Game: "rgba(205,55,53,0.8)",
      Simulation: "rgba(59,130,246,0.8)",
      Productivity: "rgba(34,197,94,0.8)",
      Experience: "rgba(168,85,247,0.8)",
      Education: "rgba(251,146,60,0.8)",
      System: "rgba(99,102,241,0.8)",
      Creativity: "rgba(20,184,166,0.8)"
    };
    const store = useDataStore();
    const svgContainer = ref(null);
    const svgEl = ref(null);
    const tooltipEl = ref(null);
    const width = ref(900);
    const isBipartite = ref(false);
    const tooltip = reactive({
      visible: false,
      x: 0,
      y: 0,
      title: "",
      meta: "",
      list: []
    });
    let simulation$1 = null;
    let svg = null;
    function buildGraph(observations) {
      const appCount = {};
      const techCount = {};
      const linkCount = {};
      for (const obs of observations) {
        const app = (obs.Application || "").trim();
        if (!app) continue;
        const techRaw = (obs.Interaction_Technique || "").trim();
        if (!techRaw) continue;
        const techs = techRaw.split(",").map((t) => t.trim()).filter(Boolean);
        appCount[app] = (appCount[app] || 0) + 1;
        for (const tech of techs) {
          techCount[tech] = (techCount[tech] || 0) + 1;
          const key = `${app}||${tech}`;
          linkCount[key] = (linkCount[key] || 0) + 1;
        }
      }
      const maxTech = Math.max(...Object.values(techCount), 1);
      const nodes = [];
      const nodeById = {};
      for (const [app, count] of Object.entries(appCount)) {
        const node = {
          id: `app:${app}`,
          type: "app",
          name: app,
          count,
          r: Math.max(8, Math.sqrt(count) * 5),
          genre: APP_GENRE[app] || "Game"
        };
        nodes.push(node);
        nodeById[node.id] = node;
      }
      for (const [tech, count] of Object.entries(techCount)) {
        const node = {
          id: `tech:${tech}`,
          type: "technique",
          name: tech,
          count,
          r: Math.max(10, Math.sqrt(count) * 4),
          freq: count / maxTech
        };
        nodes.push(node);
        nodeById[node.id] = node;
      }
      const links = [];
      for (const [key, count] of Object.entries(linkCount)) {
        const [app, tech] = key.split("||");
        const source = `app:${app}`;
        const target = `tech:${tech}`;
        if (nodeById[source] && nodeById[target]) {
          links.push({ source, target, count });
        }
      }
      return { nodes, links, nodeById };
    }
    function techColor(freq) {
      const alpha = 0.25 + freq * 0.75;
      return `rgba(205,55,53,${alpha.toFixed(2)})`;
    }
    function linkStrokeWidth(count) {
      return Math.min(6, 1 + (count - 1) * 0.8);
    }
    function render(nodes, links) {
      const w = width.value;
      const h = height;
      svg = select(svgEl.value);
      svg.selectAll("*").remove();
      svg.attr("width", w).attr("height", h);
      svg.append("defs");
      const g = svg.append("g");
      svg.call(
        zoom().scaleExtent([0.3, 3]).on("zoom", (event) => {
          g.attr("transform", event.transform);
        })
      );
      const link$1 = g.append("g").attr("class", "links").selectAll("line").data(links).join("line").attr("stroke", "#cd3735").attr("stroke-opacity", 0.5).attr("stroke-width", (d) => linkStrokeWidth(d.count));
      const appNodes = nodes.filter((d) => d.type === "app");
      const techNodes = nodes.filter((d) => d.type === "technique");
      const appGroup = g.append("g").attr("class", "app-nodes").selectAll("g").data(appNodes).join("g").attr("class", "node-app").style("cursor", "grab").call(drag$1(simulation$1)).on("mouseenter", (event, d) => onHover(event, d, links, nodes)).on("mouseleave", () => onLeave(link$1, appGroup, techGroup));
      appGroup.append("circle").attr("r", (d) => d.r).attr("fill", (d) => GENRE_COLORS[d.genre] || GENRE_COLORS.Game).attr("stroke", "#fff").attr("stroke-width", 1.5);
      appGroup.append("text").attr("class", "app-label").attr("dy", (d) => -(d.r + 4)).attr("text-anchor", "middle").attr("font-size", "10px").attr("fill", "#333").attr("pointer-events", "none").attr("opacity", 0).text((d) => d.name);
      const techGroup = g.append("g").attr("class", "tech-nodes").selectAll("g").data(techNodes).join("g").attr("class", "node-tech").style("cursor", "grab").call(drag$1(simulation$1)).on("mouseenter", (event, d) => onHover(event, d, links, nodes)).on("mouseleave", () => onLeave(link$1, appGroup, techGroup));
      techGroup.append("circle").attr("r", (d) => d.r).attr("fill", (d) => techColor(d.freq)).attr("stroke", "#fff").attr("stroke-width", 1.5);
      techGroup.append("text").attr("dy", (d) => d.r + 12).attr("text-anchor", "middle").attr("font-size", "9px").attr("fill", "#555").attr("pointer-events", "none").text((d) => d.name);
      simulation$1 = simulation(nodes).force("link", link(links).id((d) => d.id).strength(0.4).distance(100)).force("charge", manyBody().strength((d) => d.type === "technique" ? -400 : -200)).force("collision", collide().radius((d) => d.r + 10)).force("center", center(w / 2, h / 2)).on("tick", () => {
        link$1.attr("x1", (d) => d.source.x).attr("y1", (d) => d.source.y).attr("x2", (d) => d.target.x).attr("y2", (d) => d.target.y);
        appGroup.attr("transform", (d) => `translate(${d.x},${d.y})`);
        techGroup.attr("transform", (d) => `translate(${d.x},${d.y})`);
      });
      appGroup.call(drag$1(simulation$1));
      techGroup.call(drag$1(simulation$1));
      return { link: link$1, appGroup, techGroup };
    }
    function drag$1(sim) {
      return drag().on("start", (event, d) => {
        if (!event.active) sim && sim.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }).on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      }).on("end", (event, d) => {
        if (!event.active) sim && sim.alphaTarget(0);
        if (!isBipartite.value) {
          d.fx = null;
          d.fy = null;
        }
      });
    }
    let linkSel, appGroupSel, techGroupSel;
    function onHover(event, d, links, nodes) {
      if (!linkSel) return;
      const connectedIds = /* @__PURE__ */ new Set();
      const connectedLinks = [];
      for (const lk of links) {
        const srcId = lk.source.id || lk.source;
        const tgtId = lk.target.id || lk.target;
        if (srcId === d.id || tgtId === d.id) {
          connectedLinks.push(lk);
          connectedIds.add(srcId);
          connectedIds.add(tgtId);
        }
      }
      linkSel.attr("stroke-opacity", (lk) => {
        const srcId = lk.source.id || lk.source;
        const tgtId = lk.target.id || lk.target;
        return srcId === d.id || tgtId === d.id ? 0.9 : 0.08;
      }).attr("stroke-width", (lk) => {
        const srcId = lk.source.id || lk.source;
        const tgtId = lk.target.id || lk.target;
        return srcId === d.id || tgtId === d.id ? linkStrokeWidth(lk.count) + 1 : linkStrokeWidth(lk.count);
      });
      appGroupSel.select("circle").attr("opacity", (nd) => connectedIds.has(nd.id) || nd.id === d.id ? 1 : 0.2);
      appGroupSel.select(".app-label").attr("opacity", (nd) => connectedIds.has(nd.id) ? 1 : 0);
      techGroupSel.select("circle").attr("opacity", (nd) => connectedIds.has(nd.id) || nd.id === d.id ? 1 : 0.2);
      techGroupSel.select("text").attr("opacity", (nd) => connectedIds.has(nd.id) || nd.id === d.id ? 1 : 0.3);
      if (d.type === "app") {
        appGroupSel.filter((nd) => nd.id === d.id).select(".app-label").attr("opacity", 1);
      }
      const container = svgContainer.value.getBoundingClientRect();
      const ex = event.clientX - container.left;
      const ey = event.clientY - container.top;
      tooltip.visible = true;
      tooltip.x = Math.min(ex + 12, width.value - 200);
      tooltip.y = Math.max(ey - 10, 10);
      tooltip.title = d.name;
      if (d.type === "app") {
        tooltip.meta = `Genre: ${d.genre} · ${d.count} observations`;
        tooltip.list = connectedLinks.filter((lk) => (lk.source.id || lk.source) === d.id || (lk.target.id || lk.target) === d.id).map((lk) => {
          const tId = (lk.target.id || lk.target) === d.id ? lk.source.id || lk.source : lk.target.id || lk.target;
          const nd = nodes.find((n) => n.id === tId);
          return nd ? `${nd.name} (${lk.count})` : "";
        }).filter(Boolean);
      } else {
        tooltip.meta = `${d.count} total observations`;
        tooltip.list = connectedLinks.map((lk) => {
          const aId = (lk.source.id || lk.source) === d.id ? lk.target.id || lk.target : lk.source.id || lk.source;
          const nd = nodes.find((n) => n.id === aId);
          return nd ? `${nd.name} (${lk.count})` : "";
        }).filter(Boolean);
      }
    }
    function onLeave(link2, appGroup, techGroup) {
      link2.attr("stroke-opacity", 0.5).attr("stroke-width", (d) => linkStrokeWidth(d.count));
      appGroup.select("circle").attr("opacity", 1);
      appGroup.select(".app-label").attr("opacity", 0);
      techGroup.select("circle").attr("opacity", 1);
      techGroup.select("text").attr("opacity", 1);
      tooltip.visible = false;
    }
    let currentNodes = [];
    function toggleLayout() {
      isBipartite.value = !isBipartite.value;
      const w = width.value;
      if (isBipartite.value) {
        for (const n of currentNodes) {
          if (n.type === "app") {
            n.fx = w * 0.25;
          } else {
            n.fx = w * 0.75;
          }
        }
      } else {
        for (const n of currentNodes) {
          n.fx = null;
          n.fy = null;
        }
      }
      if (simulation$1) {
        simulation$1.alpha(0.5).restart();
      }
    }
    onMounted(async () => {
      if (svgContainer.value) {
        width.value = svgContainer.value.clientWidth || 900;
      }
      await store.load();
      const { nodes, links } = buildGraph(store.observations);
      currentNodes = nodes;
      const { link: link2, appGroup, techGroup } = render(nodes, links);
      linkSel = link2;
      appGroupSel = appGroup;
      techGroupSel = techGroup;
    });
    onUnmounted(() => {
      if (simulation$1) simulation$1.stop();
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        _cache[3] || (_cache[3] = createBaseVNode("h1", { class: "page-title" }, "Technique Adoption Landscape", -1)),
        _cache[4] || (_cache[4] = createBaseVNode("p", { class: "page-description" }, " Each circle represents either an application or an interaction technique. Lines connect applications to the techniques they use — line thickness shows how many observations share that connection. Techniques used by many applications appear as dense hubs, while application-specific techniques float at the periphery. This makes visible the paper's convergence finding: a small set of techniques have become the universal vocabulary of VR interaction. ", -1)),
        createBaseVNode("div", _hoisted_2, [
          createBaseVNode("div", _hoisted_3, [
            _cache[0] || (_cache[0] = createBaseVNode("h2", { class: "viz-card-title" }, "Application ↔ Technique Network", -1)),
            createBaseVNode("button", {
              class: "btn btn-outline layout-toggle",
              onClick: toggleLayout
            }, toDisplayString(isBipartite.value ? "Switch to Organic" : "Switch to Bipartite Layout"), 1)
          ]),
          createBaseVNode("div", _hoisted_4, [
            createBaseVNode("div", _hoisted_5, [
              _cache[1] || (_cache[1] = createBaseVNode("span", { class: "legend-label" }, "Applications (by genre):", -1)),
              createBaseVNode("div", _hoisted_6, [
                (openBlock(), createElementBlock(Fragment, null, renderList(GENRE_COLORS, (color, genre) => {
                  return createBaseVNode("div", {
                    key: genre,
                    class: "legend-item"
                  }, [
                    createBaseVNode("span", {
                      class: "legend-dot",
                      style: normalizeStyle({ background: color })
                    }, null, 4),
                    createBaseVNode("span", null, toDisplayString(genre), 1)
                  ]);
                }), 64))
              ])
            ]),
            _cache[2] || (_cache[2] = createStaticVNode('<div class="legend-section" data-v-774ff7f6><span class="legend-label" data-v-774ff7f6>Techniques (by frequency):</span><div class="legend-items" data-v-774ff7f6><div class="legend-item" data-v-774ff7f6><span class="legend-dot" style="background:rgba(205,55,53,0.3);" data-v-774ff7f6></span><span data-v-774ff7f6>Rare</span></div><div class="legend-item" data-v-774ff7f6><span class="legend-dot" style="background:rgba(205,55,53,0.65);" data-v-774ff7f6></span><span data-v-774ff7f6>Common</span></div><div class="legend-item" data-v-774ff7f6><span class="legend-dot" style="background:rgba(205,55,53,1.0);" data-v-774ff7f6></span><span data-v-774ff7f6>Frequent</span></div></div></div>', 1))
          ]),
          createBaseVNode("div", {
            ref_key: "svgContainer",
            ref: svgContainer,
            class: "svg-container"
          }, [
            (openBlock(), createElementBlock("svg", {
              ref_key: "svgEl",
              ref: svgEl,
              width: width.value,
              height
            }, null, 8, _hoisted_7)),
            withDirectives(createBaseVNode("div", {
              ref_key: "tooltipEl",
              ref: tooltipEl,
              class: "network-tooltip",
              style: normalizeStyle({ left: tooltip.x + "px", top: tooltip.y + "px" })
            }, [
              createBaseVNode("div", _hoisted_8, toDisplayString(tooltip.title), 1),
              createBaseVNode("div", _hoisted_9, toDisplayString(tooltip.meta), 1),
              tooltip.list.length ? (openBlock(), createElementBlock("div", _hoisted_10, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(tooltip.list, (item) => {
                  return openBlock(), createElementBlock("div", {
                    key: item,
                    class: "tooltip-list-item"
                  }, toDisplayString(item), 1);
                }), 128))
              ])) : createCommentVNode("", true)
            ], 4), [
              [vShow, tooltip.visible]
            ])
          ], 512),
          unref(store).loading ? (openBlock(), createElementBlock("div", _hoisted_11, "Loading data…")) : createCommentVNode("", true)
        ])
      ]);
    };
  }
};
const BipartiteNetworkView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-774ff7f6"]]);
export {
  BipartiteNetworkView as default
};
//# sourceMappingURL=BipartiteNetworkView-CyzLsgEq.js.map
