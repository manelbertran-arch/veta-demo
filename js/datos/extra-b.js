/* Veta demo · datos · extra-b.js · paquete B (Clientes)
   Datos que el paquete B necesita y no están en js/datos/ (base, dia, clientes, veta, oficina), y VETA.B: las ayudas
   comunes de las pantallas y hojas del paquete (estado propio con prefijo «b.», el cliente con lo hecho en B, motivos,
   documentos e historia). Se añade a VETA.datos sin pisar lo que ya hay; cada dato nuevo está apuntado en ESTADO_B.md. */
(function () {
  'use strict';
  const D = VETA.datos;

  // ---- un chat más para citar el mensaje de Pere del sábado (H01 lo abre con data-chat; era una nota de voz: pulido 2) ----
  D.chats = D.chats || {};
  if (!D.chats['pere-voz']) D.chats['pere-voz'] = {titulo: 'Chat de WhatsApp con Pere Soler', mensajes: [{texto: 'Laura, si hace falta para cerrar, bajo a 385.000 €, pero no menos.', cuando: 'sáb 21, 21:10'}]};

  const b = D.b = {};

  // ---- A5 · la línea de motivo de cada fila (inicial y tras resolver su cosa) ----
  b.motivo = {
    marta: {inicial: 'sin responder desde ayer', esperando: 'le propusiste el sábado a las 11:00'},
    elena: {inicial: 'visita hoy, 9:00'},
    pere: {inicial: 'informe de la semana', tras: 'pedirle el certificado energético', pedido: 'le pediste el certificado'},
    jordi: {inicial: 'el informe del piso antes del jueves', esperando: 'le pasaste el informe del piso'},
    nuria: {inicial: 'le encaja un piso en Sant Antoni', esperando: 'le contaste el piso de Sant Antoni'},
    albert: {inicial: '7 semanas sin hablar'},
    carmen: {inicial: 'te la ha asignado Montse', esperando: 'le escribiste por el piso de Verdi'},
    ruben: {inicial: 'pregunta por las visitas del ático'},
    guillem: {inicial: 'confirmar la visita del miércoles'},
    silvia: {inicial: 'su oferta por el ático'}
  };
  // orden de «quién te necesita» dentro de cada estado (el resto, detrás)
  b.orden = ['marta', 'elena', 'pere', 'jordi', 'nuria', 'albert', 'carmen', 'ruben', 'guillem', 'silvia'];

  // ---- A6 · «Esperando respuesta»: qué le propusiste ----
  b.espera = {
    marta: 'Le propusiste ver el piso el sábado a las 11:00',
    nuria: 'Le contaste el piso de Sant Antoni',
    jordi: 'Le pasaste el informe del piso de Olzinelles',
    carmen: 'Le propusiste ver el piso de Verdi'
  };
  // ---- A6 · cerrado (Carme): el mensaje para pedirle una recomendación (inventado por B) ----
  b.recomendacion = {
    'carme-font': {texto: 'Vendió en Horta en junio. Te escribió el 14 de noviembre para darte las gracias.',
      borrador: 'Hola, Carme, soy Laura. Me alegra mucho que todo saliera bien con la venta. Si alguien de tu entorno piensa en vender o comprar, ¿le pasarías mi contacto?'}
  };

  // ---- A6d · documentos y fechas ----
  b.docs = {
    pere: {
      docs: [
        {k: 'cert', texto: 'Certificado energético', falta: 'Falta el certificado energético', estado: 'falta', fecha: 'vie 27', plazo: 'Plazo: vie 27', pedir: true, cosa: 'e-pere',
          borrador: 'Hola, Pere, soy Laura. Para anunciar el precio nuevo me falta el certificado energético. ¿Me lo puedes pasar antes del viernes?'},
        {k: 'nota', texto: 'Nota simple', falta: 'Falta la nota simple', estado: 'recibido', cuando: 'Recibida el 16 nov', reabrir: true, pedir: true, fecha: 'hoy', plazo: 'Reabierta: hay que pedirla otra vez',
          borrador: 'Hola, Pere, soy Laura. Necesito una nota simple más reciente del piso de Verdi. ¿La pido yo al Registro o la tienes tú?'},
        {k: 'encargo', texto: 'Encargo de venta', estado: 'recibido', cuando: 'Recibido el 2 sep'}],
      fechas: [{cuando: 'Vie 27 nov', texto: 'Plazo que dio para el certificado'}, {cuando: 'Mié 2 dic', texto: 'Vence el encargo de venta'}]},
    elena: {
      docs: [{k: 'nomina', texto: 'Nómina, para el banco', falta: 'Falta la nómina', estado: 'falta', fecha: 'mié 25', plazo: 'Quedó en pasártela el mié 25', pedir: true,
        borrador: 'Hola, Elena, soy Laura. ¿Me pasas la nómina cuando puedas? El banco la necesita para seguir.'}],
      fechas: [{cuando: 'Mié 25 nov', texto: 'Quedó en pasarte la nómina'}]},
    jordi: {
      docs: [{k: 'nota', texto: 'Nota simple de Olzinelles', falta: 'Falta la nota simple', estado: 'falta', fecha: 'lun 30', plazo: 'Pedida al Registro · llega el lun 30', pedir: false}],
      fechas: [{cuando: 'Jue 26 nov', texto: 'Le prometiste el informe del piso'}, {cuando: 'Lun 30 nov', texto: 'Llega la nota simple del Registro'}]},
    laia: {
      docs: [{k: 'arras', texto: 'Contrato de arras', estado: 'recibido', cuando: 'Firmado el 9 nov'}],
      fechas: [{cuando: 'Mar 1 dic, 12:00', texto: 'Firma en notaría'}]}
  };

  // ---- A16 / H16 · actas e informes que se abren en detalle ----
  b.detalles = {
    'acta-elena': {tipo: 'acta', titulo: 'Nota de la visita · Elena Vives', cuando: 'Hoy, 9:00 · piso de Gràcia, c/ Verdi 42',
      gusta: 'La luz del salón, la terraza y la cocina reformada.', preocupa: 'El ruido de la calle por la noche. Que no haya ascensor: es un tercero.',
      siguiente: 'Segunda visita el sábado por la tarde, con su pareja, para oír la calle.'},
    'acta-casals': {tipo: 'acta', titulo: 'Nota de la visita · Família Casals', cuando: 'Sáb 21 · piso de Gràcia, c/ Verdi 42',
      gusta: 'El piso en general y la terraza.', preocupa: 'El precio: lo ven caro.', siguiente: 'Lo hablan entre ellos y te dicen algo esta semana.'},
    'acta-toni': {tipo: 'acta', titulo: 'Nota de la visita · Toni Ribas', cuando: 'Jue 19 · piso de Gràcia, c/ Verdi 42',
      gusta: 'La distribución y la terraza.', preocupa: 'El precio le parece alto. Quiere saber si se puede abrir la cocina al salón.', siguiente: 'Volverá con su arquitecto.'},
    'acta-sergi-font': {tipo: 'acta', titulo: 'Nota de la visita · Sergi Font', cuando: 'Mar 17 · piso de Gràcia, c/ Verdi 42',
      gusta: 'La luz y la zona.', preocupa: 'Lo ve caro y sin ascensor.', siguiente: 'Por ahora no quiere volver.'},
    'informe-16': {tipo: 'informe', titulo: 'Informe enviado a Pere', cuando: 'Lun 16, 9:30 · WhatsApp',
      texto: 'Hola, Pere. La semana pasada: 2 visitas. Les gusta la terraza; el precio les parece alto. ¿Lo hablamos el jueves?'},
    'informe-hoy': {tipo: 'informe', titulo: 'Informe enviado a Pere', cuando: 'Hoy · WhatsApp',
      texto: 'Hola, Pere. La semana pasada: 3 visitas. A los 3 les parece alto el precio. Toni Ribas volverá con su arquitecto. ¿Hablamos del precio el jueves?'}
  };

  // ---- A16 · historia propia (sustituye a la corta de clientes.js en estos clientes; lo vivo del modelo va delante) ----
  b.historia = {
    pere: [
      {cuando: 'Sáb 21', tipo: 'Mensaje', titulo: 'Mensaje de Pere', texto: '«Si hace falta, bajo a 385.000 €»', hoja: 'h10'},
      {cuando: 'Sáb 21', tipo: 'Acta', titulo: 'Nota de la visita · Família Casals', texto: 'Les gusta; lo ven caro', det: 'acta-casals'},
      {cuando: 'Jue 19', tipo: 'Acta', titulo: 'Nota de la visita · Toni Ribas', texto: 'Volverá con su arquitecto', det: 'acta-toni'},
      {cuando: 'Mar 17', tipo: 'Acta', titulo: 'Nota de la visita · Sergi Font', texto: 'Lo ve caro y sin ascensor', det: 'acta-sergi-font'},
      {cuando: 'Lun 16', tipo: 'Informe', titulo: 'Informe enviado a Pere', texto: '2 visitas', det: 'informe-16'},
      {cuando: '2 sep', tipo: 'Encargo', titulo: 'Encargo de venta firmado', texto: 'Vence el 2 de diciembre'}],
    toni: [{cuando: 'Jue 19', tipo: 'Acta', titulo: 'Nota de la visita · Verdi 42', texto: 'Volverá con su arquitecto', det: 'acta-toni'}],
    casals: [{cuando: 'Sáb 21', tipo: 'Acta', titulo: 'Nota de la visita · Verdi 42', texto: 'Les gusta; lo ven caro', det: 'acta-casals'}],
    'sergi-font': [{cuando: 'Mar 17', tipo: 'Acta', titulo: 'Nota de la visita · Verdi 42', texto: 'Lo ve caro y sin ascensor', det: 'acta-sergi-font'}]
  };
  // lo que añade el modelo al resolver (cliente|cosa): cómo se lee en la historia
  b.vivo = {
    'pere|c-elena': {tipo: 'Acta', titulo: 'Nota de la visita · Elena Vives', texto: 'Le gustó la luz; le preocupa el ruido', det: 'acta-elena'},
    'elena|c-elena': {tipo: 'Acta', titulo: 'Nota de la visita · Verdi 42', texto: 'Le gustó la luz; le preocupa el ruido', det: 'acta-elena'},
    'pere|c-pere': {tipo: 'Informe', titulo: 'Informe enviado a Pere', texto: '3 visitas', det: 'informe-hoy'}
  };
  // «Lo que sé de…»: dos líneas como mucho, cada una con su cita
  b.sabe = {
    pere: [{texto: 'Quiere saber cada lunes cómo va el piso.', cita: 'Laura, ¿me cuentas cada lunes cómo va? Así no te llamo tanto.', origen: 'Pere · 2 oct, 19:20', chat: 'pere'},
      {texto: 'Puede bajar a 385.000 €, no menos.', cita: 'Laura, si hace falta para cerrar, bajo a 385.000 €, pero no menos.', origen: 'Pere · sáb 21, 21:10', chat: 'pere-voz'}],
    elena: [{texto: 'Busca dos habitaciones; lo que más le importa es la luz.', cita: 'Busco dos habitaciones, pero sobre todo luz.', origen: 'Elena · 12 nov', chat: 'elena'},
      {texto: 'Le preocupa el ruido de la calle.', cita: '¿Se oye mucho la calle?', origen: 'Elena · 19 nov', chat: 'elena'}]
  };

  // ---- A5p · las tres preguntas preparadas (el resto, «no lo encuentro») ----
  b.preguntas = {
    jordi: {pregunta: '¿Qué le prometí a Jordi?', claves: [['jordi', 'promet']], cliente: 'jordi',
      respuesta: 'Le prometiste el informe del piso antes del jueves 26.',
      cita: {texto: 'Claro, te lo paso antes del jueves.', origen: 'Tú · vie 20 nov, 12:20 · chat con Jordi Ferrer', chat: 'jordi'}},
    'sant-antoni': {pregunta: '¿Quién busca en Sant Antoni?', claves: [['sant antoni']], cliente: 'nuria',
      respuesta: 'Núria Camps busca en Sant Antoni, con balcón.',
      cita: {texto: 'Si sale algo en Sant Antoni con balcón, avísame, porfa.', origen: 'Núria · 3 nov, 20:15 · chat con Núria Camps', chat: 'nuria'}},
    verdi: {pregunta: '¿Qué visitas tuvo el piso de Verdi?', claves: [['verdi', 'visit']],
      respuesta: 'La semana pasada, 3 visitas. A los 3 les parece alto el precio.',
      filas: [{cliente: 'sergi-font', cuando: 'Mar 17', texto: 'Lo ve caro y sin ascensor'}, {cliente: 'toni', cuando: 'Jue 19', texto: 'Volverá con su arquitecto'},
        {cliente: 'casals', cuando: 'Sáb 21', texto: 'Les gusta; lo ven caro'}],
      hoy: {cliente: 'elena', cuando: 'Hoy', texto: 'Le gustó la luz; le preocupa el ruido'}}
  };

  // las de dirección: sobre los clientes de Montse (Rubén, Sílvia, Guillem), nunca sobre los chats de otra persona
  b.preguntasDir = {
    ruben: {pregunta: '¿Qué me preguntó Rubén?', claves: [['ruben']], cliente: 'ruben',
      respuesta: 'Rubén quiere saber si ha venido alguien a ver el ático esta semana.',
      cita: {texto: '¿Ha venido alguien a ver el ático esta semana?', origen: 'Rubén · ayer, 20:15 · chat con Rubén Gil', chat: 'ruben'}},
    silvia: {pregunta: '¿Cuánto ofreció Sílvia por el ático?', claves: [['silvia'], ['ofrec', 'atico']], cliente: 'silvia',
      respuesta: 'Sílvia Prat ofreció 520.000 €. Rubén pide 545.000 €.',
      cita: {texto: 'Os ofrezco 520.000 € por el ático. Dejadme pensarlo el fin de semana.', origen: 'Sílvia · vie 20, 18:40 · chat con Sílvia Prat', chat: 'silvia'}},
    guillem: {pregunta: '¿Cuándo es la visita de Guillem?', claves: [['guillem']], cliente: 'guillem',
      respuesta: 'El miércoles. Guillem te pide que se la confirmes.',
      cita: {texto: '¿Me confirmas la visita del miércoles?', origen: 'Guillem · hoy, 8:12 · chat con Guillem Roig', chat: 'guillem'}}
  };
  if (!D.chats.silvia) D.chats.silvia = {titulo: 'Chat de WhatsApp con Sílvia Prat', mensajes: [{texto: 'Os ofrezco 520.000 € por el ático. Dejadme pensarlo el fin de semana.', cuando: 'vie 20, 18:40'}]};

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
  // la línea de motivo de la fila de Clientes
  B.motivo = c => {
    const m = b.motivo[c.id] || {};
    if (c.estado === 'esperando') return m.esperando || 'esperas su respuesta';
    if (c.id === 'pere' && B.pedido('pere', 'cert')) return m.pedido;
    if (c.bCosaHecha && m.tras) return m.tras;
    if (c.estado === 'al-dia' && c.bLlamada) return 'hablasteis hoy';
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
      .map(x => ({cuando: 'Hoy', tipo: 'Tú', titulo: 'Tú · por WhatsApp', texto: 'Le pides ' + String(x.d.falta || x.d.texto).replace(/^Falta /, ''), quieta: true}));
    return pedidos.concat(nuevas, propia).map((h, k) => Object.assign({k}, h, {
      titulo: h.titulo || (h.tipo === 'Tú' ? 'Tú' : h.tipo),
      hoja: h.quieta ? null : h.hoja || (h.det ? 'h16' : (h.tipo === 'Mensaje' || h.tipo === 'Tú') && c.chat ? 'h16' : null)
    }));
  };
})();
