// The AI Voice Agent call speaks its first line on a timer after "Call" is tapped. iPhones and iPads
// only let a page start speaking during a tap, so that first line (and every line after it) stayed
// silent there. Saying a silent word on the visitor's first tap unlocks speech for the whole visit.
(function () {
  if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") return;
  function unlock() {
    window.removeEventListener("pointerdown", unlock, true);
    window.removeEventListener("keydown", unlock, true);
    try { var u = new SpeechSynthesisUtterance(" "); u.volume = 0; window.speechSynthesis.speak(u); } catch (e) {}
  }
  window.addEventListener("pointerdown", unlock, true);
  window.addEventListener("keydown", unlock, true);
})();
