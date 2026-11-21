/* Veta demo · pantallas · espera.js · paquete A (El día)
   A7 · En espera · #/espera. Una sola lista por fecha: la primera va abierta como tarjeta con su botón; las demás,
   filas que abren la ficha. Al resolver la primera, la siguiente pasa a ser la tarjeta. */
(function () {
  'use strict';
  const UI = VETA.UI, M = VETA.modelo, esc = VETA.esc;
  const hoyISO = () => (VETA.datos.fecha || {}).hoyISO || '2026-11-23';
  const nombre = id => { const q = M.quien(id); return q ? (q.corto || String(q.nombre || '').split(' ')[0]) : ''; };

  // la cosa tal como se pinta abierta en En espera
  function abierta(c) {
    const x = Object.assign({}, c, {momento: c.fecha + ' · ' + c.texto});
    if (c.id === 'e-elena') delete x.borrador;            // el borrador se enseña al preparar el recordatorio
    if (!c.boton && !c.local) {
      x.boton = {texto: 'See the profile of ' + nombre(c.cliente), ir: 'cliente/' + c.cliente};
      x.secundarios = M.cosa(c.id) ? [{texto: 'It was kept', accion: 'se-cumplio'}, {texto: 'Something else…', hoja: 'h02'}] : [{texto: 'It was kept', accion: 'se-cumplio'}];
    }
    if (c.local) {
      x.boton = {texto: 'See the profile of ' + nombre(c.cliente), ir: 'cliente/' + c.cliente};
      x.secundarios = [{texto: 'Already done', accion: 'local-hecha'}];
    }
    return x;
  }
  function fila(c) {
    const venc = c.fechaISO < hoyISO();
    return UI.fila({tituloHtml: `<span class="a-fecha${venc ? ' a-vencida' : ''}">${esc(c.fecha)}</span> · ${esc(c.titulo)}`, titulo: c.titulo,
      sub: c.texto, av: c.cliente, etiqueta: c.etiqueta || null, ir: 'cliente/' + c.cliente, vt: 'cola-' + c.id, focoFoto: true});
  }

  VETA.pantalla('A7', {
    guia: ['Here\'s what depends on others or has a date, in order.', 'You prepare the reminder when it\'s time, or mark it as kept.', 'That way nothing you\'re promised gets forgotten.'],
    pinta: () => {
      const q = VETA.A.q(), pend = VETA.A.esperaPend(q);
      let h = `<p class="a-cuantas" data-i="0">${pend.length === 1 ? '1 thing, by date' : pend.length + ' things, by date'}</p>`;
      const u = M.ultima(q);
      if (u && u.tipo === 'espera' && u.orden === VETA.A.seq()) {
        h += `<div class="a-sitio" data-i="1">${UI.lineaCosa(u)}` +
          (u.id === 'e-elena' && u.borrador ? UI.borrador({texto: u.borrador}) + UI.nota({texto: 'It doesn\'t go out until you send it', icono: 'candado'}) : '') + '</div>';
      }
      if (!pend.length) return h + UI.vacio({titulo: 'Nothing waiting', texto: 'Nothing waiting. Whatever they promise, I\'ll note it down.', icono: 'reloj', i: 1});
      h += `<div class="a-abierta" data-i="1">${UI.tarjetaCosa(abierta(pend[0]))}</div>`;
      if (pend.length > 1) h += `<div data-i="2">${UI.lista(pend.slice(1).map(fila))}</div>`;
      h += `<p class="pie" data-i="3">${esc((VETA.datos.diaA || {}).esperaPie || '')}</p>`;
      return h;
    },
    acciones: {
      principal(ev, el) {
        const id = el.dataset.de, c = M.cosa(id); if (!c) return;
        M.marca(id, 'hecha'); VETA.repinta({hecho: id});
      },
      'se-cumplio'(ev, el) {
        const id = el.dataset.de, c = VETA.A.espera(VETA.A.q()).find(x => x.id === id); if (!c) return;
        M.marca(id, 'hecha', {linea: 'It was kept · ' + c.titulo}); VETA.repinta({hecho: id});
        if (!M.cosa(id)) VETA.aviso('It was kept · ' + c.titulo, {deshacer: () => { M.deshaz(id); VETA.repinta(); }});
      },
      'local-hecha'(ev, el) {
        const id = el.dataset.de, t = VETA.A.local(id); if (!t) return;
        const l = VETA.A.locales().map(x => x.id === id ? Object.assign({}, x, {cumplida: true}) : x);
        VETA.est.pon('a.locales', l); VETA.repinta({hecho: id});
        VETA.aviso('Done · ' + t.titulo, {deshacer: () => { VETA.est.pon('a.locales', VETA.A.locales().map(x => x.id === id ? Object.assign({}, x, {cumplida: false}) : x)); VETA.repinta(); }});
      }
    }
  });
})();
