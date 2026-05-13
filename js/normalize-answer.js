/**
 * Normalización de respuestas abiertas: tolerante por defecto.
 */
(function (global) {
  function foldAccents(s) {
    return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function normalizeCore(s, opts) {
    opts = opts || {};
    let t = String(s || "").trim();
    t = t.replace(/\s+/g, " ");
    t = t.replace(/[’‘]/g, "'");
    if (!opts.strictAccents) t = foldAccents(t);
    t = t.toLowerCase();
    t = t.replace(/[.?!,;:]+$/g, "").trim();
    return t;
  }

  function equals(user, expected, opts) {
    return normalizeCore(user, opts) === normalizeCore(expected, opts);
  }

  function matchesAny(user, acceptList, opts) {
    const u = normalizeCore(user, opts);
    if (!u) return false;
    for (let i = 0; i < acceptList.length; i++) {
      const a = normalizeCore(acceptList[i], opts);
      if (a && u === a) return true;
    }
    return false;
  }

  global.EnNormalize = { normalizeCore, equals, matchesAny, foldAccents };
})(typeof window !== "undefined" ? window : globalThis);
