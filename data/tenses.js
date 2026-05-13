/* eslint-disable */
(function (global) {
  const TRACK_LEVELS = { t_present: 10, t_past: 10, t_future: 8, t_perfect: 10, t_passive: 6, t_modals: 8 };
  const note = "En inglés casi siempre necesitas sujeto explícito (I/you/he…) y auxiliar do/does en negaciones y preguntas.";
  const T = [
    ["mcq", "Completa: I ___ from Colombia.", ["am", "is", "are", "be"], 0, "A1", "tense"],
    ["mcq", "She ___ English twice a week.", ["study", "studies", "studying", "is study"], 1, "A1", "tense"],
    ["tr", "Traduce: Ellos no viven aquí.", ["They don't live here", "They do not live here"], "A1", "tense"],
    ["tr", "Traduce: Estoy aprendiendo inglés.", ["I am learning English", "I'm learning English"], "A2", "tense"],
    ["mcq", "I have lived here ___ 2019.", ["since", "for", "from", "in"], 0, "B1", "tense"],
    ["mcq", "Yesterday we ___ to the coast.", ["go", "went", "gone", "going"], 1, "A1", "tense"],
    ["tr", "Traduce: No lo sabía.", ["I didn't know", "I did not know"], "A2", "tense"],
    ["mcq", "If it rains, we ___ go.", ["won't", "don't", "didn't", "aren't"], 0, "B1", "conditional"],
    ["mcq", "The letter ___ written in English.", ["is", "was", "were", "been"], 1, "B1", "passive"],
    ["mcq", "You ___ see a doctor.", ["should", "can", "will", "may"], 0, "A2", "modal"],
  ];
  const items = [];
  let id = 0;
  Object.keys(TRACK_LEVELS).forEach(function (trackId) {
    const lv = TRACK_LEVELS[trackId];
    for (let L = 0; L < lv; L++) {
      for (let k = 0; k < 4; k++) {
        const r = T[(L * 4 + k) % T.length];
        const iid = trackId + "_n" + id++;
        if (r[0] === "mcq") {
          items.push({
            id: iid,
            trackId: trackId,
            levelIndex: L,
            cefr: r[5],
            category: r[6] || "tense",
            exerciseType: "mcq",
            prompt_es: r[1],
            choices: r[2],
            correctIndex: r[3],
            accept: [r[2][r[3]]],
            correctDisplay: r[2][r[3]],
            hint: "Piensa en el tiempo y la concordancia.",
            contrastive_note: note,
            tags: ["tense"],
            register: "neutral",
          });
        } else {
          items.push({
            id: iid,
            trackId: trackId,
            levelIndex: L,
            cefr: r[3],
            category: r[4] || "tense",
            exerciseType: "translate_es_en",
            prompt_es: r[1],
            accept: r[2],
            correctDisplay: r[2][0],
            hint: "Orden S + V + O suele funcionar.",
            contrastive_note: note,
            tags: ["translate"],
            register: "neutral",
          });
        }
      }
    }
  });
  const C1_MIX = [
    {
      prompt_es: "Inversión condicional: elige la frase natural.",
      choices: [
        "Had I known, I would have acted sooner.",
        "If I would know, I had acted sooner.",
        "If I knew, I would acted sooner.",
        "Would I know, I had acted sooner.",
      ],
      correctIndex: 0,
      accept: ["Had I known, I would have acted sooner."],
      correctDisplay: "Had I known, I would have acted sooner.",
      hint: "Had + sujeto + participio + would have + V3.",
    },
    {
      prompt_es: "Inversión con negativa enfática (nunca había visto…).",
      choices: [
        "Never had I seen such a crowd.",
        "Never I had seen such a crowd.",
        "I never had seen such a crowd.",
        "Never I have seen such a crowd.",
      ],
      correctIndex: 0,
      accept: ["Never had I seen such a crowd."],
      correctDisplay: "Never had I seen such a crowd.",
      hint: "Never + auxiliar + sujeto + participio.",
    },
    {
      prompt_es: "Inversión con 'Little' (casi no…).",
      choices: [
        "Little did she know about the surprise.",
        "Little she knew about the surprise.",
        "She little knew about the surprise.",
        "Little knew she about the surprise.",
      ],
      correctIndex: 0,
      accept: ["Little did she know about the surprise."],
      correctDisplay: "Little did she know about the surprise.",
      hint: "Little + did + sujeto + verbo base.",
    },
    {
      prompt_es: "Cleft sentence: énfasis en el sujeto.",
      choices: [
        "It was Maria who fixed the bug.",
        "It was Maria which fixed the bug.",
        "Was it Maria who fixed the bug?",
        "There was Maria who fixed the bug.",
      ],
      correctIndex: 0,
      accept: ["It was Maria who fixed the bug.", "It was Maria that fixed the bug."],
      correctDisplay: "It was Maria who fixed the bug.",
      hint: "It + be + foco + who/that + resto.",
    },
    {
      prompt_es: "Mixed conditional (pasado → presente).",
      choices: [
        "If I had studied harder, I would be more confident now.",
        "If I studied harder, I would be more confident now.",
        "If I had studied harder, I will be more confident now.",
        "If I would study harder, I would be more confident now.",
      ],
      correctIndex: 0,
      accept: ["If I had studied harder, I would be more confident now."],
      correctDisplay: "If I had studied harder, I would be more confident now.",
      hint: "If + past perfect, + would + base (resultado en presente).",
    },
    {
      prompt_es: "Modal perfect (deducción pasada).",
      choices: [
        "They must have forgotten the meeting.",
        "They must forgot the meeting.",
        "They must had forgotten the meeting.",
        "They must forget the meeting.",
      ],
      correctIndex: 0,
      accept: ["They must have forgotten the meeting."],
      correctDisplay: "They must have forgotten the meeting.",
      hint: "Must + have + participio para deducción sobre el pasado.",
    },
    {
      prompt_es: "Reported speech (backshift coherente).",
      choices: [
        'She said she would call us later.',
        "She said she will call us later.",
        'She said she calls us later.',
        "She said she would called us later.",
      ],
      correctIndex: 0,
      accept: ["She said she would call us later."],
      correctDisplay: "She said she would call us later.",
      hint: "Con said en pasado, will suele pasar a would.",
    },
    {
      prompt_es: "Pasiva con dos objetos (estilo formal).",
      choices: [
        "The interns were given clear instructions.",
        "The interns were gave clear instructions.",
        "The interns were given clearly instructions.",
        "The interns were being given clear instructions by always.",
      ],
      correctIndex: 0,
      accept: ["The interns were given clear instructions."],
      correctDisplay: "The interns were given clear instructions.",
      hint: "Sujeto + was/were + participio (+ agente con by si hace falta).",
    },
    {
      prompt_es: "Subjunctive formal (sugiero que…).",
      choices: [
        "I suggest that he leave early.",
        "I suggest that he leaves early.",
        "I suggest him to leave early.",
        "I suggest that he left early.",
      ],
      correctIndex: 0,
      accept: ["I suggest that he leave early.", "I suggest that he should leave early."],
      correctDisplay: "I suggest that he leave early.",
      hint: "En sugerencias formales, subjuntivo sin -s: (that) + he leave.",
    },
    {
      prompt_es: "So + adjetivo + inversión (énfasis).",
      choices: [
        "So tired was she that she fell asleep on the bus.",
        "So tired she was that she fell asleep on the bus.",
        "She was so tired that she fell asleep on the bus.",
        "So tired was she that she fell asleep in the bus.",
      ],
      correctIndex: 0,
      accept: ["So tired was she that she fell asleep on the bus."],
      correctDisplay: "So tired was she that she fell asleep on the bus.",
      hint: "So + adjetivo + verbo auxiliar + sujeto + that…",
    },
  ];
  C1_MIX.forEach(function (row, ix) {
    items.push({
      id: "t_exam_c1_" + id++,
      trackId: "t_exam_c1",
      levelIndex: ix % 5,
      cefr: "C1",
      category: "tense",
      exerciseType: "mcq",
      prompt_es: row.prompt_es,
      choices: row.choices,
      correctIndex: row.correctIndex,
      accept: row.accept,
      correctDisplay: row.correctDisplay,
      hint: row.hint,
      tags: ["C1", "exam"],
      register: "neutral",
    });
  });
  items.push({
    id: "t_exam_wo_1",
    trackId: "t_exam_c1",
    levelIndex: 0,
    cefr: "C1",
    category: "tense",
    exerciseType: "word_order",
    prompt_es: "Ordena las palabras (usa los botones en orden).",
    tokens: ["never", "have", "I", "seen", "this"],
    accept: ["I have never seen this", "I've never seen this"],
    correctDisplay: "I have never seen this",
    hint: "Sujeto + have + never + participio.",
    tags: ["word_order"],
    register: "neutral",
  });
  items.push({
    id: "t_exam_wo_2",
    trackId: "t_exam_c1",
    levelIndex: 1,
    cefr: "C1",
    category: "tense",
    exerciseType: "word_order",
    prompt_es: "Ordena: inversión con rarely.",
    tokens: ["Rarely", "does", "she", "complain"],
    accept: ["Rarely does she complain"],
    correctDisplay: "Rarely does she complain",
    hint: "Rarely + auxiliar + sujeto + verbo base.",
    tags: ["word_order"],
    register: "neutral",
  });
  global.EN_DATA_TENSES = items;
})(typeof window !== "undefined" ? window : globalThis);
