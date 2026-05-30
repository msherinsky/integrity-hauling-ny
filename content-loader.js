(function () {
  fetch('/content.json?v=' + Date.now())
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (c) {
      if (!c) return;
      var page = (c.pages && c.pages.home) || {};

      // Hero
      fill('wg-hero-line1', page.headline);
      fill('wg-hero-em',    page.headlineEm);
      fill('wg-hero-sub',   page.subheadline);
      fill('wg-hero-cta',   page.ctaText);

      // Services — update title + description by card index
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

      // Testimonials — replace grid if editor has any
      var grid = document.getElementById('wg-reviews');
      if (grid && c.testimonials && c.testimonials.length) {
        grid.innerHTML = c.testimonials.map(function (t) {
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
