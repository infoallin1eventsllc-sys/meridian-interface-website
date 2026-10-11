
(function () {
  if (!("IntersectionObserver" in window) || !window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
  var targets = document.querySelectorAll(".screen, section.plan, section.note");
  document.documentElement.classList.add("reveal");
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting || e.boundingClientRect.top < 0) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
  // Anything scrolled past (End key, a link) or printed shows too; nothing stays hidden above you.
  function showPassed() { document.querySelectorAll(".screen:not(.is-in), section.plan:not(.is-in), section.note:not(.is-in)").forEach(function (el) { if (el.getBoundingClientRect().top < innerHeight * 0.92) el.classList.add("is-in"); }); }
  addEventListener("scroll", function () { clearTimeout(showPassed.t); showPassed.t = setTimeout(showPassed, 120); }, { passive: true });
  addEventListener("beforeprint", function () { document.documentElement.classList.remove("reveal"); });
  targets.forEach(function (t) { io.observe(t); });
  // Anything already on screen, or jumped to by a link, shows at once.
  addEventListener("hashchange", function () { var t = document.querySelector(location.hash); if (t) t.classList.add("is-in"); });
  if (location.hash) { var t0 = document.querySelector(location.hash); if (t0) t0.classList.add("is-in"); }
})();
(function () {
  var body = document.body;
  function set(f) {
    body.setAttribute("data-finish", f);
    document.querySelectorAll(".finish button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.finish === f)); });
    try { localStorage.setItem("haven.catalog.finish", f); } catch (e) {}
  }
  var saved = null;
  try { saved = localStorage.getItem("haven.catalog.finish"); } catch (e) {}
  set(["grounded","futuristic","vivid","vivid-dark"].indexOf(saved) >= 0 ? saved : "grounded"); // the Wallpaper card's finish
  document.querySelectorAll(".finish button").forEach(function (b) { b.addEventListener("click", function () { set(b.dataset.finish); }); });
})();
