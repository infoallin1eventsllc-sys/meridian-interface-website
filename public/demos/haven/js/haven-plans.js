// Added by haven/scripts/package-website.mjs to the home page. "Get a free quote" on a monitoring
// plan takes the visitor to the request form with that plan already chosen; the plan goes with
// the request (site.js adds it to the message).
(function () {
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[data-plan]");
    if (!a) return;
    var sel = document.getElementById("f-plan");
    if (sel) sel.value = a.getAttribute("data-plan");
  });
})();
