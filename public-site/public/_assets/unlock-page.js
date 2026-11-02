/* Unlock investor page: shared behaviour. No trackers, no network calls. */
(function () {
  // Logo <svg><use> needs an explicit viewBox for width:auto sizing
  document.querySelectorAll('.mark svg').forEach(function (s) { s.setAttribute('viewBox', '0 0 1968 502'); });

  // Highlight the nav item for the section in view
  var links = [].slice.call(document.querySelectorAll('.sections a'));
  var map = {};
  links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
  var current = null;
  function setOn(id) {
    if (id === current) return;
    current = id;
    links.forEach(function (a) { a.classList.toggle('on', a === map[id]); });
    var a = map[id];
    if (a) {
      var ul = a.parentNode.parentNode, l = a.offsetLeft - ul.offsetLeft;
      if (l < ul.scrollLeft || l + a.offsetWidth > ul.scrollLeft + ul.clientWidth) ul.scrollTo({ left: l - 16, behavior: 'smooth' });
    }
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) setOn(e.target.id); });
    }, { rootMargin: '-35% 0px -60% 0px' });
    Object.keys(map).forEach(function (id) { var el = document.getElementById(id); if (el) io.observe(el); });
  }

  // Motion (screen only). Opt-in: skipped for reduced motion or no IntersectionObserver.
  // Nothing is hidden or zeroed until its element is about to be seen, so a page with no JS,
  // a thumbnail, or a printout always shows the finished state.
  var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!calm && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js-motion');

    // Scroll progress bar
    var prog = document.createElement('div');
    prog.id = 'prog';
    prog.setAttribute('aria-hidden', 'true');
    document.body.appendChild(prog);
    var tick = false;
    window.addEventListener('scroll', function () {
      if (tick) return;
      tick = true;
      requestAnimationFrame(function () {
        var h = document.documentElement;
        prog.style.transform = 'scaleX(' + Math.min(1, h.scrollTop / ((h.scrollHeight - h.clientHeight) || 1)) + ')';
        tick = false;
      });
    }, { passive: true });

    // Slide-up entrances, staggered within each group
    var targets = document.querySelectorAll('section.block h2, .lead, .stat, .card, .panel, .person, .stages li, .steps li, .row, .callout, .cta, .bar');
    var seen = new Map();
    [].forEach.call(targets, function (el) {
      var parent = el.parentNode, n = seen.get(parent) || 0;
      seen.set(parent, n + 1);
      el.style.setProperty('--d', Math.min(n, 6) * 70 + 'ms');
      el.classList.add('rise');
    });

    // Counting numbers: £13.6T, 7.9M, £6.5M, 8% ... ("1 in 11" has no single number, so it stays put)
    function countUp(el) {
      var m = /^(\D*)([\d,]*\.?\d+)(\D*)$/.exec(el.textContent.trim());
      if (!m) return;
      var end = parseFloat(m[2].replace(/,/g, '')), dp = (m[2].split('.')[1] || '').length, comma = m[2].indexOf(',') > -1;
      var t0 = null, dur = 1100;
      function fmt(v) { var s = v.toFixed(dp); return comma ? Number(s).toLocaleString('en-GB', { minimumFractionDigits: dp, maximumFractionDigits: dp }) : s; }
      function step(t) {
        if (t0 === null) t0 = t;
        var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
        el.textContent = m[1] + fmt(end * e) + m[3];
        if (p < 1) requestAnimationFrame(step); else el.textContent = m[1] + m[2] + m[3];
      }
      requestAnimationFrame(step);
    }

    var mo = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        mo.unobserve(el);
        el.classList.add('in');
        if (el.classList.contains('stat')) { var v = el.querySelector('.v'); if (v) countUp(v); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    [].forEach.call(document.querySelectorAll('.rise'), function (el) { mo.observe(el); });
  }

  // Download PDF is a plain link to a pre-made file (see make-pdf.sh), so it needs no script.
})();
