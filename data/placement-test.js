(function (global) {
  const CATS = ["tense", "phrasal", "idiom", "false_friend", "prep", "modal"];
  const TYPES = ["mcq", "cloze", "spot_error", "translate_es_en"];
  const CEFR = ["A1", "A2", "B1", "B2", "C1"];
  const bank = [];
  for (let i = 0; i < 56; i++) {
    const cefr_level = CEFR[i % 5];
    const category = CATS[i % CATS.length];
    const type = TYPES[i % TYPES.length];
    const base = {
      id: "pl_" + i,
      cefr_level: cefr_level,
      category: category,
      type: type,
      stem_es: "Pregunta " + (i + 1) + " · Categoría: " + category + " · Nivel: " + cefr_level,
      partialCredit: true,
    };
    if (type === "mcq" || type === "spot_error") {
      bank.push(
        Object.assign({}, base, {
          options: ["Opción A (revisa gramática)", "Opción B (revisa léxico)", "Opción C (revisa tiempo verbal)", "Opción D (revisa preposición)"],
          correctIndex: i % 4,
        })
      );
    } else if (type === "cloze") {
      bank.push(
        Object.assign({}, base, {
          stem_en: "I have ___ in Bogotá for five years.",
          accept: ["lived", "been living", "been living in", "lived in"],
          correctDisplay: "lived / been living",
        })
      );
    } else {
      bank.push(
        Object.assign({}, base, {
          stem_en: "Traduce al inglés: 'Si hubiera sabido, no habría venido.'",
          accept: [
            "If I had known, I wouldn't have come",
            "If I had known, I would not have come",
            "If I'd known, I wouldn't have come",
          ],
          correctDisplay: "If I had known, I wouldn't have come.",
        })
      );
    }
  }
  global.EN_PLACEMENT_BANK = bank;
})(typeof window !== "undefined" ? window : globalThis);
