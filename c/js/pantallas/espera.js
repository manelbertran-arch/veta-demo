/* Veta demo · pantallas · espera.js · paquete A (El día)
   A7 · Lo que vigilo por ti · #/espera (ronda 7: se llega desde la caja Veta). Una sola lista por fecha; cada fila se abre ahí mismo
   con lo que puedes hacer: preparar el recordatorio, «Se cumplió» o ver su ficha. */
(function () {
  'use strict';
  const UI = VETA.UI, M = VETA.modelo, esc = VETA.esc;
  const hoyISO = () => (VETA.datos.fecha || {}).hoyISO || '2026-11-23';

  // ronda 7 · una fila por cosa (fecha y persona; qué esperas). Se abre ahí mismo con lo que puedes hacer: el botón de la cosa,
  // «Se cumplió» y su ficha. Lo vencido lleva la pastilla roja.
  const mini = (texto, o) => `<button type="button" class="a1-mini"${UI.attrs(o)}>${esc(texto)}</button>`;
  function fila(c) {
    const venc = c.fechaISO < hoyISO(), b = c.boton || null, ops = [];
    if (b) ops.push(mini(b.texto, Object.assign({de: c.id}, b.ir || b.hoja || b.accion ? b : {accion: 'principal'})));
    ops.push(mini(c.local ? 'Ya está hecha' : 'Se cumplió', {accion: c.local ? 'local-hecha' : 'se-cumplio', de: c.id}));
    if (c.cliente && !(b && b.ir === 'cliente/' + c.cliente)) ops.push(mini('Ver su ficha', {ir: 'cliente/' + c.cliente}));
    return {cara: c.cliente || null, icono: 'reloj', nombre: c.fecha + ' · ' + c.titulo, pasa: c.texto, pastilla: venc ? 'Ya pasó la fecha' : null, tono: 'rojo',
      abre: `<p class="a1-minis">${ops.join('')}</p>`};
  }
  const cuenta = () => VETA.A.esperaPend(VETA.A.q()).length;

  VETA.pantalla('A7', {
    titulo: 'Lo que vigilo por ti',
    frase: () => { const n = cuenta(); return n ? `Vigilo ${n === 1 ? '1 cosa' : n + ' cosas'} que te prometieron o tienen fecha. Te aviso a tiempo.` : 'Ahora no vigilo nada. Lo que te prometan, lo apunto yo.'; },
    guia: ['Aquí está lo que depende de otros o tiene fecha, por orden.', 'Tú preparas el recordatorio cuando toca, o lo das por cumplido.', 'Así nada de lo que te prometen se queda olvidado.'],
    pinta: () => {
      const q = VETA.A.q(), pend = VETA.A.esperaPend(q);
      let h = '';
      // lo que acabas de hacer aquí, con su «Deshacer» (y el recordatorio que te dejé escrito para Elena)
      const u = M.ultima(q);
      if (u && u.tipo === 'espera' && u.orden === VETA.A.seq()) {
        const txt = (u.extra || {}).linea || (u.lineas || {})[u.estado] || ('Hecho · ' + u.titulo);
        h += `<div class="r7-ficha${u.id === 'e-elena' && u.borrador ? ' r7-oro' : ''} a1-hecho" data-i="0">` +
          (u.id === 'e-elena' && u.borrador ? `<span class="r7-ficha-de">Te dejo escrito el recordatorio</span><p>${esc(u.borrador)}</p><p class="a1-nota">No sale hasta que tú lo envíes.</p>` : `<p class="a1-hecho-t">${esc(txt)}</p>`) +
          `<p class="a1-minis">${mini('Deshacer', {accion: 'deshacer', de: u.id})}</p></div>`;
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
