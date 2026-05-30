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

      // ── Phone — update href and visible text on every tel: link ─────────────
      if (c.phone) {
        var digits = c.phone.replace(/\D/g, '');
        document.querySelectorAll('[data-phone-href]').forEach(function (el) {
          el.href = 'tel:' + digits;
          // Only replace text nodes that look like a phone number
          var txt = el.textContent.trim();
          if (/\d{3}/.test(txt)) el.textContent = c.phone;
        });
      }

      // ── Services — update card title + desc by index ─────────────────────
      if (c.services && c.services.length) {
        c.services.forEach(function (svc, i) {
          var body = document.querySelector('[data-svc="' + i + '"]');
          if (!body) return;
          var h3 = body.querySelector('h3');
          var p  = body.querySelector('p');
          if (h3 && svc.title) h3.textContent = svc.title;
          if (p  && svc.desc)  p.textContent  = svc.desc;
        });
      }

      // ── Service areas — replace loc-grid if editor has areas ────────────────
      var grid = document.getElementById('wg-areas');
      if (grid && c.serviceAreas && c.serviceAreas.length) {
        grid.innerHTML = c.serviceAreas.map(function (area) {
          return '<span style="display:inline-block;padding:6px 14px;background:rgba(0,148,68,0.08);border-radius:4px;font-size:14px;font-weight:600;color:#005028;">' + esc(area) + '</span>';
        }).join('');
      }

      // ── Testimonials — replace review grid if editor has any ─────────────
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
    })
    .catch(function () {});

  function fill(id, val) {
    if (!val) return;
    var el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function esc(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
}());
