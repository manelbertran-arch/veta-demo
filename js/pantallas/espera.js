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
      x.boton = {texto: 'Ver la ficha de ' + nombre(c.cliente), ir: 'cliente/' + c.cliente};
      x.secundarios = M.cosa(c.id) ? [{texto: 'Se cumplió', accion: 'se-cumplio'}, {texto: 'Otra cosa…', hoja: 'h02'}] : [{texto: 'Se cumplió', accion: 'se-cumplio'}];
    }
    if (c.local) {
      x.boton = {texto: 'Ver la ficha de ' + nombre(c.cliente), ir: 'cliente/' + c.cliente};
      x.secundarios = [{texto: 'Ya está hecha', accion: 'local-hecha'}];
    }
    return x;
  }
  function fila(c) {
    const venc = c.fechaISO < hoyISO();
    return UI.fila({tituloHtml: `<span class="a-fecha${venc ? ' a-vencida' : ''}">${esc(c.fecha)}</span> · ${esc(c.titulo)}`, titulo: c.titulo,
      sub: c.texto, av: c.cliente, etiqueta: c.etiqueta || null, ir: 'cliente/' + c.cliente, vt: 'cola-' + c.id, focoFoto: true});
  }

  VETA.pantalla('A7', {
    guia: ['Aquí está lo que depende de otros o tiene fecha, por orden.', 'Tú preparas el recordatorio cuando toca, o lo das por cumplido.', 'Así nada de lo que te prometen se queda olvidado.'],
    pinta: () => {
      const q = VETA.A.q(), pend = VETA.A.esperaPend(q);
      let h = '';
      const u = M.ultima(q);
      if (u && u.tipo === 'espera' && u.orden === VETA.A.seq()) {
        h += `<div class="a-sitio" data-i="1">${UI.lineaCosa(u)}` +
          (u.id === 'e-elena' && u.borrador ? UI.borrador({texto: u.borrador}) + UI.nota({texto: 'No sale hasta que tú lo envíes', icono: 'candado'}) : '') + '</div>';
      }
      if (!pend.length) return h + UI.vacio({titulo: 'Ahora no vigilo nada', texto: 'Lo que te prometan, lo apunto yo.', icono: 'reloj', i: 1});
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
        M.marca(id, 'hecha', {linea: 'Se cumplió · ' + c.titulo}); VETA.repinta({hecho: id});
        if (!M.cosa(id)) VETA.aviso('Se cumplió · ' + c.titulo, {deshacer: () => { M.deshaz(id); VETA.repinta(); }});
      },
      'local-hecha'(ev, el) {
        const id = el.dataset.de, t = VETA.A.local(id); if (!t) return;
        const l = VETA.A.locales().map(x => x.id === id ? Object.assign({}, x, {cumplida: true}) : x);
        VETA.est.pon('a.locales', l); VETA.repinta({hecho: id});
        VETA.aviso('Hecha · ' + t.titulo, {deshacer: () => { VETA.est.pon('a.locales', VETA.A.locales().map(x => x.id === id ? Object.assign({}, x, {cumplida: false}) : x)); VETA.repinta(); }});
      }
    }
  });
})();
