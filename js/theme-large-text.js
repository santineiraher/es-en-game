/**
 * Tema claro/oscuro y modo letra grande (Aa).
 * - Letra grande: primera vez sin clave => ACTIVADO (1).
 * - Tema: sin clave => seguir prefers-color-scheme.
 */
(function (global) {
  const K = global.EnStorage.KEYS;

  function applyLargeText(on) {
    const root = document.documentElement;
    root.style.setProperty("--ui-scale", on ? "1.25" : "1");
    const btn = document.getElementById("btnLargeText");
    if (btn) {
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.textContent = on ? "Aa (grande)" : "Aa";
    }
  }

  function readLargeText() {
    const raw = global.EnStorage.get(K.LARGE_TEXT, null);
    if (raw === null) return true;
    return raw === "1" || raw === "true";
  }

  function setLargeText(on) {
    global.EnStorage.set(K.LARGE_TEXT, on ? "1" : "0");
    applyLargeText(on);
  }

  function applyTheme(mode) {
    const root = document.documentElement;
    if (mode === "dark") root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", mode === "dark" ? "#0f1419" : "#2563eb");
  }

  function readTheme() {
    const stored = global.EnStorage.get(K.THEME, "");
    if (stored === "dark" || stored === "light") return stored;
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
    return "light";
  }

  function setTheme(mode) {
    global.EnStorage.set(K.THEME, mode);
    applyTheme(mode);
  }

  function toggleTheme() {
    const next = readTheme() === "dark" ? "light" : "dark";
    setTheme(next);
  }

  function init() {
    applyLargeText(readLargeText());
    applyTheme(readTheme());
    const b1 = document.getElementById("btnLargeText");
    if (b1) {
      b1.addEventListener("click", function () {
        setLargeText(!readLargeText());
      });
    }
    const b2 = document.getElementById("btnTheme");
    if (b2) {
      b2.addEventListener("click", function () {
        toggleTheme();
        b2.textContent = readTheme() === "dark" ? "Tema claro" : "Tema oscuro";
      });
      b2.textContent = readTheme() === "dark" ? "Tema claro" : "Tema oscuro";
    }
    if (global.EnStorage.get(K.LARGE_TEXT, null) === null) {
      global.EnStorage.set(K.LARGE_TEXT, "1");
    }
  }

  global.EnTheme = { init, readLargeText, setLargeText, readTheme, setTheme, toggleTheme };
})(typeof window !== "undefined" ? window : globalThis);
