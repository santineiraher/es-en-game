/**
 * Metadatos de tracks (orden, niveles, foco CEFR).
 * Total niveles: 10+10+8+10+6+8+5+10+8+5+5 = 85
 */
(function (global) {
  const TRACKS = [
    { id: "t_present", order: 1, title: "Track 1 · Presente y futuro cercano", levelCount: 10, cefr: "A1–B1" },
    { id: "t_past", order: 2, title: "Track 2 · Pasado", levelCount: 10, cefr: "A1–B2" },
    { id: "t_future", order: 3, title: "Track 3 · Futuro y condicional básico", levelCount: 8, cefr: "A2–B1" },
    { id: "t_perfect", order: 4, title: "Track 4 · Tiempos perfectos", levelCount: 10, cefr: "A2–C1" },
    { id: "t_passive", order: 5, title: "Track 5 · Pasiva y estilo indirecto", levelCount: 6, cefr: "B1–C1" },
    { id: "t_modals", order: 6, title: "Track 6 · Modales", levelCount: 8, cefr: "A2–C1" },
    { id: "t_irregular", order: 7, title: "Track 7 · Verbos irregulares", levelCount: 5, cefr: "A1–B2" },
    { id: "t_phrasal", order: 8, title: "Track 8 · Phrasal verbs", levelCount: 10, cefr: "A2–C1" },
    { id: "t_idiom", order: 9, title: "Track 9 · Modismos", levelCount: 8, cefr: "B1–C1" },
    { id: "t_false_friend", order: 10, title: "Track 10 · Falsos amigos", levelCount: 5, cefr: "A2–B2" },
    { id: "t_exam_c1", order: 11, title: "Track 11 · Examen mixto C1", levelCount: 5, cefr: "B2–C1" },
  ];

  const CEFR_ORDER = ["A1", "A2", "B1", "B2", "C1"];

  function cefrIndex(label) {
    const i = CEFR_ORDER.indexOf(String(label || "").toUpperCase());
    return i < 0 ? 1 : i;
  }

  function maxLevelIndexForTier(cefrLabel) {
    const i = cefrIndex(cefrLabel);
    if (i <= 0) return 1;
    if (i === 1) return 3;
    if (i === 2) return 5;
    if (i === 3) return 7;
    if (i === 4) return 9;
    return 99;
  }

  function trackById(id) {
    return TRACKS.find((t) => t.id === id) || null;
  }

  global.EnTracks = { TRACKS, CEFR_ORDER, cefrIndex, maxLevelIndexForTier, trackById };
})(typeof window !== "undefined" ? window : globalThis);
