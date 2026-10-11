(function () {
  var look = "vivid", theme = null;
  var screen = location.hash.replace("#", "");
  var asked = new URLSearchParams(location.search).get("look");
  try { look = localStorage.getItem("haven.look") || look; theme = localStorage.getItem("haven.theme"); screen = screen || localStorage.getItem("haven.screen") || ""; } catch (e) {}
  if (asked === "grounded" || asked === "futuristic" || asked === "vivid") look = asked;
  document.documentElement.setAttribute("data-look", screen === "wallpaper" ? look : "grounded");
  window.__havenLook = look;
  if (theme === "light" || theme === "dark") document.documentElement.setAttribute("data-theme", theme);
  if (!document.documentElement.lang) document.documentElement.lang = "en";
})();
