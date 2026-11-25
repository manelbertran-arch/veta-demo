/* Veta demo · datos · extra-d.js · paquete D (Dirección)
   Datos que el paquete D necesita y no están en js/datos/ (base, dia, clientes, veta, oficina).
   Se añaden a VETA.datos sin pisar lo que ya hay, y cada dato nuevo se apunta en ESTADO_D.md.
   Al final, VETA.dir: utilidades que comparten las pantallas y hojas de Dirección (estado propio con prefijo “d.”). */
(function () {
  'use strict';
  const f = iso => VETA.fecha.corta(iso), ff = iso => VETA.fecha.corta(iso, {frase: true});   // las fechas salen de VETA.fecha, no se escriben a mano
  const D = VETA.datos;
  const pon = (k, v) => { if (!(k in D)) D[k] = v; };

  // ---- G2 · un asunto: lo que ha pasado y quién puede llevarlo (Carmen es del plan; Pau, Lucía y Joan, inventados por D) ----
  pon('asuntos', {
    carmen: {
      contacto: 'carmen', tipo: 'contacto', zona: 'Gràcia', decision: 'd-carmen', propone: 'laura',
      etiqueta: 'No one has her · Gràcia',
      pide: {texto: 'Looking for a 3-bedroom flat in Gràcia, up to €450,000', origen: 'Office WhatsApp · ' + ff('2026-11-22T19:10')},
      paso: [{cuando: f('2026-11-22T19:10'), texto: 'Writes to the office WhatsApp'}, {cuando: f('2026-11-22T19:11'), texto: 'Nobody handles contacts that arrive out of hours'}, {cuando: f('2026-11-23T08:00'), texto: 'Still no reply: 13 hours'}],
      encaja: {piso: 'verdi', texto: 'Verdi 42 · 3 bedrooms · €395,000', pega: 'No lift'},
      pueden: [{id: 'laura', sub: 'Gràcia · I would give it to her'}, {id: 'anna', sub: 'Gràcia'}, {id: 'montse', sub: 'Sant Gervasi', tu: true}]
    },
    'pau-rios': {
      contacto: 'pau-rios', tipo: 'contacto', zona: 'Eixample', propone: 'david',
      etiqueta: 'No one has him · Eixample',
      pide: {texto: 'Do you have any commercial premises to rent in the Eixample?', origen: 'Office WhatsApp · ' + ff('2026-11-21T13:20')},
      paso: [{cuando: f('2026-11-21T13:20'), texto: 'Writes to the office WhatsApp'}, {cuando: f('2026-11-21T13:21'), texto: 'Nobody handles weekend contacts'}, {cuando: f('2026-11-23T08:00'), texto: 'Still no reply: 2 days'}],
      noHay: 'You don\'t have any commercial premises in the Eixample. It\'s logged in “Asked for what you don\'t have”.',
      pueden: [{id: 'david', sub: 'Sant Gervasi · I would give it to him'}, {id: 'marc', sub: 'Sant Gervasi'}, {id: 'montse', sub: 'Sant Gervasi', tu: true}]
    },
    lucia: {
      contacto: 'lucia', tipo: 'contacto', zona: 'Sant Gervasi', propone: 'marc',
      etiqueta: 'No one has her · Sant Gervasi',
      pide: {texto: 'I want to sell my parents\' flat in Sant Gervasi. How do you work?', origen: 'Office WhatsApp · ' + ff('2026-11-23T07:40')},
      paso: [{cuando: f('2026-11-23T07:40'), texto: 'Writes to the office WhatsApp'}, {cuando: f('2026-11-23T07:41'), texto: 'Arrives before the office opens'}, {cuando: f('2026-11-23T08:00'), texto: 'Still no reply'}],
      noHay: 'Wants to sell: it is a new flat for Sant Gervasi.',
      pueden: [{id: 'marc', sub: 'Sant Gervasi · I would give it to him'}, {id: 'david', sub: 'Sant Gervasi'}, {id: 'montse', sub: 'Sant Gervasi', tu: true}]
    },
    'joan-serra': {
      contacto: 'joan-serra', tipo: 'queja', decision: 'd-joan', lleva: 'marc',
      etiqueta: 'Owner complaint',
      pide: {texto: 'Ten days without news about the flat. If nobody tells me anything, I\'m going to another agency.', origen: 'WhatsApp ·  ' + ff('2026-11-21T20:05')},
      paso: [{cuando: f('2026-11-12'), texto: 'The sale of his Sant Cugat house stalls at the offer stage'}, {cuando: f('2026-11-21T20:05'), texto: 'Writes on WhatsApp: complains'}, {cuando: f('2026-11-23T08:00'), texto: 'Still open since Saturday'}],
      operacion: 'Sale in Sant Cugat · stalled · 10 days · Offer stage'
    }
  });

  // ---- G2b · reglas y prácticas de la oficina (dossier es del plan; las otras dos frases, inventadas por D) ----
  pon('reglasOficina', {
    dossier: {titulo: 'Flat report the next day', corto: 'Flat report', decision: 'd-regla', get propone() { return VETA.dir.proponeRegla(); },
      frase: 'When someone asks for a valuation, I prepare the flat report for the next day and the agent sends it.',
      desde: '23 valuation requests.'},
    'mismo-dia': {titulo: 'Reply the same day', corto: 'Reply the same day', propone: 'I was already doing this', estado: 'a-prueba', dia: 9,
      frase: 'When a new contact writes, I write the reply the same day and the agent sends it.',
      desde: '301 new contacts since we started.'},
    actas: {titulo: 'Tell me about the viewing when you leave', corto: 'Tell me about the viewing', propone: 'Anna Costa suggested it', estado: 'en-marcha', usan: '4 of 6',
      frase: 'When you leave a viewing, the agent tells me in a minute and I write the viewing notes.',
      desde: '212 viewings since we started.'}
  });

  // ---- G3 · lo que está parado y lo aprendido ----
  pon('aprendidoSemana', ['In Gràcia almost everyone asks to see the flat on a Saturday.', 'Whoever asks for balcony photos usually asks for a viewing.', 'If an owner goes 10 days without news, they usually complain.']);

  // ---- G3c · los casos de cada tema (sin nombres de agentes; inventados por D salvo los contactos) ----
  pon('casosTema', {
    esperando: ['Marta Puig · waiting for a reply since Thursday', 'Rubén Gil · wants to know how the viewings are going', 'Guillem Roig · Wednesday\'s viewing to be confirmed', '… and 8 more'],
    promesas: ['A certificate promised for this week · 5 days with no proof', 'A call promised for Monday · 4 days', 'Some photos promised for tomorrow · 3 days', '… and 4 more'],
    quieren: ['Lucía Gómez · wants to sell in Sant Gervasi', 'Carmen López · wants to buy in Gràcia', 'Pau Ríos · looking for premises to rent', '… and 6 more'],
    contactos: null,
    respuesta: ['Monday to Friday, in office hours: 1 h 50 min', 'Out of hours and at weekends: 14 h', 'Best day: Tuesday'],
    visitas: ['Wed 25 · Muntaner 214', 'Thu 26, 10:00 · with Ramon Pujol', 'Sat 28 · two viewings in Gràcia', 'Sat 28 · one viewing in Sants']
  });

  // ---- G3e · semana a semana (casos preparados); 16 nov = 156 del cuadro de ocho ----
  pon('semanas', [{id: '26-oct', texto: f('2026-10-26'), n: 118}, {id: '2-nov', texto: f('2026-11-02'), n: 127}, {id: '9-nov', texto: f('2026-11-09'), n: 141}, {id: '16-nov', texto: f('2026-11-16'), n: 156}]);

  // ---- G6 · avisos ----
  pon('avisos', {
    ejemplos: [
      {id: 'ej-2h', corto: '2 h no reply', texto: 'A new contact goes 2 hours without a reply', casos: ['Yesterday, 19:10 · Carmen López, new contact', 'Sat 21, 13:20 · Pau Ríos, new contact', 'Thu 19, 21:05 · an unnamed number', 'Tue 17, 14:30 · a buyer in Sants', '16 Nov, 20:45 · a seller in Gràcia']},
      {id: 'ej-firma', corto: 'Signing, no doc', texto: 'A signing approaches without the land registry extract', casos: ['Fri 20 · Poblenou signing, 1 Dec, no land registry extract', '11 Nov · Horta signing, 5 days away', '2 Nov · Sants signing, 4 days away', '27 Oct · Gràcia signing, 6 days away', '15 Oct · Sant Gervasi signing, 3 days away']},
      {id: 'ej-parada', corto: 'Stalled 10 days', texto: 'A deal stays stalled for more than 10 days', casos: ['Today · a sale in Gràcia, 12 days in Viewings', 'Today · the Sant Cugat house, 10 days in Offer', '13 Nov · premises, 6 weeks in Contact', '2 Nov · a purchase in Sants, 11 days', '21 Oct · a sale in Horta, 14 days']}
    ],
    puestos: [
      {id: 'av-queja', texto: 'An owner complains', salto: 'alerted you ' + ff('2026-11-21T20:05'), saltoLargo: 'Alerted you ' + ff('2026-11-21T20:05') + ': complaint from Joan Serra.'},
      {id: 'av-sabado', texto: 'A Saturday viewing is cancelled', salto: 'hasn\'t alerted you yet'},
      {id: 'av-valoracion', texto: 'Valuation asked out of hours', salto: 'hasn\'t alerted you yet'}
    ],
    generico: ['Yesterday · a similar case in Gràcia', 'Fri 20 · a similar case in Sant Gervasi', 'Tue 17 · a similar case in Sants']
  });

  // ---- G7 · lo que escucha Veta ----
  pon('escucha', [
    {id: 'whatsapp', texto: 'WhatsApp Business'}
  ]);

  // ---- G7c · parte diario del piloto y los cinco anteriores (inventados por D) ----
  pon('partesPiloto', [
    {dia: f('2026-11-20'), texto: 'Read 38 chats. Detected 24 cases; prepared 21; completed 18. Awaiting approval: 3.'},
    {dia: f('2026-11-19'), texto: 'Read 44 chats. Found 29 cases; prepared 25; completed 22.'},
    {dia: f('2026-11-18'), texto: 'Read 35 chats. Detected 22 cases; prepared 19; completed 17.'},
    {dia: f('2026-11-17'), texto: 'Read 41 chats. Found 27 cases; prepared 23; completed 19.'},
    {dia: f('2026-11-16'), texto: 'Read 47 chats. Detected 31 cases; prepared 26; completed 21.'}
  ]);

  // ---- G8 · captación, radiografía y decisiones ----
  pon('informeSemana', {
    captacion: [['Want to sell', '9'], ['New contacts', '14'], ['No reply yet', '5']],
    radiografia: [['Promises found', '12'], ['Promises with no record', '7'], ['Relationships going cold', '6'], ['Profiles without a phone', '4']],
    decisiones: [['Decided last week', '6'], ['You have to decide today', '4']],
    paradasOficina: {gracia: 3, santgervasi: 1}
  });

  // ---- G9 · lo que entra (los dos “escriben dos veces” y el “parking”, inventados por D) ----
  pon('entra', {
    dosVeces: [{id: 'ramon', texto: 'Ramon Pujol · 2 messages since yesterday'}, {id: 'sin-nombre', texto: 'Unnamed number · 2 messages today'}],
    noTenemos: [{texto: 'Commercial premises in the Eixample, to rent', sub: 'Pau Ríos ·  ' + ff('2026-11-21')}, {texto: 'Flat with parking in Sant Gervasi', sub: 'A buyer ·  ' + ff('2026-11-19')}]
  });

  // ---- H40 · clientes con dos chats (inventados por D) ----
  pon('dosChats', [{texto: 'Elena Vives', sub: 'The office WhatsApp and their agent\'s · merged on Tue 17'}, {texto: 'Ramon Pujol', sub: 'The office WhatsApp and their agent\'s · merged on Thu 19'}]);

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
        return {a: (c.extra && c.extra.a) || 'laura', hora: c.hora, linea: (c.extra && c.extra.linea) || 'Carmen López, assigned to Laura', decision: true};
      }
      const x = lee('asignados', {})[id];
      return x || null;
    },
    asigna: (id, a) => {
      const p = VETA.dir.persona(a), nombre = ((D.contactos || []).find(x => x.id === id) || {}).nombre || id;
      const linea = a === 'montse' ? nombre + ' · you have it' : nombre + ', assigned to ' + p.corto;
      if (id === 'carmen') {
        if (a === 'laura') M().marca('d-carmen', 'hecha', {a, linea: 'Carmen López, assigned to Laura'});
        else M().marca('d-carmen', 'quitada', {a, linea: a === 'montse' ? 'Carmen López · you handle her' : 'Carmen López, assigned to ' + p.corto});
        return;
      }
      const t = lee('asignados', {}); t[id] = {a, hora: VETA.ahora(), linea: id === 'lucia' ? linea.replace('asignado', 'asignada') : linea}; guarda('asignados', t);
    },
    desasigna: id => {
      if (id === 'carmen') { M().deshaz('d-carmen'); return; }
      const t = lee('asignados', {}); delete t[id]; guarda('asignados', t);
    },
    // ronda 8 (capacidad 15 de la A) · un contacto que no lleva nadie también se puede dejar “para luego” o descartar.
    // Carmen va por su decisión (d-carmen), como siempre; Pau y Lucía, por estado propio. Aparcado = sale de lo que espera decisión.
    aparcado: id => {
      if (id === 'carmen') { const c = M().cosa('d-carmen'); return c && RES.includes(c.estado) && c.extra && c.extra.aparca ? {que: c.extra.aparca, hora: c.hora, linea: c.extra.linea} : null; }
      return lee('aparcados', {})[id] || null;
    },
    aparca: (id, que) => {
      const nombre = ((D.contactos || []).find(x => x.id === id) || {}).nombre || id;
      const linea = (que === 'luego' ? 'For later · ' : 'Dismissed · ') + nombre;
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
    carteraTexto: a => a === 'dos' ? 'Laura and Anna' : VETA.dir.persona(a).corto,
    cartera: () => { const c = M().cosa('d-teresa'); return c && c.estado === 'hecha' ? c : null; },
    temas: () => {
      const ids = M().lee('temas', null) || D.temasIniciales || [];
      return ids.map(id => (D.temas || []).find(t => t.id === id)).filter(Boolean);
    },
    // filas de la oficina con su número
    // la regla del dossier lleva el nombre de Laura solo si ella la propuso a la oficina (H20, donde se le dice que Montse la verá con su nombre)
    laPropuso: () => !!(VETA.est.lee('c.aOficina', {}) || {})['r-valoraciones'],
    proponeRegla: () => VETA.dir.laPropuso() ? 'Laura Martí suggests it' : 'I suggest it: I saw it in the office',
    paradas: () => M().operaciones().filter(o => o.estado === 'parado'),
    sinResponder: () => (D.contactos || []).filter(c => !VETA.dir.asignado(c.id) && (VETA.dir.aparcado(c.id) || {}).que !== 'descartado'),
    sinDueno: () => (D.contactos || []).filter(c => c.sinDueno && !VETA.dir.asignado(c.id) && !VETA.dir.aparcado(c.id))
  };
})();
