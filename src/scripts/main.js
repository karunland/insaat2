/* MAKSEF — ortak etkileşimler (tüm sayfalar) */
(function () {
  'use strict';

  var root = document.documentElement;
  var lang = root.lang === 'en' ? 'en' : 'tr';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  // Metinler src/i18n/ui.ts dosyasından gelir (Base.astro → #i18n-client)
  var I18N = JSON.parse(document.getElementById('i18n-client').textContent);

  /* ---------- Tema: kâğıt / ozalit ---------- */
  function isDark() {
    var t = root.getAttribute('data-theme');
    if (t) return t === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function syncThemeColor() {
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', isDark() ? '#0D3466' : '#F3F0E8');
  }
  $('#themeToggle').addEventListener('click', function () {
    var next = isDark() ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('maksef-theme', next); } catch (e) {}
    syncThemeColor();
  });
  syncThemeColor();

  /* ---------- Mobil menü ---------- */
  var menuBtn = $('#menuBtn'), nav = $('#nav');
  menuBtn.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      nav.classList.remove('is-open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.focus();
    }
  });

  /* ---------- Belirme + sayaçlar ---------- */
  var fmt = function (v, dec) {
    return v.toLocaleString(lang === 'en' ? 'en-GB' : 'tr-TR', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  };
  function countUp(el) {
    var target = parseFloat(el.dataset.count);
    var dec = parseInt(el.dataset.decimals || '0', 10);
    var suffix = el.dataset.suffix || '';
    if (reduceMotion || target === 0) { el.textContent = fmt(target, dec) + suffix; return; }
    var start = null, dur = 1600;
    (function step(ts) {
      if (ts === undefined) return requestAnimationFrame(step);
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = fmt(target * (1 - Math.pow(1 - p, 3)), dec) + suffix;
      if (p < 1) requestAnimationFrame(step);
    })();
  }

  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add('is-in');
      var c = $('[data-count]', en.target);
      if (c) countUp(c);
      io.unobserve(en.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }) : null;

  function reveal(scope) {
    $$('.reveal:not(.is-in)', scope).forEach(function (el) {
      if (io) io.observe(el);
      else { el.classList.add('is-in'); var c = $('[data-count]', el); if (c) countUp(c); }
    });
  }
  $$('.stagger').forEach(function (g) {
    $$('.reveal', g).forEach(function (el, i) { el.style.setProperty('--rd', Math.min(i, 6) * 0.08 + 's'); });
  });
  reveal(document);

  /* ---------- CAD imleç, kot göstergesi, yük yolu ---------- */
  var chX = $('.ch-x'), chY = $('.ch-y');
  var hudX = $('#hudX'), hudY = $('#hudY'), hudKot = $('#hudKot');
  var pad = function (n) { var s = n.toFixed(1); while (s.length < 6) s = '0' + s; return s; };

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    window.addEventListener('mousemove', function (e) {
      document.body.classList.add('cad-on');
      chX.style.transform = 'translateY(' + e.clientY + 'px)';
      chY.style.transform = 'translateX(' + e.clientX + 'px)';
      hudX.textContent = pad(e.clientX / 10);
      hudY.textContent = pad((e.clientY + window.scrollY) / 10);
    }, { passive: true });
    document.addEventListener('mouseleave', function () { document.body.classList.remove('cad-on'); });
  }

  var loadpath = $('.loadpath');
  var steps = loadpath ? $$('.lp-step', loadpath) : [];
  var ticking = false;
  function onScroll() {
    ticking = false;
    var y = window.scrollY, max = document.documentElement.scrollHeight - window.innerHeight;
    var kot = max > 0 ? (y / max) * 24.5 : 0;
    hudKot.textContent = kot < 0.005 ? '±0.00' : '−' + kot.toFixed(2);
    document.body.classList.toggle('is-scrolled', y > 8);

    if (loadpath) {
      var r = loadpath.getBoundingClientRect(), mid = window.innerHeight * 0.6;
      loadpath.style.setProperty('--progress', Math.max(0, Math.min(1, (mid - r.top) / r.height)).toFixed(3));
      steps.forEach(function (s) { s.classList.toggle('is-loaded', s.getBoundingClientRect().top + 10 < mid); });
    }
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- Deprem karşılaştırması: eski yapı / yeni yapı (temsili) ---------- */
  var qSvg = $('#quakeSvg');
  if (qSvg) (function () {
    var SVGNS = 'http://www.w3.org/2000/svg';
    var gGround = $('#qGround'), gStub = $('#qStubs'), gCols = $('#qCols'), gSlabs = $('#qSlabs'), gWalls = $('#qWalls');
    var modeLabel = $('#qModeLabel');
    var outDrift = $('#qDrift'), outTop = $('#qTop'), status = $('#qStatus'), statusText = $('#qStatusText');
    var startBtn = $('#qStart');

    var FLOORS = 6, STORY = 48, BASE_Y = 335, SLAB_X = 155, SLAB_W = 290, SLAB_H = 7;
    var COLS = [170, 256.7, 343.3, 430];
    var DRIFT_LIMIT = 1.0;   // % — gösterim eşiği
    var DRIFT_SCALE = 5.5;   // piksel ötelemeyi temsili yüzdeye çevirir
    var mode = 'old', level = 2;
    var running = false, raf = 0, t0 = 0, peakDrift = 0, peakTop = 0;

    function el(name, attrs, parent) {
      var n = document.createElementNS(SVGNS, name);
      for (var k in attrs) n.setAttribute(k, attrs[k]);
      parent.appendChild(n);
      return n;
    }

    var slabs = [], cols = [], stubs = [], walls = [];
    function build() {
      [gSlabs, gCols, gStub, gWalls].forEach(function (g) { g.innerHTML = ''; });
      slabs = []; cols = []; stubs = []; walls = [];
      for (var k = 0; k <= FLOORS; k++) {
        slabs.push(el('rect', { y: BASE_Y - k * STORY - SLAB_H, width: SLAB_W, height: SLAB_H, class: 'q-slab' }, gSlabs));
      }
      for (var s = 1; s <= FLOORS; s++) {
        cols.push(el('path', { class: mode === 'old' ? 'q-col thin' : 'q-col' }, gCols));
        // Yeni yapıda her katta perde duvar
        if (mode === 'new') walls.push(el('path', { class: 'q-wall' }, gWalls));
      }
      COLS.forEach(function () { stubs.push(el('line', { class: 'q-stub' }, gStub)); });
      modeLabel.textContent = mode === 'old' ? I18N.qOld : I18N.qNew;
      render(new Array(FLOORS + 1).fill(0), 0);
    }

    function render(x, g) {
      gGround.setAttribute('transform', 'translate(' + g.toFixed(2) + ' 0)');
      for (var k = 0; k <= FLOORS; k++) slabs[k].setAttribute('x', (SLAB_X + x[k]).toFixed(2));
      var maxD = 0;
      for (var s = 1; s <= FLOORS; s++) {
        var yb = BASE_Y - (s - 1) * STORY - SLAB_H, yt = BASE_Y - s * STORY;
        var d = '';
        COLS.forEach(function (cx) { d += 'M' + (cx + x[s - 1]).toFixed(2) + ' ' + yb + 'L' + (cx + x[s]).toFixed(2) + ' ' + yt; });
        cols[s - 1].setAttribute('d', d);
        if (walls[s - 1]) {
          var a = 286.7, b = 313.3; // orta açıklıkta perde
          walls[s - 1].setAttribute('d', 'M' + (a + x[s - 1]) + ' ' + yb + 'L' + (b + x[s - 1]) + ' ' + yb + 'L' + (b + x[s]) + ' ' + yt + 'L' + (a + x[s]) + ' ' + yt + 'Z');
        }
        var drift = Math.abs(x[s] - x[s - 1]) / STORY * DRIFT_SCALE;
        cols[s - 1].classList.toggle('is-hot', drift > DRIFT_LIMIT);
        if (drift > maxD) maxD = drift;
      }
      COLS.forEach(function (cx, i) {
        stubs[i].setAttribute('x1', cx + g); stubs[i].setAttribute('y1', 350);
        stubs[i].setAttribute('x2', cx + x[0]); stubs[i].setAttribute('y2', 335);
      });
      return maxD;
    }

    function frame(ts) {
      if (!t0) t0 = ts;
      var t = (ts - t0) / 1000, T = 6;
      if (t > T) { stop(true); return; }
      var A = [0, 6, 12, 20][level];
      var w = 2 * Math.PI * 1.6;
      var env = Math.sin(Math.PI * t / T);
      var g = A * env * Math.sin(w * t) + A * 0.25 * env * Math.sin(w * 2.3 * t);
      var x = [g];
      for (var k = 1; k <= FLOORS; k++) {
        if (mode === 'old') {
          // Yumuşak kat: ötelemenin çoğu zemin katta toplanır
          var soft = A * env * 1.2 * Math.sin(w * t - 0.5);
          x[k] = g + soft + A * env * 0.45 * ((k - 1) / FLOORS) * Math.sin(w * t - 0.7);
        } else {
          x[k] = g + A * env * 0.5 * (k / FLOORS) * Math.sin(w * t - 0.4);
        }
      }
      var drift = render(x, g);
      var top = Math.abs(x[FLOORS] - g) * 1.5;
      if (drift > peakDrift) peakDrift = drift;
      if (top > peakTop) peakTop = top;
      outDrift.textContent = peakDrift.toFixed(2);
      outTop.textContent = peakTop.toFixed(1);
      raf = requestAnimationFrame(frame);
    }

    function setStatus(state, text) { status.dataset.state = state; statusText.textContent = text; }
    function start() {
      cancelAnimationFrame(raf);
      running = true; t0 = 0; peakDrift = 0; peakTop = 0;
      startBtn.textContent = I18N.qStop;
      setStatus('run', I18N.qRun);
      raf = requestAnimationFrame(frame);
    }
    function stop(finished) {
      cancelAnimationFrame(raf);
      running = false;
      startBtn.textContent = I18N.qAgain;
      render(new Array(FLOORS + 1).fill(0), 0);
      if (finished) setStatus(peakDrift > DRIFT_LIMIT ? 'bad' : 'ok', peakDrift > DRIFT_LIMIT ? I18N.qBad : I18N.qOk);
      else setStatus('idle', I18N.qStopped);
    }

    startBtn.addEventListener('click', function () { running ? stop(false) : start(); });
    $$('input[name="qmode"]').forEach(function (r) {
      r.addEventListener('change', function () {
        var was = running;
        mode = r.value;
        stop(false); build(); setStatus('idle', I18N.qIdle);
        if (was) start();
      });
    });
    $$('input[name="qlevel"]').forEach(function (r) {
      r.addEventListener('change', function () { level = parseInt(r.value, 10); });
    });
    build();
  })();


  /* ---------- Proje listesi: durum filtresi ---------- */
  $$('.filters[data-for]').forEach(function (group) {
    var list = document.getElementById(group.dataset.for);
    if (!list) return;
    var chips = $$('.chip', group);
    var cards = $$('.sheet', list);
    var empty = $('.empty', list);
    var canAnimate = !reduceMotion && cards.length > 0 && typeof cards[0].animate === 'function';
    var changeId = 0;

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        if (chip.classList.contains('is-active')) return;

        var id = ++changeId;
        var s = chip.dataset.status;
        var previous = new Map();
        cards.forEach(function (card) {
          if (typeof card.getAnimations === 'function') {
            card.getAnimations().forEach(function (animation) { animation.cancel(); });
          }
          if (!card.hidden) previous.set(card, card.getBoundingClientRect());
        });
        chips.forEach(function (c) { c.classList.toggle('is-active', c === chip); c.setAttribute('aria-pressed', String(c === chip)); });

        var leaving = cards.filter(function (card) {
          return !card.hidden && s !== 'all' && card.dataset.status !== s;
        });
        var exits = !canAnimate ? [] : leaving.map(function (card) {
          return card.animate([
            { opacity: 1, transform: 'translateY(0) scale(1)' },
            { opacity: 0, transform: 'translateY(10px) scale(.98)' },
          ], { duration: 210, easing: 'ease-in', fill: 'forwards' });
        });

        Promise.all(exits.map(function (animation) { return animation.finished.catch(function () {}); })).then(function () {
          if (id !== changeId) return;

          cards.forEach(function (card) {
            card.hidden = s !== 'all' && card.dataset.status !== s;
            if (!card.hidden) card.classList.add('is-in');
          });
          var shown = cards.filter(function (card) { return !card.hidden; });
          if (empty) empty.hidden = shown.length > 0;
          list.offsetHeight;

          if (!canAnimate) return;
          shown.forEach(function (card, index) {
            var from = previous.get(card);
            var to = card.getBoundingClientRect();
            var animation = from
              ? card.animate([
                { transform: 'translate(' + (from.left - to.left) + 'px, ' + (from.top - to.top) + 'px)' },
                { transform: 'translate(0, 0)' },
              ], { duration: 520, easing: 'cubic-bezier(.2, .7, .1, 1)' })
              : card.animate([
                { opacity: 0, transform: 'translateY(14px) scale(.98)' },
                { opacity: 1, transform: 'translateY(0) scale(1)' },
              ], { duration: 430, delay: Math.min(index, 5) * 55, easing: 'cubic-bezier(.2, .7, .1, 1)' });
            animation.finished.catch(function () {});
          });
        });
      });
    });
  });

  /* ---------- Galeri büyütme (lightbox) ---------- */
  $$('[data-gallery]').forEach(function (gal) {
    var items = $$('.g-item', gal);
    if (!items.length) return;
    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.hidden = true;
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.innerHTML =
      '<button type="button" class="lb-btn lb-close">✕</button>' +
      '<button type="button" class="lb-btn lb-prev">←</button>' +
      '<figure><img alt=""><figcaption></figcaption></figure>' +
      '<button type="button" class="lb-btn lb-next">→</button>';
    $('.lb-close', lb).setAttribute('aria-label', I18N.lbClose);
    $('.lb-prev', lb).setAttribute('aria-label', I18N.lbPrev);
    $('.lb-next', lb).setAttribute('aria-label', I18N.lbNext);
    document.body.appendChild(lb);

    var img = $('img', lb), cap = $('figcaption', lb), idx = 0, opener = null;
    var two = function (n) { return (n < 10 ? '0' : '') + n; };
    function show(i) {
      idx = (i + items.length) % items.length;
      img.src = items[idx].dataset.full;
      img.alt = items[idx].dataset.alt;
      cap.textContent = gal.dataset.code + ' · ' + two(idx + 1) + ' / ' + two(items.length);
    }
    function open(i) {
      opener = document.activeElement;
      show(i);
      lb.hidden = false;
      document.body.classList.add('no-scroll');
      $('.lb-close', lb).focus();
    }
    function close() {
      lb.hidden = true;
      document.body.classList.remove('no-scroll');
      if (opener) opener.focus();
    }
    items.forEach(function (b, i) { b.addEventListener('click', function () { open(i); }); });
    $('.lb-close', lb).addEventListener('click', close);
    $('.lb-prev', lb).addEventListener('click', function () { show(idx - 1); });
    $('.lb-next', lb).addEventListener('click', function () { show(idx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(idx - 1);
      else if (e.key === 'ArrowRight') show(idx + 1);
      else if (e.key === 'Tab') { // odak pencerede kalsın
        var f = $$('.lb-btn', lb), first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  });

  /* ---------- Önce / sonra karşılaştırma ---------- */
  $$('.ba').forEach(function (ba) {
    var r = $('input', ba);
    r.addEventListener('input', function () { ba.style.setProperty('--pos', r.value + '%'); });
  });

  /* ---------- İletişim: proje sayfasından gelindiyse formu hazırla ---------- */
  var pmEl = document.getElementById('project-map');
  var slug = new URLSearchParams(location.search).get('proje');
  if (pmEl && slug) {
    var pm = JSON.parse(pmEl.textContent);
    var proj = pm.map[slug];
    if (proj) {
      var note = $('#projectNote'), hidden = $('#cProject'), topic = $('#cTopic'), msgBox = $('#cMsg');
      var prefill = pm.msg.replace('{title}', proj.title);
      hidden.value = proj.title + ' (' + slug + ')';
      $('b', note).textContent = proj.title;
      note.hidden = false;
      if (topic) topic.value = pm.topicByCat[proj.cat];
      if (msgBox && !msgBox.value) msgBox.value = prefill + '\n\n';
      $('button', note).addEventListener('click', function () {
        hidden.value = '';
        note.hidden = true;
        if (msgBox && msgBox.value.indexOf(prefill) === 0) msgBox.value = msgBox.value.slice(prefill.length).replace(/^\s+/, '');
      });
    }
  }

  /* ---------- Formlar ----------
     data-endpoint doluysa (ör. Formspree adresi) oraya gönderilir;
     boşsa ziyaretçinin e-posta uygulaması data-mailto adresine açılır. */
  $$('form[data-form]').forEach(function (form) {
    var msg = $('.form-msg', form);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      $$('[required]', form).forEach(function (f) {
        var bad = f.type === 'checkbox' ? !f.checked
          : !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value));
        var wrap = f.closest('.field, .check');
        if (wrap) wrap.classList.toggle('has-error', bad);
        if (bad) ok = false;
      });
      if (!ok) {
        msg.textContent = I18N.formError;
        var first = $('.has-error input, .has-error textarea, .has-error select', form);
        if (first) first.focus();
        return;
      }

      // Spam tuzağı doluysa bot kabul et, sessizce "gönderildi" de
      var trap = form.querySelector('[name="_gotcha"]');
      if (trap && trap.value) { form.reset(); msg.textContent = I18N.formOk; return; }

      var endpoint = form.dataset.endpoint;
      if (endpoint) {
        msg.textContent = I18N.formSending;
        fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
          .then(function (r) {
            if (!r.ok) throw new Error(r.status);
            form.reset();
            var pn = $('#projectNote', form);
            if (pn) pn.hidden = true;
            msg.textContent = I18N.formOk;
          })
          .catch(function () { msg.textContent = I18N.formFail; });
        return;
      }

      // Form servisi tanımlı değilse: geçici olarak e-posta uygulamasını aç
      console.warn('[maksef] Form servisi adresi tanımlı değil (src/config/site.mjs → forms).');
      var lines = [];
      var proj = form.querySelector('[name="proje"]');
      if (proj && proj.value) lines.push('Proje: ' + proj.value);
      $$('input, select, textarea', form).forEach(function (f) {
        if (!f.name || f.type === 'hidden' || f.name === '_gotcha') return;
        var label = $('label[for="' + f.id + '"]', form);
        var name = label ? label.textContent.trim() : f.name;
        var val = f.type === 'checkbox' ? (f.checked ? I18N.yes : I18N.no) : (f.value.trim() || '-');
        lines.push(name.replace(/\s*\*$/, '') + ': ' + val);
      });
      window.location.href = 'mailto:' + form.dataset.mailto +
        '?subject=' + encodeURIComponent(form.querySelector('[name="_subject"]').value) +
        '&body=' + encodeURIComponent(lines.join('\n'));
      msg.textContent = I18N.formMail;
    });
  });
  /* ---------- Projeler sayfası: kategori + durum filtresi, aşağı kaydırdıkça yükleme ---------- */
  (function () {
    var wrap = $('[data-projects]');
    if (!wrap) return;
    var list = $('[data-projects-list]', wrap);
    var cards = $$('.sheet', list);
    var empty = $('.empty', list);
    var counter = $('[data-projects-count]', wrap);
    var moreBtn = $('[data-projects-more]', wrap);
    var sentinel = $('[data-projects-sentinel]', wrap);
    var pageSize = parseInt(wrap.dataset.pageSize, 10) || 9;
    var tpl = wrap.dataset.countTpl || '{shown} / {total}';
    var state = { cat: 'all', status: 'all', limit: pageSize };

    // Adres çubuğundaki ?kategori=…&durum=… ile başlangıç filtresi
    var params = new URLSearchParams(window.location.search);
    var keys = { cat: 'kategori', status: 'durum' };
    var groups = $$('.filters[data-filter]', wrap);
    groups.forEach(function (g) {
      var key = g.dataset.filter;
      var v = params.get(keys[key]);
      if (v && $('.chip[data-value="' + v + '"]', g)) state[key] = v;
    });

    function matches(card) {
      return (state.cat === 'all' || card.dataset.cat === state.cat) &&
             (state.status === 'all' || card.dataset.status === state.status);
    }

    function render(animateFrom) {
      var matched = cards.filter(matches);
      var shownCount = Math.min(state.limit, matched.length);
      cards.forEach(function (card) {
        var idx = matched.indexOf(card);
        var visible = idx > -1 && idx < state.limit;
        var wasHidden = card.hidden;
        card.hidden = !visible;
        if (visible) {
          card.classList.add('is-in');
          if (wasHidden && !reduceMotion && typeof card.animate === 'function' && idx >= (animateFrom || 0)) {
            card.animate([
              { opacity: 0, transform: 'translateY(14px) scale(.98)' },
              { opacity: 1, transform: 'translateY(0) scale(1)' },
            ], { duration: 430, delay: Math.min(idx - (animateFrom || 0), 5) * 55, easing: 'cubic-bezier(.2, .7, .1, 1)' }).finished.catch(function () {});
          }
        }
      });
      if (empty) empty.hidden = matched.length > 0;
      if (counter) counter.textContent = matched.length ? tpl.replace('{shown}', shownCount).replace('{total}', matched.length) : '';
      var hasMore = matched.length > state.limit;
      moreBtn.hidden = !hasMore;
      sentinel.hidden = !hasMore;
      groups.forEach(function (g) {
        $$('.chip', g).forEach(function (c) {
          var on = c.dataset.value === state[g.dataset.filter];
          c.classList.toggle('is-active', on);
          c.setAttribute('aria-pressed', String(on));
        });
      });
    }

    function syncUrl() {
      var q = new URLSearchParams();
      if (state.cat !== 'all') q.set(keys.cat, state.cat);
      if (state.status !== 'all') q.set(keys.status, state.status);
      var qs = q.toString();
      history.replaceState(null, '', window.location.pathname + (qs ? '?' + qs : '') + window.location.hash);
    }

    function loadMore() {
      var from = state.limit;
      state.limit += pageSize;
      render(from);
    }

    groups.forEach(function (g) {
      $$('.chip', g).forEach(function (chip) {
        chip.addEventListener('click', function () {
          var key = g.dataset.filter;
          if (state[key] === chip.dataset.value) return;
          state[key] = chip.dataset.value;
          state.limit = pageSize;
          render(0);
          syncUrl();
        });
      });
    });

    moreBtn.addEventListener('click', loadMore);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting && !sentinel.hidden) loadMore(); });
      }, { rootMargin: '0px 0px 300px 0px' }).observe(sentinel);
    }

    render(cards.length);
  })();
})();
