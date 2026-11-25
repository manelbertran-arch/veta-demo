/* Veta demo · datos · r6-direccion.js · ronda 6 · paquete D · Dirección (P3)
   Los datos nuevos de este paquete para la ronda 6, en VETA.datos.r6.direccion.
   Decisión de Manel (21-nov): dirección ve nombres, cada operación y cada persona. Sin podio ni puntuaciones; nunca el texto
   de los chats ni las notas de otra persona (los hechos se cuentan con palabras propias, sin citar).
   Reutiliza las cifras que ya tiene la app; lo inventado aquí está apuntado en ESTADO_R6_P3.md.
   Las operaciones de Laura son las de su app: su estado, lo que toca y lo último que pasó se leen del modelo cuando existen. */
(function () {
  'use strict';
  const f = iso => VETA.fecha.corta(iso), ff = iso => VETA.fecha.corta(iso, {frase: true});   // las fechas salen de VETA.fecha, no se escriben a mano
  const R = VETA.datos.r6 = VETA.datos.r6 || {};

  // ---- cada operación de la oficina (id = id del cliente). lleva: persona o null (nadie) ----
  // fase: paso de D.pasos[tipo] (1-5). aviso: {tipo, texto}; con `cosa`, el aviso se va cuando esa cosa se resuelve.
  // tipo dice lo que pasa, sin señalar a nadie: sin-contestar · queja · nadie (alguien espera respuesta: rojo y “hay que mirarla hoy”),
  // parada (hay que mirarla, sin rojo) · papel · espera (trabajo normal: se dice en neutro y NO cuenta como “hay que mirarla”).
  // hitos: lo ocurrido, del más antiguo al más nuevo (sin citar chats).
  const ops = [
    // Laura (las mismas de su app)
    {id: 'marta', lleva: 'laura', tipo: 'compra', fase: 1, texto: 'Purchase in Gràcia', estado: 'en-marcha', cosa: 'c-marta',
      aviso: {tipo: 'sin-contestar', texto: 'Not answered since yesterday, 18:42'}, contesto: 'Sent the time of the viewing',
      hitos: [{paso: 'Wrote', texto: 'Wants to see the Gràcia flat', cuando: f('2026-11-22T18:42')}, {paso: 'I prepared', texto: 'A message for Laura with the time', cuando: f('2026-11-22T18:43')}]},
    {id: 'elena', lleva: 'laura', tipo: 'compra', fase: 2, texto: 'Purchase in Gràcia', estado: 'en-marcha', cosa: 'c-elena',
      ultimo: {cuando: f('2026-11-16'), texto: 'Said the payslip would come on Wednesday'},
      aviso: {tipo: 'papel', texto: 'Missing document: the payslip, for Wed 25'},
      hitos: [{paso: 'Wrote', texto: 'Wants two bedrooms with light', cuando: f('2026-10-28')}, {paso: 'I noted', texto: 'A promise: the payslip, for the bank', cuando: f('2026-11-16')}, {paso: 'Today', texto: 'Viewing at 9:00 at Verdi 42', cuando: 'Today'}]},
    {id: 'pere', lleva: 'laura', tipo: 'venta', fase: 3, texto: 'Sale of Verdi 42', estado: 'en-marcha', cosa: 'c-pere',
      ultimo: {cuando: f('2026-11-21T21:10'), texto: 'Left a message'},
      aviso: {tipo: 'papel', texto: 'Missing document: the energy certificate, for Fri 27'},
      hitos: [{paso: 'Done', texto: 'Weekly report sent', cuando: f('2026-11-16')}, {paso: 'Wrote', texto: 'Left a message', cuando: f('2026-11-21T21:10')}, {paso: 'I prepared', texto: 'Weekly report for Laura', cuando: f('2026-11-23T07:00')}]},
    {id: 'jordi', lleva: 'laura', tipo: 'compra', fase: 2, texto: 'Purchase in Sants', estado: 'en-marcha', cosa: 'c-jordi',
      ultimo: {cuando: f('2026-11-20T12:20'), texto: 'Promised the flat report'},
      aviso: {tipo: 'papel', texto: 'A document is missing: the flat report, for Thursday'},
      hitos: [{paso: 'Wrote', texto: 'Asks for the report on the Olzinelles flat', cuando: f('2026-11-20T12:05')}, {paso: 'I noted', texto: 'Promised the flat report', cuando: f('2026-11-20T12:20')}]},
    {id: 'laia', lleva: 'laura', tipo: 'compra', fase: 5, texto: 'Purchase in Poblenou', estado: 'en-marcha',
      hitos: [{paso: 'Done', texto: 'Signed the deposit', cuando: f('2026-11-09')}, {paso: 'Next', texto: 'Signing at the notary', cuando: f('2026-12-01T12:00')}]},
    {id: 'albert', lleva: 'laura', tipo: 'compra', fase: 1, texto: 'Looking for commercial premises', estado: 'parado',
      ultimo: {cuando: f('2026-10-03'), texto: 'Asked to be told if premises came up'},
      aviso: {tipo: 'espera', texto: '7 weeks without talking · asked to be told'},
      hitos: [{paso: 'Wrote', texto: 'Asked to be told if premises came up in the centre', cuando: f('2026-10-03')}, {paso: 'I saw', texto: 'Premises came in that suit him', cuando: f('2026-11-12')}]},
    {id: 'carme-font', lleva: 'laura', tipo: 'venta', fase: 5, texto: 'Sale in Horta', estado: 'cerrado', toca: 'Nothing. We can ask them to recommend us',
      hitos: [{paso: 'Done', texto: 'Signed the sale in Horta', cuando: 'June'}]},
    // Montse (tú)
    {id: 'ruben', lleva: 'montse', tipo: 'venta', fase: 3, texto: 'Penthouse in Sant Gervasi', estado: 'en-marcha',
      ultimo: {cuando: f('2026-11-20'), texto: 'Sílvia made an offer; the owner is asking for more'}, toca: 'Call them on Fri 27 with the offer',
      hitos: [{paso: 'Viewing', texto: 'Sílvia Prat viewed the penthouse', cuando: f('2026-11-18')}, {paso: 'Offer', texto: 'Sílvia made an offer on the penthouse', cuando: f('2026-11-20')}]},
    {id: 'guillem', lleva: 'montse', tipo: 'compra', fase: 2, texto: 'Buying in Sant Gervasi', estado: 'en-marcha',
      ultimo: {cuando: f('2026-11-20'), texto: 'Arranged to see a flat'}, toca: 'Viewing on Wed 25',
      hitos: [{paso: 'Wrote', texto: 'Wants to see flats in Sant Gervasi', cuando: f('2026-11-16')}, {paso: 'I noted', texto: 'Viewing on Wed 25', cuando: f('2026-11-20')}]},
    // Anna
    {id: 'isabel-rius', nombre: 'Isabel Rius', lleva: 'anna', tipo: 'venta', fase: 2, texto: 'Sale in Sant Antoni', estado: 'en-marcha',
      ultimo: {cuando: 'Yesterday', texto: 'The flat came into the office'}, toca: 'Take the photos and publish the advert',
      hitos: [{paso: 'Done', texto: 'Anna signed the sale mandate', cuando: 'Yesterday'}, {paso: 'I saw', texto: 'Núria Camps wants exactly this', cuando: 'Today'}]},
    {id: 'sergi', lleva: 'anna', tipo: 'compra', fase: 1, texto: 'Renting in Les Corts', estado: 'en-marcha',
      ultimo: {cuando: 'Yesterday', texto: 'Anna replied'}, toca: 'Show him two flats this week',
      hitos: [{paso: 'Wrote', texto: 'Asks about a rental in Les Corts', cuando: f('2026-11-21')}, {paso: 'Done', texto: 'Anna replied', cuando: 'Yesterday'}]},
    // Marc
    {id: 'joan-serra', lleva: 'marc', tipo: 'venta', fase: 3, texto: 'Sale in Sant Cugat', estado: 'parado',
      ultimo: {cuando: f('2026-11-21T20:05'), texto: 'Complained: no one tells him anything'}, toca: 'Call Joan',
      aviso: {tipo: 'queja', texto: 'Owner complaint · 10 days with nothing happening'},
      hitos: [{paso: 'Viewing', texto: 'Last viewing at the house', cuando: f('2026-11-12')}, {paso: 'I saw', texto: 'Ten days without speaking to Joan', cuando: 'Yesterday'}, {paso: 'Wrote', texto: 'Complained: no one tells him anything', cuando: f('2026-11-21T20:05')}]},
    {id: 'pilar-grau', nombre: 'Pilar Grau', lleva: 'marc', tipo: 'compra', fase: 4, texto: 'Buying in Sarrià', estado: 'en-marcha',
      ultimo: {cuando: f('2026-11-20'), texto: 'Their offer was accepted'}, toca: 'Sign the deposit on Thu 26',
      hitos: [{paso: 'Offer', texto: 'Made an offer', cuando: f('2026-11-17')}, {paso: 'Done', texto: 'The owner accepted', cuando: f('2026-11-20')}]},
    {id: 'claudia', lleva: 'marc', tipo: 'compra', fase: 2, texto: 'Purchase in Sants', estado: 'caida', toca: 'Nothing. We can learn from this', caso: 'oficina/caso/claudia',
      ultimo: {cuando: f('2026-11-12'), texto: 'Said they had already found another flat'},
      hitos: [{paso: 'Wrote', texto: 'Asks to see the flat on Olzinelles street', cuando: f('2026-11-03')}, {paso: 'Done', texto: 'She\'s offered a viewing', cuando: f('2026-11-04')}, {paso: 'I saw', texto: 'Waits for a call that never comes', cuando: '4 to 11 Nov'}, {paso: 'Wrote', texto: 'Has already found another flat', cuando: f('2026-11-12')}]},
    // David
    {id: 'jaume-sala', nombre: 'Jaume Sala', lleva: 'david', tipo: 'compra', fase: 3, texto: 'Buying in Sant Gervasi', estado: 'en-marcha',
      ultimo: {cuando: f('2026-11-21'), texto: 'Made an offer on a flat'}, toca: 'Find out what the owner says tomorrow',
      hitos: [{paso: 'Viewing', texto: 'Second viewing of the flat', cuando: f('2026-11-19')}, {paso: 'Offer', texto: 'Made an offer', cuando: f('2026-11-21')}]},
    {id: 'marina-pons', nombre: 'Marina Pons', lleva: 'david', tipo: 'venta', fase: 2, texto: 'Selling in Sarrià', estado: 'en-marcha',
      ultimo: {cuando: f('2026-11-19'), texto: 'Signed the sale mandate'}, toca: 'Publish the advert',
      aviso: {tipo: 'papel', texto: 'A document is missing: the land registry extract'},
      hitos: [{paso: 'Done', texto: 'Signed the sale mandate', cuando: f('2026-11-19')}, {paso: 'I saw', texto: 'The land registry extract is missing for the advert', cuando: f('2026-11-20')}]},
    // Teresa (de baja desde el lunes 16): si se pasan sus clientes, las lleva quien los recibe
    {id: 'ramon', lleva: 'teresa', tipo: 'compra', fase: 2, texto: 'Purchase in Gràcia', estado: 'en-marcha',
      ultimo: {cuando: f('2026-11-22T17:30'), texto: 'Asked if Thursday\'s viewing is still on'}, toca: 'Reply today',
      aviso: {tipo: 'sin-contestar', texto: 'Not answered since yesterday, 17:30'},
      hitos: [{paso: 'Viewing', texto: 'Agreed with Teresa on Thursday', cuando: f('2026-11-13')}, {paso: 'Wrote', texto: 'Asks if the viewing is still on', cuando: f('2026-11-22T17:30')}]},
    {id: 'dani-prats', lleva: 'teresa', tipo: 'compra', fase: 2, texto: 'Purchase in Gràcia', estado: 'parado',
      ultimo: {cuando: f('2026-11-14'), texto: 'Viewed a flat on Torrent street'}, toca: 'Ask whether they are still looking',
      aviso: {tipo: 'parada', texto: '9 days with nothing happening'},
      hitos: [{paso: 'Viewing', texto: 'Viewed a flat on Torrent street', cuando: f('2026-11-14')}, {paso: 'I saw', texto: 'Since then, nobody has written to them', cuando: 'Today'}]},
    {id: 'rosa-vila', lleva: 'teresa', tipo: 'venta', fase: 3, texto: 'Sale in Gràcia', estado: 'parado',
      ultimo: {cuando: f('2026-11-11'), texto: 'Last viewing of their flat'}, toca: 'Tell them how the viewings are going',
      aviso: {tipo: 'parada', texto: '12 days with nothing happening'},
      hitos: [{paso: 'Viewing', texto: 'Last viewing of their flat', cuando: f('2026-11-11')}, {paso: 'I saw', texto: 'They have heard nothing since then', cuando: 'Today'}]},
    // sin nadie: los contactos nuevos sin dueño (los mismos de “Lo que entra”)
    {id: 'carmen', lleva: null, tipo: 'compra', fase: 1, texto: 'Looking for a flat in Gràcia', estado: 'en-marcha', contacto: true,
      ultimo: {cuando: f('2026-11-22T19:10'), texto: 'Wrote to the office WhatsApp'}, aviso: {tipo: 'nadie', texto: 'No one has her · wrote yesterday'},
      hitos: [{paso: 'Wrote', texto: 'Wants 3 bedrooms in Gràcia', cuando: f('2026-11-22T19:10')}, {paso: 'I saw', texto: 'Verdi 42 suits them and is in their area', cuando: f('2026-11-22T19:11')}]},
    {id: 'pau-rios', lleva: null, tipo: 'compra', fase: 1, texto: 'Unit in the Eixample', estado: 'en-marcha', contacto: true,
      ultimo: {cuando: f('2026-11-21T13:20'), texto: 'Wrote to the office WhatsApp'}, aviso: {tipo: 'nadie', texto: 'No one has him · wrote Sat 21'},
      hitos: [{paso: 'Wrote', texto: 'Looking for premises to let', cuando: f('2026-11-21T13:20')}]},
    {id: 'lucia', lleva: null, tipo: 'venta', fase: 1, texto: 'Selling in Sant Gervasi', estado: 'en-marcha', contacto: true,
      ultimo: {cuando: f('2026-11-23T07:40'), texto: 'Wrote to the office WhatsApp'}, aviso: {tipo: 'nadie', texto: 'No one has her · wrote today'},
      hitos: [{paso: 'Wrote', texto: 'Wants to sell her parents\' flat', cuando: f('2026-11-23T07:40')}]}
  ];

  // ---- cada persona: lo que Veta le hizo esta semana (suma 156, la cifra de Semana), y lo que aprendió (sin tiempos de respuesta por persona) ----
  const personas = {
    // Laura: 31 mensajes, 4 promesas y 3 actas, las mismas cifras de su pestaña Veta (“Lo que ya preparo yo”); 38 en total
    laura: {hace: {mensajes: 31, actas: 3, avisos: 4}, aprendido: [['r-actas', 'I ask her to tell me about each viewing when she leaves'], ['r-promesas', 'I note what people promise her and alert her if it does not arrive'],
      ['r-informes', 'I prepare each owner\'s report on Mondays'], ['r-cancelaciones', 'I suggest another date when a viewing is cancelled'], ['r-valoraciones', 'I prepare the flat report before a valuation']]},
    anna: {pendientes: 5, hace: {mensajes: 27, actas: 2, avisos: 5}, aprendido: [[null, 'In Sant Antoni, I send the floor plan before each viewing']]},
    marc: {pendientes: 7, hace: {mensajes: 25, actas: 2, avisos: 4}, aprendido: [[null, 'With owners, I suggest calling rather than writing']]},
    david: {pendientes: 4, hace: {mensajes: 24, actas: 1, avisos: 4}, aprendido: [[null, 'I confirm viewings the day before']]},
    montse: {hace: {mensajes: 20, actas: 1, avisos: 3}, aprendido: [[null, 'I put together the offers for the same flat']]},
    teresa: {pendientes: 34, hace: {mensajes: 0, actas: 0, avisos: 0}, aprendido: []}
  };

  // ---- trabajo que Veta ya hace por la oficina: cuatro semanas (la última y la anterior son las de Semana) ----
  const semanas = {etiquetas: [f('2026-10-26'), f('2026-11-02'), f('2026-11-09'), f('2026-11-16')], listos: [118, 127, 141, 156], corregidos: [21, 19, 16, 14]};

  // ---- lo que el equipo le pide a Veta: lo que hace a mano (los 43 de G12) y quién ----
  const pide = [
    {tema: 'Replying to new contacts', veces: 23, quien: 'Laura, Anna and David do it by hand'},
    {tema: 'Preparing the flat report', veces: 14, quien: 'Laura does it by hand'},
    {tema: 'Ask for the energy certificate', veces: 6, quien: 'Laura does it by hand'}
  ];

  // ---- antes y ahora de la oficina (G16): el primer informe (3 oct) frente a hoy · rotulado “Ejemplo” ----
  const antesAhora = {
    esperando: {antes: 31, hoy: 11, semanas: [31, 26, 22, 17, 14, 11]},
    promesas: {antes: 12, hoy: 7},
    primerInforme: {total: 31, retomados: 14, cerrados: 6, siguen: 11},
    decimos: 'We reply the same day',
    pasa: {mitad: '2 h 40 min', viernes: '11 h 30 min'}
  };

  R.direccion = {ops, personas, semanas, pide, antesAhora};

  // ---- utilidades de dirección para operaciones y personas (amplían VETA.dir; estado propio con prefijo “d.”) ----
  const X = VETA.dir, M = () => VETA.modelo, D = VETA.datos;
  const base = id => ops.find(o => o.id === id) || null;
  // rojo: alguien espera respuesta. mirar: pide que alguien haga algo hoy. Un papel con fecha o una promesa para el jueves, no.
  const ROJO = ['sin-contestar', 'queja', 'nadie'], MIRAR = ROJO.concat(['parada']);
  const sinPunto = t => String(t || '').replace(/\.$/, '');

  // quién la lleva ahora: lo que cambió dirección › el contacto asignado › la cartera de Teresa pasada › el dato
  const llevaOp = id => {
    const o = base(id); if (!o) return null;
    const cambio = X.lee('opLleva', {})[id]; if (cambio) return cambio.a;
    if (o.contacto) { const a = X.asignado(id); return a ? a.a : null; }
    if (o.lleva === 'teresa' && X.cartera()) {
      const a = X.carteraA();
      if (a !== 'dos') return a;
      const deTeresa = ops.filter(x => x.lleva === 'teresa');
      return deTeresa.indexOf(o) % 2 ? 'anna' : 'laura';
    }
    return o.lleva;
  };

  const resuelta = o => {
    if (o.cosa) { const c = M().cosa(o.cosa); return !!c && X.RES.includes(c.estado) && c.estado !== 'para-manana'; }
    if (o.contacto) return !!llevaOp(o.id) || (X.aparcado(o.id) || {}).que === 'descartado';   // descartado: ya no hay que mirarlo
    return false;
  };

  // lo que se ve de una operación (sin texto de chats ni actas: de lo que hizo la agente se dice el hecho)
  const hechoDe = (h, quien) => h.tipo === 'Notes' ? quien + ' saved the viewing notes' : sinPunto(h.texto);
  const op = id => {
    const o = base(id); if (!o) return null;
    const c = M().cliente(id), lleva = llevaOp(id), p = lleva ? X.persona(lleva) : null;
    const quien = p ? p.corto : 'Someone';
    // contestada: alguien esperaba respuesta y quien la lleva ya envió el mensaje. Es la misma señal que usa Hoy para “Enviado a Marta · 9:41”
    // (la cosa en estado 'enviada', con su hora). Con “No lo envié” la cosa vuelve a por hacer y todo esto se deshace solo.
    // Dirección ve que contestó y cuándo; nunca el texto del mensaje (o.contesto lo cuenta con palabras propias).
    const cs = o.cosa ? M().cosa(o.cosa) : null, pila = String((c && c.nombre) || o.nombre || '').split(' ')[0];
    const contestada = o.aviso && o.aviso.tipo === 'sin-contestar' && cs && cs.estado === 'enviada' ? {hora: cs.hora} : null;
    const nuevos = ((c && c.historia) || []).filter(h => h.de && !(contestada && h.de === o.cosa));   // lo que ha pasado hoy en la app de quien la lleva
    const limpio = ((c && c.historia) || []).find(h => !h.de && h.texto && h.texto.charAt(0) !== '“');
    const ultimo = contestada ? {cuando: 'Today, ' + contestada.hora, texto: quien + ' replied'}
      : nuevos.length ? {cuando: nuevos[0].cuando, texto: hechoDe(nuevos[0], quien)} : (o.ultimo || (limpio ? {cuando: limpio.cuando, texto: sinPunto(limpio.texto)} : null));
    const hecha = resuelta(o);
    let toca = o.toca || (c && c.siguiente && sinPunto(c.siguiente.texto)) || '';
    if (o.cosa && hecha && c && c.estado === 'esperando') toca = 'Wait for their reply';
    // en la lista, corto (“Toca: esperar a Marta”); dentro de la operación, entero
    let tocaCorto = null;
    if (contestada) { toca = 'Wait for a reply from ' + pila; tocaCorto = 'Wait for ' + pila; }
    toca = toca.replace(/\byou call her\b/, (quien === 'Someone' ? 'someone calls her' : quien + ' calls her'));
    if (id === 'joan-serra' && M().lee('marc-llama-joan', false)) toca = 'Marc calls him today';
    const fuera = o.contacto && !lleva ? X.aparcado(id) : null;   // “Para luego” o “Descartarlo” (ronda 8)
    if (o.contacto && !lleva) toca = fuera ? (fuera.que === 'luego' ? 'Choose who takes it. You left it for later' : 'Nothing: you dismissed it') : 'Choose who handles her';
    if (o.contacto && lleva) toca = p.corto + ' replies';
    // las de Teresa, mientras está de baja, tienen dueña: son una sola decisión (“Pasar sus clientes”) y van aparte
    const deBaja = o.lleva === 'teresa' && lleva === 'teresa';
    let aviso = hecha || !o.aviso ? null : {tipo: o.aviso.tipo, texto: o.aviso.texto};
    if (!lleva && !o.contacto) aviso = {tipo: 'nadie', texto: 'No one has her'};
    if (aviso) { aviso.tono = ROJO.includes(aviso.tipo) ? 'rojo' : 'neutro'; if (deBaja) aviso.texto += ' · whoever handles it is on leave'; }
    const mirar = !!aviso && !deBaja && MIRAR.includes(aviso.tipo);
    // nota gris en lugar del aviso rojo: “Laura le contestó hoy, 9:41”
    const nota = contestada && !aviso ? quien + ' replied today, ' + contestada.hora : null;
    const pasos = (D.pasos || {})[o.tipo] || [];
    const fase = pasos[o.fase - 1] || '';
    const como = o.estado === 'cerrado' ? 'Closed' : o.estado === 'caida' ? 'Fell through' : o.estado === 'parado' ? 'Stalled · ' + fase : fase + ' · step ' + o.fase + ' of 5';
    // en una línea, para la lista: “Contacto (1 de 5)”
    const comoCorto = o.estado === 'cerrado' ? 'Closed' : o.estado === 'caida' ? 'Fell through' : (o.estado === 'parado' ? 'Stalled at ' : '') + fase + ' (' + o.fase + ' of 5)';
    // lo ocurrido, en orden: lo del dato, lo que ha pasado hoy en la app de quien la lleva, y lo que ha hecho dirección
    // lo de hoy que contesta a quien esperaba va lo primero, para que se vea al abrir
    const hitos = (contestada ? [{paso: 'Reply from ' + quien, texto: o.contesto || 'Sent a message', cuando: 'Today, ' + contestada.hora}] : []).concat(o.hitos);
    nuevos.slice().reverse().forEach(h => hitos.push({paso: 'Done', texto: hechoDe(h, quien), cuando: h.cuando}));
    const camb = X.lee('opLleva', {})[id]; if (camb) hitos.push({paso: 'Change', texto: 'Now handled by ' + X.persona(camb.a).corto + '. You changed it', cuando: 'Today, ' + camb.hora});
    (X.lee('notasOp', {})[id] || []).forEach(n => hitos.push({paso: 'Your note', texto: n.texto, cuando: 'Today, ' + n.hora}));
    (X.lee('preguntasOp', {})[id] || []).forEach(n => hitos.push({paso: 'You asked', texto: n.texto, cuando: 'Today, ' + n.hora}));
    return {id, base: o, nombre: (c && c.nombre) || o.nombre || id, texto: o.texto, lleva, persona: p, estado: o.estado, tipo: o.tipo, fase: o.fase,
      como, comoCorto, ultimo, toca, tocaCorto, aviso, nota, contestada: !!contestada, mirar, deBaja, hitos, caso: o.caso || null, contacto: !!o.contacto, deTeresa: o.lleva === 'teresa'};
  };

  // todas, primero las que hay que mirar hoy (las de rojo delante); luego las de Teresa de baja, las que van en marcha y, al final, cerradas y caídas
  // la que se acaba de contestar hoy va la primera de las demás, para que se encuentre al abrir “Ver las otras” o “Todas”
  const peso = x => x.mirar ? (x.aviso.tono === 'rojo' ? 0 : 1) : x.contestada ? 1.5 : x.deBaja ? 2 : (['cerrado', 'caida'].includes(x.estado) ? 4 : 3);
  const lista = () => ops.map(o => op(o.id)).map((x, k) => Object.assign(x, {k})).sort((a, b) => peso(a) - peso(b) || a.k - b.k);

  // las personas del equipo, por lo que pide atención y nunca por cifras: quien está de baja, quien tiene algo que mirar hoy y el resto; dentro, por nombre.
  // resumen: lo que pasa, con palabras que no señalan a nadie (“1 sin contestar · 3 esperan un papel”). Solo “sin contestar” va en rojo.
  const plural = (n, uno, varios) => n + ' ' + (n === 1 ? uno : varios);
  const resumenDe = mias => {
    const n = t => mias.filter(x => x.aviso && x.aviso.tipo === t && !x.deBaja).length, partes = [];
    if (n('sin-contestar')) partes.push({texto: n('sin-contestar') + ' not answered', rojo: true});
    else if (mias.some(x => x.contestada)) partes.push({texto: mias.length === 1 ? 'answered' : 'all answered'});   // había alguien esperando y ya no
    if (n('queja')) partes.push({texto: n('queja') + ' complaining'});
    if (n('parada')) partes.push({texto: plural(n('parada'), 'stalled', 'stalled')});
    if (n('papel')) partes.push({texto: plural(n('papel'), 'needs a document', 'need a document')});
    return partes;
  };
  const ORDEN_P = ['laura', 'anna', 'teresa', 'marc', 'david', 'montse'];
  const persona = id => {
    const p = X.persona(id), d = personas[id] || {}, mias = lista().filter(x => x.lleva === id);
    const hace = d.hace || (id === 'laura' ? (D.tiempos.laura || []).reduce((s, t) => (s[t.id] = t.n, s), {}) : {mensajes: 0, actas: 0, avisos: 0});
    const t = (id === 'laura' || id === 'montse') && VETA.r6 ? VETA.r6.tocan(id) : null;   // la misma cuenta que su Hoy
    // FN · una sola fuente (R9): lo que le queda sale de la fuente de VETA.r7.cuentas().hoy, lo mismo que dice su “Te toca a ti”, su barra
    // y su caja (cuenta también lo que dirección le ha preguntado y aún no ha contestado); el total del día sube lo mismo.
    // (Se llama a fuentes.hoy y no a cuentas(): cuentas() calcula también “equipo”, que vuelve a pasar por aquí.)
    const quedan = t ? (VETA.r7 && VETA.r7.fuentes && VETA.r7.fuentes.hoy ? VETA.r7.fuentes.hoy(id) : t.quedan) : 0;
    const pendientes = t ? quedan : (id === 'teresa' && X.cartera() ? 0 : d.pendientes || 0), tocan = t ? t.total + (quedan - t.quedan) : pendientes;
    const partes = resumenDe(mias), cuantas = plural(mias.length, 'deal', 'deals');
    return {id, p, ops: mias, atencion: mias.filter(x => x.mirar), partes, cuantas,
      resumen: cuantas + ' · ' + (partes.length ? partes.map(x => x.texto).join(' · ') : 'all up to date'),
      hace, total: (hace.mensajes || 0) + (hace.actas || 0) + (hace.avisos || 0),
      pendientes, tocan, aprendido: d.aprendido || [], baja: id === 'teresa' && !X.cartera() ? p.baja : null};
  };
  const equipo = () => {
    const grupo = x => x.baja ? 0 : x.atencion.length ? 1 : 2;
    const todos = ORDEN_P.map(persona).sort((a, b) => grupo(a) - grupo(b) || a.p.nombre.localeCompare(b.p.nombre, 'es'));
    return {todos, piden: todos.filter(x => grupo(x) < 2), resto: todos.filter(x => grupo(x) === 2)};
  };

  const ponLleva = (id, a) => {
    const o = base(id); if (!o) return;
    if (o.contacto) { X.asigna(id, a); return; }
    const t = X.lee('opLleva', {});
    if (a === o.lleva) delete t[id]; else t[id] = {a, hora: VETA.ahora()};
    X.guarda('opLleva', t);
  };
  const apunta = (clave, id, texto) => { const t = X.lee(clave, {}); (t[id] = t[id] || []).push({texto, hora: VETA.ahora()}); X.guarda(clave, t); };

  // “Hoy le tocan 6 cosas. Ya ha hecho 2.”: la misma cifra que su “Te toca a ti”, su barra y su caja (lo que le queda, R9:
  // baja cuando lo atiende); detrás, lo que ya ha hecho hoy. F2: antes decía el total del día y no cuadraba con lo que ve la persona.
  const cosas = n => n + (n === 1 ? ' thing' : ' things');
  // (25-nov-2026: se fue “Contesta en 1 h 50 min”: dirección no ve cuánto tarda cada persona en contestar)
  const tocanTexto = (x, yo) => `Today ${yo ? 'you have' : (x.p ? x.p.corto + ' has' : 'they have')} ${cosas(x.pendientes)}.` + (x.pendientes < x.tocan ? ` ${yo ? 'You have already' : (x.p ? x.p.corto + ' has already' : 'They have already')} done ${x.tocan - x.pendientes}.` : '');
  Object.assign(X, {op, ops: lista, llevaOp, ponLleva, personaOps: persona, equipoOps: equipo, tocanTexto,
    anota: (id, texto) => apunta('notasOp', id, texto), pregunta: (id, texto) => apunta('preguntasOp', id, texto)});
})();
