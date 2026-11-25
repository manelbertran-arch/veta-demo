/* Veta demo · datos · veta.js
   Lo que Veta hace sola (reglas, A9), sus casos (H18, H19), “Lo último”, lo que lee (A15, A15b, H13)
   y los textos legales de H29. Reglas: 7 = 1 propuesta + 1 a prueba + 5 activas. Su estado se cambia con
   VETA.modelo.marca('r-<id>', 'a-prueba' | 'activa' | 'descartada' | 'propuesta'). */
(function () {
  'use strict';
  const D = VETA.datos;
  // las fechas, por la única regla (VETA.fecha.corta): “Sáb 21” hasta seis días, “13 nov” si hace más
  const F = iso => VETA.fecha.corta(iso);

  D.reglas = [
    {id: 'r-valoraciones', texto: 'Get the flat report ready before a valuation', estadoInicial: 'propuesta', estadoTexto: 'to decide', pruebaDias: 14,
      casos: {
        comoYo: [[F('2026-11-13'), 'Rosa Vidal'], [F('2026-11-05'), 'Casals family'], [F('2026-10-29'), 'Sergi Font'], [F('2026-10-22'), 'Anna Bosch'], [F('2026-10-15'), 'Pau Mir'], [F('2026-10-08'), 'Carme Roca'],
          [F('2026-09-30'), 'Lluís Pons'], [F('2026-09-24'), 'Marta Puig'], [F('2026-09-16'), 'Joan Vila'], [F('2026-09-05'), 'Elena Vives'], [F('2026-08-27'), 'Pere Soler']].map(([cuando, nombre]) => ({cuando, nombre})),
        distinto: [{cuando: F('2026-11-06'), nombre: 'Jordi Ferrer', cliente: 'jordi', texto: 'How much could I ask for my mother\'s flat?'},
          {cuando: F('2026-10-21'), nombre: 'Núria Camps', cliente: 'nuria', texto: 'First of all, can you come and see it?'},
          {cuando: F('2026-09-02'), nombre: 'Toni Ribas', cliente: 'toni', texto: 'No need for a report, just give me a rough figure.'}]
      }},
    {id: 'r-cancelaciones', texto: 'Suggest another date when a viewing is cancelled', estadoInicial: 'a-prueba', dia: 5, pruebaDias: 14},
    {id: 'r-actas', texto: 'Ask you for the notes after each viewing', estadoInicial: 'activa', desde: '3 Sep',
      ultimo: [F('2026-11-21') + ' · Família Casals', F('2026-11-19') + ' · Toni Ribas', F('2026-11-17') + ' · Sergi Font']},
    {id: 'r-promesas', texto: 'Write down what people promise you and alert you if it does not arrive', estadoInicial: 'activa', desde: '3 Sep',
      ultimo: [F('2026-11-20') + ' · Jordi (you, the flat report)', F('2026-11-16') + ' · Elena (the payslip)', F('2026-11-13') + ' · Pere (the certificate)']},
    {id: 'r-informes', texto: 'Get each owner\'s report ready on Mondays', estadoInicial: 'activa', desde: '7 Oct',
      ultimo: [F('2026-11-16') + ' · Pere Soler · sent', F('2026-11-09') + ' · Pere Soler · sent', F('2026-11-02') + ' · Pere Soler · sent']},
    {id: 'r-contestado', texto: 'Mark who has replied to you', estadoInicial: 'activa', desde: '3 Sep',
      ultimo: [F('2026-11-20') + ' · Jordi', F('2026-11-19') + ' · Toni', F('2026-11-18') + ' · Anna Bosch']},
    {id: 'r-firmas', texto: 'Warn you the day before a signing', estadoInicial: 'activa', desde: '3 Sep',
      ultimo: [F('2026-11-30') + ' · I\'ll tell you about Laia Casas\'s signing', F('2026-11-09') + ' · deposit on the Sants flat', F('2026-10-15') + ' · deposit on the Pujades flat']}
  ];
  // la regla que nace en A11 al dictar la orden; entra en la lista cuando se marca 'a-prueba'
  D.reglaNueva = {id: 'r-recordatorios', texto: 'Get a reminder ready when a buyer does not reply in three days', estadoInicial: 'nueva', pruebaDias: 14,
    casos: [[F('2026-11-09'), 'Marta Puig'], [F('2026-10-30'), 'Toni Ribas'], [F('2026-10-28'), 'Elena Vives'], [F('2026-10-19'), 'Sergi Font'], [F('2026-10-15'), 'Jordi Ferrer'], [F('2026-10-02'), 'Anna Bosch']].map(([cuando, nombre]) => ({cuando, nombre}))};

  // A15, A15b, H13 · lo que lee Veta
  D.lectura = {chats: 212, canales: [
    {nombre: 'WhatsApp Business', hace: '4 min ago'}],
    hoy: {chats: 8, audios: 10, porEscuchar: 1},
    fuera: ['Mum', 'Javi (brother)', 'Friday dinner group']};

  // lo mismo, de Montse (dirección también vende: sus chats y sus personales; no ve los de nadie más)
  D.lecturaPor = {montse: {chats: 64, canales: D.lectura.canales, hoy: {chats: 5, audios: 2, porEscuchar: 0},
    fuera: ['Ribas family', 'Thursday padel']}};

  // H29 · textos legales (resúmenes inventados para la demo; no son textos jurídicos)
  D.textos = {
    acuerdo: {titulo: 'Data agreement', bloques: [
      {texto: 'Veta reads the work chats you choose and uses them to prepare your day. It sends nothing without your approval.'},
      {titulo: 'What it doesn\'t read', texto: 'Your personal groups and the chats you leave out. They don\'t appear on any screen.'},
      {titulo: 'If you leave the agency', texto: 'Your clients\' profiles and history stay with the office. Your personal chats were never brought in.'}]},
    agencia: {titulo: 'If you leave the agency', bloques: [
      {texto: 'Your clients\' profiles and history stay with the office. Your personal chats were never brought in.'}]},
    resumen: {titulo: 'How Veta looks after data', bloques: [
      {lista: ['It only reads the channels the office has connected.', 'Every message that goes out is approved by a person.', 'Management sees team figures, never per person.', 'You can leave out any chat whenever you want.']}]},
    borrado: {titulo: 'What\'s kept and what\'s deleted', bloques: [
      {texto: 'When you leave a chat out, Veta deletes what it had read from it and writes down for you what it deleted, with the date and time.'},
      {texto: 'What is already part of a client\'s profile (a viewing, viewing notes) stays in the profile.'}]},
    ver: {titulo: 'What you can and can\'t see', bloques: [
      {texto: 'Each person sees their own: their clients, their day and their jobs.'},
      {texto: 'Management sees the team\'s numbers and the office\'s decisions. It doesn\'t see each person\'s numbers separately.'}]},
    leido: {titulo: 'What was read, what went out', bloques: [
      {texto: 'I read 212 work chats, since 3 September.'},
      {texto: 'Gone out: only what a person approved and sent from their WhatsApp. Veta hasn\'t sent anything on its own.'}]},
    consentimientos: {titulo: 'Who said yes', bloques: [
      {texto: '212 chats, since 3 September. Each new contact gets the agency\'s privacy notice in their first message.'}]}
  };
})();
