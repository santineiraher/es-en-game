/**
 * Progreso por track/nivel, racha, recomendaciones, export unificado.
 */
(function (global) {
  const K = global.EnStorage.KEYS;
  const VERSION = 1;

  function defaultState() {
    return {
      version: VERSION,
      maxUnlockedLevelByTrack: {},
      streak: 0,
      lastPlayed: { trackId: null, levelIndex: null },
      recommendedTrackIds: [],
      placementCefr: "A1",
      sessionStreak: 0,
    };
  }

  function load() {
    const s = global.EnStorage.getJSON(K.PROGRESS, null);
    if (!s || typeof s !== "object") return defaultState();
    const base = defaultState();
    return Object.assign(base, s, {
      maxUnlockedLevelByTrack: s.maxUnlockedLevelByTrack && typeof s.maxUnlockedLevelByTrack === "object" ? s.maxUnlockedLevelByTrack : {},
    });
  }

  function save(st) {
    global.EnStorage.setJSON(K.PROGRESS, st);
  }

  function ensureTrackKeys(st) {
    global.EnTracks.TRACKS.forEach((t) => {
      if (st.maxUnlockedLevelByTrack[t.id] == null) st.maxUnlockedLevelByTrack[t.id] = 0;
    });
  }

  function applySkipA1() {
    const st = load();
    st.placementCefr = "A1";
    st.recommendedTrackIds = ["t_present", "t_irregular"];
    global.EnTracks.TRACKS.forEach((t) => {
      st.maxUnlockedLevelByTrack[t.id] = Math.min(1, t.levelCount - 1);
    });
    save(st);
    return st;
  }

  function applyPlacementResult(result, mode) {
    const st = load();
    const cefr = (result && result.estimated_cefr) || "A2";
    st.placementCefr = cefr;
    const cap = global.EnTracks.maxLevelIndexForTier(cefr);
    const rec = recommendTracksFromCategories(result && result.per_category);
    st.recommendedTrackIds = rec;

    global.EnTracks.TRACKS.forEach((t) => {
      const maxIdx = t.levelCount - 1;
      if (mode === "route") {
        if (rec.indexOf(t.id) >= 0) st.maxUnlockedLevelByTrack[t.id] = Math.min(maxIdx, Math.max(cap, 3));
        else st.maxUnlockedLevelByTrack[t.id] = Math.min(2, maxIdx);
      } else {
        st.maxUnlockedLevelByTrack[t.id] = Math.min(maxIdx, cap);
      }
    });
    save(st);
    return st;
  }

  function recommendTracksFromCategories(perCat) {
    const pairs = [];
    if (!perCat || typeof perCat !== "object") return ["t_present", "t_perfect"];
    Object.keys(perCat).forEach((cat) => {
      const lvl = String(perCat[cat] || "A2");
      pairs.push({ cat, idx: global.EnTracks.cefrIndex(lvl) });
    });
    pairs.sort((a, b) => a.idx - b.idx);
    const out = [];
    const map = {
      tense: "t_perfect",
      phrasal: "t_phrasal",
      idiom: "t_idiom",
      false_friend: "t_false_friend",
      prep: "t_present",
      modal: "t_modals",
      passive: "t_passive",
      article: "t_present",
      conditional: "t_future",
    };
    pairs.forEach((p) => {
      const tid = map[p.cat] || "t_present";
      if (out.indexOf(tid) < 0) out.push(tid);
    });
    ["t_present", "t_past"].forEach((x) => {
      if (out.indexOf(x) < 0) out.unshift(x);
    });
    return out.slice(0, 5);
  }

  function canPlayTrackLevel(trackId, levelIndex) {
    const st = load();
    ensureTrackKeys(st);
    const max = st.maxUnlockedLevelByTrack[trackId];
    return levelIndex <= max;
  }

  function noteAnswer(trackId, levelIndex, ok) {
    const st = load();
    ensureTrackKeys(st);
    const same =
      st.lastPlayed &&
      st.lastPlayed.trackId === trackId &&
      Number(st.lastPlayed.levelIndex) === Number(levelIndex);
    st.lastPlayed = { trackId, levelIndex: Number(levelIndex) };
    if (ok) {
      st.streak = (st.streak || 0) + 1;
      if (same) st.sessionStreak = (st.sessionStreak || 0) + 1;
      else st.sessionStreak = 1;
      const tmeta = global.EnTracks.trackById(trackId);
      if (tmeta && st.sessionStreak >= 3) {
        const curMax = st.maxUnlockedLevelByTrack[trackId] || 0;
        if (levelIndex >= curMax && curMax < tmeta.levelCount - 1) {
          st.maxUnlockedLevelByTrack[trackId] = curMax + 1;
        }
        st.sessionStreak = 0;
      }
    } else {
      st.streak = 0;
      st.sessionStreak = 0;
    }
    save(st);
    return st;
  }

  function resetProgressKeepPlacement() {
    const st = load();
    const keep = { placementCefr: st.placementCefr, recommendedTrackIds: st.recommendedTrackIds };
    const n = defaultState();
    n.placementCefr = keep.placementCefr;
    n.recommendedTrackIds = keep.recommendedTrackIds;
    global.EnTracks.TRACKS.forEach((t) => {
      n.maxUnlockedLevelByTrack[t.id] = 0;
    });
    save(n);
  }

  function exportUnified() {
    const srs = JSON.parse(global.EnSRS.exportJSON());
    const progress = load();
    const settings = {
      strictAccents: global.EnStorage.get(global.EnStorage.KEYS.STRICT_ACCENTS, "0") === "1",
      theme: global.EnStorage.get(global.EnStorage.KEYS.THEME, ""),
      largeText: global.EnStorage.get(global.EnStorage.KEYS.LARGE_TEXT, "1"),
    };
    return JSON.stringify(
      {
        bundle: "en-es-game",
        version: 1,
        exportedAt: Date.now(),
        srs,
        progress,
        settings,
      },
      null,
      2
    );
  }

  function importUnified(text, mode) {
    try {
      const o = JSON.parse(text);
      if (!o || o.bundle !== "en-es-game") return { ok: false, reason: "formato" };
      if (o.srs && o.srs.items) {
        global.EnSRS.importJSON(JSON.stringify(o.srs), mode === "replace" ? "replace" : "merge");
      }
      if (o.progress && typeof o.progress === "object") {
        if (mode === "replace") global.EnStorage.setJSON(K.PROGRESS, Object.assign(defaultState(), o.progress));
        else {
          const cur = load();
          const merged = Object.assign(cur, o.progress);
          save(merged);
        }
      }
      if (o.settings && typeof o.settings === "object") {
        if (o.settings.strictAccents != null) global.EnStorage.set(K.STRICT_ACCENTS, o.settings.strictAccents ? "1" : "0");
        if (o.settings.theme) global.EnStorage.set(K.THEME, o.settings.theme);
        if (o.settings.largeText != null) global.EnStorage.set(K.LARGE_TEXT, o.settings.largeText ? "1" : "0");
      }
      return { ok: true };
    } catch (e) {
      return { ok: false, reason: "json" };
    }
  }

  global.EnProgress = {
    load,
    save,
    applySkipA1,
    applyPlacementResult,
    canPlayTrackLevel,
    noteAnswer,
    resetProgressKeepPlacement,
    exportUnified,
    importUnified,
    recommendTracksFromCategories,
  };
})(typeof window !== "undefined" ? window : globalThis);
