/* MAKSEF — ortak etkileşimler (tüm sayfalar) */
(function () {
  'use strict';

  var root = document.documentElement;
  var lang = root.lang === 'en' ? 'en' : 'tr';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var I18N = {
    tr: {
      formError: '⚠ Lütfen işaretli alanları kontrol edin.',
      formSending: 'Gönderiliyor…',
      formOk: '✓ Teşekkürler! Mesajınız bize ulaştı, en kısa sürede dönüş yapacağız.',
      formMail: '✓ E-posta uygulamanız açılıyor. Teşekkürler!',
      formFail: '⚠ Gönderilemedi. Lütfen telefonla ya da e-postayla ulaşın.',
      yes: 'Evet', no: 'Hayır',
      qRun: 'Sarsıntı sürüyor…', qStop: 'Durdur', qAgain: 'Tekrar sars', qIdle: 'Beklemede', qStopped: 'Durduruldu',
      qBad: 'Sınır aşıldı · ağır hasar riski', qOk: 'Sınır içinde · güvenli',
      qOld: 'ESKİ YAPI · YUMUŞAK ZEMİN KAT', qNew: 'YENİ YAPI · TBDY 2018'
    },
    en: {
      formError: '⚠ Please check the highlighted fields.',
      formSending: 'Sending…',
      formOk: '✓ Thank you! We received your message and will get back to you shortly.',
      formMail: '✓ Opening your email app. Thank you!',
      formFail: '⚠ Could not send. Please contact us by phone or email.',
      yes: 'Yes', no: 'No',
      qRun: 'Shaking…', qStop: 'Stop', qAgain: 'Shake again', qIdle: 'Idle', qStopped: 'Stopped',
      qBad: 'Limit exceeded · severe damage risk', qOk: 'Within limits · safe',
      qOld: 'OLD BUILDING · SOFT GROUND STOREY', qNew: 'NEW BUILDING · 2018 SEISMIC CODE'
    }
  }[lang];

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

  // projects.js sonradan eklediği kartlar için de kullanır
  window.MAKSEF_reveal = function (scope) {
    $$('.reveal:not(.is-in)', scope).forEach(function (el) {
      if (io) io.observe(el);
      else { el.classList.add('is-in'); var c = $('[data-count]', el); if (c) countUp(c); }
    });
  };
  $$('.stagger').forEach(function (g) {
    $$('.reveal', g).forEach(function (el, i) { el.style.setProperty('--rd', (i % 3) * 0.08 + 's'); });
  });
  window.MAKSEF_reveal(document);

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

      var endpoint = form.dataset.endpoint;
      if (endpoint) {
        msg.textContent = I18N.formSending;
        fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
          .then(function (r) {
            if (!r.ok) throw new Error(r.status);
            form.reset();
            msg.textContent = I18N.formOk;
          })
          .catch(function () { msg.textContent = I18N.formFail; });
        return;
      }

      var lines = [];
      $$('input, select, textarea', form).forEach(function (f) {
        if (!f.name || f.type === 'hidden') return;
        var label = $('label[for="' + f.id + '"]', form);
        var name = label ? label.textContent.trim() : f.name;
        var val = f.type === 'checkbox' ? (f.checked ? I18N.yes : I18N.no) : (f.value.trim() || '-');
        lines.push(name.replace(/\s*\*$/, '') + ': ' + val);
      });
      window.location.href = 'mailto:' + form.dataset.mailto +
        '?subject=' + encodeURIComponent(form.dataset.subject || 'Web') +
        '&body=' + encodeURIComponent(lines.join('\n'));
      msg.textContent = I18N.formMail;
    });
  });

  /* ---------- Antet tarihi ---------- */
  var y = String(new Date().getFullYear());
  $$('.js-year').forEach(function (el) { el.textContent = y; });
})();
