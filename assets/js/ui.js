/* Shared chrome (Ann): builds the centered top header — hand-drawn signature
   above a small-caps nav row — from window.SITE. Loaded on every page after
   data.js. (Ann's layout follows owengent.com: no sidebar, no hamburger; the
   nav simply wraps on small screens.) */
(function () {
  var S = window.SITE || {};
  var name = S.name || 'Gallery';
  var page = document.body.getAttribute('data-page') || '';
  var ig = S.instagram || '#';

  var IG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">' +
    '<rect x="3" y="3" width="18" height="18" rx="5"/>' +
    '<circle cx="12" cy="12" r="4"/>' +
    '<circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"/></svg>';

  var galleryActive = (page === 'gallery' || page === 'artwork') ? ' is-active' : '';
  var aboutActive = (page === 'about') ? ' is-active' : '';

  var el = document.getElementById('sidebar');
  if (el) {
    el.innerHTML =
      '<a class="sig" href="index.html" aria-label="' + name + ' — home">' +
        '<img src="assets/img/logo/ann-signature.jpg" alt="' + name + '"></a>' +
      '<nav class="nav" id="nav">' +
        '<a class="nav__link' + galleryActive + '" href="index.html">Gallery</a>' +
        '<a class="nav__link' + aboutActive + '" href="about.html">About</a>' +
        '<a class="nav__link" href="' + ig + '" target="_blank" rel="noopener">Instagram <span class="ig">' + IG + '</span></a>' +
      '</nav>';
  }

  // set per-page document title
  document.title = name + (page === 'about' ? ' — About' : '') +
    (page === 'gallery' ? ' — ' + (S.galleryTitle || 'Gallery') : '');
})();
