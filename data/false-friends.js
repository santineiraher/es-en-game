(function (global) {
  const F = [
    ["actually", "En inglés actually = 'de hecho', no 'actualmente'.", "Currently", "Actually, I disagree."],
    ["assist", "assist = ayudar; 'asistir a' es attend.", "Attend", "Can I assist you?"],
    ["embarrassed", "embarrassed = avergonzado; embarazada es pregnant.", "Pregnant", "I was embarrassed."],
    ["library", "library = biblioteca; librería es bookshop.", "Bookshop", "I borrowed a book from the library."],
    ["realize", "realize = darse cuenta; 'realizar un proyecto' suele ser carry out.", "Carry out", "I didn't realize it was late."],
    ["sensible", "sensible = sensato; 'sensible' físico es sensitive.", "Sensitive", "That's a sensible idea."],
    ["pretend", "pretend = fingir; 'pretender' como intentar es intend/aim.", "Intend", "The child likes to pretend."],
    ["fabric", "fabric = tela; fábrica es factory.", "Factory", "This shirt is cotton fabric."],
    ["exit", "exit = salida; éxito es success.", "Success", "Use the emergency exit."],
    ["lecture", "lecture = clase magistral; lectura es reading.", "Reading", "I attended a lecture."],
    ["career", "career = carrera profesional (trayectoria).", "University degree", "She built a career in medicine."],
    ["carpet", "carpet = alfombra; carpeta de archivos es folder.", "Folder", "The carpet is blue."],
    ["rope", "rope = cuerda; ropa es clothes.", "Clothes", "Tie it with a rope."],
    ["introduce", "introduce people = presentar; meter algo es insert.", "Insert", "Let me introduce my colleague."],
    ["sympathetic", "sympathetic = comprensivo; 'simpático' suele ser nice/kind.", "Nice", "He was sympathetic when I was ill."],
    ["compromise", "compromise = acuerdo mutuo / comprometerse a negociar.", "Commit", "We compromised on the price."],
    ["eventual", "eventually = con el tiempo; eventual en español a veces es possible/final.", "Finally", "Eventually, prices fell."],
    ["bizarre", "bizarre = extraño; 'bizarro' en español a veces se confunde.", "Brave", "That's a bizarre story."],
    ["rope vs clothes", "rope no es ropa.", "Clothes", "I need a rope for the tent."],
    ["collar", "collar (ropa) existe en inglés; no confundir con color.", "Color", "The shirt collar is tight."],
    ["argument", "argument = discusión o argumento lógico; 'argumento' de película a veces es plot line.", "Plot", "They had an argument."],
    ["notice", "notice = darse cuenta / aviso; noticia es news.", "News", "Did you notice the change?"],
    ["major", "major = carrera principal (US) / importante; mayor edad es of age.", "Older", "Her major is biology."],
    ["citation", "citation = multa o cita bibliográfica; citación académica también.", "Appointment", "He got a citation for speeding."],
    ["deception", "deception = engaño; decepción en español es disappointment.", "Disappointment", "It was a cruel deception."],
    ["sopa", "soup = sopa; soap = jabón (cuidado al pronunciar).", "Soap", "I ordered tomato soup."],
    ["jam", "jam = mermelada / atasco; 'jamón' es ham.", "Ham", "Traffic was stuck in a jam."],
    ["rope", "repite: rope = cuerda.", "Clothes", "Climb the rope carefully."],
    ["success", "success = éxito; suceso (evento) es event.", "Event", "The project was a success."],
    ["policy", "policy = política (norma); policía es police.", "Police", "Read the refund policy."],
    ["idiom", "idiom = modismo; idioma es language.", "Language", "That's a common idiom."],
    ["rope", "cuerda otra vez", "Clothes", "The rope broke."],
    ["stranger", "stranger = desconocido; más extraño es stranger comparative from strange", "More strange", "Don't talk to strangers."],
    ["parents", "parents = padres; parientes en general es relatives.", "Relatives", "My parents live in Cali."],
    ["rope", "última cuerda", "Clothes", "Jump the rope."],
  ];
  const items = [];
  let n = 0;
  F.forEach(function (row, i) {
    const L = i % 5;
    items.push({
      id: "ff_" + n++,
      trackId: "t_false_friend",
      levelIndex: L,
      cefr: "A2",
      category: "false_friend",
      exerciseType: "spot_error",
      prompt_es: "Falso amigo: elige la aclaración correcta.",
      context_en: row[3],
      choices: [row[1], "Significa lo mismo que en español", row[2] + " siempre es la traducción exacta", "No hay diferencia importante"],
      correctIndex: 0,
      correctDisplay: row[1],
      contrastive_note: "Ojo aquí: " + row[1],
      tags: ["false_friend"],
      register: "neutral",
    });
  });
  global.EN_DATA_FALSE_FRIENDS = items;
})(typeof window !== "undefined" ? window : globalThis);
