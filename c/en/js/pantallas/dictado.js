/* Veta demo · ronda 8 · pantallas · dictado.js · carril A (El día)
   A4b · Lo que he entendido: una tarea o una nota · #/entendido-dictado/<tarea|nota> (Dictar › “Una tarea” o “Algo de un cliente” › “Ya está”).
   Lo entendido en una tarjeta (qué) y una lista de lo que se toca (cuándo, que se cambia en la hoja a-dia, y “Lo que dijiste”), con el par
   “No es eso” / “Guardar”. “Guardar” se queda aquí con el final de siempre: “✓ Tarea guardada · 9:41 · Deshacer” y “Ir a Inicio” (D25c). */
(function () {
  'use strict';
  const M = VETA.modelo, r7 = VETA.r7, esc = VETA.esc;
  const def0 = p => ((VETA.datos.diaA || {}).entendido || {})[p.id] || ((VETA.datos.diaA || {}).entendido || {}).tarea;
  // dirección no ve el guion de la agente (Jordi, Pere): lo entendido es SIEMPRE lo que dictó ella misma, con su cliente si es suyo
  const def = p => {
    if (VETA.yo().papel !== 'direccion') return def0(p);
    const u = VETA.est.lee('a.ultimoDictado', null) || {}, tipo = p.id === 'nota' ? 'nota' : 'tarea', c = u.cliente && VETA.esSuyo(u.cliente) ? M.cliente(u.cliente) : null;
    const corto = c ? (c.corto || c.nombre) : '';
    return {tipo, que: String(u.texto || ''), texto: String(u.texto || ''), cliente: c ? c.id : '', dias: [], propio: true,
      pie: tipo === 'tarea' ? 'I keep an eye on it. I will put it in your calendar if you ask me.' : c ? 'It stays in their History.' : 'It stays in your notes.',
      linea: tipo === 'tarea' ? 'Saved · Your task' : c ? 'Saved · Note on ' + corto + '\'s page' : 'Saved · Your note'};
  };
  const idLocal = e => 'a-' + e.tipo + '-' + e.cliente;
  const diaElegido = e => {
    if (e.propio) return null; const d = VETA.est.lee('a.dia.' + e.cliente, 'jue'); return (e.dias || []).find(x => x.id === d) || (e.dias || [])[0]; };
  // el día y la hora de la tarea, con el formato de toda la app (“Jueves 26 de noviembre, 10:00”)
  const HORA = '10:00';
  const cuando = d => VETA.fecha.larga(d.fechaISO + 'T' + HORA);

  VETA.pantalla('A4b', {
    titulo: 'What I understood',
    // la promesa va sobre el botón: “La vigilo yo. Te la pongo en el calendario si me lo pides.” / “Queda en su Historia.”
    nota: p => (VETA.A.local(idLocal(def(p))) ? '' : def(p).pie),
    pinta: p => {
      const e = def(p), g = VETA.A.local(idLocal(e)), tarea = e.tipo === 'tarea';
      // guardada: el final de siempre (la tarea queda en “Lo que vigilo por ti”: la fila lleva allí)
      const hecho = g ? r7.hecho(Object.assign({texto: tarea ? 'Task saved' : 'Note saved', hora: g.hora, deshacer: 'deshacer-a4b'}, tarea ? {ir: 'espera'} : {})) : '';
      // lo entendido, en su tarjeta; debajo, solo lo que se toca
      const dijo = {nombre: 'What you said', hoja: 'h07', datos: {guion: e.tipo}};
      if (tarea) {
        const d = diaElegido(e);
        return hecho + r7.tarjeta({i: 1, de: 'A task', html: `<p>${esc(e.que)}</p>` + (g && d ? `<p>${esc(cuando(d))}</p>` : '')}) +
          r7.lista([g || !d ? null : {nombre: 'When', pasa: cuando(d), hoja: 'a-dia', datos: {cliente: e.cliente}}, dijo], {i: 2});
      }
      return hecho + r7.tarjeta({i: 1, de: 'A note', texto: e.texto}) +
        r7.lista([e.cliente ? {cara: e.cliente, nombre: (M.quien(e.cliente) || {}).nombre || '', ir: 'cliente/' + e.cliente} : null, dijo], {i: 2});
    },
    botonFijo: p => {
      const e = def(p);
      return VETA.A.local(idLocal(e)) ? r7.sigue() : r7.botones({texto: 'Save', accion: 'guardar'}, {texto: 'That\'s not it', hoja: 'h09', datos: {guion: e.tipo}});
    },
    acciones: {
      guardar(ev, el, p) {
        const e = def(p), id = idLocal(e);
        const t = {id, tipo: e.tipo, hecha: true, linea: e.linea, cliente: e.cliente};
        if (e.propio && e.tipo === 'tarea') { const iso = VETA.datos.fecha.hoyISO; Object.assign(t, {fecha: VETA.fecha.corta(iso), fechaISO: iso, titulo: e.que.length > 60 ? e.que.slice(0, 57) + '…' : e.que, texto: 'Your task'}); }
        else if (e.tipo === 'tarea') { const d = diaElegido(e); Object.assign(t, {fecha: VETA.fecha.corta(d.fechaISO), fechaISO: d.fechaISO, titulo: 'Call Jordi', texto: 'Your task · ' + HORA}); }
        VETA.A.ponLocal(t);
        VETA.repinta({hecho: true});   // el final se ve aquí: ✓ + “Deshacer” arriba e “Ir a Inicio” en el pie
      },
      'deshacer-a4b'(ev, el, p) { VETA.A.quitaLocal(idLocal(def(p))); VETA.repinta(); }
    }
  });

  // hoja para cambiar el día de la tarea
  VETA.hojaElegir('a-dia', {
    titulo: 'Change the day',
    texto: 'The call to Jordi.',
    opciones: d => (((VETA.datos.diaA || {}).entendido || {}).tarea.dias || []).map(x => ({id: x.id, texto: cuando(x)})),
    valor: d => VETA.est.lee('a.dia.' + (d.cliente || 'jordi'), 'jue'),
    alElegir: (op, d) => { VETA.est.pon('a.dia.' + (d.cliente || 'jordi'), op.id); VETA.repinta(); }
  });
})();
