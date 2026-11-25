/* Veta demo · datos · extra-d.js · paquete D (Dirección)
   Datos que el paquete D necesita y no están en js/datos/ (base, dia, clientes, veta, oficina).
   Se añaden a VETA.datos sin pisar lo que ya hay, y cada dato nuevo se apunta en ESTADO_D.md.
   Al final, VETA.dir: utilidades que comparten las pantallas y hojas de Dirección (estado propio con prefijo «d.»). */
(function () {
  'use strict';
  const f = iso => VETA.fecha.corta(iso), ff = iso => VETA.fecha.corta(iso, {frase: true});   // las fechas salen de VETA.fecha, no se escriben a mano
  const D = VETA.datos;
  const pon = (k, v) => { if (!(k in D)) D[k] = v; };

  // ---- G2 · un asunto: lo que ha pasado y quién puede llevarlo (Carmen es del plan; Pau, Lucía y Joan, inventados por D) ----
  pon('asuntos', {
    carmen: {
      contacto: 'carmen', tipo: 'contacto', zona: 'Gràcia', decision: 'd-carmen', propone: 'laura',
      etiqueta: 'No la lleva nadie · Gràcia',
      pide: {texto: 'Busco piso de 3 habitaciones en Gràcia, hasta 450.000 €', origen: 'WhatsApp de la oficina · ' + ff('2026-11-22T19:10')},
      paso: [{cuando: f('2026-11-22T19:10'), texto: 'Escribe al WhatsApp de la oficina'}, {cuando: f('2026-11-22T19:11'), texto: 'Nadie lleva los contactos que llegan fuera de horario'}, {cuando: f('2026-11-23T08:00'), texto: 'Sigue sin respuesta: 13 horas'}],
      encaja: {piso: 'verdi', texto: 'Verdi 42 · 3 habitaciones · 395.000 €', pega: 'Sin ascensor'},
      pueden: [{id: 'laura', sub: 'Gràcia · yo se lo daría'}, {id: 'anna', sub: 'Gràcia'}, {id: 'montse', sub: 'Sant Gervasi', tu: true}]
    },
    'pau-rios': {
      contacto: 'pau-rios', tipo: 'contacto', zona: 'Eixample', propone: 'david',
      etiqueta: 'No lo lleva nadie · Eixample',
      pide: {texto: '¿Tenéis algún local en el Eixample para alquilar?', origen: 'WhatsApp de la oficina · ' + ff('2026-11-21T13:20')},
      paso: [{cuando: f('2026-11-21T13:20'), texto: 'Escribe al WhatsApp de la oficina'}, {cuando: f('2026-11-21T13:21'), texto: 'Nadie lleva los contactos del fin de semana'}, {cuando: f('2026-11-23T08:00'), texto: 'Sigue sin respuesta: 2 días'}],
      noHay: 'No tenéis ningún local en el Eixample. Queda apuntado en «Piden lo que no tenéis».',
      pueden: [{id: 'david', sub: 'Sant Gervasi · yo se lo daría'}, {id: 'marc', sub: 'Sant Gervasi'}, {id: 'montse', sub: 'Sant Gervasi', tu: true}]
    },
    lucia: {
      contacto: 'lucia', tipo: 'contacto', zona: 'Sant Gervasi', propone: 'marc',
      etiqueta: 'No la lleva nadie · Sant Gervasi',
      pide: {texto: 'Quiero vender el piso de mis padres en Sant Gervasi. ¿Cómo trabajáis?', origen: 'WhatsApp de la oficina · ' + ff('2026-11-23T07:40')},
      paso: [{cuando: f('2026-11-23T07:40'), texto: 'Escribe al WhatsApp de la oficina'}, {cuando: f('2026-11-23T07:41'), texto: 'Llega antes de que abra la oficina'}, {cuando: f('2026-11-23T08:00'), texto: 'Sigue sin respuesta'}],
      noHay: 'Quiere vender: es un piso nuevo para Sant Gervasi.',
      pueden: [{id: 'marc', sub: 'Sant Gervasi · yo se lo daría'}, {id: 'david', sub: 'Sant Gervasi'}, {id: 'montse', sub: 'Sant Gervasi', tu: true}]
    },
    'joan-serra': {
      contacto: 'joan-serra', tipo: 'queja', decision: 'd-joan', lleva: 'marc',
      etiqueta: 'Queja de un propietario',
      pide: {texto: 'Llevo diez días sin noticias del piso. Si nadie me dice nada, me voy a otra agencia.', origen: 'WhatsApp · ' + ff('2026-11-21T20:05')},
      paso: [{cuando: f('2026-11-12'), texto: 'La venta de su casa de Sant Cugat se para en la fase de oferta'}, {cuando: f('2026-11-21T20:05'), texto: 'Escribe por WhatsApp: se queja'}, {cuando: f('2026-11-23T08:00'), texto: 'Sigue abierta desde el sábado'}],
      operacion: 'Venta en Sant Cugat · parada · 10 días · fase Oferta'
    }
  });

  // ---- G2b · reglas y prácticas de la oficina (dossier es del plan; las otras dos frases, inventadas por D) ----
  pon('reglasOficina', {
    dossier: {titulo: 'Informe del piso al día siguiente', corto: 'Informe del piso', decision: 'd-regla', get propone() { return VETA.dir.proponeRegla(); },
      frase: 'Cuando alguien pide una valoración, preparo el informe del piso al día siguiente y el agente lo envía.',
      desde: '23 peticiones de valoración.'},
    'mismo-dia': {titulo: 'Responder el mismo día', corto: 'Responder el mismo día', propone: 'Ya venía conmigo', estado: 'a-prueba', dia: 9,
      frase: 'Cuando escribe un contacto nuevo, dejo la respuesta escrita el mismo día y el agente la envía.',
      desde: '301 contactos nuevos desde que empezamos.'},
    actas: {titulo: 'Contar la visita al salir', corto: 'Contar la visita', propone: 'Lo propuso Anna Costa', estado: 'en-marcha', usan: '4 de 6',
      frase: 'Al salir de una visita, el agente me la cuenta en un minuto y yo dejo escrita el acta de la visita.',
      desde: '212 visitas desde que empezamos.'}
  });

  // ---- G3 · lo que está parado y lo aprendido ----
  pon('aprendidoSemana', ['En Gràcia casi todos piden ver el piso en sábado.', 'Quien pide fotos del balcón suele pedir visita.', 'Si un propietario pasa 10 días sin noticias, suele quejarse.']);

  // ---- G3c · los casos de cada tema (sin nombres de agentes; inventados por D salvo los contactos) ----
  pon('casosTema', {
    esperando: ['Marta Puig · espera respuesta desde el jueves', 'Rubén Gil · quiere saber cómo van las visitas', 'Guillem Roig · visita del miércoles por confirmar', '… y 8 más'],
    promesas: ['Un certificado prometido para esta semana · 5 días sin constancia', 'Una llamada prometida para el lunes · 4 días', 'Unas fotos prometidas para mañana · 3 días', '… y 4 más'],
    quieren: ['Lucía Gómez · quiere vender en Sant Gervasi', 'Carmen López · quiere comprar en Gràcia', 'Pau Ríos · busca local para alquilar', '… y 6 más'],
    contactos: null,
    respuesta: ['De lunes a viernes, en horario: 1 h 50 min', 'Fuera de horario y en fin de semana: 14 h', 'Mejor día: martes'],
    visitas: ['Mié 25 · Muntaner 214', 'Jue 26, 10:00 · con Ramon Pujol', 'Sáb 28 · dos visitas en Gràcia', 'Sáb 28 · una visita en Sants']
  });

  // ---- G3e · semana a semana (casos preparados); 16 nov = 156 del cuadro de ocho ----
  pon('semanas', [{id: '26-oct', texto: f('2026-10-26'), n: 118}, {id: '2-nov', texto: f('2026-11-02'), n: 127}, {id: '9-nov', texto: f('2026-11-09'), n: 141}, {id: '16-nov', texto: f('2026-11-16'), n: 156}]);

  // ---- G6 · avisos ----
  pon('avisos', {
    ejemplos: [
      {id: 'ej-2h', corto: '2 h sin respuesta', texto: 'Un contacto nuevo lleve 2 horas sin respuesta', casos: ['Ayer, 19:10 · Carmen López, contacto nuevo', 'Sáb 21, 13:20 · Pau Ríos, contacto nuevo', 'Jue 19, 21:05 · un número sin nombre', 'Mar 17, 14:30 · una compradora de Sants', '16 nov, 20:45 · un vendedor de Gràcia']},
      {id: 'ej-firma', corto: 'Firma sin papel', texto: 'Se acerque una firma sin la nota simple', casos: ['Vie 20 · firma de Poblenou, 1 dic, sin nota simple', '11 nov · firma de Horta, a 5 días', '2 nov · firma de Sants, a 4 días', '27 oct · firma de Gràcia, a 6 días', '15 oct · firma de Sant Gervasi, a 3 días']},
      {id: 'ej-parada', corto: 'Parada 10 días', texto: 'Una operación lleve más de 10 días parada', casos: ['Hoy · una venta en Gràcia, 12 días en Visitas', 'Hoy · la casa de Sant Cugat, 10 días en Oferta', '13 nov · un local, 6 semanas en Contacto', '2 nov · una compra en Sants, 11 días', '21 oct · una venta en Horta, 14 días']}
    ],
    puestos: [
      {id: 'av-queja', texto: 'Un propietario se queje', salto: 'te avisó ' + ff('2026-11-21T20:05'), saltoLargo: 'Te avisó ' + ff('2026-11-21T20:05') + ': queja de Joan Serra.'},
      {id: 'av-sabado', texto: 'Se cancele una visita del sábado', salto: 'todavía no te ha avisado'},
      {id: 'av-valoracion', texto: 'Alguien pida una valoración fuera de horario', salto: 'todavía no te ha avisado'}
    ],
    generico: ['Ayer · un caso parecido en Gràcia', 'Vie 20 · un caso parecido en Sant Gervasi', 'Mar 17 · un caso parecido en Sants']
  });

  // ---- G7 · lo que escucha Veta ----
  pon('escucha', [
    {id: 'whatsapp', texto: 'WhatsApp Business'}
  ]);

  // ---- G7c · parte diario del piloto y los cinco anteriores (inventados por D) ----
  pon('partesPiloto', [
    {dia: f('2026-11-20'), texto: 'Leídos 38 chats. Detectados 24 casos; preparados 21; completados 18. Esperan aprobación 3.'},
    {dia: f('2026-11-19'), texto: 'Leídos 44 chats. Detectados 29 casos; preparados 25; completados 22.'},
    {dia: f('2026-11-18'), texto: 'Leídos 35 chats. Detectados 22 casos; preparados 19; completados 17.'},
    {dia: f('2026-11-17'), texto: 'Leídos 41 chats. Detectados 27 casos; preparados 23; completados 19.'},
    {dia: f('2026-11-16'), texto: 'Leídos 47 chats. Detectados 31 casos; preparados 26; completados 21.'}
  ]);

  // ---- G8 · captación, radiografía y decisiones ----
  pon('informeSemana', {
    captacion: [['Quieren vender', '9'], ['Contactos nuevos', '14'], ['Sin responder', '5']],
    radiografia: [['Promesas halladas', '12'], ['Promesas sin constancia', '7'], ['Relaciones que se enfrían', '6'], ['Fichas sin teléfono', '4']],
    decisiones: [['Decididas la semana pasada', '6'], ['Tienes que decidir hoy', '4']],
    paradasOficina: {gracia: 3, santgervasi: 1}
  });

  // ---- G9 · lo que entra (los dos «escriben dos veces» y el «parking», inventados por D) ----
  pon('entra', {
    dosVeces: [{id: 'ramon', texto: 'Ramon Pujol · 2 mensajes desde ayer'}, {id: 'sin-nombre', texto: 'Número sin nombre · 2 mensajes hoy'}],
    noTenemos: [{texto: 'Local en el Eixample, para alquilar', sub: 'Pau Ríos · ' + ff('2026-11-21')}, {texto: 'Piso con parking en Sant Gervasi', sub: 'Un comprador · ' + ff('2026-11-19')}]
  });

  // ---- H40 · clientes con dos chats (inventados por D) ----
  pon('dosChats', [{texto: 'Elena Vives', sub: 'El WhatsApp de la oficina y el de su agente · unidos el mar 17'}, {texto: 'Ramon Pujol', sub: 'El WhatsApp de la oficina y el de su agente · unidos el jue 19'}]);

  // =====================================================================================================
  // VETA.dir · utilidades de Dirección
  const M = () => VETA.modelo;
  const lee = (k, def) => VETA.est.lee('d.' + k, def);
  const guarda = (k, v) => VETA.est.pon('d.' + k, v);
  const PEND = ['por-hacer', 'pregunta-envio'];
  const RES = ['enviada', 'hecha', 'quitada', 'para-manana'];
  const ZONA = {gracia: 'Gràcia', santgervasi: 'Sant Gervasi'};

  // ruta del detalle de cada decisión
  const RUTA = {'d-carmen': 'asunto/carmen', 'd-regla': 'regla-oficina/dossier', 'd-teresa': 'reparto', 'd-joan': 'asunto/joan-serra'};

  VETA.dir = {
    lee, guarda, PEND, RES,
    // volver tras decidir (la lista de la izquierda en ordenador la repinta el núcleo cuando cambia el modelo)
    vuelve: () => VETA.atras(),
    rutaDe: c => RUTA[c.id] || c.ficha || null,
    persona: id => M().persona(id) || {nombre: id, corto: id},
    zona: id => ZONA[(M().persona(id) || {}).oficina] || '',
    pendiente: c => !!c && PEND.includes(c.estado),
    resuelta: c => !!c && RES.includes(c.estado),
    // a quién está asignado un contacto sin dueño (Carmen va por la decisión d-carmen; Pau y Lucía, por estado propio)
    asignado: id => {
      if (id === 'carmen') {
        const c = M().cosa('d-carmen');
        if (!c || !RES.includes(c.estado) || c.estado === 'para-manana' || (c.extra && c.extra.aparca)) return null;
        return {a: (c.extra && c.extra.a) || 'laura', hora: c.hora, linea: (c.extra && c.extra.linea) || 'Carmen López, asignada a Laura', decision: true};
      }
      const x = lee('asignados', {})[id];
      return x || null;
    },
    asigna: (id, a) => {
      const p = VETA.dir.persona(a), nombre = ((D.contactos || []).find(x => x.id === id) || {}).nombre || id;
      const linea = a === 'montse' ? nombre + ' · lo llevas tú' : nombre + ', asignado a ' + p.corto;
      if (id === 'carmen') {
        if (a === 'laura') M().marca('d-carmen', 'hecha', {a, linea: 'Carmen López, asignada a Laura'});
        else M().marca('d-carmen', 'quitada', {a, linea: a === 'montse' ? 'Carmen López · la llevas tú' : 'Carmen López, asignada a ' + p.corto});
        return;
      }
      const t = lee('asignados', {}); t[id] = {a, hora: VETA.ahora(), linea: id === 'lucia' ? linea.replace('asignado', 'asignada') : linea}; guarda('asignados', t);
    },
    desasigna: id => {
      if (id === 'carmen') { M().deshaz('d-carmen'); return; }
      const t = lee('asignados', {}); delete t[id]; guarda('asignados', t);
    },
    // ronda 8 (capacidad 15 de la A) · un contacto que no lleva nadie también se puede dejar «para luego» o descartar.
    // Carmen va por su decisión (d-carmen), como siempre; Pau y Lucía, por estado propio. Aparcado = sale de lo que espera decisión.
    aparcado: id => {
      if (id === 'carmen') { const c = M().cosa('d-carmen'); return c && RES.includes(c.estado) && c.extra && c.extra.aparca ? {que: c.extra.aparca, hora: c.hora, linea: c.extra.linea} : null; }
      return lee('aparcados', {})[id] || null;
    },
    aparca: (id, que) => {
      const nombre = ((D.contactos || []).find(x => x.id === id) || {}).nombre || id;
      const linea = (que === 'luego' ? 'Para luego · ' : 'Descartado · ') + nombre;
      if (id === 'carmen') { M().marca('d-carmen', que === 'luego' ? 'para-manana' : 'quitada', {aparca: que, linea}); return linea; }
      const t = lee('aparcados', {}); t[id] = {que, hora: VETA.ahora(), linea}; guarda('aparcados', t);
      return linea;
    },
    desaparca: id => {
      if (id === 'carmen') { M().deshaz('d-carmen'); return; }
      const t = lee('aparcados', {}); delete t[id]; guarda('aparcados', t);
    },
    // la cartera de Teresa: a quién (elegido) y si ya se pasó
    carteraA: () => lee('carteraA', 'laura'),
    carteraTexto: a => a === 'dos' ? 'Laura y Anna' : VETA.dir.persona(a).corto,
    cartera: () => { const c = M().cosa('d-teresa'); return c && c.estado === 'hecha' ? c : null; },
    temas: () => {
      const ids = M().lee('temas', null) || D.temasIniciales || [];
      return ids.map(id => (D.temas || []).find(t => t.id === id)).filter(Boolean);
    },
    // filas de la oficina con su número
    // la regla del dossier lleva el nombre de Laura solo si ella la propuso a la oficina (H20, donde se le dice que Montse la verá con su nombre)
    laPropuso: () => !!(VETA.est.lee('c.aOficina', {}) || {})['r-valoraciones'],
    proponeRegla: () => VETA.dir.laPropuso() ? 'Lo propone Laura Martí' : 'Lo propongo yo: lo he visto en la oficina',
    paradas: () => M().operaciones().filter(o => o.estado === 'parado'),
    sinResponder: () => (D.contactos || []).filter(c => !VETA.dir.asignado(c.id) && (VETA.dir.aparcado(c.id) || {}).que !== 'descartado'),
    sinDueno: () => (D.contactos || []).filter(c => c.sinDueno && !VETA.dir.asignado(c.id) && !VETA.dir.aparcado(c.id))
  };
})();
