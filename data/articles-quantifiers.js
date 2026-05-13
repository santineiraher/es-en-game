(function (global) {
  const rows = [
    ["I saw ___ elephant.", "an", ["a", "an", "the", "—"]],
    ["___ United Kingdom", "the", ["a", "an", "the", "—"]],
    ["She is ___ teacher.", "a", ["a", "an", "the", "—"]],
    ["___ water here is cold.", "The", ["A", "An", "The", "—"]],
    ["I need some ___. (consejo)", "advice", ["advice", "advices", "an advice", "advices"]],
    ["How ___ money do you have?", "much", ["many", "much", "a lot", "few"]],
    ["How ___ friends do you have?", "many", ["much", "many", "a lot", "little"]],
    ["I have very ___ time today.", "little", ["few", "little", "less", "fewer"]],
    ["Use ___ in negative sentences with plural count nouns.", "many", ["much", "many", "less", "fewer"]],
    ["There isn't ___ milk.", "any", ["some", "any", "a", "many"]],
  ];
  const phrases = [
    ["Tengo hambre.", ["I'm hungry", "I am hungry"], "Ojo aquí: I am hungry (no I have hungry)."],
    ["Tengo veinte años.", ["I'm twenty", "I am twenty", "I'm 20"], "Ojo aquí: I am + age."],
    ["Hace frío.", ["It is cold", "It's cold"], "Ojo aquí: it + be + adjetivo."],
    ["No veo a nadie.", ["I don't see anybody", "I don't see anyone", "I do not see anybody"], "Ojo aquí: sin doble negación estándar."],
    ["Voy a comprar pan.", ["I'm going to buy bread", "I am going to buy bread"], "Ojo aquí: be going to + infinitivo."],
    ["¿Te gusta el café?", ["Do you like coffee", "Do you like the coffee"], "Ojo aquí: do/does en preguntas."],
    ["Ella no habla francés.", ["She doesn't speak French", "She does not speak French"], "Ojo aquí: doesn't + base form."],
    ["Estoy aburrido en casa.", ["I'm bored at home", "I am bored at home"], "Ojo aquí: bored (-ed) = cómo te sientes."],
    ["Ese libro es aburrido.", ["That book is boring", "That book is boring."], "Ojo aquí: boring (-ing) = cómo es la cosa."],
    ["Hace tres años que vivo aquí.", ["I have lived here for three years", "I've lived here for three years", "I have been living here for three years"], "Ojo aquí: present perfect + for/since."],
  ];
  const items = [];
  let n = 0;
  rows.forEach(function (r, i) {
    items.push({
      id: "art_" + n++,
      trackId: "t_present",
      levelIndex: i % 10,
      cefr: "A1",
      category: "article",
      exerciseType: "mcq",
      prompt_es: "Elige la opción correcta:",
      context_en: r[0],
      choices: r[2],
      correctIndex: r[2].indexOf(r[1]),
      accept: [r[1]],
      correctDisplay: r[1],
      hint: "Countable / uncountable importa.",
      contrastive_note: "En inglés, some/any y much/many no calcan el español al 100%.",
      tags: ["articles"],
      register: "neutral",
    });
  });
  phrases.forEach(function (p, j) {
    for (let k = 0; k < 3; k++) {
      items.push({
        id: "art_tr_" + n++,
        trackId: "t_present",
        levelIndex: (j + k) % 10,
        cefr: "A2",
        category: "article",
        exerciseType: "translate_es_en",
        prompt_es: "Traduce: " + p[0],
        accept: p[1],
        correctDisplay: p[1][0],
        contrastive_note: p[2],
        tags: ["contrastive"],
        register: "neutral",
      });
    }
  });
  global.EN_DATA_ARTICLES = items;
})(typeof window !== "undefined" ? window : globalThis);
