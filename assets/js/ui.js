/* Shared chrome (Ann): the centered hand-drawn signature above ONE navigation
   row that holds the gallery categories, About, and the Instagram icon (the
   single-row nav of the reference site). The signature is the "home" link, so
   there is no separate Gallery item.

   The category buttons on the gallery page are rendered by gallery.js into
   #filters — that file is kept byte-identical with Josie's copy, so ui.js does
   not render them there; it simply ADOPTS the #filters node into the row.
   Moving a node keeps its children and their click handlers, so this works
   whichever of the two scripts happens to run first. On the other pages
   (#filters is absent) ui.js renders the categories itself, as links back to
   index.html?cat=… so the same row navigates from anywhere. */
(function () {
  var S = window.SITE || {};
  var name = S.name || 'Gallery';
  var page = document.body.getAttribute('data-page') || '';
  var ig = S.instagram || '#';

  var IG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">' +
    '<rect x="3" y="3" width="18" height="18" rx="5"/>' +
    '<circle cx="12" cy="12" r="4"/>' +
    '<circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"/></svg>';

  var el = document.getElementById('sidebar');
  if (!el) return;

  el.innerHTML =
    '<a class="sig" href="index.html" aria-label="' + name + ' — home">' +
      '<img src="assets/img/logo/ann-signature.jpg" alt="' + name + '"></a>';

  var row = document.createElement('div');
  row.className = 'navrow';

  var filters = document.getElementById('filters');
  if (filters) {
    row.appendChild(filters);                       // gallery page: gallery.js owns its contents
  } else {
    var cats = document.createElement('nav');
    cats.className = 'filters';
    cats.setAttribute('aria-label', 'Categories');
    (S.categories || []).forEach(function (c) {
      var a = document.createElement('a');
      a.className = 'filter';
      a.href = 'index.html?cat=' + encodeURIComponent(c);
      a.textContent = c;
      cats.appendChild(a);
    });
    row.appendChild(cats);
  }

  var nav = document.createElement('nav');
  nav.className = 'nav';
  nav.innerHTML =
    '<a class="nav__link' + (page === 'about' ? ' is-active' : '') + '" href="about.html">About</a>' +
    '<a class="nav__link nav__link--ig" href="' + ig + '" target="_blank" rel="noopener" ' +
      'aria-label="Instagram" title="Instagram"><span class="ig">' + IG + '</span></a>';
  row.appendChild(nav);

  el.appendChild(row);

  // set per-page document title
  document.title = name + (page === 'about' ? ' — About' : '') +
    (page === 'gallery' ? ' — ' + (S.galleryTitle || 'Gallery') : '');
})();
