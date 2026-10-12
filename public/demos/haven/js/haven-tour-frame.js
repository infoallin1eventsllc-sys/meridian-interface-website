// Added by haven/scripts/package-website.mjs to tour.html. The tour's wall panel sits inside the
// panel's hardware bezel (the styles are beside it, #haven-panel-bezel). The bezel fills the space
// under the tour's bars with a margin; on wider screens the panel runs at the width its screens
// are designed for (1440 px, or wider when there is room) and is scaled to fit inside the bezel,
// so the whole screen shows. On a phone it runs at its own size in a slimmer bezel.
(function () {
  var main = document.querySelector("main");
  var panel = document.getElementById("view-panel");
  if (!main || !panel) return;
  var DESIGN_W = 1440, RADIUS = 12;
  var wide = window.matchMedia("(min-width: 721px)");
  var bezel = document.createElement("div");
  bezel.className = "haven-bezel";
  bezel.setAttribute("aria-hidden", "true");
  main.insertBefore(bezel, panel);

  function fit() {
    var on = panel.hasAttribute("data-on");
    bezel.toggleAttribute("data-on", on);
    if (!on) return;
    var W = main.clientWidth, H = main.clientHeight;
    if (!W || !H) return;
    var m = wide.matches ? 20 : 8;
    var bz = wide.matches ? Math.min(24, Math.max(12, W * 0.016)) : 10;
    var r = wide.matches ? RADIUS : 14;
    var innerW = W - 2 * m - 2 * bz, innerH = H - 2 * m - 2 * bz;
    bezel.style.left = m + "px"; bezel.style.top = m + "px";
    bezel.style.width = (W - 2 * m) + "px"; bezel.style.height = (H - 2 * m) + "px";
    bezel.style.setProperty("--bz", bz + "px"); bezel.style.setProperty("--r", r + "px");
    var s = wide.matches ? Math.min(1, innerW / DESIGN_W) : 1;
    panel.style.inset = "auto";
    panel.style.left = (m + bz) + "px"; panel.style.top = (m + bz) + "px";
    panel.style.width = Math.round(innerW / s) + "px"; panel.style.height = Math.round(innerH / s) + "px";
    panel.style.transform = s === 1 ? "none" : "scale(" + s + ")";
    panel.style.setProperty("--haven-r", (r / s) + "px");
  }
  new ResizeObserver(fit).observe(main);
  // The tour shows a tab by setting data-on on its view.
  new MutationObserver(fit).observe(panel, { attributes: true, attributeFilter: ["data-on"] });
  wide.addEventListener ? wide.addEventListener("change", fit) : wide.addListener(fit);
  fit();
})();
