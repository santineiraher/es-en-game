/**
 * Motor de render de ejercicios (DOM).
 */
(function (global) {
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function clear(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
  }

  function showContrastiveModal(note) {
    const host = document.getElementById("modalHost");
    if (!host || !note) return;
    clear(host);
    const back = document.createElement("div");
    back.className = "modal-backdrop";
    back.setAttribute("role", "presentation");
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "contrastTitle");
    modal.innerHTML =
      "<h2 id=\"contrastTitle\">Ojo aquí</h2><p class=\"lead\">" +
      esc(note) +
      "</p><div class=\"actions\"><button type=\"button\" class=\"primary\" id=\"contrastClose\">Cerrar</button></div>";
    back.appendChild(modal);
    host.appendChild(back);
    function close() {
      clear(host);
    }
    modal.querySelector("#contrastClose").addEventListener("click", close);
    back.addEventListener("click", function (ev) {
      if (ev.target === back) close();
    });
  }

  function mount(container, item, opts) {
    opts = opts || {};
    clear(container);
    const strict = !!opts.strictAccents;

    const head = document.createElement("p");
    head.className = "question-text";
    head.textContent = item.prompt_es || "Ejercicio";
    container.appendChild(head);

    if (item.context_en) {
      const p = document.createElement("p");
      p.className = "lead";
      p.innerHTML = "<span class=\"muted\">Contexto (EN):</span> " + esc(item.context_en);
      container.appendChild(p);
    }

    const type = item.exerciseType || "mcq";
    let feedback = null;
    let input = null;
    let getOpenValue = function () {
      return "";
    };
    let checkFn = function () {
      return { ok: false, msg: "Tipo no soportado." };
    };

    if (type === "mcq" || type === "spot_error" || type === "match") {
      const grid = document.createElement("div");
      grid.className = "mcq-grid";
      const choices = item.choices || [];
      choices.forEach(function (ch, idx) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "secondary";
        b.textContent = ch;
        b.addEventListener("click", function () {
          const ok = idx === (item.correctIndex || 0);
          let line = container.querySelector(".feedback.mcq-inline");
          if (!line) {
            line = document.createElement("p");
            line.className = "feedback mcq-inline";
            container.appendChild(line);
          }
          line.textContent = ok ? "Correcto." : "Incorrecto.";
          line.className = "feedback mcq-inline " + (ok ? "ok" : "bad");
          if (opts.onMcq) opts.onMcq(ok, item, idx);
        });
        grid.appendChild(b);
      });
      container.appendChild(grid);
      checkFn = function () {
        return { ok: false, msg: "Elige una opción." };
      };
    } else if (
      type === "cloze" ||
      type === "translate_es_en" ||
      type === "translate_en_es" ||
      type === "transform" ||
      type === "conjugate"
    ) {
      if (item.blankSentence) {
        const p = document.createElement("p");
        p.className = "lead";
        p.innerHTML = esc(item.blankSentence).replace(/___+/g, "<strong>____</strong>");
        container.appendChild(p);
      }
      const lab = document.createElement("label");
      lab.className = "field";
      lab.setAttribute("for", "openAns");
      lab.textContent = item.prompt_en ? "Tu respuesta" : "Tu respuesta";
      input = document.createElement("input");
      input.type = "text";
      input.id = "openAns";
      input.setAttribute("autocomplete", "off");
      input.setAttribute("enterkeyhint", "done");
      lab.appendChild(input);
      container.appendChild(lab);
      getOpenValue = function () {
        return input ? input.value : "";
      };
      checkFn = function () {
        const val = getOpenValue();
        const accept = Array.isArray(item.accept) ? item.accept.slice() : [];
        if (item.correctDisplay) accept.push(item.correctDisplay);
        const ok = global.EnNormalize.matchesAny(val, accept, { strictAccents: strict });
        return {
          ok,
          msg: ok ? "Correcto." : "Incorrecto. La respuesta puede ser: " + (item.correctDisplay || accept[0] || ""),
        };
      };
    } else if (type === "listen_type") {
      const row = document.createElement("div");
      row.className = "actions";
      const listen = document.createElement("button");
      listen.type = "button";
      listen.className = "secondary";
      listen.textContent = "🔊 Escuchar";
      listen.addEventListener("click", function () {
        global.EnSpeech.speak(item.audioText || item.context_en || "", { lang: "en-US" });
      });
      row.appendChild(listen);
      container.appendChild(row);
      const lab = document.createElement("label");
      lab.className = "field";
      lab.setAttribute("for", "openAns");
      lab.textContent = "Escribe lo que oyes";
      input = document.createElement("input");
      input.type = "text";
      input.id = "openAns";
      lab.appendChild(input);
      container.appendChild(lab);
      getOpenValue = function () {
        return input ? input.value : "";
      };
      checkFn = function () {
        const val = getOpenValue();
        const accept = Array.isArray(item.accept) ? item.accept.slice() : [];
        const ok = global.EnNormalize.matchesAny(val, accept, { strictAccents: strict });
        return {
          ok,
          msg: ok ? "Correcto." : "Incorrecto. Se esperaba algo como: " + (item.correctDisplay || accept[0] || ""),
        };
      };
    } else if (type === "word_order") {
      const tokens = (item.tokens || []).slice();
      const chosen = [];
      const poolEl = document.createElement("div");
      poolEl.className = "word-order-list";
      const chosenEl = document.createElement("div");
      chosenEl.className = "panel";
      chosenEl.innerHTML = "<p class=\"muted\">Tu frase (toca las palabras en orden):</p>";
      const chosenInner = document.createElement("div");
      chosenInner.className = "word-order-list";
      chosenEl.appendChild(chosenInner);

      function renderPool() {
        clear(poolEl);
        tokens.forEach(function (tok, idx) {
          const b = document.createElement("button");
          b.type = "button";
          b.className = "secondary";
          b.textContent = tok;
          b.addEventListener("click", function () {
            chosen.push(tok);
            tokens.splice(idx, 1);
            renderPool();
            renderChosen();
          });
          poolEl.appendChild(b);
        });
      }
      function renderChosen() {
        clear(chosenInner);
        chosen.forEach(function (tok, idx) {
          const b = document.createElement("button");
          b.type = "button";
          b.className = "primary";
          b.textContent = tok + " (" + (idx + 1) + ")";
          b.addEventListener("click", function () {
            tokens.push(tok);
            chosen.splice(idx, 1);
            renderPool();
            renderChosen();
          });
          chosenInner.appendChild(b);
        });
      }
      renderPool();
      container.appendChild(poolEl);
      container.appendChild(chosenEl);
      const row = document.createElement("div");
      row.className = "actions";
      const reset = document.createElement("button");
      reset.type = "button";
      reset.className = "ghost";
      reset.textContent = "Reiniciar orden";
      reset.addEventListener("click", function () {
        while (chosen.length) tokens.push(chosen.pop());
        renderPool();
        renderChosen();
      });
      row.appendChild(reset);
      container.appendChild(row);
      getOpenValue = function () {
        return chosen.join(" ");
      };
      checkFn = function () {
        const val = getOpenValue();
        const accept = Array.isArray(item.accept) ? item.accept.slice() : [];
        const ok = global.EnNormalize.matchesAny(val, accept, { strictAccents: strict });
        return {
          ok,
          msg: ok ? "Correcto." : "Incorrecto. Prueba otra construcción. Modelo: " + (item.correctDisplay || accept[0] || ""),
        };
      };
    }

    const actions = document.createElement("div");
    actions.className = "actions";
    const btnHint = document.createElement("button");
    btnHint.type = "button";
    btnHint.className = "ghost";
    btnHint.textContent = "Pista";
    btnHint.addEventListener("click", function () {
      alert(item.hint || "Piensa en el tiempo verbal y la estructura típica en inglés.");
    });
    const btnCheck = document.createElement("button");
    btnCheck.type = "button";
    btnCheck.className = "primary";
    btnCheck.textContent = "Comprobar";
    btnCheck.addEventListener("click", function () {
      const r = checkFn();
      if (!feedback) {
        feedback = document.createElement("div");
        feedback.className = "feedback";
        container.appendChild(feedback);
      }
      feedback.textContent = r.msg;
      feedback.className = "feedback " + (r.ok ? "ok" : "bad");
      if (!r.ok && item.contrastive_note) showContrastiveModal(item.contrastive_note);
      if (opts.onGraded) opts.onGraded(r.ok, item, getOpenValue());
    });
    actions.appendChild(btnHint);
    if (type !== "mcq" && type !== "spot_error" && type !== "match") actions.appendChild(btnCheck);
    container.appendChild(actions);

    return {
      focus: function () {
        if (input) input.focus();
      },
      destroy: function () {
        clear(container);
      },
    };
  }

  global.EnExercise = { mount, showContrastiveModal, esc };
})(typeof window !== "undefined" ? window : globalThis);
