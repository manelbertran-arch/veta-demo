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
  // tipo dice lo que pasa, sin señalar a nadie: sin-contestar · queja · nadie (alguien espera respuesta: rojo y «hay que mirarla hoy»),
  // parada (hay que mirarla, sin rojo) · papel · espera (trabajo normal: se dice en neutro y NO cuenta como «hay que mirarla»).
  // hitos: lo ocurrido, del más antiguo al más nuevo (sin citar chats).
  const ops = [
    // Laura (las mismas de su app)
    {id: 'marta', lleva: 'laura', tipo: 'compra', fase: 1, texto: 'Compra en Gràcia', estado: 'en-marcha', cosa: 'c-marta',
      aviso: {tipo: 'sin-contestar', texto: 'Sin contestar desde ayer, 18:42'}, contesto: 'Le envió la hora de la visita',
      hitos: [{paso: 'Escribió', texto: 'Pide ver el piso de Gràcia', cuando: f('2026-11-22T18:42')}, {paso: 'Preparé', texto: 'Un mensaje para Laura con la hora', cuando: f('2026-11-22T18:43')}]},
    {id: 'elena', lleva: 'laura', tipo: 'compra', fase: 2, texto: 'Compra en Gràcia', estado: 'en-marcha', cosa: 'c-elena',
      ultimo: {cuando: f('2026-11-16'), texto: 'Dijo que pasaría la nómina el miércoles'},
      aviso: {tipo: 'papel', texto: 'Falta un papel: la nómina, para el mié 25'},
      hitos: [{paso: 'Escribió', texto: 'Busca dos habitaciones con luz', cuando: f('2026-10-28')}, {paso: 'Apunté', texto: 'Una promesa: la nómina, para el banco', cuando: f('2026-11-16')}, {paso: 'Hoy', texto: 'Visita a las 9:00 en Verdi 42', cuando: 'Hoy'}]},
    {id: 'pere', lleva: 'laura', tipo: 'venta', fase: 3, texto: 'Venta de Verdi 42', estado: 'en-marcha', cosa: 'c-pere',
      ultimo: {cuando: f('2026-11-21T21:10'), texto: 'Dejó un mensaje'},
      aviso: {tipo: 'papel', texto: 'Falta un papel: el certificado energético, para el vie 27'},
      hitos: [{paso: 'Hecho', texto: 'Informe de la semana enviado', cuando: f('2026-11-16')}, {paso: 'Escribió', texto: 'Dejó un mensaje', cuando: f('2026-11-21T21:10')}, {paso: 'Preparé', texto: 'Informe de la semana para Laura', cuando: f('2026-11-23T07:00')}]},
    {id: 'jordi', lleva: 'laura', tipo: 'compra', fase: 2, texto: 'Compra en Sants', estado: 'en-marcha', cosa: 'c-jordi',
      ultimo: {cuando: f('2026-11-20T12:20'), texto: 'Prometió el informe del piso'},
      aviso: {tipo: 'papel', texto: 'Falta un papel: el informe del piso, para el jueves'},
      hitos: [{paso: 'Escribió', texto: 'Pide el informe del piso de Olzinelles', cuando: f('2026-11-20T12:05')}, {paso: 'Apunté', texto: 'Prometió el informe del piso', cuando: f('2026-11-20T12:20')}]},
    {id: 'laia', lleva: 'laura', tipo: 'compra', fase: 5, texto: 'Compra en Poblenou', estado: 'en-marcha',
      hitos: [{paso: 'Hecho', texto: 'Firmó las arras', cuando: f('2026-11-09')}, {paso: 'Toca', texto: 'Firma en la notaría', cuando: f('2026-12-01T12:00')}]},
    {id: 'albert', lleva: 'laura', tipo: 'compra', fase: 1, texto: 'Busca un local', estado: 'parado',
      ultimo: {cuando: f('2026-10-03'), texto: 'Pidió que le avisaran si salía un local'},
      aviso: {tipo: 'espera', texto: '7 semanas sin hablar · pidió que le avisaran'},
      hitos: [{paso: 'Escribió', texto: 'Pidió que le avisaran si salía un local por el centro', cuando: f('2026-10-03')}, {paso: 'Vi', texto: 'Entró un local que le encaja', cuando: f('2026-11-12')}]},
    {id: 'carme-font', lleva: 'laura', tipo: 'venta', fase: 5, texto: 'Venta en Horta', estado: 'cerrado', toca: 'Nada. Se le puede pedir que nos recomiende',
      hitos: [{paso: 'Hecho', texto: 'Firmó la venta en Horta', cuando: 'Junio'}]},
    // Montse (tú)
    {id: 'ruben', lleva: 'montse', tipo: 'venta', fase: 3, texto: 'Ático en Sant Gervasi', estado: 'en-marcha',
      ultimo: {cuando: f('2026-11-20'), texto: 'Sílvia hizo una oferta; el propietario pide más'}, toca: 'Llamarle el vie 27 con la oferta',
      hitos: [{paso: 'Visita', texto: 'Sílvia Prat visitó el ático', cuando: f('2026-11-18')}, {paso: 'Oferta', texto: 'Sílvia hizo una oferta por el ático', cuando: f('2026-11-20')}]},
    {id: 'guillem', lleva: 'montse', tipo: 'compra', fase: 2, texto: 'Compra en Sant Gervasi', estado: 'en-marcha',
      ultimo: {cuando: f('2026-11-20'), texto: 'Quedó para ver un piso'}, toca: 'Visita el mié 25',
      hitos: [{paso: 'Escribió', texto: 'Quiere ver pisos en Sant Gervasi', cuando: f('2026-11-16')}, {paso: 'Apunté', texto: 'Visita el mié 25', cuando: f('2026-11-20')}]},
    // Anna
    {id: 'isabel-rius', nombre: 'Isabel Rius', lleva: 'anna', tipo: 'venta', fase: 2, texto: 'Venta en Sant Antoni', estado: 'en-marcha',
      ultimo: {cuando: 'Ayer', texto: 'El piso entró en la oficina'}, toca: 'Hacer las fotos y publicar el anuncio',
      hitos: [{paso: 'Hecho', texto: 'Anna firmó el encargo de venta', cuando: 'Ayer'}, {paso: 'Vi', texto: 'Núria Camps busca justo esto', cuando: 'Hoy'}]},
    {id: 'sergi', lleva: 'anna', tipo: 'compra', fase: 1, texto: 'Alquiler en Les Corts', estado: 'en-marcha',
      ultimo: {cuando: 'Ayer', texto: 'Anna le contestó'}, toca: 'Enseñarle dos pisos esta semana',
      hitos: [{paso: 'Escribió', texto: 'Pregunta por un alquiler en Les Corts', cuando: f('2026-11-21')}, {paso: 'Hecho', texto: 'Anna le contestó', cuando: 'Ayer'}]},
    // Marc
    {id: 'joan-serra', lleva: 'marc', tipo: 'venta', fase: 3, texto: 'Venta en Sant Cugat', estado: 'parado',
      ultimo: {cuando: f('2026-11-21T20:05'), texto: 'Se quejó: nadie le cuenta nada'}, toca: 'Llamar a Joan',
      aviso: {tipo: 'queja', texto: 'Queja del propietario · 10 días sin moverse'},
      hitos: [{paso: 'Visita', texto: 'Última visita a la casa', cuando: f('2026-11-12')}, {paso: 'Vi', texto: 'Diez días sin hablar con Joan', cuando: 'Ayer'}, {paso: 'Escribió', texto: 'Se quejó: nadie le cuenta nada', cuando: f('2026-11-21T20:05')}]},
    {id: 'pilar-grau', nombre: 'Pilar Grau', lleva: 'marc', tipo: 'compra', fase: 4, texto: 'Compra en Sarrià', estado: 'en-marcha',
      ultimo: {cuando: f('2026-11-20'), texto: 'Aceptaron su oferta'}, toca: 'Firmar las arras el jue 26',
      hitos: [{paso: 'Oferta', texto: 'Hizo una oferta', cuando: f('2026-11-17')}, {paso: 'Hecho', texto: 'El propietario aceptó', cuando: f('2026-11-20')}]},
    {id: 'claudia', lleva: 'marc', tipo: 'compra', fase: 2, texto: 'Compra en Sants', estado: 'caida', toca: 'Nada. De esto se puede aprender', caso: 'oficina/caso/claudia',
      ultimo: {cuando: f('2026-11-12'), texto: 'Avisó de que ya había encontrado otro piso'},
      hitos: [{paso: 'Escribió', texto: 'Pide ver el piso de la calle Olzinelles', cuando: f('2026-11-03')}, {paso: 'Hecho', texto: 'Se le propone una visita', cuando: f('2026-11-04')}, {paso: 'Vi', texto: 'Espera una llamada que no llega', cuando: 'Del 4 al 11 nov'}, {paso: 'Escribió', texto: 'Ya ha encontrado otro piso', cuando: f('2026-11-12')}]},
    // David
    {id: 'jaume-sala', nombre: 'Jaume Sala', lleva: 'david', tipo: 'compra', fase: 3, texto: 'Compra en Sant Gervasi', estado: 'en-marcha',
      ultimo: {cuando: f('2026-11-21'), texto: 'Hizo una oferta por un piso'}, toca: 'Saber qué dice el propietario mañana',
      hitos: [{paso: 'Visita', texto: 'Segunda visita al piso', cuando: f('2026-11-19')}, {paso: 'Oferta', texto: 'Hizo una oferta', cuando: f('2026-11-21')}]},
    {id: 'marina-pons', nombre: 'Marina Pons', lleva: 'david', tipo: 'venta', fase: 2, texto: 'Venta en Sarrià', estado: 'en-marcha',
      ultimo: {cuando: f('2026-11-19'), texto: 'Firmó el encargo de venta'}, toca: 'Publicar el anuncio',
      aviso: {tipo: 'papel', texto: 'Falta un papel: la nota simple'},
      hitos: [{paso: 'Hecho', texto: 'Firmó el encargo de venta', cuando: f('2026-11-19')}, {paso: 'Vi', texto: 'Falta la nota simple para el anuncio', cuando: f('2026-11-20')}]},
    // Teresa (de baja desde el lunes 16): si se pasan sus clientes, las lleva quien los recibe
    {id: 'ramon', lleva: 'teresa', tipo: 'compra', fase: 2, texto: 'Compra en Gràcia', estado: 'en-marcha',
      ultimo: {cuando: f('2026-11-22T17:30'), texto: 'Preguntó si sigue en pie la visita del jueves'}, toca: 'Contestarle hoy',
      aviso: {tipo: 'sin-contestar', texto: 'Sin contestar desde ayer, 17:30'},
      hitos: [{paso: 'Visita', texto: 'Quedó con Teresa para el jueves', cuando: f('2026-11-13')}, {paso: 'Escribió', texto: 'Pregunta si sigue en pie la visita', cuando: f('2026-11-22T17:30')}]},
    {id: 'dani-prats', lleva: 'teresa', tipo: 'compra', fase: 2, texto: 'Compra en Gràcia', estado: 'parado',
      ultimo: {cuando: f('2026-11-14'), texto: 'Visitó un piso en la calle Torrent'}, toca: 'Preguntarle si sigue buscando',
      aviso: {tipo: 'parada', texto: '9 días sin moverse'},
      hitos: [{paso: 'Visita', texto: 'Visitó un piso en la calle Torrent', cuando: f('2026-11-14')}, {paso: 'Vi', texto: 'Desde entonces, nadie le ha escrito', cuando: 'Hoy'}]},
    {id: 'rosa-vila', lleva: 'teresa', tipo: 'venta', fase: 3, texto: 'Venta en Gràcia', estado: 'parado',
      ultimo: {cuando: f('2026-11-11'), texto: 'Última visita a su piso'}, toca: 'Contarle cómo van las visitas',
      aviso: {tipo: 'parada', texto: '12 días sin moverse'},
      hitos: [{paso: 'Visita', texto: 'Última visita a su piso', cuando: f('2026-11-11')}, {paso: 'Vi', texto: 'No ha sabido nada desde entonces', cuando: 'Hoy'}]},
    // sin nadie: los contactos nuevos sin dueño (los mismos de «Lo que entra»)
    {id: 'carmen', lleva: null, tipo: 'compra', fase: 1, texto: 'Busca piso en Gràcia', estado: 'en-marcha', contacto: true,
      ultimo: {cuando: f('2026-11-22T19:10'), texto: 'Escribió al WhatsApp de la oficina'}, aviso: {tipo: 'nadie', texto: 'No la lleva nadie · escribió ayer'},
      hitos: [{paso: 'Escribió', texto: 'Busca 3 habitaciones en Gràcia', cuando: f('2026-11-22T19:10')}, {paso: 'Vi', texto: 'Verdi 42 le encaja y es de su zona', cuando: f('2026-11-22T19:11')}]},
    {id: 'pau-rios', lleva: null, tipo: 'compra', fase: 1, texto: 'Local en el Eixample', estado: 'en-marcha', contacto: true,
      ultimo: {cuando: f('2026-11-21T13:20'), texto: 'Escribió al WhatsApp de la oficina'}, aviso: {tipo: 'nadie', texto: 'No lo lleva nadie · escribió sáb 21'},
      hitos: [{paso: 'Escribió', texto: 'Busca un local en alquiler', cuando: f('2026-11-21T13:20')}]},
    {id: 'lucia', lleva: null, tipo: 'venta', fase: 1, texto: 'Vender en Sant Gervasi', estado: 'en-marcha', contacto: true,
      ultimo: {cuando: f('2026-11-23T07:40'), texto: 'Escribió al WhatsApp de la oficina'}, aviso: {tipo: 'nadie', texto: 'No la lleva nadie · escribió hoy'},
      hitos: [{paso: 'Escribió', texto: 'Quiere vender el piso de sus padres', cuando: f('2026-11-23T07:40')}]}
  ];

  // ---- cada persona: lo que Veta le hizo esta semana (suma 156, la cifra de Semana), y lo que aprendió (sin tiempos de respuesta por persona) ----
  const personas = {
    // Laura: 31 mensajes, 4 promesas y 3 actas, las mismas cifras de su pestaña Veta («Lo que ya preparo yo»); 38 en total
    laura: {hace: {mensajes: 31, actas: 3, avisos: 4}, aprendido: [['r-actas', 'Le pido que me cuente cada visita al salir'], ['r-promesas', 'Apunto lo que le prometen y le aviso si no llega'],
      ['r-informes', 'Preparo el informe de cada propietario los lunes'], ['r-cancelaciones', 'Propongo otra fecha cuando se cancela una visita'], ['r-valoraciones', 'Preparo el informe del piso antes de una valoración']]},
    anna: {pendientes: 5, hace: {mensajes: 27, actas: 2, avisos: 5}, aprendido: [[null, 'En Sant Antoni, mando el plano antes de cada visita']]},
    marc: {pendientes: 7, hace: {mensajes: 25, actas: 2, avisos: 4}, aprendido: [[null, 'A los propietarios, les propongo llamar antes que escribir']]},
    david: {pendientes: 4, hace: {mensajes: 24, actas: 1, avisos: 4}, aprendido: [[null, 'Confirmo las visitas el día antes']]},
    montse: {hace: {mensajes: 20, actas: 1, avisos: 3}, aprendido: [[null, 'Te junto las ofertas de un mismo piso']]},
    teresa: {pendientes: 34, hace: {mensajes: 0, actas: 0, avisos: 0}, aprendido: []}
  };

  // ---- trabajo que Veta ya hace por la oficina: cuatro semanas (la última y la anterior son las de Semana) ----
  const semanas = {etiquetas: [f('2026-10-26'), f('2026-11-02'), f('2026-11-09'), f('2026-11-16')], listos: [118, 127, 141, 156], corregidos: [21, 19, 16, 14]};

  // ---- lo que el equipo le pide a Veta: lo que hace a mano (los 43 de G12) y quién ----
  const pide = [
    {tema: 'Contestar a los contactos nuevos', veces: 23, quien: 'Lo hacen a mano Laura, Anna y David'},
    {tema: 'Preparar el informe del piso', veces: 14, quien: 'Lo hace a mano Laura'},
    {tema: 'Pedir el certificado energético', veces: 6, quien: 'Lo hace a mano Laura'}
  ];

  // ---- antes y ahora de la oficina (G16): el primer informe (3 oct) frente a hoy · rotulado «Ejemplo» ----
  const antesAhora = {
    esperando: {antes: 31, hoy: 11, semanas: [31, 26, 22, 17, 14, 11]},
    promesas: {antes: 12, hoy: 7},
    primerInforme: {total: 31, retomados: 14, cerrados: 6, siguen: 11},
    decimos: 'Contestamos en el día',
    pasa: {mitad: '2 h 40 min', viernes: '11 h 30 min'}
  };

  R.direccion = {ops, personas, semanas, pide, antesAhora};

  // ---- utilidades de dirección para operaciones y personas (amplían VETA.dir; estado propio con prefijo «d.») ----
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
  const hechoDe = (h, quien) => h.tipo === 'Acta' ? quien + ' guardó el acta de la visita' : sinPunto(h.texto);
  const op = id => {
    const o = base(id); if (!o) return null;
    const c = M().cliente(id), lleva = llevaOp(id), p = lleva ? X.persona(lleva) : null;
    const quien = p ? p.corto : 'Alguien';
    // contestada: alguien esperaba respuesta y quien la lleva ya envió el mensaje. Es la misma señal que usa Hoy para «Enviado a Marta · 9:41»
    // (la cosa en estado 'enviada', con su hora). Con «No lo envié» la cosa vuelve a por hacer y todo esto se deshace solo.
    // Dirección ve que contestó y cuándo; nunca el texto del mensaje (o.contesto lo cuenta con palabras propias).
    const cs = o.cosa ? M().cosa(o.cosa) : null, pila = String((c && c.nombre) || o.nombre || '').split(' ')[0];
    const contestada = o.aviso && o.aviso.tipo === 'sin-contestar' && cs && cs.estado === 'enviada' ? {hora: cs.hora} : null;
    const nuevos = ((c && c.historia) || []).filter(h => h.de && !(contestada && h.de === o.cosa));   // lo que ha pasado hoy en la app de quien la lleva
    const limpio = ((c && c.historia) || []).find(h => !h.de && h.texto && h.texto.charAt(0) !== '«');
    const ultimo = contestada ? {cuando: 'Hoy, ' + contestada.hora, texto: quien + ' le contestó'}
      : nuevos.length ? {cuando: nuevos[0].cuando, texto: hechoDe(nuevos[0], quien)} : (o.ultimo || (limpio ? {cuando: limpio.cuando, texto: sinPunto(limpio.texto)} : null));
    const hecha = resuelta(o);
    let toca = o.toca || (c && c.siguiente && sinPunto(c.siguiente.texto)) || '';
    if (o.cosa && hecha && c && c.estado === 'esperando') toca = 'Esperar su respuesta';
    // en la lista, corto («Toca: esperar a Marta»); dentro de la operación, entero
    let tocaCorto = null;
    if (contestada) { toca = 'Esperar a que conteste ' + pila; tocaCorto = 'Esperar a ' + pila; }
    toca = toca.replace(/\bla llamas\b/, (quien === 'Alguien' ? 'se la llama' : quien + ' la llama'));
    if (id === 'joan-serra' && M().lee('marc-llama-joan', false)) toca = 'Marc le llama hoy';
    const fuera = o.contacto && !lleva ? X.aparcado(id) : null;   // «Para luego» o «Descartarlo» (ronda 8)
    if (o.contacto && !lleva) toca = fuera ? (fuera.que === 'luego' ? 'Elegir quién la lleva. Lo dejaste para luego' : 'Nada: lo descartaste') : 'Elegir quién la lleva';
    if (o.contacto && lleva) toca = p.corto + ' le contesta';
    // las de Teresa, mientras está de baja, tienen dueña: son una sola decisión («Pasar sus clientes») y van aparte
    const deBaja = o.lleva === 'teresa' && lleva === 'teresa';
    let aviso = hecha || !o.aviso ? null : {tipo: o.aviso.tipo, texto: o.aviso.texto};
    if (!lleva && !o.contacto) aviso = {tipo: 'nadie', texto: 'No la lleva nadie'};
    if (aviso) { aviso.tono = ROJO.includes(aviso.tipo) ? 'rojo' : 'neutro'; if (deBaja) aviso.texto += ' · quien la lleva está de baja'; }
    const mirar = !!aviso && !deBaja && MIRAR.includes(aviso.tipo);
    // nota gris en lugar del aviso rojo: «Laura le contestó hoy, 9:41»
    const nota = contestada && !aviso ? quien + ' le contestó hoy, ' + contestada.hora : null;
    const pasos = (D.pasos || {})[o.tipo] || [];
    const fase = pasos[o.fase - 1] || '';
    const como = o.estado === 'cerrado' ? 'Cerrada' : o.estado === 'caida' ? 'Se cayó' : o.estado === 'parado' ? 'Parada · ' + fase : fase + ' · paso ' + o.fase + ' de 5';
    // en una línea, para la lista: «Contacto (1 de 5)»
    const comoCorto = o.estado === 'cerrado' ? 'Cerrada' : o.estado === 'caida' ? 'Se cayó' : (o.estado === 'parado' ? 'Parada en ' : '') + fase + ' (' + o.fase + ' de 5)';
    // lo ocurrido, en orden: lo del dato, lo que ha pasado hoy en la app de quien la lleva, y lo que ha hecho dirección
    // lo de hoy que contesta a quien esperaba va lo primero, para que se vea al abrir
    const hitos = (contestada ? [{paso: 'Contestó ' + quien, texto: o.contesto || 'Le envió un mensaje', cuando: 'Hoy, ' + contestada.hora}] : []).concat(o.hitos);
    nuevos.slice().reverse().forEach(h => hitos.push({paso: 'Hecho', texto: hechoDe(h, quien), cuando: h.cuando}));
    const camb = X.lee('opLleva', {})[id]; if (camb) hitos.push({paso: 'Cambio', texto: 'Ahora la lleva ' + X.persona(camb.a).corto + '. Lo cambiaste tú', cuando: 'Hoy, ' + camb.hora});
    (X.lee('notasOp', {})[id] || []).forEach(n => hitos.push({paso: 'Tu nota', texto: n.texto, cuando: 'Hoy, ' + n.hora}));
    (X.lee('preguntasOp', {})[id] || []).forEach(n => hitos.push({paso: 'Preguntaste', texto: n.texto, cuando: 'Hoy, ' + n.hora}));
    return {id, base: o, nombre: (c && c.nombre) || o.nombre || id, texto: o.texto, lleva, persona: p, estado: o.estado, tipo: o.tipo, fase: o.fase,
      como, comoCorto, ultimo, toca, tocaCorto, aviso, nota, contestada: !!contestada, mirar, deBaja, hitos, caso: o.caso || null, contacto: !!o.contacto, deTeresa: o.lleva === 'teresa'};
  };

  // todas, primero las que hay que mirar hoy (las de rojo delante); luego las de Teresa de baja, las que van en marcha y, al final, cerradas y caídas
  // la que se acaba de contestar hoy va la primera de las demás, para que se encuentre al abrir «Ver las otras» o «Todas»
  const peso = x => x.mirar ? (x.aviso.tono === 'rojo' ? 0 : 1) : x.contestada ? 1.5 : x.deBaja ? 2 : (['cerrado', 'caida'].includes(x.estado) ? 4 : 3);
  const lista = () => ops.map(o => op(o.id)).map((x, k) => Object.assign(x, {k})).sort((a, b) => peso(a) - peso(b) || a.k - b.k);

  // las personas del equipo, por lo que pide atención y nunca por cifras: quien está de baja, quien tiene algo que mirar hoy y el resto; dentro, por nombre.
  // resumen: lo que pasa, con palabras que no señalan a nadie («1 sin contestar · 3 esperan un papel»). Solo «sin contestar» va en rojo.
  const plural = (n, uno, varios) => n + ' ' + (n === 1 ? uno : varios);
  const resumenDe = mias => {
    const n = t => mias.filter(x => x.aviso && x.aviso.tipo === t && !x.deBaja).length, partes = [];
    if (n('sin-contestar')) partes.push({texto: n('sin-contestar') + ' sin contestar', rojo: true});
    else if (mias.some(x => x.contestada)) partes.push({texto: mias.length === 1 ? 'contestada' : 'todas contestadas'});   // había alguien esperando y ya no
    if (n('queja')) partes.push({texto: n('queja') + ' con una queja'});
    if (n('parada')) partes.push({texto: plural(n('parada'), 'parada', 'paradas')});
    if (n('papel')) partes.push({texto: plural(n('papel'), 'espera un papel', 'esperan un papel')});
    return partes;
  };
  const ORDEN_P = ['laura', 'anna', 'teresa', 'marc', 'david', 'montse'];
  const persona = id => {
    const p = X.persona(id), d = personas[id] || {}, mias = lista().filter(x => x.lleva === id);
    const hace = d.hace || (id === 'laura' ? (D.tiempos.laura || []).reduce((s, t) => (s[t.id] = t.n, s), {}) : {mensajes: 0, actas: 0, avisos: 0});
    const t = (id === 'laura' || id === 'montse') && VETA.r6 ? VETA.r6.tocan(id) : null;   // la misma cuenta que su Hoy
    // FN · una sola fuente (R9): lo que le queda sale de la fuente de VETA.r7.cuentas().hoy, lo mismo que dice su «Te toca a ti», su barra
    // y su caja (cuenta también lo que dirección le ha preguntado y aún no ha contestado); el total del día sube lo mismo.
    // (Se llama a fuentes.hoy y no a cuentas(): cuentas() calcula también «equipo», que vuelve a pasar por aquí.)
    const quedan = t ? (VETA.r7 && VETA.r7.fuentes && VETA.r7.fuentes.hoy ? VETA.r7.fuentes.hoy(id) : t.quedan) : 0;
    const pendientes = t ? quedan : (id === 'teresa' && X.cartera() ? 0 : d.pendientes || 0), tocan = t ? t.total + (quedan - t.quedan) : pendientes;
    const partes = resumenDe(mias), cuantas = plural(mias.length, 'operación', 'operaciones');
    return {id, p, ops: mias, atencion: mias.filter(x => x.mirar), partes, cuantas,
      resumen: cuantas + ' · ' + (partes.length ? partes.map(x => x.texto).join(' · ') : 'todo al día'),
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

  // «Hoy le tocan 6 cosas. Ya ha hecho 2.»: la misma cifra que su «Te toca a ti», su barra y su caja (lo que le queda, R9:
  // baja cuando lo atiende); detrás, lo que ya ha hecho hoy. F2: antes decía el total del día y no cuadraba con lo que ve la persona.
  const cosas = n => n + (n === 1 ? ' cosa' : ' cosas');
  // (25-nov-2026: se fue «Contesta en 1 h 50 min»: dirección no ve cuánto tarda cada persona en contestar)
  const tocanTexto = (x, yo) => `Hoy ${yo ? 'te' : 'le'} ${x.pendientes === 1 ? 'toca' : 'tocan'} ${cosas(x.pendientes)}.` + (x.pendientes < x.tocan ? ` Ya ${yo ? 'has' : 'ha'} hecho ${x.tocan - x.pendientes}.` : '');
  Object.assign(X, {op, ops: lista, llevaOp, ponLleva, personaOps: persona, equipoOps: equipo, tocanTexto,
    anota: (id, texto) => apunta('notasOp', id, texto), pregunta: (id, texto) => apunta('preguntasOp', id, texto)});
})();
