/* Veta demo · datos · r6-veta.js · ronda 6 · paquete C · Veta: aprender (P2)
   Los datos nuevos de este paquete para la ronda 6, en VETA.datos.r6.veta.
   Reutiliza las cifras que ya tiene la app; lo inventado aquí se apunta en ESTADO_R6_P2.md.
   Además, con nombres que entiende un niño de 6 años (ESTRATEGIA_R6 §3 bis):
   - los cinco pasos de “¿Quién lo hace?” (VETA.datos.c.niveles, que lee VETA.vivo.escalera);
   - dos textos legales que decían que dirección no ve nada por persona (decisión 1 de Manel, 21-nov). */
(function () {
  'use strict';
  const D = VETA.datos, R = D.r6 = D.r6 || {};
  const V = R.veta = R.veta || {};

  // ---- “¿Quién lo hace?”: de “Lo haces tú” a “Lo hago yo” (mismo orden que los cinco niveles de antes) ----
  if (D.c) D.c.niveles = [
    {n: 1, nombre: 'I only tell you', enLista: 'I tell you', texto: 'I tell you when it is time. You do it.'},
    {n: 2, nombre: 'I write it for you', texto: 'I get the message ready. You send it.'},
    {n: 3, nombre: 'I note it down', texto: 'I note, mark and save. I send nothing.'},
    {n: 4, nombre: 'I do it and tell you', texto: 'I do it and tell you. If something has to be sent, I ask you first.'},
    {n: 5, nombre: 'I send it', texto: 'Not yet. Nothing is sent without you.', cerrado: true}
  ];

  // ---- dónde está cada cosa que hago (paso 1-4) y la pregunta para subir, con sus casos ----
  V.pasos = {
    'r-valoraciones': {paso: 2},
    'r-cancelaciones': {paso: 2},
    'r-actas': {paso: 2, sube: {hechas: 14, corregidas: 1, pregunta: 'Shall I note on your list that the viewing note is due, without asking you?', boton: 'Yes, you note it'}},
    'r-promesas': {paso: 3},
    'r-informes': {paso: 2},
    'r-contestado': {paso: 3},
    'r-firmas': {paso: 1},
    'r-recordatorios': {paso: 2}
  };

  // ---- el trabajo nuevo que se puede subir de verdad: confirmar las visitas el día antes ----
  // pulido: al decir que sí pasa a 'prueba' y ahí se queda (una prueba que empieza hoy no tiene historial: no pregunta otra vez)
  // su sitio vive en VETA.r6.reglaVisitas(): 'propuesta' (paso 1) → 'prueba' (paso 2) → 'sola' (paso 3)
  V.visitas = {
    id: 'r-visitas', nombre: 'Confirm viewings the day before', corto: 'Confirm viewings the day before',
    paso: {propuesta: 1, prueba: 2, sola: 3},
    frase: {
      propuesta: 'The day before a viewing, you write to the client to confirm it.',
      prueba: 'The day before a viewing, I write the message to confirm it for you. You send it.',
      sola: 'The day before a viewing, I check if the client has already said they are coming. If they have, I note it and do not bother you.'
    },
    // la frase viva de lo que pasará (sábado 28: Marta y Elena tienen visita; datos de Hoy y del mapa)
    manana: {
      propuesta: 'On Friday I will remind you about Saturday\'s viewings. You will write to them.',
      prueba: 'On Friday I write the messages for Marta and Elena, who come on Saturday.',
      sola: 'On Friday I will check if Marta and Elena have said they are coming on Saturday. If they have, I note it. If not, I write the message for you in Today.'
    },
    // los 9 casos en que confirmaste tú (inventados para la demo, con clientes que ya existen)
    casos: [
      {cuando: 'Fri 20 Nov', nombre: 'Elena Vives', av: 'elena', dijo: 'Yes, tomorrow at 11:00 we\'ll meet at the door'},
      {cuando: '13 Nov', nombre: 'Marta Puig', av: 'marta', dijo: 'Perfect, I\'ll be there'},
      {cuando: '7 Nov', nombre: 'Jordi Ferrer', av: 'jordi', dijo: 'Yes, 18:00 suits me'},
      {cuando: '31 Oct', nombre: 'Sergi Font', av: 'sergi', dijo: 'Confirmed, thank you'},
      {cuando: '24 Oct', nombre: 'Anna Bosch', av: 'anna-bosch', dijo: 'Yes, we are both coming'},
      {cuando: '17 Oct', nombre: 'Toni Ribas', av: 'toni', dijo: 'Can we do 12:00 instead of 11:00?', distinto: 'You changed the time'},
      {cuando: '10 Oct', nombre: 'Casals family', av: 'casals', dijo: 'Yes, we\'ll be there'},
      {cuando: '3 Oct', nombre: 'Núria Camps', av: 'nuria', dijo: 'Yes, perfect'},
      {cuando: '26 Sep', nombre: 'Rosa Vidal', av: 'rosa', dijo: 'I\'ll be there'}
    ],
    hechas: 9, corregidas: 1,
    // lo que digo al empezar la prueba, en el sitio de la pregunta (sin historial: empieza hoy)
    hecho: 'Done. On Friday I write the messages for Marta and Elena for you. When I have done it a few times, I ask if I should do one more step.',
    // lo que pregunta cada paso para subir al siguiente
    sube: {
      propuesta: {pregunta: 'You have done this 9 times. Shall I write it for you the day before?', boton: 'Yes, write it for me'}
    }
  };

  // ---- lo aprendido: quién lo pidió, cuándo, veces que lo he usado y veces que me corregiste ----
  V.aprendido = {
    'pere-tarde': {texto: 'I write to Pere in the afternoon, after 16:00.', quien: 'I saw it in your messages and you confirmed it', cuando: 'on 12 Oct', hechas: 23, corregidas: 1, paso: 2},
    'marta-sabados': {texto: 'I only suggest viewings to Marta on Saturdays.', quien: 'Marta said it in her chat', cuando: 'on 3 Nov', hechas: 4, corregidas: 0, paso: 2},
    'arras-notaria': {texto: 'The deposit, at the Gran de Gràcia notary.', quien: 'I saw it in your last 4 deposits', cuando: 'on 28 Oct', hechas: 2, corregidas: 0, paso: 3}
  };

  // ---- Antes y ahora (A20) · 46 → 21 de la hoja “Tu lista de cada día”; 40 (19 oct) es nuevo ----
  V.antesAhora = {
    semanas: [46, 40, 34, 29, 25, 21],
    antes: {rotulo: 'When we started', valor: 46, unidad: 'things of yours per week',
      filas: ['You wrote every reply', 'You remembered every promise yourself', 'You checked who had replied', 'You wrote the viewing notes at night']},
    ahora: {rotulo: 'Last week', valor: 21, unidad: 'things of yours per week',
      filas: ['You read and send what I write for you', 'You tell me about the viewing when you leave', 'You do the new things, which I cannot do yet']}
  };

  // “Lo que dirección ve de ti” (A14 y A15) ya no tiene datos propios: lee la ficha de la persona de dirección (VETA.dir.personaOps)

  // ---- textos legales que contradecían la decisión 1 ----
  if (D.textos && D.textos.resumen) D.textos.resumen.bloques = [{lista: ['It only reads the channels the office has connected.', 'Every message that goes out is approved by a person.',
    'Management sees your deals, what you have pending and how long you take to reply. They do not see what you write in your chats or your notes.', 'You can leave out any chat whenever you want.']}];
  if (D.textos && D.textos.ver) D.textos.ver.bloques = [{texto: 'Each person sees their own: their clients, their day and their jobs.'},
    {texto: 'Management sees each deal and each person: what they have, what is pending and how long they take to reply. They do not see what is written in the chats or anyone\'s notes.'}];
})();
