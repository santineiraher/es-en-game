/**
 * Claves centralizadas de localStorage.
 */
(function (global) {
  const KEYS = {
    LARGE_TEXT: "en_large_text",
    THEME: "en_theme",
    STRICT_ACCENTS: "en_strict_accents",
    PLACEMENT_SEEN: "en_placement_seen_v1",
    PLACEMENT_PARTIAL: "en_placement_test_partial",
    PLACEMENT_RESULT: "en_placement_result_v1",
    SRS: "en_game_srs_v1",
    PROGRESS: "en_game_progress_v1",
    SETTINGS: "en_game_settings_v1",
    FIRST_RUN: "en_app_initialized_v1",
  };

  function get(key, defaultValue) {
    try {
      const v = localStorage.getItem(key);
      return v === null || v === undefined ? defaultValue : v;
    } catch (e) {
      return defaultValue;
    }
  }

  function set(key, value) {
    try {
      if (value === null || value === undefined) localStorage.removeItem(key);
      else localStorage.setItem(key, String(value));
    } catch (e) {}
  }

  function getJSON(key, defaultValue) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return defaultValue;
      return JSON.parse(raw);
    } catch (e) {
      return defaultValue;
    }
  }

  function setJSON(key, obj) {
    try {
      localStorage.setItem(key, JSON.stringify(obj));
    } catch (e) {}
  }

  global.EnStorage = { KEYS, get, set, getJSON, setJSON };
})(typeof window !== "undefined" ? window : globalThis);
