/* Veta demo · datos · dia.js
   6.4 · la cola de Laura (seis cosas), En espera (seis) y lo que se “dicta” (6.5).
   Una “cosa” la pinta VETA.UI.tarjetaCosa. Campos: id, quien, tipo (mensaje · visita · informe · oportunidad · promesa ·
   bloqueada · llamada · asunto · regla · reparto · queja · espera), cliente, titulo, corto, quienEs, etiqueta, cita, chat,
   momento, piso, pisoTexto, saber, encaja, resumen, borrador, bloqueo, nota, pie, boton, secundarios, sale (sale hacia fuera:
   pregunta “¿Lo enviaste?” y dice “No lo envié”), fila/filaSub (la fila cuando espera turno), lineas (texto al resolver)
   y alResolver (lo que cambia en otras pantallas cuando se envía o se hace: tabla 6.8; lo aplica modelo.js). */
(function () {
  'use strict';
  const D = VETA.datos;
  const otra = {texto: 'Something else…', hoja: 'h02'};

  D.cola = D.cola || {};
  D.cola.laura = [
    {id: 'c-marta', quien: 'laura', tipo: 'mensaje', cliente: 'marta', titulo: 'Marta Puig', corto: 'Marta', sale: true,
      quienEs: 'Buyer · Gràcia flat', etiqueta: 'sin-responder', chat: 'marta',
      cita: {texto: 'Is the Gràcia flat still available? We could see it this Saturday', origen: 'Marta · yesterday, 18:42'},
      borrador: 'Hi Marta, it\'s Laura. Does this Saturday at 11:00 work for you to see the Gràcia flat? I\'ll send you the address.',
      boton: {texto: 'Open WhatsApp with the message'}, secundarios: [{texto: 'Edit', ir: 'mensaje/c-marta'}, otra],
      fila: 'Marta Puig', filaSub: 'Wants to see the Gràcia flat',
      lineas: {enviada: 'Sent to Marta', 'para-manana': 'For tomorrow · Marta'},
      alResolver: {estado: {marta: 'esperando'},
        espera: [{id: 'e-marta', fechaISO: '2026-11-26', fecha: 'Thu 26', cliente: 'marta', titulo: 'Marta Puig', texto: 'Waiting for her reply'}],
        historia: [{cliente: 'marta', cuando: 'Today', tipo: 'You', texto: 'Message sent: proposal to see the flat on Saturday at 11:00'}]}},
    {id: 'c-elena', quien: 'laura', tipo: 'visita', cliente: 'elena', titulo: 'Elena Vives', corto: 'Elena', chat: 'elena',
      momento: 'Viewing with Elena Vives · today, 9:00', piso: 'verdi', pisoTexto: 'Gràcia flat · c/ Verdi 42, 3.º 2.ª',
      saber: 'What you know about her: looking for 2 bright bedrooms. She\'s worried about street noise.', deSusChats: true,
      pie: 'When you come out, tell me how it went.', nota: false,
      boton: {texto: 'Tell me how it went', ir: 'dictar/acta'}, secundarios: [{texto: 'See the profile', ir: 'cliente/elena'}, otra],
      fila: '9:00 · Viewing with Elena Vives', filaSub: 'Tell me how it went afterwards',
      lineas: {hecha: 'Saved · Viewing notes for Elena'},
      alResolver: {estado: {elena: 'al-dia'}, siguiente: {elena: {texto: 'Up to date · you call her on Thursday 26'}},
        espera: [{id: 'e-llamar-elena', fechaISO: '2026-11-26', fecha: 'Thu 26', cliente: 'elena', titulo: 'Call Elena', texto: 'Confirm whether she\'s coming back on Saturday with her partner', etiqueta: 'tuya'}],
        historia: [{cliente: 'elena', cuando: 'Today', tipo: 'Notes', texto: 'Viewing at Verdi 42: she loves the light; worried about the noise'},
          {cliente: 'pere', cuando: 'Today', tipo: 'Notes', texto: 'Elena Vives\'s viewing at Verdi 42'}],
        regla: {id: 'r-actas', caso: 'Today · Elena Vives'}}},
    {id: 'c-pere', quien: 'laura', tipo: 'informe', cliente: 'pere', titulo: 'Pere Soler', corto: 'Pere', sale: true, nota: false, chat: 'pere',
      piso: 'verdi', pisoTexto: 'c/ Verdi 42, 3.º 2.ª', quienEs: 'Owner · Gràcia flat',
      cita: {texto: 'Laura, could you update me every Monday on how it\'s going? That way I won\'t call you so much.', origen: 'Pere · 2 Oct, 19:20'},
      resumen: 'Week of 16 to 22: 3 viewings. All 3 think the price is high.',
      boton: {texto: 'See the report for Pere', ir: 'informe/pere'}, secundarios: [{texto: 'See the profile', ir: 'cliente/pere'}, otra],
      fila: 'Pere Soler', filaSub: 'Weekly report',
      lineas: {enviada: 'Sent to Pere'},
      alResolver: {siguiente: {pere: {texto: 'The energy certificate is missing', boton: {texto: 'Ask Pere for it', hoja: 'h14'}}},
        historia: [{cliente: 'pere', cuando: 'Today', tipo: 'Report', texto: 'Report sent'}]}},
    {id: 'c-nuria', quien: 'laura', tipo: 'oportunidad', cliente: 'nuria', titulo: 'Núria Camps', corto: 'Núria', sale: true, nota: false, chat: 'nuria',
      quienEs: 'Buyer · Sant Antoni with a balcony', etiqueta: 'oportunidad',
      cita: {texto: 'If something comes up in Sant Antoni with a balcony, let me know', origen: 'Núria · 3 Nov, 20:15'},
      encaja: {titulo: 'Matches a flat that came in yesterday', piso: 'santantoni', texto: 'Sant Antoni · 2 bedrooms · balcony · €289,000'},
      borrador: 'Hi Núria, it\'s Laura. A flat has come in in Sant Antoni with a balcony: 2 bedrooms, €289,000. Shall I send you photos?',
      // la misma forma de enviar que Marta: Veta abre el WhatsApp de Laura con el texto escrito (decisión del 21-nov)
      boton: {texto: 'Open WhatsApp with the message'}, secundarios: [{texto: 'See the profile', ir: 'cliente/nuria'}, otra],
      fila: 'Núria Camps', filaSub: 'A flat that fits her has come in',
      lineas: {enviada: 'Sent to Núria'},
      alResolver: {estado: {nuria: 'esperando'}, historia: [{cliente: 'nuria', cuando: 'Today', tipo: 'You', texto: 'You told her about the Sant Antoni flat'}]}},
    {id: 'c-jordi', quien: 'laura', tipo: 'promesa', cliente: 'jordi', titulo: 'Jordi Ferrer', corto: 'Jordi', sale: true, chat: 'jordi',
      quienEs: 'Buyer · Sants flat', etiqueta: 'prometiste',
      cita: {texto: 'Can you send me the flat report before Thursday? I want to show it to my sister', origen: 'Jordi · Fri 20, 12:05'},
      borrador: 'Hi Jordi, it\'s Laura. Here is the report for the Olzinelles flat: plans and land registry extract.',
      pie: 'Attach the PDF yourself in WhatsApp',
      boton: {texto: 'Open WhatsApp with the message'}, secundarios: [{texto: 'Edit', ir: 'mensaje/c-jordi'}, otra],
      // el mensaje cambia una vez (el 409 del servidor): el paquete A pone esto en extra con VETA.modelo.marca
      cambio: {aviso: 'Jordi just wrote to you: “Can you add the community fees?”. I\'ve redone the message: take another look.',
        borradorHtml: 'Hi Jordi, it\'s Laura. Here is the report for the Olzinelles flat: plans, land registry extract <mark>and community fees</mark>.'},
      fila: 'Jordi Ferrer', filaSub: 'Flat report before Thursday',
      lineas: {enviada: 'Sent to Jordi'},
      alResolver: {estado: {jordi: 'esperando'}, historia: [{cliente: 'jordi', cuando: 'Today', tipo: 'You', texto: 'Flat report sent: plans, land registry extract and community fees'}]}},
    {id: 'c-sergi', quien: 'laura', tipo: 'bloqueada', cliente: 'sergi', titulo: 'Sergi Mas', corto: 'Sergi', nota: false, chat: 'sergi', sinPrisa: true,
      quienEs: 'New contact · rental in Les Corts', etiqueta: 'no-se-puede',
      cita: {texto: 'Hi, does the Les Corts rental allow pets?', origen: 'Sergi · 9 Nov, 21:48'},
      bloqueo: 'Can\'t be sent: Anna Costa already replied to him on Friday 20 at 12:15.',
      boton: {texto: 'Remove from Today', accion: 'quitar'}, secundarios: [{texto: 'See where this comes from', hoja: 'h01'}],
      fila: 'Sergi Mas', filaSub: 'And 1 more, no rush',
      lineas: {quitada: 'Removed · Sergi already had a reply'}}
  ];

  // aparece en el Hoy de Laura cuando Montse le asigna a Carmen (flag “carmen-asignada”). Texto del borrador: inventado por el núcleo.
  D.colaExtra = {
    'c-carmen': {id: 'c-carmen', quien: 'laura', tipo: 'mensaje', cliente: 'carmen', titulo: 'Carmen López', corto: 'Carmen', sale: true, chat: 'carmen',
      quienEs: 'Montse assigned her to you', etiqueta: 'sin-responder',
      cita: {texto: 'Looking for a 3-bedroom flat in Gràcia, up to €450,000', origen: 'Carmen · Office WhatsApp · yesterday, 19:10'},
      borrador: 'Hi Carmen, it\'s Laura, from the agency. We have a 3-bedroom flat in Gràcia that fits what you\'re looking for, on Verdi street. Does it suit you to see it this week?',
      boton: {texto: 'Open WhatsApp with the message'}, secundarios: [{texto: 'Edit', ir: 'mensaje/c-carmen'}, otra],
      fila: 'Carmen López', filaSub: 'Montse assigned her to you', lineas: {enviada: 'Sent to Carmen'},
      alResolver: {estado: {carmen: 'esperando'}}}
  };

  // A7 · En espera, al empezar (6), por fecha
  D.espera = D.espera || {};
  D.espera.laura = [
    {id: 'e-elena', quien: 'laura', tipo: 'espera', fechaISO: '2026-11-25', fecha: 'Wed 25', cliente: 'elena', titulo: 'Elena Vives', texto: 'Promised the payslip for the bank',
      depende: 'Now it\'s up to Elena.', chat: 'elena-nomina', cita: {texto: 'I\'ll send you the payslip on Wednesday', origen: 'Elena · Mon 16, 19:02'},
      borrador: 'Hi Elena, it\'s Laura. Have you managed to find the payslip? The bank needs it to continue.',
      boton: {texto: 'Prepare a reminder for Elena'}, secundarios: [{texto: 'It was kept', accion: 'se-cumplio'}, otra],
      lineas: {hecha: 'You\'ll have it in Today on Wednesday at 9:00'}},
    {id: 'e-pere', quien: 'laura', tipo: 'espera', fechaISO: '2026-11-27', fecha: 'Fri 27', cliente: 'pere', titulo: 'Pere Soler', texto: 'Energy certificate deadline',
      resumen: 'If it is not done by Friday, management will see 1 thing stalled, without your name or the client\'s.', boton: {texto: 'Ask Pere for it', hoja: 'h14'}},
    {id: 'e-jordi', quien: 'laura', tipo: 'espera', fechaISO: '2026-11-30', fecha: 'Mon 30', cliente: 'jordi', titulo: 'Jordi Ferrer', texto: 'Land registry extract requested from the Registry'},
    {id: 'e-laia', quien: 'laura', tipo: 'espera', fechaISO: '2026-12-01', fecha: 'Tue 1 Dec', cliente: 'laia', titulo: 'Laia Casas', texto: 'Signing at the notary, 12:00'},
    {id: 'e-pere-encargo', quien: 'laura', tipo: 'espera', fechaISO: '2026-12-02', fecha: 'Wed 2 Dec', cliente: 'pere', titulo: 'Pere Soler', texto: 'Sale mandate expires'},
    {id: 'e-nuria', quien: 'laura', tipo: 'espera', fechaISO: '2026-12-03', fecha: 'Thu 3 Dec', cliente: 'nuria', titulo: 'Núria Camps', texto: 'Said he\'d call you when he\'s back'}
  ];

  // 6.5 · lo que se “dicta” (guiones de #/dictar/<guion>)
  D.dictados = {
    acta: {frase: 'I\'ve just left the Verdi flat with Elena. She loved the light in the living room, the terrace and the renovated kitchen. She\'s worried about street noise at night and that there\'s no lift. She wants to come back on Saturday afternoon with her partner to hear the street. Call her on Thursday to confirm.', va: 'acta/elena'},
    tarea: {frase: 'Remind me to call Jordi on Thursday at ten.', va: 'entendido-dictado/tarea'},
    nota: {frase: 'Pere prefers me to call him in the afternoon, after four.', va: 'entendido-dictado/nota'},
    orden: {frase: 'When a buyer doesn\'t reply to me in three days, prepare a reminder for me.', va: 'entendido/recordatorios'},
    pregunta: {frase: 'What did I promise Jordi?', va: 'pregunta/jordi'},
    aviso: {frase: 'Let me know when a new contact has gone two hours without a reply.', va: 'avisos', papel: 'direccion'},
    operacion: {frase: 'How is Rubén\'s deal going?', va: 'cliente/ruben', papel: 'direccion'},
    queja: {frase: 'Log a complaint from Joan Serra: ten days without news.', va: 'cliente/joan-serra', papel: 'direccion'},
    mejorar: {frase: 'What could we improve this week?', va: 'veta', papel: 'direccion'}
  };

  // H06 / H41 · el parte de las 19:30 de Laura (texto fijo de la sección 3.6)
  D.partes = D.partes || {};
  D.partes['1930'] = {titulo: 'The 19:30 wrap-up', bloques: [
    {texto: 'Done 6 · Watching 8 · Moving to tomorrow 0'},
    {texto: 'Today you talked to Marta, Elena, Pere, Núria and Jordi.'},
    {titulo: 'You promised', texto: 'Call Elena on Thursday 26.'},
    {titulo: 'Due tomorrow', texto: 'Nothing.'},
    {titulo: 'This week', lista: ['Wed 25 · Elena\'s payslip', 'Thu 26 · call Elena and Marta\'s reply', 'Fri 27 · Pere\'s certificate']},
    {texto: 'I keep watching what\'s still open. Tomorrow you open the app and the urgent stuff is already prepared.'}]};
})();
