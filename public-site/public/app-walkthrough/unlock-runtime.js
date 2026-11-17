/* Unlock prototype runtime: renders one page's template with its Component logic.
   Supports {{holes}}, <sc-for>, <sc-if>, on* event holes, setState and in-place DOM updates. */
(function () {
  'use strict';
  var EVENTS = { onclick: 'click', onmouseenter: 'mouseenter', onmouseleave: 'mouseleave', onfocus: 'focusin', onblur: 'focusout', oninput: 'input', onchange: 'change' };
  var HOLE = /\{\{\s*([\w.$]+)\s*\}\}/g;

  function lookup(path, scope, vals) {
    var parts = path.split('.');
    var cur = Object.prototype.hasOwnProperty.call(scope, parts[0]) ? scope : vals;
    for (var i = 0; i < parts.length; i++) {
      if (cur == null) return undefined;
      cur = cur[parts[i]];
    }
    return cur;
  }
  function fill(text, scope, vals) {
    var whole = text.match(/^\s*\{\{\s*([\w.$]+)\s*\}\}\s*$/);
    if (whole) return lookup(whole[1], scope, vals);
    return text.replace(HOLE, function (_, p) { var v = lookup(p, scope, vals); return v == null ? '' : String(v); });
  }

  // Build a fresh DOM tree from the template for the current values.
  function build(node, scope, vals, out) {
    if (node.nodeType === 3) { out.appendChild(document.createTextNode(fill(node.data, scope, vals) ?? '')); return; }
    if (node.nodeType !== 1) return;
    var tag = node.tagName.toLowerCase();
    if (tag === 'sc-for') {
      var list = fill(node.getAttribute('list') || '', scope, vals) || [];
      var as = node.getAttribute('as') || 'item';
      for (var i = 0; i < list.length; i++) {
        var s = Object.create(scope); s[as] = list[i];
        for (var c = node.firstChild; c; c = c.nextSibling) build(c, s, vals, out);
      }
      return;
    }
    if (tag === 'sc-if') {
      if (fill(node.getAttribute('value') || '', scope, vals)) for (var k = node.firstChild; k; k = k.nextSibling) build(k, scope, vals, out);
      return;
    }
    var el = node.namespaceURI === 'http://www.w3.org/2000/svg' ? document.createElementNS(node.namespaceURI, node.tagName) : document.createElement(node.tagName);
    el.__h = {};
    for (var a = 0; a < node.attributes.length; a++) {
      var at = node.attributes[a], name = at.name.toLowerCase();
      if (EVENTS[name]) { var fn = fill(at.value, scope, vals); if (typeof fn === 'function') el.__h[EVENTS[name]] = fn; continue; }
      if (name.indexOf('hint-') === 0) continue;
      var v = fill(at.value, scope, vals);
      el.setAttribute(at.name, v == null ? '' : String(v));
    }
    var src = tag === 'template' ? node.content : node;
    for (var ch = src.firstChild; ch; ch = ch.nextSibling) build(ch, scope, vals, el);
    out.appendChild(el);
  }

  function dispatch(e) { var h = e.currentTarget.__h && e.currentTarget.__h[e.type]; if (h) h(e); }
  function bind(el, handlers) {
    el.__h = handlers;
    el.__bound = el.__bound || {};
    for (var t in handlers) if (!el.__bound[t]) { el.addEventListener(t, dispatch); el.__bound[t] = true; }
  }

  // Update the live DOM to match the freshly built one, keeping nodes so transitions run.
  function morph(live, next) {
    if (live.nodeType !== next.nodeType || live.nodeName !== next.nodeName) { live.parentNode.replaceChild(adopt(next), live); return; }
    if (live.nodeType === 3) { if (live.data !== next.data) live.data = next.data; return; }
    if (live.nodeType !== 1) return;
    var i, at;
    for (i = live.attributes.length - 1; i >= 0; i--) { at = live.attributes[i]; if (!next.hasAttribute(at.name)) live.removeAttribute(at.name); }
    for (i = 0; i < next.attributes.length; i++) { at = next.attributes[i]; if (live.getAttribute(at.name) !== at.value) live.setAttribute(at.name, at.value); }
    bind(live, next.__h || {});
    var lc = live.childNodes, nc = Array.prototype.slice.call(next.childNodes), n = nc.length;
    for (i = 0; i < n; i++) { if (i < lc.length) morph(lc[i], nc[i]); else live.appendChild(adopt(nc[i])); }
    while (lc.length > n) live.removeChild(live.lastChild);
  }
  function adopt(node) {
    if (node.nodeType === 1) { var h = node.__h || {}; bind(node, h); for (var c = node.firstChild; c; c = c.nextSibling) adopt(c); }
    return node;
  }

  window.DCLogic = function DCLogic() { this.state = {}; this.props = {}; };
  window.DCLogic.prototype.setState = function (patch) {
    var p = typeof patch === 'function' ? patch(this.state) : patch, changed = false;
    for (var k in p) if (this.state[k] !== p[k]) { changed = true; break; }
    if (!changed) return;  // nothing new: skip the redraw
    Object.assign(this.state, p); schedule();
  };

  var comp, tpl, root, queued = false;
  function render() {
    queued = false;
    var vals = comp.renderVals() || {};
    var frag = document.createDocumentFragment();
    for (var c = tpl.content.firstChild; c; c = c.nextSibling) build(c, {}, vals, frag);
    if (!root.firstChild) { while (frag.firstChild) root.appendChild(adopt(frag.firstChild)); return; }
    var holder = document.createElement('div'); holder.appendChild(frag);
    morph(root, (function () { var r = root.cloneNode(false); while (holder.firstChild) r.appendChild(holder.firstChild); r.__h = {}; return r; })());
  }
  function schedule() { if (!queued) { queued = true; requestAnimationFrame(render); } }

  window.UnlockMount = function (Component, props) {
    tpl = document.getElementById('dc-template');
    root = document.getElementById('dc-root');
    comp = new Component();
    comp.state = comp.state || {};
    comp.props = props || {};
    render();
    if (typeof comp.componentDidMount === 'function') comp.componentDidMount();
  };
})();
