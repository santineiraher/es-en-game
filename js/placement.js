/**
 * Prueba de ubicación adaptativa (12–20 ítems).
 *
 * Algoritmo resumido:
 * - Por pregunta: +1 acierto, 0 fallo, +0.3 "no sé".
 * - Por categoría: media(score) mapeada a CEFR con peso por dificultad de la pregunta (cefr_level).
 * - Nivel global: mediana de los niveles estimados por categoría observada; si hay 2+ categorías en B2 o más con media alta, sube un escalón.
 */
(function (global) {
  const K = global.EnStorage.KEYS;
  const CEFR = ["A1", "A2", "B1", "B2", "C1"];

  function cefrToNum(x) {
    const i = CEFR.indexOf(String(x || "").toUpperCase());
    return i < 0 ? 1 : i;
  }

  function numToCefr(n) {
    return CEFR[Math.max(0, Math.min(CEFR.length - 1, Math.round(n)))];
  }

  function bank() {
    return global.EN_PLACEMENT_BANK || [];
  }

  function savePartial(state) {
    global.EnStorage.setJSON(K.PLACEMENT_PARTIAL, state);
  }

  function loadPartial() {
    return global.EnStorage.getJSON(K.PLACEMENT_PARTIAL, null);
  }

  function clearPartial() {
    global.EnStorage.set(K.PLACEMENT_PARTIAL, null);
  }

  function pickNextQuestion(session) {
    const pool = bank().filter(function (q) {
      return session.askedIds.indexOf(q.id) < 0 && cefrToNum(q.cefr_level) === session.currentIdx;
    });
    if (!pool.length) {
      const any = bank().filter(function (q) {
        return session.askedIds.indexOf(q.id) < 0;
      });
      if (!any.length) return null;
      return any[Math.floor(Math.random() * any.length)];
    }
    const catNeed = session.nextCatHint;
    const pref = pool.filter(function (q) {
      return q.category === catNeed;
    });
    const pickFrom = pref.length ? pref : pool;
    return pickFrom[Math.floor(Math.random() * pickFrom.length)];
  }

  function categoryRotation(session) {
    const cats = ["tense", "phrasal", "idiom", "false_friend", "prep", "modal"];
    const used = {};
    session.answers.forEach(function (a) {
      used[a.category] = true;
    });
    for (let i = 0; i < cats.length; i++) {
      if (!used[cats[i]]) return cats[i];
    }
    return cats[session.answers.length % cats.length];
  }

  function stableEnough(session) {
    if (session.answers.length < 12) return false;
    if (session.answers.length >= 20) return true;
    const last = session.answers.slice(-6);
    const bands = last.map(function (a) {
      return cefrToNum(a.cefr_level);
    });
    const mean = bands.reduce(function (s, x) {
      return s + x;
    }, 0) / bands.length;
    const varia =
      bands.reduce(function (s, x) {
        return s + (x - mean) * (x - mean);
      }, 0) / bands.length;
    return varia < 0.35 && session.answers.length >= 14;
  }

  function finalize(session) {
    const byCat = {};
    session.answers.forEach(function (a) {
      const c = a.category || "tense";
      if (!byCat[c]) byCat[c] = { sum: 0, w: 0, count: 0 };
      const w = cefrToNum(a.cefr_level) + 1;
      byCat[c].sum += a.score * w;
      byCat[c].w += w;
      byCat[c].count += 1;
    });
    const per_category = {};
    const nums = [];
    Object.keys(byCat).forEach(function (c) {
      const r = byCat[c].w ? byCat[c].sum / byCat[c].w : 0;
      const mapped = r >= 0.85 ? 3 : r >= 0.65 ? 2 : r >= 0.45 ? 1 : r >= 0.25 ? 0 : 0;
      const label = numToCefr(mapped + 1);
      per_category[c] = label;
      nums.push(cefrToNum(label));
    });
    nums.sort(function (a, b) {
      return a - b;
    });
    let med = nums.length ? nums[Math.floor(nums.length / 2)] : 1;
    const high = Object.keys(per_category).filter(function (c) {
      return cefrToNum(per_category[c]) >= 3;
    }).length;
    if (high >= 2) med = Math.min(CEFR.length - 1, med + 1);
    const estimated_cefr = CEFR[med];

    const result = {
      estimated_cefr,
      per_category,
      taken_at: Date.now(),
      answers: session.answers,
    };
    global.EnStorage.setJSON(K.PLACEMENT_RESULT, result);
    clearPartial();
    global.EnStorage.set(K.PLACEMENT_SEEN, "1");
    return result;
  }

  function startNewSession() {
    return {
      askedIds: [],
      answers: [],
      currentIdx: cefrToNum("A2"),
      streakC: 0,
      streakW: 0,
      nextCatHint: "tense",
    };
  }

  function renderQuestion(root, q, index, maxQ, handlers) {
    while (root.firstChild) root.removeChild(root.firstChild);
    const p = document.createElement("p");
    p.className = "lead";
    p.textContent = q.stem_es || "";
    root.appendChild(p);
    const t = q.type || "mcq";
    if (t === "mcq" || t === "spot_error") {
      const grid = document.createElement("div");
      grid.className = "mcq-grid";
      (q.options || []).forEach(function (opt, idx) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "secondary";
        b.textContent = opt;
        b.addEventListener("click", function () {
          handlers.onPick(idx);
        });
        grid.appendChild(b);
      });
      root.appendChild(grid);
    } else if (t === "cloze" || t === "translate_es_en") {
      if (q.stem_en) {
        const pe = document.createElement("p");
        pe.className = "question-text";
        pe.style.fontSize = "calc(20px * var(--ui-scale))";
        pe.textContent = q.stem_en;
        root.appendChild(pe);
      }
      const lab = document.createElement("label");
      lab.className = "field";
      lab.textContent = "Escribe tu respuesta";
      const inp = document.createElement("input");
      inp.type = "text";
      inp.autocomplete = "off";
      lab.appendChild(inp);
      root.appendChild(lab);
      const row = document.createElement("div");
      row.className = "actions";
      const ok = document.createElement("button");
      ok.type = "button";
      ok.className = "primary";
      ok.textContent = "Enviar respuesta";
      ok.addEventListener("click", function () {
        handlers.onOpen(inp.value);
      });
      row.appendChild(ok);
      root.appendChild(row);
    }
    const note = document.createElement("p");
    note.className = "muted";
    note.textContent = "Pregunta " + (index + 1) + " de hasta " + maxQ + " · Sin revelar la respuesta correcta al finalizar cada ítem.";
    root.appendChild(note);
  }

  function gradeOpen(q, val) {
    const accept = (q.accept || []).slice();
    if (q.correctDisplay) accept.push(q.correctDisplay);
    const ok = global.EnNormalize.matchesAny(val, accept, { strictAccents: false });
    return ok;
  }

  function gradeMcq(q, idx) {
    return idx === (q.correctIndex || 0);
  }

  global.EnPlacement = {
    CEFR,
    bank,
    savePartial,
    loadPartial,
    clearPartial,
    pickNextQuestion,
    categoryRotation,
    stableEnough,
    finalize,
    startNewSession,
    renderQuestion,
    gradeOpen,
    gradeMcq,
    cefrToNum,
    numToCefr,
  };
})(typeof window !== "undefined" ? window : globalThis);
