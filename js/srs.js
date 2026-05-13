/**
 * SRS Leitner 6 cajas.
 * Clave: `${trackId}|${itemId}|${variante}`
 *
 * Intervalos al acertar: 10 min, 1d, 3d, 7d, 16d, 35d.
 * Fallo: vuelve a caja 0, due en 1 minuto.
 */
(function (global) {
  const LS_KEY = "en_game_srs_v1";
  const VERSION = 1;
  const MIN_MS = 60 * 1000;
  const DAY_MS = 24 * 60 * 60 * 1000;

  const SRS_INTERVALS = [10 * MIN_MS, 1 * DAY_MS, 3 * DAY_MS, 7 * DAY_MS, 16 * DAY_MS, 35 * DAY_MS];
  const MAX_BOX = SRS_INTERVALS.length - 1;
  const LAPSE_INTERVAL = 1 * MIN_MS;

  let state = { version: VERSION, items: {} };

  function loadState() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) {
        state = { version: VERSION, items: {} };
        return;
      }
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") {
        state = { version: VERSION, items: {} };
        return;
      }
      state = {
        version: parsed.version || VERSION,
        items: parsed.items && typeof parsed.items === "object" ? parsed.items : {},
      };
    } catch (e) {
      state = { version: VERSION, items: {} };
    }
  }

  function saveState() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  function makeKey(trackId, itemId, variante) {
    return String(trackId) + "|" + String(itemId) + "|" + String(variante || "default");
  }

  function newItem(now) {
    return { box: 0, dueAt: now, reps: 0, lapses: 0, lastMs: 0 };
  }

  function getItem(trackId, itemId, variante) {
    const k = makeKey(trackId, itemId, variante);
    return state.items[k] || null;
  }

  function record(trackId, itemId, variante, ok) {
    if (!trackId || !itemId) return null;
    const now = Date.now();
    const k = makeKey(trackId, itemId, variante);
    const it = state.items[k] || newItem(now);
    it.reps = (it.reps || 0) + 1;
    it.lastMs = now;
    if (ok) {
      it.box = Math.min(MAX_BOX, (it.box || 0) + 1);
      it.dueAt = now + SRS_INTERVALS[it.box];
    } else {
      it.lapses = (it.lapses || 0) + 1;
      it.box = 0;
      it.dueAt = now + LAPSE_INTERVAL;
    }
    state.items[k] = it;
    saveState();
    return it;
  }

  function pickDue(allKeys, n) {
    const now = Date.now();
    const due = [];
    for (const key of Object.keys(state.items)) {
      const it = state.items[key];
      if (it.dueAt <= now && allKeys.has(key)) due.push({ key, item: it });
    }
    due.sort((a, b) => a.item.dueAt - b.item.dueAt);
    return due.slice(0, n || due.length);
  }

  function pickNew(candidateKeys, n) {
    const out = [];
    for (const k of candidateKeys) {
      if (!state.items[k]) {
        out.push(k);
        if (n && out.length >= n) return out;
      }
    }
    return out;
  }

  function stats() {
    let dueCount = 0;
    let learning = 0;
    let young = 0;
    let mature = 0;
    const now = Date.now();
    const all = [];
    for (const key of Object.keys(state.items)) {
      const it = state.items[key];
      if (it.dueAt <= now) dueCount++;
      if (it.box === 0) learning++;
      else if (it.box <= 2) young++;
      else mature++;
      all.push({ key, item: it });
    }
    const lapses_top = all
      .filter((x) => x.item.lapses > 0)
      .sort((a, b) => b.item.lapses - a.item.lapses || b.item.lastMs - a.item.lastMs)
      .slice(0, 12);
    return { total: all.length, due: dueCount, learning, young, mature, lapses_top };
  }

  function reset() {
    state = { version: VERSION, items: {} };
    saveState();
  }

  function exportJSON() {
    return JSON.stringify(state, null, 2);
  }

  function importJSON(text, mode) {
    try {
      const parsed = JSON.parse(text);
      if (!parsed || typeof parsed !== "object" || !parsed.items) return false;
      if (mode === "replace") {
        state = { version: parsed.version || VERSION, items: parsed.items };
      } else {
        for (const k of Object.keys(parsed.items)) {
          const incoming = parsed.items[k];
          const current = state.items[k];
          if (!current) state.items[k] = incoming;
          else state.items[k] = (incoming.dueAt || 0) > (current.dueAt || 0) ? incoming : current;
        }
      }
      saveState();
      return true;
    } catch (e) {
      return false;
    }
  }

  loadState();

  global.EnSRS = {
    VERSION,
    LS_KEY,
    SRS_INTERVALS,
    MAX_BOX,
    makeKey,
    record,
    pickDue,
    pickNew,
    getItem,
    stats,
    reset,
    exportJSON,
    importJSON,
  };
})(typeof window !== "undefined" ? window : globalThis);
