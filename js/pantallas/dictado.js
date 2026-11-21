/* Veta demo · pantallas · dictado.js · paquete A (El día)
   A4b · Lo que he entendido: tarea o nota · #/entendido-dictado/<tarea|nota>.
   «Guardar la tarea» / «Guardar la nota» vuelve a la anterior con «Guardada · … · Deshacer» en el sitio. */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, ic = VETA.ic;
  const def = p => ((VETA.datos.diaA || {}).entendido || {})[p.id] || ((VETA.datos.diaA || {}).entendido || {}).tarea;
  const idLocal = e => 'a-' + e.tipo + '-' + e.cliente;
  const diaElegido = e => { const d = VETA.est.lee('a.dia.' + e.cliente, 'jue'); return (e.dias || []).find(x => x.id === d) || (e.dias || [])[0]; };
  const dijiste = g => { const u = VETA.est.lee('a.ultimoDictado', null); return VETA.A.mmss(u && u.guion === g ? u.seg : ((VETA.datos.diaA || {}).duracion || {})[g] || 0); };

  VETA.pantalla('A4b', {
    titulo: p => (def(p) || {}).tipo === 'nota' ? 'Una nota' : 'Una tarea',
    guia: ['Aquí ves cómo he entendido lo que has dicho.', 'Tú lo guardas, cambias el día o me dices que no era eso.', 'Así nada de lo que dictas se queda sin sitio.'],
    pinta: p => {
      const e = def(p), guardada = VETA.A.local(idLocal(e));
      let h = `<div class="a-ent" data-i="0"><p class="a-ent-t"><b>${esc(e.entendido)}</b></p>` +
        (guardada ? '' : UI.boton({tipo: 'texto', texto: 'No es eso', hoja: 'h09', datos: {guion: e.tipo}, ancho: false})) + '</div>';
      if (e.tipo === 'tarea') {
        const d = diaElegido(e);
        h += `<div class="borrador a-cosa" data-i="1"><span class="borrador-r">Borrador de Veta</span><p class="a-cosa-t">${esc(e.que)}</p>` +
          `<p class="a-cosa-d">${ic('cal', 20)}<span>${esc(d.texto.replace(/^./, m => m.toLowerCase()))}</span></p></div>`;
      } else {
        h += `<div class="borrador a-cosa" data-i="1"><span class="borrador-r">Borrador de Veta</span><p class="a-cosa-t a-cosa-nota">${esc(e.texto)}</p></div>`;
      }
      h += `<p class="a-pie" data-i="2">${esc(e.pie)}</p>`;
      h += UI.lista([{titulo: 'Lo que dijiste · ' + dijiste(e.tipo), icono: 'mic', hoja: 'h07', datos: {guion: e.tipo}}], {i: 3});
      if (e.tipo === 'tarea' && !guardada) h += `<div data-i="3">${UI.botones([{texto: 'Cambiar el día', hoja: 'a-dia', datos: {cliente: e.cliente}, icono: 'cal'}])}</div>`;
      return h;
    },
    botonFijo: p => {
      const e = def(p), g = VETA.A.local(idLocal(e));
      if (g) return UI.lineaHecho({texto: g.linea, hora: g.hora, boton: {texto: 'Deshacer', accion: 'deshacer-a4b'}});
      return UI.boton({texto: e.boton, accion: 'guardar'});
    },
    acciones: {
      guardar(ev, el, p) {
        const e = def(p), id = idLocal(e);
        const t = {id, tipo: e.tipo, hecha: true, linea: e.linea, cliente: e.cliente};
        if (e.tipo === 'tarea') { const d = diaElegido(e); Object.assign(t, {fecha: d.fecha, fechaISO: d.fechaISO, titulo: 'Llamar a Jordi', texto: 'Tarea tuya · ' + d.texto.split(', ')[1]}); }
        VETA.A.ponLocal(t);
        const pila = VETA.pila(), ant = pila.length > 1 ? pila[pila.length - 2].ruta : null;
        VETA.atras();
        if (ant && ant !== 'hoy') VETA.aviso(e.linea + '.', {deshacer: () => { VETA.A.quitaLocal(id); VETA.repinta(); }});
      },
      'deshacer-a4b'(ev, el, p) { VETA.A.quitaLocal(idLocal(def(p))); VETA.repinta(); }
    }
  });

  // hoja para cambiar el día de la tarea
  VETA.hojaElegir('a-dia', {
    titulo: 'Cambiar el día',
    texto: 'La llamada a Jordi, a las 10:00.',
    opciones: d => (((VETA.datos.diaA || {}).entendido || {}).tarea.dias || []).map(x => ({id: x.id, texto: x.texto})),
    valor: d => VETA.est.lee('a.dia.' + (d.cliente || 'jordi'), 'jue'),
    alElegir: (op, d) => { VETA.est.pon('a.dia.' + (d.cliente || 'jordi'), op.id); VETA.repinta(); }
  });
})();
