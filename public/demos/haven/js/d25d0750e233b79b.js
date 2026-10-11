
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const NOTES = {
    film: "The house designs itself as a hologram, becomes real, and the guide walks the client through to the panel.",
    live: "The hologram part of the film at full length, drawn live in your browser. Press play on the page.",
    panel: "The wall panel, running on a simulated house. Everything on it works: talk to Haven, run scenes, open rooms, change screens.",
    site: "Scrolling builds the home, chapter by chapter.",
    residence: "A property site made from the same plan. Scroll walk-through, specs, floor plans, a booking form.",
    library: "Every screen, with a link to open each one live. Wallpaper also shows its three finishes.",
  };
  const state = { tab: "film", film: "cut", finish: "grounded", screen: "command" };
  // Screens from before the redesign, for saved state and old deep links.
  const OLD = { signature: "command", studio: "glass", "command-center": "wall", "family-hub": "evening", nightstand: "aurora", rooms: "classic", entry: "console" };
  const views = { film: $("#view-film"), live: $("#view-live"), panel: $("#view-panel"), site: $("#view-site"), residence: $("#view-residence"), library: $("#view-library") };
  function load(frame, src) { if (frame.getAttribute("src") !== src) frame.setAttribute("src", src); }
  function show() {
    const key = state.tab === "film" ? state.film === "cut" ? "film" : "live" : state.tab;
    for (const [k, el] of Object.entries(views)) { if (k === key) el.setAttribute("data-on", ""); else el.removeAttribute("data-on"); }
    if (key !== "film") { const v = $("video"); v.pause(); }
    if (key === "live") load(views.live, "film.html");
    else views.live.removeAttribute("src"); // the live film draws every frame; unload it when it is out of sight
    if (key === "panel") load(views.panel, `panel-${state.finish}.html?look=${state.finish}#${state.screen}`);
    if (key === "site") load(views.site, "meridian.html");
    if (key === "residence") load(views.residence, "residence.html");
    if (key === "library") load(views.library, "library.html");
    $$("[role=tab]").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.tab === state.tab)));
    $("#sub-film").toggleAttribute("data-on", state.tab === "film");
    $("#sub-panel").toggleAttribute("data-on", state.tab === "panel");
    $$("[data-film]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.film === state.film)));
    $$("[data-finish]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.finish === state.finish)));
    $$("[data-screen]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.screen === state.screen)));
    $("#note").textContent = NOTES[key];
    $("#live").textContent = $(`[role=tab][data-tab="${state.tab}"]`).textContent;
    try { localStorage.setItem("showroom", JSON.stringify(state)); } catch {}
    location.hash = state.tab === "panel" ? `${state.tab}/${state.finish}/${state.screen}` : state.tab === "film" && state.film === "live" ? "live" : state.tab;
  }
  function changeScreen(screen) {
    state.screen = screen;
    const f = views.panel;
    // Same page, new screen: a hash change inside the frame keeps the panel's state.
    try { if (f.contentWindow && f.getAttribute("src")?.startsWith(`panel-${state.finish}.html`)) { f.contentWindow.location.hash = screen; } } catch {}
    show();
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.dataset.tab) state.tab = b.dataset.tab;
    else if (b.dataset.film) state.film = b.dataset.film;
    else if (b.dataset.finish) state.finish = b.dataset.finish;
    else if (b.dataset.screen) return changeScreen(b.dataset.screen);
    else return;
    show();
  });
  $("nav").addEventListener("keydown", (e) => {
    const tabs = $$("[role=tab]"), i = tabs.indexOf(document.activeElement); if (i < 0) return;
    const j = e.key === "ArrowRight" ? (i + 1) % tabs.length : e.key === "ArrowLeft" ? (i - 1 + tabs.length) % tabs.length : -1;
    if (j >= 0) { e.preventDefault(); tabs[j].focus(); tabs[j].click(); }
  });
  // The guided demo: each step sets the app's state and says what to try.
  const TOUR = [
    { tab: "film", film: "cut", title: "The film", text: "The house designs itself as a hologram, becomes real, and its guide walks the client through to the panel. Press play; it runs 1:19, with sound.", go: () => $("video").play().catch(() => {}) },
    { tab: "panel", finish: "grounded", screen: "command", title: "The wall panel", text: "This is the panel a family sees in the great room. Everything on it works; it is running on a simulated house.", tip: "Type <b>I'm cold</b> in the bar at the bottom. Haven warms the room and remembers it for this time of day.", top: true },
    { tab: "panel", finish: "grounded", screen: "command", title: "It asks before anything risky", text: "Haven never unlocks a door or opens the garage on its own. The rule is in the code, not the brochure.", tip: "Type <b>open the garage</b>. It asks you to confirm first.", top: true },
    { tab: "panel", finish: "grounded", screen: "glass", title: "Glass", text: "Haven's voice line along the bottom, and above it the four agents: lighting, climate, security and energy. They light up only when something real happens.", tip: "Tap the voice line and say <b>goodnight</b>, or type it, and watch the agents hand off to each other.", top: true },
    { tab: "panel", finish: "grounded", screen: "evening", title: "Good Evening", text: "The kitchen screen: a greeting, climate and the water heater, the forecast, scenes, and a card for every room.", tip: "Tap a light's round button on a room card." },
    { tab: "panel", finish: "grounded", screen: "console", title: "Security Console", text: "The screen by the door you leave by: every lock and sensor, the cameras, and one tap to say you're leaving.", tip: "Press <b>I'm leaving</b>. Lights off, doors locked, the house set back." },
    { tab: "panel", finish: "grounded", screen: "wall", title: "Everything Wall", text: "Everything at once for the office: the numbers that matter, every switch, each room, and today's electricity.", tip: "Tap a room's light bar to switch it." },
    { tab: "panel", finish: "vivid", screen: "wallpaper", title: "Ten screens, and three finishes", text: "Each screen has its own look. Wallpaper also comes in three finishes: this is Vivid; Grounded and Futuristic are the other two.", tip: "Try the <b>Futuristic</b> chip above." },
    { tab: "site", title: "The walk-through", text: "Scrolling builds the home, chapter by chapter, from the first line of the plan to the lights coming on.", tip: "Scroll slowly through the first screen." },
    { tab: "residence", title: "A property site", text: "The Linden House template: a listing made from the same plan, with its floor plans and a preview booking form.", tip: "Scroll to the floor plans. They are drawn from the plan itself." },
    { tab: "library", title: "Every screen", text: "The screen library: all ten screens, for choosing what goes in each room.", tip: "That's the demo. Use the tabs to go anywhere, or start over for the next client." },
  ];
  let step = -1;
  const tour = $("#tour"), welcome = $("#welcome");
  function showStep(i) {
    step = i; const t = TOUR[i];
    Object.assign(state, { tab: t.tab }, t.film ? { film: t.film } : {}, t.finish ? { finish: t.finish } : {}, t.screen ? { screen: t.screen } : {});
    if (t.screen && views.panel.getAttribute("src")?.startsWith(`panel-${t.finish}.html`)) changeScreen(t.screen); else show();
    if (t.go) t.go();
    tour.classList.toggle("top", !!t.top);
    tour.style.top = t.top ? `${$("main").getBoundingClientRect().top + 12}px` : ""; // just under the bars, over the picture
    $("#tour-step").textContent = `Step ${i + 1} of ${TOUR.length}`;
    $("#tour-title").textContent = t.title; $("#tour-text").textContent = t.text;
    const tip = $("#tour-try"); tip.hidden = !t.tip; tip.innerHTML = t.tip ? `Try it: ${t.tip}` : "";
    $("#tour-back").disabled = i === 0;
    $("#tour-next").textContent = i === TOUR.length - 1 ? "Start over" : "Next";
    $("#tour-bar").style.width = `${((i + 1) / TOUR.length) * 100}%`;
    tour.hidden = false;
  }
  function endTour() { step = -1; tour.hidden = true; $("#tour-btn").focus(); }
  function resetDemo() {
    // A clean house for the next client: the panels' saved state and this app's own.
    try { Object.keys(localStorage).forEach((k) => localStorage.removeItem(k)); } catch {}
    Object.values(views).forEach((v) => { if (v.tagName === "IFRAME") v.removeAttribute("src"); });
    Object.assign(state, { tab: "film", film: "cut", finish: "grounded", screen: "command" });
    const v = $("video"); v.pause(); v.currentTime = 0;
    show(); tour.hidden = true; welcome.hidden = false; $("#start-tour").focus();
  }
  $("#start-tour").addEventListener("click", () => { welcome.hidden = true; showStep(0); $("#tour-next").focus(); });
  $("#skip-tour").addEventListener("click", () => { welcome.hidden = true; });
  $("#tour-btn").addEventListener("click", () => showStep(0));
  $("#tour-next").addEventListener("click", () => step === TOUR.length - 1 ? resetDemo() : showStep(step + 1));
  $("#tour-back").addEventListener("click", () => showStep(Math.max(0, step - 1)));
  $("#tour-end").addEventListener("click", endTour);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !tour.hidden) endTour(); });
  // A page inside the app can ask for a tab (the website's "Try the wall panel").
  window.addEventListener("message", (e) => { const t = e.data && e.data.showroom; if (t in views || t === "panel") { state.tab = t; show(); } });
  // Deep links: #panel/vivid/glass, #live, #site, #residence, #library.
  const h = location.hash.slice(1).split("/");
  if (h[0] === "live") { state.tab = "film"; state.film = "live"; }
  else if (h[0] in views || h[0] === "panel") { state.tab = h[0]; if (h[1]) state.finish = h[1]; if (h[2]) state.screen = h[2]; }
  else { try { Object.assign(state, JSON.parse(localStorage.getItem("showroom") || "{}")); } catch {} }
  if (!(state.finish in { grounded: 1, futuristic: 1, vivid: 1 })) state.finish = "grounded";
  state.screen = OLD[state.screen] || state.screen;
  if (location.hash.length > 1) welcome.hidden = true;
  show();
  if (!welcome.hidden) $("#start-tour").focus(); // the welcome is a modal: focus starts inside it
})();
