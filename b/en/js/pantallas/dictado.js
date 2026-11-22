/* Veta demo · pantallas · dictado.js · paquete A (El día)
   A4b · Lo que he entendido: tarea o nota · #/entendido-dictado/<tarea|nota>.
   “Guardar la tarea” / “Guardar la nota” vuelve a la anterior con “Guardada · … · Deshacer” en el sitio.
   Ronda 7 (agente E): cabecera con frase, bloque de oro y botones abajo con VETA.r7.botones. */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, ic = VETA.ic;
  const def = p => ((VETA.datos.diaA || {}).entendido || {})[p.id] || ((VETA.datos.diaA || {}).entendido || {}).tarea;
  const idLocal = e => 'a-' + e.tipo + '-' + e.cliente;
  const diaElegido = e => { const d = VETA.est.lee('a.dia.' + e.cliente, 'jue'); return (e.dias || []).find(x => x.id === d) || (e.dias || [])[0]; };
  const dijiste = g => { const u = VETA.est.lee('a.ultimoDictado', null); return VETA.A.mmss(u && u.guion === g ? u.seg : ((VETA.datos.diaA || {}).duracion || {})[g] || 0); };

  VETA.pantalla('A4b', {
    titulo: p => (def(p) || {}).tipo === 'nota' ? 'A note' : 'A task',
    // ronda 7 · una frase arriba, lo que he escrito en un bloque de oro y los botones abajo (R2, R4)
    frase: p => { const e = def(p); return VETA.A.local(idLocal(e)) ? 'It is already saved.' : e.tipo === 'tarea' ? 'This is what I understood. Save it or change the day.' : 'This is what I understood. I will save it in their profile.'; },
    pinta: p => {
      const e = def(p), u = VETA.est.lee('a.ultimoDictado', null);
      const dijo = u && u.guion === e.tipo ? u.texto : ((VETA.datos.dictados || {})[e.tipo] || {}).frase;
      const dia = e.tipo === 'tarea' ? `<span class="e-cosa-d">${ic('cal', 20)}<span>${esc(diaElegido(e).texto)}</span></span>` : '';
      return `<div class="r7-ficha r7-oro e-cosa" data-i="0"><span class="r7-ficha-de">I wrote this for you</span><p>${esc(e.tipo === 'tarea' ? e.que : e.texto)}</p>${dia}</div>` +
        VETA.r7.lista([{icono: 'mic', nombre: 'What you said · ' + dijiste(e.tipo), pasa: '“' + (dijo || '') + '”', hoja: 'h07', datos: {guion: e.tipo}}], {i: 1});
    },
    botonFijo: p => {
      const e = def(p), g = VETA.A.local(idLocal(e));
      if (g) return UI.lineaHecho({texto: g.linea, hora: g.hora, boton: {texto: 'Undo', accion: 'deshacer-a4b'}});
      return VETA.r7.botones({texto: e.boton, accion: 'guardar'},
        [e.tipo === 'tarea' ? {texto: 'Change the day', hoja: 'a-dia', datos: {cliente: e.cliente}} : null, {texto: 'That\'s not it', hoja: 'h09', datos: {guion: e.tipo}}]);
    },
    acciones: {
      guardar(ev, el, p) {
        const e = def(p), id = idLocal(e);
        const t = {id, tipo: e.tipo, hecha: true, linea: e.linea, cliente: e.cliente};
        if (e.tipo === 'tarea') { const d = diaElegido(e); Object.assign(t, {fecha: d.fecha, fechaISO: d.fechaISO, titulo: 'Call Jordi', texto: 'Your task · ' + d.texto.split(', ')[1]}); }
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
    titulo: 'Change the day',
    texto: 'The call to Jordi, at 10:00.',
    opciones: d => (((VETA.datos.diaA || {}).entendido || {}).tarea.dias || []).map(x => ({id: x.id, texto: x.texto})),
    valor: d => VETA.est.lee('a.dia.' + (d.cliente || 'jordi'), 'jue'),
    alElegir: (op, d) => { VETA.est.pon('a.dia.' + (d.cliente || 'jordi'), op.id); VETA.repinta(); }
  });
})();
