// Send visitors who open a share link on to the homepage (see tools/make-share-links.mjs).
(function () {
  var to = document.documentElement.getAttribute('data-to') || '/';
  if (to.charAt(0) !== '/' || to.charAt(1) === '/') to = '/';
  window.location.replace(to);
})();
