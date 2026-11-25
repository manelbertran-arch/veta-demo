/* Veta demo · datos · extra-c.js · paquete C (Veta, cuenta y entrada)
   Datos que el paquete C necesita y no están en js/datos/ (base, dia, clientes, veta, oficina).
   Se añaden a VETA.datos.c sin pisar lo que ya hay. Lo inventado aquí está apuntado en ESTADO_C.md. */
(function () {
  'use strict';
  const C = VETA.datos.c = {};
  // fechas por la única regla: F (cola o título, con mayúscula) y f (dentro de una frase, en minúscula)
  const F = iso => VETA.fecha.corta(iso), f = iso => VETA.fecha.corta(iso, {frase: true});

  // A10 · nombre corto (cabecera) y frase entera de cada regla
  C.reglas = {
    'r-valoraciones': {nombre: 'Valuations', frase: 'When someone asks for a valuation, I get the flat report ready for you the next day. You send it.', desde: 'August'},
    'r-cancelaciones': {nombre: 'Cancelled viewings', frase: 'When a viewing is cancelled, I suggest another date and you decide whether to send it.'},
    'r-actas': {nombre: 'Viewing notes', frase: 'After each viewing, I ask you to tell me how it went. I write the notes.'},
    'r-promesas': {nombre: 'Promises', frase: 'When someone promises you something in the chat, I note it down and let you know if it doesn\'t arrive.'},
    'r-informes': {nombre: 'Monday reports', frase: 'Every Monday I prepare each owner\'s report and you send it.'},
    'r-contestado': {nombre: 'Who has replied', frase: 'When a client replies to you, I mark it so you don\'t write the same thing to them again.'},
    'r-firmas': {nombre: 'Signing alerts', frase: 'The day before a signing, I tell you what you need to bring.'},
    'r-recordatorios': {nombre: 'Reminders', frase: 'When a buyer doesn\'t reply in 3 days, I prepare a reminder and you send it.'}
  };
  // A10 · los 3 casos distintos de valoraciones (H18): hora del mensaje y qué habría hecho Veta
  C.distinto = {
    jordi: {origen: 'Jordi · WhatsApp ·  ' + f('2026-11-06T10:12'), habria: 'This time you did not send the flat report: you wrote something else.', motivo: 'You wrote something else'},
    nuria: {origen: 'Núria · WhatsApp ·  ' + f('2026-10-21T17:40'), habria: 'This time you did not send the flat report or anything else.', motivo: 'You didn\'t send anything'},
    toni: {origen: 'Toni · WhatsApp ·  ' + f('2026-09-02T12:05'), habria: 'This time you did not send the flat report: you wrote something else.', motivo: 'You wrote something else'}
  };
  // A10 · la regla a prueba (visitas canceladas): lo que habría hecho, sin enviarlo
  C.aPrueba = [
    {id: 'jordi', cuando: F('2026-11-20'), nombre: 'Jordi Ferrer', propone: 'I\'d suggest Thursday 26, 18:00',
      cita: 'In the end I can\'t make it to see the flat tomorrow, sorry.', origen: 'Jordi · WhatsApp ·  ' + f('2026-11-20T09:05'),
      borrador: 'Hi Jordi, it\'s Laura. No problem. Does Thursday 26 at 18:00 work for you to see it?'},
    {id: 'anna-bosch', cuando: F('2026-11-19'), nombre: 'Anna Bosch', propone: 'I\'d suggest Saturday 21, 10:00',
      cita: 'A trip has come up, can we change the viewing?', origen: 'Anna · WhatsApp ·  ' + f('2026-11-19T16:30'),
      borrador: 'Hi Anna, it\'s Laura. Of course. Does Saturday 21 at 10:00 work for you?'}
  ];
  // A11 · la orden dictada y sus partes (H21)
  C.orden = {
    dijiste: 'When a buyer doesn\'t reply in three days, prepare me a reminder.',
    partes: [
      {id: 'cuando', titulo: 'When it acts', texto: 'When a buyer has gone 3 days without replying to you.'},
      {id: 'comprueba', titulo: 'What it checks', texto: 'That the last message is yours and that there\'s no viewing booked.'},
      {id: 'hace', titulo: 'What it does', texto: 'It prepares a reminder for you in Home.'},
      {id: 'llega', titulo: 'How far it goes', texto: 'Prepares. You send it.'}
    ]
  };
  // A9b · la semana pasada: la del 16 al 22 (pulido 2: hoy es lunes 23; las mismas cifras que la pestaña Veta y C.semanas '16-nov')
  C.semanaPasada = [
    {titulo: 'Messages I wrote for you', derecha: '31'},
    {titulo: 'Viewing notes saved', derecha: '3'}, {titulo: 'Promises noted', derecha: '4'},
    {titulo: 'Owner reports', derecha: '1'}, {titulo: 'Replies marked', derecha: '8'}
  ];
  // A13 · lo que he aprendido
  C.aprendido = [
    {id: 'pere-tarde', texto: 'You write to Pere in the afternoon, after 16:00.', corto: 'Pere: you write after lunch', origen: 'From your October messages'},
    {id: 'marta-sabados', texto: 'Marta Puig can only see flats on Saturdays.', corto: 'Marta can only do Saturdays', origen: 'From their chat of ' + f('2026-11-03')},
    {id: 'arras-notaria', texto: 'You sign deposit contracts at the notary on Gran de Gràcia.', corto: 'Deposits, on Gran de Gràcia', origen: 'From your last 4 deposit contracts'}
  ];
  C.oficinaDice = ['Viewings are logged on the profile the same day.', 'The energy certificate is requested before advertising the price.'];
  // A13b · ejemplos de mejora
  C.mejoras = ['Call within 48 h whoever asks for a viewing', 'Confirm viewings the day before', 'Ask for the certificate when taking the listing'];
  // A14 · lo que aún haces a mano (hoja c-mano)
  C.aMano = [['Get the flat report ready before a valuation', 14], ['Confirm viewings the day before', 9], ['Ask for the energy certificate', 6]];
  // H25 · semanas anteriores (casos preparados de la oficina, los de G3e; mensajes de Laura inventados)
  C.semanas = [
    {id: '26-oct', texto: 'Week of 26 Oct to 1 Nov', corto: '26 Oct', preparados: 118, mensajes: 22, enviados: 19, actas: 2},
    {id: '2-nov', texto: 'Week of 2 to 8 Nov', corto: '2 Nov', preparados: 127, mensajes: 25, enviados: 22, actas: 4},
    {id: '9-nov', texto: 'Week of 9 to 15 Nov', corto: '9 Nov', preparados: 141, mensajes: 27, enviados: 24, actas: 2},
    {id: '16-nov', texto: 'Week of 16 to 22 Nov', corto: '16 Nov', preparados: 156, mensajes: 31, enviados: 27, actas: 3}
  ];
  // H24 · tus tiempos (minutos de ejemplo; las cuentas salen de VETA.datos.tiempos.laura)
  C.tiempos = [{id: 'mensajes', texto: 'Reply to a message', min: 4}, {id: 'actas', texto: 'Viewing notes', min: 12}, {id: 'avisos', texto: 'Log a promise', min: 2}];

  // A18m · mi mapa de trabajo (H32 con sus citas)
  C.mapa = [
    {titulo: 'What I\'ve found', filas: [
      {id: 'sin-respuesta', titulo: 'Contacts without a reply', sub: '5 · the oldest, from yesterday', texto: 'People who wrote to you and are still waiting for your reply.',
        citas: [{texto: 'Is the Gràcia flat still available? We could view it Saturday', origen: 'Marta · yesterday, 18:42'}]},
      {id: 'quieren', titulo: 'Wanted to sell or buy', sub: '9 people', texto: 'They said it in the chat and it wasn\'t always logged on any profile.',
        citas: [{texto: 'First of all, can you come and see it?', origen: 'Núria ·  ' + f('2026-10-21')}, {texto: 'How much could I ask for my mother\'s flat?', origen: 'Jordi ·  ' + f('2026-11-06')}]},
      {id: 'promesas', titulo: 'Promises', sub: '7 with no record', texto: 'What they promised you, or you promised, with no record of it being kept.',
        citas: [{texto: 'I\'ll send you the payslip on Wednesday', origen: 'Elena ·  ' + f('2026-11-16')}]},
      {id: 'papeles', titulo: 'Pending paperwork', sub: '4', texto: 'Documents someone has to send before moving on.',
        citas: [{texto: 'I\'ll send you the energy certificate when I get it', origen: 'Pere ·  ' + f('2026-11-13')}]},
      {id: 'enfrian', titulo: 'Relationships going cold', sub: '3', texto: 'Clients you haven\'t talked to in weeks.',
        citas: [{texto: 'If any premises come up in the Eixample, let me know', origen: 'Albert · 7 weeks ago'}]}]},
    {titulo: 'Open things', filas: [
      {id: 'visita-gracia', titulo: 'The Gràcia flat viewing', sub: 'Marta Puig · on Saturday', texto: 'Marta wants to see Verdi 42 this Saturday. The time still needs confirming.',
        citas: [{texto: 'Is the Gràcia flat still available? We could view it Saturday', origen: 'Marta · yesterday, 18:42'}]},
      {id: 'dossier-sants', titulo: 'The report on the Sants flat', sub: 'Jordi Ferrer · you promised it', texto: 'You told Jordi you would send him the report on the Sants flat.',
        citas: [{texto: 'Great, I\'ll wait for the report', origen: 'Jordi ·  ' + f('2026-11-20')}]},
      {id: 'papeles-verdi', titulo: 'The Verdi flat paperwork', sub: 'Pere Soler · the certificate', texto: 'The energy certificate is missing to be able to advertise the price.',
        citas: [{texto: 'I\'ll send you the energy certificate when I get it', origen: 'Pere ·  ' + f('2026-11-13')}]}]},
    {titulo: 'Repeated work', filas: [
      {id: 'dossier', titulo: 'Get the flat report ready before a valuation', sub: '14 times in six months', texto: 'When someone asks for a valuation, you send them the flat report the next day. You have done it 14 times; 11 of them the same way.',
        citas: [{texto: 'How much could I ask for my mother\'s flat?', origen: 'Jordi ·  ' + f('2026-11-06')}], boton: {texto: 'See the 14 cases', ir: 'regla/r-valoraciones'}},
      {id: 'certificado', titulo: 'Ask for the energy certificate', sub: '6 times', texto: 'When taking on a flat, you ask the owner for the energy certificate.',
        citas: [{texto: 'I\'ll send you the energy certificate when I get it', origen: 'Pere ·  ' + f('2026-11-13')}]},
      {id: 'visitas', titulo: 'Confirm viewings the day before', sub: '9 times', texto: 'The day before a viewing you write to confirm it.',
        citas: [{texto: 'Yes, tomorrow at 11:00 we\'ll meet at the door', origen: 'Elena ·  ' + f('2026-11-20')}]}]}
  ];

  // G10 · cómo trabajamos (H23). `corto`: el nombre en una línea para la fila y el título de la hoja
  C.practicas = [
    {id: 'actas', titulo: 'Viewing notes taken when you leave', corto: 'Notes taken when you leave', estado: 'en-marcha', estadoTexto: 'In use', usan: 'used by 4 of 6', propuso: 'proposed by Anna Costa',
      caso: 'It started with the September viewings: the notes were written two days later, or never.'},
    {id: 'mismo-dia', titulo: 'Reply the same day', estado: 'a-prueba', estadoTexto: 'We are trying it · day 9 of 14', usan: 'on trial with the whole team', propuso: 'came with Veta',
      caso: 'It came ready with Veta: contacts waiting more than a day go cold.'},
    {id: 'dossier', titulo: 'Flat report the next day', corto: 'Report the next day', estado: 'propuesta', estadoTexto: 'My suggestion', usan: 'used by Laura Martí', propuso: 'by Laura Martí',
      caso: 'It started with Laura\'s chats: 14 valuations since August, 11 with the flat report the next day.'}
  ];
  C.practicaClaudia = {id: 'llamar-48', titulo: 'Call within 48 hours anyone who asks for a viewing', corto: 'Call within 48 hours', estado: 'propuesta', estadoTexto: 'My suggestion', usan: 'nobody uses it yet',
    propuso: 'comes from a case', caso: 'It came out of Clàudia Ribas\'s case: she asked to see a flat in Sants and nobody called her.'};
  // G11 · dónde se paran las operaciones y cómo aprende Veta
  C.paradas = [['Contact', 1], ['Viewings', 2], ['Offer', 1], ['Deposit', 0]];
  C.aprende = [['Listens', 'Reads the work chats each person lets it read.'], ['Detects', 'Sees what repeats and what gets stuck.'],
    ['The team decides', 'One person proposes it; management decides whether to try it.'], ['The office improves', 'What works becomes how we work.']];
  // G12 · lo que Veta aún no hace
  C.falta = [['Reply to new contacts', 23], ['Get flat reports ready', 14], ['Ask for energy certificates', 6]];
  // G14 · lo que sabe tu oficina
  C.sabe = [['After balcony photos, they view', 31, 38], ['No news in 10 days, the owner complains', 5, 7], ['In Gràcia, almost everyone wants to view on a Saturday', 64, 92]];
  // E2 · cuentas de ejemplo
  C.cuentas = {laura: 'laura@ejemplo.es', montse: 'montse@ejemplo.es'};
})();
