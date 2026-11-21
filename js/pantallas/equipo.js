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
    'd-carmen': {titulo: 'Carmen López', sub: 'No la lleva nadie · ayer, 19:10'},
    'd-regla': {titulo: 'Un trabajo para toda la oficina', get sub() { return 'Informe del piso al día siguiente · ' + (X.laPropuso() ? 'lo propone Laura' : 'lo propongo yo'); }},
    'd-teresa': {titulo: 'Teresa está de baja', sub: '34 conversaciones sin atender'},
    'd-joan': {titulo: 'Queja de Joan Serra, propietario', sub: 'Lo lleva Marc · sábado 21, 20:05'}
  };
  const filaDe = (c, n) => {
    const f = FILA[c.id] || {titulo: c.fila || c.titulo, sub: c.filaSub};
    return {titulo: f.titulo, sub: f.sub, av: c.av || c.cliente || null, icono: c.av || c.cliente ? null : (c.icono || 'estrella'),
      ir: X.rutaDe(c), vt: 'cola-' + c.id, derecha: n ? n : null, focoFoto: !!(c.av || c.cliente)};
  };
  // la tarjeta abierta: «Por decidir» va en la etiqueta y no se repite en la línea de quién es (así el botón se ve sin desplazar)
  const QUIEN = {'d-carmen': 'No la lleva nadie', 'd-regla': 'Trabajo para la oficina', 'd-teresa': 'Sus clientes, sin atender', 'd-joan': 'Queja de un propietario'};
  const tarjeta = (c, n, total) => UI.tarjetaCosa(Object.assign({}, c, {quienEs: QUIEN[c.id] || c.quienEs, etiqueta: null}), {n, total});

  // «Cómo va la oficina hoy»: en ordenador, tarjeta con los tres temas en cifras; en móvil, una fila de tres líneas
  const CORTO = {esperando: 'Esperando', promesas: 'Promesas', quieren: 'Quieren vender o comprar', contactos: 'Contactos nuevos', respuesta: 'Respuesta', visitas: 'Visitas'};
  function oficina(ord) {
    const temas = X.temas(), g = 'Cómo va la oficina hoy|Elige los tres temas que quieres ver arriba y en la reunión.';
    // «parada» tiene una sola definición en toda la app: más de 7 días sin moverse (las mismas que cuenta Semana)
    const np = X.paradas().length;
    const sub = `25 cosas en marcha · 8 esperan al cliente · ${np} ${np === 1 ? 'operación parada' : 'operaciones paradas'} más de 7 días`;
    if (!ord) return `<button type="button" class="fila d-oficina-m" data-hoja="h34" data-i="1" data-g="${esc(g)}"><span class="fila-ic">${VETA.ic('grafica', 22)}</span>` +
      `<span class="fila-c"><span class="fila-t">Cómo va la oficina hoy</span><span class="fila-s">${sub}</span>` +
      `<span class="d-temas-l">${temas.map(t => `<span>${esc(CORTO[t.id] || t.texto)} <b>${esc(t.cifra)}</b></span>`).join('<i aria-hidden="true">·</i>')}</span></span>` +
      `<span class="fila-chev">${VETA.ic('chev', 16)}</span></button>`;
    return `<button type="button" class="d-oficina" data-hoja="h34" data-i="1" data-g="${esc(g)}">` +
      `<span class="d-oficina-cab"><span class="d-oficina-t">Cómo va la oficina hoy</span><span class="fila-chev">${VETA.ic('chev', 16)}</span></span>` +
      `<span class="d-oficina-s">${sub}</span>` +
      `<span class="d-temas d-temas-ord">${temas.map(t => `<span class="d-tema"><b>${esc(t.cifra)}</b><span>${esc(t.texto)}</span></span>`).join('')}</span></button>`;
  }

  const R6 = () => VETA.datos.r6.direccion;
  // una sola lista, sin rótulos que clasifiquen a nadie. De cada persona se dice lo que pasa; en rojo, solo «sin contestar».
  function equipo(i) {
    const e = X.equipoOps(), yo = VETA.yo().id;
    const fila = x => {
      const partes = x.partes.map(p => p.rojo ? `<span class="d-rojo-t">${esc(p.texto)}</span>` : esc(p.texto));
      const sub = x.baja ? `De baja · ${x.pendientes} conversaciones sin atender` : x.resumen;
      return {titulo: x.p.nombre + (x.id === yo ? ' (tú)' : ''), av: x.id, ir: 'persona/' + x.id, sub,
        subHtml: x.baja ? null : esc(x.cuantas) + ' · ' + (partes.length ? partes.join(' · ') : 'todo al día')};
    };
    return UI.lista(e.todos.map(fila), {i, clase: 'd-personas'});
  }

  function deLaOficina(i) {
    const avisosOff = X.lee('avisosOff', {}), creados = X.lee('avisos', []);
    const puestos = (VETA.datos.avisos.puestos.filter(a => !avisosOff[a.id]).length) + creados.filter(a => !avisosOff[a.id]).length;
    const sin = X.sinResponder().length;
    return UI.lista([
      {titulo: 'Semana', sub: '156 mensajes y tareas listos', icono: 'cal', ir: 'semana-equipo'},
      {titulo: 'Lo que entra', sub: sin === 1 ? '1 contacto sin responder' : sin + ' contactos sin responder', icono: 'entra', ir: 'entra'},
      {titulo: 'Avisos', sub: (puestos === 1 ? 'tienes 1' : 'tienes ' + puestos) + ' · 1 te avisó el sábado', icono: 'campana', ir: 'avisos'},
      {titulo: 'Qué hace Veta por tu oficina', icono: 'aprende', ir: 'oficina-que-hace'},
      {titulo: 'Antes y ahora de la oficina', icono: 'grafica', ir: 'oficina-antes-ahora'},
      {titulo: 'Lo que ves tú y lo que ve cada uno', icono: 'candado', ir: 'confianza'},
      {titulo: 'Conexiones y ajustes', icono: 'wifi', ir: 'conexiones'}]);
  }
  function decididas(lista) {
    if (!lista.length) return '';
    const n = lista.length;
    return `<div class="d-decididas"><button type="button" class="fila d-decididas-b" data-accion="decididas" aria-expanded="${abiertas}">` +
      `<span class="fila-ic">${VETA.ic('check', 22)}</span><span class="fila-c"><span class="fila-t">${n} ${n === 1 ? 'decidida' : 'decididas'} hoy</span></span>` +
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
    const deEquipo = [baja.length ? primer(baja[0]) + ' está de baja' : null,
      rojo.length ? (rojo.length === 1 ? primer(rojo[0]) + ' tiene algo sin contestar' : rojo.length + ' tienen algo sin contestar') : null].filter(Boolean).join(' · ');
    return UI.puertas([
      pend.length ? {principal: true, icono: 'estrella', titulo: 'Decidir', sub: f0.titulo + (pend.length > 1 ? ', y ' + (pend.length - 1) + ' más.' : '.'), n: pend.length, ir: 'equipo/decidir',
        g: 'Decidir|Lo que espera tu decisión, una cosa cada vez.'}
        : {principal: true, icono: 'check', titulo: 'Nada por decidir', sub: 'Cuando algo necesite tu decisión, saldrá aquí.', ir: 'equipo/decidir'},
      {icono: 'casa', titulo: 'Ver las operaciones', sub: ojo ? `${ojo} hay que mirar${ojo === 1 ? 'la' : 'las'} hoy.` : 'Hoy no hay que mirar ninguna.', n: ops.length, ir: 'operaciones', clase: 'd-ir-ops'},
      {caras: e.todos.map(x => x.id), titulo: 'Ver al equipo', sub: (deEquipo || 'Todo al día') + '.', n: e.todos.length, ir: 'equipo/personas'},
      {icono: 'grafica', titulo: 'Ver la semana', sub: `Cosas que Veta dejó listas. Hace un mes, ${s.listos[0]}.`, n: s.listos[n - 1], ir: 'semana-equipo'},
      {icono: 'mic', titulo: 'Enseñar algo a Veta', sub: `El equipo aún hace a mano ${aMano} cosas.`, ir: 'oficina/falta'},
      {icono: 'puntos', titulo: 'Más de la oficina', sub: 'Lo que entra, los avisos y los ajustes.', ir: 'equipo/oficina'}
    ], {i: 1, panel: 'equipo/decidir'});
  }

  VETA.pantalla('G1', {
    titulo: 'Equipo',
    guia: ['Aquí ves, en pocas puertas, lo que puedes hacer con tu oficina.', 'Tú tocas una: decidir, ver las operaciones, ver al equipo, ver la semana o enseñar algo a Veta.', 'Así sabes qué pasa en la oficina sin leer nada de más y sin tener que preguntar.'],
    pinta: () => puertas()
  });

  // ---- G1d · Tienes que decidir: la cola de dirección, una tarjeta abierta y las demás en filas ----
  VETA.pantalla('G1d', {
    guia: ['Aquí Veta te trae lo que necesita una decisión tuya, de una en una.', 'Tú decides con un toque o abres el asunto para verlo entero.', 'Así nada del equipo se queda sin dueño y la lista se vacía.'],
    pinta: () => {
      const ds = M.decisiones(), pend = ds.filter(X.pendiente), ult = M.ultima('equipo');
      // «N decididas hoy» cuenta todas, también la última: Por decidir + decididas = las de hoy
      const resueltas = ds.filter(c => X.resuelta(c)).sort((a, b) => a.orden - b.orden);
      let cola;
      if (!pend.length) cola = `<div data-i="1">${ult ? UI.lineaCosa(ult) : ''}${UI.vacio({titulo: 'Nada por decidir en el equipo.', texto: 'Cuando entre algo que necesite tu decisión, aparecerá aquí.', icono: 'check'})}</div>`;
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
    guia: ['Aquí está tu equipo, persona a persona.', 'Tú tocas a una para ver lo que lleva y lo que Veta hace por ella.', 'Así ves cómo va cada uno sin leer sus chats.'],
    pinta: () => equipo(1)
  });

  // ---- G1m · Más de la oficina: lo que casi nunca hace falta, todo junto ----
  VETA.pantalla('G1m', {
    guia: ['Aquí está el resto de la oficina: lo que entra, los avisos, las conexiones y los ajustes.', 'Tú abres lo que necesites.', 'Así la pantalla de Equipo se queda en lo que haces cada día.'],
    pinta: () => UI.lista([{titulo: VETA.datos.fecha.hoyTexto, sub: 'Leído hasta las ' + VETA.ahora(-3), icono: 'reloj', hoja: 'h04', datos: {quien: 'equipo'}, clase: 'd-leido',
      g: 'Lo que he leído|Los canales de la oficina y hasta qué hora los he leído.'}], {i: 1}) + oficina(VETA.ordenador()) + `<div data-i="2">${deLaOficina()}</div>`
  });
})();
