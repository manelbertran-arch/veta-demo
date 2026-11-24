/* Veta demo · ronda 8 · pantallas · dictado.js · carril A (El día)
   A4b · Lo que he entendido: una tarea o una nota · #/entendido-dictado/<tarea|nota> (Dictar › “Una tarea” o “Algo de un cliente” › “Ya está”).
   Una lista de dos filas (qué y cuándo; el día se cambia en la hoja a-dia), la fila “Lo que dijiste” y el par “No es eso” / “Guardar”.
   “Guardar” vuelve a la pantalla de la que se venía, con “Guardada · … · Deshacer”. */
(function () {
  'use strict';
  const UI = VETA.UI, M = VETA.modelo, r7 = VETA.r7;
  const def = p => ((VETA.datos.diaA || {}).entendido || {})[p.id] || ((VETA.datos.diaA || {}).entendido || {}).tarea;
  const idLocal = e => 'a-' + e.tipo + '-' + e.cliente;
  const diaElegido = e => { const d = VETA.est.lee('a.dia.' + e.cliente, 'jue'); return (e.dias || []).find(x => x.id === d) || (e.dias || [])[0]; };
  const dijiste = g => { const u = VETA.est.lee('a.ultimoDictado', null); return VETA.A.mmss(u && u.guion === g ? u.seg : ((VETA.datos.diaA || {}).duracion || {})[g] || 0); };

  VETA.pantalla('A4b', {
    titulo: 'What I understood',
    // la promesa va sobre el botón: “La vigilo yo y la pongo en tu calendario.” / “Queda en su Historia.”
    nota: p => def(p).pie,
    pinta: p => {
      const e = def(p), g = VETA.A.local(idLocal(e));
      const hecho = g ? UI.lineaHecho({i: 0, texto: g.linea, hora: g.hora, boton: {texto: 'Undo', accion: 'deshacer-a4b'}}) : '';
      const filas = e.tipo === 'tarea' ? [{nombre: 'A task', pasa: e.que}, Object.assign({nombre: 'When', pasa: diaElegido(e).texto}, g ? {} : {hoja: 'a-dia', datos: {cliente: e.cliente}})]
        : [{nombre: 'A note', pasa: e.texto}, {cara: e.cliente, nombre: (M.quien(e.cliente) || {}).nombre || ''}];
      return hecho + r7.lista(filas, {i: 1}) + r7.lista([{nombre: 'What you said', dato: dijiste(e.tipo), hoja: 'h07', datos: {guion: e.tipo}}], {i: 2});
    },
    botonFijo: p => {
      const e = def(p);
      return VETA.A.local(idLocal(e)) ? '' : r7.botones({texto: 'Save', accion: 'guardar'}, {texto: 'That\'s not it', hoja: 'h09', datos: {guion: e.tipo}});
    },
    acciones: {
      guardar(ev, el, p) {
        const e = def(p), id = idLocal(e);
        const t = {id, tipo: e.tipo, hecha: true, linea: e.linea, cliente: e.cliente};
        if (e.tipo === 'tarea') { const d = diaElegido(e); Object.assign(t, {fecha: d.fecha, fechaISO: d.fechaISO, titulo: 'Call Jordi', texto: 'Your task · ' + d.texto.split(', ')[1]}); }
        VETA.A.ponLocal(t);
        VETA.atras();
        VETA.aviso(e.linea + '.', {deshacer: () => { VETA.A.quitaLocal(id); VETA.repinta(); }});
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
