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
  for (let L = 0; L < 5; L++) {
    for (let k = 0; k < 14; k++) {
      items.push({
        id: "t_exam_c1_" + id++,
        trackId: "t_exam_c1",
        levelIndex: L,
        cefr: "C1",
        category: "tense",
        exerciseType: "mcq",
        prompt_es: "Elige la opción más natural (estilo avanzado).",
        choices: [
          "Had I known, I would have acted sooner.",
          "If I would know, I had acted sooner.",
          "If I knew, I would acted sooner.",
          "Would I know, I had acted sooner.",
        ],
        correctIndex: 0,
        accept: ["Had I known, I would have acted sooner."],
        correctDisplay: "Had I known, I would have acted sooner.",
        hint: "Inversión con Had + sujeto + participio en condicionales.",
        tags: ["C1", "inversion"],
        register: "neutral",
      });
    }
  }
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
