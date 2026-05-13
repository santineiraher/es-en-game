(function (global) {
  const V = [
    ["be", "am", "was", "been"],
    ["have", "have", "had", "had"],
    ["do", "do", "did", "done"],
    ["go", "go", "went", "gone"],
    ["see", "see", "saw", "seen"],
    ["come", "come", "came", "come"],
    ["get", "get", "got", "gotten"],
    ["make", "make", "made", "made"],
    ["know", "know", "knew", "known"],
    ["think", "think", "thought", "thought"],
    ["take", "take", "took", "taken"],
    ["give", "give", "gave", "given"],
    ["find", "find", "found", "found"],
    ["tell", "tell", "told", "told"],
    ["leave", "leave", "left", "left"],
    ["feel", "feel", "felt", "felt"],
    ["bring", "bring", "brought", "brought"],
    ["begin", "begin", "began", "begun"],
    ["keep", "keep", "kept", "kept"],
    ["let", "let", "let", "let"],
    ["mean", "mean", "meant", "meant"],
    ["set", "set", "set", "set"],
    ["meet", "meet", "met", "met"],
    ["run", "run", "ran", "run"],
    ["pay", "pay", "paid", "paid"],
    ["sit", "sit", "sat", "sat"],
    ["stand", "stand", "stood", "stood"],
    ["lose", "lose", "lost", "lost"],
    ["win", "win", "won", "won"],
    ["send", "send", "sent", "sent"],
    ["build", "build", "built", "built"],
    ["spend", "spend", "spent", "spent"],
    ["cut", "cut", "cut", "cut"],
    ["put", "put", "put", "put"],
    ["read", "read", "read", "read"],
    ["lead", "lead", "led", "led"],
    ["sell", "sell", "sold", "sold"],
    ["hold", "hold", "held", "held"],
    ["write", "write", "wrote", "written"],
    ["break", "break", "broke", "broken"],
    ["choose", "choose", "chose", "chosen"],
    ["speak", "speak", "spoke", "spoken"],
    ["wake", "wake", "woke", "woken"],
    ["wear", "wear", "wore", "worn"],
    ["understand", "understand", "understood", "understood"],
    ["draw", "draw", "drew", "drawn"],
    ["grow", "grow", "grew", "grown"],
    ["throw", "throw", "threw", "thrown"],
    ["fly", "fly", "flew", "flown"],
    ["swim", "swim", "swam", "swum"],
    ["drink", "drink", "drank", "drunk"],
    ["sing", "sing", "sang", "sung"],
    ["drive", "drive", "drove", "driven"],
    ["ride", "ride", "rode", "ridden"],
    ["fall", "fall", "fell", "fallen"],
    ["eat", "eat", "ate", "eaten"],
    ["forget", "forget", "forgot", "forgotten"],
    ["shake", "shake", "shook", "shaken"],
    ["steal", "steal", "stole", "stolen"],
    ["freeze", "freeze", "froze", "frozen"],
  ];
  const items = [];
  let n = 0;
  V.forEach(function (row, idx) {
    const inf = row[0];
    const p1 = row[1];
    const p2 = row[2];
    const p3 = row[3];
    const L = idx % 5;
    items.push({
      id: "irr_v2_" + n++,
      trackId: "t_irregular",
      levelIndex: L,
      cefr: "A2",
      category: "tense",
      exerciseType: "mcq",
      prompt_es: "Pasado simple (V2) de " + inf + ": Yesterday I ___ early.",
      choices: [p2, p1, p3, inf + "ed"],
      correctIndex: 0,
      accept: [p2],
      correctDisplay: p2,
      hint: "Verbo irregular.",
      contrastive_note: "Muchos verbos comunes no llevan -ed regular.",
      tags: ["irregular"],
      register: "neutral",
    });
    items.push({
      id: "irr_v3_" + n++,
      trackId: "t_irregular",
      levelIndex: L,
      cefr: "B1",
      category: "tense",
      exerciseType: "cloze",
      prompt_es: "Participio (V3) de " + inf + " (present perfect):",
      blankSentence: "I have ___ already.",
      accept: [p3, p3 === "gotten" ? "got" : p3],
      correctDisplay: p3,
      hint: "Have/has + V3.",
      tags: ["irregular"],
      register: "neutral",
    });
    items.push({
      id: "irr_tr_" + n++,
      trackId: "t_irregular",
      levelIndex: L,
      cefr: "A2",
      category: "tense",
      exerciseType: "translate_es_en",
      prompt_es:
        "Escribe en inglés una oración corta en presente simple con sujeto **I** y el verbo **" +
        inf +
        "**, con idea de algo habitual (por ejemplo con *every day* o *usually*). " +
        "Ejemplo de estructura: I + forma del presente + complemento.",
      accept: ["I " + p1, "I " + inf],
      correctDisplay: "I " + p1,
      hint: "I + forma del presente.",
      tags: ["irregular"],
      register: "neutral",
    });
  });
  global.EN_DATA_IRREGULAR = items;
})(typeof window !== "undefined" ? window : globalThis);
