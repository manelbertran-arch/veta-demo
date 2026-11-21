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
    'd-carmen': {titulo: 'Carmen López', sub: 'Contacto sin dueño · ayer, 19:10'},
    'd-regla': {titulo: 'Una regla para toda la oficina', get sub() { return 'Dossier al día siguiente · ' + (X.laPropuso() ? 'la propone Laura' : 'la propone Veta'); }},
    'd-teresa': {titulo: 'Teresa está de baja', sub: '34 conversaciones sin atender'},
    'd-joan': {titulo: 'Queja de Joan Serra, propietario', sub: 'Lo lleva Marc · sábado 21, 20:05'}
  };
  const filaDe = (c, n) => {
    const f = FILA[c.id] || {titulo: c.fila || c.titulo, sub: c.filaSub};
    return {titulo: f.titulo, sub: f.sub, av: c.av || c.cliente || null, icono: c.av || c.cliente ? null : (c.icono || 'estrella'),
      ir: X.rutaDe(c), vt: 'cola-' + c.id, derecha: n ? n : null, focoFoto: !!(c.av || c.cliente)};
  };
  // la tarjeta abierta: «Por decidir» va en la etiqueta y no se repite en la línea de quién es (así el botón se ve sin desplazar)
  const QUIEN = {'d-carmen': 'Contacto sin dueño', 'd-regla': 'Regla para la oficina', 'd-teresa': 'Cartera sin atender', 'd-joan': 'Queja de un propietario'};
  const tarjeta = (c, n, total) => UI.tarjetaCosa(Object.assign({}, c, {quienEs: QUIEN[c.id] || c.quienEs}), {n, total});

  // «Cómo va la oficina hoy»: en ordenador, tarjeta con los tres temas en cifras; en móvil, una fila de tres líneas
  const CORTO = {esperando: 'Esperando', promesas: 'Promesas', quieren: 'Quieren vender o comprar', contactos: 'Contactos nuevos', respuesta: 'Respuesta', visitas: 'Visitas'};
  function oficina(ord) {
    const temas = X.temas(), g = 'Cómo va la oficina hoy|Elige los tres temas que quieres ver arriba y en la reunión.';
    // «parada» tiene una sola definición en toda la app: más de 7 días sin moverse (las mismas que cuenta Semana)
    const np = X.paradas().length;
    const sub = `25 asuntos abiertos · 8 esperando fuera · ${np} ${np === 1 ? 'operación parada' : 'operaciones paradas'} más de 7 días`;
    if (!ord) return `<button type="button" class="fila d-oficina-m" data-hoja="h34" data-i="1" data-g="${esc(g)}"><span class="fila-ic">${VETA.ic('grafica', 22)}</span>` +
      `<span class="fila-c"><span class="fila-t">Cómo va la oficina hoy</span><span class="fila-s">${sub}</span>` +
      `<span class="d-temas-l">${temas.map(t => `<span>${esc(CORTO[t.id] || t.texto)} <b>${esc(t.cifra)}</b></span>`).join('<i aria-hidden="true">·</i>')}</span></span>` +
      `<span class="fila-chev">${VETA.ic('chev', 16)}</span></button>`;
    return `<button type="button" class="d-oficina" data-hoja="h34" data-i="1" data-g="${esc(g)}">` +
      `<span class="d-oficina-cab"><span class="d-oficina-t">Cómo va la oficina hoy</span><span class="fila-chev">${VETA.ic('chev', 16)}</span></span>` +
      `<span class="d-oficina-s">${sub}</span>` +
      `<span class="d-temas d-temas-ord">${temas.map(t => `<span class="d-tema"><b>${esc(t.cifra)}</b><span>${esc(t.texto)}</span></span>`).join('')}</span></button>`;
  }

  function deLaOficina(i) {
    const avisosOff = X.lee('avisosOff', {}), creados = X.lee('avisos', []);
    const puestos = (VETA.datos.avisos.puestos.filter(a => !avisosOff[a.id]).length) + creados.filter(a => !avisosOff[a.id]).length;
    const sin = X.sinResponder().length;
    return UI.bloque({titulo: 'De la oficina', i, html: UI.lista([
      {titulo: 'Semana', sub: '156 mensajes y tareas listos', icono: 'cal', ir: 'semana-equipo'},
      {titulo: 'Lo que entra', sub: sin === 1 ? '1 contacto sin responder' : sin + ' contactos sin responder', icono: 'entra', ir: 'entra'},
      {titulo: 'Avisos', sub: puestos + (puestos === 1 ? ' puesto' : ' puestos') + ' · 1 saltó el sábado', icono: 'campana', ir: 'avisos'},
      {titulo: 'Conexiones y ajustes', icono: 'wifi', ir: 'conexiones'}])});
  }

  function decididas(lista) {
    if (!lista.length) return '';
    const n = lista.length;
    return `<div class="d-decididas" data-i="3"><button type="button" class="fila d-decididas-b" data-accion="decididas" aria-expanded="${abiertas}">` +
      `<span class="fila-ic">${VETA.ic('check', 22)}</span><span class="fila-c"><span class="fila-t">${n} ${n === 1 ? 'decidida' : 'decididas'} hoy</span></span>` +
      `<span class="fila-chev chev-gira">${VETA.ic('abajo', 16)}</span></button>` +
      `<div class="d-decididas-l"${abiertas ? '' : ' hidden'}>${lista.map(c => UI.lineaCosa(c)).join('')}</div></div>`;
  }

  VETA.pantalla('G1', {
    titulo: 'Equipo',
    guia: ['Aquí Veta te trae lo que necesita una decisión tuya, una cosa cada vez.', 'Tú decides con un toque o abres el asunto para verlo entero.', 'Así nada del equipo se queda sin dueño, y la lista se vacía.'],
    pinta: () => {
      const ord = VETA.ordenador();
      const ds = M.decisiones();
      const pend = ds.filter(X.pendiente);
      const ult = M.ultima('equipo');
      // «N decididas hoy» cuenta todas, también la última: Por decidir + decididas = las 4 de hoy
      const resueltas = ds.filter(c => X.resuelta(c)).sort((a, b) => a.orden - b.orden);
      const leido = UI.fila({titulo: VETA.datos.fecha.hoyTexto, sub: 'Leído hasta las ' + VETA.ahora(-3), icono: 'vigilando', hoja: 'h04', datos: {quien: 'equipo'}, clase: 'd-leido', i: 0,
        g: 'Lo que he leído|Los canales de la oficina y hasta qué hora los he leído.'});
      let cola;
      if (!pend.length) {
        cola = `<div data-i="2">${ult ? UI.lineaCosa(ult) : ''}${UI.vacio({titulo: 'Nada por decidir en el equipo.', texto: 'Cuando entre algo que necesite tu decisión, aparecerá aquí.', icono: 'check'})}</div>`;
      } else if (ord) {
        // ordenador: todas las decisiones en filas; la primera se abre sola en el panel
        cola = UI.bloque({titulo: 'Por decidir · ' + pend.length, i: 2, html: (ult ? UI.lineaCosa(ult) : '') +
          UI.lista(pend.map((c, k) => filaDe(c, (k + 1) + ' de ' + pend.length)), {clase: 'd-cola'})});
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
