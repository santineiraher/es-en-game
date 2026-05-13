/**
 * Prueba de ubicación adaptativa (12–20 ítems).
 *
 * Adaptación: rachas suben/bajan el nivel de la siguiente pregunta (A1…C1).
 * Resultado final: puntos ponderados por dificultad (A1=1 … C1=5); acierto pleno,
 * «No sé» ~35% del peso, fallo 0. El CEFR global sale de un umbral sobre el % del máximo.
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
    const asked = session.askedIds;
    function poolAtLevel(levelIdx) {
      return bank().filter(function (q) {
        return asked.indexOf(q.id) < 0 && cefrToNum(q.cefr_level) === levelIdx;
      });
    }
    let pool = poolAtLevel(session.currentIdx);
    if (!pool.length) {
      for (let d = 1; d <= 4; d++) {
        pool = poolAtLevel(Math.min(4, session.currentIdx + d));
        if (pool.length) break;
        pool = poolAtLevel(Math.max(0, session.currentIdx - d));
        if (pool.length) break;
      }
    }
    if (!pool.length) {
      const any = bank().filter(function (q) {
        return asked.indexOf(q.id) < 0;
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

  /**
   * Resultado final (transparente):
   * - Cada respuesta suma puntos según la dificultad declarada (A1=1 … C1=5).
   * - Acierto = peso completo; "No sé" ≈ 35% del peso; fallo = 0.
   * - Nivel global: umbral sobre el % del máximo posible (orientación, no certificación).
   * - Por categoría: mismo criterio solo con ítems de esa categoría.
   */
  function finalize(session) {
    const LEVEL_WEIGHT = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5 };

    function pointsForAnswer(a) {
      const lv = String(a.cefr_level || "A2").toUpperCase();
      const w = LEVEL_WEIGHT[lv] != null ? LEVEL_WEIGHT[lv] : 2;
      if (a.score >= 1) return { earned: w, possible: w };
      if (a.score >= 0.29) return { earned: w * 0.35, possible: w };
      return { earned: 0, possible: w };
    }

    let earned = 0;
    let possible = 0;
    session.answers.forEach(function (a) {
      const p = pointsForAnswer(a);
      earned += p.earned;
      possible += p.possible;
    });
    const ratio = possible ? earned / possible : 0;
    const pct = Math.round(ratio * 100);

    let estimated_cefr = "A1";
    if (ratio >= 0.78) estimated_cefr = "C1";
    else if (ratio >= 0.62) estimated_cefr = "B2";
    else if (ratio >= 0.46) estimated_cefr = "B1";
    else if (ratio >= 0.3) estimated_cefr = "A2";
    else estimated_cefr = "A1";

    const cats = ["tense", "phrasal", "idiom", "false_friend", "prep", "modal"];
    const per_category = {};
    cats.forEach(function (c) {
      let e = 0;
      let p = 0;
      session.answers.forEach(function (a) {
        if ((a.category || "tense") !== c) return;
        const x = pointsForAnswer(a);
        e += x.earned;
        p += x.possible;
      });
      const r = p ? e / p : ratio;
      if (p === 0) {
        per_category[c] = estimated_cefr;
        return;
      }
      if (r >= 0.72) per_category[c] = "C1";
      else if (r >= 0.58) per_category[c] = "B2";
      else if (r >= 0.42) per_category[c] = "B1";
      else if (r >= 0.26) per_category[c] = "A2";
      else per_category[c] = "A1";
    });

    const summary_es =
      "Puntuación global aproximada: " +
      pct +
      "% del máximo posible (las preguntas más avanzadas valen más; «No sé» suma un poco). " +
      "Con eso estimamos un nivel orientativo " +
      estimated_cefr +
      ". No es un examen oficial: sirve para sugerirte por dónde empezar en la app.";

    const result = {
      estimated_cefr: estimated_cefr,
      per_category: per_category,
      taken_at: Date.now(),
      answers: session.answers,
      placement_ratio: ratio,
      placement_percent: pct,
      summary_es: summary_es,
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
    if (t === "spot_error" && q.stem_en) {
      const box = document.createElement("p");
      box.className = "question-text";
      box.style.fontSize = "calc(20px * var(--ui-scale))";
      box.setAttribute("lang", "en");
      box.textContent = q.stem_en;
      root.appendChild(box);
    }
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
