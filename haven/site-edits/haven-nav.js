// Added by haven/scripts/package-website.mjs to film.html, library.html and the three panel pages.
// Those pages are made to be seen inside the guided tour (tour.html), which carries the way back to
// the website. Two things kept visitors stuck:
//   1. Opened on their own (a shared link, a new tab) they had no link anywhere. Now they open
//      inside the tour at the matching view, so the tour's "Back to the website" is always there.
//   2. In the tour, the library's "Open live" links replaced the library with a panel, and pressing
//      "Screen library" again did nothing (the frame's address had moved on). Now those links switch
//      the tour to its Wall panel tab with that finish and screen, and the library stays the library.
(function () {
  var page = location.pathname.split("/").pop();
  var framed = false;
  try { framed = window.top !== window.self; } catch (e) { framed = true; }
  if (!framed) {
    var m = page.match(/^panel-(grounded|futuristic|vivid)\.html$/);
    var to = m ? "tour.html#panel/" + m[1] + "/" + (location.hash.slice(1) || "command")
      : page === "film.html" ? "tour.html#live"
      : page === "library.html" ? "tour.html#library" : null;
    if (to) location.replace(to);
    return;
  }
  if (page !== "library.html") return;
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="panel-"]');
    if (!a) return;
    var P; try { P = window.parent.document; } catch (x) { return; }
    var tab = P.querySelector('[role=tab][data-tab="panel"]');
    var m = a.getAttribute("href").match(/^panel-(grounded|futuristic|vivid)\.html[^#]*#([\w-]+)/);
    if (!tab || !m) return; // not inside the tour: follow the link as written
    e.preventDefault();
    var finish = P.querySelector('[data-finish="' + m[1] + '"]'); if (finish) finish.click();
    tab.click();
    var screen = P.querySelector('[data-screen="' + m[2] + '"]'); if (screen) screen.click();
  });
})();
