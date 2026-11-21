/* Veta demo · datos · extra-b.js · paquete B (Clientes)
   Datos que el paquete B necesita y no están en js/datos/ (base, dia, clientes, veta, oficina), y VETA.B: las ayudas
   comunes de las pantallas y hojas del paquete (estado propio con prefijo «b.», el cliente con lo hecho en B, motivos,
   documentos e historia). Se añade a VETA.datos sin pisar lo que ya hay; cada dato nuevo está apuntado en ESTADO_B.md. */
(function () {
  'use strict';
  const D = VETA.datos;

  // ---- un chat más para citar la nota de voz de Pere (H01 lo abre con data-chat) ----
  D.chats = D.chats || {};
  if (!D.chats['pere-voz']) D.chats['pere-voz'] = {titulo: 'Voice note from Pere Soler · WhatsApp', mensajes: [{texto: 'Laura, if it\'s needed to close, I\'ll go down to €385,000, but no lower.', cuando: 'Sat 21, 21:10'}]};

  const b = D.b = {};

  // ---- A5 · la línea de motivo de cada fila (inicial y tras resolver su cosa) ----
  b.motivo = {
    marta: {inicial: 'no reply since yesterday', esperando: 'you proposed Saturday at 11:00'},
    elena: {inicial: 'viewing today, 9:00'},
    pere: {inicial: 'weekly report', tras: 'ask him for the energy certificate', pedido: 'you asked him for the certificate'},
    jordi: {inicial: 'dossier before Thursday', esperando: 'you sent him the dossier'},
    nuria: {inicial: 'a flat in Sant Antoni fits her', esperando: 'you told her about the Sant Antoni flat'},
    albert: {inicial: '7 weeks without talking'},
    carmen: {inicial: 'Montse assigned her to you', esperando: 'you wrote to her about the Verdi flat'},
    ruben: {inicial: 'asks about the penthouse viewings'},
    guillem: {inicial: 'confirm Wednesday\'s viewing'},
    silvia: {inicial: 'her offer for the penthouse'}
  };
  // orden de «quién te necesita» dentro de cada estado (el resto, detrás)
  b.orden = ['marta', 'elena', 'pere', 'jordi', 'nuria', 'albert', 'carmen', 'ruben', 'guillem', 'silvia'];

  // ---- A6 · «Esperando respuesta»: qué le propusiste ----
  b.espera = {
    marta: 'You proposed seeing the flat on Saturday at 11:00',
    nuria: 'You told her about the Sant Antoni flat',
    jordi: 'You sent him the Olzinelles dossier',
    carmen: 'You proposed seeing the Verdi flat'
  };
  // ---- A6 · cerrado (Carme): el mensaje para pedirle una recomendación (inventado por B) ----
  b.recomendacion = {
    'carme-font': {texto: 'Sold in Horta in June. She wrote to you on 14 November to thank you.',
      borrador: 'Hi Carme, it\'s Laura. I\'m really glad everything went well with the sale. If anyone around you is thinking of selling or buying, would you pass on my contact?'}
  };

  // ---- A6d · documentos y fechas ----
  b.docs = {
    pere: {
      docs: [
        {k: 'cert', texto: 'Energy certificate', falta: 'The energy certificate is missing', estado: 'falta', fecha: 'Fri 27', plazo: 'Deadline: Fri 27', pedir: true, cosa: 'e-pere',
          borrador: 'Hi Pere, it\'s Laura. To advertise the new price I need the energy certificate. Can you send it to me before Friday?'},
        {k: 'nota', texto: 'Land registry extract', falta: 'The land registry extract is missing', estado: 'recibido', cuando: 'Received on 16 Nov', reabrir: true, pedir: true, fecha: 'hoy', plazo: 'Reopened: it has to be requested again',
          borrador: 'Hi Pere, it\'s Laura. I need a more recent land registry extract for the Verdi flat. Shall I request it from the Registry or do you have it?'},
        {k: 'encargo', texto: 'Sale mandate', estado: 'recibido', cuando: 'Received on 2 Sep'}],
      fechas: [{cuando: 'Fri 27 Nov', texto: 'Deadline he gave for the certificate'}, {cuando: 'Wed 2 Dec', texto: 'Sale mandate expires'}]},
    elena: {
      docs: [{k: 'nomina', texto: 'Payslip, for the bank', falta: 'The payslip is missing', estado: 'falta', fecha: 'Wed 25', plazo: 'Said she\'d send it on Wed 25', pedir: true,
        borrador: 'Hi Elena, it\'s Laura. Could you send me the payslip when you can? The bank needs it to continue.'}],
      fechas: [{cuando: 'Wed 25 Nov', texto: 'Said she\'d send you the payslip'}]},
    jordi: {
      docs: [{k: 'nota', texto: 'Land registry extract for Olzinelles', falta: 'The land registry extract is missing', estado: 'falta', fecha: 'Mon 30', plazo: 'Requested from the Registry · arrives Mon 30', pedir: false}],
      fechas: [{cuando: 'Thu 26 Nov', texto: 'You promised him the dossier'}, {cuando: 'Mon 30 Nov', texto: 'The land registry extract arrives'}]},
    laia: {
      docs: [{k: 'arras', texto: 'Deposit contract', estado: 'recibido', cuando: 'Signed on 9 Nov'}],
      fechas: [{cuando: 'Tue 1 Dec, 12:00', texto: 'Signing at the notary'}]}
  };

  // ---- A16 / H16 · actas e informes que se abren en detalle ----
  b.detalles = {
    'acta-elena': {tipo: 'acta', titulo: 'Notes · Elena Vives', cuando: 'Today, 9:00 · Gràcia flat, c/ Verdi 42',
      gusta: 'The light in the living room, the terrace and the renovated kitchen.', preocupa: 'Street noise at night. That there\'s no lift: it\'s a third floor.',
      siguiente: 'Second viewing on Saturday afternoon, with her partner, to hear the street.'},
    'acta-casals': {tipo: 'acta', titulo: 'Notes · Casals family', cuando: 'Sat 21 · Gràcia flat, c/ Verdi 42',
      gusta: 'The flat in general and the terrace.', preocupa: 'The price: they find it expensive.', siguiente: 'They\'ll talk it over and get back to you this week.'},
    'acta-toni': {tipo: 'acta', titulo: 'Notes · Toni Ribas', cuando: 'Thu 19 · Gràcia flat, c/ Verdi 42',
      gusta: 'The layout and the terrace.', preocupa: 'He finds the price high. He wants to know if the kitchen can be opened to the living room.', siguiente: 'He\'ll come back with his architect.'},
    'acta-sergi-font': {tipo: 'acta', titulo: 'Notes · Sergi Font', cuando: 'Tue 17 · Gràcia flat, c/ Verdi 42',
      gusta: 'The light and the area.', preocupa: 'Finds it expensive and without a lift.', siguiente: 'For now he doesn\'t want to come back.'},
    'informe-16': {tipo: 'informe', titulo: 'Report sent to Pere', cuando: 'Mon 16, 9:30 · WhatsApp',
      texto: 'Hi Pere. This week: 2 viewings. They like the terrace; they find the price high. Shall we talk on Thursday?'},
    'informe-hoy': {tipo: 'informe', titulo: 'Report sent to Pere', cuando: 'Today · WhatsApp',
      texto: 'Hi Pere. This week: 3 viewings. All 3 think the price is high. Toni Ribas will come back with his architect. Shall we talk about the price on Thursday?'}
  };

  // ---- A16 · historia propia (sustituye a la corta de clientes.js en estos clientes; lo vivo del modelo va delante) ----
  b.historia = {
    pere: [
      {cuando: 'Sat 21', tipo: 'Voice note', titulo: 'Pere\'s voice note · 0:48', texto: '“If needed, I\'ll go down to €385,000”', hoja: 'h10'},
      {cuando: 'Sat 21', tipo: 'Notes', titulo: 'Notes · Casals family', texto: 'They like it; find it expensive', det: 'acta-casals'},
      {cuando: 'Thu 19', tipo: 'Notes', titulo: 'Notes · Toni Ribas', texto: 'He\'ll come back with his architect', det: 'acta-toni'},
      {cuando: 'Tue 17', tipo: 'Notes', titulo: 'Notes · Sergi Font', texto: 'Finds it expensive and without a lift', det: 'acta-sergi-font'},
      {cuando: 'Mon 16', tipo: 'Report', titulo: 'Report sent to Pere', texto: '2 viewings', det: 'informe-16'},
      {cuando: '2 Sep', tipo: 'Mandate', titulo: 'Sale mandate signed', texto: 'Expires on 2 December'}],
    toni: [{cuando: 'Thu 19', tipo: 'Notes', titulo: 'Notes · viewing at Verdi 42', texto: 'He\'ll come back with his architect', det: 'acta-toni'}],
    casals: [{cuando: 'Sat 21', tipo: 'Notes', titulo: 'Notes · viewing at Verdi 42', texto: 'They like it; find it expensive', det: 'acta-casals'}],
    'sergi-font': [{cuando: 'Tue 17', tipo: 'Notes', titulo: 'Notes · viewing at Verdi 42', texto: 'Finds it expensive and without a lift', det: 'acta-sergi-font'}]
  };
  // lo que añade el modelo al resolver (cliente|cosa): cómo se lee en la historia
  b.vivo = {
    'pere|c-elena': {tipo: 'Notes', titulo: 'Notes · Elena Vives', texto: 'She liked the light; worried about the noise', det: 'acta-elena'},
    'elena|c-elena': {tipo: 'Notes', titulo: 'Notes · viewing at Verdi 42', texto: 'She liked the light; worried about the noise', det: 'acta-elena'},
    'pere|c-pere': {tipo: 'Report', titulo: 'Report sent to Pere', texto: '3 viewings', det: 'informe-hoy'}
  };
  // «Lo que sé de…»: dos líneas como mucho, cada una con su cita
  b.sabe = {
    pere: [{texto: 'Wants to know every Monday how the flat is doing.', cita: 'Laura, could you update me every Monday on how it\'s going? That way I won\'t call you so much.', origen: 'Pere · 2 Oct, 19:20', chat: 'pere'},
      {texto: 'Can go down to €385,000, no lower.', cita: 'Laura, if it\'s needed to close, I\'ll go down to €385,000, but no lower.', origen: 'Pere · Sat 21, 21:10', chat: 'pere-voz'}],
    elena: [{texto: 'Looking for two bedrooms; what matters most to her is light.', cita: 'I\'m looking for two bedrooms, but above all light.', origen: 'Elena · 12 Nov', chat: 'elena'},
      {texto: 'She\'s worried about street noise.', cita: 'Can you hear the street much?', origen: 'Elena · 19 Nov', chat: 'elena'}]
  };

  // ---- A5p · las tres preguntas preparadas (el resto, «no lo encuentro») ----
  b.preguntas = {
    jordi: {pregunta: 'What did I promise Jordi?', claves: [['jordi', 'promet'], ['jordi', 'promise']], cliente: 'jordi',
      respuesta: 'You promised him the dossier before Thursday 26.',
      cita: {texto: 'Sure, I\'ll send it before Thursday.', origen: 'You · Fri 20 Nov, 12:20 · chat with Jordi Ferrer', chat: 'jordi'}},
    'sant-antoni': {pregunta: 'Who is looking in Sant Antoni?', claves: [['sant antoni']], cliente: 'nuria',
      respuesta: 'Núria Camps is looking in Sant Antoni, with a balcony.',
      cita: {texto: 'If something comes up in Sant Antoni with a balcony, let me know, please.', origen: 'Núria · 3 Nov, 20:15 · chat with Núria Camps', chat: 'nuria'}},
    verdi: {pregunta: 'What viewings did the Verdi flat have?', claves: [['verdi', 'visit'], ['verdi', 'view']],
      respuesta: 'Last week, 3 viewings. All 3 think the price is high.',
      filas: [{cliente: 'sergi-font', cuando: 'Tue 17', texto: 'Finds it expensive and without a lift'}, {cliente: 'toni', cuando: 'Thu 19', texto: 'He\'ll come back with his architect'},
        {cliente: 'casals', cuando: 'Sat 21', texto: 'They like it; find it expensive'}],
      hoy: {cliente: 'elena', cuando: 'Today', texto: 'She liked the light; worried about the noise'}}
  };

  // las de dirección: sobre los clientes de Montse (Rubén, Sílvia, Guillem), nunca sobre los chats de otra persona
  b.preguntasDir = {
    ruben: {pregunta: 'What did Rubén ask me?', claves: [['ruben']], cliente: 'ruben',
      respuesta: 'Rubén wants to know if anyone came to see the penthouse this week.',
      cita: {texto: 'Has anyone come to see the penthouse this week?', origen: 'Rubén · yesterday, 20:15 · chat with Rubén Gil', chat: 'ruben'}},
    silvia: {pregunta: 'How much did Sílvia offer for the penthouse?', claves: [['silvia'], ['ofrec', 'atico'], ['offer', 'penthouse']], cliente: 'silvia',
      respuesta: 'Sílvia Prat offered €520,000. Rubén is asking €545,000.',
      cita: {texto: 'I\'m offering €520,000 for the penthouse. Let me think about it over the weekend.', origen: 'Sílvia · Fri 20, 18:40 · chat with Sílvia Prat', chat: 'silvia'}},
    guillem: {pregunta: 'When is Guillem\'s viewing?', claves: [['guillem']], cliente: 'guillem',
      respuesta: 'On Wednesday. Guillem asks you to confirm it.',
      cita: {texto: 'Can you confirm Wednesday\'s viewing?', origen: 'Guillem · today, 8:12 · chat with Guillem Roig', chat: 'guillem'}}
  };
  if (!D.chats.silvia) D.chats.silvia = {titulo: 'WhatsApp chat with Sílvia Prat', mensajes: [{texto: 'I\'m offering €520,000 for the penthouse. Let me think about it over the weekend.', cuando: 'Fri 20, 18:40'}]};

  // ---- H39 · lo que se apunta de una queja ----
  b.quejas = {'joan-serra': {texto: 'Ten days without news about the flat. He says he\'ll go to another agency if nobody calls him.'}};

  // =================================================================================================================
  // VETA.B · ayudas comunes del paquete B
  const B = VETA.B = {};
  const M = () => VETA.modelo;
  B.lee = (k, def) => VETA.est.lee('b.' + k, def);
  B.pon = (k, v) => VETA.est.pon('b.' + k, v);
  // un mapa guardado: B.mapa('llamada').albert
  B.mapa = k => B.lee(k, {}) || {};
  B.ponEn = (k, id, v) => { const m = Object.assign({}, B.mapa(k)); if (v == null) delete m[id]; else m[id] = v; B.pon(k, m); };
  B.norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[¿?¡!.,;:«»"]/g, ' ').replace(/\s+/g, ' ').trim();
  // las preguntas de ejemplo de quien mira (Laura: las suyas; dirección: las de Montse)
  B.preguntas = () => VETA.yo().papel === 'direccion' ? b.preguntasDir : b.preguntas;
  B.corto = c => (c && (c.corto || (/ family$/.test(c.nombre || '') ? 'the ' + c.nombre : String(c.nombre || '').split(' ')[0]))) || '';
  const CUENTAN = ['enviada', 'hecha'];

  // el cliente con lo que se hace dentro de B (llamada de Albert, «Ya respondió…», petición de papeles)
  B.cli = id => {
    const c = M().cliente(id); if (!c) return null;
    const ll = B.mapa('llamada')[id], r = B.mapa('resp')[id];
    if (ll && ll.estado === 'hecha') { c.estado = 'al-dia'; c.bLlamada = ll; }
    const rVale = r && (!r.cosa || ((VETA.est.lee('cosas', {}) || {})[r.cosa] || {}).estado === 'hecha');
    if (rVale && c.estado === 'esperando') { c.estado = 'al-dia'; c.bResp = r; }
    c.bCosaHecha = !!(c.cosa && CUENTAN.includes(c.cosa.estado));
    return c;
  };
  // la línea de motivo de la fila de Clientes
  B.motivo = c => {
    const m = b.motivo[c.id] || {};
    if (c.estado === 'esperando') return m.esperando || 'waiting for their reply';
    if (c.id === 'pere' && B.pedido('pere', 'cert')) return m.pedido;
    if (c.bCosaHecha && m.tras) return m.tras;
    if (c.estado === 'al-dia' && c.bLlamada) return 'you talked today';
    return m.inicial || c.estadoTexto || c.quienEs || '';
  };

  // documentos con su estado vivo (marcados recibidos, reabiertos, pedidos)
  B.docs = id => {
    const base = (b.docs[id] || {docs: []}).docs, vivo = B.mapa('docs');
    return base.map(d => {
      const v = vivo[id + '|' + d.k];
      return Object.assign({}, d, {estado: v ? v.estado : d.estado, hora: v ? v.hora : null, cambiado: !!v, pedido: B.pedido(id, d.k)});
    });
  };
  B.fechas = id => (b.docs[id] || {fechas: []}).fechas;
  B.faltan = id => B.docs(id).filter(d => d.estado === 'falta');
  // ¿ya se pidió este papel? (si va ligado a una cosa de En espera, manda su estado)
  B.pedido = (id, k) => {
    const d = ((b.docs[id] || {docs: []}).docs || []).find(x => x.k === k);
    if (d && d.cosa) { const c = M().cosa(d.cosa); return c && c.estado === 'enviada' ? {hora: c.hora} : null; }
    return B.mapa('pedidos')[id + '|' + k] || null;
  };

  // historia: lo vivo del modelo (con su lectura de b.vivo) y luego la propia o la de clientes.js
  B.historia = id => {
    const c = M().cliente(id); if (!c) return [];
    const base = (D.clientes[id] || {}).historia || [];
    const nuevas = c.historia.slice(0, Math.max(0, c.historia.length - base.length)).map(h => Object.assign({}, h, b.vivo[id + '|' + h.de] || {}, {cuando: h.cuando}));
    const propia = b.historia[id] || base.map(h => Object.assign({}, h));
    // lo que pediste desde H14 (va a su historia)
    const pedidos = ((b.docs[id] || {docs: []}).docs).map(d => ({d, p: B.pedido(id, d.k)})).filter(x => x.p)
      .map(x => ({cuando: 'Today', tipo: 'You', titulo: 'You · via WhatsApp', texto: 'You ask for ' + String(x.d.falta || x.d.texto).replace(/ is missing$/, '').replace(/^\w/, m => m.toLowerCase()), quieta: true}));
    return pedidos.concat(nuevas, propia).map((h, k) => Object.assign({k}, h, {
      titulo: h.titulo || (h.tipo === 'You' ? 'You' : h.tipo),
      hoja: h.quieta ? null : h.hoja || (h.det ? 'h16' : (h.tipo === 'Message' || h.tipo === 'You') && c.chat ? 'h16' : null)
    }));
  };
})();
