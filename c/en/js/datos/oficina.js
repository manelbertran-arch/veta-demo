/* Veta demo · datos · oficina.js
   6.6 · dirección: el Hoy de Montse (3), las decisiones de Equipo (4), En espera de Montse (3), contactos que nadie
   lleva y sin responder, las 12 operaciones, el caso de Clàudia (G13), los ocho números y los tiempos de ejemplo. */
(function () {
  'use strict';
  const D = VETA.datos;
  const otra = {texto: 'Something else…', hoja: 'h02'};

  D.cola = D.cola || {};
  D.cola.montse = [
    {id: 'm-ruben', quien: 'montse', tipo: 'mensaje', cliente: 'ruben', titulo: 'Rubén Gil', corto: 'Rubén', sale: true, chat: 'ruben',
      quienEs: 'Seller · Sant Gervasi penthouse', etiqueta: 'sin-responder',
      cita: {texto: 'Has anyone come to see the penthouse this week?', origen: 'Rubén · yesterday, 20:15'},
      borrador: 'Hi Rubén, it\'s Montse. Two couples saw the penthouse last week; one wants to come back on Saturday. I\'ll call you on Friday with what they say.',
      boton: {texto: 'Open WhatsApp with the message'}, secundarios: [{texto: 'Edit', ir: 'mensaje/m-ruben'}, otra],
      fila: 'Rubén Gil', filaSub: 'Asks about the penthouse viewings', lineas: {enviada: 'Sent to Rubén'}},
    {id: 'm-guillem', quien: 'montse', tipo: 'mensaje', cliente: 'guillem', titulo: 'Guillem Roig', corto: 'Guillem', sale: true, chat: 'guillem',
      quienEs: 'Buyer',
      cita: {texto: 'Can you confirm Wednesday\'s viewing?', origen: 'Guillem · today, 8:12'},
      borrador: 'Hi Guillem, it\'s Montse. Confirmed: Wednesday at 18:00 at Muntaner 214. We\'ll meet at the door.',
      boton: {texto: 'Open WhatsApp with the message'}, secundarios: [{texto: 'Edit', ir: 'mensaje/m-guillem'}, otra],
      fila: 'Guillem Roig', filaSub: 'Confirm Wednesday\'s viewing', lineas: {enviada: 'Sent to Guillem'}},
    {id: 'm-silvia', quien: 'montse', tipo: 'llamada', cliente: 'silvia', titulo: 'Sílvia Prat', corto: 'Sílvia', nota: false,
      quienEs: 'Buyer · Sant Gervasi penthouse',
      antes: ['Offered €520,000 for the penthouse.', 'The owner is asking €545,000.', 'On Friday she said she\'d think about it.'],
      boton: {texto: 'Call Sílvia', accion: 'llamar'}, secundarios: [{texto: 'See the profile', ir: 'cliente/silvia'}, otra],
      fila: 'Sílvia Prat', filaSub: 'Call', lineas: {hecha: 'Call with Sílvia'}}
  ];

  // G1 · las decisiones del equipo (4)
  D.cola.equipo = [
    {id: 'd-carmen', quien: 'equipo', tipo: 'asunto', cliente: 'carmen', titulo: 'Carmen López', corto: 'Carmen', nota: false, chat: 'carmen',
      quienEs: 'Nobody is handling her', etiqueta: 'por-decidir', etiquetaTexto: 'You have to decide',
      momento: 'Nobody has replied to her since yesterday, 19:10.',
      cita: {texto: 'Looking for a 3-bedroom flat in Gràcia, up to €450,000', origen: 'Carmen · Office WhatsApp · yesterday, 19:10'},
      propone: 'I would give this one to Laura: she looks after Gràcia. It matches a flat you already have: Verdi 42.',
      boton: {texto: 'Give her to Laura', accion: 'asignar'}, secundarios: [{texto: 'See what happened', ir: 'asunto/carmen'}, otra],
      otraCosa: [{texto: 'Give her to someone else', hoja: 'h35'}, {texto: 'I\'ll handle it', llevoYo: true},
        {texto: 'For later', estado: 'para-manana', linea: 'For later · Carmen López'}, {texto: 'Dismiss it', estado: 'quitada', linea: 'Dismissed · Carmen López'}],
      fila: 'Carmen López', filaSub: 'Nobody has handled her since yesterday', lineas: {hecha: 'Carmen López, assigned to Laura'},
      alResolver: {flag: 'carmen-asignada'}},
    {id: 'd-regla', quien: 'equipo', tipo: 'regla', titulo: 'Flat report the next day', icono: 'estrella', nota: false,
      quienEs: 'A job for the office', etiqueta: 'por-decidir', etiquetaTexto: 'You have to decide',
      resumen: 'When someone asks for a valuation, I prepare the flat report for the next day and the agent sends it.',
      get propone() { return VETA.dir.proponeRegla() + '. 23 valuation requests have come in; Laura has done it by hand 14 times.'; },
      boton: {texto: 'See the cases and decide', ir: 'regla-oficina/dossier'},
      fila: 'A job for the whole office', get filaSub() { return 'Flat report the next day · ' + (VETA.dir.laPropuso() ? 'Laura suggests it' : 'I suggest it'); }, ficha: 'regla-oficina/dossier', lineas: {hecha: 'Decided · Flat report the next day'}},
    {id: 'd-teresa', quien: 'equipo', tipo: 'reparto', titulo: 'Teresa Gil is on leave', av: 'teresa', nota: false,
      quienEs: 'Her clients, with no one looking after them', etiqueta: 'por-decidir', etiquetaTexto: 'You have to decide',
      resumen: 'Since Monday 16. She has 34 open conversations with 12 clients and 3 viewings this week.',
      propone: 'I would pass them to Laura, who works in the same office.',
      boton: {texto: 'Pass her clients to someone else', ir: 'reparto'},
      fila: 'Teresa is on leave', filaSub: '34 unattended conversations', ficha: 'reparto', lineas: {hecha: 'Teresa\'s clients, passed on'}},
    {id: 'd-joan', quien: 'equipo', tipo: 'queja', cliente: 'joan-serra', titulo: 'Complaint from Joan Serra', corto: 'Joan', nota: false, chat: 'joan-serra',
      quienEs: 'Owner complaint', etiqueta: 'por-decidir', etiquetaTexto: 'You have to decide',
      // sin citar el chat de Marc: dirección lo sabe porque saltó su aviso de quejas
      resumen: 'I alerted you on Saturday at 20:05, as you asked: an owner is complaining. They have had no news about the flat for ten days.',
      pie: 'Marc handles it.',
      boton: {texto: 'Ask Marc to call him today', accion: 'pedir-marc'}, secundarios: [{texto: 'See what happened', ir: 'asunto/joan-serra'}, otra],
      otraCosa: [{texto: 'I\'ll call him', estado: 'hecha', linea: 'Joan Serra · you call him'}, {texto: 'For later', estado: 'para-manana', linea: 'For later · Joan Serra'},
        {texto: 'Dismiss it', estado: 'quitada', linea: 'Dismissed · complaint from Joan Serra'}],
      fila: 'Complaint from Joan Serra, owner', filaSub: 'Marc handles it · Saturday 21, 20:05', ficha: 'asunto/joan-serra', lineas: {hecha: 'Asked Marc: call Joan Serra today'},
      alResolver: {flag: 'marc-llama-joan'}}
  ];

  D.espera = D.espera || {};
  D.espera.montse = [
    {id: 'em-guillem', quien: 'montse', tipo: 'espera', fechaISO: '2026-11-25', fecha: 'Wed 25', cliente: 'guillem', titulo: 'Guillem Roig', texto: 'Viewing'},
    {id: 'em-ruben', quien: 'montse', tipo: 'espera', fechaISO: '2026-11-27', fecha: 'Fri 27', cliente: 'ruben', titulo: 'Rubén Gil', texto: 'You call him'},
    {id: 'em-silvia', quien: 'montse', tipo: 'espera', fechaISO: '2026-11-30', fecha: 'Mon 30', cliente: 'silvia', titulo: 'Sílvia Prat', texto: 'Reply from the bank'}
  ];

  // contactos sin responder (5), de ellos 3 sin dueño
  D.contactos = [
    {id: 'carmen', nombre: 'Carmen López', sinDueno: true, cita: 'Looking for a 3-bedroom flat in Gràcia, up to €450,000', cuando: 'yesterday, 19:10', propone: 'laura'},
    {id: 'pau-rios', nombre: 'Pau Ríos', sinDueno: true, cita: 'Do you have any commercial unit to rent in the Eixample?', cuando: 'Saturday 21, 13:20', propone: 'david'},
    {id: 'lucia', nombre: 'Lucía Gómez', sinDueno: true, cita: 'I want to sell my parents\' flat in Sant Gervasi. How do you work?', cuando: 'today, 7:40', propone: 'marc'},
    {id: 'ramon', nombre: 'Ramon Pujol', sinDueno: false, lleva: 'teresa', cita: 'Is Thursday\'s viewing still on?', cuando: 'yesterday, 17:30'},
    {id: 'sin-nombre', nombre: 'Unnamed number', sinDueno: false, cita: 'Price of the Verdi flat?', cuando: 'today, 8:55'}
  ];

  // las 12 operaciones (Clientes › Todos): 6 en marcha + 4 paradas + 1 cerrada + 1 caída
  D.operaciones = [
    {cliente: 'marta', texto: 'Purchase in Gràcia', lleva: 'laura', estado: 'en-marcha', estadoTexto: 'In use', oficina: 'gracia'},
    {cliente: 'elena', texto: 'Purchase in Gràcia', lleva: 'laura', estado: 'en-marcha', estadoTexto: 'In use', oficina: 'gracia'},
    {cliente: 'pere', texto: 'Sale of Verdi 42', lleva: 'laura', estado: 'en-marcha', estadoTexto: 'In use', oficina: 'gracia'},
    {cliente: 'jordi', texto: 'Purchase in Sants', lleva: 'laura', estado: 'en-marcha', estadoTexto: 'In use', oficina: 'gracia'},
    {cliente: 'laia', texto: 'Purchase in Poblenou', lleva: 'laura', estado: 'en-marcha', estadoTexto: 'In progress · signing on 1 Dec', oficina: 'gracia'},
    {cliente: 'ruben', texto: 'Sale of the Sant Gervasi penthouse', lleva: 'montse', estado: 'en-marcha', estadoTexto: 'In use', oficina: 'santgervasi'},
    {cliente: 'albert', texto: 'Looking for a commercial unit', lleva: 'laura', estado: 'parado', estadoTexto: 'Stalled · 7 weeks · Contact stage', oficina: 'gracia'},
    {cliente: 'dani-prats', texto: 'Purchase in Gràcia', lleva: 'teresa', estado: 'parado', estadoTexto: 'Stalled · 9 days · Viewings stage', oficina: 'gracia'},
    {cliente: 'rosa-vila', texto: 'Sale in Gràcia', lleva: 'teresa', estado: 'parado', estadoTexto: 'Stalled · 12 days · Viewings stage', oficina: 'gracia'},
    {cliente: 'joan-serra', texto: 'Sale of the Sant Cugat house', lleva: 'marc', estado: 'parado', estadoTexto: 'Stalled · 10 days · Offer stage · complaint', oficina: 'santgervasi'},
    {cliente: 'carme-font', texto: 'Sale in Horta', lleva: 'laura', estado: 'cerrado', estadoTexto: 'Closed · June', oficina: 'gracia'},
    {cliente: 'claudia', texto: 'Purchase in Sants', lleva: 'marc', estado: 'caida', estadoTexto: 'Fell through · 12 Nov', oficina: 'santgervasi'}
  ];

  // G13 · un caso para aprender
  // los hitos, sin citar el chat (Clàudia era clienta de Marc: dirección no lee los chats de cada persona)
  D.casoClaudia = [
    {cuando: '3 Nov, 18:20', texto: 'Asks to see the flat on Olzinelles street'},
    {cuando: '4 Nov, 9:15', texto: 'She\'s offered a viewing'},
    {cuando: '4 to 11 Nov', texto: 'Waits for a call that never comes'},
    {cuando: '12 Nov, 10:02', texto: 'Says she\'s already found another flat'}
  ];

  // los ocho números de la oficina (los del backend, con cifras inventadas)
  D.numeros = {
    nombres: ['Things I have seen', 'Messages and tasks ready', 'Completed', 'Awaiting approval', 'Corrections', 'Done without anyone touching them', 'Tasks I am following', 'Office jobs'],
    ventanas: {'7d': 'Last 7 days', desde: 'Since we started'},
    '7d': [184, 156, 132, 19, 14, 0, 23, 1],
    desde: [1196, 1012, 861, 24, 97, 0, 41, 6],
    semanaAnterior: {texto: '9 to 15 November', preparados: 141, completados: 118},
    porOficina: {gracia: {preparados: 92, completados: 78}, santgervasi: {preparados: 64, completados: 54}}
  };

  // H34 · los temas de hoy (elige hasta 3)
  D.temas = [
    {id: 'esperando', texto: 'Waiting for a reply', cifra: '11'}, {id: 'promesas', texto: 'Promises with no record', cifra: '7'},
    {id: 'quieren', texto: 'Want to sell or buy', cifra: '9'}, // la cifra de contactos sale de lo mismo que “Lo que entra” (baja al asignar)
    {id: 'contactos', texto: 'New contacts, no reply', get cifra() { return String(VETA.dir.sinResponder().length); }},
    {id: 'respuesta', texto: 'Usual response time', cifra: '2 h 40 min'}, {id: 'visitas', texto: 'Unconfirmed viewings', cifra: '4'}
  ];
  D.temasIniciales = ['contactos', 'promesas', 'visitas'];

  // tiempos (solo con la etiqueta “Ejemplo”; el código hace la cuenta, no se escribe el resultado a mano)
  D.tiempos = {
    laura: [{id: 'mensajes', texto: 'Messages prepared', n: 27, minEjemplo: 4}, {id: 'actas', texto: 'Viewing notes', n: 3, minEjemplo: 12}, {id: 'avisos', texto: 'Alerts and reminders', n: 4, minEjemplo: 2}],
    equipo: {minutos: 765, conTiempos: 4, personas: 6, costeEjemplo: 35}
  };

  // H41 · informe a socios
  D.partes = D.partes || {};
  D.partes.socios = {titulo: 'Partners report · November', bloques: [
    {lista: ['Read: 212 chats', 'Replied: 94 in the last week', 'Promises: 12 found, 7 with no record', 'Starting point: on day 0 there were 46 cards per week']}]};
})();
