/* Veta demo · pantallas · equipo.js · paquete D (Dirección)
   G1 · Equipo · #/equipo — ronda 7: una pantalla corta de puertas (decidir, operaciones, equipo, semana, enseñar a Veta, más).
   Nada llega desplegado: cada puerta abre su pantalla.
   G1d · #/equipo/decidir — «Tienes que decidir» (la cola, que se vacía): una tarjeta abierta y las demás en filas.
   G1p · #/equipo/personas — las personas del equipo (con nombres, sin podio).
   G1m · #/equipo/oficina — lo que entra, los avisos, las conexiones y los ajustes. */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, M = VETA.modelo, X = VETA.dir;
  let abiertas = false;                                          // «N decididas hoy» desplegado

  // lo que se ve de cada decisión en la fila (y en ordenador, en la lista)
  const FILA = {
    'd-carmen': {titulo: 'Carmen López', sub: 'Nobody is handling her · yesterday, 19:10'},
    'd-regla': {titulo: 'A job for the whole office', get sub() { return 'Flat report the next day · ' + (X.laPropuso() ? 'Laura suggests it' : 'I suggest it'); }},
    'd-teresa': {titulo: 'Teresa is on leave', sub: '34 unattended conversations'},
    'd-joan': {titulo: 'Complaint from Joan Serra, owner', sub: 'Marc handles it · Saturday 21, 20:05'}
  };
  const filaDe = (c, n) => {
    const f = FILA[c.id] || {titulo: c.fila || c.titulo, sub: c.filaSub};
    return {titulo: f.titulo, sub: f.sub, av: c.av || c.cliente || null, icono: c.av || c.cliente ? null : (c.icono || 'estrella'),
      ir: X.rutaDe(c), vt: 'cola-' + c.id, derecha: n ? n : null, focoFoto: !!(c.av || c.cliente)};
  };
  // la tarjeta abierta: «Por decidir» va en la etiqueta y no se repite en la línea de quién es (así el botón se ve sin desplazar)
  const QUIEN = {'d-carmen': 'Nobody is handling her', 'd-regla': 'A job for the office', 'd-teresa': 'Her clients, with no one looking after them', 'd-joan': 'Owner complaint'};
  const tarjeta = (c, n, total) => UI.tarjetaCosa(Object.assign({}, c, {quienEs: QUIEN[c.id] || c.quienEs, etiqueta: null}), {n, total});

  // «Cómo va la oficina hoy»: en ordenador, tarjeta con los tres temas en cifras; en móvil, una fila de tres líneas
  const CORTO = {esperando: 'Waiting', promesas: 'Promises', quieren: 'Want to sell or buy', contactos: 'New contacts', respuesta: 'Replies', visitas: 'Viewings'};
  function oficina(ord) {
    const temas = X.temas(), g = 'How the office is doing today|Pick the three topics you want to see at the top and in the meeting.';
    // «parada» tiene una sola definición en toda la app: más de 7 días sin moverse (las mismas que cuenta Semana)
    const np = X.paradas().length;
    const sub = `25 things in progress · 8 waiting for the client · ${np} ${np === 1 ? 'deal stalled' : 'deals stalled'} for more than 7 days`;
    if (!ord) return `<button type="button" class="fila d-oficina-m" data-hoja="h34" data-i="1" data-g="${esc(g)}"><span class="fila-ic">${VETA.ic('grafica', 22)}</span>` +
      `<span class="fila-c"><span class="fila-t">How the office is doing today</span><span class="fila-s">${sub}</span>` +
      `<span class="d-temas-l">${temas.map(t => `<span>${esc(CORTO[t.id] || t.texto)} <b>${esc(t.cifra)}</b></span>`).join('<i aria-hidden="true">·</i>')}</span></span>` +
      `<span class="fila-chev">${VETA.ic('chev', 16)}</span></button>`;
    return `<button type="button" class="d-oficina" data-hoja="h34" data-i="1" data-g="${esc(g)}">` +
      `<span class="d-oficina-cab"><span class="d-oficina-t">How the office is doing today</span><span class="fila-chev">${VETA.ic('chev', 16)}</span></span>` +
      `<span class="d-oficina-s">${sub}</span>` +
      `<span class="d-temas d-temas-ord">${temas.map(t => `<span class="d-tema"><b>${esc(t.cifra)}</b><span>${esc(t.texto)}</span></span>`).join('')}</span></button>`;
  }

  const R6 = () => VETA.datos.r6.direccion;
  // una sola lista, sin rótulos que clasifiquen a nadie. De cada persona se dice lo que pasa; en rojo, solo «sin contestar».
  function equipo(i) {
    const e = X.equipoOps(), yo = VETA.yo().id;
    const fila = x => {
      const partes = x.partes.map(p => p.rojo ? `<span class="d-rojo-t">${esc(p.texto)}</span>` : esc(p.texto));
      const sub = x.baja ? `Off sick · ${x.pendientes} conversations not looked after` : x.resumen;
      return {titulo: x.p.nombre + (x.id === yo ? ' (you)' : ''), av: x.id, ir: 'persona/' + x.id, sub,
        subHtml: x.baja ? null : esc(x.cuantas) + ' · ' + (partes.length ? partes.join(' · ') : 'all up to date')};
    };
    return UI.lista(e.todos.map(fila), {i, clase: 'd-personas'});
  }

  function deLaOficina(i) {
    const avisosOff = X.lee('avisosOff', {}), creados = X.lee('avisos', []);
    const puestos = (VETA.datos.avisos.puestos.filter(a => !avisosOff[a.id]).length) + creados.filter(a => !avisosOff[a.id]).length;
    const sin = X.sinResponder().length;
    return UI.lista([
      {titulo: 'Week', sub: '156 messages and tasks ready', icono: 'cal', ir: 'semana-equipo'},
      {titulo: 'What\'s coming in', sub: sin === 1 ? '1 contact without a reply' : sin + ' contacts without a reply', icono: 'entra', ir: 'entra'},
      {titulo: 'Alerts', sub: (puestos === 1 ? 'you have 1' : 'you have ' + puestos) + ' · 1 alerted you on Saturday', icono: 'campana', ir: 'avisos'},
      {titulo: 'What Veta does for your office', icono: 'aprende', ir: 'oficina-que-hace'},
      {titulo: 'The office before and now', icono: 'grafica', ir: 'oficina-antes-ahora'},
      {titulo: 'What you see and what everyone sees', icono: 'candado', ir: 'confianza'},
      {titulo: 'Connections and settings', icono: 'wifi', ir: 'conexiones'}]);
  }
  function decididas(lista) {
    if (!lista.length) return '';
    const n = lista.length;
    return `<div class="d-decididas"><button type="button" class="fila d-decididas-b" data-accion="decididas" aria-expanded="${abiertas}">` +
      `<span class="fila-ic">${VETA.ic('check', 22)}</span><span class="fila-c"><span class="fila-t">${n} ${n === 1 ? 'decided' : 'decided'} today</span></span>` +
      `<span class="fila-chev chev-gira">${VETA.ic('abajo', 16)}</span></button>` +
      `<div class="d-decididas-l"${abiertas ? '' : ' hidden'}>${lista.map(c => UI.lineaCosa(c)).join('')}</div></div>`;
  }

  // ---- ronda 7 · Equipo es una pantalla corta de puertas: lo que puedes ver o decidir, con su número. Cada puerta abre su pantalla ----
  const primer = x => (x.p.corto || String(x.p.nombre || '').split(' ')[0]);
  function puertas() {
    const pend = M.decisiones().filter(X.pendiente);
    const ops = X.ops(), ojo = ops.filter(o => o.mirar).length;
    const e = X.equipoOps(), s = R6().semanas, n = s.listos.length;
    const aMano = R6().pide.reduce((a, x) => a + x.veces, 0);
    const baja = e.todos.filter(x => x.baja), rojo = e.todos.filter(x => !x.baja && x.partes.some(p => p.rojo));
    const f0 = pend[0] ? (FILA[pend[0].id] || {titulo: pend[0].fila || pend[0].titulo}) : null;
    const deEquipo = [baja.length ? primer(baja[0]) + ' is on leave' : null,
      rojo.length ? (rojo.length === 1 ? primer(rojo[0]) + ' has something unanswered' : rojo.length + ' have something unanswered') : null].filter(Boolean).join(' · ');
    return UI.puertas([
      pend.length ? {principal: true, icono: 'estrella', titulo: 'Decide', sub: f0.titulo + (pend.length > 1 ? ', and ' + (pend.length - 1) + ' more.' : '.'), n: pend.length, ir: 'equipo/decidir',
        g: 'Decide|What is waiting for your decision, one thing at a time.'}
        : {principal: true, icono: 'check', titulo: 'Nothing to decide', sub: 'When something needs your decision, it will show here.', ir: 'equipo/decidir'},
      {icono: 'casa', titulo: 'See the deals', sub: ojo ? `${ojo} ${ojo === 1 ? 'needs a look' : 'need a look'} today.` : 'None to look at today.', n: ops.length, ir: 'operaciones', clase: 'd-ir-ops'},
      {caras: e.todos.map(x => x.id), titulo: 'See the team', sub: (deEquipo || 'All up to date') + '.', n: e.todos.length, ir: 'equipo/personas'},
      {icono: 'grafica', titulo: 'See the week', sub: `Things Veta got ready. A month ago, ${s.listos[0]}.`, n: s.listos[n - 1], ir: 'semana-equipo'},
      {icono: 'mic', titulo: 'Teach Veta something', sub: `The team still does ${aMano} things by hand.`, ir: 'oficina/falta'},
      {icono: 'puntos', titulo: 'More from the office', sub: 'What comes in, alerts and settings.', ir: 'equipo/oficina'}
    ], {i: 1, panel: 'equipo/decidir'});
  }

  VETA.pantalla('G1', {
    titulo: 'Team',
    guia: ['Here you see, in a few doors, what you can do with your office.', 'You tap one: decide, see the deals, see the team, see the week or teach Veta something.', 'This way you know what is going on in the office without reading more than you need and without having to ask.'],
    pinta: () => puertas()
  });

  // ---- G1d · Tienes que decidir: la cola de dirección, una tarjeta abierta y las demás en filas ----
  VETA.pantalla('G1d', {
    guia: ['Here Veta brings you what needs a decision from you, one at a time.', 'You decide with one tap, or open the matter to see it in full.', 'This way nothing in the team is left without an owner and the list empties.'],
    pinta: () => {
      const ds = M.decisiones(), pend = ds.filter(X.pendiente), ult = M.ultima('equipo');
      // «N decididas hoy» cuenta todas, también la última: Por decidir + decididas = las de hoy
      const resueltas = ds.filter(c => X.resuelta(c)).sort((a, b) => a.orden - b.orden);
      let cola;
      if (!pend.length) cola = `<div data-i="1">${ult ? UI.lineaCosa(ult) : ''}${UI.vacio({titulo: 'Nothing to decide in the team.', texto: 'When something comes in that needs your decision, it will appear here.', icono: 'check'})}</div>`;
      // se cuenta sobre lo que queda («1 de 3»): el número no salta al decidir otra cosa
      else cola = `<div class="d-cola-m" data-i="1">${ult ? UI.lineaCosa(ult) : ''}${tarjeta(pend[0], 1, pend.length)}</div>` +
        (pend.length > 1 ? UI.lista(pend.slice(1).map(c => filaDe(c)), {clase: 'd-cola', i: 2}) : '');
      return `<div class="d-equipo d-decide">${cola}${decididas(resueltas)}</div>`;
    },
    acciones: {
      asignar(ev, el) {
        if (el.dataset.de === 'd-carmen') X.asigna('carmen', 'laura'); else M.marca(el.dataset.de, 'hecha');
        VETA.repinta({hecho: el.dataset.de});
      },
      decididas(ev, el) {
        abiertas = !abiertas;
        el.setAttribute('aria-expanded', String(abiertas));
        const l = el.parentNode.querySelector('.d-decididas-l'); if (l) l.hidden = !abiertas;
      }
    }
  });

  // ---- G1p · El equipo: las personas, con nombres y sin podio ----
  VETA.pantalla('G1p', {
    guia: ['Here is your team, person by person.', 'You tap one to see what they handle and what Veta does for them.', 'This way you see how each one is doing without reading their chats.'],
    pinta: () => equipo(1)
  });

  // ---- G1m · Más de la oficina: lo que casi nunca hace falta, todo junto ----
  VETA.pantalla('G1m', {
    guia: ['Here is the rest of the office: what comes in, alerts, connections and settings.', 'You open what you need.', 'This way the Team screen keeps to what you do every day.'],
    pinta: () => UI.lista([{titulo: VETA.datos.fecha.hoyTexto, sub: 'Read up to ' + VETA.ahora(-3), icono: 'reloj', hoja: 'h04', datos: {quien: 'equipo'}, clase: 'd-leido',
      g: 'What I have read|The office channels and up to what time I have read them.'}], {i: 1}) + oficina(VETA.ordenador()) + `<div data-i="2">${deLaOficina()}</div>`
  });
})();
