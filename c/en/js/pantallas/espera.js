/* Veta demo · ronda 8 · pantallas · espera.js · carril A (El día)
   A7 · Lo que vigilo por ti · #/espera (Inicio › “Veta ha hecho hoy” › “Lo que vigilo por ti”). Una sola lista por fecha: cada fila, con su cara,
   abre una hoja de acciones (r8-vigilo, en js/hojas/dia.js): recordárselo, “Se cumplió”, ver su ficha y de dónde sale.
   “Se cumplió”: la fila se va de la lista (VETA.mov.seVa) y lo dice el aviso, con su “Deshacer”. Las fechas, por VETA.fecha. */
(function () {
  'use strict';
  const UI = VETA.UI, M = VETA.modelo, r7 = VETA.r7;
  const hoyISO = () => (VETA.datos.fecha || {}).hoyISO || '2026-11-23';
  // a la derecha, la fecha en gris; lo vencido lleva en su sitio la pastilla roja (la excepción) y la fecha pasa a la segunda línea
  const fecha = c => VETA.fecha.corta(c.fechaISO);
  const fila = c => { const venc = c.fechaISO < hoyISO(); return {cara: c.cliente || null, nombre: c.titulo, pasa: venc ? fecha(c) + ' · ' + c.texto : c.texto, pastilla: venc ? 'Past due' : null, dato: fecha(c), hoja: 'r8-vigilo', de: c.id}; };
  const filaDe = id => { const col = VETA.$('.col.activa'); return col ? Array.prototype.find.call(col.querySelectorAll('.r7-fila[data-de]'), x => x.dataset.de === id) || null : null; };
  const cuenta = () => VETA.A.esperaPend(VETA.A.q()).length;

  // lo que se puede hacer con una cosa vigilada (lo llama la hoja r8-vigilo)
  VETA.A.vigilo = {
    cosa: id => VETA.A.espera(VETA.A.q()).find(x => x.id === id) || null,
    principal(id) { if (!M.cosa(id)) return; M.marca(id, 'hecha'); VETA.repinta({hecho: id}); },
    cumplio(id) {
      const c = VETA.A.vigilo.cosa(id); if (!c) return;
      // la fila se va de la lista y lo dice el aviso, que es la única confirmación (lo hecho ya no está en pantalla)
      if (c.local) {
        const pon = v => VETA.est.pon('a.locales', VETA.A.locales().map(x => x.id === id ? Object.assign({}, x, {cumplida: v}) : x));
        VETA.mov.seVa(filaDe(id), () => { pon(true); VETA.repinta(); });
        VETA.aviso('Done · ' + c.titulo, {deshacer: () => { pon(false); VETA.repinta(); }});
        return;
      }
      VETA.mov.seVa(filaDe(id), () => { M.marca(id, 'hecha', {linea: 'It was kept · ' + c.titulo, fuera: true}); VETA.repinta(); if (VETA.pintaBarra) VETA.pintaBarra(); });
      VETA.aviso('It was kept · ' + c.titulo, {deshacer: () => { M.deshaz(id); VETA.repinta(); if (VETA.pintaBarra) VETA.pintaBarra(); }});
    }
  };

  VETA.pantalla('A7', {
    titulo: 'What I\'m watching for you',
    sub: () => (cuenta() ? 'Promises and dates. I\'ll warn you in time.' : ''),
    pinta: () => {
      const q = VETA.A.q(), pend = VETA.A.esperaPend(q);
      let h = '';
      // lo que acabas de hacer aquí, con su “Deshacer” (y el recordatorio que te dejé escrito para Elena)
      const u = M.ultima(q);
      if (u && u.tipo === 'espera' && u.orden === VETA.A.seq() && !(u.extra || {}).fuera) {
        h += r7.hecho({texto: (u.extra || {}).linea || (u.lineas || {})[u.estado] || ('Done · ' + u.titulo), deshacer: {accion: 'deshacer', de: u.id}});
        if (u.id === 'e-elena' && u.borrador) h += r7.tarjeta({i: 0, veta: true, de: 'I write the reminder for you', texto: u.borrador});
      }
      return h + (pend.length ? r7.lista(pend.map(fila), {i: 1}) : r7.vacio('I\'m not watching anything now.'));
    }
  });
})();
