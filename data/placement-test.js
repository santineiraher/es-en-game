/**
 * Banco de prueba de nivel: preguntas reales por CEFR y categoría.
 * (La versión anterior usaba plantillas genéricas sin valor diagnóstico.)
 */
(function (global) {
  const BANK = [];

  function mcq(id, cefr, cat, stem_es, options, correctIndex) {
    BANK.push({
      id: id,
      cefr_level: cefr,
      category: cat,
      type: "mcq",
      stem_es: stem_es,
      options: options,
      correctIndex: correctIndex,
      partialCredit: true,
    });
  }

  function cloze(id, cefr, cat, stem_es, stem_en, accept, correctDisplay) {
    BANK.push({
      id: id,
      cefr_level: cefr,
      category: cat,
      type: "cloze",
      stem_es: stem_es,
      stem_en: stem_en,
      accept: accept,
      correctDisplay: correctDisplay,
      partialCredit: true,
    });
  }

  function tr(id, cefr, cat, stem_es, stem_es_line, accept, correctDisplay) {
    BANK.push({
      id: id,
      cefr_level: cefr,
      category: cat,
      type: "translate_es_en",
      stem_es: stem_es,
      stem_en: stem_es_line,
      accept: accept,
      correctDisplay: correctDisplay,
      partialCredit: true,
    });
  }

  function spot(id, cefr, cat, stem_es, stem_en, options, correctIndex) {
    BANK.push({
      id: id,
      cefr_level: cefr,
      category: cat,
      type: "spot_error",
      stem_es: stem_es,
      stem_en: stem_en,
      options: options,
      correctIndex: correctIndex,
      partialCredit: true,
    });
  }

  /* --- A1 --- */
  mcq("p_a1_t1", "A1", "tense", "Completa: Yo ___ de Colombia. (identidad con I)", ["am", "is", "are", "be"], 0);
  mcq("p_a1_t2", "A1", "tense", "Ella ___ profesora.", ["am", "is", "are", "be"], 1);
  mcq("p_a1_t3", "A1", "tense", "Ellos no ___ en casa ahora.", ["isn't", "aren't", "don't be", "not are"], 1);
  mcq("p_a1_m1", "A1", "modal", "¿Puedes ayudarme? → ___ you help me?", ["Can", "Must", "Should", "Will"], 0);
  mcq("p_a1_p1", "A1", "prep", "El libro está ___ la mesa.", ["in", "on", "at", "to"], 1);
  mcq("p_a1_p2", "A1", "prep", "Nos vemos ___ lunes.", ["in", "on", "at", "by"], 1);
  cloze("p_a1_t4", "A1", "tense", "Completa la forma correcta:", "There ___ two chairs in the room.", ["are", "is", "am", "be"], "are");
  tr("p_a1_t5", "A1", "tense", "Traduce al inglés:", "Tengo veinte años.", ["I'm twenty", "I am twenty", "I have twenty years"], "I'm twenty");

  /* --- A2 --- */
  mcq("p_a2_t1", "A2", "tense", "Ayer yo ___ al parque.", ["go", "went", "gone", "going"], 1);
  mcq("p_a2_t2", "A2", "tense", "She ___ TV every evening.", ["watch", "watches", "watching", "is watch"], 1);
  mcq("p_a2_m1", "A2", "modal", "You look tired. You ___ rest.", ["should", "can", "may", "will"], 0);
  mcq("p_a2_p1", "A2", "prep", "Estoy interesado ___ aprender inglés.", ["on", "at", "in", "for"], 2);
  mcq("p_a2_p2", "A2", "prep", "Good ___ you for helping!", ["to", "of", "on", "for"], 3);
  spot("p_a2_ff1", "A2", "false_friend", "¿Qué frase en inglés es natural?", "I have fifteen years.", ["I am fifteen.", "I have fifteen years.", "I have fifteen.", "I am fifteen years old."], 0);
  cloze("p_a2_t3", "A2", "tense", "Hueco:", "I ___ here since 2020.", ["have lived", "live", "lived", "am living"], "have lived");
  tr("p_a2_t4", "A2", "tense", "Traduce:", "Ellos no viven aquí.", ["They don't live here", "They not live here", "They doesn't live here"], "They don't live here");

  /* --- B1 --- */
  mcq("p_b1_t1", "B1", "tense", "If it rains, we ___ cancel the picnic.", ["will", "would", "cancel", "are"], 0);
  mcq("p_b1_t2", "B1", "tense", "By next July, she ___ her degree.", ["will finish", "will have finished", "finishes", "has finished"], 1);
  mcq("p_b1_m1", "B1", "modal", "That ___ be true — it sounds impossible.", ["can't", "mustn't", "shouldn't", "wouldn't"], 0);
  mcq("p_b1_p1", "B1", "prep", "She's afraid ___ spiders.", ["for", "of", "about", "with"], 1);
  mcq("p_b1_ph1", "B1", "phrasal", "I'll ___ you at the airport at 8. (pasar a buscar)", ["pick up", "pick on", "pick at", "pick out"], 0);
  mcq("p_b1_ph2", "B1", "phrasal", "We need to ___ a solution before Friday.", ["come up with", "come in for", "come over to", "come down on"], 0);
  tr("p_b1_t3", "B1", "tense", "Traduce:", "Si hubiera sabido, no habría venido.", ["If I had known, I wouldn't have come", "If I knew, I wouldn't come", "If I had known, I didn't come"], "If I had known, I wouldn't have come");
  spot("p_b1_ff2", "B1", "false_friend", "Corrige el falso amigo:", "I am very sensible about noise.", ["I am very sensitive about noise.", "I am very sensible about noise.", "I have very sensible about noise.", "I am sensibly about noise."], 0);

  /* --- B2 --- */
  mcq("p_b2_t1", "B2", "tense", "The report ___ by the time you arrived.", ["had been finished", "was finished", "has been finished", "finished"], 0);
  mcq("p_b2_t2", "B2", "tense", "Had I known, I ___ you earlier.", ["would have told", "would tell", "had told", "told"], 0);
  mcq("p_b2_m1", "B2", "modal", "You ___ have told me — I would have helped!", ["should", "must", "might", "could"], 3);
  mcq("p_b2_id1", "B2", "idiom", "We need to ___ and focus on the deadline. (dejar de perder tiempo)", ["get down to business", "hit the books", "call it a day", "spill the beans"], 0);
  mcq("p_b2_id2", "B2", "idiom", "The extra day off was ___. (algo extra positivo)", ["the icing on the cake", "a storm in a teacup", "the last straw", "under the weather"], 0);
  cloze("p_b2_t3", "B2", "tense", "Hueco:", "So difficult ___ that few people passed.", ["was the exam", "the exam was", "the exam did", "did the exam"], "was the exam");
  tr("p_b2_t4", "B2", "tense", "Traduce:", "Me dijo que vendría al día siguiente.", ["She told me she would come the next day", "She told me she will come the next day", "She said me she would come next day"], "She told me she would come the next day");
  spot("p_b2_ff3", "B2", "false_friend", "Elige la frase correcta (assist vs attend):", "I will assist the meeting tomorrow.", ["I will attend the meeting tomorrow.", "I will assist to the meeting tomorrow.", "I will assist at the meeting tomorrow.", "I will assist the meeting tomorrow."], 0);

  /* --- C1 --- */
  mcq("p_c1_t1", "C1", "tense", "___ the risks involved, she signed the contract.", ["Having fully understood", "Fully understanding", "Fully understood", "Having been fully understood"], 0);
  mcq("p_c1_t2", "C1", "tense", "Rarely ___ such a convincing argument.", ["have I heard", "I have heard", "I heard", "heard I"], 0);
  mcq("p_c1_id1", "C1", "idiom", "Let's address ___ — we can't ignore the budget cuts.", ["the elephant in the room", "the ball in your court", "a dime a dozen", "the tip of the iceberg"], 0);
  mcq("p_c1_m1", "C1", "modal", "You ___ locked the door — the keys are still inside!", ["must have", "should have", "might have", "would have"], 0);
  cloze("p_c1_t3", "C1", "tense", "Hueco (inversión condicional):", "___ I known, I would never have agreed.", ["Had", "If", "Have", "Did"], "Had");
  tr("p_c1_t4", "C1", "tense", "Traduce con registro formal:", "No es que no quiera ayudar; es que no puedo comprometerme ahora.", ["It's not that I don't want to help; it's that I can't commit right now", "It is not that I no want to help", "It's not I don't want help"], "It's not that I don't want to help; it's that I can't commit right now");

  /* --- Más ítems para cubrir categorías y niveles (mezcla) --- */
  mcq("p_a2_ph1", "A2", "phrasal", "Can you ___ the light? It's dark.", ["turn on", "turn off", "turn up", "turn down"], 0);
  mcq("p_a2_id1", "A2", "idiom", "The test was easy — it was a ___.", ["piece of cake", "storm in a teacup", "last straw", "blessing in disguise"], 0);
  mcq("p_b1_id1", "B1", "idiom", "We don't always ___ on politics.", ["see eye to eye", "hit the nail", "spill the beans", "break the ice"], 0);
  mcq("p_b1_ff3", "B1", "false_friend", "En inglés, 'actualmente' (ahora mismo) suele traducirse con:", ["Currently", "Actually", "Eventually", "Nowadays"], 0);
  mcq("p_a1_ff1", "A1", "false_friend", "¿Cómo dices 'tengo hambre' correctamente?", ["I am hungry", "I have hungry", "I hungry", "I hunger"], 0);
  cloze("p_a2_p3", "A2", "prep", "Completa:", "She arrived ___ the station at six.", ["at", "in", "on", "to"], "at");
  cloze("p_b1_p3", "B1", "prep", "Completa:", "He's married ___ a doctor.", ["to", "with", "by", "for"], "to");
  cloze("p_b2_p1", "B2", "prep", "Completa:", "You can depend ___ us.", ["on", "of", "in", "for"], "on");
  tr("p_a1_t6", "A1", "tense", "Traduce:", "Hace frío.", ["It is cold", "It has cold", "Is cold", "The weather is cold"], "It is cold");
  tr("p_a2_t5", "A2", "tense", "Traduce:", "¿Hablas inglés?", ["Do you speak English", "Are you speaking English", "Speak you English", "You speak English"], "Do you speak English");
  tr("p_b1_t5", "B1", "tense", "Traduce:", "Ojalá hubiera estudiado más.", ["I wish I had studied more", "I hope I had studied more", "I wish I studied more"], "I wish I had studied more");
  tr("p_b2_t5", "B2", "tense", "Traduce:", "Me dijeron que habían cerrado la tienda.", ["They told me the shop had closed", "They told me the shop has closed", "They said me the shop had closed"], "They told me the shop had closed");
  spot("p_a2_t6", "A2", "tense", "¿Qué frase es correcta?", "She don't like coffee.", ["She doesn't like coffee.", "She doesn't likes coffee.", "She not like coffee.", "She don't likes coffee."], 0);
  spot("p_b1_t6", "B1", "tense", "Corrige:", "I have lived here since five years.", ["I have lived here for five years.", "I live here since five years.", "I have lived here from five years.", "I am living here since five years."], 0);
  mcq("p_b2_ph1", "B2", "phrasal", "We can't ___ this noise any longer.", ["put up with", "look up to", "get over with", "come up with"], 0);
  mcq("p_c1_ph1", "C1", "phrasal", "The CEO refused to ___ on quality.", ["cut corners", "call it a day", "touch base", "run out of"], 0);
  mcq("p_b1_m2", "B1", "modal", "___ I use your phone for a second?", ["May", "Must", "Should", "Would"], 0);
  mcq("p_b2_m2", "B2", "modal", "The evidence was weak — he ___ guilty.", ["might not have been", "can't be", "must be", "should be"], 0);
  mcq("p_a2_m2", "A2", "modal", "You ___ smoke here; it's forbidden.", ["mustn't", "don't have to", "can't", "shouldn't"], 2);
  mcq("p_a1_m2", "A1", "modal", "I ___ swim when I was five. (ability past)", ["could", "can", "must", "should"], 0);
  cloze("p_c1_p1", "C1", "prep", "Formal collocation:", "She has great influence ___ the committee.", ["over", "on", "in", "at"], "over");
  mcq("p_b2_id3", "B2", "idiom", "After the scandal, he had to ___.", ["face the music", "hit the sack", "call it a day", "cheer up"], 0);

  global.EN_PLACEMENT_BANK = BANK;
})(typeof window !== "undefined" ? window : globalThis);
