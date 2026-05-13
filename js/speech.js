/**
 * Web Speech API: solo lectura en voz alta (TTS) para ejercicios de listening.
 * La práctica de pronunciación con micrófono (SpeechRecognition) queda fuera
 * de esta versión; se puede añadir más adelante como mejora opcional.
 */
(function (global) {
  function speak(text, opts) {
    opts = opts || {};
    if (!global.speechSynthesis) {
      alert("Tu navegador no puede leer en voz alta aquí. Prueba en Chrome o Edge actualizado.");
      return;
    }
    const t = String(text || "").trim();
    if (!t) return;
    try {
      global.speechSynthesis.cancel();
    } catch (e) {}
    const u = new SpeechSynthesisUtterance(t);
    u.lang = opts.lang || "en-US";
    u.rate = opts.rate != null ? opts.rate : 0.95;
    const voices = global.speechSynthesis.getVoices();
    const pref = voices.find((v) => /en-US/i.test(v.lang)) || voices.find((v) => /^en/i.test(v.lang));
    if (pref) u.voice = pref;
    global.speechSynthesis.speak(u);
  }

  function ensureVoices(cb) {
    const synth = global.speechSynthesis;
    if (!synth) return cb && cb();
    const vs = synth.getVoices();
    if (vs && vs.length) return cb && cb();
    synth.addEventListener("voiceschanged", function once() {
      synth.removeEventListener("voiceschanged", once);
      cb && cb();
    });
  }

  global.EnSpeech = { speak, ensureVoices };
})(typeof window !== "undefined" ? window : globalThis);
