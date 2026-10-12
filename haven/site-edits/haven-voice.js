// Added by haven/scripts/package-website.mjs to the three panel pages.
// Picking one of Haven's voices (the "Haven's voice" card, or the voice list in settings) saves the
// choice, but on this website there is no home server with the premium voice, so replies keep using
// the browser's own voice and the pick sounded like nothing happened. Now each pick plays that voice's
// real sample (voices/<id>.mp3, the same recordings as on the Haven home page), the browser-voice
// "This is how I'll sound" line is skipped so the two don't talk over each other, and the note under
// the card says what the visitor will hear.
(function () {
  var VOICES = { lily: 1, sia: 1, richard: 1, charlotte: 1 };
  var NOTE = "Pick a voice to hear it. Your pick is saved for the whole home; in this demo, Haven's replies use your browser's own voice.";
  // The panel speaks a sentence at a time, so the greeting arrives as these two lines.
  var GREETING = { "Hello.": 1, "This is how I'll sound in your home.": 1 };
  var player = null, pickedAt = 0;

  function play(id) {
    if (!VOICES[id]) return;
    if (player) { player.pause(); player.currentTime = 0; }
    player = new Audio("voices/" + id + ".mp3");
    pickedAt = Date.now();
    try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) {}
    var p = player.play();
    if (p && p.catch) p.catch(function () {});
  }

  // Skip the browser-voice greeting that follows a pick: the sample is playing instead.
  try {
    var synth = window.speechSynthesis;
    if (synth && synth.speak) {
      var speak = synth.speak.bind(synth);
      synth.speak = function (u) {
        if (u && GREETING[u.text] && Date.now() - pickedAt < 4000) {
          setTimeout(function () { if (u.onend) u.onend({}); }, 0); // the panel goes back to idle
          return;
        }
        return speak(u);
      };
    }
  } catch (e) {}

  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest(".la-voices [data-voice]");
    if (b) play(b.getAttribute("data-voice"));
  }, true);
  document.addEventListener("change", function (e) {
    if (e.target && e.target.id === "voice-choice") play(e.target.value);
  }, true);

  // Stop the sample when the panel is hidden (another tour tab, another screen in the library).
  document.addEventListener("visibilitychange", function () { if (document.hidden && player) player.pause(); });

  function fixNotes() {
    var notes = document.querySelectorAll(".la-voice-n, #voice-choice-note");
    for (var i = 0; i < notes.length; i++) if (notes[i].textContent !== NOTE) notes[i].textContent = NOTE;
  }
  function start() {
    fixNotes();
    new MutationObserver(fixNotes).observe(document.body, { childList: true, subtree: true });
  }
  if (document.body) start(); else document.addEventListener("DOMContentLoaded", start);
})();
