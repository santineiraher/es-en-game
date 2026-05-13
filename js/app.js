(function () {
  const K = window.EnStorage.KEYS;
  let currentView = "welcome";
  let placementSession = null;
  let currentPlacementController = null;
  let gameController = null;
  let srsController = null;
  let examController = null;
  let fcIndex = 0;
  let fcOrder = [];
  let currentPlacementQ = null;

  function $(id) {
    return document.getElementById(id);
  }

  function showView(mode) {
    currentView = mode;
    document.querySelectorAll(".view").forEach(function (el) {
      el.classList.add("hidden");
    });
    document.querySelectorAll(".nav-btns button").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-mode") === mode);
    });
    const map = {
      welcome: "viewWelcome",
      placement: "viewPlacement",
      placementResult: "viewPlacementResult",
      tracks: "viewTracks",
      flashcards: "viewFlashcards",
      list: "viewList",
      reference: "viewReference",
      game: "viewGame",
      srs: "viewSrs",
      progress: "viewProgress",
      exam: "viewExam",
      mylevel: "viewMyLevel",
      settings: "viewSettings",
    };
    const id = map[mode];
    if (id && $(id)) $(id).classList.remove("hidden");
    if (mode === "tracks") renderTracks();
    if (mode === "flashcards") initFlashcards();
    if (mode === "list") renderList();
    if (mode === "reference") renderReference();
    if (mode === "game") initGameView();
    if (mode === "srs") initSrsView();
    if (mode === "progress") renderProgress();
    if (mode === "exam") initExamView();
    if (mode === "mylevel") renderMyLevel();
    if (mode === "welcome") initWelcome();
  }

  function initWelcome() {
    const seen = window.EnStorage.get(K.PLACEMENT_SEEN, "0") === "1";
    const title = $("welcomeTitle");
    const text = $("welcomeText");
    const actions = $("welcomeActions");
    while (actions.firstChild) actions.removeChild(actions.firstChild);
    if (!seen) {
      title.textContent = "¡Hola!";
      text.textContent =
        "Antes de empezar, hagamos una pequeña prueba para saber por dónde te conviene comenzar. Toma unos 5 minutos y puedes parar cuando quieras.";
      const b1 = document.createElement("button");
      b1.className = "primary";
      b1.textContent = "Hacer la prueba";
      b1.addEventListener("click", function () {
        startPlacement(false);
      });
      const b2 = document.createElement("button");
      b2.className = "secondary";
      b2.textContent = "Saltar (empezar desde A1)";
      b2.addEventListener("click", function () {
        window.EnProgress.applySkipA1();
        window.EnStorage.set(K.PLACEMENT_SEEN, "1");
        alert("Listo. Empezamos desde A1. Puedes ir a Tracks o al Juego.");
        showView("tracks");
      });
      actions.appendChild(b1);
      actions.appendChild(b2);
    } else {
      title.textContent = "Bienvenida de nuevo";
      text.textContent = "Elige una sección arriba. Tu progreso se guarda en este navegador.";
      const b = document.createElement("button");
      b.className = "primary";
      b.textContent = "Ir a Tracks";
      b.addEventListener("click", function () {
        showView("tracks");
      });
      actions.appendChild(b);
    }
  }

  function startPlacement(resume) {
    showView("placement");
    placementSession = resume && window.EnPlacement.loadPartial() ? window.EnPlacement.loadPartial() : window.EnPlacement.startNewSession();
    bindPlacementChrome();
    placementNext();
  }

  function bindPlacementChrome() {
    $("placementDontKnow").onclick = function () {
      recordPlacementAnswer(currentPlacementQ, "partial", "dontknow");
    };
    $("placementPause").onclick = function () {
      window.EnPlacement.savePartial(placementSession);
      alert("Guardado. Puedes volver más tarde y seguiremos desde aquí (pestaña Inicio).");
      showView("welcome");
    };
  }

  function placementNext() {
    const maxQ = 20;
    const minQ = 12;
    const root = $("placementRoot");
    const prog = $("placementProgress");
    if (!placementSession) return;
    if (placementSession.answers.length >= minQ && window.EnPlacement.stableEnough(placementSession)) {
      endPlacement();
      return;
    }
    if (placementSession.answers.length >= maxQ) {
      endPlacement();
      return;
    }
    placementSession.nextCatHint = window.EnPlacement.categoryRotation(placementSession);
    const q = window.EnPlacement.pickNextQuestion(placementSession);
    if (!q) {
      endPlacement();
      return;
    }
    currentPlacementQ = q;
    prog.textContent = "Pregunta " + (placementSession.answers.length + 1) + " de hasta " + maxQ;
    window.EnPlacement.renderQuestion(root, q, placementSession.answers.length, maxQ, {
      onPick: function (idx) {
        const ok = window.EnPlacement.gradeMcq(q, idx);
        recordPlacementAnswer(q, ok ? "ok" : "fail", idx);
      },
      onOpen: function (val) {
        const ok = window.EnPlacement.gradeOpen(q, val);
        recordPlacementAnswer(q, ok ? "ok" : "fail", val);
      },
    });
  }

  function recordPlacementAnswer(q, kind, detail) {
    let score = 0;
    if (kind === "ok") score = 1;
    else if (kind === "partial") score = 0.3;
    else score = 0;

    if (q) {
      placementSession.askedIds.push(q.id);
      placementSession.answers.push({
        id: q.id,
        category: q.category,
        cefr_level: q.cefr_level,
        score: score,
        kind: kind,
        detail: detail,
      });
    }

    if (kind === "ok") {
      placementSession.streakC = (placementSession.streakC || 0) + 1;
      placementSession.streakW = 0;
      if (placementSession.streakC >= 2) {
        placementSession.currentIdx = Math.min(4, (placementSession.currentIdx || 0) + 1);
        placementSession.streakC = 0;
      }
    } else if (kind === "fail") {
      placementSession.streakW = (placementSession.streakW || 0) + 1;
      placementSession.streakC = 0;
      if (placementSession.streakW >= 2) {
        placementSession.currentIdx = Math.max(0, (placementSession.currentIdx || 0) - 1);
        placementSession.streakW = 0;
      }
    }

    const fb = document.createElement("p");
    fb.className = "muted";
    fb.textContent =
      kind === "partial"
        ? "Lo anotamos como 'no sé'. Seguimos."
        : "Respuesta registrada. Seguimos.";
    $("placementRoot").appendChild(fb);
    window.setTimeout(function () {
      placementNext();
    }, 450);
  }

  function endPlacement() {
    const result = window.EnPlacement.finalize(placementSession);
    showPlacementResult(result);
  }

  function showPlacementResult(result) {
    showView("placementResult");
    const root = $("placementResultRoot");
    while (root.firstChild) root.removeChild(root.firstChild);
    const h = document.createElement("p");
    h.className = "question-text";
    h.textContent = "Tu nivel estimado: " + result.estimated_cefr;
    root.appendChild(h);
    const p = document.createElement("p");
    p.className = "lead";
    p.textContent = humanRecommendation(result);
    root.appendChild(p);

    const bars = document.createElement("div");
    bars.className = "cat-bars";
    Object.keys(result.per_category || {}).forEach(function (cat) {
      const row = document.createElement("div");
      row.className = "cat-row";
      const lab = document.createElement("label");
      lab.textContent = cat + ": " + result.per_category[cat];
      const b = document.createElement("div");
      b.className = "bar";
      const inner = document.createElement("i");
      const w = (window.EnPlacement.cefrToNum(result.per_category[cat]) + 1) * 20;
      inner.style.width = Math.min(100, w) + "%";
      b.appendChild(inner);
      row.appendChild(lab);
      row.appendChild(b);
      bars.appendChild(row);
    });
    root.appendChild(bars);

    const row = document.createElement("div");
    row.className = "actions";
    const b1 = document.createElement("button");
    b1.className = "primary";
    b1.textContent = "Empezar con esta ruta";
    b1.addEventListener("click", function () {
      window.EnProgress.applyPlacementResult(result, "route");
      showView("game");
    });
    const b2 = document.createElement("button");
    b2.className = "secondary";
    b2.textContent = "Quiero elegir yo";
    b2.addEventListener("click", function () {
      window.EnProgress.applyPlacementResult(result, "choose");
      showView("tracks");
    });
    row.appendChild(b1);
    row.appendChild(b2);
    root.appendChild(row);
  }

  function humanRecommendation(result) {
    const weak = Object.keys(result.per_category || {}).filter(function (k) {
      return window.EnPlacement.cefrToNum(result.per_category[k]) <= 1;
    });
    if (weak.length) {
      return "Vimos que " + weak.join(", ") + " necesitan refuerzo. Te sugerimos el track relacionado en Progreso.";
    }
    return "Buen equilibrio entre categorías. Sigue con los tracks recomendados.";
  }

  function renderTracks() {
    const root = $("tracksRoot");
    while (root.firstChild) root.removeChild(root.firstChild);
    const st = window.EnProgress.load();
    window.EnTracks.TRACKS.forEach(function (t) {
      const card = document.createElement("div");
      card.className = "track-card" + (st.recommendedTrackIds.indexOf(t.id) >= 0 ? " recommended" : "");
      const head = document.createElement("div");
      head.className = "track-head";
      const h = document.createElement("h2");
      h.style.margin = "0";
      h.style.fontSize = "calc(1.05rem * var(--ui-scale))";
      h.textContent = t.title + (st.recommendedTrackIds.indexOf(t.id) >= 0 ? " · Recomendado para ti" : "");
      const meta = document.createElement("span");
      meta.className = "muted";
      meta.textContent = t.cefr;
      head.appendChild(h);
      head.appendChild(meta);
      card.appendChild(head);
      const maxU = st.maxUnlockedLevelByTrack[t.id] || 0;
      const cleared = maxU + 1;
      const pct = Math.min(100, Math.round((100 * cleared) / t.levelCount));
      const bar = document.createElement("div");
      bar.className = "bar";
      const i = document.createElement("i");
      i.style.width = pct + "%";
      bar.appendChild(i);
      card.appendChild(bar);
      const p = document.createElement("p");
      p.className = "muted";
      p.textContent = "Niveles desbloqueados hasta: " + (maxU + 1) + " / " + t.levelCount;
      card.appendChild(p);
      const b = document.createElement("button");
      b.className = "primary";
      b.textContent = "Practicar este track en el Juego";
      b.addEventListener("click", function () {
        $("gameTrack").value = t.id;
        $("gameTrack").dispatchEvent(new Event("change"));
        showView("game");
      });
      card.appendChild(b);
      root.appendChild(card);
    });
  }

  function itemsForTrackLevel(trackId, levelIndex) {
    return (window.EN_ALL_ITEMS || []).filter(function (it) {
      return it.trackId === trackId && Number(it.levelIndex) === Number(levelIndex);
    });
  }

  function randomItem(arr) {
    if (!arr.length) return null;
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function strictFromUI() {
    return (
      $("gameStrictAccents") &&
      $("gameStrictAccents").checked
    ) || (
      $("srsStrictAccents") &&
      $("srsStrictAccents").checked
    );
  }

  function initGameView() {
    const selT = $("gameTrack");
    const selL = $("gameLevel");
    while (selT.firstChild) selT.removeChild(selT.firstChild);
    window.EnTracks.TRACKS.forEach(function (t) {
      const o = document.createElement("option");
      o.value = t.id;
      o.textContent = t.title;
      selT.appendChild(o);
    });
    function refillLevels() {
      while (selL.firstChild) selL.removeChild(selL.firstChild);
      const tid = selT.value;
      const tm = window.EnTracks.trackById(tid);
      const st = window.EnProgress.load();
      const maxU = st.maxUnlockedLevelByTrack[tid] || 0;
      for (let i = 0; i <= maxU; i++) {
        const o = document.createElement("option");
        o.value = String(i);
        o.textContent = "Nivel " + (i + 1);
        selL.appendChild(o);
      }
    }
    selT.onchange = refillLevels;
    refillLevels();
    $("gameStats").textContent = "Racha global: " + (window.EnProgress.load().streak || 0);
    mountGameExercise();
    selL.onchange = mountGameExercise;
    selT.addEventListener("change", mountGameExercise);
  }

  function mountGameExercise() {
    const host = $("gameExercise");
    while (host.firstChild) host.removeChild(host.firstChild);
    const trackId = $("gameTrack").value;
    const levelIndex = Number($("gameLevel").value || 0);
    if (!window.EnProgress.canPlayTrackLevel(trackId, levelIndex)) {
      host.textContent = "Este nivel aún no está desbloqueado.";
      return;
    }
    const pool = itemsForTrackLevel(trackId, levelIndex);
    const item = randomItem(pool);
    if (!item) {
      host.textContent = "No hay ítems para este nivel todavía.";
      return;
    }
    const wrap = document.createElement("div");
    host.appendChild(wrap);
    const strict = $("gameStrictAccents") && $("gameStrictAccents").checked;
    const ex = window.EnExercise.mount(wrap, item, {
      strictAccents: strict,
      onMcq: function (ok) {
        afterGameGrade(ok, item, trackId, levelIndex);
      },
      onGraded: function (ok) {
        afterGameGrade(ok, item, trackId, levelIndex);
      },
    });
    const next = document.createElement("div");
    next.className = "actions";
    const bn = document.createElement("button");
    bn.className = "secondary";
    bn.textContent = "Siguiente pregunta";
    bn.addEventListener("click", function () {
      mountGameExercise();
    });
    next.appendChild(bn);
    host.appendChild(next);
    ex.focus();
  }

  function afterGameGrade(ok, item, trackId, levelIndex) {
    const vari = item.exerciseType || "default";
    window.EnSRS.record(trackId, item.id, vari, ok);
    window.EnProgress.noteAnswer(trackId, levelIndex, ok);
    $("gameStats").textContent = "Racha global: " + (window.EnProgress.load().streak || 0);
    if (!ok && item.contrastive_note) window.EnExercise.showContrastiveModal(item.contrastive_note);
  }

  function initSrsView() {
    const st = window.EnSRS.stats();
    const host = $("srsStats");
    while (host.firstChild) host.removeChild(host.firstChild);
    [["Vencidos", st.due, "due"], ["Aprendiendo", st.learning, ""], ["Jóvenes", st.young, ""], ["Dominados", st.mature, ""]].forEach(function (x) {
      const d = document.createElement("div");
      d.className = "stat";
      d.innerHTML = '<div class="muted">' + x[0] + '</div><div class="v">' + x[1] + "</div>";
      host.appendChild(d);
    });
    mountSrsExercise();
  }

  function allSrsCandidateKeys() {
    const set = new Set();
    (window.EN_ALL_ITEMS || []).forEach(function (it) {
      const k = window.EnSRS.makeKey(it.trackId, it.id, it.exerciseType || "default");
      set.add(k);
    });
    return set;
  }

  function mountSrsExercise() {
    const host = $("srsExercise");
    while (host.firstChild) host.removeChild(host.firstChild);
    const keysSet = allSrsCandidateKeys();
    const due = window.EnSRS.pickDue(keysSet, 12);
    let key = null;
    if (due.length) key = due[0].key;
    else {
      const news = window.EnSRS.pickNew(Array.from(keysSet), 1);
      key = news[0] || null;
    }
    if (!key) {
      host.textContent = "No hay ítems en el banco.";
      return;
    }
    const parts = key.split("|");
    const trackId = parts[0];
    const itemId = parts[1];
    const vari = parts.slice(2).join("|") || "default";
    const item = (window.EN_ALL_ITEMS || []).find(function (it) {
      return it.trackId === trackId && it.id === itemId && (it.exerciseType || "default") === vari;
    });
    if (!item) {
      host.textContent = "Ítem no encontrado.";
      return;
    }
    const wrap = document.createElement("div");
    host.appendChild(wrap);
    const strict = $("srsStrictAccents") && $("srsStrictAccents").checked;
    window.EnExercise.mount(wrap, item, {
      strictAccents: strict,
      onMcq: function (ok) {
        window.EnSRS.record(trackId, itemId, vari, ok);
        if (!ok && item.contrastive_note) window.EnExercise.showContrastiveModal(item.contrastive_note);
      },
      onGraded: function (ok) {
        window.EnSRS.record(trackId, itemId, vari, ok);
        if (!ok && item.contrastive_note) window.EnExercise.showContrastiveModal(item.contrastive_note);
      },
    });
    const row = document.createElement("div");
    row.className = "actions";
    const bn = document.createElement("button");
    bn.className = "secondary";
    bn.textContent = "Siguiente en repaso";
    bn.onclick = function () {
      mountSrsExercise();
    };
    row.appendChild(bn);
    host.appendChild(row);
  }

  function initFlashcards() {
    fcOrder = (window.EN_ALL_ITEMS || []).slice();
    fcIndex = 0;
    renderFc();
    const area = $("fcSwipeArea");
    let x0 = 0;
    area.addEventListener(
      "touchstart",
      function (e) {
        x0 = e.changedTouches[0].clientX;
      },
      { passive: true }
    );
    area.addEventListener("touchend", function (e) {
      const x1 = e.changedTouches[0].clientX;
      const d = x1 - x0;
      if (Math.abs(d) > 60) {
        if (d < 0) fcNext();
        else fcPrev();
      }
    });
  }

  function renderFc() {
    const it = fcOrder[fcIndex];
    $("fcFront").textContent = it ? it.prompt_es || it.context_en || "—" : "—";
    $("fcBack").textContent = it ? (it.correctDisplay || (it.accept && it.accept[0]) || "") : "—";
    $("fcInner").classList.remove("flipped");
  }

  function fcFlip() {
    $("fcInner").classList.toggle("flipped");
  }
  function fcNext() {
    fcIndex = (fcIndex + 1) % fcOrder.length;
    renderFc();
  }
  function fcPrev() {
    fcIndex = (fcIndex - 1 + fcOrder.length) % fcOrder.length;
    renderFc();
  }
  function fcRand() {
    fcIndex = Math.floor(Math.random() * fcOrder.length);
    renderFc();
  }

  function renderList() {
    const q = ($("listSearch").value || "").toLowerCase();
    const root = $("listRoot");
    while (root.firstChild) root.removeChild(root.firstChild);
    const items = (window.EN_ALL_ITEMS || []).filter(function (it) {
      if (!q) return true;
      const blob = (it.prompt_es + " " + (it.context_en || "") + " " + (it.accept ? it.accept.join(" ") : "")).toLowerCase();
      return blob.indexOf(q) >= 0;
    });
    items.slice(0, 200).forEach(function (it) {
      const row = document.createElement("div");
      row.className = "panel";
      row.style.marginBottom = "10px";
      row.innerHTML =
        "<p><strong>" +
        window.EnExercise.esc(it.prompt_es) +
        "</strong><br/><span class='muted'>" +
        window.EnExercise.esc((it.accept && it.accept[0]) || "") +
        "</span></p>";
      root.appendChild(row);
    });
  }

  function renderReference() {
    const tb = $("refTable");
    while (tb.firstChild) tb.removeChild(tb.firstChild);
    const rows = [
      ["Hace 3 años que vivo aquí", "I have lived here for three years. / I have been living here for three years.", "No uses I live here since… sin have been."],
      ["Tengo hambre", "I am hungry.", "En inglés se usa el verbo be, no have."],
      ["Tengo 20 años", "I am twenty.", "I have twenty es incorrecto."],
      ["Hace frío", "It is cold.", "Sujeto impersonal it + be."],
      ["Tengo frío", "I am cold.", "También con be para estados."],
      ["Estoy aburrido / Soy aburrido", "I'm bored / I'm boring.", "-ed: cómo te sientes; -ing: cómo es algo."],
      ["No veo a nadie", "I don't see anybody.", "Sin doble negación en inglés estándar."],
      ["¿Hablas inglés?", "Do you speak English?", "Auxiliar do en preguntas con verbos simples."],
    ];
    const hr = document.createElement("tr");
    hr.innerHTML = "<th>Español (idea)</th><th>Inglés natural</th><th>Nota</th>";
    tb.appendChild(hr);
    rows.forEach(function (r) {
      const tr = document.createElement("tr");
      tr.innerHTML = "<td>" + r[0] + "</td><td>" + r[1] + "</td><td>" + r[2] + "</td>";
      tb.appendChild(tr);
    });
  }

  function renderProgress() {
    const root = $("progressRoot");
    while (root.firstChild) root.removeChild(root.firstChild);
    const st = window.EnProgress.load();
    window.EnTracks.TRACKS.forEach(function (t) {
      const card = document.createElement("div");
      card.className = "panel";
      const maxU = st.maxUnlockedLevelByTrack[t.id] || 0;
      const pct = Math.round((100 * (maxU + 1)) / t.levelCount);
      card.innerHTML =
        "<h2 style='margin-top:0'>" +
        t.title +
        "</h2><div class='bar'><i style='width:" +
        pct +
        "%'></i></div><p class='muted'>Desbloqueado hasta nivel " +
        (maxU + 1) +
        " de " +
        t.levelCount +
        "</p>";
      root.appendChild(card);
    });
  }

  function renderMyLevel() {
    const root = $("myLevelRoot");
    while (root.firstChild) root.removeChild(root.firstChild);
    const res = window.EnStorage.getJSON(K.PLACEMENT_RESULT, null);
    if (!res) {
      root.innerHTML = "<p class='lead'>Aún no hay resultado de prueba. Puedes hacerla desde Inicio o Configuración.</p>";
      return;
    }
    root.innerHTML =
      "<p class='question-text'>Tu último nivel estimado: " +
      res.estimated_cefr +
      "</p><p class='muted'>Fecha: " +
      new Date(res.taken_at).toLocaleString() +
      "</p>";
    const b = document.createElement("button");
    b.className = "secondary";
    b.textContent = "Volver a tomar la prueba";
    b.onclick = function () {
      window.EnStorage.set(K.PLACEMENT_SEEN, "0");
      startPlacement(false);
    };
    root.appendChild(b);
  }

  function initExamView() {
    $("examStart").onclick = function () {
      const useTimer = $("examTimerToggle").checked;
      runExam(useTimer);
    };
  }

  function runExam(useTimer) {
    const root = $("examRoot");
    root.classList.remove("hidden");
    while (root.firstChild) root.removeChild(root.firstChild);
    const res = window.EnStorage.getJSON(K.PLACEMENT_RESULT, null);
    const cap = res ? window.EnTracks.cefrIndex(res.estimated_cefr) : 2;
    const pool = (window.EN_ALL_ITEMS || []).filter(function (it) {
      return window.EnTracks.cefrIndex(it.cefr) <= cap + 1;
    });
    const picked = [];
    const copy = pool.slice();
    for (let i = 0; i < 25 && copy.length; i++) {
      const j = Math.floor(Math.random() * copy.length);
      picked.push(copy.splice(j, 1)[0]);
    }
    let score = 0;
    let idx = 0;
    const timerEl = $("examTimerDisplay");
    let deadline = 0;
    if (useTimer) {
      timerEl.classList.remove("hidden");
      deadline = Date.now() + 30 * 60 * 1000;
    } else timerEl.classList.add("hidden");

    function tick() {
      if (useTimer) {
        const left = Math.max(0, deadline - Date.now());
        const m = Math.floor(left / 60000);
        const s = Math.floor((left % 60000) / 1000);
        timerEl.textContent = "Tiempo restante: " + m + " min " + s + " s";
        if (left <= 0) finish();
      }
    }
    const iv = useTimer ? window.setInterval(tick, 1000) : null;
    tick();

    function showOne() {
      while (root.firstChild) root.removeChild(root.firstChild);
      if (idx >= picked.length) return finish();
      const item = picked[idx];
      const h = document.createElement("p");
      h.className = "muted";
      h.textContent = "Pregunta " + (idx + 1) + " de 25";
      root.appendChild(h);
      const wrap = document.createElement("div");
      root.appendChild(wrap);
      window.EnExercise.mount(wrap, item, {
        onMcq: function (ok) {
          if (ok) score++;
          idx++;
          showOne();
        },
        onGraded: function (ok) {
          if (ok) score++;
          idx++;
          showOne();
        },
      });
    }

    function finish() {
      if (iv) clearInterval(iv);
      while (root.firstChild) root.removeChild(root.firstChild);
      root.innerHTML = "<p class='question-text'>Examen terminado</p><p class='lead'>Aciertos: " + score + " de " + picked.length + "</p>";
    }
    showOne();
  }

  function wireNav() {
    document.querySelectorAll(".nav-btns button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        showView(btn.getAttribute("data-mode"));
      });
    });
  }

  function wireMisc() {
    $("fcFlip").addEventListener("click", fcFlip);
    $("fcNext").addEventListener("click", fcNext);
    $("fcPrev").addEventListener("click", fcPrev);
    $("fcRand").addEventListener("click", fcRand);
    $("listSearch").addEventListener("input", renderList);
    $("btnExport").addEventListener("click", function () {
      const blob = new Blob([window.EnProgress.exportUnified()], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "en-game-backup.json";
      a.click();
    });
    $("importFile").addEventListener("change", function (ev) {
      const f = ev.target.files && ev.target.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = function () {
        const res = window.EnProgress.importUnified(String(r.result || ""), "merge");
        alert(res.ok ? "Importación lista." : "No se pudo importar.");
        ev.target.value = "";
      };
      r.readAsText(f);
    });
    $("setStrictAccents").addEventListener("change", function () {
      window.EnStorage.set(K.STRICT_ACCENTS, $("setStrictAccents").checked ? "1" : "0");
      if ($("gameStrictAccents")) $("gameStrictAccents").checked = $("setStrictAccents").checked;
      if ($("srsStrictAccents")) $("srsStrictAccents").checked = $("setStrictAccents").checked;
    });
    $("btnRetakePlacement").addEventListener("click", function () {
      startPlacement(false);
    });
  }

  function init() {
    window.EnTheme.init();
    window.EnSpeech.ensureVoices(function () {});
    const sa = window.EnStorage.get(window.EnStorage.KEYS.STRICT_ACCENTS, "0") === "1";
    ["gameStrictAccents", "srsStrictAccents", "setStrictAccents"].forEach(function (id) {
      const el = $(id);
      if (el) el.checked = sa;
    });
    ["gameStrictAccents", "srsStrictAccents"].forEach(function (id) {
      const el = $(id);
      if (el)
        el.addEventListener("change", function () {
          window.EnStorage.set(window.EnStorage.KEYS.STRICT_ACCENTS, el.checked ? "1" : "0");
          if ($("setStrictAccents")) $("setStrictAccents").checked = el.checked;
        });
    });
    wireNav();
    wireMisc();
    const partial = window.EnPlacement.loadPartial();
    if (partial && partial.askedIds) {
      if (window.confirm("Hay una prueba pausada. ¿Continuarla?")) {
        placementSession = partial;
        showView("placement");
        bindPlacementChrome();
        placementNext();
        return;
      }
    }
    initWelcome();
    showView("welcome");
  }

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("./service-worker.js").catch(function () {});
    });
  }

  init();
})();
