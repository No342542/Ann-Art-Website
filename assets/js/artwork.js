/* Detail page (Ann): renders one artwork from ?id=.
   Layout: a single meta line on top — TITLE · date · notes — in the small
   letterspaced style of the reference site, then the one artwork LARGE
   below it (it fills most of the screen for detailed viewing). */
(function () {
  var S = window.SITE || {};
  var ART = window.ARTWORKS || [];
  var root = document.getElementById('detail');
  if (!root) return;

  var id = new URLSearchParams(window.location.search).get('id');
  var idx = ART.findIndex(function (a) { return a.id === id; });
  if (idx === -1) {
    root.innerHTML = '<a class="detail__back" href="index.html">' + backArrow() + ' Back to gallery</a>' +
      '<p class="detail__text">Sorry, that piece could not be found.</p>';
    return;
  }
  var a = ART[idx];
  document.title = a.title + ' — ' + (S.name || 'Gallery');

  var prev = ART[(idx - 1 + ART.length) % ART.length];
  var next = ART[(idx + 1) % ART.length];

  var back = '<a class="detail__back" href="index.html">' + backArrow() + ' Back to gallery</a>';
  var sep = '<span class="detail__sep" aria-hidden="true">&middot;</span>';
  var meta = '<div class="detail__meta">' +
      '<h1 class="detail__title">' + esc(a.title) + '</h1>' +
      (a.date ? sep + '<span class="detail__date">' + esc(a.date) + '</span>' : '') +
      (a.text ? sep + '<p class="detail__text">' + esc(a.text) + '</p>' : '') +
    '</div>';
  var image = '<div class="detail__media"><img class="detail__img" src="' + attr(a.image) + '" alt="' + attr(a.title) + '" decoding="async" fetchpriority="high"' +
    (a.w > 0 && a.h > 0 ? ' style="aspect-ratio:' + a.w + ' / ' + a.h + '"' : '') + '></div>';
  var nav = '<div class="detail__nav">' +
      '<a href="artwork.html?id=' + encodeURIComponent(prev.id) + '">' + backArrow() + ' Prev</a>' +
      '<a href="artwork.html?id=' + encodeURIComponent(next.id) + '">Next ' + fwdArrow() + '</a>' +
    '</div>';

  root.innerHTML = back + meta + image + nav;

  function esc(s) {
    return String(s).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; });
  }
  function attr(s) { return esc(s).replace(/"/g, '&quot;'); }
  function backArrow() {
    return '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.7" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 6 8 12 15 18"/></svg>';
  }
  function fwdArrow() {
    return '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.7" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 6 16 12 9 18"/></svg>';
  }
})();
