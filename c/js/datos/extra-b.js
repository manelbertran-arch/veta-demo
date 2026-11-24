/* Veta demo · datos · extra-b.js · paquete B (Clientes)
   Datos que el paquete B necesita y no están en js/datos/ (base, dia, clientes, veta, oficina), y VETA.B: las ayudas
   comunes de las pantallas y hojas del paquete (estado propio con prefijo «b.», el cliente con lo hecho en B, motivos,
   documentos e historia). Se añade a VETA.datos sin pisar lo que ya hay; cada dato nuevo está apuntado en ESTADO_B.md. */
(function () {
  'use strict';
  const D = VETA.datos;
  // las fechas no se escriben a mano (VETA.fecha): f(iso) → «Sáb 21», la cola de una fila · ff(iso) → «sáb 21», dentro de una frase
  const f = iso => VETA.fecha.corta(iso), ff = iso => VETA.fecha.corta(iso, {frase: true});

  // ---- un chat más para citar el mensaje de Pere del sábado (H01 lo abre con data-chat; era una nota de voz: pulido 2) ----
  D.chats = D.chats || {};
  if (!D.chats['pere-voz']) D.chats['pere-voz'] = {titulo: 'Chat de WhatsApp con Pere Soler', mensajes: [{texto: 'Laura, si hace falta para cerrar, bajo a 385.000 €, pero no menos.', cuando: ff('2026-11-21T21:10')}]};

  const b = D.b = {};

  // ---- A5 · el motivo de cada fila de Clientes: la segunda línea (al empezar, mientras esperas su respuesta y tras resolver su cosa) ----
  // Quien no está aquí lleva su `estadoTexto` («Parado · 7 semanas sin hablar») o lo último que hizo (`quienEs`).
  b.motivo = {
    marta: {inicial: 'Sin responder desde ayer', esperando: 'Le propusiste el sábado a las 11:00'},
    elena: {inicial: 'Visita hoy, 9:00'},
    pere: {inicial: 'Espera su informe', tras: 'Pedirle el certificado energético', pedido: 'Le pediste el certificado'},
    jordi: {inicial: 'Informe del piso, antes del jueves', esperando: 'Le pasaste el informe del piso'},
    nuria: {inicial: 'Le encaja un piso en Sant Antoni', esperando: 'Le contaste el piso de Sant Antoni'},
    sergi: {inicial: 'Anna Costa ya le contestó'},
    laia: {inicial: `Firma en notaría el ${ff('2026-12-01')}`},
    // los que solo han pasado por una visita: lo último, en un renglón (lo entero está en su ficha)
    toni: {inicial: `Visitó el ${ff('2026-11-19')}; quiere volver`},
    casals: {inicial: `Visitaron el ${ff('2026-11-21')}; lo ven caro`},
    'sergi-font': {inicial: `Visitó el ${ff('2026-11-17')}; lo ve caro`},
    carmen: {inicial: 'Te la ha asignado Montse', esperando: 'Le escribiste por el piso de Verdi'},
    ruben: {inicial: 'Pregunta por las visitas del ático'},
    guillem: {inicial: 'Confirmar la visita del miércoles'},
    silvia: {inicial: 'Su oferta por el ático'}
  };
  // orden de «quién te necesita» dentro de cada estado (el resto, detrás)
  b.orden = ['marta', 'elena', 'pere', 'jordi', 'nuria', 'albert', 'carmen', 'ruben', 'guillem', 'silvia'];

  // ---- A6 · cerrado (Carme): el mensaje para pedirle una recomendación (inventado por B) ----
  b.recomendacion = {
    'carme-font': {texto: 'Vendió en Horta en junio. Te escribió el 14 de noviembre para darte las gracias.',
      borrador: 'Hola, Carme, soy Laura. Me alegra mucho que todo saliera bien con la venta. Si alguien de tu entorno piensa en vender o comprar, ¿le pasarías mi contacto?'}
  };

  // ---- A6d · documentos y fechas ----
  b.docs = {
    pere: {
      docs: [
        {k: 'cert', texto: 'Certificado energético', falta: 'Falta el certificado energético', estado: 'falta', fecha: ff('2026-11-27'), plazo: `Plazo: ${ff('2026-11-27')}`, pedir: true, cosa: 'e-pere',
          borrador: 'Hola, Pere, soy Laura. Para anunciar el precio nuevo me falta el certificado energético. ¿Me lo puedes pasar antes del viernes?'},
        {k: 'nota', texto: 'Nota simple', falta: 'Falta la nota simple', estado: 'recibido', cuando: `Recibida el ${ff('2026-11-16')}`, reabrir: true, pedir: true, fecha: 'hoy', plazo: 'Reabierta: hay que pedirla otra vez',
          borrador: 'Hola, Pere, soy Laura. Necesito una nota simple más reciente del piso de Verdi. ¿La pido yo al Registro o la tienes tú?'},
        {k: 'encargo', texto: 'Encargo de venta', falta: 'Falta el encargo de venta', estado: 'recibido', cuando: `Recibido el ${ff('2026-09-02')}`}],
      fechas: [{cuando: f('2026-11-27'), texto: 'Plazo que dio para el certificado'}, {cuando: f('2026-12-02'), texto: 'Vence el encargo de venta'}]},
    elena: {
      docs: [{k: 'nomina', texto: 'Nómina, para el banco', falta: 'Falta la nómina', estado: 'falta', fecha: ff('2026-11-25'), plazo: `Quedó en pasártela el ${ff('2026-11-25')}`, pedir: true,
        borrador: 'Hola, Elena, soy Laura. ¿Me pasas la nómina cuando puedas? El banco la necesita para seguir.'}],
      fechas: [{cuando: f('2026-11-25'), texto: 'Quedó en pasarte la nómina'}]},
    jordi: {
      docs: [{k: 'nota', texto: 'Nota simple de Olzinelles', falta: 'Falta la nota simple', estado: 'falta', fecha: ff('2026-11-30'), plazo: `Pedida al Registro · llega el ${ff('2026-11-30')}`, pedir: false}],
      fechas: [{cuando: f('2026-11-26'), texto: 'Le prometiste el informe del piso'}, {cuando: f('2026-11-30'), texto: 'Llega la nota simple del Registro'}]},
    laia: {
      docs: [{k: 'arras', texto: 'Contrato de arras', falta: 'Falta el contrato de arras', estado: 'recibido', cuando: `Firmado el ${ff('2026-11-09')}`}],
      fechas: [{cuando: f('2026-12-01T12:00'), texto: 'Firma en notaría'}]}
  };

  // ---- A16 / H16 · actas e informes que se abren en detalle ----
  b.detalles = {
    'acta-elena': {tipo: 'acta', titulo: 'Acta de la visita · Elena Vives', cuando: `${f('2026-11-23T09:00')} · piso de Gràcia, c/ Verdi 42`,
      gusta: 'La luz del salón, la terraza y la cocina reformada.', preocupa: 'El ruido de la calle por la noche. Que no haya ascensor: es un tercero.',
      siguiente: 'Segunda visita el sábado por la tarde, con su pareja, para oír la calle.'},
    'acta-casals': {tipo: 'acta', titulo: 'Acta de la visita · Família Casals', cuando: `${f('2026-11-21')} · piso de Gràcia, c/ Verdi 42`,
      gusta: 'El piso en general y la terraza.', preocupa: 'El precio: lo ven caro.', siguiente: 'Lo hablan entre ellos y te dicen algo esta semana.'},
    'acta-toni': {tipo: 'acta', titulo: 'Acta de la visita · Toni Ribas', cuando: `${f('2026-11-19')} · piso de Gràcia, c/ Verdi 42`,
      gusta: 'La distribución y la terraza.', preocupa: 'El precio le parece alto. Quiere saber si se puede abrir la cocina al salón.', siguiente: 'Volverá con su arquitecto.'},
    'acta-sergi-font': {tipo: 'acta', titulo: 'Acta de la visita · Sergi Font', cuando: `${f('2026-11-17')} · piso de Gràcia, c/ Verdi 42`,
      gusta: 'La luz y la zona.', preocupa: 'Lo ve caro y sin ascensor.', siguiente: 'Por ahora no quiere volver.'},
    'informe-16': {tipo: 'informe', titulo: 'Informe de la semana, enviado', cuando: `${f('2026-11-16T09:30')} · WhatsApp`,
      texto: 'Hola, Pere. La semana pasada: 2 visitas. Les gusta la terraza; el precio les parece alto. ¿Lo hablamos el jueves?'},
    'informe-hoy': {tipo: 'informe', titulo: 'Informe de la semana, enviado', cuando: `${f('2026-11-23')} · WhatsApp`,
      texto: 'Hola, Pere. La semana pasada: 3 visitas. A los 3 les parece alto el precio. Toni Ribas volverá con su arquitecto. ¿Hablamos del precio el jueves?'}
  };

  // ---- A16 · historia propia (sustituye a la corta de clientes.js en estos clientes; lo vivo del modelo va delante) ----
  b.historia = {
    pere: [
      {cuando: f('2026-11-21'), tipo: 'Mensaje', titulo: 'Mensaje de Pere', texto: '«Si hace falta, bajo a 385.000 €»', hoja: 'h10'},
      {cuando: f('2026-11-21'), tipo: 'Acta', titulo: 'Acta de la visita · Família Casals', texto: 'Les gusta; lo ven caro', det: 'acta-casals'},
      {cuando: f('2026-11-19'), tipo: 'Acta', titulo: 'Acta de la visita · Toni Ribas', texto: 'Volverá con su arquitecto', det: 'acta-toni'},
      {cuando: f('2026-11-17'), tipo: 'Acta', titulo: 'Acta de la visita · Sergi Font', texto: 'Lo ve caro y sin ascensor', det: 'acta-sergi-font'},
      {cuando: f('2026-11-16'), tipo: 'Informe', titulo: 'Informe de la semana, enviado', texto: '2 visitas', det: 'informe-16'},
      {cuando: f('2026-09-02'), tipo: 'Encargo', titulo: 'Encargo de venta firmado', texto: `Vence el ${ff('2026-12-02')}`, papeles: true}],
    toni: [{cuando: f('2026-11-19'), tipo: 'Acta', titulo: 'Acta de la visita · Verdi 42', texto: 'Volverá con su arquitecto', det: 'acta-toni'}],
    casals: [{cuando: f('2026-11-21'), tipo: 'Acta', titulo: 'Acta de la visita · Verdi 42', texto: 'Les gusta; lo ven caro', det: 'acta-casals'}],
    'sergi-font': [{cuando: f('2026-11-17'), tipo: 'Acta', titulo: 'Acta de la visita · Verdi 42', texto: 'Lo ve caro y sin ascensor', det: 'acta-sergi-font'}]
  };
  // lo que añade el modelo al resolver (cliente|cosa): cómo se lee en la historia
  b.vivo = {
    'pere|c-elena': {tipo: 'Acta', titulo: 'Acta de la visita · Elena Vives', texto: 'Le gustó la luz; le preocupa el ruido', det: 'acta-elena'},
    'elena|c-elena': {tipo: 'Acta', titulo: 'Acta de la visita · Verdi 42', texto: 'Le gustó la luz; le preocupa el ruido', det: 'acta-elena'},
    'pere|c-pere': {tipo: 'Informe', titulo: 'Informe de la semana, enviado', texto: '3 visitas', det: 'informe-hoy'},
    // lo que enviaste hoy, en un renglón (el mensaje entero se abre al tocar)
    'marta|c-marta': {texto: 'Le propones el sábado a las 11:00'},
    'jordi|c-jordi': {texto: 'Le pasas el informe del piso'}
  };
  // «Lo que sé de…»: dos cosas como mucho, cada una con su cita (el texto es el nombre de una fila: 28 letras como mucho)
  b.sabe = {
    pere: [{texto: 'Quiere noticias cada lunes', cita: 'Laura, ¿me cuentas cada lunes cómo va? Así no te llamo tanto.', origen: `Pere · ${ff('2026-10-02T19:20')}`, chat: 'pere'},
      {texto: 'Puede bajar a 385.000 €', cita: 'Laura, si hace falta para cerrar, bajo a 385.000 €, pero no menos.', origen: `Pere · ${ff('2026-11-21T21:10')}`, chat: 'pere-voz'}],
    elena: [{texto: 'Busca dos habitaciones y luz', cita: 'Busco dos habitaciones, pero sobre todo luz.', origen: `Elena · ${ff('2026-11-12')}`, chat: 'elena'},
      {texto: 'Le preocupa el ruido', cita: '¿Se oye mucho la calle?', origen: `Elena · ${ff('2026-11-19')}`, chat: 'elena'}]
  };

  // ---- A5p · las tres preguntas preparadas (el resto, «no lo encuentro») ----
  b.preguntas = {
    jordi: {pregunta: '¿Qué le prometí a Jordi?', claves: [['jordi', 'promet']], cliente: 'jordi',
      respuesta: `Le prometiste el informe del piso antes del ${ff('2026-11-26')}.`,
      cita: {texto: 'Claro, te lo paso antes del jueves.', origen: `Tú · ${ff('2026-11-20T12:20')} · chat con Jordi`, chat: 'jordi'}},
    'sant-antoni': {pregunta: '¿Quién busca en Sant Antoni?', claves: [['sant antoni']], cliente: 'nuria',
      respuesta: 'Núria Camps busca en Sant Antoni, con balcón.',
      cita: {texto: 'Si sale algo en Sant Antoni con balcón, avísame, porfa.', origen: `Núria · ${ff('2026-11-03T20:15')}`, chat: 'nuria'}},
    verdi: {pregunta: '¿Qué visitas tuvo Verdi 42?', claves: [['verdi', 'visit']],
      respuesta: 'La semana pasada, 3 visitas. A los 3 les parece alto el precio.',
      filas: [{cliente: 'sergi-font', cuando: f('2026-11-17'), texto: 'Lo ve caro y sin ascensor'}, {cliente: 'toni', cuando: f('2026-11-19'), texto: 'Volverá con su arquitecto'},
        {cliente: 'casals', cuando: f('2026-11-21'), texto: 'Les gusta; lo ven caro'}],
      hoy: {cliente: 'elena', cuando: f('2026-11-23'), texto: 'Le gustó la luz; le preocupa el ruido'}}
  };

  // las de dirección: sobre los clientes de Montse (Rubén, Sílvia, Guillem), nunca sobre los chats de otra persona
  b.preguntasDir = {
    ruben: {pregunta: '¿Qué me preguntó Rubén?', claves: [['ruben']], cliente: 'ruben',
      respuesta: 'Rubén quiere saber si ha venido alguien a ver el ático esta semana.',
      cita: {texto: '¿Ha venido alguien a ver el ático esta semana?', origen: `Rubén · ${ff('2026-11-22T20:15')}`, chat: 'ruben'}},
    silvia: {pregunta: '¿Cuánto ofreció Sílvia?', claves: [['silvia'], ['ofrec', 'atico']], cliente: 'silvia',
      respuesta: 'Sílvia Prat ofreció 520.000 €. Rubén pide 545.000 €.',
      cita: {texto: 'Os ofrezco 520.000 € por el ático. Dejadme pensarlo el fin de semana.', origen: `Sílvia · ${ff('2026-11-20T18:40')}`, chat: 'silvia'}},
    guillem: {pregunta: '¿Cuándo viene Guillem?', claves: [['guillem']], cliente: 'guillem',
      respuesta: 'El miércoles. Guillem te pide que se la confirmes.',
      cita: {texto: '¿Me confirmas la visita del miércoles?', origen: `Guillem · ${ff('2026-11-23T08:12')}`, chat: 'guillem'}}
  };
  if (!D.chats.silvia) D.chats.silvia = {titulo: 'Chat de WhatsApp con Sílvia Prat', mensajes: [{texto: 'Os ofrezco 520.000 € por el ático. Dejadme pensarlo el fin de semana.', cuando: ff('2026-11-20T18:40')}]};

  // ---- H39 · lo que se apunta de una queja ----
  b.quejas = {'joan-serra': {texto: 'Lleva diez días sin noticias del piso. Dice que se irá a otra agencia si nadie le llama.'}};

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
  B.corto = c => (c && (c.corto || String(c.nombre || '').replace(/^Família\s+/, 'familia ').split(' ')[0])) || '';
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
  // el motivo de la fila de Clientes (su segunda línea): lo hecho hoy manda sobre lo que tocaba
  B.motivo = c => {
    const m = b.motivo[c.id] || {};
    if (c.bLlamada) return 'Hablasteis hoy';
    if (c.bResp) return 'Ya contestó';
    if (c.estado === 'esperando') return m.esperando || 'Esperas su respuesta';
    if (c.id === 'pere' && B.pedido('pere', 'cert')) return m.pedido;
    if (c.bCosaHecha) return m.tras || 'Hecho hoy';
    return m.inicial || c.estadoTexto || (c.quienEs !== 'Nada pendiente' && c.quienEs) || '';
  };
  // «Lo que sé de…»: lo apuntado en b.sabe; si no hay nada, la primera frase suya de su chat (sin texto: la fila dice «De dónde sale»)
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
  // «el certificado energético», «la nómina»: el papel con su artículo, para decir a qué se refiere un botón («Ya tengo la nómina»)
  B.sinFalta = d => String((d && (d.falta || d.texto)) || '').replace(/^Falta /, '');
  // hoy, con la forma de siempre: B.hoy() → «Hoy» · B.hoy('9:41') → «Hoy, 9:41» · B.hoy('9:41', true) → «hoy, 9:41» (dentro de una frase)
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
      .map(x => ({cuando: B.hoy(x.p.hora), tipo: 'Tú', texto: 'Le pides ' + B.sinFalta(x.d), doc: x.d.k, hoja: 'h16'}));
    return pedidos.concat(nuevas, propia).map((h, k) => Object.assign({k}, h, {
      titulo: h.titulo || (h.tipo === 'Tú' ? 'Tú' : h.tipo),
      hoja: h.quieta ? null : h.hoja || (h.det ? 'h16' : (h.tipo === 'Mensaje' || h.tipo === 'Tú') && c.chat ? 'h16' : null)
    }));
  };
})();
