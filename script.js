/* nelera.net — page behaviour.
   The project rows are static HTML in index.html (so crawlers and no-JS visitors
   see every project); this file only adds behaviour on top of them. */
(function () {
  'use strict';

  /* ---------------- email: assembled here, never in the HTML ---------------- */
  var u = 'hello+contact', d = 'nelera.net', email = u + '@' + d;
  document.querySelectorAll('[data-email-text]').forEach(function (el) { el.textContent = email; });
  document.querySelectorAll('[data-contact="email"]').forEach(function (el) {
    var label = el.querySelector('[data-label]');
    var original = label ? label.textContent : '', timer;
    el.href = 'mailto:' + email;
    el.addEventListener('click', function (e) {
      if (e.shiftKey || e.metaKey || e.ctrlKey) return; // modifier keys: let mailto open normally
      // No clipboard API (older browsers, non-HTTPS): let the mailto link do its job.
      if (!navigator.clipboard || !navigator.clipboard.writeText) return;
      e.preventDefault();
      navigator.clipboard.writeText(email).then(function () {
        if (label) label.textContent = 'Copied';
        el.classList.add('copied');
        clearTimeout(timer);
        timer = setTimeout(function () { if (label) label.textContent = original; el.classList.remove('copied'); }, 2000);
      }, function () { window.location.href = el.href; }); // copy refused: open the mail client
    });
  });

  var list = document.getElementById('svc-list');
  if (!list) return; // donate.html and 404.html have no services table
  var rows = [].slice.call(list.querySelectorAll('.svc'));

  /* ---------------- rows: expand / collapse ---------------- */
  function rowBtn(row) { return row.querySelector('.svc-row'); }
  function isOpen(row) { return rowBtn(row).getAttribute('aria-expanded') === 'true'; }
  function setRow(row, open) {
    var btn = rowBtn(row);
    btn.setAttribute('aria-expanded', String(open));
    document.getElementById(btn.getAttribute('aria-controls')).hidden = !open;
  }
  list.addEventListener('click', function (e) {
    var btn = e.target.closest('.svc-row');
    if (!btn) return;
    setRow(btn.closest('.svc'), btn.getAttribute('aria-expanded') !== 'true');
    syncBulk();
  });
  // On desktop, open the first (oldest) project so the table shows what a row holds.
  if (rows.length && window.matchMedia('(min-width: 881px)').matches) setRow(rows[0], true);

  /* ---------------- bulk actions: open all rows, open all sites in tabs ---------------- */
  var expandBtn = document.querySelector('[data-expand-all]');
  var tabsBtn = document.querySelector('[data-open-tabs]');
  var countEl = document.querySelector('[data-count]');
  var noteEl = document.querySelector('[data-bulk-note]');
  function visibleRows() { return rows.filter(function (r) { return !r.hidden; }); }
  // Each visible project's main link. The portfolio row is skipped: you're already on it.
  function tabUrls() {
    return visibleRows().map(function (row) {
      var a = row.dataset.id !== 'portfolio' && row.querySelector('.d-links a');
      return a ? a.href : null;
    }).filter(Boolean);
  }
  function syncBulk() {
    var vis = visibleRows();
    var allOpen = vis.length > 0 && vis.every(isOpen);
    expandBtn.setAttribute('aria-pressed', String(allOpen));
    expandBtn.querySelector('[data-label]').textContent = allOpen ? 'Close all' : 'Open all';
    countEl.innerHTML = vis.length === rows.length
      ? '<b>' + rows.length + '</b> services'
      : '<b>' + vis.length + '</b> of ' + rows.length + ' services';
    var n = tabUrls().length;
    tabsBtn.querySelector('[data-label]').textContent = n === 1 ? 'Open site in a tab' : 'Open all ' + n + ' in tabs';
    tabsBtn.disabled = n === 0;
  }
  expandBtn.addEventListener('click', function () {
    var open = expandBtn.getAttribute('aria-pressed') !== 'true';
    visibleRows().forEach(function (row) { setRow(row, open); });
    syncBulk();
  });
  tabsBtn.addEventListener('click', function () {
    var urls = tabUrls(), blocked = 0;
    urls.forEach(function (url) {
      var w = window.open(url, '_blank');
      if (w) { try { w.opener = null; } catch (err) { /* cross-origin: nothing to clear */ } } else { blocked++; }
    });
    // Browsers allow one new tab per click unless pop-ups are allowed for this site.
    noteEl.textContent = blocked
      ? 'Your browser blocked ' + blocked + ' of ' + urls.length + ' tabs. Allow pop-ups for this site (icon in the address bar), then click again.'
      : '';
  });

  /* ---------------- filters ---------------- */
  var segBtns = document.querySelectorAll('.seg button');
  segBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      var f = b.dataset.filter;
      segBtns.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      rows.forEach(function (row) {
        row.hidden = f !== 'all' && row.dataset.tags.split(' ').indexOf(f) === -1;
      });
      noteEl.textContent = '';
      syncBulk();
    });
  });
  syncBulk();

  /* ---------------- live reachability, from the visitor's browser ---------------- */
  // Every row with a data-domain gets one no-cors request. NELA (on-chain) has none.
  var targets = rows.filter(function (r) { return r.dataset.domain; })
    .map(function (r) { return { id: r.dataset.id, domain: r.dataset.domain }; });
  var total = targets.length;

  function setState(id, state, ms) {
    document.querySelectorAll('[data-st="' + id + '"]').forEach(function (el) {
      el.dataset.state = state;
      el.querySelector('.dot').className = 'dot ' + state;
      el.querySelector('.t').innerHTML =
        state === 'ok' ? '<span class="long">Reachable · </span>' + ms + ' ms' :
        state === 'fail' ? 'No response' : 'Checking…';
    });
    document.querySelectorAll('[data-dot="' + id + '"]').forEach(function (el) {
      if (el.tagName.toLowerCase() === 'circle') el.setAttribute('class', 'sdot ' + state);
      else el.className = 'dot ' + state;
    });
  }

  function probe(s) {
    setState(s.id, 'checking');
    var ctrl = 'AbortController' in window ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 8000);
    var t0 = performance.now();
    return fetch('https://' + s.domain + '/', { mode: 'no-cors', cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer', signal: ctrl ? ctrl.signal : undefined })
      .then(function () { setState(s.id, 'ok', Math.round(performance.now() - t0)); return true; })
      .catch(function () { setState(s.id, 'fail'); return false; })
      .finally(function () { clearTimeout(timer); });
  }

  function runChecks() {
    document.querySelectorAll('[data-live-dot]').forEach(function (el) { el.className = 'dot checking'; });
    document.querySelectorAll('[data-live-count]').forEach(function (el) { el.textContent = '–/' + total; });
    var at = document.querySelector('[data-checked-at]');
    at.textContent = 'Checking from your browser…';
    Promise.all(targets.map(probe)).then(function (res) {
      var ok = res.filter(Boolean).length;
      document.querySelectorAll('[data-live-count]').forEach(function (el) { el.textContent = ok + '/' + total; });
      document.querySelectorAll('[data-live-dot]').forEach(function (el) { el.className = 'dot ' + (ok === total ? 'ok' : 'fail'); });
      var t = new Date();
      var pad = function (n) { return String(n).padStart(2, '0'); };
      at.innerHTML = '<b>' + ok + ' of ' + total + '</b> reachable · checked from your browser at ' + pad(t.getHours()) + ':' + pad(t.getMinutes()) + ':' + pad(t.getSeconds());
    });
  }
  document.querySelector('[data-recheck]').addEventListener('click', runChecks);
  runChecks();

  /* ---------------- tab scrollspy ---------------- */
  var tabs = [].slice.call(document.querySelectorAll('.tabs a'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        tabs.forEach(function (a) { a.setAttribute('aria-current', String(a.hash === '#' + en.target.id)); });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    tabs.forEach(function (a) { var s = document.querySelector(a.hash); if (s) io.observe(s); });
  }
})();
