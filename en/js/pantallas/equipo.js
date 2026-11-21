/* Veta demo · pantallas · equipo.js · paquete D (Dirección)
   G1 · Equipo · #/equipo — ronda 6: trabajo que Veta ya hace por la oficina, “Tienes que decidir” (la cola, que se vacía),
   lo que el equipo le pide a Veta, la entrada a Operaciones y las personas del equipo (con nombres, sin podio).
   En móvil: una tarjeta abierta y las demás en filas. En ordenador (lista de 380 a la izquierda): las decisiones son filas
   y la elegida se abre en el panel con su pantalla (G2, G2b o G5), como una bandeja de entrada. */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, M = VETA.modelo, X = VETA.dir;
  let abiertas = false;                                          // “N decididas hoy” desplegado
  let mas = false;                                               // “Más de la oficina” desplegado

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
  // la tarjeta abierta: “Por decidir” va en la etiqueta y no se repite en la línea de quién es (así el botón se ve sin desplazar)
  const QUIEN = {'d-carmen': 'Nobody is handling her', 'd-regla': 'A job for the office', 'd-teresa': 'Her clients, with no one looking after them', 'd-joan': 'Owner complaint'};
  const tarjeta = (c, n, total) => UI.tarjetaCosa(Object.assign({}, c, {quienEs: QUIEN[c.id] || c.quienEs, etiqueta: null}), {n, total});

  // “Cómo va la oficina hoy”: en ordenador, tarjeta con los tres temas en cifras; en móvil, una fila de tres líneas
  const CORTO = {esperando: 'Waiting', promesas: 'Promises', quieren: 'Want to sell or buy', contactos: 'New contacts', respuesta: 'Replies', visitas: 'Viewings'};
  function oficina(ord) {
    const temas = X.temas(), g = 'How the office is doing today|Pick the three topics you want to see at the top and in the meeting.';
    // “parada” tiene una sola definición en toda la app: más de 7 días sin moverse (las mismas que cuenta Semana)
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

  // ---- ronda 6 · “Trabajo que Veta ya hace por la oficina”: cuatro semanas, lo que dejé listo arriba y lo que me corregisteis abajo ----
  const R6 = () => VETA.datos.r6.direccion;
  function trabajo(i) {
    const s = R6().semanas, n = s.listos.length, maxL = Math.max.apply(null, s.listos);
    const cols = s.etiquetas.map((e, k) => `<span class="d-4s-c${k === n - 1 ? ' d-4s-hoy' : ''}"><b class="d-4s-n">${s.listos[k]}</b>` +
      `<span class="d-4s-a" style="--v:${(s.listos[k] / maxL).toFixed(3)}"></span><span class="d-4s-e">${esc(e)}</span></span>`).join('');
    return `<section class="bloque d-trabajo" data-i="${i}"><h2 class="bloque-t">Work Veta already does for the office</h2>` +
      `<p class="d-4s-t">Last week I got <b>${VETA.vivo.cuenta({de: s.listos[0], a: s.listos[n - 1], clave: 'd-4s'})}</b> things ready for you. A month ago, ${s.listos[0]}.</p>` +
      `<div class="d-4s" role="img" aria-label="Things I got ready for you each week, the last four: from ${s.listos[0]} to ${s.listos[n - 1]}">${cols}</div>` +
      `<p class="d-4s-t">You corrected me <b>${s.corregidos[n - 1]}</b> times. A month ago, ${s.corregidos[0]}.</p>` +
      UI.boton({tipo: 'texto', texto: 'See the week', ir: 'semana-equipo', ancho: false}) + '</section>';
  }
  // ---- “Lo que tu equipo le pide a Veta”: lo que aún se hace a mano, por tema y quién ----
  function pide(i) {
    const l = R6().pide, total = l.reduce((a, x) => a + x.veces, 0);
    return `<section class="bloque d-pide" data-i="${i}"><h2 class="bloque-t">What your team asks Veta for</h2>` +
      `<p class="bloque-sub">Things the team has done by hand ${total} times. I can learn them.</p>` +
      `<div class="lista">${l.map(x => UI.fila({titulo: x.tema, sub: x.quien, derecha: x.veces + ' times', icono: 'mano'})).join('')}</div>` +
      UI.boton({tipo: 'secundario', texto: 'Teach me the first one', ir: 'dictar/orden', icono: 'mic'}) + '</section>';
  }
  // ---- la entrada a Operaciones y las personas ----
  // “hay que mirarlas” es solo lo que pide que alguien haga algo hoy (nadie contesta, una queja, parada o sin nadie): la misma cuenta
  // que el filtro de Operaciones y que la suma de las fichas. Un papel con fecha o una promesa para el jueves es trabajo normal.
  function operaciones(i) {
    const l = X.ops(), ojo = l.filter(o => o.mirar).length;
    const sub = `${l.length} deals · ` + (ojo ? `${ojo} ${ojo === 1 ? 'needs a look' : 'need a look'} today` : 'none to look at today');
    return UI.lista([{titulo: 'Deals', sub, icono: 'orden', ir: 'operaciones', clase: 'd-ir-ops'}], {i, clase: 'd-ops-entrada'});
  }
  // una sola lista, sin rótulos que clasifiquen a nadie. De cada persona se dice lo que pasa; en rojo, solo “sin contestar”.
  function equipo(i) {
    const e = X.equipoOps(), yo = VETA.yo().id;
    const fila = x => {
      const partes = x.partes.map(p => p.rojo ? `<span class="d-rojo-t">${esc(p.texto)}</span>` : esc(p.texto));
      const sub = x.baja ? `Off sick · ${x.pendientes} conversations not looked after` : x.resumen;
      return {titulo: x.p.nombre + (x.id === yo ? ' (you)' : ''), av: x.id, ir: 'persona/' + x.id, sub,
        subHtml: x.baja ? null : esc(x.cuantas) + ' · ' + (partes.length ? partes.join(' · ') : 'all up to date')};
    };
    return `<section class="bloque d-personas" data-i="${i}"><h2 class="bloque-t">The team</h2>${UI.lista(e.todos.map(fila))}</section>`;
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
  // “Cómo va la oficina hoy” y las siete filas de la oficina, en una sola fila que se abre aquí mismo
  function masOficina(ord, i) {
    return `<div class="d-mas" data-i="${i}"><button type="button" class="fila d-mas-b" data-accion="mas" aria-expanded="${mas}">` +
      `<span class="fila-ic">${VETA.ic('grafica', 22)}</span><span class="fila-c"><span class="fila-t">More about the office</span>` +
      `<span class="fila-s">How it is going today, the week, what comes in, alerts and settings</span></span>` +
      `<span class="fila-chev chev-gira">${VETA.ic('abajo', 16)}</span></button>` +
      `<div class="d-mas-l"${mas ? '' : ' hidden'}>${oficina(ord)}${deLaOficina()}</div></div>`;
  }

  function decididas(lista) {
    if (!lista.length) return '';
    const n = lista.length;
    return `<div class="d-decididas"><button type="button" class="fila d-decididas-b" data-accion="decididas" aria-expanded="${abiertas}">` +
      `<span class="fila-ic">${VETA.ic('check', 22)}</span><span class="fila-c"><span class="fila-t">${n} ${n === 1 ? 'decided' : 'decided'} today</span></span>` +
      `<span class="fila-chev chev-gira">${VETA.ic('abajo', 16)}</span></button>` +
      `<div class="d-decididas-l"${abiertas ? '' : ' hidden'}>${lista.map(c => UI.lineaCosa(c)).join('')}</div></div>`;
  }

  VETA.pantalla('G1', {
    titulo: 'Team',
    guia: ['Here you see the work Veta already does for the office, what you have to decide, and every deal and person.', 'You decide with one tap, or open a deal or a person to see it in full.', 'This way you know what is happening in the office without having to ask.'],
    pinta: () => {
      const ord = VETA.ordenador();
      const ds = M.decisiones();
      const pend = ds.filter(X.pendiente);
      const ult = M.ultima('equipo');
      // “N decididas hoy” cuenta todas, también la última: Por decidir + decididas = las 4 de hoy
      const resueltas = ds.filter(c => X.resuelta(c)).sort((a, b) => a.orden - b.orden);
      const leido = UI.fila({titulo: VETA.datos.fecha.hoyTexto, sub: 'Read up to ' + VETA.ahora(-3), icono: 'reloj', hoja: 'h04', datos: {quien: 'equipo'}, clase: 'd-leido', i: 0,
        g: 'What I have read|The office channels and up to what time I have read them.'});
      let cola;
      if (!pend.length) {
        cola = `<div>${ult ? UI.lineaCosa(ult) : ''}${UI.vacio({titulo: 'Nothing to decide in the team.', texto: 'When something comes in that needs your decision, it will appear here.', icono: 'check'})}</div>`;
      } else if (ord) {
        // ordenador: todas las decisiones en filas; la primera se abre sola en el panel
        cola = (ult ? UI.lineaCosa(ult) : '') + UI.lista(pend.map((c, k) => filaDe(c, (k + 1) + ' of ' + pend.length)), {clase: 'd-cola'});
      } else {
        // se cuenta sobre lo que queda (“1 de 3”): el número no salta al decidir otra cosa
        cola = `<div class="d-cola-m">${ult ? UI.lineaCosa(ult) : ''}${tarjeta(pend[0], 1, pend.length)}</div>` +
          (pend.length > 1 ? UI.lista(pend.slice(1).map(c => filaDe(c)), {clase: 'd-cola'}) : '');
      }
      // pulido: trabajo de Veta → Tienes que decidir → Operaciones → El equipo → Lo que tu equipo le pide a Veta → “Más de la oficina”
      const decide = `<section class="bloque d-decide" data-i="2"><h2 class="bloque-t">You have to decide${pend.length ? ' · ' + pend.length : ''}</h2>${cola}${decididas(resueltas)}</section>`;
      return `<div class="d-equipo${ord ? ' d-equipo-ord' : ''}">` + leido + trabajo(1) + decide + operaciones(3) + equipo(3) + pide(4) + masOficina(ord, 4) + '</div>';
    },
    acciones: {
      asignar(ev, el) {
        if (el.dataset.de === 'd-carmen') X.asigna('carmen', 'laura'); else M.marca(el.dataset.de, 'hecha');
        VETA.repinta({hecho: el.dataset.de});
      },
      mas(ev, el) {
        mas = !mas;
        el.setAttribute('aria-expanded', String(mas));
        const l = el.parentNode.querySelector('.d-mas-l'); if (l) l.hidden = !mas;
      },
      decididas(ev, el) {
        abiertas = !abiertas;
        el.setAttribute('aria-expanded', String(abiertas));
        const l = el.parentNode.querySelector('.d-decididas-l'); if (l) l.hidden = !abiertas;
      }
    }
  });
})();
