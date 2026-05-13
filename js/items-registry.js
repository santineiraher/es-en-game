/**
 * Agrega todos los ítems de data/*.js en EN_ALL_ITEMS.
 */
(function (global) {
  const keys = [
    "EN_DATA_TENSES",
    "EN_DATA_IRREGULAR",
    "EN_DATA_PHRASAL",
    "EN_DATA_IDIOMS",
    "EN_DATA_FALSE_FRIENDS",
    "EN_DATA_PREPOSITIONS",
    "EN_DATA_ARTICLES",
  ];
  const all = [];
  keys.forEach((k) => {
    const chunk = global[k];
    if (Array.isArray(chunk)) {
      for (let i = 0; i < chunk.length; i++) all.push(chunk[i]);
    }
  });
  global.EN_ALL_ITEMS = all;
  global.EN_ITEM_COUNT = all.length;
})(typeof window !== "undefined" ? window : globalThis);
