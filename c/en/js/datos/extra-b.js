/* Veta demo · datos · extra-b.js · paquete B (Clientes)
   Datos que el paquete B necesita y no están en js/datos/ (base, dia, clientes, veta, oficina), y VETA.B: las ayudas
   comunes de las pantallas y hojas del paquete (estado propio con prefijo “b.”, el cliente con lo hecho en B, motivos,
   documentos e historia). Se añade a VETA.datos sin pisar lo que ya hay; cada dato nuevo está apuntado en ESTADO_B.md. */
(function () {
  'use strict';
  const D = VETA.datos;
  // las fechas no se escriben a mano (VETA.fecha): f(iso) → “Sáb 21”, la cola de una fila · ff(iso) → “sáb 21”, dentro de una frase
  const f = iso => VETA.fecha.corta(iso), ff = iso => VETA.fecha.corta(iso, {frase: true});

  // ---- un chat más para citar el mensaje de Pere del sábado (H01 lo abre con data-chat; era una nota de voz: pulido 2) ----
  D.chats = D.chats || {};
  if (!D.chats['pere-voz']) D.chats['pere-voz'] = {titulo: 'WhatsApp chat with Pere Soler', mensajes: [{texto: 'Laura, if I need to, to close, I\'ll go down to €385,000, but no lower.', cuando: ff('2026-11-21T21:10')}]};

  const b = D.b = {};

  // ---- A5 · el motivo de cada fila de Clientes: la segunda línea (al empezar, mientras esperas su respuesta y tras resolver su cosa) ----
  // Quien no está aquí lleva su `estadoTexto` (“Parado · 7 semanas sin hablar”) o lo último que hizo (`quienEs`).
  b.motivo = {
    marta: {inicial: 'No reply since yesterday', esperando: 'You offered Saturday at 11:00'},
    elena: {inicial: 'Viewing today, 9:00'},
    pere: {inicial: 'Expecting his report', tras: 'Ask him for the energy certificate', pedido: 'You asked him for the certificate'},
    jordi: {inicial: 'Flat report, before Thursday', esperando: 'You sent him the flat report'},
    nuria: {inicial: 'A flat in Sant Antoni suits her', esperando: 'You told her about the Sant Antoni flat'},
    sergi: {inicial: 'Anna Costa already replied'},
    laia: {inicial: `Signing at the notary on ${ff('2026-12-01')}`},
    // los que solo han pasado por una visita: lo último, en un renglón (lo entero está en su ficha)
    toni: {inicial: `Viewed on ${ff('2026-11-19')}; wants to come back`},
    casals: {inicial: `Viewed on ${ff('2026-11-21')}; find it expensive`},
    'sergi-font': {inicial: `Viewed on ${ff('2026-11-17')}; finds it expensive`},
    carmen: {inicial: 'Montse assigned her to you', esperando: 'You wrote to her about the Verdi flat'},
    ruben: {inicial: 'Asks about the penthouse viewings'},
    guillem: {inicial: 'Confirm Wednesday\'s viewing'},
    silvia: {inicial: 'Her offer on the penthouse'}
  };
  // orden de “quién te necesita” dentro de cada estado (el resto, detrás)
  b.orden = ['marta', 'elena', 'pere', 'jordi', 'nuria', 'albert', 'carmen', 'ruben', 'guillem', 'silvia'];

  // ---- A6 · cerrado (Carme): el mensaje para pedirle una recomendación (inventado por B) ----
  b.recomendacion = {
    'carme-font': {texto: `Sold in Horta in June. Wrote to you on ${ff('2026-11-14')} to thank you.`,
      borrador: 'Hi Carme, it\'s Laura. I\'m really glad everything went well with the sale. If anyone you know is thinking of selling or buying, would you give them my number?'}
  };

  // ---- A6d · documentos y fechas ----
  b.docs = {
    pere: {
      docs: [
        {k: 'cert', texto: 'Energy certificate', falta: 'Missing: the energy certificate', estado: 'falta', fecha: ff('2026-11-27'), plazo: `Deadline: ${ff('2026-11-27')}`, pedir: true, cosa: 'e-pere',
          borrador: 'Hi Pere, it\'s Laura. To post the new price I\'m missing the energy certificate. Can you send it to me before Friday?'},
        {k: 'nota', texto: 'Land registry extract', falta: 'Missing: the land registry extract', estado: 'recibido', cuando: `Received on ${ff('2026-11-16')}`, reabrir: true, pedir: true, fecha: 'today', plazo: 'Reopened: it has to be asked for again',
          borrador: 'Hi Pere, it\'s Laura. I need a newer land registry extract for the Verdi flat. Shall I ask the Registry for it, or do you have it?'},
        {k: 'encargo', texto: 'Sales mandate', falta: 'Sale mandate missing', estado: 'recibido', cuando: `Received on ${ff('2026-09-02')}`}],
      fechas: [{cuando: f('2026-11-27'), texto: 'Deadline he gave for the certificate'}, {cuando: f('2026-12-02'), texto: 'Sale mandate expires'}]},
    elena: {
      docs: [{k: 'nomina', texto: 'Payslip, for the bank', falta: 'Missing: the payslip', estado: 'falta', fecha: ff('2026-11-25'), plazo: `Said they'd pass it on to you on ${ff('2026-11-25')}`, pedir: true,
        borrador: 'Hi Elena, it\'s Laura. Can you send me the payslip when you can? The bank needs it to carry on.'}],
      fechas: [{cuando: f('2026-11-25'), texto: 'She said she would send you the payslip'}]},
    jordi: {
      docs: [{k: 'nota', texto: 'Land registry extract for Olzinelles', falta: 'Missing: the land registry extract', estado: 'falta', fecha: ff('2026-11-30'), plazo: `Requested from the Land Registry · arrives ${ff('2026-11-30')}`, pedir: false}],
      fechas: [{cuando: f('2026-11-26'), texto: 'You promised him the flat report'}, {cuando: f('2026-11-30'), texto: 'The land registry extract arrives from the Registry'}]},
    laia: {
      docs: [{k: 'arras', texto: 'Deposit contract', falta: 'Deposit contract missing', estado: 'recibido', cuando: `Signed on ${ff('2026-11-09')}`}],
      fechas: [{cuando: f('2026-12-01T12:00'), texto: 'Notary signing'}]}
  };

  // ---- A16 / H16 · actas e informes que se abren en detalle ----
  b.detalles = {
    'acta-elena': {tipo: 'acta', titulo: 'Viewing notes · Elena Vives', cuando: `${f('2026-11-23T09:00')} · flat in Gràcia, c/ Verdi 42`,
      gusta: 'The light in the living room, the terrace and the renovated kitchen.', preocupa: 'Street noise at night. That there\'s no lift: it\'s a third floor.',
      siguiente: 'Second viewing on Saturday afternoon, with her partner, to hear the street.'},
    'acta-casals': {tipo: 'acta', titulo: 'Viewing notes · Casals family', cuando: `${f('2026-11-21')} · flat in Gràcia, c/ Verdi 42`,
      gusta: 'The flat in general and the terrace.', preocupa: 'The price: they think it\'s expensive.', siguiente: 'They will talk it over and tell you something this week.'},
    'acta-toni': {tipo: 'acta', titulo: 'Viewing notes · Toni Ribas', cuando: `${f('2026-11-19')} · flat in Gràcia, c/ Verdi 42`,
      gusta: 'The layout and the terrace.', preocupa: 'He thinks the price is high. He wants to know if the kitchen can be opened into the living room.', siguiente: 'He will come back with his architect.'},
    'acta-sergi-font': {tipo: 'acta', titulo: 'Viewing notes · Sergi Font', cuando: `${f('2026-11-17')} · flat in Gràcia, c/ Verdi 42`,
      gusta: 'The light and the area.', preocupa: 'He thinks it\'s expensive and there is no lift.', siguiente: 'For now he does not want to come back.'},
    'informe-16': {tipo: 'informe', titulo: 'Weekly report, sent', cuando: `${f('2026-11-16T09:30')} · WhatsApp`,
      texto: 'Hi Pere. Last week: 2 viewings. They like the terrace; they think the price is high. Shall we talk on Thursday?'},
    'informe-hoy': {tipo: 'informe', titulo: 'Weekly report, sent', cuando: `${f('2026-11-23')} · WhatsApp`,
      texto: 'Hi Pere. Last week: 3 viewings. All 3 think the price is high. Toni Ribas will come back with his architect. Shall we talk about the price on Thursday?'}
  };

  // ---- A16 · historia propia (sustituye a la corta de clientes.js en estos clientes; lo vivo del modelo va delante) ----
  b.historia = {
    pere: [
      {cuando: f('2026-11-21'), tipo: 'Message', titulo: 'Message from Pere', texto: '“If needed, I\'ll drop to €385,000”', hoja: 'h10'},
      {cuando: f('2026-11-21'), tipo: 'Notes', titulo: 'Notes · Família Casals', texto: 'They find it expensive', det: 'acta-casals'},
      {cuando: f('2026-11-19'), tipo: 'Notes', titulo: 'Notes · Toni Ribas', texto: 'With his architect', det: 'acta-toni'},
      {cuando: f('2026-11-17'), tipo: 'Notes', titulo: 'Notes · Sergi Font', texto: 'Finds it pricey', det: 'acta-sergi-font'},
      {cuando: f('2026-11-16'), tipo: 'Report', titulo: 'Weekly report', texto: 'Sent', det: 'informe-16'},
      {cuando: f('2026-09-02'), tipo: 'Mandate', titulo: 'Sales mandate signed', texto: `Expires ${ff('2026-12-02')}`, papeles: true}],
    toni: [{cuando: f('2026-11-19'), tipo: 'Notes', titulo: 'Viewing notes · Verdi 42', texto: 'With his architect', det: 'acta-toni'}],
    casals: [{cuando: f('2026-11-21'), tipo: 'Notes', titulo: 'Viewing notes · Verdi 42', texto: 'They like it; find it expensive', det: 'acta-casals'}],
    'sergi-font': [{cuando: f('2026-11-17'), tipo: 'Notes', titulo: 'Viewing notes · Verdi 42', texto: 'Finds it pricey', det: 'acta-sergi-font'}]
  };
  // lo que añade el modelo al resolver (cliente|cosa): cómo se lee en la historia
  b.vivo = {
    'pere|c-elena': {tipo: 'Notes', titulo: 'Viewing notes · Elena Vives', texto: 'He liked the light; the noise worries him', det: 'acta-elena'},
    'elena|c-elena': {tipo: 'Notes', titulo: 'Viewing notes · Verdi 42', texto: 'He liked the light; the noise worries him', det: 'acta-elena'},
    'pere|c-pere': {tipo: 'Report', titulo: 'Weekly report, sent', texto: '3 viewings', det: 'informe-hoy'},
    // lo que enviaste hoy, en un renglón (el mensaje entero se abre al tocar)
    'marta|c-marta': {texto: 'You suggest Saturday at 11:00'},
    'jordi|c-jordi': {texto: 'You send them the flat report'}
  };
  // “Lo que sé de…”: dos cosas como mucho, cada una con su cita (el texto es el nombre de una fila: 28 letras como mucho)
  b.sabe = {
    pere: [{texto: 'Wants news every Monday', cita: 'Laura, could you update me every Monday on how it\'s going? That way I won\'t call you so much.', origen: `Pere · ${ff('2026-10-02T19:20')}`, chat: 'pere'},
      {texto: 'Can go down to €385,000', cita: 'Laura, if I need to, to close, I\'ll go down to €385,000, but no lower.', origen: `Pere · ${ff('2026-11-21T21:10')}`, chat: 'pere-voz'}],
    elena: [{texto: 'Wants two bedrooms and light', cita: 'I\'m looking for two bedrooms, but above all light.', origen: `Elena · ${ff('2026-11-12')}`, chat: 'elena'},
      {texto: 'Worried about the noise', cita: 'Can you hear the street much?', origen: `Elena · ${ff('2026-11-19')}`, chat: 'elena'}]
  };

  // ---- A5p · las tres preguntas preparadas (el resto, “no lo encuentro”) ----
  b.preguntas = {
    jordi: {pregunta: 'What did I promise Jordi?', claves: [['jordi', 'promis'], ['jordi', 'promet']], cliente: 'jordi',
      respuesta: `You promised him the flat report before ${ff('2026-11-26')}.`,
      cita: {texto: 'Sure, I\'ll send it before Thursday.', origen: `You · ${ff('2026-11-20T12:20')} · chat with Jordi`, chat: 'jordi'}},
    'sant-antoni': {pregunta: 'Who is looking in Sant Antoni?', claves: [['sant antoni']], cliente: 'nuria',
      respuesta: 'Núria Camps is looking in Sant Antoni, with a balcony.',
      cita: {texto: 'If anything comes up in Sant Antoni with a balcony, tell me, please.', origen: `Núria · ${ff('2026-11-03T20:15')}`, chat: 'nuria'}},
    verdi: {pregunta: 'What viewings did Verdi 42 get?', claves: [['verdi', 'visit'], ['verdi', 'view']],
      respuesta: 'Last week, 3 viewings. All 3 think the price is high.',
      filas: [{cliente: 'sergi-font', cuando: f('2026-11-17'), texto: 'Finds it expensive and without a lift'}, {cliente: 'toni', cuando: f('2026-11-19'), texto: 'He will come back with his architect'},
        {cliente: 'casals', cuando: f('2026-11-21'), texto: 'They like it; find it expensive'}],
      hoy: {cliente: 'elena', cuando: f('2026-11-23'), texto: 'He liked the light; the noise worries him'}}
  };

  // las de dirección: sobre los clientes de Montse (Rubén, Sílvia, Guillem), nunca sobre los chats de otra persona
  b.preguntasDir = {
    ruben: {pregunta: 'What did Rubén ask me?', claves: [['ruben']], cliente: 'ruben',
      respuesta: 'Rubén wants to know if anyone has come to see the penthouse this week.',
      cita: {texto: 'Has anyone come to see the penthouse this week?', origen: `Rubén · ${ff('2026-11-22T20:15')}`, chat: 'ruben'}},
    silvia: {pregunta: 'How much did Sílvia offer?', claves: [['silvia'], ['offer', 'penthouse'], ['offer', 'attic']], cliente: 'silvia',
      respuesta: 'Sílvia Prat offered €520,000. Rubén is asking €545,000.',
      cita: {texto: 'I offer you €520,000 for the penthouse. Let me think about it over the weekend.', origen: `Sílvia · ${ff('2026-11-20T18:40')}`, chat: 'silvia'}},
    guillem: {pregunta: 'When is Guillem coming?', claves: [['guillem']], cliente: 'guillem',
      respuesta: 'On Wednesday. Guillem asks you to confirm it.',
      cita: {texto: 'Can you confirm Wednesday\'s viewing?', origen: `Guillem · ${ff('2026-11-23T08:12')}`, chat: 'guillem'}}
  };
  if (!D.chats.silvia) D.chats.silvia = {titulo: 'WhatsApp chat with Sílvia Prat', mensajes: [{texto: 'I offer you €520,000 for the penthouse. Let me think about it over the weekend.', cuando: ff('2026-11-20T18:40')}]};

  // ---- H39 · lo que se apunta de una queja ----
  b.quejas = {'joan-serra': {texto: 'He has heard nothing about the flat for ten days. He says he will go to another agency if nobody calls him.'}};

  // =================================================================================================================
  // VETA.B · ayudas comunes del paquete B
  const B = VETA.B = {};
  const M = () => VETA.modelo;
  B.lee = (k, def) => VETA.est.lee('b.' + k, def);
  B.pon = (k, v) => VETA.est.pon('b.' + k, v);
  // un mapa guardado: B.mapa('llamada').albert
  B.mapa = k => B.lee(k, {}) || {};
  B.ponEn = (k, id, v) => { const m = Object.assign({}, B.mapa(k)); if (v == null) delete m[id]; else m[id] = v; B.pon(k, m); };
  B.norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[¿?¡!.,;:“”"]/g, ' ').replace(/\s+/g, ' ').trim();
  // las preguntas de ejemplo de quien mira (Laura: las suyas; dirección: las de Montse)
  B.preguntas = () => VETA.yo().papel === 'direccion' ? b.preguntasDir : b.preguntas;
  B.corto = c => (c && (c.corto || String(c.nombre || '').replace(/^Família\s+/, 'familia ').split(' ')[0])) || '';
  const CUENTAN = ['enviada', 'hecha'];

  // el cliente con lo que se hace dentro de B (llamada de Albert, “Ya respondió…”, petición de papeles)
  B.cli = id => {
    const c = M().cliente(id); if (!c) return null;
    const ll = B.mapa('llamada')[id], r = B.mapa('resp')[id];
    if (ll && ll.estado === 'hecha') { c.estado = 'al-dia'; c.bLlamada = ll; }
    const rVale = r && (!r.cosa || ((VETA.est.lee('cosas', {}) || {})[r.cosa] || {}).estado === 'hecha');
    if (rVale && c.estado === 'esperando') { c.estado = 'al-dia'; c.bResp = r; }
    c.bCosaHecha = !!(c.cosa && CUENTAN.includes(c.cosa.estado));
    return c;
  };
  // el motivo de la fila de Clientes (su segunda línea): lo hecho hoy manda sobre lo que tocaba
  B.motivo = c => {
    const m = b.motivo[c.id] || {};
    if (c.bLlamada) return 'You talked today';
    if (c.bResp) return 'They already replied';
    if (c.estado === 'esperando') return m.esperando || 'Waiting for her reply';
    if (c.id === 'pere' && B.pedido('pere', 'cert')) return m.pedido;
    if (c.bCosaHecha) return m.tras || 'Done today';
    return m.inicial || c.estadoTexto || (c.quienEs !== 'Nothing pending' && c.quienEs) || '';
  };
  // “Lo que sé de…”: lo apuntado en b.sabe; si no hay nada, la primera frase suya de su chat (sin texto: la fila dice “De dónde sale”)
  B.sabe = id => {
    if (b.sabe[id]) return b.sabe[id];
    const c = M().cliente(id), ch = c && c.chat && M().chat(c.chat), m = ch && ch.mensajes && ch.mensajes.find(x => !x.tu);
    return m ? [{cita: m.texto, origen: `${B.corto(c)} · ${m.cuando}`, chat: c.chat}] : [];
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
  // “el certificado energético”, “la nómina”: el papel con su artículo, para decir a qué se refiere un botón (“Ya tengo la nómina”)
  B.sinFalta = d => String((d && (d.falta || d.texto)) || '').replace(/^Missing: /, '');
  // hoy, con la forma de siempre: B.hoy() → “Hoy” · B.hoy('9:41') → “Hoy, 9:41” · B.hoy('9:41', true) → “hoy, 9:41” (dentro de una frase)
  B.hoy = (hora, frase) => VETA.fecha.corta(D.fecha.hoyISO + (hora ? 'T' + hora : ''), {frase: !!frase});
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
      .map(x => ({cuando: B.hoy(x.p.hora), tipo: 'You', texto: 'You ask for ' + B.sinFalta(x.d), doc: x.d.k, hoja: 'h16'}));
    return pedidos.concat(nuevas, propia).map((h, k) => Object.assign({k}, h, {
      titulo: h.titulo || (h.tipo === 'You' ? 'You' : h.tipo),
      hoja: h.quieta ? null : h.hoja || (h.det ? 'h16' : (h.tipo === 'Message' || h.tipo === 'You') && c.chat ? 'h16' : null)
    }));
  };
})();
