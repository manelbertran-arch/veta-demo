/* Veta demo · pantallas · espera.js · paquete A (El día)
   A7 · Lo que vigilo por ti · #/espera (ronda 7: se llega desde la caja Veta). Una sola lista por fecha; cada fila se abre ahí mismo
   con lo que puedes hacer: preparar el recordatorio, “Se cumplió” o ver su ficha. */
(function () {
  'use strict';
  const UI = VETA.UI, M = VETA.modelo, esc = VETA.esc;
  const hoyISO = () => (VETA.datos.fecha || {}).hoyISO || '2026-11-23';

  // ronda 7 · una fila por cosa (fecha y persona; qué esperas). Se abre ahí mismo con lo que puedes hacer: el botón de la cosa,
  // “Se cumplió” y su ficha. Lo vencido lleva la pastilla roja.
  const mini = (texto, o) => `<button type="button" class="a1-mini"${UI.attrs(o)}>${esc(texto)}</button>`;
  function fila(c) {
    const venc = c.fechaISO < hoyISO(), b = c.boton || null, ops = [];
    if (b) ops.push(mini(b.texto, Object.assign({de: c.id}, b.ir || b.hoja || b.accion ? b : {accion: 'principal'})));
    ops.push(mini(c.local ? 'Already done' : 'It was kept', {accion: c.local ? 'local-hecha' : 'se-cumplio', de: c.id}));
    if (c.cliente && !(b && b.ir === 'cliente/' + c.cliente)) ops.push(mini('See their profile', {ir: 'cliente/' + c.cliente}));
    return {cara: c.cliente || null, icono: 'reloj', nombre: c.fecha + ' · ' + c.titulo, pasa: c.texto, pastilla: venc ? 'The date has passed' : null, tono: 'rojo',
      abre: `<p class="a1-minis">${ops.join('')}</p>`};
  }
  const cuenta = () => VETA.A.esperaPend(VETA.A.q()).length;

  VETA.pantalla('A7', {
    titulo: 'What I\'m watching for you',
    frase: () => { const n = cuenta(); return n ? `I am watching ${n === 1 ? '1 thing' : n + ' things'} that were promised to you or have a date. I will tell you in time.` : 'I am not watching anything now. What people promise you, I note down myself.'; },
    guia: ['Here\'s what depends on others or has a date, in order.', 'You prepare the reminder when it\'s time, or mark it as kept.', 'That way nothing you\'re promised gets forgotten.'],
    pinta: () => {
      const q = VETA.A.q(), pend = VETA.A.esperaPend(q);
      let h = '';
      // lo que acabas de hacer aquí, con su “Deshacer” (y el recordatorio que te dejé escrito para Elena)
      const u = M.ultima(q);
      if (u && u.tipo === 'espera' && u.orden === VETA.A.seq()) {
        const txt = (u.extra || {}).linea || (u.lineas || {})[u.estado] || ('Done · ' + u.titulo);
        h += `<div class="r7-ficha${u.id === 'e-elena' && u.borrador ? ' r7-oro' : ''} a1-hecho" data-i="0">` +
          (u.id === 'e-elena' && u.borrador ? `<span class="r7-ficha-de">I write the reminder for you</span><p>${esc(u.borrador)}</p><p class="a1-nota">It does not go out until you send it.</p>` : `<p class="a1-hecho-t">${esc(txt)}</p>`) +
          `<p class="a1-minis">${mini('Undo', {accion: 'deshacer', de: u.id})}</p></div>`;
      }
      if (!pend.length) return h;
      return h + VETA.r7.lista(pend.map(fila), {i: 1});
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
