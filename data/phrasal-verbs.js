(function (global) {
  const P = [
    ["pick up", "recoger / pasar a buscar", "I'll pick you up at seven."],
    ["give up", "rendirse", "Never give up."],
    ["look after", "cuidar", "She looks after her nephews."],
    ["run into", "encontrarse por casualidad", "I ran into my cousin."],
    ["put up with", "tolerar", "I can't put up with the noise."],
    ["get along with", "llevarse bien con", "We get along with the neighbors."],
    ["come up with", "idear", "She came up with a plan."],
    ["turn on", "encender", "Turn on the light, please."],
    ["turn off", "apagar", "Turn off your phone in class."],
    ["find out", "averiguar", "I found out this morning."],
    ["carry on", "seguir adelante", "Carry on practicing every day."],
    ["set up", "montar / configurar", "They set up a small business."],
    ["bring up", "sacar un tema", "Why did you bring that up?"],
    ["call off", "cancelar", "They called off the match."],
    ["fill in", "rellenar", "Fill in this form."],
    ["fill out", "rellenar (formulario)", "Fill out the application."],
    ["hang out", "pasar el rato", "We hang out on weekends."],
    ["work out", "hacer ejercicio / salir bien", "Things worked out fine."],
    ["try on", "probarse ropa", "Try on this jacket."],
    ["take off", "despegar / quitarse", "The plane takes off at 6."],
    ["get on", "subir (transporte)", "Get on the bus here."],
    ["get off", "bajar", "Get off at the square."],
    ["look for", "buscar", "I'm looking for my keys."],
    ["look forward to", "esperar con ilusión", "I look forward to seeing you."],
    ["give back", "devolver", "Give back the book tomorrow."],
    ["pay back", "devolver dinero", "I'll pay you back next week."],
    ["cut down on", "reducir consumo", "I'm cutting down on sugar."],
    ["run out of", "quedarse sin", "We ran out of milk."],
    ["catch up with", "ponerse al día", "I need to catch up with work."],
    ["keep up with", "seguir el ritmo", "It's hard to keep up with the news."],
    ["go on", "continuar", "What's going on?"],
    ["hold on", "esperar un momento", "Hold on, please."],
    ["break down", "descomponerse", "The car broke down."],
    ["break up", "terminar relación", "They broke up last year."],
    ["make up", "inventar / reconciliarse", "They made up after the fight."],
    ["hand in", "entregar", "Hand in your homework."],
    ["hand out", "repartir", "Please hand out the papers."],
    ["take care of", "cuidar", "Take care of yourself."],
    ["look into", "investigar", "We'll look into it."],
    ["point out", "señalar", "She pointed out a mistake."],
    ["figure out", "resolver / entender", "I can't figure out this clue."],
    ["end up", "terminar en una situación", "We ended up staying home."],
    ["show up", "aparecer", "He didn't show up."],
    ["speak up", "hablar más alto", "Please speak up."],
    ["sit down", "sentarse", "Sit down, please."],
    ["stand up", "ponerse de pie", "Everyone stood up."],
    ["wake up", "despertarse", "I wake up at six."],
    ["grow up", "crecer", "I grew up on the coast."],
    ["cheer up", "animar", "Cheer up! It will be OK."],
    ["calm down", "calmarse", "Calm down and breathe."],
    ["deal with", "lidiar con", "She can deal with stress."],
    ["put off", "posponer", "Don't put off your homework."],
    ["take up", "empezar (hobby) / ocupar espacio", "I want to take up yoga."],
    ["bring back", "devolver la memoria", "That song brings back memories."],
    ["check in", "registrarse (hotel/vuelo)", "We checked in online."],
    ["check out", "dejar el hotel / probar", "We check out at noon."],
    ["drop off", "dejar a alguien/algo", "I'll drop you off at the door."],
    ["pick out", "escoger", "Pick out a gift for her."],
  ];
  const items = [];
  let n = 0;
  P.forEach(function (row, i) {
    const pv = row[0];
    const mean = row[1];
    const ex = row[2];
    const L = i % 10;
    const d1 = P[(i + 3) % P.length][0];
    const d2 = P[(i + 7) % P.length][0];
    const d3 = P[(i + 11) % P.length][0];
    items.push({
      id: "phr_mcq_" + n++,
      trackId: "t_phrasal",
      levelIndex: L,
      cefr: "B1",
      category: "phrasal",
      exerciseType: "mcq",
      prompt_es: "¿Qué phrasal encaja mejor? " + mean,
      context_en: ex,
      choices: [pv, d1, d2, d3],
      correctIndex: 0,
      accept: [pv],
      correctDisplay: pv,
      hint: mean,
      explanation: pv + ": " + mean,
      tags: ["phrasal"],
      register: "neutral",
    });
    items.push({
      id: "phr_cloze_" + n++,
      trackId: "t_phrasal",
      levelIndex: L,
      cefr: "B1",
      category: "phrasal",
      exerciseType: "cloze",
      prompt_es: "Completa el phrasal en la frase:",
      blankSentence: ex.replace(pv, "___"),
      accept: [pv],
      correctDisplay: pv,
      context_en: ex,
      hint: mean,
      tags: ["phrasal"],
      register: "neutral",
    });
  });
  for (let j = 0; j < 45; j++) {
    const row = P[j % P.length];
    const pv = row[0];
    items.push({
      id: "phr_listen_" + n++,
      trackId: "t_phrasal",
      levelIndex: j % 10,
      cefr: "A2",
      category: "phrasal",
      exerciseType: "listen_type",
      prompt_es: "Escucha y escribe el phrasal (botón Escuchar).",
      audioText: row[2],
      accept: [pv],
      correctDisplay: pv,
      hint: "Dos palabras en muchos phrasals.",
      tags: ["listening"],
      register: "neutral",
    });
  }
  global.EN_DATA_PHRASAL = items;
})(typeof window !== "undefined" ? window : globalThis);
