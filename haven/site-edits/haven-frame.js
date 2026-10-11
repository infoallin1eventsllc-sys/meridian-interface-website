// Added by haven/scripts/package-website.mjs to the home page. The live demo's panel sits inside
// a hardware bezel (the styles are beside it, #haven-panel-bezel). On wider screens the panel runs
// at the size its screens are designed for, 1440 px wide, and is scaled to fit inside the bezel,
// so the whole screen shows, edge to edge, like the real panel. On a phone it runs at its own size.
(function () {
  var frame = document.getElementById("frame");
  if (!frame) return;
  var DESIGN_W = 1440;
  var wide = window.matchMedia("(min-width: 721px)");
  function fit() {
    var iframe = frame.querySelector("iframe");
    var cs = getComputedStyle(frame);
    var innerW = frame.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    var innerH = frame.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    if (!iframe || innerW <= 0) return;
    if (wide.matches) {
      var s = innerW / DESIGN_W;
      frame.style.setProperty("--s", String(s));
      iframe.style.width = DESIGN_W + "px";
      iframe.style.height = Math.round(innerH / s) + "px";
    } else {
      frame.style.setProperty("--s", "1");
      iframe.style.width = ""; iframe.style.height = "";
    }
  }
  new ResizeObserver(fit).observe(frame);
  // The panel's iframe is added the first time the visitor starts it.
  new MutationObserver(fit).observe(frame, { childList: true });
  wide.addEventListener ? wide.addEventListener("change", fit) : wide.addListener(fit);
  fit();
})();
