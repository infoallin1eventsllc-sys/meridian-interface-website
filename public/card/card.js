// The card's background, chosen by the card owner.
//
// The owner picks a background (or uploads a photo) in a private portal; the
// choice is stored server-side under one key, and every visitor's card reads it
// here. Visitors cannot change it. Built by build_card.py from
// assets/card-background.js; values in __CAPS__ are filled in at build time.
// Kept out of the HTML because the site's security policy runs no inline script.
(function () {
  var KEY = 'card.background';
  var ENDPOINT = 'https://glzodwhyavexpuusbqjy.supabase.co/functions/v1/site-images';
  var PUBLIC_BASE = 'https://meridianinterface.com/card/bg/';   // how stored choices name the built-in backgrounds
  var LOCAL_BASE = '/card/bg/';     // where this page loads them from (same origin)
  var DEFAULT_STEM = 'ribbon';
  var THEMES = {"curved-facade": {"top": "#023180", "acc": "#2563eb", "accText": "#fff", "ink": "#141a52"}, "glass-tower": {"top": "#023490", "acc": "#2563eb", "accText": "#fff", "ink": "#141a52"}, "glass-tower-gold": {"top": "#444449", "acc": "#d4a017", "accText": "#1c1917", "ink": "#1c1917"}, "glass-tower-purple": {"top": "#470189", "acc": "#7c3aed", "accText": "#fff", "ink": "#2e1065"}, "glass-tower-red": {"top": "#7c0721", "acc": "#dc2626", "accText": "#fff", "ink": "#450a0a"}, "glass-tower-sunset": {"top": "#270290", "acc": "#ea580c", "accText": "#fff", "ink": "#431407"}, "glass-tower-teal": {"top": "#07827d", "acc": "#0d9488", "accText": "#fff", "ink": "#042f2e"}, "houston-skyline": {"top": "#002165", "acc": "#2563eb", "accText": "#fff", "ink": "#141a52"}, "light-trails": {"top": "#010432", "acc": "#2563eb", "accText": "#fff", "ink": "#141a52"}, "liquid-glass": {"top": "#05174e", "acc": "#2563eb", "accText": "#fff", "ink": "#141a52"}, "ribbon": {"top": "#003cb5", "acc": "#2563eb", "accText": "#fff", "ink": "#141a52"}, "ribbon-gold": {"top": "#72747e", "acc": "#d4a017", "accText": "#1c1917", "ink": "#1c1917"}, "ribbon-purple": {"top": "#5c00ac", "acc": "#7c3aed", "accText": "#fff", "ink": "#2e1065"}, "ribbon-red": {"top": "#9b0724", "acc": "#dc2626", "accText": "#fff", "ink": "#450a0a"}, "ribbon-sunset": {"top": "#3300b6", "acc": "#ea580c", "accText": "#fff", "ink": "#431407"}, "ribbon-teal": {"top": "#08a49c", "acc": "#0d9488", "accText": "#fff", "ink": "#042f2e"}, "__upload__": {"top": "#0b1220", "acc": "#2563eb", "accText": "#fff", "ink": "#141a52"}};
  var CACHE = 'card_bg:' + KEY;
  var root = document.documentElement;
  root.className += ' bgjs';

  function isUpload(url) {
    return /^https:\/\/[a-z0-9-]+\.supabase\.co\/storage\/v1\/object\/public\/[A-Za-z0-9._\/-]+$/.test(url);
  }
  function stemOf(url) {
    if (typeof url !== 'string' || url.indexOf(PUBLIC_BASE) !== 0) return null;
    var s = url.slice(PUBLIC_BASE.length).replace(/\.jpg$/, '');
    return THEMES.hasOwnProperty(s) ? s : null;
  }
  function apply(url) {
    var stem = stemOf(url), src, theme;
    if (stem) { src = LOCAL_BASE + stem + '.jpg'; theme = THEMES[stem]; }
    else if (typeof url === 'string' && url.length < 2048 && isUpload(url)) { src = url; theme = THEMES.__upload__; }
    else { src = LOCAL_BASE + DEFAULT_STEM + '.jpg'; theme = THEMES[DEFAULT_STEM]; }
    var st = root.style;
    st.setProperty('--top', theme.top);
    st.setProperty('--acc', theme.acc);
    st.setProperty('--acc-text', theme.accText);
    st.setProperty('--ink', theme.ink);
    var paint = function () {
      document.body.style.backgroundImage = 'url("' + src + '")';
      var m = document.querySelector('meta[name="theme-color"]');
      if (m) m.setAttribute('content', theme.top);
      if (root.className.indexOf('bgset') < 0) root.className += ' bgset';
    };
    if (document.body) paint(); else document.addEventListener('DOMContentLoaded', paint);
  }

  var cached = null;
  try { cached = localStorage.getItem(CACHE); } catch (e) { /* storage off: no fast first paint */ }
  if (cached) apply(cached);
  // A slow or blocked network still ends with a background, never a blank card.
  var fallback = setTimeout(function () { if (!cached) apply(''); }, 2500);

  fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"action":"list"}' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (b) {
      if (!b || !b.ok) return;
      clearTimeout(fallback);
      var url = (b.overrides && b.overrides[KEY]) || '';
      apply(url);
      try { if (url) localStorage.setItem(CACHE, url); else localStorage.removeItem(CACHE); } catch (e) { /* ignore */ }
    })
    .catch(function () { /* keep the cached or default background */ });
})();
