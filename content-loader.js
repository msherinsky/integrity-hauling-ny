(function () {
  fetch('/content.json?v=' + Date.now())
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (c) {
      if (!c) return;
      var page = (c.pages && c.pages.home) || {};

      // ── Hero ────────────────────────────────────────────────────────────────
      fill('wg-hero-line1', page.headline);
      fill('wg-hero-em',    page.headlineEm);
      fill('wg-hero-sub',   page.subheadline);
      fill('wg-hero-cta',   page.ctaText);

      // ── Named photo slots ─────────────────────────────────────────────────────
      var photoMap = {
        heroPhoto:        'wg-hero-img',
        ownerPhoto1:      'wg-ownerPhoto1',
        ownerPhoto2:      'wg-ownerPhoto2',
        ba_shed_before:   'wg-ba-shed-before',
        ba_shed_after:    'wg-ba-shed-after',
        ba_basement_before: 'wg-ba-basement-before',
        ba_basement_after:  'wg-ba-basement-after',
        ba_yard_before:   'wg-ba-yard-before',
        ba_yard_after:    'wg-ba-yard-after',
        ba_loft_before:   'wg-ba-loft-before',
        ba_loft_after:    'wg-ba-loft-after',
      };
      Object.keys(photoMap).forEach(function (key) {
        if (c[key]) {
          var el = document.getElementById(photoMap[key]);
          if (el) el.src = c[key];
        }
      });

      // ── Phone ────────────────────────────────────────────────────────────────
      if (c.phone) {
        var digits = c.phone.replace(/\D/g, '');
        document.querySelectorAll('[data-phone-href]').forEach(function (el) {
          el.href = 'tel:' + digits;
          var txt = el.textContent.trim();
          if (/\d{3}/.test(txt)) el.textContent = c.phone;
        });
      }

      // ── Services ─────────────────────────────────────────────────────────────
      if (c.services && c.services.length) {
        c.services.forEach(function (svc, i) {
          var body = document.querySelector('[data-svc="' + i + '"]');
          if (!body) return;
          var h3 = body.querySelector('h3');
          var p  = body.querySelector('p');
          if (h3 && svc.title) h3.textContent = svc.title;
          if (p  && svc.desc)  p.textContent  = svc.desc;
          if (svc.photo) {
            var card = body.closest('.svc-card');
            if (card) card.style.backgroundImage = 'url(' + esc(svc.photo) + ')';
          }
        });
      }

      // ── Service areas ─────────────────────────────────────────────────────────
      var areasEl = document.getElementById('wg-areas');
      if (areasEl && c.serviceAreas && c.serviceAreas.length) {
        areasEl.innerHTML = c.serviceAreas.map(function (area) {
          return '<span style="display:inline-block;padding:6px 14px;background:rgba(0,148,68,0.08);border-radius:4px;font-size:14px;font-weight:600;color:#005028;">' + esc(area) + '</span>';
        }).join('');
      }

      // ── Testimonials ──────────────────────────────────────────────────────────
      var reviews = document.getElementById('wg-reviews');
      if (reviews && c.testimonials && c.testimonials.length) {
        reviews.innerHTML = c.testimonials.map(function (t) {
          var stars = '★'.repeat(t.rating || 5);
          return '<div class="rw-grid-card">' +
            '<span class="rw-card-stars">' + stars + '</span>' +
            '<p class="rw-card-text">&ldquo;' + esc(t.quote) + '&rdquo;</p>' +
            '<div class="rw-card-author"><strong>' + esc(t.name) + '</strong></div>' +
          '</div>';
        }).join('');
      }

      // ── Gallery ───────────────────────────────────────────────────────────────
      var galSection = document.getElementById('wg-gallery-section');
      var galGrid    = document.getElementById('wg-gallery');
      if (galGrid && c.gallery && c.gallery.length) {
        galSection.style.display = 'block';
        galGrid.innerHTML = c.gallery.map(function (url) {
          return '<div style="aspect-ratio:1;overflow:hidden;border-radius:6px;background:#e5e7eb;">' +
            '<img src="' + esc(url) + '" alt="Job photo" loading="lazy" style="width:100%;height:100%;object-fit:cover;">' +
          '</div>';
        }).join('');
      }
    })
    .catch(function () {});

  function fill(id, val) {
    if (!val) return;
    var el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function esc(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
}());
