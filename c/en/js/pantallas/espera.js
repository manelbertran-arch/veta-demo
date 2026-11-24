/* Veta demo · ronda 8 · pantallas · espera.js · carril A (El día)
   A7 · Lo que vigilo por ti · #/espera (Inicio › “Hoy he hecho yo” › “Vigilo 6 cosas”). Una sola lista por fecha: cada fila, con su cara,
   abre una hoja de acciones (r8-vigilo, en js/hojas/dia.js): recordárselo, “Se cumplió”, ver su ficha y de dónde sale. */
(function () {
  'use strict';
  const UI = VETA.UI, M = VETA.modelo, r7 = VETA.r7;
  const hoyISO = () => (VETA.datos.fecha || {}).hoyISO || '2026-11-23';
  // a la derecha, la fecha en gris; lo vencido lleva en su sitio la pastilla roja (la excepción) y la fecha pasa a la segunda línea
  const fila = c => { const venc = c.fechaISO < hoyISO(); return {cara: c.cliente || null, nombre: c.titulo, pasa: venc ? c.fecha + ' · ' + c.texto : c.texto, pastilla: venc ? 'Past due' : null, dato: c.fecha, hoja: 'r8-vigilo', de: c.id}; };
  const cuenta = () => VETA.A.esperaPend(VETA.A.q()).length;

  // lo que se puede hacer con una cosa vigilada (lo llama la hoja r8-vigilo)
  VETA.A.vigilo = {
    cosa: id => VETA.A.espera(VETA.A.q()).find(x => x.id === id) || null,
    principal(id) { if (!M.cosa(id)) return; M.marca(id, 'hecha'); VETA.repinta({hecho: id}); },
    cumplio(id) {
      const c = VETA.A.vigilo.cosa(id); if (!c) return;
      if (c.local) {
        const pon = v => VETA.est.pon('a.locales', VETA.A.locales().map(x => x.id === id ? Object.assign({}, x, {cumplida: v}) : x));
        pon(true); VETA.repinta({hecho: id});
        VETA.aviso('Done · ' + c.titulo, {deshacer: () => { pon(false); VETA.repinta(); }});
        return;
      }
      M.marca(id, 'hecha', {linea: 'It was kept · ' + c.titulo}); VETA.repinta({hecho: id});
      if (!M.cosa(id)) VETA.aviso('It was kept · ' + c.titulo, {deshacer: () => { M.deshaz(id); VETA.repinta(); }});
    }
  };

  VETA.pantalla('A7', {
    titulo: 'What I\'m watching for you',
    sub: () => (cuenta() ? 'What you\'re promised or has a date. I alert you in time.' : 'I am not watching anything now. What people promise you, I note down myself.'),
    pinta: () => {
      const q = VETA.A.q(), pend = VETA.A.esperaPend(q);
      let h = '';
      // lo que acabas de hacer aquí, con su “Deshacer” (y el recordatorio que te dejé escrito para Elena)
      const u = M.ultima(q);
      if (u && u.tipo === 'espera' && u.orden === VETA.A.seq()) {
        if (u.id === 'e-elena' && u.borrador) h += r7.tarjeta({i: 0, veta: true, de: 'I write the reminder for you', texto: u.borrador});
        h += UI.lineaHecho({i: 0, texto: (u.extra || {}).linea || (u.lineas || {})[u.estado] || ('Done · ' + u.titulo), boton: {texto: 'Undo', accion: 'deshacer', de: u.id}});
      }
      return h + (pend.length ? r7.lista(pend.map(fila), {i: 1}) : '');
    }
  });
})();
