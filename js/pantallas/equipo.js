/* Veta demo · pantallas · equipo.js · paquete D (Dirección)
   G1 · Equipo · #/equipo — la cola de decisiones del equipo. Se vacía.
   En móvil: una tarjeta abierta y las demás en filas. En ordenador (lista de 380 a la izquierda): las decisiones son filas
   y la elegida se abre en el panel con su pantalla (G2, G2b o G5), como una bandeja de entrada. */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, M = VETA.modelo, X = VETA.dir;
  let abiertas = false;                                          // «N decididas hoy» desplegado

  // lo que se ve de cada decisión en la fila (y en ordenador, en la lista)
  const FILA = {
    'd-carmen': {titulo: 'Carmen López', sub: 'Unowned contact · yesterday, 19:10'},
    'd-regla': {titulo: 'A rule for the whole office', get sub() { return 'Dossier the next day · ' + (X.laPropuso() ? 'proposed by Laura' : 'proposed by Veta'); }},
    'd-teresa': {titulo: 'Teresa is on leave', sub: '34 unattended conversations'},
    'd-joan': {titulo: 'Complaint from Joan Serra, owner', sub: 'Marc handles it · Saturday 21, 20:05'}
  };
  const filaDe = (c, n) => {
    const f = FILA[c.id] || {titulo: c.fila || c.titulo, sub: c.filaSub};
    return {titulo: f.titulo, sub: f.sub, av: c.av || c.cliente || null, icono: c.av || c.cliente ? null : (c.icono || 'estrella'),
      ir: X.rutaDe(c), vt: 'cola-' + c.id, derecha: n ? n : null, focoFoto: !!(c.av || c.cliente)};
  };
  // la tarjeta abierta: «Por decidir» va en la etiqueta y no se repite en la línea de quién es (así el botón se ve sin desplazar)
  const QUIEN = {'d-carmen': 'Unowned contact', 'd-regla': 'Office rule', 'd-teresa': 'Unattended portfolio', 'd-joan': 'Owner complaint'};
  const tarjeta = (c, n, total) => UI.tarjetaCosa(Object.assign({}, c, {quienEs: QUIEN[c.id] || c.quienEs}), {n, total});

  // «Cómo va la oficina hoy»: en ordenador, tarjeta con los tres temas en cifras; en móvil, una fila de tres líneas
  const CORTO = {esperando: 'Waiting', promesas: 'Promises', quieren: 'Want to sell or buy', contactos: 'New contacts', respuesta: 'Reply', visitas: 'Viewings'};
  function oficina(ord) {
    const temas = X.temas(), g = 'How the office is doing today|Choose the three topics you want to see at the top and in the meeting.';
    // «parada» tiene una sola definición en toda la app: más de 7 días sin moverse (las mismas que cuenta Semana)
    const np = X.paradas().length;
    const sub = `25 open matters · 8 waiting on others · ${np} ${np === 1 ? 'stalled deal' : 'stalled deals'} over 7 days`;
    if (!ord) return `<button type="button" class="fila d-oficina-m" data-hoja="h34" data-i="1" data-g="${esc(g)}"><span class="fila-ic">${VETA.ic('grafica', 22)}</span>` +
      `<span class="fila-c"><span class="fila-t">How the office is doing today</span><span class="fila-s">${sub}</span>` +
      `<span class="d-temas-l">${temas.map(t => `<span>${esc(CORTO[t.id] || t.texto)} <b>${esc(t.cifra)}</b></span>`).join('<i aria-hidden="true">·</i>')}</span></span>` +
      `<span class="fila-chev">${VETA.ic('chev', 16)}</span></button>`;
    return `<button type="button" class="d-oficina" data-hoja="h34" data-i="1" data-g="${esc(g)}">` +
      `<span class="d-oficina-cab"><span class="d-oficina-t">How the office is doing today</span><span class="fila-chev">${VETA.ic('chev', 16)}</span></span>` +
      `<span class="d-oficina-s">${sub}</span>` +
      `<span class="d-temas d-temas-ord">${temas.map(t => `<span class="d-tema"><b>${esc(t.cifra)}</b><span>${esc(t.texto)}</span></span>`).join('')}</span></button>`;
  }

  function deLaOficina(i) {
    const avisosOff = X.lee('avisosOff', {}), creados = X.lee('avisos', []);
    const puestos = (VETA.datos.avisos.puestos.filter(a => !avisosOff[a.id]).length) + creados.filter(a => !avisosOff[a.id]).length;
    const sin = X.sinResponder().length;
    return UI.bloque({titulo: 'From the office', i, html: UI.lista([
      {titulo: 'Week', sub: '156 messages and tasks ready', icono: 'cal', ir: 'semana-equipo'},
      {titulo: 'What\'s coming in', sub: sin === 1 ? '1 contact without a reply' : sin + ' contacts without a reply', icono: 'entra', ir: 'entra'},
      {titulo: 'Alerts', sub: puestos + (puestos === 1 ? ' set' : ' set') + ' · 1 triggered on Saturday', icono: 'campana', ir: 'avisos'},
      {titulo: 'Connections and settings', icono: 'wifi', ir: 'conexiones'}])});
  }

  function decididas(lista) {
    if (!lista.length) return '';
    const n = lista.length;
    return `<div class="d-decididas" data-i="3"><button type="button" class="fila d-decididas-b" data-accion="decididas" aria-expanded="${abiertas}">` +
      `<span class="fila-ic">${VETA.ic('check', 22)}</span><span class="fila-c"><span class="fila-t">${n} decided today</span></span>` +
      `<span class="fila-chev chev-gira">${VETA.ic('abajo', 16)}</span></button>` +
      `<div class="d-decididas-l"${abiertas ? '' : ' hidden'}>${lista.map(c => UI.lineaCosa(c)).join('')}</div></div>`;
  }

  VETA.pantalla('G1', {
    titulo: 'Team',
    guia: ['Here Veta brings you what needs a decision from you, one thing at a time.', 'You decide with a tap or open the matter to see it in full.', 'That way nothing in the team is left without an owner, and the list empties.'],
    pinta: () => {
      const ord = VETA.ordenador();
      const ds = M.decisiones();
      const pend = ds.filter(X.pendiente);
      const ult = M.ultima('equipo');
      // «N decididas hoy» cuenta todas, también la última: Por decidir + decididas = las 4 de hoy
      const resueltas = ds.filter(c => X.resuelta(c)).sort((a, b) => a.orden - b.orden);
      const leido = UI.fila({titulo: VETA.datos.fecha.hoyTexto, sub: 'Read up to ' + VETA.ahora(-3), icono: 'vigilando', hoja: 'h04', datos: {quien: 'equipo'}, clase: 'd-leido', i: 0,
        g: 'What I\'ve read|The office channels and up to what time I\'ve read them.'});
      let cola;
      if (!pend.length) {
        cola = `<div data-i="2">${ult ? UI.lineaCosa(ult) : ''}${UI.vacio({titulo: 'Nothing to decide in the team.', texto: 'When something comes in that needs your decision, it\'ll show here.', icono: 'check'})}</div>`;
      } else if (ord) {
        // ordenador: todas las decisiones en filas; la primera se abre sola en el panel
        cola = UI.bloque({titulo: 'To decide · ' + pend.length, i: 2, html: (ult ? UI.lineaCosa(ult) : '') +
          UI.lista(pend.map((c, k) => filaDe(c, (k + 1) + ' of ' + pend.length)), {clase: 'd-cola'})});
      } else {
        // se cuenta sobre lo que queda («1 de 3»): el número no salta al decidir otra cosa
        cola = `<div class="d-cola-m" data-i="2">${ult ? UI.lineaCosa(ult) : ''}${tarjeta(pend[0], 1, pend.length)}</div>` +
          (pend.length > 1 ? UI.lista(pend.slice(1).map(c => filaDe(c)), {i: 3, clase: 'd-cola'}) : '');
      }
      return `<div class="d-equipo${ord ? ' d-equipo-ord' : ''}">` + leido + oficina(ord) + cola + decididas(resueltas) + deLaOficina(4) + '</div>';
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
})();
