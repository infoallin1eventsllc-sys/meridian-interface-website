
(function () {
  var look = "futuristic", theme = null;
  var screen = location.hash.replace("#", "");
  // ?look= (the website and showroom set it on each panel they open) wins over the saved finish.
  var asked = new URLSearchParams(location.search).get("look");
  try { look = localStorage.getItem("haven.look") || look; theme = localStorage.getItem("haven.theme"); screen = screen || localStorage.getItem("haven.screen") || ""; } catch (e) {}
  if (asked === "grounded" || asked === "futuristic" || asked === "vivid") look = asked;
  // The finish dresses the Wallpaper screen; the panel keeps the choice for when it's shown.
  document.documentElement.setAttribute("data-look", screen === "wallpaper" ? look : "grounded");
  window.__havenLook = look;
  if (theme === "light" || theme === "dark") document.documentElement.setAttribute("data-theme", theme);
  if (!document.documentElement.lang) document.documentElement.lang = "en";
})();
