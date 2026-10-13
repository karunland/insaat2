/* MAKSEF — proje listeleri, detay sayfası, galeri ve referanslar.
   Veriler js/projects-data.js dosyasından gelir. */
(function () {
  'use strict';

  var D = window.MAKSEF_DATA;
  if (!D) return;

  var html = document.documentElement;
  var lang = html.lang === 'en' ? 'en' : 'tr';
  var base = html.getAttribute('data-base') || '';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var T = {
    tr: {
      home: 'Ana Sayfa', detailPage: 'proje.html',
      catPage: { taahhut: 'taahhut.html', kentsel: 'kentsel-donusum.html' },
      cat: { taahhut: 'Taahhüt', kentsel: 'Kentsel Dönüşüm' },
      status: { tamamlandi: 'Tamamlandı', devam: 'Devam Ediyor' },
      client: 'İşveren / İdare', clientKentsel: 'Hak sahipleri', year: 'Yıl', yearOngoing: 'Başlangıç',
      location: 'Konum', category: 'Kategori', state: 'Durum', scale: 'Ölçek',
      scope: 'İş kapsamı', photos: 'Fotoğraflar', beforeAfter: 'Önce / Sonra', before: 'ÖNCE', after: 'SONRA',
      baHint: 'Karşılaştırmak için çizgiyi sürükleyin.', baLabel: 'Önce ve sonra görselleri arasında geçiş',
      project: 'PROJE', kunye: 'KÜNYE', empty: 'Bu filtreye uygun proje bulunmuyor.',
      notFound: 'Aradığınız proje bulunamadı.', backTo: 'Projelere dön',
      photo: 'Fotoğraf', open: 'Büyüt', close: 'Kapat', prev: 'Önceki', next: 'Sonraki', gallery: 'Fotoğraf galerisi',
      refJobs: 'iş', refCats: 'Alan'
    },
    en: {
      home: 'Home', detailPage: 'project.html',
      catPage: { taahhut: 'contracting.html', kentsel: 'urban-renewal.html' },
      cat: { taahhut: 'Contracting', kentsel: 'Urban Renewal' },
      status: { tamamlandi: 'Completed', devam: 'Ongoing' },
      client: 'Client / Authority', clientKentsel: 'Owners', year: 'Year', yearOngoing: 'Started',
      location: 'Location', category: 'Category', state: 'Status', scale: 'Scale',
      scope: 'Scope of work', photos: 'Photos', beforeAfter: 'Before / After', before: 'BEFORE', after: 'AFTER',
      baHint: 'Drag the line to compare.', baLabel: 'Slide between before and after images',
      project: 'PROJECT', kunye: 'PROJECT DATA', empty: 'No projects match this filter.',
      notFound: 'The project you are looking for could not be found.', backTo: 'Back to projects',
      photo: 'Photo', open: 'Enlarge', close: 'Close', prev: 'Previous', next: 'Next', gallery: 'Photo gallery',
      refJobs: 'projects', refCats: 'Field'
    }
  }[lang];

  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var src = function (p) { return base + p; };
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };

  D.projects.forEach(function (p, i) { p.code = 'P-' + pad(i + 1); });
  var bySlug = function (slug) {
    for (var i = 0; i < D.projects.length; i++) if (D.projects[i].slug === slug) return D.projects[i];
    return null;
  };
  var href = function (p) { return T.detailPage + '?p=' + encodeURIComponent(p.slug); };
  var clientName = function (p, full) {
    var c = D.clients[p.client];
    return c ? c[lang][full ? 'full' : 'short'] : '';
  };

  function card(p) {
    var t = p[lang];
    return '<a class="sheet reveal" href="' + href(p) + '" data-status="' + p.status + '">' +
      '<div class="sheet-img"><img src="' + src(p.cover) + '" alt="' + esc(t.title) + '" loading="lazy" width="1200" height="800">' +
      '<span class="badge" data-status="' + p.status + '">' + T.status[p.status] + '</span></div>' +
      '<div class="sheet-body"><span class="sheet-cat">' + T.cat[p.cat] + ' · ' + esc(clientName(p)) + '</span>' +
      '<h3>' + esc(t.title) + '</h3><p>' + esc(t.highlight) + '</p></div>' +
      '<footer class="sheet-block"><span>' + p.code + '</span><span>' + esc(t.location.split(',')[0]) + '</span><span>' + p.year + '</span></footer>' +
      '</a>';
  }

  /* ---------- Kategori listesi + durum filtresi ---------- */
  var list = $('#projectList');
  if (list) {
    var items = D.projects.filter(function (p) { return p.cat === list.dataset.cat; });
    var chips = $$('.filters .chip');
    var draw = function (status) {
      var shown = items.filter(function (p) { return status === 'all' || p.status === status; });
      list.innerHTML = shown.length ? shown.map(card).join('') : '<p class="empty">' + T.empty + '</p>';
      $$('.reveal', list).forEach(function (el, i) { el.style.setProperty('--rd', (i % 3) * 0.08 + 's'); });
      if (window.MAKSEF_reveal) window.MAKSEF_reveal(list);
    };
    chips.forEach(function (chip) {
      var s = chip.dataset.status;
      var n = items.filter(function (p) { return s === 'all' || p.status === s; }).length;
      chip.insertAdjacentHTML('beforeend', ' <small>' + n + '</small>');
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.toggle('is-active', c === chip); c.setAttribute('aria-pressed', c === chip); });
        draw(s);
      });
    });
    draw('all');
  }

  /* ---------- Ana sayfa: öne çıkanlar ---------- */
  var featured = $('#featured');
  if (featured) {
    // Izgarada tek kart kalmasın diye 3'ün katı kadar gösterilir (en fazla 6)
    var f = D.projects.filter(function (p) { return p.featured; });
    var n = f.length < 3 ? f.length : Math.min(6, f.length - f.length % 3);
    featured.innerHTML = f.slice(0, n).map(card).join('');
  }

  /* ---------- Hakkımızda: referans kurumlar ---------- */
  var refs = $('#refList');
  if (refs) {
    refs.innerHTML = Object.keys(D.clients).filter(function (k) { return !D.clients[k].private; }).map(function (k, i) {
      var c = D.clients[k][lang];
      var jobs = D.projects.filter(function (p) { return p.client === k; });
      var cats = jobs.map(function (p) { return T.cat[p.cat]; }).filter(function (v, j, a) { return a.indexOf(v) === j; });
      return '<li class="ref reveal"><span class="ref-no">R-' + pad(i + 1) + '</span>' +
        '<div class="ref-name"><strong>' + esc(c.short) + '</strong><span>' + esc(c.full) + '</span></div>' +
        '<span class="ref-meta">' + (cats.join(' · ') || '—') + '</span>' +
        '<span class="ref-count"><b>' + jobs.length + '</b> ' + T.refJobs + '</span></li>';
    }).join('');
  }

  /* ---------- Proje detay ---------- */
  var detail = $('#projectDetail');
  if (detail) {
    var slug = new URLSearchParams(location.search).get('p');
    var p = slug && bySlug(slug);

    // Dil bağlantısı aynı projeyi göstersin
    $$('.lang-switch').forEach(function (a) { if (slug) a.href = a.getAttribute('href').split('?')[0] + '?p=' + encodeURIComponent(slug); });

    if (!p) {
      detail.innerHTML = '<header class="page-head"><p class="sheet-tag">404 <i></i> ' + T.project + '</p>' +
        '<h1>' + T.notFound + '</h1><p class="lead"><a class="btn btn-ghost" href="' + T.catPage.taahhut + '">' + T.backTo + ' →</a></p></header>';
    } else {
      var t = p[lang];
      document.title = t.title + ' — MAKSEF';
      var meta = $('meta[name="description"]');
      if (meta) meta.setAttribute('content', t.summary);

      var rows = [
        [p.cat === 'kentsel' ? T.clientKentsel : T.client, esc(clientName(p, true))],
        [p.status === 'devam' ? T.yearOngoing : T.year, p.year],
        [T.location, esc(t.location)],
        [T.category, '<a href="' + T.catPage[p.cat] + '">' + T.cat[p.cat] + '</a>'],
        [T.state, '<span class="badge inline" data-status="' + p.status + '">' + T.status[p.status] + '</span>'],
        [T.scale, esc(t.highlight)]
      ];

      var out =
        '<nav class="crumbs" aria-label="breadcrumb"><a href="index.html">' + T.home + '</a><span>/</span>' +
        '<a href="' + T.catPage[p.cat] + '">' + T.cat[p.cat] + '</a><span>/</span><span aria-current="page">' + esc(t.title) + '</span></nav>' +
        '<header class="page-head detail-head"><p class="sheet-tag">PAFTA 04 <i></i> ' + T.project + ' · ' + p.code + '</p>' +
        '<h1>' + esc(t.title) + '</h1></header>' +
        '<div class="detail-grid">' +
          '<div class="detail-main reveal"><p class="lead">' + esc(t.summary) + '</p>' +
            '<h2 class="h-sub">' + T.scope + '</h2><ol class="scope">' +
            t.scope.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol></div>' +
          '<aside class="kunye reveal"><p class="kunye-title">' + T.kunye + '<span>' + p.code + '</span></p><dl>' +
            rows.map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + r[1] + '</dd></div>'; }).join('') +
          '</dl></aside>' +
        '</div>';

      if (p.gallery && p.gallery.length) {
        out += '<section class="detail-sec reveal" aria-label="' + T.gallery + '"><h2 class="h-sub">' + T.photos + ' <small>' + p.gallery.length + '</small></h2><div class="gallery">' +
          p.gallery.map(function (g, i) {
            return '<button type="button" class="g-item" data-index="' + i + '" aria-label="' + T.photo + ' ' + (i + 1) + ' — ' + T.open + '">' +
              '<img src="' + src(g) + '" alt="' + esc(t.title) + ' — ' + T.photo + ' ' + (i + 1) + '" loading="lazy" width="1200" height="800"></button>';
          }).join('') + '</div></section>';
      }

      if (p.before && p.after) {
        out += '<section class="detail-sec reveal"><h2 class="h-sub">' + T.beforeAfter + '</h2>' +
          '<div class="ba" style="--pos:50%">' +
            '<img src="' + src(p.after) + '" alt="' + esc(t.title) + ' — ' + T.after + '" width="1200" height="800">' +
            '<div class="ba-before"><img src="' + src(p.before) + '" alt="' + esc(t.title) + ' — ' + T.before + '" width="1200" height="800"></div>' +
            '<span class="ba-label l">' + T.before + '</span><span class="ba-label r">' + T.after + '</span>' +
            '<span class="ba-handle" aria-hidden="true"></span>' +
            '<input type="range" min="0" max="100" value="50" aria-label="' + T.baLabel + '">' +
          '</div><p class="hint">' + T.baHint + '</p></section>';
      }

      detail.innerHTML = out;
      initGallery(p);
      initBeforeAfter();

      // Diğer projeler: önce aynı kategori
      var other = $('#otherProjects');
      if (other) {
        var rest = D.projects.filter(function (x) { return x !== p; })
          .sort(function (a, b) { return (b.cat === p.cat) - (a.cat === p.cat); }).slice(0, 3);
        other.innerHTML = rest.map(card).join('');
      }
    }
  }

  /* ---------- Galeri büyütme (lightbox) ---------- */
  function initGallery(p) {
    var items = $$('.g-item');
    if (!items.length) return;
    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.hidden = true;
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', T.gallery);
    lb.innerHTML =
      '<button type="button" class="lb-btn lb-close" aria-label="' + T.close + '">✕</button>' +
      '<button type="button" class="lb-btn lb-prev" aria-label="' + T.prev + '">←</button>' +
      '<figure><img alt=""><figcaption></figcaption></figure>' +
      '<button type="button" class="lb-btn lb-next" aria-label="' + T.next + '">→</button>';
    document.body.appendChild(lb);

    var img = $('img', lb), cap = $('figcaption', lb), idx = 0, opener = null;
    var show = function (i) {
      idx = (i + p.gallery.length) % p.gallery.length;
      img.src = src(p.gallery[idx]);
      img.alt = p[lang].title + ' — ' + T.photo + ' ' + (idx + 1);
      cap.textContent = p.code + ' · ' + pad(idx + 1) + ' / ' + pad(p.gallery.length);
    };
    var open = function (i) {
      opener = document.activeElement;
      show(i);
      lb.hidden = false;
      document.body.classList.add('no-scroll');
      $('.lb-close', lb).focus();
    };
    var close = function () {
      lb.hidden = true;
      document.body.classList.remove('no-scroll');
      if (opener) opener.focus();
    };
    items.forEach(function (b) { b.addEventListener('click', function () { open(+b.dataset.index); }); });
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
  }

  /* ---------- Önce / sonra karşılaştırma ---------- */
  function initBeforeAfter() {
    $$('.ba').forEach(function (ba) {
      var r = $('input', ba);
      r.addEventListener('input', function () { ba.style.setProperty('--pos', r.value + '%'); });
    });
  }
})();
